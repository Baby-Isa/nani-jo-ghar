/*
 * Find it, mechanic `spot` (docs/find-it-design.md D3): find one thing in a
 * panned scene. The padded hit box and snap (view.js), a find arcs into the
 * carried basket and its row's tally goes up (`count`: the tally only,
 * never the target, never ends by itself); a wrong tap wiggles and Nani
 * recasts (what you tapped, then the row); two misses on one row and its
 * things glow (shown: the ear star); tapping everywhere pauses the stall.
 *
 * Moved out of round.js unchanged (8.3 task 1); the round keeps thin
 * methods that call these, so games and the tests see the same Round.
 * A game can listen for finds with round.onFind(item, row) (F3's calls).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;
  const S = (Find.Spot = {});

  /** A tap on the stall while searching: a thing that answers a row is found, anything else is a mistake. */
  S.tap = function (r, x, y) {
    const now = Find.now();
    if (now < r.slowUntil) return;
    r.lastAct = now;
    const item = V.hit(x, y, r.items);
    if (!item) {
      // scenery answers a tap, and never counts (the shopkeeper smiles)
      const p = V.person;
      if (p && x > p.x - p.w / 2 && x < p.x + p.w / 2 && y > p.top && y < 552) {
        V.mood("happy");
        setTimeout(() => r.alive() && V.mood("neutral"), 700);
      }
      V.ripple(x, y);
      Cook.sfx.pop();
      return;
    }
    const row = r.rows.find((x) => !x.want.not && Find.matches(item, x.want) && x.got < x.want.count) || r.rows.find((x) => !x.want.not && Find.matches(item, x.want));
    if (row) S.collect(r, item, row, now);
    else S.wrong(r, item, now);
  };

  /** A find: into the basket, the row's tally up, the combo. */
  S.collect = function (r, item, row, now) {
    const ms = (now - r.lastFind) * Cook.speed;
    const fast = ms <= r.knobs.parMs && !r.warmerOn;
    r.finds.push({ noun: item.noun, ms: Math.round(ms), fast });
    r.lastFind = now;
    r.combo = fast ? r.combo + 1 : 0;
    r.bestCombo = Math.max(r.bestCombo, r.combo);
    V.combo(r.combo);
    if (r.warmerOn) r.warmer(false);
    item.gone = true;
    row.got++;
    r.basket.push(item);
    Cook.sfx.right();
    V.fly(item, V.basketSpot(r.basket.length - 1));
    UI.mission.refresh();
    // counting aloud teaches the number words (stages 1-2); from stage 3 the tally is silent
    const n = row.got;
    if (!r.calls && n <= 10 && Cook.wordStage(Cook.numId(n)) < 3 && Cook.data.grammar.numbers[n]) Lang.speak(Lang.numLine(n)).catch(() => {});
    if (r.onFind) r.onFind(item, row);
  };

  /** The row a wrong tap was really about: its "no" row, a look-alike's row, or the first open one. */
  S.rowFor = function (r, item) {
    return (
      r.rows.find((x) => x.want.not && Find.matches(item, x.want)) ||
      r.rows.find((x) => !x.want.not && x.got < x.want.count && x.want.noun === item.noun) ||
      r.rows.find((x) => !x.want.not && x.got < x.want.count && Find.sameGroup(x.want.noun, item.noun)) ||
      r.openRows[0] ||
      r.rows.find((x) => !x.want.not) ||
      null
    );
  };

  /** A mistake: wiggle, the recast, and you try again yourself. */
  S.wrong = function (r, item, now) {
    V.wiggle(item);
    Cook.sfx.soft();
    r.combo = 0;
    const row = S.rowFor(r, item);
    r.wrongTaps.push(item.noun);
    const kind = row && row.want.not ? "no" : row && row.want.noun === item.noun ? (row.want.size && item.size !== row.want.size ? "size" : "where") : "wrong";
    r.earMiss(row, kind === "no" ? `tapped ${item.noun} (Nani said no ${item.noun})` : `tapped ${item.noun}${row ? `, not ${Find.rowText(row.want)}` : ""}`, kind);
    // tapping everywhere: the stall pauses for a moment, and the sharp-eyes star goes
    const [n, win] = r.knobs.slowTaps || [3, 2000];
    r.wrongTimes = r.wrongTimes.filter((t) => now - t < win / Cook.speed).concat([now]);
    if (r.wrongTimes.length >= n) {
      r.wrongTimes = [];
      r.slowUntil = now + (r.knobs.slowMs || 2000) / Cook.speed;
      r.slowTriggered = true;
      r.kinds.push("slow");
      UI.mission.star("hand", "lost");
      UI.toast("Slow down!");
    }
    // the recast: what you tapped, then the row again; then you try again yourself
    const lines = [Lang.line("oops"), Lang.bare(Lang.phrase(Find.itemParts(item, row)))];
    if (row) lines.push(Find.rowLine(row, true));
    Find.sayLater("nani", Lang.join(lines));
    // two misses on one row: its things glow (shown: costs the ear star; the word doesn't advance)
    if (row) {
      row.misses++;
      if (row.misses >= 2 && !row.want.not && !row.shown) {
        row.shown = true;
        V.glow(r.items.filter((it) => !it.gone && Find.matches(it, row.want)));
        r.onHelp("shown", { ids: [row.want.noun], row });
      }
    }
  };
})(window);
