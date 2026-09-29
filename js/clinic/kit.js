/*
 * The clinic's screen kit (DOM; no Phaser): the pieces every stage and
 * every healing game shares, so the screen looks and behaves the same all
 * the way through a patient (docs/UX-PRINCIPLES.md s1-s4, s11, s13).
 *
 *   Kit.Card     the instruction card (the master): rows that tick when a
 *                step closes, a throbbing hint, one speaker (reads the rows
 *                in order, lighting each), the light bulb's English flip
 *   Kit.Bulb     the one light bulb: English for 5/3/2 s by level; counts a hint
 *   Kit.Tally    pictures with how many you did (never the target)
 *   Kit.Tray     the fixed-slot tray of dishes (the pharmacy fills it, heal uses it)
 *   Kit.Voice    say a line: the family's audio when there is some, else the
 *                device voice (quietly skipped in tests), with a bubble
 *   Kit.icon     an item's picture: rough art if data/clinic/rough-art.json has it, else a greybox disc
 *   Kit.text     how a word shows: Kutchi, or the English placeholder in grey italic
 *
 * Words: {kutchi, english, placeholder?}. A row's `kutchi` may mix real
 * Kutchi with bracketed placeholders ("Ne poi [cloth]"): the brackets show
 * as grey italic English. Never invent Kutchi.
 */
