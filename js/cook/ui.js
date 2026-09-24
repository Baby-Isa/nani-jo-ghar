/*
 * Cook with Nani: the HTML layer. Speech bubble, gist caption, greeting
 * choices, the order ticket and recipe dots in the sidebar, the count
 * badge, the done button, coins and stars, and the overlay panels.
 * Images never contain words; every word is here.
 */
(function (global) {
  const Cook = global.Cook;
  const $ = (s) => document.querySelector(s);
  const UI = (Cook.UI = {});

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  UI.esc = esc;

  /* ---------- building lines from data frames (never invented) ----------
   * A "phrase" is a list of word ids and numbers, e.g. [2, "cook-maani"] ->
   * "bo maani". A line is a frame from data.lines with {x} filled by a
   * phrase. */
  UI.phrase = function (parts) {
    const k = [];
    const e = [];
    parts.forEach((p) => {
      if (typeof p === "number") {
        k.push(`<span class="word">${esc(Cook.numWord(p))}</span>`);
        e.push(String(p));
      } else {
        k.push(`<span class="word">${esc(Cook.kutchi(p))}</span>`);
        e.push(Cook.english(p));
      }
    });
    return { k: k.join(" "), e: e.join(" "), plain: parts.map((p) => (typeof p === "number" ? Cook.numWord(p) : Cook.kutchi(p))).join(" ") };
  };
  UI.line = function (key, phrase) {
    const L = Cook.data.lines[key];
    if (!phrase) return { kutchi: esc(L.kutchi), english: L.english, plain: L.kutchi, audio: L.audio || null };
    return {
      kutchi: esc(L.kutchi).replace("{x}", phrase.k),
      english: L.english.replace("{x}", phrase.e),
      plain: L.kutchi.replace("{x}", phrase.plain),
      audio: null,
    };
  };
  UI.wordLine = function (id) {
    return { kutchi: `<span class="word">${esc(Cook.kutchi(id))}</span>`, english: Cook.english(id), plain: Cook.kutchi(id), audio: Cook.hasAudio(id) ? id : null };
  };
  UI.join = function (lines) {
    return {
      kutchi: lines.map((l) => l.kutchi).join(" "),
      english: lines.map((l) => l.english).join(" "),
      plain: lines.map((l) => l.plain).join(" "),
      audio: lines.length === 1 ? lines[0].audio : null,
      parts: lines,
    };
  };

  /* ---------- geometry: world (1600x900) -> position inside #stage ---------- */
  UI.worldToStage = function (x, y) {
    const canvas = document.querySelector("#game canvas");
    const stage = $("#stage").getBoundingClientRect();
    if (!canvas) return { x, y, s: 1 };
    const r = canvas.getBoundingClientRect();
    const s = r.width / 1600;
    return { x: r.left - stage.left + x * s, y: r.top - stage.top + y * s, s, rect: r, stage };
  };
  UI.worldToScreen = function (x, y) {
    const canvas = document.querySelector("#game canvas");
    const r = canvas.getBoundingClientRect();
    const s = r.width / 1600;
    return { x: r.left + x * s, y: r.top + y * s };
  };

  /* ---------- speech: a bubble by a character (service view), or Nani's
   * card in the sidebar (stations), where it can't cover anything ---------- */
  let englishOn = false;
  let bubbleAnchor = null;
  let lastLine = null;
  const bubble = () => $("#bubble");
  const card = () => $("#nani-card");

  function placeBubble() {
    const b = bubble();
    if (!bubbleAnchor || bubbleAnchor.badge || b.classList.contains("hidden")) return;
    const p = UI.worldToStage(bubbleAnchor.x, bubbleAnchor.y);
    const stageW = p.stage ? p.stage.width : 1000;
    const w = b.offsetWidth;
    let left = p.x - 26;
    if (bubbleAnchor.side === "left") left = p.x - w + 30;
    left = Cook.clamp(left, 8, stageW - w - 8);
    b.style.left = `${left}px`;
    b.style.top = `${p.y}px`;
    b.style.setProperty("--tail-x", `${Cook.clamp(p.x - left - 9, 14, w - 30)}px`);
  }
  UI.placeBubble = placeBubble;
  global.addEventListener("resize", () => setTimeout(placeBubble, 60));

  function fill(el, line) {
    el.querySelector(".bubble-kutchi").innerHTML = `${line.kutchi}<span class="draft" title="Draft spelling: to check with the family">*</span>`;
    const en = el.querySelector(".bubble-english");
    en.textContent = line.english;
    en.classList.toggle("hidden", !englishOn);
    el.querySelector(".bubble-en").classList.toggle("on", englishOn);
    const hasRec = line.audio && Cook.hasAudio(line.audio);
    el.querySelector(".bubble-play").classList.toggle("hidden", !hasRec);
    el.querySelector(".bubble-rec").classList.toggle("hidden", !!hasRec);
    el.classList.remove("hidden");
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
    return hasRec;
  }

  /**
   * Show a line. anchor: {x, y, side} in world px (tail points up at it), or
   * {badge: true} for Nani's card in the sidebar. Resolves when the recording
   * ends or, with no recording, after reading time. It stays up until the
   * next say()/hideBubble() unless opts.autoHide.
   */
  UI.say = async function (line, anchor, opts = {}) {
    lastLine = line;
    bubbleAnchor = anchor;
    let hasRec;
    if (anchor && anchor.badge) {
      bubble().classList.add("hidden");
      hasRec = fill(card(), line);
      card().classList.add("talk");
    } else {
      hasRec = fill(bubble(), line);
      placeBubble();
    }
    if (opts.onStart) opts.onStart();
    // Nothing is unskippable (Game Design): a tap anywhere that isn't a
    // button moves on. The line stays on screen to read.
    const token = Cook.run;
    let skip;
    const skipped = new Promise((resolve) => {
      skip = (ev) => {
        if (ev.target.closest && ev.target.closest("button, a, #overlay")) return;
        resolve();
      };
      document.addEventListener("pointerdown", skip, true);
    });
    try {
      await Promise.race([hasRec ? Cook.playRecording(line.audio) : Cook.wait(opts.ms || Cook.readMs(line.plain)), skipped]);
    } finally {
      document.removeEventListener("pointerdown", skip, true);
    }
    Cook.checkRun(token);
    card().classList.remove("talk");
    if (opts.autoHide) UI.hideBubble();
  };
  UI.hideBubble = function () {
    bubble().classList.add("hidden");
    card().classList.add("hidden");
    card().classList.remove("talk");
  };
  UI.showBadge = () => {};

  function wireBubble() {
    [bubble(), card()].forEach((b) => {
      b.querySelector(".bubble-en").addEventListener("click", (ev) => {
        ev.stopPropagation();
        englishOn = !englishOn;
        [bubble(), card()].forEach((x) => {
          x.querySelector(".bubble-english").classList.toggle("hidden", !englishOn);
          x.querySelector(".bubble-en").classList.toggle("on", englishOn);
        });
        placeBubble();
      });
      b.querySelector(".bubble-play").addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (lastLine && lastLine.audio) Cook.playRecording(lastLine.audio);
      });
    });
  }

  /* ---------- gist caption (English, for readers and the adult). On the
   * service view it sits across the top of the picture; at the stations the
   * how-to line goes in the sidebar so it never covers a thing to tap. ---------- */
  UI.gist = function (text, opts = {}) {
    if (opts.top) {
      const g = $("#gist");
      g.textContent = text;
      g.classList.remove("hidden");
    } else {
      const h = $("#how");
      h.textContent = text;
      h.classList.remove("hidden");
    }
  };
  UI.hideGist = () => {
    $("#gist").classList.add("hidden");
    $("#how").classList.add("hidden");
  };

  /* ---------- choices (greetings) ---------- */
  UI.choose = function (options, correctKey, opts = {}) {
    const box = $("#choices");
    box.innerHTML = "";
    box.classList.remove("hidden");
    let misses = 0;
    return new Promise((resolve) => {
      let glowTimer = null;
      const glowRight = () => {
        const btn = box.querySelector(`[data-key="${correctKey}"]`);
        if (btn) btn.classList.add("glow");
      };
      if (opts.glowAfter != null) glowTimer = setTimeout(glowRight, opts.glowAfter);
      Cook.shuffle(options).forEach((o) => {
        const btn = document.createElement("button");
        btn.dataset.key = o.key;
        btn.innerHTML = `<span>${o.kutchi}</span>`;
        // non-readers hear each reply before choosing (the At the door idea)
        if (o.audio && Cook.hasAudio(o.audio)) {
          const hear = document.createElement("span");
          hear.className = "hear";
          hear.setAttribute("role", "button");
          hear.setAttribute("aria-label", "Hear it");
          hear.textContent = "\u25B6";
          hear.addEventListener("click", (ev) => {
            ev.stopPropagation();
            Cook.unlockAudio();
            Cook.playRecording(o.audio);
          });
          btn.prepend(hear);
        }
        btn.addEventListener("click", () => {
          Cook.unlockAudio();
          if (o.key === correctKey) {
            clearTimeout(glowTimer);
            btn.classList.add("right");
            Cook.sfx.right();
            Cook.expect = null;
            setTimeout(() => {
              box.classList.add("hidden");
              box.innerHTML = "";
              resolve({ misses });
            }, 350);
          } else {
            misses++;
            btn.classList.remove("wrong");
            void btn.offsetWidth;
            btn.classList.add("wrong");
            Cook.sfx.soft();
            if (opts.onWrong) opts.onWrong(misses);
            if (misses >= 1) glowRight();
          }
        });
        box.appendChild(btn);
      });
      Cook.expect = { kind: "click", selector: `#choices button[data-key="${correctKey}"]`, wrong: `#choices button:not([data-key="${correctKey}"])` };
    });
  };

  /* ---------- sidebar: coins, stars, ticket, recipe ---------- */
  UI.setCoins = function (n, bump) {
    $("#coins").textContent = n;
    if (bump) {
      const p = $("#coins").parentElement;
      p.classList.remove("bump");
      void p.offsetWidth;
      p.classList.add("bump");
    }
  };
  UI.setStars = function (n, bump) {
    $("#stars").textContent = n;
    if (bump) {
      const p = $("#stars").parentElement;
      p.classList.remove("bump");
      void p.offsetWidth;
      p.classList.add("bump");
    }
  };

  let ticketEnglish = false;
  let ticketItems = [];
  UI.setTicket = function (who, items) {
    const c = Cook.data.customers[who];
    $("#ticket").classList.remove("hidden");
    $("#ticket-face").src = `assets/cook/characters/${who}-badge.webp`;
    $("#ticket-name").textContent = c ? c.name : who;
    ticketItems = items;
    renderTicket();
  };
  function renderTicket() {
    const ul = $("#ticket-list");
    ul.innerHTML = "";
    ticketItems.forEach((it, i) => {
      const li = document.createElement("li");
      li.className = (it.extra ? "extra " : "") + (it.done ? "done" : "");
      li.dataset.i = i;
      li.innerHTML = `${it.qty ? `<span class="qty">${it.qty} ×</span>` : ""}<span>${it.html}</span>${
        ticketEnglish ? `<span class="en">${esc(it.en)}</span>` : ""
      }`;
      ul.appendChild(li);
    });
    $("#ticket-en").classList.toggle("on", ticketEnglish);
  }
  UI.markTicket = function (i, done = true) {
    if (ticketItems[i]) ticketItems[i].done = done;
    renderTicket();
  };
  UI.hideTicket = () => $("#ticket").classList.add("hidden");
  UI.setPatience = function (frac) {
    const p = $("#patience");
    if (frac == null) return p.classList.add("hidden");
    p.classList.remove("hidden");
    p.querySelector("i").style.width = `${Math.round(Cook.clamp(frac, 0, 1) * 100)}%`;
    p.classList.toggle("low", frac < 0.35);
  };

  UI.setRecipe = function (html, stage, total) {
    $("#recipe").classList.remove("hidden");
    $("#recipe-name").innerHTML = html;
    $("#recipe-stage").textContent = stage || "";
    const dots = $("#recipe-dots");
    dots.innerHTML = "";
    for (let i = 0; i < total; i++) dots.appendChild(document.createElement("i"));
    UI.recipeProgress(0);
  };
  UI.recipeProgress = function (done) {
    const dots = [...document.querySelectorAll("#recipe-dots i")];
    dots.forEach((d, i) => {
      d.classList.toggle("on", i < done);
      d.classList.toggle("now", i === done);
    });
  };
  UI.hideRecipe = () => $("#recipe").classList.add("hidden");

  /* ---------- count badge, done button, toast ---------- */
  UI.count = function (n) {
    const b = $("#count-badge");
    b.classList.remove("hidden");
    b.querySelector(".count-digit").textContent = n;
    b.querySelector(".count-word").textContent = n >= 1 && n <= 5 ? Cook.numWord(n) : "";
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  };
  UI.hideCount = () => $("#count-badge").classList.add("hidden");

  let doneResolve = null;
  UI.done = function (opts = {}) {
    const b = $("#done-btn");
    b.classList.remove("hidden");
    b.classList.toggle("glow", !!opts.glow);
    return new Promise((resolve) => {
      doneResolve = resolve;
    });
  };
  UI.glowDone = (on) => $("#done-btn").classList.toggle("glow", on);
  UI.hideDone = function () {
    $("#done-btn").classList.add("hidden");
    doneResolve = null;
  };

  UI.toast = function (text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.remove("hidden");
    t.style.animation = "none";
    void t.offsetWidth;
    t.style.animation = "";
  };

  /* ---------- overlay panels ---------- */
  UI.panel = function (html, opts = {}) {
    const o = $("#overlay");
    o.classList.remove("hidden");
    o.classList.toggle("title-mode", !!opts.title);
    const p = $("#panel");
    p.innerHTML = html;
    p.scrollTop = 0;
    return p;
  };
  UI.closePanel = () => $("#overlay").classList.add("hidden");
  UI.panelOpen = () => !$("#overlay").classList.contains("hidden");

  UI.clearStage = function () {
    UI.hideBubble();
    UI.hideGist();
    UI.hideCount();
    UI.hideDone();
    $("#choices").classList.add("hidden");
    UI.showBadge(false);
  };

  UI.init = function () {
    wireBubble();
    $("#ticket-en").addEventListener("click", () => {
      ticketEnglish = !ticketEnglish;
      renderTicket();
    });
    $("#done-btn").addEventListener("click", () => {
      Cook.sfx.click();
      const r = doneResolve;
      UI.hideDone();
      if (r) r();
    });
    document.addEventListener("pointerdown", () => Cook.unlockAudio(), { passive: true });
  };
})(window);
