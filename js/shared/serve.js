/*
 * Serving to a customer (Sprint 18, the module map's piece 8; the shared kit, decision 13: the pantry and the fetch-and-serve stalls
 * need it too): the review faces, the tick and the recast, from the reference game's signed-off serve (7 Nov). No game is named
 * here (STD-F1-02); each game gives its own check of a dish and what its people say.
 *
 *   NjgServe.review(S, o, env)   one person's review (29 Sept, X10 / Q1, Zafar's answer: ONE way in every station): their big round
 *        face over the dish (no body, no pretend eating), happy when it's right with the family's praise beside it, a gentle
 *        frown and a small shake of the head when it's wrong (never a red cross). Resolves once seen and heard, with {face, card,
 *        close()}: the game closes it when it moves on (a wrong one can stay up while they say their order again).
 *        o: who, ok, x, y (the face's centre, over the dish), size (its diameter), line (what they say when it's right; default
 *        the "welldone" line; false for none), side ("left" | "right": where the praise card goes), k (the card's scale), depth
 *   NjgServe.layout(dishes, o) -> [{x, y, size, side, praise}]   the faces for several dishes at once, each at its own dish's upper
 *        left over the rim's edge only (so what was just served shows), sized so it never reaches the next dish; the praise beside
 *        the last face, or beside the leftmost when the last one's card would run off the view. dishes [{x, y, w}] (w: the dish's
 *        drawn width); o: left (no face's centre left of this), right (the view's right), cardW, gapK, min, max, single, offK
 *   NjgServe.faces(S, dishes, wrong, o, env) -> Promise<[review]>  the layout, then every face at once; the praise line said once,
 *        when all are right (wrong: the indexes of the wrong dishes)
 *   NjgServe.round(o) -> Promise   the tick and the recast (decision 51, CK-23: a wrong dish is redone on the spot, never the whole
 *        round). Each round: o.done(round) (the child's Done); o.check(item, round) -> {ok, rows} for every dish still open (round
 *        0: all; after: the ones redone); o.onRight(item); o.review(wrongItems, round) -> Promise<[{close}]> (the faces); a first
 *        try with a wrong dish: o.oops(); each wrong dish's person says again what they asked (o.recast(item, rows)); the faces
 *        close (o.afterReview()); with no tracker (o.redo) or nothing wrong it ends. Else each wrong dish asks the tracker
 *        (o.redo.wrong(o.key(item)): its third wrong try is shown the right way, o.showRight(item)); the rest are o.reset(item)
 *        and played again (o.again(items, round)). The first try is the one scored (the game's check knows the round).
 *   NjgServe.env(Cook, win)        the review's needs from a mode's namespace (its badge maker, sounds, voice, lines, clock; the
 *                                  tokens and timers of win, the page it plays on: default this one)
 *   NjgServe.for(Cook, win)        {review(S, o), faces(S, dishes, wrong, o), round, layout}: the kit with that env given
 *
 * An ES module (Cook's files import it); it also hangs on globalThis.NjgServe.
 */
const LOOK = { shadow: 0x28190a, shadowA: 0.16, card: 0xffffff, cardShadowA: 0.12, font: 34, cardH: 58, cardPad: 44, radius: 14, gap: 18 };

/** The review's needs from a mode's namespace (Cook's today: Cook.Kit.badge, Cook.sfx, Cook.Lang, Cook.wait, Cook.tween). */
function env(C, win) {
  const G = win || globalThis;
  return {
    badge: (S, who, mood, N) => C.Kit.badge(S, who, mood, N),
    right: () => C.sfx.right(),
    soft: () => C.sfx.soft(),
    welldone: () => C.Lang.line("welldone"),
    plain: (l) => C.Lang.plain(l),
    speak: (l) => C.Lang.speak(l),
    wait: (ms) => C.wait(ms),
    tween: (S, cfg) => C.tween(S, cfg),
    // (Cook.forceReview: the screenshot script shows a face it can't make the bot earn; the look only, the game's verdict decides)
    force: () => C.forceReview,
    // (Cook.tasted and Cook.tasteHold: for the screenshot scripts)
    mood: (m) => (C.tasted = m),
    hold: () => C.tasteHold,
    font: () => (G.Tokens && G.Tokens.font ? G.Tokens.font("word", "Nunito, sans-serif") : "Nunito, sans-serif"),
    ink: () => G.Tokens.hex("ink-kutchi"),
    // (a mode's own timers where it keeps them, so leaving it stops them: Cook's lifetime, js/cook/life.js)
    timeout: (fn, ms) => (C.life && C.life.setTimeout ? C.life.setTimeout(fn, ms) : G.setTimeout(fn, ms)),
    depth: () => (C.D ? C.D.fx + 4 : 44),
  };
}

