/*
 * Find it: one round of searching (docs/find-it-design.md s1, s5, s6).
 *
 * The engine a mechanic drives: the list on the mission card (one ladder
 * row per want, one dot per item, never per unit, in random order), items
 * placed in hide spots with their relations, taps, the per-row running
 * tally, the recast on a mistake, Done, and the three stars:
 *   ear         understood: every tested row right (the right things, the
 *               right number, nothing from a "no" row, the bag's mistake
 *               found), with no answer shown (reveal, translate, the glow);
 *   sharp eyes  most finds within the level's par time, measured from the
 *               end of Nani's line or the last find, and no tapping
 *               everywhere (3 wrong items in 2 s pauses the stall);
 *   tick/bolt   no help (Relaxed) or done before the patience ring runs
 *               out (Busy). Help costs follow data/find.json "help".
 *
 * Leak rules, from the Cook audit, applied from the start:
 *   - a row never says it's finished: counts never end by themselves; the
 *     tally is what's in the basket, not what's left; Done is always there;
 *   - over- and under-collecting are both graded, at Done;
 *   - no item labels in the scene; a word is text on its row or nowhere,
 *     and Nani's lines hide a known word the same way the row does;
 *   - hesitating never shows the answer (Nani just says the list again);
 *   - a stage-1 word is taught, not tested: its targets twinkle as Nani
 *     says it, and it counts for the ear star neither way.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;
  const $ = (s) => document.querySelector(s);

  const hideKnown = (id) => Cook.cardHidden(id) && Lang.wordHasVoice(id);
  const FACES = { nani: "assets/cook/characters/nani-badge.webp", shopkeeper: "assets/characters/shopkeeper/shopkeeper-happy.png" };

  /** Someone says a line from the sidebar card (never over the stall). */
  Find.say = async function (who, line, opts = {}) {
    const face = $("#nani-card .nc-face");
    face.src = Cook.v(FACES[who] || FACES.nani);
    face.alt = who === "nani" ? "Nani" : "The shopkeeper";
    $("#nani-card").classList.toggle("other", who !== "nani");
    if (who !== "nani") V.bob();
    try {
      await UI.say(line, { badge: true }, Object.assign({ hide: hideKnown }, opts));
    } catch (e) {
      if (!(e instanceof Cook.Abort)) throw e;
      if (!opts.soft) throw e;
    }
  };
  /** Say without waiting (a recast while you keep searching). */
  Find.sayLater = (who, line, opts = {}) => Find.say(who, line, Object.assign({ soft: true }, opts)).catch(() => {});

  /* ---------------- placing items in hide spots ---------------- */
  const sizeCache = {};
  /**
   * Units from the generator ({noun, size?, spot}, js/find/gen.js) to things
   * on the stall: each in its hide spot, drawn at its size's scale (the same
   * picture at 0.8x and 1.25x for "which one?"), with its relations (the
   * spot's relation to its anchor, any extra ones the spot lists, "next to"
   * its neighbours on the same anchor). Given kinds instead ({noun, copies}),
   * they are dealt to random spots, as before.
   */
  Find.placeItems = async function (scene, unitsOrKinds) {
    let units = unitsOrKinds;
    if (units.length && units[0].copies != null) {
      const list = Cook.shuffle([].concat(...units.map((k) => Array.from({ length: k.copies }, () => k))));
      const spots = Cook.shuffle(scene.spots).slice(0, list.length);
      units = spots.map((sp, i) => ({ noun: list[i].noun, size: list[i].size || null, spot: sp.id }));
    }
    const items = Find.Gen.items(units, scene, Math.random);
    const spotById = {};
    scene.spots.forEach((sp) => (spotById[sp.id] = sp));
    for (const it of items) {
      const size = Math.round((spotById[it.spot].size || scene.size || 96) * Find.scaleOf(it.size));
      const key = `${it.noun}@${size}`;
      if (!sizeCache[key]) sizeCache[key] = await V.measure(it.noun, size);
      Object.assign(it, sizeCache[key], { tilt: Find.rint(-7, 7) });
    }
    return items;
  };

  /* ---------------- a round ---------------- */
  class Round {
    constructor({ mech, level = 1, scene, lab = false, story = null, bag = true, greet = false, bot = false }) {
      Object.assign(this, { mech, level, scene, lab, story, bagTwist: bag, greet, bot });
      this.knobs = Find.knobs(mech, level);
      this.busy = Cook.save.mode === "busy";
      this.rows = [];
      this.items = [];
      this.basket = [];
      this.phase = "setup";
      this.reasons = [];
      this.practice = [];
      this.kinds = [];
      this.wrongTaps = [];
      this.help = 0;
      this.replays = 0;
      this.finds = [];
      this.combo = 0;
      this.bestCombo = 0;
      this.slowTriggered = false;
      this.slowUntil = 0;
      this.earLost = false;
      this.token = Cook.run;
      this.wrongTimes = [];
      this.moments = []; // speaking moments (Say.tell outcomes), for the voice star
      this.calls = false; // F3: rows are calls, one at a time
      Find.activeScene = scene;
    }
    get openRows() {
      return this.rows.filter((r) => !r.want.not && r.got < r.want.count);
    }
    /** Rows count for the ear star from word stage 2 (stage 1 is taught, not tested). */
    tested(r) {
      return !!r && r.stage >= 2 && !r.placeholder;
    }
    alive() {
      return this.token === Cook.run;
    }

    /* ---- the list on the mission card ---- */
    openList(wants) {
      this.rows = wants.map((w) => Find.ladderRow(w));
      // a row decided by a word with no Kutchi yet (a position before A5) is readable English: not tested
      // (the shared stars rule placeholdersTested: false)
      const phTested = global.Stars ? global.Stars.rules("find").placeholdersTested : false;
      this.rows.forEach((r) => (r.placeholder = !phTested && Find.rowParts(r.want).some((p) => typeof p === "string" && Cook.data.words[p] && !Cook.data.words[p].kutchi)));
      this.rows.forEach((r) => (r.decorate = (li) => decorate(r, li)));
      this.L = Find.ladder(this.rows);
      UI.mission.open({ who: this.who || "nani", name: this.listName || "Nani's list", ladders: [this.L], line: this.listLine(), busy: this.busy });
      if (!Find.stageOverride) this.rows.forEach((r) => r.ids.concat(r.want.count ? [Cook.numId(r.want.count)] : []).forEach((id) => Cook.markSeen(id)));
    }
    /**
     * Wave 5 (calm, shared with Cook): Nani's list comes up big in the middle
     * while she says it (nothing is live yet), then flies into the sidebar.
     * Then a new word (stage 1, taught, not tested) is taught on the stall:
     * its things twinkle as Nani says its row. Known words get no second telling.
     */
    async sayList({ twinkle = true } = {}) {
      UI.hideBubble();
      await UI.mission.introduce();
      if (!this.alive()) throw new Cook.Abort("left");
      for (const { row, line } of Find.listLines(this.L)) {
        if (!twinkle || row.stage > 1 || row.want.not) continue;
        const targets = this.items.filter((it) => !it.gone && Find.matches(it, row.want));
        V.twinkle(targets, true);
        try {
          await Find.say("nani", line, { ms: Cook.readMs(Lang.plain(line)) });
        } finally {
          V.twinkle(targets, false);
        }
      }
    }
    listLine() {
      return Lang.join(Find.listLines(this.L).map((x) => x.line));
    }

    /* ---- the search ---- */
    beginSearch({ done = true } = {}) {
      this.phase = "search";
      this.t0 = this.lastFind = this.lastAct = Find.now();
      this.hesitated = false;
      if (done) $("#find-done").classList.remove("hidden");
      $("#btn-warmer").classList.remove("hidden");
      // calm: Nani's last line goes, and the sidebar is just the list, Done and the rail
      UI.hideBubble();
      this.startTimers();
    }
    endSearch() {
      $("#find-done").classList.add("hidden");
      $("#btn-warmer").classList.add("hidden");
      V.dimOutside(null, null, this.items);
      this.stopTimers();
    }
    /** Resolves when the player presses Done. */
    waitDone() {
      return new Promise((resolve) => (this.doneResolve = resolve));
    }
    pressDone() {
      if (this.phase !== "search" || !this.doneResolve) return;
      Cook.sfx.click();
      const r = this.doneResolve;
      this.doneResolve = null;
      r();
    }
    tap(x, y) {
      if (!this.alive()) return;
      if (this.phase === "search") return this.searchTap(x, y);
      if (this.phase === "bag" && this.onBagTap) return this.onBagTap(x, y);
      const a = V.anchorAt(x, y);
      if (a) V.ripple(x, y);
    }
    /* the search's taps, finds and mistakes: js/find/mechanics/spot.js */
    searchTap(x, y) {
      return Find.Spot.tap(this, x, y);
    }
    collect(item, row, now) {
      return Find.Spot.collect(this, item, row, now);
    }
    rowFor(item) {
      return Find.Spot.rowFor(this, item);
    }
    wrong(item, now) {
      return Find.Spot.wrong(this, item, now);
    }
    /** A mistake on a row: the ear star goes if the row is tested (stage 2+). */
    earMiss(row, why, kind = "wrong") {
      if (row) {
        row.miss = true;
        // for the word review: a wrong count is the number word's miss; anything else, the thing's
        row.missed = row.missed || new Set();
        if (kind === "count" && row.want.count) row.missed.add(Cook.numId(row.want.count));
        else if (kind !== "shown") row.missed.add(row.want.noun);
      }
      if (row && !this.tested(row)) {
        // a new word: taught, not tested (noted on the result card, the star stays)
        this.practice.push(wordsOf(why));
        return;
      }
      this.reasons.push(wordsOf(why));
      this.kinds.push(kind);
      this.earLost = true;
      UI.mission.star("ear", "lost");
    }

    /* ---- help (design s5.3) ---- */
    onHelp(kind = "help", info = {}) {
      if (!this.alive() || this.phase === "end" || this.phase === "setup") return;
      if (kind === "replay" && this.replays++ < (Find.data.help.freeReplays || 1)) return;
      this.help++;
      this.kinds.push("help:" + kind);
      if (this.busy) this.drain((Find.data.help.busySeconds || {})[kind] || 5);
      else UI.mission.star("third", "lost");
      if (["reveal", "translate", "shown"].includes(kind)) {
        const ids = info.ids || [];
        // A/En translates every row still to do; the eye and the glow, one
        const rows = info.row ? [info.row] : this.rows.filter((r) => ids.includes(r.want.noun));
        const row = rows[0] || null;
        rows.forEach((r) => {
          r.shown = true;
          // for the word review: the glow shows the thing; the eye and English show the whole row
          r.helped = r.helped || new Set();
          (kind === "shown" ? [r.want.noun] : r.line.segs.filter((s) => s.w).map((s) => s.w)).forEach((id) => r.helped.add(id));
        });
        this.earMiss(row, `${kind === "shown" ? "shown" : kind === "reveal" ? "revealed" : "translated"} ${ids.join(" ") || "the list"}`, "shown");
      }
    }
    /** Warmer: Nani points at a third of the stall that still holds 3+ candidates. */
    warmer(on = true) {
      if (!on) {
        this.warmerOn = false;
        clearTimeout(this.warmerTimer);
        return V.dimOutside(null, null, this.items);
      }
      if (this.phase !== "search") return;
      const row = Cook.pick(this.openRows.length ? this.openRows : this.rows.filter((r) => !r.want.not));
      if (!row) return;
      const targets = this.items.filter((it) => !it.gone && Find.matches(it, row.want));
      const t = Cook.pick(targets);
      if (!t) return;
      let a = Cook.clamp(t.x - 1600 / 6 - Find.rint(0, 160), 0, 1600 - 1600 / 3);
      let b = a + 1600 / 3;
      const live = () => this.items.filter((it) => !it.gone && it.x >= a && it.x <= b).length;
      while (live() < 3 && (a > 0 || b < 1600)) {
        a = Math.max(0, a - 80);
        b = Math.min(1600, b + 80);
      }
      this.onHelp("warmer");
      this.combo = 0;
      this.warmerOn = true;
      V.dimOutside(a, b, this.items.filter((it) => !it.gone));
      clearTimeout(this.warmerTimer);
      this.warmerTimer = setTimeout(() => this.alive() && this.warmer(false), 7000 / Cook.speed);
    }

    /* ---- timers: hesitation (Nani says it again, free) and Busy patience ---- */
    startTimers() {
      this.stopTimers();
      let last = Find.now();
      this.used = 0;
      this.total = this.knobs.patienceSec || 120;
      if (this.busy) UI.setPatience(1);
      this.timer = setInterval(() => {
        if (!this.alive()) return this.stopTimers();
        const now = Find.now();
        if (this.busy && !Cook.paused) {
          this.used += ((now - last) / 1000) * Cook.speed;
          this.paintPatience();
        }
        last = now;
        // the list up big again (↻) or paused: that's not hesitating
        if (Cook.paused || UI.mission.introOpen()) this.lastAct = now;
        // calm: Nani says the whole list again (never just the rows still to do: that would tell you
        // which counts are met) only after a long hesitation, and only once
        if (this.phase === "search" && !this.hesitated && (now - this.lastAct) * Cook.speed > (this.knobs.hesitateMs || 14000)) {
          this.hesitated = true;
          Find.sayLater("nani", this.listLine());
        }
      }, 300);
    }
    stopTimers() {
      clearInterval(this.timer);
      this.timer = null;
    }
    drain(sec) {
      this.used = (this.used || 0) + sec;
      this.paintPatience();
    }
    paintPatience() {
      this.patience = Math.max(0, 1 - this.used / this.total);
      UI.setPatience(this.patience);
      if (this.patience < 0.35) UI.mission.star("third", "lost");
    }

    /* ---- Done: counts are graded here, over and under ---- */
    async grade() {
      const bad = [];
      this.rows.forEach((r) => {
        if (r.want.not || r.got === r.want.count) return;
        r.countMiss = true;
        // the digit was on the row (the number word is taught, stage <= 1): noted, not tested
        if (r.countTaught) return this.practice.push(wordsOf(`${r.got} ${r.want.noun}, they asked for ${r.want.count}`));
        this.earMiss(r, `${r.got} ${r.want.noun}, they asked for ${r.want.count}`, "count");
        bad.push(r);
      });
      if (bad.length) {
        await Find.say("nani", Lang.join([Lang.line("oops")].concat(bad.map((r, i) => Find.rowLine(r, i === 0)))));
      }
      return bad;
    }

    /* ---- the end: stars, pocket money, word progress ---- */
    finish() {
      this.phase = "end";
      this.stopTimers();
      const fast = this.finds.filter((f) => f.fast).length;
      const stars = {
        ear: !this.earLost,
        hand: this.finds.length > 0 && fast / this.finds.length >= 0.8 && !this.slowTriggered,
        third: this.busy ? (this.patience == null ? 1 : this.patience) >= 0.35 : this.help === 0,
      };
      if (this.handOverride != null) stars.hand = this.handOverride;
      // the voice star: only in a round with a speaking moment (recognised or a parent's ✓; pills leave it open)
      const voice = this.moments.length && global.Stars ? global.Stars.voice(this.moments, "find") : null;
      if (voice && voice.state !== "none") stars.voice = voice.state === "earned";
      // every row decided by a placeholder word (F3 before the position words): the ear wasn't tested
      if (this.noEar || (this.rows.length && this.rows.every((r) => r.placeholder || r.want.not))) delete stars.ear;
      Object.entries(stars).forEach(([k, v]) => k !== "voice" && UI.mission.star(k, v ? "earned" : "lost"));
      // rows show their words again, and the card is stamped
      this.rows.forEach((r) => (r.done = true));
      UI.mission.refresh();
      UI.mission.stamp();
      UI.setPatience(null);
      const P = Find.data.pay;
      const receipt = [["Helping Nani", P.help]];
      if (stars.ear) receipt.push(["Understood (ear star)", P.ear]);
      if (stars.voice) receipt.push(["Said it (voice star)", P.voice || 4]);
      if (stars.hand) receipt.push([`${UI.starInfo("hand").name} star`, P.hand]);
      if (stars.third) receipt.push([`${UI.starInfo("third").name} star`, P.third]);
      const c = P.combo;
      if (this.bestCombo >= c.from) receipt.push([`Combo ×${this.bestCombo}`, Math.min(c.max, (this.bestCombo - c.from + 1) * c.each)]);
      const coins = receipt.reduce((a, [, v]) => a + v, 0);
      // word progress (not when the lab is pretending you know the words)
      if (!Find.stageOverride && !this.noProgress) {
        this.rows.forEach((r) => {
          if (!this.tested(r)) return;
          if (r.miss || r.shown) Cook.markMiss(r.want.noun);
          else Cook.markRight(r.want.noun);
          if (r.want.count) (r.countMiss ? Cook.markMiss : Cook.markRight)(Cook.numId(r.want.count));
        });
      }
      Cook.save.coins += coins;
      Cook.writeSave();
      Cook.sfx.coin();
      const n = Object.values(stars).filter(Boolean).length;
      for (let i = 0; i < n; i++) setTimeout(() => Cook.sfx.star(i), 250 * i);
      return {
        stars,
        coins,
        receipt,
        reasons: this.reasons.slice(),
        practice: this.practice.slice(),
        kinds: this.kinds.slice(),
        help: this.help,
        bestCombo: this.bestCombo,
        finds: this.finds.slice(),
        asked: this.rows.map((r) => ({ line: r.want.not ? r.line : { segs: r.phrase.segs, en: r.phrase.en }, bad: !!r.miss, no: r.want.not })),
        words: this.wordReview(),
        voice: voice ? voice.state : null,
        moments: this.moments.map((m) => ({ choice: m.choice, via: m.via })),
        untested: this.rows.filter((r) => r.placeholder).length,
        level: this.level,
        mech: this.mech,
      };
    }
    /**
     * The word review for the result card (shared with Cook, ui.js): every
     * Kutchi word on the list once (the things, the numbers, "no"), marked
     * "missed" (a wrong thing, a wrong count, the bag's mistake missed) or
     * "helped" (the eye, English, the glow).
     */
    wordReview() {
      const missed = new Set();
      const helped = new Set();
      this.rows.forEach((r) => {
        (r.missed || []).forEach((id) => missed.add(id));
        (r.helped || []).forEach((id) => helped.add(id));
      });
      return UI.orderWords([this.L]).map((id) => ({ id, state: missed.has(id) ? "missed" : helped.has(id) ? "helped" : "ok" }));
    }
  }
  Find.Round = Round;

  /* ---------------- the row's own bit: the running tally ---------------- */
  /*
   * What's in the basket for this row so far ("×2"), once there's something
   * in it. The number asked for only while its number word is taught (stage
   * <= 1, D5.2): from stage 2 the count is tested, and a digit there would
   * answer "how many?" without any Kutchi (the leak bots read it straight
   * off the row). A count is graded only when it's tested. Never what's left.
   */
  function decorate(r, li) {
    if (r.want.not) return;
    // the count's digit, only while its number word is taught (stage <= 1: D5.2, the review's High leak)
    if (r.countTaught && !r.done) li.querySelector(".wp-text").insertAdjacentHTML("afterbegin", `<span class="ldigit" title="How many">${r.want.count}</span> `);
    if (!r.got) return;
    li.querySelector(".wp-text").insertAdjacentHTML("beforeend", ` <span class="ltally" title="In your basket">×${r.got}</span>`);
  }
  const ID_RE = /\b(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+\b/g;
  const wordsOf = (why) => String(why).replace(ID_RE, (id) => (Cook.data.words[id] ? Cook.display(id) : id));
})(window);
