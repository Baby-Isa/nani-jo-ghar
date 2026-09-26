/*
 * Dress up: the page core (greybox, phase 1).
 *
 * Loads Cook's data and save through js/cook/core.js (so word progress and
 * pocket money are the one shared save, as Find it does), then
 * data/dress.json and the two scene files. Dress words and frames join
 * Cook.data in memory only (data/cook.json is never edited), so Cook.Lang
 * builds and speaks Dress lines exactly as it does Cook's: real Kutchi from
 * cook.json, English placeholders in grey italics.
 *
 * A round (Dress.Round) owns the world SVG, the card, the speaker's line,
 * the Done button, the stars and the expectation the tests and "Big Ma
 * helps" read (Dress.expect: what a player who understood would do next).
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = (global.Dress = global.Dress || {});
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  Dress.esc = esc;
  Dress.$ = $;
  const params = new URLSearchParams(global.location.search);
  Dress.fast = params.has("fast");

  /* ---------------- data ---------------- */
  Dress.load = async function () {
    await Cook.load();
    const [data, fitting, table] = await Promise.all(["data/dress.json", "data/scenes/bigma-fitting.json", "data/scenes/bigma-table.json"].map((u) => fetch(u).then((r) => r.json())));
    Dress.data = data;
    Dress.scene = { fitting, table };
    Object.keys(data.words).forEach((id) => {
      if (Cook.data.words[id]) throw new Error(`Dress word ${id} clashes with data/cook.json`);
      Cook.data.words[id] = data.words[id];
    });
    Object.keys(data.lines).forEach((k) => k[0] !== "_" && (Cook.data.lines[k] = data.lines[k]));
    Cook.data.star_sets = Object.assign({}, Cook.data.star_sets, { "dress-up": data.star_sets["dress-up"] });
    Cook.gameMode = "dress-up";
    // the real words the mode leans on must be in data/cook.json
    const real = [...data.real.numbers, ...Object.values(data.real.sizes), data.real.no];
    real.forEach((id) => {
      if (!(Cook.data.words[id] || {}).kutchi) throw new Error(`real word ${id} missing from data/cook.json`);
    });
    Cook.loadSave();
    Cook.save.dress = Cook.save.dress || { rounds: 0, best: {} };
    return data;
  };

  /* ---------------- lines (Cook.Lang lines from row tokens) ---------------- */
  const joinPhrases = (list) => {
    const segs = [];
    list.forEach((p, i) => {
      if (i) segs.push({ t: " ", lang: null });
      segs.push(...p.segs);
    });
    return { segs, en: list.map((p) => p.en).join(" ") };
  };
  function phraseOf(tokens) {
    return joinPhrases(
      tokens.map((t) => {
        if (t.n != null) return { segs: Lang.num(t.n), en: String(t.n) };
        if (t.frame) return Lang.line(t.frame, phraseOf(t.parts));
        return { segs: Lang.word(t.w), en: Cook.english(t.w) };
      })
    );
  }
  Dress.phrase = (row) => phraseOf(Dress.Look.tokens(row, Dress.data));
  const R = () => Dress.data.real.lines;
  /** A row said with a frame: need ("Muke {x} khape."), and ("Ne {x}."), no ("Nar {x}."), sew, bare. */
  Dress.rowLine = function (row, frame) {
    const ph = Dress.phrase(row);
    if (row.no) return Lang.line(R().no, ph);
    if (frame === "bare") return Lang.bare(ph);
    return Lang.line(frame, ph);
  };
  Dress.nameLine = (who) => Lang.line("dress-for", { segs: [{ t: Dress.name(who), lang: null }], en: Dress.name(who) });
  Dress.name = (who) => (who === "bigma" ? "Big Ma" : who === "nani" ? "Nani" : (Dress.data.people[who] || {}).name || who);
  Dress.face = (who) => (who === "bigma" ? "" : `assets/cook/characters/${who}-badge.webp`);

  /**
   * The spoken instruction, one entry per card row: [{row, line}] in the
   * order it's said. The fitting and bangles: "Muke … khape." then "Ne …",
   * "Nar …" where it falls; lay it out: "For Nana: … Ne …" per person;
   * the table: "Sew on …" per row.
   */
  Dress.rowsOf = (round) => (round.change && !round.changeSaid ? round.rows : Dress.Look.finalRows(round));
  Dress.instruction = function (round) {
    const rows = Dress.rowsOf(round);
    const out = [];
    if (round.game === "layout") {
      round.people.forEach((who) => {
        const mine = rows.filter((r) => r.who === who);
        mine.forEach((r, i) => {
          const line = i === 0 ? Lang.join([Dress.nameLine(who), Lang.bare(Dress.phrase(r))]) : Lang.line(R().and, Dress.phrase(r));
          out.push({ row: r, line });
        });
      });
      return out;
    }
    if (round.game === "table") return rows.map((r) => ({ row: r, line: Lang.line("dress-sew", Dress.phrase(r)) }));
    let first = true;
    rows.forEach((r) => {
      if (r.no) return out.push({ row: r, line: Dress.rowLine(r) });
      out.push({ row: r, line: Lang.line(first ? R().need : R().and, Dress.phrase(r)) });
      first = false;
    });
    return out;
  };

  /* ---------------- the round ---------------- */
  let runToken = 0;
  class Abort extends Error {}
  Dress.Abort = Abort;
  Dress.wait = (ms) => {
    const t = runToken;
    return new Promise((res, rej) => setTimeout(() => (t === runToken ? res() : rej(new Abort())), Dress.fast ? 0 : ms / Cook.speed));
  };
  Dress.abortAll = () => {
    runToken++;
    Dress.current = null;
    Dress.expect = null;
  };

  class Round {
    constructor(spec) {
      runToken++;
      this.token = runToken;
      this.spec = spec;
      const seed = spec.seed != null ? spec.seed : Math.floor(Math.random() * 1e9);
      this.seed = seed;
      this.rng = Dress.Pick.rng(seed);
      this.round = Dress.Look.generate({ game: spec.game, level: spec.level, data: Dress.data, rng: this.rng, who: spec.who || undefined, profile: { stage: (id) => Cook.wordStage(id) } });
      this.rack = Dress.Rack.build(this.round, this.rng);
      this.state = { wears: [], misses: 0, sentBack: 0, helped: false, dones: 0, firstDone: null, passFirst: null, voice: null, hand: null };
      this.offs = [];
      this.svg = $("#world");
      this.scene = $("#scene");
      Dress.current = this;
    }
    alive() {
      return this.token === runToken;
    }
    check() {
      if (!this.alive()) throw new Abort();
    }
    get rows() {
      return Dress.rowsOf(this.round);
    }
    /* drawing */
    draw(html) {
      this.scene.innerHTML = html;
    }
    /** World coordinates of a pointer event. */
    pt(ev) {
      const p = this.svg.createSVGPoint();
      p.x = ev.clientX;
      p.y = ev.clientY;
      const q = p.matrixTransform(this.svg.getScreenCTM().inverse());
      return { x: q.x, y: q.y };
    }
    /** Taps on anything with data-act inside the world (delegated, removed at the end). */
    onTap(fn) {
      const h = (ev) => {
        const el = ev.target.closest("[data-act]");
        if (!el || !this.alive() || this.busy) return;
        fn(el.dataset.act, el.dataset, el, ev);
      };
      this.svg.addEventListener("click", h);
      this.offs.push(() => this.svg.removeEventListener("click", h));
    }
    listen(target, ev, fn) {
      target.addEventListener(ev, fn);
      this.offs.push(() => target.removeEventListener(ev, fn));
    }
    close() {
      this.offs.splice(0).forEach((f) => f());
      $("#dress-done").classList.add("hidden");
      $("#moment").classList.add("hidden");
      Dress.expect = null;
    }
    /* the speaker's line in the sidebar (never over the play area) */
    async say(line, { who = this.round.who, ms } = {}) {
      this.check();
      // while someone is talking there is nothing to do; whoever speaks posts the next thing after
      Dress.expect = { kind: "wait" };
      const card = $("#say-card");
      card.classList.remove("hidden");
      const face = card.querySelector(".sc-face");
      const url = Dress.face(who);
      face.innerHTML = url ? `<img src="${url}" alt="">` : `<span class="bm">${esc(Dress.name(who).split(" ").map((w) => w[0]).join(""))}</span>`;
      // when the card is hidden (level 3), the words aren't written out here either: text in one place only
      const hide = this.cardHidden ? (id) => !!id : Cook.cardHidden;
      card.querySelector(".say-slot").innerHTML = `<span class="sc-who">${esc(Dress.name(who))}</span><span class="wp"><span class="wp-text">${Lang.html(line, { hide })}</span></span>`;
      card.classList.remove("pop");
      void card.offsetWidth;
      card.classList.add("pop");
      if (Dress.fast) return;
      const read = Dress.wait(ms || Cook.readMs(Lang.plain(line)));
      const voice = Lang.speak(line).catch(() => {});
      await Promise.all([read, voice]);
      this.check();
    }
    /* the card: one row per spoken row; ticks as rows are met (live checks only) */
    card({ hide = false } = {}) {
      const m = $("#mission");
      m.classList.remove("hidden");
      const who = this.round.who;
      const url = Dress.face(who);
      m.querySelector(".d-face").innerHTML = url ? `<img src="${url}" alt="">` : `<span class="bm">BM</span>`;
      m.querySelector(".m-name").textContent = Dress.name(who);
      this.lines = Dress.instruction(this.round);
      m.querySelector(".m-order").innerHTML = this.lines
        .map(({ row, line }) => `<div class="lr${this.metRows && this.metRows.has(row.id) ? " done" : ""}" data-row="${row.id}"><span class="wp"><span class="wp-text">${hide ? `<span class="dots">•••</span>` : Lang.html(line, { hide: Cook.cardHidden })}</span></span></div>`)
        .join("");
      this.stars();
    }
    markRow(id, on = true) {
      this.metRows = this.metRows || new Set();
      if (on) this.metRows.add(id);
      else this.metRows.delete(id);
      const el = document.querySelector(`#mission .lr[data-row="${id}"]`);
      if (el) el.classList.toggle("done", on);
    }
    stars() {
      const st = this.starState || {};
      const keys = ["ear", "hand", "third"].concat(this.round.say ? ["voice"] : []);
      $("#mission .m-stars").innerHTML = keys
        .map((k) => {
          const info = Cook.UI.starInfo(k === "voice" ? "voice" : k);
          const icon = Cook.UI.ICON[info.icon] || Cook.UI.ICON.tick;
          return `<span class="mstar ${st[k] === false ? "lost" : st[k] ? "earned" : ""}" data-k="${k}" title="${esc(info.tip)}">${icon}</span>`;
        })
        .join("");
    }
    lose(k) {
      this.starState = Object.assign({}, this.starState, { [k]: false });
      this.stars();
    }
    /** Hear the whole instruction again (the ? button: costs the no-help star). */
    async replay() {
      for (const { line } of Dress.instruction(this.round)) await this.say(line);
    }
    /** Show Done in the sidebar and wait for it. */
    done() {
      const b = $("#dress-done");
      b.classList.remove("hidden");
      return new Promise((resolve, reject) => {
        const h = () => {
          b.removeEventListener("click", h);
          b.classList.add("hidden");
          Cook.sfx.click();
          this.alive() ? resolve() : reject(new Abort());
        };
        b.addEventListener("click", h);
        this.offs.push(() => b.removeEventListener("click", h));
      });
    }
    expect(e) {
      Dress.expect = e;
      if (this.spec.helps && e && e.sel) {
        document.querySelectorAll(".glow").forEach((x) => x.classList.remove("glow"));
        if (this.state.misses || this.state.dones) {
          const el = document.querySelector(e.sel);
          if (el) el.classList.add("glow");
        }
      }
    }
  }
  Dress.Round = Round;

  /** The intro card: the instruction big in the middle, then 3 s of quiet play (nothing is live yet). */
  Dress.intro = async function (r) {
    const box = $("#intro");
    const lines = Dress.instruction(r.round);
    box.querySelector(".ic-name").textContent = Dress.name(r.round.who);
    const url = Dress.face(r.round.who);
    box.querySelector(".ic-face").innerHTML = url ? `<img src="${url}" alt="">` : `<span class="bm">BM</span>`;
    box.querySelector(".ic-order").innerHTML = lines.map(({ line }) => `<div class="ir"><span class="wp"><span class="wp-text">${Lang.html(line, { hide: Cook.cardHidden })}</span></span></div>`).join("");
    box.classList.remove("hidden");
    r.expect({ kind: "tap", sel: "#intro .ic-go" });
    const said = (async () => {
      for (const { line } of lines) {
        if (!r.alive() || Dress.fast) return;
        await Lang.speak(line).catch(() => {});
        await Dress.wait(250).catch(() => {});
      }
    })();
    await new Promise((resolve) => {
      const go = box.querySelector(".ic-go");
      const h = () => {
        go.removeEventListener("click", h);
        resolve();
      };
      go.addEventListener("click", h);
    });
    Cook.stopVoice && Cook.stopVoice();
    void said;
    box.classList.add("hidden");
    r.check();
  };
})(window);