async function review(S, { who, ok, x, y, size = 220, line, side = "left", k = 1, depth } = {}, E) {
  if (E.force && E.force() != null) ok = E.force();
  if (depth == null) depth = E.depth();
  const mood = ok ? "happy" : "frown";
  // never cut off by the view's edge (a phone shows less of the stage above the dish)
  const view = S.cameras && S.cameras.main && S.cameras.main.worldView;
  if (view && view.height) {
    const m = size * 0.08;
    y = Math.max(view.y + size / 2 + m, Math.min(view.bottom - size / 2 - m, y));
    x = Math.max(view.x + size / 2 + m, Math.min(view.right - size / 2 - m, x));
  }
  const tr = (o) => (S.track ? S.track(o) : o);
  const key = E.badge(S, who, mood, 256);
  const face = tr(S.add.container(x, y).setDepth(depth));
  const sh = S.add.graphics();
  sh.fillStyle(LOOK.shadow, LOOK.shadowA);
  sh.fillCircle(0, size * 0.035, size * 0.5);
  const img = S.add.image(0, 0, key).setDisplaySize(size, size);
  face.add([sh, img]);
  face.setScale(0.5).setAlpha(0);
  face.mood = mood;
  await E.tween(S, { targets: face, scale: 1, alpha: 1, duration: 340, ease: "Back.easeOut" });
  if (E.mood) E.mood(ok ? "happy" : "not-quite");
  let card = null;
  if (ok) {
    E.right();
    if (S.sparkle) S.sparkle(x, y + size * 0.35);
    S.tweens.add({ targets: face, y: y - size * 0.06, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeOut" });
    const said = line === false ? null : line || E.welldone();
    if (said) {
      const t = S.add.text(0, 0, E.plain(said).trim(), { fontFamily: E.font(), fontSize: `${LOOK.font}px`, fontStyle: "800", color: E.ink() }).setOrigin(0.5);
      const w = t.width + LOOK.cardPad;
      const h = LOOK.cardH;
      const dir = side === "right" ? 1 : -1;
      card = tr(S.add.container(x + dir * (size * 0.5 + (LOOK.gap + w / 2) * k), y).setDepth(depth + 0.5).setScale(k).setAlpha(0));
      const g = S.add.graphics();
      g.fillStyle(LOOK.shadow, LOOK.cardShadowA);
      g.fillRoundedRect(-w / 2, -h / 2 + 3, w, h, LOOK.radius);
      g.fillStyle(LOOK.card, 1);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, LOOK.radius);
      card.add([g, t]);
      S.tweens.add({ targets: card, alpha: 1, duration: 200 });
      await E.wait(500); // CHAI-107: the last glass's ring is heard before the praise (the family voice mutes a long effect)
      await Promise.race([Promise.resolve(E.speak(said)).catch(() => {}), E.wait(2200)]);
    } else await E.wait(900);
    await E.wait(400);
  } else {
    // not quite: a gentle frown and a small shake of the head (never a red cross)
    E.soft();
    await E.tween(S, { targets: face, angle: { from: -5, to: 5 }, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeInOut" });
    face.setAngle(0);
    await E.wait(600);
  }
  const hold = E.hold && E.hold();
  if (hold) await new Promise((r) => E.timeout(r, hold));
  const close = async () => {
    const all = [face, card].filter((o) => o && o.active);
    if (!all.length) return;
    await E.tween(S, { targets: all, alpha: 0, scale: 0.85, duration: 260, ease: "Sine.easeIn" });
    all.forEach((o) => o.destroy());
  };
  return { face, card, close };
}

/*
 * CHAI-08's flaw (the judge, 20 Oct: "Nana's face badge sits over the glass that was just filled"): each face at its dish's upper
 * left, over the rim's edge only, sized so it never reaches the next dish (a share of the closest two dishes' spacing, between a
 * floor and a ceiling; one dish alone: its own size); the praise card goes right of the last face, or, where that card would run off
 * the view (four dishes: the last is the bottom right), left of the leftmost face. (s08 sweep, CK-07: a face stays inside o.left.)
 */
function layout(dishes, o = {}) {
  const L = Object.assign({ cardW: 230, cardGap: 18, gapK: 0.62, min: 96, max: 130, single: 150, offK: 0.74, maxGap: 400, left: -Infinity, right: 1600 }, o);
  let gap = L.maxGap;
  dishes.forEach((a, i) => dishes.forEach((b, j) => j > i && (gap = Math.min(gap, Math.hypot(a.x - b.x, a.y - b.y)))));
  const size = dishes.length > 1 ? Math.max(L.min, Math.min(L.max, gap * L.gapK)) : L.single;
  const off = (d) => (((d.w || 120) / 2 + size / 2) * L.offK);
  let praise = dishes.length - 1;
  let side = "right";
  const last = dishes[praise];
  if (last && last.x - off(last) + size / 2 + L.cardGap + L.cardW > L.right - 16) {
    praise = dishes.reduce((b, q, j) => (q.x < dishes[b].x ? j : b), 0);
    side = "left";
  }
  return dishes.map((d, i) => ({ x: Math.max(L.left + size / 2 + 6, d.x - off(d)), y: d.y - off(d), size, side: i === praise ? side : "right", praise: i === praise }));
}

/** Every face at once over its dish; the praise said once, by the praise face, and only when every dish is right. */
function faces(S, dishes, wrong, o = {}, E) {
  const at = layout(dishes, o);
  const allOk = !wrong.length;
  return Promise.all(
    dishes.map((d, i) =>
      review(S, { who: d.who, ok: !wrong.includes(i), x: at[i].x, y: at[i].y, size: at[i].size, side: at[i].side, line: allOk && at[i].praise ? undefined : false, k: o.k, depth: o.depth }, E)
    )
  );
}

/** Decision 51 (CK-23): the tick, the faces, the recast, and each wrong dish redone (or, at its third wrong try, shown). */
async function round(o) {
  let n = 0;
  let open = o.items.slice();
  for (;;) {
    await o.done(n);
    const recasts = [];
    for (const item of o.items) {
      if (!open.includes(item)) continue; // a right dish stays done
      const r = o.check(item, n) || {};
      if (!r.ok) recasts.push({ item, rows: r.rows });
      else if (o.onRight) o.onRight(item, n);
    }
    const looks = await o.review(recasts.map((r) => r.item), n);
    if (recasts.length) {
      if (!n && o.oops) await o.oops();
      for (const { item, rows } of recasts) await o.recast(item, rows);
    }
    await Promise.all((looks || []).map((l) => l && l.close && l.close()));
    if (o.afterReview) o.afterReview(n);
    if (!recasts.length || !o.redo) break;
    const again = [];
    for (const { item } of recasts) {
      const r = o.redo.wrong(o.key(item));
      if (r && r.action === "show") await o.showRight(item);
      else again.push(item);
    }
    if (!again.length) break;
    n++;
    again.forEach((item) => o.reset(item));
    open = again;
    if (o.again) o.again(again, n);
  }
  return { rounds: n + 1 };
}

/** The kit bound to a mode's namespace: NjgServe.for(Cook).review(S, o), .faces(S, dishes, wrong, o), .round(o). */
function bound(C, win) {
  const E = env(C, win);
  return { review: (S, o) => review(S, o, E), faces: (S, d, w, o) => faces(S, d, w, o, E), round, layout, env: E };
}

export const NjgServe = { review, layout, faces, round, env, for: bound, LOOK };
if (typeof globalThis !== "undefined") globalThis.NjgServe = NjgServe;
export default NjgServe;
