/*
 * Who did it?: the page around the scene (greybox). The 1600x900 world and
 * its scaling, the sofa scene from data/scenes/sofa.json, the speaker card,
 * the case ladder (rows are speaker · text/••• · reveal · translate, never
 * pictures), the sweet box, and the intro / result cards.
 *
 * Language: code holds no Kutchi. A line is a frame from data/who.json
 * lines (k when the family gave it, else e, shown grey italic) with the slot
 * word from data/cook.json words (bold; grey italic when it's a placeholder,
 * starred when it's a draft). Audio is the family's recording of the word if
 * there is one, else the placeholder voice (Cook.speak), else nothing.
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const UI = (Who.UI = {});
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  UI.scale = 1;
  UI.fit = function () {
    const st = $("stage");
    const w = st.clientWidth;
    const h = st.clientHeight;
    const k = Math.min(w / 1600, h / 900);
    UI.scale = k;
    UI.offset = [(w - 1600 * k) / 2, (h - 900 * k) / 2];
    $("world").style.transform = `translate(${UI.offset[0]}px, ${UI.offset[1]}px) scale(${k})`;
  };
  // world design coords -> client (for tests and the lens)
  UI.toClient = function (x, y) {
    const r = $("stage").getBoundingClientRect();
    return { x: r.left + UI.offset[0] + x * UI.scale, y: r.top + UI.offset[1] + y * UI.scale };
  };
  UI.toWorld = function (cx, cy) {
    const r = $("stage").getBoundingClientRect();
    return { x: (cx - r.left - UI.offset[0]) / UI.scale, y: (cy - r.top - UI.offset[1]) / UI.scale };
  };

  /* ------------------------------------------------------------ the scene */
  UI.drawScene = function (scene, opts) {
    const w = $("world");
    w.innerHTML = "";
    const add = (cls, style, html) => {
      const d = document.createElement("div");
      d.className = cls;
      Object.assign(d.style, style);
      if (html) d.innerHTML = html;
      w.appendChild(d);
      return d;
    };
    add("wall", { background: scene.wall.colour });
    add("floor", { top: `${scene.wall.floorY}px`, background: scene.wall.floorColour });
    const t = scene.sideTable;
    add("side-table", { left: `${t.x - t.w / 2}px`, top: `${t.y}px`, width: `${t.w}px`, height: `${t.h}px` });
    const o = scene.occluder;
    const sofa = add("sofa", { left: `${o.x[0]}px`, top: `${o.y}px`, width: `${o.x[1] - o.x[0]}px`, height: `${900 - o.y}px`, background: o.colour });
    sofa.innerHTML = `<div class="ledge" style="background:${o.ledge}"></div>`;
    add("sofa-arm", { left: `${o.x[0] - 30}px`, top: `${o.y + 80}px`, width: `${o.arm}px`, height: `${900 - o.y - 80}px`, background: o.ledge });
    add("sofa-arm", { left: `${o.x[1] - o.arm + 30}px`, top: `${o.y + 80}px`, width: `${o.arm}px`, height: `${900 - o.y - 80}px`, background: o.ledge });
    // the speaker at the left: Nani (clues), or the listener (Tell Ali)
    const sp = opts && opts.listener ? scene.listener : scene.nani;
    const person = { grey: { shape: "person", h: sp.h / 600, fill: sp.fill }, fixed: { age: opts && opts.listener ? "young" : "old" } };
    const svg = Who.Suspect.svg(person, { gender: opts && opts.listener ? "m" : "f", wears: opts && opts.listener ? null : "glasses" });
    add("nani", { left: `${sp.x - 90}px`, top: `${sp.base - sp.h}px` }, svg);
    return w;
  };

  UI.bubble = function (x, y, html, ms) {
    const b = document.createElement("div");
    b.className = "say-bubble";
    b.innerHTML = html;
    b.style.left = `${x}px`;
    b.style.top = `${y}px`;
    $("world").appendChild(b);
    b.style.transform = "translateX(-50%)";
    setTimeout(() => b.remove(), ms || 1500);
    return b;
  };

  /* ------------------------------------------------------------- language */
  UI.P = null;
  UI.wordHTML = function (id, hidden) {
    const w = UI.P.word(id);
    if (hidden) return `<span class="kw">•••</span>`;
    if (!w.real) return `<span class="kw ph">${esc(w.english)}</span>`;
    return `<span class="kw${w.draft ? " draft" : ""}">${esc(w.kutchi)}</span>`;
  };
  UI.lineHTML = function (key, wordId, opts) {
    opts = opts || {};
    const L = UI.P.who.lines[key] || { e: key };
    const x = wordId ? UI.wordHTML(wordId, opts.hidden) : "";
    if (L.k) return `<span>${esc(L.k).replace("{x}", x)}</span>`;
    const parts = String(L.e).split("{x}");
    return parts.map((p) => (p ? `<span class="en">${esc(p)}</span>` : "")).join(x);
  };
  UI.gist = function (key, wordId) {
    const L = UI.P.who.lines[key] || { e: key };
    const en = L.en || L.e;
    return en.replace("{x}", wordId ? UI.P.word(wordId).english : "");
  };

  // play the slot word: the family's recording, else the placeholder voice
  UI.mute = new URLSearchParams(global.location.search).get("mute") === "1"; // tests only
  UI.playWord = async function (id) {
    if (!id || UI.mute) return false;
    const w = UI.P.word(id);
    const rec = global.Cook && Cook.playRecording(id);
    if (rec) return rec;
    if (w.real && global.Cook && Cook.hasVoice(w.kutchi)) return Cook.speak(w.kutchi);
    return false;
  };

  UI.speaker = function (who) {
    $("speaker-face").className = `nc-face ${who === "ali" ? "ali" : ""}`;
  };
  // say a line in the speaker card; resolves when it's been heard or read
  UI.say = async function (key, wordId, opts) {
    opts = opts || {};
    $("nani-card").querySelector(".say-slot").innerHTML = UI.lineHTML(key, wordId, opts);
    const L = UI.P.who.lines[key] || {};
    const t0 = Date.now();
    let played = false;
    if (!UI.mute && L.k && global.Cook && Cook.hasVoice(L.k.replace("{x}", ""))) played = await Cook.speak(L.k);
    if (wordId && !opts.silentWord) played = (await UI.playWord(wordId)) || played;
    const plain = $("nani-card").innerText || "";
    const need = played ? 500 : Cook.readMs(plain);
    const spent = Date.now() - t0;
    if (spent < need) await Cook.wait(need - spent);
  };

  /* ------------------------------------------------------------ the ladder */
  UI.clearLadder = () => ($("ladder").innerHTML = "");
  // a clue row; stage decides text or dots (6.3). hooks: replay, reveal, translate
  UI.addRow = function (clue, stage, hooks) {
    const row = document.createElement("div");
    row.className = "row current";
    const hidden = stage >= 3 && UI.P.word(clue.word).real;
    row.innerHTML = `<span class="dot"></span><button class="rp" title="Say it again" aria-label="Say it again">&#128264;</button><span class="rt">${UI.lineHTML(clue.line, clue.word, { hidden })}</span>` +
      (hidden ? `<button class="rv" title="Show the words (costs the ear for this clue)" aria-label="Show">&#128065;</button>` : "") +
      `<button class="tr" title="What does it mean? (costs the ear for this clue)" aria-label="Translate">EN</button>`;
    row.querySelector(".rp").onclick = () => hooks.replay();
    const rv = row.querySelector(".rv");
    if (rv)
      rv.onclick = () => {
        hooks.help(4);
        row.querySelector(".rt").innerHTML = UI.lineHTML(clue.line, clue.word);
        rv.remove();
      };
    row.querySelector(".tr").onclick = () => {
      hooks.help(5);
      row.querySelector(".rt").innerHTML = `<span class="en">${esc(UI.gist(clue.line, clue.word))}</span>`;
    };
    $("ladder").querySelectorAll(".row").forEach((r) => r.classList.remove("current"));
    $("ladder").appendChild(row);
    return row;
  };
  UI.rowResult = (row, ok) => row && row.classList.add(ok ? "ok" : "missed");

  /* ------------------------------------------------------------ sweet box */
  UI.box = function (n) {
    const b = $("box");
    b.classList.toggle("hidden", !n);
    b.innerHTML = Array.from({ length: n || 0 }, (_, k) => `<span class="sweet" data-k="${k}"></span>`).join("");
  };
  UI.boxNow = (k) => $("box").querySelectorAll(".sweet").forEach((s, j) => s.classList.toggle("now", j === k));
  UI.boxDone = (k) => {
    const s = $("box").querySelectorAll(".sweet")[k];
    if (s) s.classList.add("done"), s.classList.remove("now");
  };

  /* ------------------------------------------------------ overlay cards */
  UI.card = function (html, buttons) {
    return new Promise((resolve) => {
      $("panel").innerHTML = html + `<div class="lab-btns" style="justify-content:center">${buttons.map((b) => `<button id="${b.id}" class="btn ${b.primary ? "primary" : ""}" type="button">${b.label}</button>`).join("")}</div>`;
      $("overlay").classList.remove("hidden");
      for (const b of buttons)
        $(b.id).onclick = () => {
          if (global.Cook) Cook.unlockAudio();
          $("overlay").classList.add("hidden");
          resolve(b.id);
        };
    });
  };
  UI.hideCard = () => $("overlay").classList.add("hidden");

  UI.facesHTML = function (c) {
    return `<div class="faces">${c.suspects.map((s) => Who.Suspect.svg(UI.P.who.people[s.id], s.attrs, { scale: 260 })).join("")}</div>`;
  };

  const STAR_ICON = { ear: "&#128066;", hand: "&#128083;", relaxed: "&#10004;&#65039;", voice: "&#127908;" };
  UI.results = function (c, s, words) {
    const set = UI.P.who.star_set;
    const star = (key, on, label, grey) => `<div class="star ${on ? "on" : ""} ${grey ? "grey" : ""}"><i>${STAR_ICON[key]}</i>${label}</div>`;
    let stars = "";
    if (s.ear === "untested") stars += star("ear", false, "Not tested this time", true);
    else stars += star("ear", s.ear === true, set.ear.name);
    stars += star("hand", s.craft, set.hand.name);
    stars += star("relaxed", s.tick, set.relaxed.name);
    if (s.voice !== null) stars += star("voice", s.voice, set.voice.name);
    const review = words
      .map((id) => {
        const w = UI.P.word(id);
        return `<tr><td>${UI.wordHTML(id)}</td><td class="en">${esc(w.english)}</td><td><button class="btn wr" data-w="${id}" type="button">&#128264;</button></td></tr>`;
      })
      .join("");
    const html = `<h2>Case closed!</h2><div class="starrow">${stars}</div>` +
      `<table class="review">${review}</table>` +
      `<div class="pill" style="margin:6px auto"><i class="coin-dot"></i>+${s.coins} pocket money</div>`;
    const p = UI.card(html, [{ id: "who-next", label: "Next case", primary: true }]);
    $("panel").querySelectorAll(".wr").forEach((b) => (b.onclick = () => UI.playWord(b.dataset.w)));
    return p;
  };

  UI.toast = function (text) {
    UI.bubble(800, 60, esc(text), 1600);
  };
  UI.esc = esc;
})(window);
