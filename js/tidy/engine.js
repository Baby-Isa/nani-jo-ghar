/*
 * Tidy up: the engine (docs/modes/tidy-up-design.md D.1, D.3, 6.2-6.4, 7;
 * build brief task 2). Plain HTML, like Find it: the board is a 1600x900
 * design of divs fitted to the stage, and no Phaser.
 *
 * Borrowed read-only from Cook: the words, the voice and the sounds
 * (js/cook/core.js, lang.js). Nothing here is Kutchi: rows come from
 * Rules.phrase (data grammar.rows) and every word from data.
 *
 * MECHANIC  one verb, one file: Tidy.Mech.define(id, {run(z, params, k)}),
 *           k = its knobs at this level (data/tidy.json mechanics.<id>).
 * ZONE      a rectangle of the board with its own 1600x900 design space:
 *           z.el, z.toDesign(clientX, clientY), z.toClient(x, y), z.host.
 * HOST      one round on screen (a combined mini-game): the round from
 *           Rules.make, its zones, the live state (placements, rows lost,
 *           help used, neat), an event bus (drop, pick, done) and the view.
 * GAME      one mini-game file (js/tidy/games/*.js): Tidy.Game.define(id,
 *           {zones(host) -> [{id, region, cls, mechs}], run?}); Cook's
 *           stations/ pattern. Routing between zones is by named channel
 *           (out/in), as in Cook: T2's fetch-and-lay sends "fetched".
 *
 * Test hooks: window.__tidy (expectation(), where(), solution(), ...).
 */
