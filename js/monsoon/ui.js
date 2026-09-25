/*
 * Monsoon rush: the sidebar and the cards (greybox, HTML).
 *
 * One place for text (design 6.2): a call's words are written only in the
 * call pill in the sidebar, only while the call is live, and fade by the
 * word's stage: stage 1–2 text and a speaker, stage 3 a speaker and dots,
 * stage 4 no pill until you ask. English placeholders are grey italic and
 * never dotted out. Nothing is ever written in the scene.
 *
 * Hint ladder (6.3): replay (the first per storm is free; then it costs
 * the No-help star in Drizzle, time in Busy), reveal (the eye: the Kutchi
 * text) and translate (the English gist), each costing that call's ear.
 *
 * Stars show as they happen: after every wave the stars are worked out
 * on the storm so far (Calls.stars) and lit or dimmed.
 */
(function (global) {
  const M = global.Monsoon;
  const Calls = M.Calls;
  const UI = (M.UI = {});
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICON = {
    ear: `<svg viewBox="0 0 24 24"><path d="M8 9a4.5 4.5 0 1 1 9 0c0 2.6-2.4 3.4-3.1 5.3-.5 1.4-.4 3.7-2.7 3.7-1.5 0-2.4-1-2.4-2.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M11 9.5a1.8 1.8 0 1 1 3.3 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    umbrella: `<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 18 0z" fill="currentColor"/><path d="M12 12v6.5a2 2 0 0 1-4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 3v1" stroke="currentColor" stroke-width="2"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>`,
    tick: `<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    megaphone: `<svg viewBox="0 0 24 24"><path d="M4 10v4h3l8 4V6L7 10z" fill="currentColor"/><path d="M18 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 14l1 5h2l-1-5" fill="currentColor"/></svg>`,
    speaker: `<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
    mic: `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    drop: `<svg viewBox="0 0 24 24"><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" fill="currentColor"/></svg>`,
    finger: `<svg viewBox="0 0 24 24"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5l5 1.2c1 .3 1.6 1.3 1.4 2.3L17 20H9l-3-5c-.5-1 .6-2 1.5-1.4L9 15z" fill="currentColor"/></svg>`,
    lid: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="15" rx="9" ry="3.5" fill="currentColor"/><rect x="10.5" y="9" width="3" height="4" rx="1.2" fill="currentColor"/></svg>`,
  };
  UI.ICON = ICON;

  UI.init = function () {
    $("#btn-home").addEventListener("click", () => {
      if (M.run) M.run.stop();
      M.run = null;
      UI.clearCall();
      M.Lab.show();
    });
    $("#btn-help").addEventListener("click", () => {
      const pop = $("#help-pop");
      const r = M.run;
      pop.querySelector(".hp-text").textContent = r ? M.data.games[r.opts.game].goal : "Pick a game in the Rush lab.";
      pop.classList.toggle("hidden");
    });
    $("#help-pop").addEventListener("click", () => $("#help-pop").classList.add("hidden"));
    $("#call .c-say").addEventListener("click", () => UI.replay());
    $("#call .c-eye").addEventListener("click", () => UI.reveal("eye"));
    $("#call .c-tr").addEventListener("click", () => UI.reveal("tr"));
  };

  /* ---------------- the storm ---------------- */
  UI.startStorm = function (run) {
    const storm = run.storm;
    const set = M.data.star_sets.monsoon;
    const keys = storm.kind === "say" ? ["voice", "hand", storm.mode === "busy" ? null : "relaxed"] : ["ear", "hand", storm.mode === "busy" ? "busy" : "relaxed"];
    const row = $("#stars-row");
    row.innerHTML = "";
    keys.filter(Boolean).forEach((k) => {
      const s = set[k];
      const b = document.createElement("span");
      b.className = "star pending";
      b.dataset.star = k;
      b.title = s.tip;
      b.innerHTML = ICON[s.icon] || ICON.tick;
      row.appendChild(b);
    });
    $("#storm-name").textContent = `${M.data.games[run.opts.game].name} · level ${run.opts.level} · ${storm.mode === "busy" ? "Busy" : "Drizzle"}`;
    $("#placeholder-flag").classList.toggle("hidden", !storm.placeholder);
    UI.clearCall();
    UI.nani("");
    UI.hand(0);
    UI.count(null);
    $("#readout").classList.toggle("hidden", !M.Lab || !M.Lab.readout);
    UI.readout(run);
  };

  /** Update the stars on the storm so far. */
  UI.waveDone = function (run, rec) {
    const res = Calls.stars(run.session);
    const planned = run.storm.waves.length;
    const played = run.session.results.length;
    const final = run.session.left() === 0;
    document.querySelectorAll("#stars-row .star").forEach((b) => {
      const k = b.dataset.star;
      const on = !!res.stars[k];
      const was = b.classList.contains("lit");
      b.classList.toggle("lit", on);
      b.classList.toggle("pending", !on && !final);
      b.classList.toggle("lost", !on && final);
      if (on && !was && played >= Math.min(planned, 4)) M.FX.star();
    });
    UI.readout(run);
  };

  /* ---------------- the call pill ---------------- */
  UI.clearCall = function () {
    const c = $("#call");
    c.classList.add("idle");
    c.querySelector(".call-text").innerHTML = "";
    UI.callWave = null;
  };
  UI.call = function (run, wave) {
    const c = $("#call");
    UI.callWave = wave;
    c.classList.remove("idle");
    if (!wave.say.length) {
      // the child is the caller (You call it): no call pill
      c.querySelector(".call-text").innerHTML = "";
      c.classList.add("idle", "none");
      return;
    }
    c.classList.remove("none");
    const lines = wave.say.map((p) => M.lineFor(p));
    // the pill fades by the stage of the words that decide the call
    const deciding = wave.targets.flatMap((t) => Object.values(t.slots));
    const stage = Math.min(...deciding.map((id) => M.stageOf(id)));
    const anyPh = lines.some((l) => !l.k);
    const show = stage <= 2 || anyPh || wave.revealed;
    // only the deciding words fade: "Hedo!" and the linkers stay written
    const decides = (l) => l.words.some((id) => deciding.includes(id));
    const html = lines
      .map((l) => {
        if (!l.k) return `<span class="ph">${esc(l.en)}</span>`;
        if (show || !decides(l)) return `<span class="k${l.draft ? " draft" : ""}">${esc(l.k)}</span>`;
        return `<span class="dots">•••</span>`;
      })
      .join(" ");
    const tr = wave.translated ? `<div class="gist">${esc(lines.map((l) => l.en).join(" "))}</div>` : "";
    c.querySelector(".call-text").innerHTML = stage >= 4 && !anyPh && !wave.revealed ? `<span class="ask">tap the speaker to hear it</span>${tr}` : html + tr;
    c.dataset.stage = stage;
  };
  UI.replay = function () {
    const r = M.run;
    const w = UI.callWave;
    if (!r || !w || !w.say.length) return;
    const h = r.session.help;
    const free = (M.data.hints || {}).freeReplays || 1;
    if (h.freeUsed >= free) h.replays++;
    else h.freeUsed = (h.freeUsed || 0) + 1;
    (async () => {
      for (const p of w.say) await M.say(p);
    })();
  };
  UI.reveal = function (which) {
    const r = M.run;
    const w = UI.callWave;
    if (!r || !w || !w.say.length) return;
    w.helped = true; // costs this call's ear
    if (which === "eye") {
      w.revealed = true;
      r.session.help.reveals++;
    } else {
      w.translated = true;
      r.session.help.translations++;
    }
    UI.call(r, w);
  };

  /* ---------------- Nani, the hand, the tally ---------------- */
  UI.nani = function (text, opts) {
    const n = $("#nani-card .say-slot");
    n.innerHTML = text ? (opts && opts.ph ? `<span class="ph">${esc(text)}</span>` : esc(text)) : "";
    $("#nani-card").classList.toggle("quiet", !text);
  };
  UI.hand = function (n, total) {
    const h = $("#hand");
    h.innerHTML = "";
    for (let i = 0; i < (total || n); i++) {
      const s = document.createElement("span");
      s.className = "lid-icon" + (i < n ? "" : " used");
      s.innerHTML = ICON.lid;
      h.appendChild(s);
    }
  };
  UI.count = function (n) {
    const b = $("#count-badge");
    b.classList.toggle("hidden", n == null);
    b.querySelector(".count-digit").textContent = n == null ? "" : String(n);
  };
  UI.toast = function (text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.remove("hidden");
    clearTimeout(UI._toast);
    UI._toast = setTimeout(() => t.classList.add("hidden"), 1600);
  };

  /* ---------------- the intro card (Wave 5 rule) ---------------- */
  UI.intro = function (run) {
    return new Promise((resolve) => {
      const storm = run.storm;
      const box = $("#intro");
      const game = M.data.games[run.opts.game];
      const seq = storm.kind === "count" ? ["ear", "drop", "lid"] : storm.kind === "say" ? ["eye", "mic", "lid"] : ["ear", "finger", "lid"];
      const newLines = storm.newWords.slice(0, 3).map((id) => {
        const w = M.words[id] || {};
        return `<div class="ic-word"><button type="button" class="ic-hear" data-w="${esc(id)}" aria-label="Hear it">${ICON.speaker}</button>${w.kutchi ? `<span class="k">${esc(w.kutchi)}</span>` : `<span class="ph">${esc(w.english || id)}</span>`}</div>`;
      });
      box.querySelector(".ic-card").innerHTML = `
        <div class="ic-head"><img class="ic-face" src="assets/cook/characters/nani-badge.webp" alt="Nani"><div class="ic-name">${esc(game.name)}</div></div>
        <div class="ic-seq">${seq.map((k) => `<span class="ic-step">${ICON[k]}</span>`).join('<span class="ic-arrow">→</span>')}</div>
        ${newLines.length ? `<div class="ic-new">${newLines.join("")}</div>` : ""}
        ${storm.placeholder ? `<div class="ic-ph">Some words are English placeholders: not yet a Kutchi test</div>` : ""}
        <div class="ic-go">Tap to start</div>`;
      box.classList.remove("hidden");
      box.querySelectorAll(".ic-hear").forEach((b) =>
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          M.clock.unlock && M.clock.unlock();
          M.say({ word: b.dataset.w });
        })
      );
      const go = () => {
        box.removeEventListener("click", go);
        box.classList.add("hidden");
        M.clock.unlock && M.clock.unlock();
        Cook.unlockAudio && Cook.unlockAudio();
        resolve();
      };
      box.addEventListener("click", go);
    });
  };

  /* ---------------- the result card and word review ---------------- */
  UI.result = function (run, res) {
    const storm = run.storm;
    const set = M.data.star_sets.monsoon;
    const keys = storm.kind === "say" ? ["voice", "hand"] : ["ear", "hand"];
    keys.push(storm.mode === "busy" ? (storm.kind === "say" ? null : "busy") : "relaxed");
    const starHTML = keys
      .filter(Boolean)
      .map((k) => `<span class="star big ${res.stars[k] ? "lit" : "lost"}" title="${esc(set[k].tip)}">${ICON[set[k].icon]}<small>${esc(set[k].name)}</small></span>`)
      .join("");
    // pocket money (section 7): 5 for helping, +5 understood, +3 kept dry, +3 quick/no help, +1 per five-in-a-row (max 5)
    let streak = 0;
    let best = 0;
    run.session.results.forEach((rec) =>
      Object.values(rec.grade.targets).forEach((r) => {
        streak = r.outcome === "heard" ? streak + 1 : r.outcome === "taught" || r.outcome === "retry" ? streak : 0;
        best = Math.max(best, streak);
      })
    );
    const money = 5 + (res.stars.ear || res.stars.voice ? 5 : 0) + (res.stars.hand ? 3 : 0) + (res.stars.busy || res.stars.relaxed ? 3 : 0) + Math.min(5, Math.floor(best / 5));
    // the word review: every word called, with its English, heard or missed (with a replay)
    const words = {};
    run.session.results.forEach((rec) =>
      rec.wave.targets.forEach((t) => {
        const r = rec.grade.targets[t.id];
        Object.values(t.slots).forEach((id) => {
          const w = (words[id] = words[id] || { id, heard: 0, missed: 0, taught: 0 });
          if (r.outcome === "taught") w.taught++;
          else if (r.graded === "heard" && r.outcome !== "helped") w.heard++;
          else if ((r.blame || []).includes(id) || r.outcome === "helped" || (storm.kind === "say" && !r.voice)) w.missed++;
          else w.heard++;
        });
      })
    );
    const rows = Object.values(words)
      .map((w) => {
        const d = M.words[w.id] || {};
        const mark = w.missed ? `<span class="wr-miss">missed ${w.missed}</span>` : w.taught && !w.heard ? `<span class="wr-new">new</span>` : `<span class="wr-ok">✓</span>`;
        return `<li><button type="button" class="wr-hear" data-w="${esc(w.id)}" aria-label="Hear it">${ICON.speaker}</button><span class="${d.kutchi ? "k" : "ph"}">${esc(d.kutchi || d.english || w.id)}</span><span class="en">${esc(d.english || "")}</span>${mark}</li>`;
      })
      .join("");
    const t = res.tally;
    const summary = storm.kind === "say" ? `Ali understood ${t.voiceOk} of ${t.voiceCalls} calls` : `Heard ${t.heard} of ${t.tested} tested calls · saved ${t.saved} of ${t.targets}`;
    const panel = $("#panel");
    panel.innerHTML = `
      <div class="result">
        <h2>The storm has passed</h2>
        <div class="r-stars">${starHTML}</div>
        <p class="r-sum">${esc(summary)}</p>
        ${res.placeholder ? `<p class="r-ph">Not yet a Kutchi test: some words are English placeholders.</p>` : ""}
        <p class="r-money"><i class="coin"></i> ${money} pocket money</p>
        <ul class="word-review">${rows}</ul>
        <div class="r-btns"><button type="button" class="btn primary" id="r-again">Again</button><button type="button" class="btn" id="r-lab">Rush lab</button></div>
      </div>`;
    panel.querySelectorAll(".wr-hear").forEach((b) => b.addEventListener("click", () => M.say({ word: b.dataset.w })));
    $("#overlay").classList.remove("hidden");
    $("#r-again").addEventListener("click", () => {
      $("#overlay").classList.add("hidden");
      M.play(Object.assign({}, run.opts, { seed: undefined }));
    });
    $("#r-lab").addEventListener("click", () => {
      $("#overlay").classList.add("hidden");
      M.Lab.show();
    });
    UI.clearCall();
  };

  /* ---------------- the lab readout ---------------- */
  UI.readout = function (run) {
    const box = $("#readout");
    if (!box || box.classList.contains("hidden")) return;
    const s = run.storm;
    const tgt = {};
    const out = {};
    const rts = [];
    run.session.results.forEach((rec) =>
      rec.wave.targets.forEach((t) => {
        const key = t.n != null ? `${(M.words[t.word] || {}).kutchi || t.word}×${t.n}` : t.word;
        tgt[key] = (tgt[key] || 0) + 1;
        const r = rec.grade.targets[t.id];
        out[r.outcome] = (out[r.outcome] || 0) + 1;
        if (r.rt != null) rts.push(r.rt);
      })
    );
    const m = Calls.median(rts);
    box.innerHTML = `<b>Lab</b> seed ${s.seed} · ${s.candidates.length} candidates · wave ${run.session.results.length}/${s.waves.length}${run.bot ? ` · bot <b>${esc(run.bot.name)}</b>` : ""}
      <div>targets: ${Object.entries(tgt).map(([k, v]) => `${esc((M.words[k] || {}).kutchi || (M.words[k] || {}).english || k)} ${v}`).join(", ") || "–"}</div>
      <div>outcomes: ${Object.entries(out).map(([k, v]) => `${k} ${v}`).join(", ") || "–"}</div>
      <div>median reaction: ${m == null ? "–" : m.toFixed(2) + " s"}</div>`;
  };
})(window);