(function (global) {
  "use strict";
  const Clinic = (global.Clinic = global.Clinic || {});
  const Kit = (Clinic.Kit = Clinic.Kit || {});

  const h = (Kit.h = function (tag, cls, parent, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  });
  Kit.wait = (ms) => new Promise((r) => setTimeout(r, Kit.fast ? Math.min(ms, 60) : ms));

  /* ---------------- words ---------------- */
  /** A word or row as DOM: Kutchi in plain text, placeholders grey italic. */
  Kit.text = function (w, parent) {
    const span = h("span", "cl-words", parent);
    if (!w) return span;
    const k = w.kutchi;
    if (!k || w.placeholder === true) {
      h("span", "ph", span, w.english || "");
      return span;
    }
    String(k)
      .split(/(\[[^\]]*\])/)
      .filter(Boolean)
      .forEach((seg) => {
        if (seg.startsWith("[")) h("span", "ph", span, seg.slice(1, -1).replace(/^EN:\s*/, ""));
        else h("span", "ku", span, seg);
      });
    return span;
  };
  /** Plain text of a word for the device voice (English for placeholders). */
  Kit.plain = (w) => {
    if (!w) return "";
    if (!w.kutchi || w.placeholder === true) return w.english || "";
    return String(w.kutchi).replace(/\[(?:EN:\s*)?([^\]]*)\]/g, "$1");
  };

  /* ---------------- art ---------------- */
  Kit.art = null; // data/clinic/rough-art.json, once loaded
  Kit.root = ""; // path prefix to the site root ("../" from lab/)
  Kit.url = (u) => (global.njgV ? global.njgV(Kit.root + u) : Kit.root + u);
  Kit.loadJSON = async function (path) {
    try {
      const r = await fetch(Kit.url(path), { cache: "no-cache" });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      return null;
    }
  };
  Kit.loadArt = async function () {
    const a = await Kit.loadJSON("data/clinic/rough-art.json");
    Kit.art = a || null;
    return Kit.art;
  };
  /** The sprite path for an id (an item, a kind, a scene piece) or null. Accepts {sprites: {id: path}} or {id: path} or {id: {src}}. */
  Kit.sprite = function (id) {
    const a = Kit.art;
    if (!a || !id) return null;
    const pools = [a.sprites, a.items, a.people, a.kinds, a.scene, a.props, a];
    const find = (key) => {
      for (const p of pools) {
        if (!p || typeof p !== "object") continue;
        const v = p[key];
        if (typeof v === "string" && /\.(png|webp|svg|jpg)$/i.test(v)) return v;
        if (v && typeof v === "object" && (v.src || v.file || v.path)) return v.src || v.file || v.path;
      }
      return null;
    };
    // the manifest's aliases (care-*, tool-*, body-*, Kutchi item names), then an item's own `sprite` or `same`
    const d = Kit.ITEMS[id] || {};
    return find(id) || (a.alias && a.alias[id] && find(a.alias[id])) || (d.sprite && find(d.sprite)) || (d.same && d.same !== id ? Kit.sprite(d.same) : null);
  };
  /** A room background (the manifest's `rooms`): "waiting" | "exam" | "pharmacy". */
  Kit.room = function (name) {
    const a = Kit.art;
    const id = a && a.rooms && a.rooms[name];
    return id ? Kit.sprite(id) : null;
  };
  /** A patient kind's sprite for a mood (neutral, ouch, giggle, relief, happy, wave), or null. */
  Kit.person = function (kind, mood) {
    const a = Kit.art;
    const p = a && a.patients && a.patients[kind];
    if (!p) return null;
    return Kit.sprite(p[mood] || p.neutral);
  };

  Kit.ITEMS = {}; // filled from data/clinic.json items
  Kit.COLOURS = {
    red: "#d23b3b", blue: "#3b6fd2", green: "#3fa35b", yellow: "#f0c43a", white: "#f4f1ea", black: "#33333b",
    pink: "#e77fb0", orange: "#e8872f", purple: "#8e5bb5", brown: "#8a5a3a",
  };
  /** Split an item id into its base and colour: "drops-blue" -> {base: "drops", colour: "blue"}. */
  Kit.itemParts = function (id) {
    const s = String(id || "");
    if (Kit.ITEMS[s]) return { base: s, colour: Kit.ITEMS[s].colour || null };
    const m = /^(.*)-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/.exec(s);
    if (m) return { base: m[1], colour: m[2] };
    return { base: s, colour: null };
  };
  Kit.itemInfo = function (id) {
    const it = typeof id === "object" ? id : { id };
    const { base, colour } = Kit.itemParts(it.id);
    let d = Kit.ITEMS[it.id] || Kit.ITEMS[base] || {};
    if (d.same && Kit.ITEMS[d.same]) d = Object.assign({}, Kit.ITEMS[d.same], d);
    return Object.assign({ english: String(base).replace(/-/g, " "), kutchi: null, glyph: "•" }, d, {
      id: it.id,
      base,
      colour: it.colour || d.colour || colour || null,
      size: it.size || d.size || null,
    });
  };
  /**
   * Clinic v2 stand-ins (flat shapes, no new art: docs/modes/clinic-v2-design-sheets.md "Prototype first"):
   * an item whose data names a `standin` draws it instead of its rough sprite (the apple for the lolly,
   * the filling's tube, a torch that looks like a torch); the four feeling faces; the doctor's silhouette.
   */
  Kit.STANDIN = {
    apple: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 18c-4-4-10-5-15-2-8 5-8 18-3 28 4 8 9 12 13 11 2 0 3-1 5-1s3 1 5 1c4 1 9-3 13-11 5-10 5-23-3-28-5-3-11-2-15 2z" fill="#d23b3b"/><path d="M22 22c-4 3-5 9-4 13" stroke="#f08a80" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 18c0-5 1-9 4-12" stroke="#6b4a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M35 12c5-5 12-5 15-3-3 5-9 7-15 3z" fill="#3fa35b"/></svg>',
    tube: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="24" width="36" height="16" rx="3" fill="#f4f1ea" stroke="#9aa0a8" stroke-width="2.5"/><path d="M8 24l-4 3v10l4 3z" fill="#c9ced6" stroke="#9aa0a8" stroke-width="2"/><rect x="44" y="27" width="7" height="10" rx="1.5" fill="#3b6fd2"/><rect x="51" y="29" width="8" height="6" rx="1.5" fill="#3b6fd2"/><rect x="14" y="29" width="22" height="6" rx="2" fill="#bfe0d7"/></svg>',
    torch: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M44 22l14-8v36l-14-8z" fill="#fff4b0" opacity=".9"/><rect x="8" y="26" width="26" height="12" rx="3" fill="#3b6fd2"/><path d="M34 22h10v20H34z" fill="#2d5aa8"/><rect x="44" y="24" width="3" height="16" fill="#ffe26a"/><rect x="16" y="23" width="7" height="4" rx="1.5" fill="#e2a33a"/></svg>',
  };
  Kit.FEEL = {
    happy: { fill: "#f7c948", mouth: '<path d="M20 40q12 12 24 0" stroke="#5a3a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
    sad: { fill: "#9cc3e6", mouth: '<path d="M20 46q12-10 24 0" stroke="#2d4a6a" stroke-width="3.5" fill="none" stroke-linecap="round"/>', extra: '<path d="M22 30q-2 6 0 8q2-2 0-8z" fill="#3b6fd2"/>' },
    hot: { fill: "#f08a5d", mouth: '<ellipse cx="32" cy="44" rx="6" ry="4" fill="#7a2a1a"/>', extra: '<path d="M48 14q-3 6 0 8q3-2 0-8z" fill="#3b9ad2"/><path d="M54 24q-3 5 0 7q3-2 0-7z" fill="#3b9ad2"/>' },
    cold: { fill: "#bfe3f2", mouth: '<path d="M20 44l4-3 4 3 4-3 4 3 4-3 4 3" stroke="#2d4a6a" stroke-width="2.5" fill="none"/>', extra: '<path d="M6 10l5 5M11 10l-5 5M52 48l5 5M57 48l-5 5M8 44l4 4M12 44l-4 4" stroke="#fff" stroke-width="2.5"/>' },
  };
  /** A flat feeling face (happy, sad, hot, cold): the same for everyone (CQ6). */
  Kit.feelingFace = function (f, parent) {
    const d = h("div", `cl-feel feel-${f}`, parent);
    const F = Kit.FEEL[f] || Kit.FEEL.happy;
    d.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="${F.fill}" stroke="rgba(0,0,0,.12)" stroke-width="2"/><circle cx="23" cy="26" r="3.5" fill="#2a2522"/><circle cx="41" cy="26" r="3.5" fill="#2a2522"/>${F.mouth}${F.extra || ""}</svg>`;
    return d;
  };
  /** The doctor, a flat-colour stand-in (a white coat, turned 3/4; the doctor art comes later). */
  Kit.doctorFigure = function (parent, cls) {
    const d = h("div", `cl-doc ${cls || ""}`, parent);
    d.innerHTML = '<svg viewBox="0 0 100 260" aria-hidden="true"><ellipse cx="50" cy="252" rx="30" ry="6" fill="rgba(0,0,0,.12)"/><path d="M34 180h14l-2 68H34zM52 180h14l-1 68H53z" fill="#3b3b46"/><path d="M30 246h18v8H26zM52 246h18l4 8H52z" fill="#2a2522"/><path d="M22 74q28-14 56 0l6 112H16z" fill="#f7f6f2" stroke="#d9d2c7" stroke-width="2"/><path d="M44 72l6 26 6-26z" fill="#2e8b7a"/><path d="M22 76l-8 70 10 2 8-60zM78 76l6 64-10 4-6-58z" fill="#f7f6f2" stroke="#d9d2c7" stroke-width="2"/><circle cx="18" cy="150" r="6" fill="#b8845f"/><circle cx="80" cy="146" r="6" fill="#b8845f"/><path d="M36 84q2 20 14 22" stroke="#2a3f5a" stroke-width="3" fill="none"/><circle cx="50" cy="107" r="4" fill="#9aa0a8"/><rect x="44" y="56" width="12" height="12" fill="#b8845f"/><ellipse cx="52" cy="38" rx="17" ry="20" fill="#b8845f"/><path d="M35 34q2-22 18-22q15 1 16 18q-8-8-20-6q-8 1-14 10z" fill="#2b1d16"/><path d="M40 50q10 8 24 0q-2 10-12 10q-10 0-12-10z" fill="#2b1d16"/><circle cx="46" cy="38" r="2.6" fill="#2a2522"/><circle cx="59" cy="38" r="2.6" fill="#2a2522"/><path d="M47 47q5 3 10 0" stroke="#5a3a33" stroke-width="2" fill="none"/></svg>';
    return d;
  };

  /** An item's picture: <div class="cl-item"> with a sprite, or a greybox glyph disc tinted by colour. */
  Kit.icon = function (item, parent, cls) {
    const info = Kit.itemInfo(item);
    const d = h("div", `cl-item ${cls || ""}`, parent);
    d.dataset.item = info.id;
    if (info.standin && Kit.STANDIN[info.standin]) {
      d.classList.add("standin");
      d.innerHTML = Kit.STANDIN[info.standin];
      return d;
    }
    if (info.colour) d.dataset.colour = info.colour;
    if (info.size) d.dataset.size = info.size;
    const src = (info.colour && (Kit.sprite(`${info.base}-${info.colour}`) || Kit.sprite(`${info.id}-${info.colour}`))) || Kit.sprite(info.id) || Kit.sprite(info.base);
    if (src && info.colour && (Kit.sprite(`${info.base}-${info.colour}`) || Kit.sprite(`${info.id}-${info.colour}`))) d.classList.add("own-colour");
    if (src) {
      const img = h("img", "cl-item-img", d);
      img.alt = "";
      img.draggable = false;
      img.src = Kit.url(src);
    } else h("span", "cl-item-glyph", d, info.glyph);
    if (info.colour) d.style.setProperty("--tint", Kit.COLOURS[info.colour] || info.colour);
    if (info.size === "small") d.classList.add("small");
    if (info.size === "big") d.classList.add("big");
    return d;
  };

  /* ---------------- the voice ---------------- */
  const Voice = (Kit.Voice = {
    quiet: false, // no device voice (tests, ?quiet=1)
    speakers: {}, // who -> () => element to anchor the bubble to (or null: the card)
    busy: false,
    queue: Promise.resolve(),
    log: [],
  });
  const estimate = (text) => Math.max(900, Math.min(4200, 420 + 330 * String(text || "").split(/\s+/).length));
  Voice.tts = function (text) {
    if (Voice.quiet || !text || !global.speechSynthesis) return Promise.resolve(false);
    return new Promise((res) => {
      try {
        const u = new global.SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        let done = false;
        const end = () => !done && ((done = true), res(true));
        u.onend = end;
        u.onerror = end;
        global.speechSynthesis.cancel();
        global.speechSynthesis.speak(u);
        setTimeout(end, estimate(text) + 1500);
      } catch (e) {
        res(false);
      }
    });
  };
  Voice.audio = function (src) {
    return new Promise((res) => {
      try {
        const a = new Audio(Kit.url(src));
        let done = false;
        const end = (ok) => !done && ((done = true), res(ok));
        a.onended = () => end(true);
        a.onerror = () => end(false);
        a.play().catch(() => end(false));
        setTimeout(() => end(true), 8000);
      } catch (e) {
        res(false);
      }
    });
  };
  /**
   * Say a line. line: {kutchi, english, audio?, who?} or a string (English
   * placeholder). opts.who: "doctor" | "patient" | "nani" | "kasuku".
   * Shows a bubble by the speaker for as long as it plays. Resolves when done.
   */
  Voice.say = function (line, opts = {}) {
    const w = typeof line === "string" ? { english: line, kutchi: null } : line || {};
    const who = opts.who || w.who || "doctor";
    Voice.log.push({ who, text: Kit.plain(w), t: Date.now() });
    const run = async () => {
      Voice.busy = true;
      const bubble = opts.noBubble ? null : Voice.bubble(w, who, opts);
      const t0 = Date.now();
      let played = false;
      if (w.audio) played = await Voice.audio(w.audio);
      // a family recording of this Kutchi line (js/shared/family-voice.js), else the device voice
      if (!played && w.kutchi && w.placeholder !== true && global.FamilyVoice) {
        await global.FamilyVoice.load(Kit.root);
        const fam = global.FamilyVoice.match(w.kutchi);
        if (fam) played = await Voice.audio(fam.file);
      }
      if (!played) await Voice.tts(Kit.plain(w));
      const left = (Kit.fast ? 150 : estimate(Kit.plain(w))) - (Date.now() - t0);
      if (left > 0) await new Promise((r) => setTimeout(r, left));
      setTimeout(() => bubble && bubble.remove(), Kit.fast ? 50 : 500);
      Voice.busy = false;
    };
    const p = (Voice.queue = Voice.queue.then(run, run));
    return p;
  };
  /** Say a short word at once, outside the queue (a count as you tap: it never holds up the lines). */
  Voice.now = async function (w) {
    let played = false;
    if (w.kutchi && global.FamilyVoice) {
      try {
        await global.FamilyVoice.load(Kit.root);
        const fam = global.FamilyVoice.match(w.kutchi);
        if (fam) played = await Voice.audio(fam.file);
      } catch (e) {
        /* no family voice */
      }
    }
    if (!played && !Voice.quiet && global.speechSynthesis) {
      try {
        const u = new global.SpeechSynthesisUtterance(Kit.plain(w));
        u.rate = 0.95;
        global.speechSynthesis.speak(u);
      } catch (e) {
        /* no voice */
      }
    }
  };
  Voice.clear = function () {
    Voice.queue = Promise.resolve();
    try {
      global.speechSynthesis && global.speechSynthesis.cancel();
    } catch (e) {
      /* no voice */
    }
    document.querySelectorAll(".cl-bubble").forEach((b) => b.remove());
  };
  Voice.layer = null; // the element bubbles are placed in (the play area)
  Voice.bubble = function (w, who, opts = {}) {
    const layer = opts.layer || Voice.layer || document.body;
    const b = h("div", `cl-bubble who-${who}`, layer);
    Kit.text(w, b);
    const anchor = Voice.speakers[who] && Voice.speakers[who]();
    const lr = layer.getBoundingClientRect();
    if (anchor) {
      const r = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : anchor;
      const x = (r.left + r.width / 2 - lr.left) / Math.max(1, lr.width);
      b.style.left = `${Math.max(4, Math.min(70, x * 100 - 12))}%`;
      b.style.top = `${Math.max(2, r.top - lr.top - 8)}px`;
      b.classList.add("anchored");
    } else b.classList.add("top");
    return b;
  };

  /* ---------------- the instruction card ---------------- */
  /**
   * new Kit.Card(el, {who: "doctor", face: element|null, title})
   * setRows([{id, kutchi, english, audio?, count?}]) · tick(id) · pulse(id) · english(on)
   * speak() reads every row in order, lighting each (the one speaker, top right).
   */
  Kit.Card = function (el, opts = {}) {
    const card = this;
    this.el = el;
    el.classList.add("cl-card");
    el.innerHTML = "";
    const head = h("div", "cl-card-head", el);
    this.face = h("div", "cl-card-face", head);
    this.title = h("div", "cl-card-title", head);
    this.speaker = h("button", "cl-card-speak", head);
    this.speaker.type = "button";
    this.speaker.setAttribute("aria-label", "Hear it again");
    this.speaker.innerHTML = "&#128264;";
    this.list = h("ol", "cl-card-rows", el);
    this.rows = [];
    this.who = opts.who || "doctor";
    this.onReplay = opts.onReplay || null;
    this.speaker.addEventListener("click", () => {
      if (card.onReplay) card.onReplay();
      card.speak();
    });
    if (opts.title) this.setTitle(opts.title);
  };
  Kit.Card.prototype.setTitle = function (title, faceEl) {
    this.title.textContent = title || "";
    this.face.innerHTML = "";
    if (faceEl) this.face.appendChild(faceEl);
  };
  Kit.Card.prototype.setRows = function (rows) {
    this.rows = (rows || []).map((r, i) => Object.assign({ id: r.id || `r${i}` }, r));
    this.list.innerHTML = "";
    this.rows.forEach((r) => {
      const li = h("li", "cl-row", this.list);
      li.dataset.row = r.id;
      h("span", "cl-tick", li);
      const t = h("span", "cl-row-text", li);
      Kit.text(r, t);
      const en = h("span", "cl-row-en", li, r.english || "");
      en.setAttribute("aria-hidden", "true");
      r.el = li;
    });
    return this;
  };
  Kit.Card.prototype.addRow = function (r) {
    const rows = this.rows.map((x) => Object.assign({}, x, { el: undefined }));
    const ticked = this.rows.filter((x) => x.el && x.el.classList.contains("done")).map((x) => x.id);
    this.setRows(rows.concat([r]));
    ticked.forEach((id) => this.tick(id, { quiet: true }));
  };
  Kit.Card.prototype.row = function (id) {
    return this.rows.find((r) => r.id === id) || null;
  };
  /** Auto-tick when a step CLOSES (UX s11). */
  Kit.Card.prototype.tick = function (id, o = {}) {
    const r = this.row(id);
    if (!r || !r.el) return;
    r.el.classList.remove("pulse", "now");
    r.el.classList.add("done");
    if (!o.quiet && global.Sfx && global.Sfx.right) try { global.Sfx.right(); } catch (e) { /* no sound */ }
  };
  /**
   * G6 (the Cook counting rule, Q7): at level 1 a row counts up as you tap, written as the
   * Kutchi number word and said aloud, instead of showing nothing until the step closes.
   */
  Kit.NUM = { 1: "hakro", 2: "ba", 3: "trae", 4: "char", 5: "panj" };
  Kit.Card.prototype.count = function (id, n) {
    const r = id ? this.row(id) : this.rows.find((x) => x.el && x.el.classList.contains("now")) || this.rows.find((x) => x.el && !x.el.classList.contains("done"));
    if (!r || !r.el) return null;
    let chip = r.el.querySelector(".cl-row-count");
    if (!chip) chip = h("span", "cl-row-count", r.el);
    chip.textContent = n > 0 ? Kit.NUM[n] || String(n) : "";
    chip.classList.remove("bump");
    void chip.offsetWidth;
    chip.classList.add("bump");
    return r.id;
  };
  Kit.Card.prototype.untick = function (id) {
    const r = this.row(id);
    if (r && r.el) r.el.classList.remove("done");
  };
  Kit.Card.prototype.isTicked = function (id) {
    const r = this.row(id);
    return !!(r && r.el && r.el.classList.contains("done"));
  };
  /** The throbbing hint (free). pulse(null) stops every pulse. */
  Kit.Card.prototype.pulse = function (id, on = true) {
    this.rows.forEach((r) => r.el && (id == null || r.id === id) && r.el.classList.toggle("pulse", !!on && id != null));
  };
  /** Mark the row being worked on now (a soft highlight, not a hint). */
  Kit.Card.prototype.now = function (id) {
    this.rows.forEach((r) => r.el && r.el.classList.toggle("now", r.id === id));
  };
  Kit.Card.prototype.english = function (on) {
    this.el.classList.toggle("english", !!on);
  };
  /** The one speaker: read the rows in order, lighting each as it plays. */
  Kit.Card.prototype.speak = async function (only) {
    const rows = only ? this.rows.filter((r) => only.includes(r.id)) : this.rows;
    for (const r of rows) {
      if (!r.el) continue;
      r.el.classList.add("reading");
      await Voice.say(r, { who: r.who || this.who, noBubble: true });
      r.el.classList.remove("reading");
    }
  };

  /* ---------------- the light bulb ---------------- */
  Kit.BULB_MS = { 1: 5000, 2: 3000, 3: 2000, 4: 1000 };
  Kit.Bulb = function (btn, opts = {}) {
    this.btn = btn;
    this.level = opts.level || 1;
    this.onUse = opts.onUse || null;
    this.targets = opts.targets || (() => document.querySelectorAll(".cl-card"));
    this.uses = 0;
    btn.classList.add("cl-bulb");
    btn.type = "button";
    btn.setAttribute("aria-label", "Light bulb: show it in English for a moment");
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill="currentColor"/><rect x="9" y="19" width="6" height="2.4" rx="1" fill="currentColor"/></svg>';
    this._h = () => this.use();
    btn.addEventListener("click", this._h);
  };
  Kit.Bulb.prototype.use = function () {
    if (this.on) return false;
    this.uses++;
    this.on = true;
    const ms = Kit.BULB_MS[this.level] || 3000;
    const cards = Array.from(this.targets());
    cards.forEach((c) => c.classList.add("english"));
    document.body.classList.add("cl-english");
    this.btn.classList.add("lit");
    if (this.onUse) this.onUse(this.uses);
    clearTimeout(this._t);
    this._t = setTimeout(() => {
      cards.forEach((c) => c.classList.remove("english"));
      document.body.classList.remove("cl-english");
      this.btn.classList.remove("lit");
      this.on = false;
    }, Kit.fast ? 300 : ms);
    return true;
  };
  Kit.Bulb.prototype.destroy = function () {
    clearTimeout(this._t);
    this.btn.removeEventListener("click", this._h);
  };

  /* ---------------- the tally ---------------- */
  Kit.Tally = function (el) {
    this.el = el;
    el.classList.add("cl-tally");
    this.counts = {};
  };
  Kit.Tally.prototype.set = function (itemId, n) {
    this.counts[itemId] = n;
    let chip = this.el.querySelector(`[data-tally="${CSS.escape(itemId)}"]`);
    if (!chip) {
      chip = h("div", "cl-tally-chip", this.el);
      chip.dataset.tally = itemId;
      Kit.icon(itemId, chip, "tiny");
      h("span", "cl-tally-n", chip);
    }
    chip.querySelector(".cl-tally-n").textContent = String(n);
    chip.classList.remove("bump");
    void chip.offsetWidth;
    chip.classList.add("bump");
    this.el.classList.toggle("empty", !Object.keys(this.counts).length);
  };
  Kit.Tally.prototype.clear = function () {
    this.counts = {};
    this.el.innerHTML = "";
    this.el.classList.add("empty");
  };

  /* ---------------- the tray (fixed slots) ---------------- */
  /**
   * new Kit.Tray(el, nSlots, {onTap(i, item)}) — a column (sidebar) or a row
   * (pharmacy) of dishes. fill(i, item) · clear(i) · items() · light(i) ·
   * used(i) · pulse(i) · select(i).
   */
  Kit.Tray = function (el, n, opts = {}) {
    this.el = el;
    el.classList.add("cl-tray");
    el.innerHTML = "";
    this.slots = [];
    this.onTap = opts.onTap || null;
    for (let i = 0; i < n; i++) this._slot();
  };
  Kit.Tray.prototype._slot = function () {
    const i = this.slots.length;
    const d = h("button", "cl-dish", this.el);
    d.type = "button";
    d.dataset.slot = String(i);
    const s = { el: d, item: null };
    d.addEventListener("click", () => this.onTap && this.onTap(i, s.item));
    this.slots.push(s);
    return s;
  };
  Kit.Tray.prototype.fill = function (i, item) {
    const s = this.slots[i] || this._slot();
    s.item = item;
    s.el.innerHTML = "";
    if (item) {
      Kit.icon(item, s.el);
      s.el.classList.add("full");
      s.el.dataset.item = item.id;
      if (item.count > 1) h("span", "cl-dish-n", s.el, String(item.count));
      if (item.wrong) s.el.classList.add("wrong");
    } else {
      s.el.classList.remove("full", "wrong", "used", "lit", "sel");
      delete s.el.dataset.item;
    }
    return s.el;
  };
  Kit.Tray.prototype.firstEmpty = function () {
    return this.slots.findIndex((s) => !s.item);
  };
  Kit.Tray.prototype.items = function () {
    return this.slots.map((s) => s.item);
  };
  Kit.Tray.prototype.light = function (i) {
    this.slots.forEach((s, j) => s.el.classList.toggle("lit", j === i));
  };
  Kit.Tray.prototype.select = function (i) {
    this.slots.forEach((s, j) => s.el.classList.toggle("sel", j === i));
  };
  Kit.Tray.prototype.used = function (i, on = true) {
    if (this.slots[i]) this.slots[i].el.classList.toggle("used", on);
  };
  Kit.Tray.prototype.pulse = function (i, on = true) {
    this.slots.forEach((s, j) => s.el.classList.toggle("pulse", on && j === i));
  };

  /* ---------------- the big button on the right ---------------- */
  Kit.button = function (parent, label, onPress, cls) {
    const b = h("button", `cl-go ${cls || ""}`, parent);
    b.type = "button";
    if (typeof label === "string") b.textContent = label;
    else if (label) Kit.text(label, b);
    b.addEventListener("click", (e) => {
      if (b.disabled) return;
      onPress && onPress(e);
    });
    return b;
  };

  /* ---------------- a small seeded rng (the lab and the host) ---------------- */
  Kit.rng = function (seed) {
    let a = seed >>> 0 || 0x9e3779b9;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
})(typeof self !== "undefined" ? self : this);
