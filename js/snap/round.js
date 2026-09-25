/*
 * Snap: one round (docs/modes/snap-design.md D1, D2, 6.2-6.4, 7).
 *
 *   intro card (Nani says the rows; a stage-1 word's fruit twinkle once)
 *   -> shoot (the viewfinder; film = rows + 2; nothing says if a print is right)
 *   -> Show Nani (js/snap/mechanics/handin.js: every row again, new order)
 *   -> stars (ear, lens, tick; voice in G4), pocket money, word progress.
 * G4 (Ali's camera) runs Ali's rows first (js/snap/mechanics/ali-camera.js),
 * then the child's own rows, then one hand-in of every print.
 *
 * Leak rules held here: no counter in the viewfinder and no digit on a count
 * row; the card never says a row is done until the hand-in; hesitating only
 * makes Nani say the list again (free the first time); a stage-1 word is
 * taught, not tested; the ear star needs 2 tested rows (js/snap/stubs/stars.js).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Snap = global.Snap;
  const Photo = Snap.Photo;
  const Req = Snap.Req;
  const Sim = Snap.Sim;
  const $ = (s) => document.querySelector(s);

  const hideKnown = (id) => Cook.cardHidden(id) && Lang.wordHasVoice(id);
  const FACES = { nani: "assets/cook/characters/nani-badge.webp", ali: "assets/cook/characters/cousin-badge.webp" };

  /** Someone says a line from the sidebar card (never over the orchard). */
  Snap.say = async function (who, line, opts = {}) {
    const face = $("#nani-card .nc-face");
    face.src = FACES[who] || FACES.nani;
    face.alt = who === "ali" ? "Ali" : "Nani";
    $("#nani-card").classList.toggle("other", who !== "nani");
    try {
      await UI.say(line, { badge: true }, Object.assign({ hide: hideKnown }, opts));
    } catch (e) {
      if (!(e instanceof Cook.Abort) || !opts.soft) throw e;
    }
  };
  Snap.sayLater = (who, line, opts = {}) => Snap.say(who, line, Object.assign({ soft: true }, opts)).catch(() => {});

  class Round {
    constructor({ game, level = 1, seed = null, lab = false, debug = false, bot = null }) {
      this.game = game;
      this.level = level;
      this.seed = seed == null ? Math.floor(Math.random() * 1e9) : seed;
      this.lab = lab;
      this.debug = debug;
      this.bot = bot;
      this.deal = Req.makeRound(Snap.data, Snap.scene, game, level, this.seed);
      this.K = this.deal.K;
      this.lay = this.deal.lay;
      this.film = this.deal.film;
      this.rows = this.deal.rows.map((row, i) => this.cardRow(row, i));
      this.prints = [];
      this.phase = "setup";
      this.help = 0;
      this.replays = 0;
      this.reasons = [];
      this.practice = [];
      this.kinds = [];
      this.said = [];
      this.lens = [];
      this.token = Cook.run;
      this.goal = Snap.data.games[game].goal;
    }
    alive() {
      return this.token === Cook.run;
    }
    /** A mission-card row (js/cook/order.js's shape) for a dealt row. */
    cardRow(row, i) {
      const phrase = Snap.rowPhrase(row);
      const ids = Snap.rowWords(row);
      return {
        i,
        row,
        ali: this.game === "g4" && Sim.isAliRow(i),
        parts: Req.rowParts(row, Snap.data).main,
        ids,
        no: false,
        need: 1,
        got: 0,
        done: false,
        miss: false,
        revealed: false,
        shown: false,
        firstRight: false,
        phrase,
        line: Snap.cardLine(row),
        stage: Snap.rowStage(row),
      };
    }
    get childRows() {
      return this.rows.filter((r) => !r.ali);
    }
    tested(r) {
      return !!r && r.stage >= 2 && !r.ali;
    }
    /** The list as Nani says it: "trae aamo. Ne bo kelo." (a leave-out: "... Nar kelo."). */
    listLine() {
      return Lang.join(Cook.Order.rows(this.L).map((r, k) => Snap.rowLine(r.row, { first: k === 0 })));
    }

    async play() {
      UI.gist(this.goal);
      this.L = { dish: 0, recipe: null, head: null, sections: [{ key: "any", seq: false, groups: Cook.shuffle(this.childRows).map((r) => [r]) }] };
      UI.mission.open({ who: "nani", name: "Nani's photos", ladders: [this.L], line: this.listLine(), busy: false });
      if (!Snap.stageOverride) this.rows.forEach((r) => r.ids.forEach((id) => Cook.markSeen(id)));
      this.vf = Snap.Mech.defs.viewfinder.create({ lay: this.lay, scene: Snap.scene, K: this.K, film: this.film, debug: this.debug, onShot: (s) => this.onShot(s), onAct: () => (this.lastAct = Snap.now()) });
      this.vf.enable(false);
      if (this.game === "g4") {
        this.phase = "ali";
        await Snap.AliCamera.run(this);
      }
      this.phase = "intro";
      await this.intro();
      this.phase = "shoot";
      await this.shoot({ label: "Show Nani" });
      this.phase = "handin";
      await Snap.Handin.run(this);
      return this.finish();
    }

    /* ---- the intro card: a stage-1 word's fruit twinkle as Nani says it (taught, not tested) ---- */
    async intro() {
      const teach = this.childRows.filter((r) => r.stage <= 1);
      const glow = this.lay.spots.filter((s) => teach.some((r) => s.kind === r.row.noun && (r.row.kind !== "pick" || s.size === r.row.size)));
      glow.forEach((s) => this.vf.els[s.id].classList.add("twinkle"));
      try {
        await UI.mission.introduce();
      } finally {
        glow.forEach((s) => this.vf.els[s.id] && this.vf.els[s.id].classList.remove("twinkle"));
      }
    }

    /* ---- shooting: until the film is gone or the player shows Nani ---- */
    shoot({ label = "Show Nani", need = 0 } = {}) {
      const vf = this.vf;
      vf.root.classList.remove("hidden");
      vf.layout();
      vf.enable(true);
      this.lastAct = Snap.now();
      this.hesitated = false;
      const show = $("#vf-show");
      show.textContent = label;
      const shotsAtStart = this.prints.length;
      show.classList.toggle("hidden", this.prints.length === 0 || need > 0);
      Cook.expect = null;
      return new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          clearInterval(this.hesTimer);
          show.removeEventListener("click", onShow);
          show.classList.add("hidden");
          vf.enable(false);
          this.shotDone = null;
          resolve();
        };
        const onShow = () => {
          Cook.sfx.click();
          finish();
        };
        show.addEventListener("click", onShow);
        this.shotDone = () => {
          if (this.prints.length - shotsAtStart >= need) show.classList.remove("hidden");
          if (vf.film <= 0) setTimeout(finish, 650 / Cook.speed);
        };
        if (vf.film <= 0) setTimeout(finish, 300 / Cook.speed);
        // hesitating: Nani says the list again (free the first time), never the answer
        this.hesTimer = setInterval(() => {
          if (!this.alive()) return finish();
          if (Cook.paused || this.hesitated || this.phase !== "shoot") return;
          if ((Snap.now() - this.lastAct) * Cook.speed > this.K.vf.hesitateMs) {
            this.hesitated = true;
            Snap.sayLater("nani", this.listLine());
          }
        }, 300);
      });
    }
    /** A print slides into the tray, silently. */
    onShot(shot, by = "child") {
      const tray = $("#tray");
      const h = Math.max(40, tray.getBoundingClientRect().height - 8);
      const w = (h * shot.frame.w) / shot.frame.h;
      const el = Snap.Prints.thumb(this.lay, Snap.scene, shot.frame, w);
      const p = Object.assign({ i: this.prints.length, el, used: false, by, lens: Photo.lensScore(shot.print, this.K.photo) }, shot);
      el.dataset.i = p.i;
      el.classList.add("arrive");
      el.addEventListener("animationend", () => el.classList.remove("arrive"), { once: true });
      if (by === "ali") el.classList.add("by-ali");
      tray.appendChild(el);
      this.prints.push(p);
      if (this.shotDone) this.shotDone();
      return p;
    }
    /** Back for more frames (none of the prints fits the row): the ear star for that row is already gone. */
    async goBack(extra) {
      const phase = this.phase;
      this.phase = "shoot";
      $("#handin").classList.add("hidden");
      this.vf.addFilm(extra);
      await this.shoot({ label: "Back to Nani", need: 1 });
      this.phase = phase;
    }

    /* ---- help (design 6.3), as Find it ---- */
    onHelp(kind = "help", info = {}) {
      if (!this.alive() || this.phase === "end" || this.phase === "setup") return;
      if (kind === "replay" && this.replays++ < (Snap.data.help.freeReplays || 1)) return;
      this.help++;
      this.kinds.push("help:" + kind);
      UI.mission.star("third", "lost");
      if (kind === "reveal" || kind === "translate") {
        // the words shown: the eye's row, a translated line's words, or (the card's A/En) every open row
        const ids = info.ids || (info.line ? info.line.segs.filter((s) => s.w).map((s) => s.w) : null);
        const hit = ids ? this.childRows.filter((r) => !r.done && r.ids.some((id) => ids.includes(id))) : this.childRows.filter((r) => !r.done);
        hit.forEach((r) => {
          r.shown = true;
          this.earMiss(r, `${kind === "reveal" ? "revealed" : "translated"} ${Lang.plain(r.line)}`, "shown");
        });
      }
    }
    /** A mistake on a row: the ear star goes if the row is tested (stage 2+, not Ali's). */
    earMiss(r, why, kind = "wrong") {
      if (!r) return;
      r.miss = true;
      if (!this.tested(r)) {
        if (!r.ali) this.practice.push(why);
        return;
      }
      this.reasons.push(why);
      this.kinds.push(kind);
      UI.mission.star("ear", "lost");
    }

    /* ---- the end: stars, pocket money, word progress ---- */
    finish() {
      this.phase = "end";
      clearInterval(this.hesTimer);
      const S = Snap.Stars;
      const ear = S.ear(this.rows.map((r) => ({ stage: r.stage, firstRight: r.firstRight, shown: r.shown, excluded: r.ali })), { minTested: this.K.handin.minTested });
      const lens = S.lens(this.lens);
      const voice = this.game === "g4" ? S.voice(this.said, { minSaid: this.K.ali.minSaid }) : null;
      const stars = { ear: ear.earned, hand: lens, third: this.help === 0 };
      if (voice) stars.voice = voice.earned;
      ["ear", "hand", "third"].forEach((k) => UI.mission.star(k, stars[k] ? "earned" : "lost"));
      this.rows.forEach((r) => (r.done = true));
      UI.mission.refresh();
      UI.mission.stamp();
      const P = Snap.data.pay;
      const receipt = [["Helping Nani", P.help]];
      if (stars.ear) receipt.push(["Understood (ear star)", P.ear]);
      if (stars.hand) receipt.push(["Good shots (lens star)", P.hand]);
      if (stars.third) receipt.push(["No help", P.third]);
      if (stars.voice) receipt.push(["Said it (voice star)", P.voice]);
      const coins = receipt.reduce((a, [, v]) => a + v, 0);
      if (!Snap.stageOverride) {
        this.rows.forEach((r) => {
          if (!this.tested(r)) return;
          r.ids.forEach((id) => (r.miss || r.shown ? Cook.markMiss(id) : Cook.markRight(id)));
        });
      }
      Cook.save.coins += coins;
      if (!this.lab) {
        Cook.save.snap = Cook.save.snap || { rounds: 0 };
        Cook.save.snap.rounds++;
      }
      Cook.writeSave();
      Cook.sfx.coin();
      const n = Object.values(stars).filter(Boolean).length;
      for (let i = 0; i < n; i++) setTimeout(() => Cook.sfx.star(i), 250 * i);
      const words = [];
      this.rows.forEach((r) => r.ids.forEach((id) => !words.includes(id) && words.push(id)));
      return {
        game: this.game,
        level: this.level,
        seed: this.seed,
        stars,
        earOffered: ear.offered,
        tested: ear.tested,
        voiceOffered: voice ? voice.offered : null,
        coins,
        receipt,
        reasons: this.reasons.slice(),
        practice: this.practice.slice(),
        kinds: this.kinds.slice(),
        help: this.help,
        asked: this.rows.map((r) => ({ line: Snap.cardLine(r.row), bad: r.miss || r.shown, ali: r.ali })),
        gave: this.rows.map((r) => (r.gave != null ? r.gave : null)),
        prints: this.prints.map((p) => ({ by: p.by, used: p.used, frame: p.frame, print: p.print })),
        words,
        said: this.said.slice(),
      };
    }
  }
  Snap.Round = Round;
})(window);
