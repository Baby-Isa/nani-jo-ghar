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
    face.src = FACES[who] || FACES.nani;
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
   * kinds: [{noun, copies, colour?, size?}]. Every unit gets its own spot,
   * shuffled every round (no fixed positions), and records its relations:
   * the spot's (relation, anchor), any extra ones the spot data lists,
   * and which items sit next to it on the same anchor.
   */
  Find.placeItems = async function (scene, kinds) {
    const units = Cook.shuffle([].concat(...kinds.map((k) => Array.from({ length: k.copies }, () => k))));
    const spots = Cook.shuffle(scene.spots).slice(0, units.length);
    const items = [];
    for (let i = 0; i < spots.length; i++) {
      const k = units[i];
      const sp = spots[i];
      const size = sp.size || scene.size || 96;
      const key = `${k.noun}@${size}`;
      if (!sizeCache[key]) sizeCache[key] = await V.measure(k.noun, size);
      const { w, h } = sizeCache[key];
      items.push({
        id: `it${i}`,
        noun: k.noun,
        colour: k.colour || null,
        size: k.size || null,
        spot: sp.id,
        anchor: sp.anchor,
        x: sp.x + Find.rint(-6, 6),
        baseline: sp.baseline,
        w,
        h,
        tilt: Find.rint(-7, 7),
        rel: [[sp.rel, sp.anchor]].concat(sp.also || []),
      });
    }
    // "next to": neighbours on the same anchor
    const byAnchor = {};
    items.forEach((it) => (byAnchor[it.anchor] = byAnchor[it.anchor] || []).push(it));
    Object.values(byAnchor).forEach((list) => {
      list.sort((a, b) => a.x - b.x);
      list.forEach((it, j) => {
        if (list[j - 1] && it.x - list[j - 1].x < 140) it.rel.push(["next-to", list[j - 1].id]);
        if (list[j + 1] && list[j + 1].x - it.x < 140) it.rel.push(["next-to", list[j + 1].id]);
      });
    });
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
    }
    get openRows() {
      return this.rows.filter((r) => !r.want.not && r.got < r.want.count);
    }
    /** Rows count for the ear star from word stage 2 (stage 1 is taught, not tested). */
    tested(r) {
      return !!r && r.stage >= 2;
    }
    alive() {
      return this.token === Cook.run;
    }

    /* ---- the list on the mission card ---- */
    openList(wants) {
      this.rows = wants.map((w) => Find.ladderRow(w));
      this.rows.forEach((r) => (r.decorate = (li) => decorate(r, li)));
      this.L = Find.ladder(this.rows);
      UI.mission.open({ who: "nani", name: "Nani's list", ladders: [this.L], steps: this.bagTwist ? ["Find", "Done", "Check the bag"] : ["Find", "Done"], busy: this.busy });
      if (!Find.stageOverride) this.rows.forEach((r) => r.ids.concat(r.want.count ? [Cook.numId(r.want.count)] : []).forEach((id) => Cook.markSeen(id)));
    }
    /** Nani says the list, a row at a time; a stage-1 word's things twinkle as she says it. */
    async sayList({ twinkle = true } = {}) {
      const lines = Find.listLines(this.L);
      for (const { row, line } of lines) {
        const teach = twinkle && row.stage <= 1 && !row.want.not;
        const targets = teach ? this.items.filter((it) => !it.gone && Find.matches(it, row.want)) : [];
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
    beginSearch() {
      this.phase = "search";
      this.t0 = this.lastFind = this.lastAct = Find.now();
      this.hesitated = false;
      $("#find-done").classList.remove("hidden");
      $("#btn-warmer").classList.remove("hidden");
      UI.mission.step(0);
      this.startTimers();
      // a short phone: the goal folds to its "?" once the search starts, so the rail (zoom) stays in view
      if ($("#stage").getBoundingClientRect().height < 480) setTimeout(() => this.alive() && $("#how").classList.add("collapsed"), 2500 / Cook.speed);
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
    searchTap(x, y) {
      const now = Find.now();
      if (now < this.slowUntil) return;
      this.lastAct = now;
      const item = V.hit(x, y, this.items);
      if (!item) {
        // scenery answers a tap, and never counts (the shopkeeper smiles)
        const p = V.person;
        if (p && x > p.x - p.w / 2 && x < p.x + p.w / 2 && y > p.top && y < 552) {
          V.mood("happy");
          setTimeout(() => this.alive() && V.mood("neutral"), 700);
        }
        V.ripple(x, y);
        Cook.sfx.pop();
        return;
      }
      const row = this.rows.find((r) => !r.want.not && Find.matches(item, r.want) && r.got < r.want.count) || this.rows.find((r) => !r.want.not && Find.matches(item, r.want));
      if (row) this.collect(item, row, now);
      else this.wrong(item, now);
    }
    collect(item, row, now) {
      const ms = (now - this.lastFind) * Cook.speed;
      const fast = ms <= this.knobs.parMs && !this.warmerOn;
      this.finds.push({ noun: item.noun, ms: Math.round(ms), fast });
      this.lastFind = now;
      this.combo = fast ? this.combo + 1 : 0;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      showCombo(this.combo);
      if (this.warmerOn) this.warmer(false);
      item.gone = true;
      row.got++;
      this.basket.push(item);
      Cook.sfx.right();
      V.fly(item, V.basketSpot(this.basket.length - 1));
      UI.mission.refresh();
      // counting aloud teaches the number words (stages 1-2); from stage 3 the tally is silent
      const n = row.got;
      if (n <= 10 && Cook.wordStage(Cook.numId(n)) < 3 && Cook.data.grammar.numbers[n]) Lang.speak(Lang.numLine(n)).catch(() => {});
    }
    /** The row a wrong tap was really about: its "no" row, a look-alike's row, or the first open one. */
    rowFor(item) {
      return (
        this.rows.find((r) => r.want.not && Find.matches(item, r.want)) ||
        this.rows.find((r) => !r.want.not && r.got < r.want.count && Find.sameGroup(r.want.noun, item.noun)) ||
        this.openRows[0] ||
        this.rows.find((r) => !r.want.not) ||
        null
      );
    }
    wrong(item, now) {
      V.wiggle(item);
      Cook.sfx.soft();
      this.combo = 0;
      showCombo(0);
      const row = this.rowFor(item);
      this.wrongTaps.push(item.noun);
      const kind = row && row.want.not ? "no" : "wrong";
      this.earMiss(row, kind === "no" ? `tapped ${item.noun} (Nani said no ${item.noun})` : `tapped ${item.noun}${row ? `, not ${row.want.noun}` : ""}`, kind);
      // tapping everywhere: the stall pauses for a moment, and the sharp-eyes star goes
      const [n, win] = this.knobs.slowTaps || [3, 2000];
      this.wrongTimes = this.wrongTimes.filter((t) => now - t < win / Cook.speed).concat([now]);
      if (this.wrongTimes.length >= n) {
        this.wrongTimes = [];
        this.slowUntil = now + (this.knobs.slowMs || 2000) / Cook.speed;
        this.slowTriggered = true;
        this.kinds.push("slow");
        UI.mission.star("hand", "lost");
        UI.gist("Slow down: look first, then tap.", { full: true });
        setTimeout(() => this.alive() && this.phase === "search" && UI.gist(Find.data.mechanics[this.mech].goal), (this.knobs.slowMs || 2000) / Cook.speed);
      }
      // the recast: what you tapped, then the row again; then you try again yourself
      const lines = [Lang.line("oops"), Lang.bare(Lang.phrase([item.noun]))];
      if (row) lines.push(Find.rowLine(row, true));
      Find.sayLater("nani", Lang.join(lines));
      // two misses on one row: its things glow (shown: costs the ear star; the word doesn't advance)
      if (row) {
        row.misses++;
        if (row.misses >= 2 && !row.want.not && !row.shown) {
          row.shown = true;
          V.glow(this.items.filter((it) => !it.gone && Find.matches(it, row.want)));
          this.onHelp("shown", { ids: [row.want.noun], row });
        }
      }
    }
    /** A mistake on a row: the ear star goes if the row is tested (stage 2+). */
    earMiss(row, why, kind = "wrong") {
      if (row) row.miss = true;
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
        const row = info.row || this.rows.find((r) => ids.includes(r.want.noun));
        if (row) row.shown = true;
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
      showCombo(0);
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
        if (this.phase === "search" && !this.hesitated && (now - this.lastAct) * Cook.speed > (this.knobs.hesitateMs || 9000)) {
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
      Object.entries(stars).forEach(([k, v]) => UI.mission.star(k, v ? "earned" : "lost"));
      // rows show their words again, and the card is stamped
      this.rows.forEach((r) => (r.done = true));
      UI.mission.refresh();
      UI.mission.stamp();
      UI.setPatience(null);
      const P = Find.data.pay;
      const receipt = [["Helping Nani", P.help]];
      if (stars.ear) receipt.push(["Understood (ear star)", P.ear]);
      if (stars.hand) receipt.push([`${UI.starInfo("hand").name} star`, P.hand]);
      if (stars.third) receipt.push([`${UI.starInfo("third").name} star`, P.third]);
      const c = P.combo;
      if (this.bestCombo >= c.from) receipt.push([`Combo ×${this.bestCombo}`, Math.min(c.max, (this.bestCombo - c.from + 1) * c.each)]);
      const coins = receipt.reduce((a, [, v]) => a + v, 0);
      // word progress (not when the lab is pretending you know the words)
      if (!Find.stageOverride) {
        this.rows.forEach((r) => {
          if (!this.tested(r)) return;
          if (r.miss || r.shown) Cook.markMiss(r.want.noun);
          else Cook.markRight(r.want.noun);
          if (r.want.count) (r.countMiss ? Cook.markMiss : Cook.markRight)(Cook.numId(r.want.count));
        });
      }
      Cook.save.coins += coins;
      Cook.writeSave();
      UI.setCoins(Cook.save.coins, true);
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
        did: this.rows
          .filter((r) => !r.want.not)
          .map((r) => ({ line: Lang.phrase(r.got ? [r.got, r.want.noun] : [r.want.noun]), bad: r.got !== r.want.count }))
          .concat(this.wrongTaps.slice(0, 6).map((id) => ({ line: Lang.wordLine(id), bad: true }))),
        words: [...new Set(this.rows.map((r) => r.want.noun))],
        level: this.level,
        mech: this.mech,
      };
    }
  }
  Find.Round = Round;

  /* ---------------- the row's own bits: the running tally, and the count's digit ---------------- */
  function decorate(r, li) {
    if (r.want.not) return;
    const n = r.want.count;
    // a digit only while the number word is being learned (stages 1-2): the Roadmap's "shown and heard"
    if (n && !r.done && !r.revealed && Cook.wordStage(Cook.numId(n)) < 3) li.querySelector(".wp-text").insertAdjacentHTML("beforeend", ` <span class="ldigit" title="How many">${n}</span>`);
    // the running tally: what's in the basket for this row (never what's left)
    if (r.got) li.querySelector(".wp-text").insertAdjacentHTML("beforeend", ` <span class="ltally" title="In your basket">×${r.got}</span>`);
  }
  function showCombo(n) {
    const c = $("#combo");
    c.classList.toggle("hidden", n < 2);
    c.querySelector("b").textContent = n;
    if (n >= 2) {
      c.classList.remove("bump");
      void c.offsetWidth;
      c.classList.add("bump");
    }
  }
  const ID_RE = /\b(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+\b/g;
  const wordsOf = (why) => String(why).replace(ID_RE, (id) => (Cook.data.words[id] ? Cook.display(id) : id));
})(window);