(function (global) {
  "use strict";
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Tidy = (global.Tidy = global.Tidy || {});
  const Rules = Tidy.Rules;
  const Rel = Tidy.Rel;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, parent) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  };
  Tidy.$ = $;
  Tidy.el = el;
  const params = new URLSearchParams(global.location.search);
  Tidy.mute = params.has("mute");
  Tidy.wait = (ms) => new Promise((r) => setTimeout(r, ms / (Cook.speed || 1)));
  Cook.gameMode = "tidy";

  /* ---------------- icons (Cook's set plus a broom and a mic) ---------------- */
  Tidy.ICON = {
    speaker: `<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    ear: `<svg viewBox="0 0 24 24"><path d="M8 9a4.5 4.5 0 1 1 9 0c0 2.6-2.4 3.4-3.1 5.3-.5 1.4-.4 3.7-2.7 3.7-1.5 0-2.4-1-2.4-2.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M11 9.5a1.8 1.8 0 1 1 3.3 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    broom: `<svg viewBox="0 0 24 24"><path d="M15 3 10.5 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M6.5 11.5h8l2 9.5h-12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 15v6M11 15v6M13.5 15v6" stroke="currentColor" stroke-width="1.5"/></svg>`,
    tick: `<svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    mic: `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    replay: `<svg viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M18.6 2.8v4.6H14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };

  /* ---------------- loading: borrow words, never invent them ---------------- */
  Tidy.data = null;
  Tidy.load = async function () {
    if (Tidy.data) return Tidy.data;
    await Cook.load();
    const get = (p) => fetch(p).then((r) => r.json());
    const [td, content, k, sr, w] = await Promise.all([
      get("data/tidy.json"),
      get("data/content.json").catch(() => ({ words: [] })),
      get("data/scenes/kitchen-tidy.json"),
      get("data/scenes/sitting-room-tidy.json"),
      get("data/scenes/worktop-tidy.json"),
    ]);
    Tidy.data = td;
    const W = Cook.data.words;
    const cw = {};
    (content.words || []).forEach((x) => (cw[x.id] = { kutchi: (x.kutchi && x.kutchi.text) || null, english: x.english, image: x.image }));
    (td.words.from_content || []).forEach((id) => {
      const c = cw[id];
      if (!c) return;
      if (!W[id]) W[id] = { kutchi: c.kutchi, english: c.english, src: "content master" };
      if (c.image && !W[id].picture) W[id].picture = `assets/${c.image}`;
    });
    Object.keys(td.words.placeholders).forEach((id) => (W[id] = Object.assign({}, td.words.placeholders[id], W[id] || {})));
    Object.keys(td.lines).forEach((id) => id[0] !== "_" && !Cook.data.lines[id] && (Cook.data.lines[id] = td.lines[id]));
    Object.assign(Cook.data.grammar.numbers, td.words.numbers || {});
    (Cook.audioManifest.word || []).forEach((id) => {
      const x = W[id];
      if (!x || !x.kutchi) return;
      const key = Cook.norm(x.kutchi);
      if (!Cook.tts[key]) Cook.tts[key] = `assets/audio/word/${id}.mp3`;
    });
    Cook.data.star_sets = Cook.data.star_sets || {};
    Cook.data.star_sets.tidy = td.star_sets.tidy;
    Rules.init(td, { "kitchen-tidy": k, "sitting-room-tidy": sr, "worktop-tidy": w }, cw);
    Tidy.content = cw;
    return td;
  };

  /* ---------------- words, lines, the voice ---------------- */
  Tidy.stageOverride = null; // the lab's word-stage override (1-4)
  Tidy.stage = (id) => Tidy.stageOverride || Cook.wordStage(id);
  Tidy.english = (id) => Cook.english(id);
  Tidy.picture = (id) => (Cook.data.words[id] || {}).picture || null;
  /** A row as a Cook line {segs, en}; a count shows its digit while the number word is at stage 1-2 (G7). */
  Tidy.line = function (parts) {
    const segs = [];
    const en = [];
    parts.forEach((p, i) => {
      if (i) segs.push({ t: " ", lang: null });
      if (p.n != null) {
        segs.push(...Lang.num(p.n));
        if (Tidy.stage(p.w) <= 2) segs.push({ t: ` (${p.n})`, lang: null });
        en.push(String(p.n));
      } else if (p.w) {
        segs.push(...Lang.word(p.w));
        en.push(Cook.english(p.w));
      } else if (p.t) segs.push({ t: p.t, lang: null });
    });
    return { segs, en: en.join(" ") };
  };
  Tidy.rowLine = (row, round) => Tidy.line(Rules.phrase(row, round));
  Tidy.frame = (key, x) => Lang.line(key, x || null);
  /** HTML for a line, words at stage 3+ as dots (Cook's rule; placeholders never dotted). */
  Tidy.html = (line, { reveal = false } = {}) => Lang.html(line, { hide: (w) => !reveal && Tidy.stage(w) >= 3 && !Cook.isPlaceholder(w) && !String(w).startsWith("num-") });

  const synthEn = (text) =>
    new Promise((resolve) => {
      const done = () => resolve();
      try {
        const ss = global.speechSynthesis;
        const v = ss && ss.getVoices().find((x) => /^en/i.test(x.lang));
        if (!v) return setTimeout(done, (500 + 40 * text.length) / (Cook.speed || 1));
        const u = new SpeechSynthesisUtterance(text);
        u.voice = v;
        u.rate = 0.95;
        u.onend = done;
        u.onerror = done;
        ss.speak(u);
        setTimeout(done, (1200 + 90 * text.length) / (Cook.speed || 1));
      } catch (e) {
        done();
      }
    });
  /** Say a line: Kutchi with the family's or the placeholder voice (Lang.speak), placeholders in English. */
  Tidy.speak = async function (line, { slow = false } = {}) {
    if (Tidy.mute || !line) return;
    const runs = [];
    line.segs.forEach((s) => {
      if (s.lang === null) return runs.length && runs[runs.length - 1].segs.push(s);
      const last = runs[runs.length - 1];
      if (last && last.lang === s.lang && !slow) last.segs.push(s);
      else runs.push({ lang: s.lang, segs: [s] });
    });
    for (const r of runs) {
      if (r.lang === "k") await Lang.speak({ segs: r.segs, en: "" });
      else await synthEn(r.segs.map((s) => s.t).join(""));
      if (slow) await Tidy.wait(450);
    }
  };
  Tidy.speakWord = (id) => Tidy.speak(Lang.wordLine(id));
  /** Nani's one short line in the sidebar (never over the board), spoken. */
  Tidy.nani = async function (line, { speak = true, hold } = {}) {
    const box = $("#nani-line");
    if (!line) return box.classList.add("hidden");
    $(".say", box).innerHTML = typeof line === "string" ? line : Tidy.html(line, { reveal: true });
    box.classList.remove("hidden");
    if (speak && typeof line !== "string") await Tidy.speak(line);
    else await Tidy.wait(hold || 700);
  };
  Tidy.toast = function (msg, ms = 1600) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(Tidy.toast.t);
    Tidy.toast.t = setTimeout(() => t.classList.add("hidden"), ms);
  };
  Tidy.sfx = (name) => {
    try {
      if (!Tidy.mute && Cook.sfx && Cook.sfx[name]) Cook.sfx[name]();
    } catch (e) {
      /* sound is never essential */
    }
  };

  /* ---------------- the board: fit 1600x900 into the stage ---------------- */
  Tidy.fit = function () {
    const stage = $("#stage").getBoundingClientRect();
    const s = Math.min(stage.width / 1600, stage.height / 900);
    const b = $("#board");
    b.style.transform = `translate(${(stage.width - 1600 * s) / 2}px, ${(stage.height - 900 * s) / 2}px) scale(${s})`;
    Tidy.scale = s;
  };
  global.addEventListener("resize", () => Tidy.fit());

  /* ---------------- expectations (what the player should do next; the test plays from it) ---------------- */
  Tidy.exp = { what: "loading" };
  Tidy.expect = (e) => (Tidy.exp = e);

  /* ---------------- registries ---------------- */
  const Mech = (Tidy.Mech = { defs: {}, labs: [] });
  Mech.define = (id, def) => (Mech.defs[id] = Object.assign({ id }, def));
  Mech.lab = (id, def) => Mech.labs.push(Object.assign({ id }, def));
  Mech.knobs = (id, level) => Rules.mech(id, level);
  Mech.run = (id, z, p = {}) => {
    const d = Mech.defs[id];
    if (!d) throw new Error(`Tidy: no mechanic ${id}`);
    return d.run(z, p, Mech.knobs(id, z.host.level));
  };
  const Game = (Tidy.Game = { defs: {} });
  Game.define = (id, def) => (Game.defs[id] = Object.assign({ id }, def));

  /* ---------------- zones ---------------- */
  function makeZone(host, spec) {
    const [x, y, w, h] = spec.region || [0, 0, 1600, 900];
    const s = Math.min(w / 1600, h / 900);
    const node = el("div", `zone ${spec.cls || ""}`, $("#board"));
    node.style.transform = `translate(${x + (w - 1600 * s) / 2}px, ${y + (h - 900 * s) / 2}px) scale(${s})`;
    el("div", "backdrop", node);
    const z = {
      id: spec.id, host, el: node, region: [x, y, w, h], s, spec,
      toDesign(cx, cy) {
        const r = node.getBoundingClientRect();
        const k = r.width / 1600;
        return { x: (cx - r.left) / k, y: (cy - r.top) / k };
      },
      toClient(dx, dy) {
        const r = node.getBoundingClientRect();
        const k = r.width / 1600;
        return { x: r.left + dx * k, y: r.top + dy * k };
      },
      emit: (item) => host.send(spec.out, item),
      listeners: [],
      on(target, ev, fn, opt) {
        target.addEventListener(ev, fn, opt);
        z.listeners.push(() => target.removeEventListener(ev, fn, opt));
      },
      dispose() {
        z.listeners.forEach((f) => f());
        node.remove();
      },
    };
    return z;
  }

  /* ---------------- the host: one round on screen ---------------- */
  class Host {
    constructor(opts) {
      this.opts = opts;
      this.game = opts.game;
      this.level = opts.level || 1;
      this.bus = {};
      this.channels = {};
      this.lost = new Set(); // rows whose ear star is gone (a live wiggle, a reveal)
      this.helpUsed = false; // the no-help star
      this.replaysFree = 1;
      this.neat = { ok: true, why: [] };
      this.moves = 0;
      this.said = { voice: 0, rows: 0, right: 0 };
      this.done = false;
    }
    on(ev, fn) {
      (this.bus[ev] = this.bus[ev] || []).push(fn);
    }
    fire(ev, a) {
      (this.bus[ev] || []).forEach((fn) => fn(a));
    }
    send(ch, item) {
      if (!ch) return;
      (this.channels[ch] = this.channels[ch] || []).push(item);
      this.fire(`in:${ch}`, item);
    }
    get round() {
      return this.R;
    }
    state() {
      return { placements: this.pl, items: this.R.items, start: this.R.start };
    }
    holds(row) {
      return Rel.holds(this.state(), row, this.R.B);
    }
    tested() {
      // a row is taught, not tested, while its thing's word is at stage 1 (6.3)
      return this.R.rows.filter((r) => Tidy.stage(r.item || (r.all ? Tidy.data.kinds.classWord[r.all.kind] : "ph-nothing")) >= 2).map((r) => r.id);
    }
    loseRow(id) {
      this.lost.add(id);
      Sidebar.stars(this);
    }
    loseNeat(why) {
      this.neat.ok = false;
      this.neat.why.push(why);
      Sidebar.stars(this);
    }
    at(spotId) {
      return Object.keys(this.pl).filter((i) => this.pl[i] === spotId);
    }
    /** Move an item (the view follows); fires "drop". */
    move(iid, to, info = {}) {
      const from = this.pl[iid];
      this.pl[iid] = to;
      this.moves++;
      this.view.place(iid, true);
      this.fire("drop", Object.assign({ iid, from, to }, info));
    }
  }
  Tidy.Host = Host;

  /** Make a round and put it on screen. */
  Tidy.host = async function (opts) {
    await Tidy.load();
    Tidy.clear();
    const H = new Host(opts);
    Tidy.current = H;
    const rng = opts.seed ? Rules.rng(opts.seed) : Math.random;
    H.R = opts.round || Rules.make(opts.game, { board: opts.board, kind: opts.kind, level: opts.level, rng });
    H.level = H.R.level;
    H.kn = H.R.knobs;
    H.pl = Object.assign({}, H.R.start);
    const def = Game.defs[opts.via || opts.game];
    H.def = def;
    if (def.prepare) def.prepare(H);
    Tidy.fit();
    const specs = def.zones(H);
    H.zones = {};
    specs.forEach((s) => (H.zones[s.id] = makeZone(H, s)));
    H.main = H.zones[specs.find((s) => s.main).id];
    H.view = new View(H.main, H);
    $("#kind-pill").textContent = `${Tidy.data.games[H.game].code} · L${H.level} · ${opts.kindLabel || H.R.kind}`;
    return H;
  };
  Tidy.clear = function () {
    if (Tidy.current) {
      Tidy.current.dead = true;
      Object.values(Tidy.current.zones || {}).forEach((z) => z.dispose());
      (Tidy.current.cleanup || []).forEach((f) => f());
    }
    $("#board").innerHTML = "";
    $("#board").className = "";
    ["#rows", "#nani-line", "#passme", "#intro", "#speak", "#help", "#overlay", "#btn-done", "#clock"].forEach((s) => $(s).classList.add("hidden"));
    Tidy.current = null;
  };

  /* ---------------- the view: scene, tray, items (greybox) ---------------- */
  const TRAY_Y = 817;
  class View {
    constructor(z, H) {
      this.z = z;
      this.H = H;
      this.B = H.R.B;
      this.nodes = {};
      this.dots = {};
      const cam = { "kitchen-tidy": "kitchen", "sitting-room-tidy": "sitting", "worktop-tidy": "worktop" }[H.R.scene];
      z.el.classList.add(cam, H.R.board === "fruit-box" ? "box" : H.R.board);
      this.drawScene();
      el("div", "tray", z.el);
      this.drawDots();
      H.R.order.forEach((iid) => this.makeItem(iid));
      H.R.order.forEach((iid) => this.place(iid, false));
    }
    drawScene() {
      const z = this.z;
      const B = this.B;
      const box = (cls, r) => {
        const d = el("div", cls, z.el);
        Object.assign(d.style, { left: `${r[0]}px`, top: `${r[1]}px`, width: `${r[2]}px`, height: `${r[3]}px` });
        return d;
      };
      B.surfaces.forEach((s) => {
        if (s.draw === "floor") return;
        if (s.circle) {
          const [cx, cy, rad] = s.circle;
          box(`surf ${s.draw}`, [cx - rad, cy - rad, 2 * rad, 2 * rad]);
        } else box(`surf ${s.draw}`, s.rect);
      });
      if (B.katori) B.spots.forEach((s) => box("katori", [s.x - B.katori, s.y - B.katori, 2 * B.katori, 2 * B.katori]));
      B.spots.forEach((s) => s.cell && box("cell", s.cell));
      B.anchors.forEach((a) => {
        if (!a.rect || a.draw === "none") return;
        const d = box(`anchor ${a.draw}`, a.rect);
        if (a.kind === "person-seat") {
          const who = this.H.R.people[a.id];
          if (who) {
            const face = el("div", "who", d);
            const f = (Cook.data.words[who] || {}).face;
            if (f) face.style.backgroundImage = `url(${f})`;
            else face.textContent = Cook.english(who).split(" ").map((x) => x[0]).join("");
            face.title = ""; // faces carry the person; no name is written (6.3)
          }
        }
      });
    }
    drawDots() {
      this.B.spots.forEach((s) => {
        const d = el("div", "dot", this.z.el);
        d.style.left = `${s.x}px`;
        d.style.top = `${s.y}px`;
        const dbg = el("span", "dbg", d);
        dbg.textContent = `${s.id} ${s.tags.map((t) => t.rel + (t.anchor ? ":" + t.anchor : "")).join(" ")}`;
        this.dots[s.id] = d;
      });
      this.refreshDots();
    }
    refreshDots() {
      Object.keys(this.dots).forEach((id) => this.dots[id].classList.toggle("free", Rel.free(this.H.state(), this.B, id) > 0));
    }
    makeItem(iid) {
      const it = this.H.R.items[iid];
      const n = el("div", "item", this.z.el);
      n.dataset.iid = iid;
      const pic = Tidy.picture(it.word);
      if (pic) {
        const img = el("img", "", n);
        img.src = pic;
        img.alt = ""; // never a label (6.3)
        img.draggable = false;
      } else n.innerHTML = Tidy.shape(it.word, it.attrs.colour);
      if (this.B.katori) n.classList.add("small");
      this.nodes[iid] = n;
      return n;
    }
    /** Where an item sits, in design units. */
    pos(iid) {
      const at = this.H.pl[iid];
      const s = this.B.byId[at];
      if (s) {
        const here = this.H.at(at);
        const k = here.indexOf(iid);
        if ((s.cap || 1) > 1 && s.cell) {
          // up to three in a cell, side by side
          const off = [[-50, -30], [50, -30], [0, 45]][k % 3];
          return { x: s.x + off[0], y: s.y + off[1] };
        }
        return { x: s.x, y: s.y - 14 * k }; // a stack rises
      }
      if (at === "tray") return this.trayPos(iid);
      return { x: -200, y: -200 }; // elsewhere (the fetch shelf holds it)
    }
    trayPos(iid) {
      // every kind keeps its own place on the tray all round (nothing slides when one kind is used up)
      const onTray = this.H.R.order.filter((i) => this.H.pl[i] === "tray");
      const kinds = [];
      this.H.R.order.forEach((i) => {
        const it = this.H.R.items[i];
        const key = it.word + (it.attrs.colour || "");
        if (!kinds.includes(key)) kinds.push(key);
      });
      const it = this.H.R.items[iid];
      const key = it.word + (it.attrs.colour || "");
      const slot = kinds.indexOf(key);
      const sameKind = onTray.filter((i) => this.H.R.items[i].word + (this.H.R.items[i].attrs.colour || "") === key);
      const k = sameKind.indexOf(iid);
      const n = Math.max(kinds.length, 4);
      return { x: 40 + ((slot + 0.5) * 1520) / n + k * 14, y: TRAY_Y - k * 6 };
    }
    place(iid, animate) {
      const n = this.nodes[iid];
      if (!n) return;
      if (!animate) n.style.transition = "none";
      // everything on the tray moves when one leaves it
      const all = this.H.pl[iid] === "tray" || true ? Object.keys(this.nodes) : [iid];
      all.forEach((i) => {
        const p = this.pos(i);
        const m = this.nodes[i];
        if (m.classList.contains("held")) return;
        m.style.left = `${p.x}px`;
        m.style.top = `${p.y}px`;
        m.style.zIndex = String(10 + Math.round(p.y / 10) + (this.H.pl[i] === "tray" ? 0 : this.H.at(this.H.pl[i]).indexOf(i)));
      });
      if (!animate) {
        void n.offsetWidth;
        n.style.transition = "";
      }
      this.refreshDots();
    }
    /** The spot nearest a design point (within reach), the tray, or null. */
    hit(x, y, reach = 100) {
      let best = null;
      let bd = reach;
      this.B.spots.forEach((s) => {
        const d = Math.hypot(s.x - x, s.y - y);
        if (d < bd) (bd = d), (best = s.id);
      });
      if (best) return best;
      if (y > 735) return "tray";
      return null;
    }
    anim(iid, cls, ms = 520) {
      const n = this.nodes[iid];
      if (!n) return Promise.resolve();
      n.classList.remove(cls);
      void n.offsetWidth;
      n.classList.add(cls);
      return Tidy.wait(ms).then(() => n.classList.remove(cls));
    }
  }
  Tidy.View = View;

  /** Grey tableware shapes (no art yet), tinted only by the thing's own colour. */
  Tidy.shape = function (word, colour) {
    const w = Cook.data.words[word] || {};
    const hex = colour ? (Cook.data.words[colour] || {}).hex || "#bbb" : "#d9d6d0";
    const edge = colour ? "#00000055" : "#8f8a82";
    const S = {
      plate: `<ellipse cx="60" cy="68" rx="52" ry="26" fill="${hex}" stroke="${edge}" stroke-width="4"/><ellipse cx="60" cy="66" rx="30" ry="13" fill="#ffffff55"/>`,
      cup: `<path d="M28 40h56l-6 50H34z" fill="${hex}" stroke="${edge}" stroke-width="4"/><path d="M84 52c16 0 16 22 0 24" fill="none" stroke="${edge}" stroke-width="6"/>`,
      glass: `<path d="M36 20h48l-6 80H42z" fill="${hex}" fill-opacity="0.75" stroke="${edge}" stroke-width="4"/>`,
      jug: `<path d="M34 30h44l6 66H28z" fill="${hex}" stroke="${edge}" stroke-width="4"/><path d="M34 30l-12-10M78 42c18 4 18 30 2 34" fill="none" stroke="${edge}" stroke-width="6"/>`,
      katori: `<path d="M22 56h76c-4 26-20 36-38 36S26 82 22 56z" fill="${hex}" stroke="${edge}" stroke-width="4"/>`,
      spoon: `<ellipse cx="42" cy="44" rx="16" ry="22" fill="${hex}" stroke="${edge}" stroke-width="4" transform="rotate(-35 42 44)"/><path d="M52 58l38 40" stroke="${edge}" stroke-width="8" stroke-linecap="round"/>`,
      flask: `<rect x="40" y="22" width="40" height="80" rx="12" fill="${hex}" stroke="${edge}" stroke-width="4"/><rect x="46" y="12" width="28" height="14" rx="4" fill="${edge}"/>`,
    };
    return `<svg viewBox="0 0 120 120">${S[w.shape] || `<circle cx="60" cy="60" r="40" fill="${hex}"/>`}</svg>`;
  };

  /* ---------------- the sidebar: Nani's rows (the ladder) and the stars ---------------- */
  const Sidebar = (Tidy.Sidebar = {});
  Sidebar.rows = function (H, { onRow } = {}) {
    const card = $("#rows");
    card.classList.remove("hidden");
    const list = $(".r-list", card);
    list.innerHTML = "";
    H.lines = {};
    H.R.rows.forEach((r) => {
      const li = el("li", "", list);
      li.dataset.row = r.id;
      const sp = el("button", "icon-btn", li);
      sp.type = "button";
      sp.innerHTML = Tidy.ICON.speaker;
      sp.setAttribute("aria-label", "Hear it again");
      const txt = el("span", "txt", li);
      el("span", "mark", li);
      H.lines[r.id] = Tidy.rowLine(r, H.R);
      txt.innerHTML = Tidy.html(H.lines[r.id], { reveal: H.revealed && H.revealed.has(r.id) });
      if (H.translated && H.translated.has(r.id)) txt.innerHTML += ` <span class="ph">(${H.lines[r.id].en})</span>`;
      sp.onclick = (e) => {
        e.stopPropagation();
        if (onRow) return onRow(r, "speaker");
        Help.replay(H, r);
      };
      li.onclick = () => onRow && onRow(r, "row");
    });
    const rp = $(".r-replay", card);
    rp.innerHTML = Tidy.ICON.replay;
    rp.onclick = () => Help.replay(H, null);
    Sidebar.stars(H);
  };
  Sidebar.mark = function (id, state) {
    const li = $(`.r-list li[data-row="${id}"]`);
    if (!li) return;
    li.classList.remove("ok", "bad");
    if (state) li.classList.add(state);
    $(".mark", li).textContent = state === "ok" ? "✓" : state === "bad" ? "!" : "";
  };
  Sidebar.stars = function (H) {
    const box = $("#rows .r-stars");
    if (!box || !H.R) return;
    const set = Tidy.data.star_sets.tidy;
    const third = H.opts.busy ? "busy" : "relaxed";
    const lostEar = H.lost.size > 0;
    const keys = ["ear", "hand", third].concat(H.voiceRound ? ["voice"] : []);
    const lost = { ear: lostEar, hand: !H.neat.ok, relaxed: H.helpUsed, busy: H.late, voice: false };
    box.innerHTML = keys.map((k) => `<span class="star ${lost[k] ? "lost" : ""}" title="${set[k].tip}">${Tidy.ICON[set[k].icon] || Tidy.ICON.tick}</span>`).join("");
  };

  /* ---------------- the intro card (Wave 5): rows big, then to the sidebar ---------------- */
  Tidy.intro = async function (H) {
    const box = $("#intro");
    const list = $(".ic-rows", box);
    list.innerHTML = "";
    H.R.rows.forEach((r) => {
      const li = el("li", "", list);
      li.innerHTML = Tidy.html(Tidy.rowLine(r, H.R));
    });
    box.classList.remove("hidden");
    let tapped = false;
    const go = new Promise((res) => (box.onclick = () => ((tapped = true), res())));
    Tidy.expect({ what: "intro" });
    const speakAll = (async () => {
      for (const r of H.R.rows) {
        if (tapped) break;
        await Tidy.speak(Tidy.rowLine(r, H.R));
        await Tidy.wait(300);
      }
    })();
    await go;
    box.classList.add("hidden");
    box.onclick = null;
    await Promise.race([speakAll, Tidy.wait(50)]);
  };

  /* ---------------- help: the ladder of rungs, each costing more (6.2) ---------------- */
  const Help = (Tidy.Help = {});
  Help.replay = async function (H, row) {
    if (H.replaysFree > 0) H.replaysFree--;
    else H.helpUsed = true; // replays after the first cost the tick
    Sidebar.stars(H);
    if (row) return Tidy.speak(H.lines[row.id]);
    for (const r of H.R.rows) {
      await Tidy.speak(H.lines[r.id]);
      await Tidy.wait(250);
    }
  };
  Help.open = function (H) {
    const box = $("#help");
    const card = $(".h-card", box);
    const rungs = [
      ["slow", "Slow replay", "Nani says a row slowly", "costs the tick"],
      ["warmer", "Warmer", "Nani's hand sweeps half the board", "costs the tick"],
      ["reveal", "Show the words", "The row's words, written", "costs the ear for that row"],
      ["translate", "In English", "What the row means", "costs the ear for that row"],
      ["shown", "Show me", "A ghost at one right place", "costs the ear for that row"],
    ];
    card.innerHTML = `<h3>Help</h3><div class="cost">Pick a help, then tap a row.</div>` + rungs.map(([id, name, what, cost]) => `<div class="rung"><button class="btn" data-rung="${id}">${name}<br><span class="cost">${what}: ${cost}</span></button></div>`).join("") + `<div class="rung"><button class="btn" data-rung="close">Close</button></div>`;
    box.classList.remove("hidden");
    card.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        box.classList.add("hidden");
        const rung = b.dataset.rung;
        if (rung === "close") return;
        Tidy.toast("Tap a row");
        H.pickRow = (row) => Help.apply(H, rung, row);
      };
    });
  };
  Help.apply = async function (H, rung, row) {
    H.pickRow = null;
    H.helpUsed = true;
    if (rung === "slow") await Tidy.speak(H.lines[row.id], { slow: true });
    if (rung === "warmer") Help.warmer(H, row);
    if (rung === "reveal" || rung === "translate" || rung === "shown") H.loseRow(row.id);
    if (rung === "reveal") (H.revealed = H.revealed || new Set()).add(row.id);
    if (rung === "translate") (H.translated = H.translated || new Set()).add(row.id);
    if (rung === "shown") Help.ghost(H, row);
    Sidebar.rows(H, H.rowHandlers);
    Sidebar.stars(H);
  };
  /** Where a row's thing could go now (free spots that satisfy it). */
  Help.valid = (H, row) => {
    const r = row.type === "not" ? null : row;
    if (!r || !r.rel) return [];
    return H.R.B.spots.filter((s) => Rel.free(H.state(), H.R.B, s.id) > 0 && Rel.satisfies(H.state(), H.R.B, s.id, r.rel, r.anchor, null)).map((s) => s.id);
  };
  /** Rung 3: dim half the board; the other half still holds >=3 legal spots and >=2 places. */
  Help.warmer = function (H, row) {
    const valid = Help.valid(H, row);
    if (!valid.length) return Tidy.toast("Nearly!");
    const s = H.R.B.byId[valid[0]];
    const halves = [
      { keep: (p) => p.x < 800, dim: [800, 1600] },
      { keep: (p) => p.x >= 800, dim: [0, 800] },
    ].filter((h) => h.keep(s));
    for (const h of halves) {
      const kept = H.R.B.spots.filter((p) => h.keep(p) && Rel.free(H.state(), H.R.B, p.id) > 0);
      const places = new Set(kept.flatMap((p) => p.tags.map((t) => t.rel + t.anchor)));
      if (kept.length < 3 || places.size < 2) continue;
      const d = el("div", "dim", H.main.el);
      d.style.left = `${h.dim[0]}px`;
      d.style.width = `${h.dim[1] - h.dim[0]}px`;
      d.style.bottom = "160px";
      setTimeout(() => d.remove(), 4000);
      return;
    }
    Tidy.toast("Nearly!");
  };
  Help.ghost = function (H, row) {
    const valid = Help.valid(H, row);
    const iid = Object.keys(H.R.items).find((i) => Rel.matches(H.R.items[i], row));
    if (!valid.length || !iid) return;
    const s = H.R.B.byId[valid[0]];
    const g = H.view.nodes[iid].cloneNode(true);
    g.classList.add("ghost");
    g.style.left = `${s.x}px`;
    g.style.top = `${s.y}px`;
    H.main.el.appendChild(g);
    setTimeout(() => g.remove(), 3500);
  };

  /* ---------------- K0: Nani shows you (stage 1) ----------------
   * Her hand sets a neutral pebble by a NON-target anchor as she says the
   * relation: the relation's meaning, never the answer (6.3). */
  Tidy.showRelation = async function (H, row) {
    const r = row.type === "not" ? row.rule : row;
    if (!r.rel || (r.anchor && typeof r.anchor === "object")) return;
    const others = H.R.B.groups.filter((g) => g.rel === r.rel && (g.anchor || null) !== (r.anchor || null));
    if (!others.length) return;
    const g = others[Math.floor(Math.random() * others.length)];
    const s = H.R.B.byId[g.spots[0]];
    const p = el("div", "pebble", H.main.el);
    p.style.left = "800px";
    p.style.top = "860px";
    await Tidy.wait(60);
    p.style.left = `${s.x}px`;
    p.style.top = `${s.y}px`;
    await Tidy.speak(Tidy.line([{ w: Tidy.data.relations[r.rel].word }]));
    await Tidy.wait(900);
    p.remove();
  };

  /* ---------------- the Done button ---------------- */
  Tidy.waitDone = function (H) {
    const b = $("#btn-done");
    b.innerHTML = `${Tidy.ICON.broom}<span>Done</span>`;
    b.classList.remove("hidden");
    return new Promise((res) => {
      b.onclick = () => {
        if (H.holding) return;
        b.classList.add("hidden");
        res();
      };
    });
  };

  /* ---------------- stars, pocket money, the word review ---------------- */
  Tidy.coins = 0;
  Tidy.result = async function (H, { title = "Tidy!" } = {}) {
    const tested = H.tested();
    const g = Rules.grade(H.R, H.pl, [...H.lost], tested);
    const set = Tidy.data.star_sets.tidy;
    const third = H.opts.busy ? "busy" : "relaxed";
    const stars = {
      ear: g.ear,
      hand: H.neat.ok,
      [third]: third === "busy" ? !H.late : !H.helpUsed,
    };
    if (H.voiceRound) stars.voice = H.said.voice >= (set.voiceTested || 2);
    const teaching = tested.length < (set.minTested || 2);
    const coins = 5 + (stars.ear ? 5 : 0) + (stars.hand ? 3 : 0) + (stars[third] ? 3 : 0) + (stars.voice ? 3 : 0);
    Tidy.coins += coins;
    $("#coins").textContent = Tidy.coins;
    const words = new Map();
    H.R.rows.forEach((r) => Rules.phrase(r, H.R).forEach((p) => p.w && words.set(p.w, true)));
    const review = [...words.keys()]
      .map((w) => `<div><span class="k ${Cook.isPlaceholder(w) ? "ph" : ""}">${Cook.display(w)}</span> <span class="e">${Cook.english(w)}</span></div>`)
      .join("");
    const panel = $("#panel");
    panel.className = "";
    panel.innerHTML = `<h2>${title}</h2>
      <div class="result-stars">${Object.keys(stars).map((k) => `<span class="star ${stars[k] ? "on" : "lost"}" title="${set[k].tip}">${Tidy.ICON[set[k].icon] || Tidy.ICON.tick}</span>`).join("")}</div>
      ${teaching ? `<p><b>Learning:</b> most of these words are new, so this board teaches them (helping money only).</p>` : ""}
      <p>Pocket money: +${coins}</p>
      <h3>Words</h3><div class="review">${review}</div>
      <div class="lab-row"><button class="btn primary" id="res-again" type="button">Again</button><button class="btn" id="res-lab" type="button">The lab</button></div>`;
    $("#overlay").classList.remove("hidden");
    H.result = { stars, grade: g, coins, teaching };
    Tidy.lastResult = H.result;
    Tidy.expect({ what: "result", stars });
    return new Promise((res) => {
      $("#res-again").onclick = () => res("again");
      $("#res-lab").onclick = () => res("lab");
    });
  };

  /* ---------------- playing a mini-game ---------------- */
  /** The standard round: intro, arrange (the game's mechanics), Done, the check, the result. */
  Tidy.play = async function (opts) {
    const H = await Tidy.host(opts);
    const def = H.def;
    if (def.run) return def.run(H);
    await Tidy.introAndRows(H);
    const ctl = {};
    Object.values(H.zones).forEach((z) => (z.spec.mechs || []).filter(Boolean).forEach((m) => (ctl[m] = Mech.run(m, z, z.spec.params || {}))));
    H.ctl = ctl;
    Tidy.startClock(H);
    Tidy.expect({ what: "arrange" });
    await Tidy.waitDone(H);
    H.done = true;
    H.fire("done");
    if (ctl.check) await ctl.check.done();
    Tidy.stopClock(H);
    if (def.after) await def.after(H);
    return Tidy.finish(H);
  };
  Tidy.introAndRows = async function (H) {
    H.rowHandlers = { onRow: (r, how) => (H.pickRow ? H.pickRow(r) : how === "speaker" && Help.replay(H, r)) };
    await Tidy.intro(H);
    Sidebar.rows(H, H.rowHandlers);
    // K0: stage-1 rows are shown, not tested (the lab's "Nani helps" turns it on for every row)
    for (const r of H.R.rows) if (H.opts.helper || Tidy.stage(r.item || "") === 1) await Tidy.showRelation(H, r);
    $("#btn-help").onclick = () => Help.open(H);
  };
  Tidy.finish = async function (H) {
    const choice = await Tidy.result(H);
    $("#overlay").classList.add("hidden");
    if (H.dead) return choice;
    if (choice === "again") return Tidy.play(Object.assign({}, H.opts, { round: null, seed: null }));
    return Tidy.Lab && Tidy.Lab.open();
  };
  /** Busy: the doorbell clock (guests arriving); done in time earns the bolt. */
  Tidy.startClock = function (H) {
    if (!H.opts.busy) return;
    const c = $("#clock");
    c.classList.remove("hidden");
    const total = 20000 * H.R.rows.length;
    const t0 = Date.now();
    H.clock = setInterval(() => {
      const left = Math.max(0, 1 - ((Date.now() - t0) * (Cook.speed || 1)) / total);
      $("i", c).style.width = `${left * 100}%`;
      if (left <= 0 && !H.late) {
        H.late = true;
        Tidy.sfx("soft");
        Sidebar.stars(H);
      }
    }, 250);
  };
  Tidy.stopClock = (H) => clearInterval(H.clock);

  /* ---------------- test hooks ---------------- */
  global.__tidy = {
    ready: false,
    expectation: () => Tidy.exp,
    host: () => Tidy.current,
    round: () => Tidy.current && Tidy.current.R,
    placements: () => Tidy.current && Object.assign({}, Tidy.current.pl),
    solution: () => Tidy.current && Object.assign({}, Tidy.current.R.solution),
    rows: () => Tidy.current && Tidy.current.R.rows.map((r) => Object.assign({ english: Rules.english(r, Tidy.current.R), holds: Tidy.current.holds(r) }, r)),
    items: () => Tidy.current && Tidy.current.R.items,
    /** Client coordinates of an item, a spot, the tray, or a button. */
    where(what) {
      const H = Tidy.current;
      const c = (x, y) => H.main.toClient(x, y);
      if (what === "tray") return c(800, 817);
      if (H && H.R.items[what]) {
        const n = H.view.nodes[what];
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      if (H && H.R.B.byId[what]) return c(H.R.B.byId[what].x, H.R.B.byId[what].y);
      const e = $(what);
      if (e) {
        const r = e.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    },
    result: () => Tidy.lastResult,
    rel: (cases) => cases.map((c) => Tidy.Rel.holds(c.state, c.rule, c.scene)),
  };
})(window);
