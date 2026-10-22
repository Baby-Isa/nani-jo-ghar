/*
 * H-eye (clinic v2; the 1 Oct play-test D15h, decision 27; CLN-59 to CLN-63; Sprint 11, s11-clinic: the flash cards).
 *
 * Why: "I can't see well." / "Drops first, then let's test your eyes."
 * 1. Drops, in a front close-up of the eyes: only the sore eye is red (CLN-59); pick the dropper and it hangs over
 *    the sore eye; tap to drop, the count on the dropper (D6). From level 2 each eye has its own count (CLN-187).
 *    Sprint 11 (Zafar, 22 Oct: no Next and no Done anywhere): the drops close by themselves at the count, at every level
 *    (an extra tap on a full eye doesn't land), and the test comes on by itself (the old "to the eye test" button and the
 *    corner chart are gone). The counts are then hand skill, not judged (the leak bot's skill rows).
 * 2. The eye test (Sprint 11, easy-to-play.md B-clinic; Zafar, 21 Oct): the chart is retired (its rows, versions A/B).
 *    She sits close up on the left covering one eye (art testA); the doctor holds up ONE big word card at a time
 *    (js/shared/word-card.js WordCard.card) on a stand on the right (the hand-held card art comes from the art run).
 *    The cards are Cook's words the family has recorded (rule 10: chai, dudh, paani and the rest join by themselves once
 *    Mum records them: WAITING below). She says her guess every 1.5 s until the child taps big haa or na (or says it:
 *    js/shared/speech.js Speech.listen, the mic beside the pills; the pills always work). She is right or wrong, half
 *    and half. The first card is the demo (she is right; unscored); four judged cards follow (a blind "always haa" wins
 *    1 in 16, 6.25%). A wrong judgement: the pill shakes red, the card shakes gently and the doctor names the card. A
 *    misread (judged na, or a haa put right) brings the dropper over her open eye (CLN-62, the redrop Zafar liked): one
 *    tap and she says it right. No Next, no Done: each card moves on by itself (NjgButtons.moveOn).
 *    The card's slots fade by the word's stage (English, then the Kutchi text; the speaker always). The picture is the
 *    eye test itself, so it always shows. Rule 6 (the leak test past support): while the word is past support (stage
 *    3+) the card's strip (its Kutchi, its English and its speaker, which would say the answer) is held back until the
 *    card is judged, and her guess is heard only (dots in her bubble); while supported, matching text is study.
 * 3. Onboarding (Sprint 11, principle 3): the demo card's haa pill shows itself the first time (Onboard.stuck's 0 s
 *    rung: the real pill lifts); stuck, the 5 s rung spotlights the pills (all else inert) and the whole pill row lifts
 *    (never the answer), the 15 s rung lifts it again and she says her guess again.
 * Rows (the words decide): each judged card. The drops are hand-skill rows.
 * Art swaps in by file name: data art.* (the art plan's Y1-Y3 eyes, T1 eye test) once ready.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the cards' pictures: Cook's words, each by its lexicon id (HS.pic: the clinic's art where it has the thing, CLN-78)
  // EY10 (CLN-107): water is Cook's blue drop (the steel jug read as milk next to the milk jug)
  // CLN-189 (Zafar, 18 Oct: "an orange, not a lemon"): limu is the whole yellow lemon (s08b LM1)
  const PIC = { "cook-paani": "assets/cook/items/icon-cook-paani.webp", "fru-02": "assets/clinic/items-s08b/lemon-whole-s08b.webp" };
  // Sprint 11: the words the family has recorded on their own (rule 10), and the kitchen words that join by themselves the
  // day the engine has a family clip for them (HS.recorded). cook-chai waits for a picture too (its icon reads green to the
  // colour check, CLN-189)
  const POOL = ["fru-02", "veg-02", "veg-03", "veg-12"];
  const WAITING = ["cook-dudh", "cook-paani", "veg-01", "veg-13", "veg-14"];
  const thing = (lex) => ({ id: lex, lex, icon: PIC[lex] || HS.pic(lex) });
  const ALL = POOL.concat(WAITING).map(thing);
  const BY = Object.fromEntries(ALL.map((t) => [t.id, t]));
  const things = () => POOL.concat(WAITING.filter((lex) => HS.recorded(lex))).map((lex) => BY[lex]);
  const RID = (i) => `card-${"abcdef"[i]}`; // a judged card's scored id (the review lists it under the eye-test row)
  const W = (t) => HS.L.w(t.lex);
  // CLN-187 (clinic decision 8): from bothFrom a count for each eye. wrongP (Sprint 11): she misreads half the cards, so a
  // blind "always haa" (or "always na", or a coin) wins 1 in 16 rounds (0.5^4 = 6.25%: under the leak test's 10% with room
  // at the checks' 500 rounds; 0.45 gave 9.15%, a coin's toss from the line)
  const K = { drops: { 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3], 4: [1, 2, 3] }, bothFrom: 2, cards: 4, wrongP: 0.5, sayEveryMs: 1500 };
  const WHY = { problem: "eye-why", goal: "eye-goal" }; // line keys in data/clinic/heal/eye.json (the engine says them)
  // first-time help: drops keep the ghost finger (S.cue); the card's help is the real pill (Onboard.stuck), so its cue only
  // names the step (watch: S.cue logs it, nothing more)
  const CUES = {
    drops: { gesture: "tap", then: "tap" },
    card: { gesture: "tap" },
    redrop: { gesture: "tap" },
  };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(4, level));
    // D10 (1 Oct): sides are said and tested in the diagnosis only: no side row, no "cover the other eye"
    const side = null;
    const drops = HS.pick(K.drops[L], rng);
    // CLN-187: from level 2 a count for each eye (the patient's own right and left); level 1 the sore eye alone
    const both = L >= K.bothFrom ? { right: drops, left: HS.pick(K.drops[L], rng) } : null;
    // the cards: the demo, then K.cards judged; never the same thing twice running
    const pool = things();
    const cards = [];
    let deck = HS.shuffle(pool, rng);
    for (let i = 0; i <= K.cards; i++) {
      if (!deck.length) deck = HS.shuffle(pool, rng);
      let k = deck.findIndex((t) => !cards.length || t.id !== cards[cards.length - 1].id);
      if (k < 0) k = 0;
      const t = deck.splice(k, 1)[0];
      const demo = i === 0;
      const wrong = !demo && rng() < K.wrongP;
      const said = wrong ? HS.pick(pool.filter((x) => x.id !== t.id), rng).id : t.id;
      cards.push({ id: t.id, said, wrong, demo, i });
    }
    const Lg = HS.L;
    const steps = [];
    // each eye's row: its side on the eye noun, then the drops and their count, built by the engine (grey English where
    // a word is still to record)
    const eyeRow = (sd, n) => Object.assign({ id: `drops-${sd}`, side: sd }, Lg.show(Lg.join([Lg.item("body-eye", { mods: [Lg.sideId(sd)] }), ",", "cl-drops", Lg.count(n)]), { cap: true }));
    const cardRows = both ? [eyeRow("right", both.right), eyeRow("left", both.left)] : [Object.assign({ id: "drops" }, Lg.show(Lg.join(["cl-drops", Lg.count(drops)]), { cap: true }))];
    // CLN-187 (s08-w6c): from level 3 the card is closed and its strip shows one step's line: both eyes' counts in one line
    const eyeParts = (sd, n) => [Lg.item("body-eye", { mods: [Lg.sideId(sd)] }), ",", "cl-drops", Lg.count(n)];
    const strip = both && L >= 3 ? Object.assign({ id: "drops-both" }, Lg.show(Lg.join(eyeParts("right", both.right).concat([","], eyeParts("left", both.left))), { cap: true })) : null;
    steps.push({ id: "drops", kind: "drops", count: both ? both.right + both.left : drops, both, side, row: cardRows[0], cardRows, strip });
    cards.forEach((c) => steps.push({ id: `card${c.i}`, kind: "card", card: c }));
    // the drops close at the count by themselves (Sprint 11): hand skill, not a judgement
    const rows = both ? [{ id: "drops-right", skill: true, answer: true }, { id: "drops-left", skill: true, answer: true }] : [{ id: "drops-count", skill: true, answer: true }];
    // each judged card: "card-a" ... (the end review lists them under the card's eye-test row, D14)
    cards.filter((c) => !c.demo).forEach((c, k) => rows.push({ id: RID(k), options: [true, false], answer: !c.wrong }));
    const words = (both ? [Lg.num(both.right), Lg.num(both.left), Lg.w(Lg.sideId("right")), Lg.w(Lg.sideId("left"))].filter((w, k, a) => a.findIndex((x) => x.kutchi === w.kutchi && x.english === w.english) === k) : [Lg.num(drops)]).concat([Lg.w(Lg.yesId()), Lg.w(Lg.noId())]);
    const seen = new Set();
    cards.forEach((c) => [c.id, c.said].forEach((id) => !seen.has(id) && seen.add(id) && words.push(W(BY[id]))));
    return { level: L, side, steps, rows, cards, both, words };
  }

  function mount(stage, ctx) {
    const data = ctx.data || {};
    const P = plan(ctx.level, ctx.rng);
    // CLN-118 (D13), SH-99, CLN-161: the taught first round writes and says every count too, and its word review keeps them
    if (ctx.taught) P.words = HS.taughtWords(P.words).concat(P.words.filter((w) => w && w.n != null));
    // S03 (review flaw 5): on a tablet (4:3, 1180x820) the close-up's crop cut the sore eye at the screen's edge: a
    // wider safe area there keeps both eyes whole
    const tablet = (root.innerWidth || 0) / Math.max(1, root.innerHeight || 0) < 1.5;
    const SAFE = tablet ? [50, 790] : [80, 720];
    const S = HS.make(stage, ctx, Object.assign({ place: "head", game: "eye" }, tablet ? { safe: SAFE } : {}));
    const { s } = S;
    const Kit0 = root.Clinic && root.Clinic.Kit;
    const url = (u) => (Kit0 && Kit0.url ? Kit0.url(u) : u);
    const fast = () => !!(Kit0 && Kit0.fast);
    const kind = S.kind || (ctx.patient && ctx.patient.kind) || "girl";
    const art = (key) => {
      const a = data.art && data.art[key];
      // A1: a {kind} picture only for the kinds that have it cut (a.kinds); the @2x on dense screens (a.has2x)
      if (!a || !a.ready || !a.src || (a.kinds && a.src.includes("{kind}") && !a.kinds.includes(kind))) return null;
      // (a.always2x: a picture drawn far bigger than its 1x, the s11 doctor holding the card: ART-05, contract-11)
      const two = a.has2x && (a.always2x || (root.devicePixelRatio || 1) > 1.25);
      return Object.assign({}, a, { src: a.src.replace("{kind}", kind).replace(two ? /\.webp$/ : /$^/, "@2x.webp") });
    };
    const st = { i: 0, drops: 0, n: { right: 0, left: 0 }, nowEye: "right", judged: {}, over: false, busy: false, awaiting: null, redrop: null, view: "drops", gone: false, listening: false };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.filter((x) => x.kind === "drops").flatMap((x) => x.cardRows || [x.row]).concat([Object.assign({}, HS.L.w("eye-test", { cap: true }), { id: "chart" })]));
    const skin = S.skin || "#c99a74";
    const skinDark = S.skinDark || "#a77b58";
    const hair = S.hairCol || "#2b1d16";
    const clothes = S.clothes || "#3f7fcf";
    // the sore eye: the patient's own side from the diagnosis (their right is on our left), else their right
    const soreSide = ctx.side === "left" ? "left" : "right";
    const wait = (ms) => new Promise((r) => ctx.after(ms, r));

    const tween = (ms, fn) =>
      new Promise((res) => {
        if (fast() || !root.requestAnimationFrame) {
          fn(1);
          return res();
        }
        const t0 = Date.now();
        const step = () => {
          if (st.gone) return res();
          const u = Math.min(1, (Date.now() - t0) / ms);
          fn(u);
          if (u < 1) root.requestAnimationFrame(step);
          else res();
        };
        step();
      });

    /* ---------------- 1. the drops: the eyes, front on (Y1/Y2/Y3; a drawn stand-in until ready) ---------------- */
    const dropsG = s("g", {}, S.layer);
    const EY = { right: { x: 255, y: 250 }, left: { x: 545, y: 250 } }; // the patient's own sides (facing us)
    // A1: with the cut eyes, where the picture puts them (art eyesSore.eyes: [right x, left x, y], measured in the cut)
    const EYA = art("eyesSore");
    if (EYA && EYA.eyes) {
      EY.right = { x: EYA.eyes[0], y: EYA.eyes[2] };
      EY.left = { x: EYA.eyes[1], y: EYA.eyes[2] };
    }
    const sore = EY[soreSide];
    // S02-G (gate s02-gate): the dropper hanging over the eye is the drop's target too
    const DROPPER_TAP = { y: sore.y - 34 - 60 };
    // the hanging dropper over an eye is that eye's tap too (CLN-187: from level 2 either eye takes drops)
    const onDropper = (p, e = sore) => Math.abs(p.x - e.x) <= 60 && p.y >= e.y - 34 - 150 && p.y <= e.y;
    const eyeSides = P.both ? ["right", "left"] : [soreSide];
    const eyeAt = (p) => {
      let best = null;
      eyeSides.forEach((sd) => {
        const e = EY[sd];
        const d = Math.hypot(p.x - e.x, (p.y - e.y) * 1.3);
        if ((d <= 140 || onDropper(p, e)) && (!best || d < best.d)) best = { sd, d };
      });
      return best ? best.sd : null;
    };
    // Y2 has the sore eye on the viewer's right (the patient's left): mirrored for the patient's right
    const eyesArt = art("eyesSore");
    let soreEl = null;
    let blinkEls = [];
    if (eyesArt) {
      const at = { x: eyesArt.box[0], y: eyesArt.box[1], width: eyesArt.box[2], height: eyesArt.box[3], preserveAspectRatio: "xMidYMid slice", transform: soreSide === "right" ? "translate(800 0) scale(-1 1)" : null };
      s("image", Object.assign({ href: url(eyesArt.src) }, at), dropsG);
      // A1: the clear eyes (Y1, registered to Y2) over them, coming in with each drop as the stand-in's red fades
      const clear = art("eyes");
      if (clear) soreEl = s("image", Object.assign({ href: url(clear.src), opacity: 0 }, at), dropsG);
      // the blink after a drop: Y3, both eyes closed, on the same canvas
      const shut = art("eyesClosed");
      if (shut) blinkEls.push(s("image", Object.assign({ href: url(shut.src), opacity: 0 }, at), dropsG));
    } else {
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: skin }, dropsG);
      s("path", { d: "M-400 -300 L1200 -300 L1200 40 Q400 -20 -400 40Z", fill: hair }, dropsG); // the hairline
      s("path", { d: "M400 300 Q382 400 360 452 Q400 472 440 452 Q418 400 400 300Z", fill: skinDark, opacity: 0.35 }, dropsG); // the nose
      ["right", "left"].forEach((sd) => {
        const e = EY[sd];
        const isSore = sd === soreSide;
        s("path", { d: `M${e.x - 105} ${e.y - 92} Q${e.x} ${e.y - 132} ${e.x + 105} ${e.y - 88}`, stroke: hair, "stroke-width": 16, fill: "none", "stroke-linecap": "round" }, dropsG); // the brow
        if (isSore) s("ellipse", { cx: e.x, cy: e.y, rx: 112, ry: 72, fill: "#e98f8f", opacity: 0.55 }, dropsG); // puffy pink lids
        s("ellipse", { cx: e.x, cy: e.y, rx: 92, ry: 54, fill: "#fff", stroke: "#7a4a32", "stroke-width": 4 }, dropsG);
        const red = s("ellipse", { cx: e.x, cy: e.y, rx: 90, ry: 52, fill: "#f08a8a", opacity: isSore ? 0.55 : 0 }, dropsG);
        if (isSore) soreEl = red;
        s("circle", { cx: e.x, cy: e.y, r: 34, fill: "#6a4a2a" }, dropsG);
        s("circle", { cx: e.x, cy: e.y, r: 15, fill: "#1a1010" }, dropsG);
        s("circle", { cx: e.x - 10, cy: e.y - 12, r: 7, fill: "#fff" }, dropsG);
        if (isSore) s("path", { d: `M${e.x - 92} ${e.y - 10} Q${e.x} ${e.y - 62} ${e.x + 92} ${e.y - 10} L${e.x + 92} ${e.y - 54} L${e.x - 92} ${e.y - 54}Z`, fill: skin, opacity: 0.9 }, dropsG); // the heavy lid
        blinkEls.push(s("ellipse", { cx: e.x, cy: e.y, rx: 96, ry: 58, fill: skin, opacity: 0 }, dropsG));
      });
    }
    // the dropper (the clinic v2 eye drops), hanging over the sore eye once picked
    const dropper = s("g", { opacity: 0 }, S.fx);
    // CLN-186: the re-cut bottle held nozzle down, cut off just under its nozzle, so the photo drop (s08b DP3) hangs there,
    // falls and splashes (data art.drop)
    const DA = data.art && data.art.drop && data.art.drop.bottle ? data.art.drop : null;
    const downArt = DA ? DA.bottle : Kit0 && Kit0.view ? Kit0.view("drop-bottle", "use-down") : null;
    const NOZ = DA ? DA.nozzle || 0.818 : 1; // the nozzle's end, a share of the bottle picture's height
    const BH = 118;
    if (DA) {
      const cid = `eye-noz-${Math.round(Math.random() * 1e9)}`;
      const cp = s("clipPath", { id: cid, clipPathUnits: "userSpaceOnUse" }, s("defs", {}, dropper));
      s("rect", { x: -40, y: -10 - NOZ * BH - 2, width: 80, height: NOZ * BH + 2 }, cp);
      s("image", { href: url(downArt), x: -30, y: -10 - NOZ * BH, width: 60, height: BH, "clip-path": `url(#${cid})` }, dropper);
    } else s("image", { href: url(downArt || "assets/clinic/items-v2/eye-drops.webp"), x: -30, y: -128, width: 60, height: 118, transform: downArt ? null : "rotate(180 0 -69)" }, dropper);
    const DROP = DA && DA.falling ? { w: DA.w || 11, h: (DA.w || 11) / (DA.aspect || 0.604) } : null;
    const hangDrop = DROP ? s("image", { href: url(DA.falling), x: -DROP.w / 2, y: -11, width: DROP.w, height: DROP.h }, dropper) : null;
    const ring = s("circle", { cx: 0, cy: 34, r: 40, fill: "none", stroke: "#f0b43c", "stroke-width": 6, opacity: 0 }, dropper); // round the eye
    let dropperAt = null;
    let bob = 0;
    // where the bottle hangs: `lift` units above the eye at scale `k`. The drops' close-up hangs it high over a big eye;
    // the eye test's redrop (CLN-62) hangs it smaller, its nozzle just over the open eye
    // s08 wave 7B (CLN-185): over the s08c close-up's smaller eyes the bottle hangs smaller too (art eyesSore.dropK)
    const HANG = { drops: { lift: 34, k: (EYA && EYA.dropK) || 1 }, redrop: { lift: 16, k: 0.78 } };
    const tipOf = (h) => h.lift * h.k + 10 * h.k; // the nozzle's height over the eye
    const showDropper = (at, pulse, hang = HANG.drops) => {
      dropperAt = at;
      dropper.setAttribute("opacity", at ? 1 : 0);
      ring.setAttribute("opacity", 0);
      if (!at) return;
      ring.setAttribute("cy", hang.lift);
      const id = ++bob;
      const t0 = Date.now();
      const step = () => {
        if (id !== bob || st.gone || !dropperAt) return;
        const t = (Date.now() - t0) / 1000;
        dropper.setAttribute("transform", `translate(${at.x} ${at.y - hang.lift * hang.k + Math.sin(t * 3) * 4 * hang.k}) scale(${hang.k})`);
        if (pulse) ring.setAttribute("opacity", 0.35 + 0.35 * Math.sin(t * 6));
        if (root.requestAnimationFrame && !fast()) root.requestAnimationFrame(step);
      };
      step();
    };
    const fallDrop = (at, hang = HANG.drops) => {
      const top = Math.max(18, tipOf(hang) - 4);
      if (DROP) {
        // CLN-186: the photo drop leaves the nozzle, falls onto the eye and splashes a little; a new drop forms after
        const k = hang.k;
        const w = DROP.w * k;
        const h = DROP.h * k;
        if (hangDrop) hangDrop.setAttribute("opacity", 0);
        const d = s("image", { href: url(DA.falling), x: at.x - w / 2, y: at.y - top, width: w, height: h }, S.fx);
        return tween(300, (u) => d.setAttribute("y", (at.y - top + (top - h * 0.7) * u * u).toFixed(1))).then(() => {
          d.remove();
          if (DA.splash) {
            const sw = (DA.splashW || 46) * k;
            const sh = sw / (DA.splashAspect || 2.02);
            const sp = s("image", { href: url(DA.splash), x: at.x - sw / 2, y: at.y - sh * 0.75, width: sw, height: sh, opacity: 0.85 }, S.fx);
            tween(260, (u) => sp.setAttribute("opacity", (0.85 * (1 - u)).toFixed(2))).then(() => sp.remove());
          }
          if (hangDrop) tween(300, (u) => hangDrop.setAttribute("opacity", u.toFixed(2)));
        });
      }
      const d = s("path", { d: "M0 -12 Q8 0 0 6 Q-8 0 0 -12Z", fill: "#7cc4f0", transform: `translate(${at.x} ${at.y - top})` }, S.fx);
      return tween(320, (u) => d.setAttribute("transform", `translate(${at.x} ${at.y - top + (top - 2) * u})`)).then(() => d.remove());
    };
    // CLN-187: each eye's own running count, the shared count badge beside the eye's outer corner (from level 2)
    const eyeCounts = [];
    const countEye = (sd, bump = true) => {
      let b = S.root.querySelector(`.eye-count[data-eye="${sd}"]`);
      if (!b) {
        b = S.h("span", "hs-count eye-count", S.root);
        b.dataset.eye = sd;
        b.setAttribute("aria-hidden", "true");
        eyeCounts.push(b);
      }
      const n = st.n[sd];
      b.classList.toggle("dots", P.level >= 3);
      b.textContent = P.level >= 3 ? "•".repeat(Math.min(n, 9)) : Kit0 && Kit0.num ? Kit0.num(n) : String(n);
      const e = EY[sd];
      // the patient's right eye is on our left: its badge on its outer (left) side, the other's on the right
      const off = EYA && EYA.eyeR ? EYA.eyeR[0] + 26 : 118;
      const c = S.client(e.x + (e.x < 400 ? -off : off), e.y - (EYA && EYA.eyeR ? EYA.eyeR[1] + 24 : 70));
      const rr = S.root.getBoundingClientRect();
      Object.assign(b.style, { left: `${c.x - rr.left}px`, top: `${c.y - rr.top}px`, translate: "-50% -50%" }); // (translate: the bump animates transform)
      if (!bump) return;
      b.classList.remove("bump");
      void b.offsetWidth;
      b.classList.add("bump");
    };
    let lastBlink = 0;
    const blink = () => {
      lastBlink = Date.now();
      blinkEls.forEach((b) => b.setAttribute("opacity", 1));
      ctx.after(fast() ? 30 : 220, () => blinkEls.forEach((b) => b.setAttribute("opacity", 0)));
    };
    // ART-19 (s08 wave 7B): at rest in the drops' close-up she blinks by herself now and then
    const selfBlink = () => {
      if (st.gone || st.over) return;
      if (st.view === "drops" && !st.busy && blinkEls.length && Date.now() - lastBlink > 1500) {
        lastBlink = Date.now();
        blinkEls.forEach((b) => b.setAttribute("opacity", 1));
        ctx.after(160, () => blinkEls.forEach((b) => b.setAttribute("opacity", 0)));
      }
      ctx.after(3000 + Math.random() * 2500, selfBlink);
    };
    if (eyesArt && !fast()) ctx.after(2600, selfBlink);

    /* ---------------- 2. the eye test: her close-up on the left, the card on its stand on the right ---------------- */
    const testG = s("g", { opacity: 0 }, S.layer);
    const SPLIT = (data.test && data.test.split) || 200;
    const a = art("testA");
    // the left panel: the patient, head and shoulders, a hand over the good eye, looking past us to our right
    const pan = s("g", {}, testG);
    s("rect", { x: -400, y: -300, width: SPLIT + 400, height: 1100, fill: "#e9dcc6" }, pan);
    if (a) s("image", { href: url(a.src), x: a.box[0], y: a.box[1], width: a.box[2], height: a.box[3], preserveAspectRatio: "xMidYMid slice" }, pan);
    else {
      s("path", { d: "M40 520 Q60 380 200 360 Q340 380 360 520Z", fill: clothes }, pan); // shoulders
      s("rect", { x: 175, y: 300, width: 50, height: 70, fill: skinDark }, pan); // neck
      s("ellipse", { cx: 200, cy: 205, rx: 108, ry: 124, fill: skin }, pan); // head
      s("path", { d: "M92 200 Q90 80 200 76 Q310 80 308 200 Q290 120 200 122 Q110 120 92 200Z", fill: hair }, pan);
      s("ellipse", { cx: 160, cy: 205, rx: 26, ry: 16, fill: "#fff", stroke: "#7a4a32", "stroke-width": 3 }, pan);
      s("circle", { cx: 172, cy: 205, r: 11, fill: "#3b2415" }, pan);
      s("path", { d: "M128 178 Q160 166 190 176", stroke: hair, "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, pan);
      const hand = s("g", {}, pan);
      [[214, 150, -18], [236, 146, -8], [258, 150, 4], [278, 160, 16]].forEach(([x, y, r]) => s("rect", { x: x - 11, y: y - 30, width: 22, height: 62, rx: 11, fill: skin, stroke: skinDark, "stroke-width": 3, transform: `rotate(${r} ${x} ${y + 20})` }, hand));
      s("ellipse", { cx: 248, cy: 214, rx: 44, ry: 48, fill: skin, stroke: skinDark, "stroke-width": 3 }, hand);
      s("path", { d: "M176 270 Q200 284 222 270", stroke: "#7a3a2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, pan); // a small smile
    }
    const readEye = a && a.eye ? { x: a.eye[0], y: a.eye[1] } : { x: 160, y: 205 };
    // the split, then the room on the right (the wall's own colours: the card stands in front of it)
    const WALLC = (data.art && data.art.wall) || {};
    s("rect", { x: SPLIT, y: -300, width: 14, height: 1100, fill: "#fffaf1" }, testG);
    s("rect", { x: SPLIT + 14, y: -300, width: 1000, height: 1100, fill: WALLC.fill || "#a9b4b8" }, testG);
    s("rect", { x: SPLIT + 14, y: 430, width: 1000, height: 700, fill: WALLC.floor || "#c3b6a6" }, testG);
    s("rect", { x: SPLIT + 14, y: 424, width: 1000, height: 8, fill: "#fffaf1", opacity: 0.55 }, testG); // the skirting

    // the stand and the card (HTML over the drawing: the shared word card), the big pills and the mic under it
    // Sprint 11 art (s11 pack, data art.doctorCard): the doctor standing, holding a big blank card; the word card sits in
    // its face (art.doctorCard.card: the face's x, y, w, h as shares of the picture). Without it, the drawn stand
    const DOC = (() => {
      const d = art("doctorCard");
      return d && d.card && d.size ? d : null;
    })();
    const stand = S.h("div", `eye-stand hidden${DOC ? " eye-doc" : ""}`, S.root);
    let docImg = null;
    if (DOC) {
      docImg = S.h("img", "eye-doc-img", stand);
      docImg.alt = "";
      docImg.draggable = false;
      docImg.src = url(DOC.src);
    }
    const holder = S.h("div", "eye-holder", stand);
    if (!DOC) S.h("div", "eye-easel", stand).setAttribute("aria-hidden", "true");
    const judgeBox = S.h("div", "hs-judge eye-judge", S.root);
    const NB = root.NjgButtons;
    const yesNo = { yes: HS.L.w(HS.L.yesId()).kutchi, no: HS.L.w(HS.L.noId()).kutchi };
    // CLN-152 (contract-21): the shared pills wire their own taps: each one is handed to the game, logged as an act
    const pills = NB ? NB.pills(judgeBox, [{ id: "yes", html: `<span class="eye-pill-t">${yesNo.yes}</span>` }, { id: "no", html: `<span class="eye-pill-t">${yesNo.no}</span>` }], (id) => (ctx.act && ctx.act(), onJudge(id === "yes", "pill"))) : null;
    const mk = (id, label) => {
      if (pills) {
        const b = pills.pill(id);
        b.dataset.judge = id;
        return b;
      }
      const b = S.h("button", "hs-tool", judgeBox);
      b.type = "button";
      b.dataset.judge = id;
      b.textContent = label;
      ctx.on(b, "click", () => onJudge(id === "yes", "pill"));
      return b;
    };
    const haaBtn = mk("yes", yesNo.yes);
    const naBtn = mk("no", yesNo.no);
    // principle 10 (Zafar, 21 Oct): saying haa or na is a play action (Speech.listen, on the device, the family's own
    // recordings as the templates); a miss is a shrug and the pills always work. The mic shows only where there is one.
    const SP = root.Speech;
    const VOICE = { yes: "eye-haa", no: "eye-na" };
    const micOk = !!(SP && SP.listen && root.navigator && root.navigator.mediaDevices && root.navigator.mediaDevices.getUserMedia && !(SP.status && ["refused", "absent"].includes(SP.status())));
    let mic = null;
    if (micOk) {
      mic = S.h("button", "eye-mic", judgeBox);
      mic.type = "button";
      mic.setAttribute("aria-label", "");
      mic.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
      // the family's clips of haa and na (the engine's clip plan) are the templates, loaded as the test opens
      const clips = (id) => {
        try {
          return (HS.L.w(id).plan || []).filter((p) => p.file).map((p) => url(p.file));
        } catch (e) {
          return [];
        }
      };
      st.loadVoice = () => {
        if (st.voiceAsked || !SP.loadTemplates) return;
        st.voiceAsked = true;
        [[VOICE.yes, HS.L.yesId()], [VOICE.no, HS.L.noId()]].forEach(([k, id]) => SP.hasTemplates && !SP.hasTemplates([k]) && SP.loadTemplates(k, clips(id)).catch(() => 0));
      };
      ctx.on(mic, "click", () => {
        if (!st.awaiting || st.busy || st.over || st.listening) return;
        ctx.act && ctx.act();
        st.listening = true;
        mic.classList.add("listening");
        // listen() starts inside this tap (iOS): no await before it
        const p = SP.listen({ choices: [VOICE.yes, VOICE.no], timeoutMs: 3500 });
        Promise.resolve(p)
          .catch(() => null)
          .then((res) => {
            st.listening = false;
            mic.classList.remove("listening");
            if (st.gone) return;
            if (res && res.choice) return onJudge(res.choice === VOICE.yes, "voice");
            // a shrug: nothing heard, nothing wrong
            mic.classList.remove("shrug");
            void mic.offsetWidth;
            mic.classList.add("shrug");
          });
      });
    }
    const showJudge = (on) => {
      judgeBox.classList.toggle("hidden", !on);
      if (on && pills && pills.fresh) pills.fresh(); // a new card: the pills take a tap at once (contract-21)
      if (on) place();
    };
    showJudge(false);
    // where the card stands: the middle of the room's panel, as big as the screen allows above the pills
    const px = (v) => `${Math.round(v)}px`;
    const place = () => {
      if (st.view !== "test" && !stand.classList.contains("on")) return;
      const rr = S.root.getBoundingClientRect();
      if (!rr.width || !rr.height) return;
      const x0 = Math.max(0, S.client(SPLIT + 14, 0).x - rr.left);
      const x1 = rr.width;
      const gap = parseFloat(root.getComputedStyle ? root.getComputedStyle(S.root).getPropertyValue("--njg-s3") : "") || 12;
      const jh = judgeBox.offsetHeight || 64;
      const top = gap;
      const room = rr.height - jh - gap * 3 - top; // the card and its ledge, above the pills
      const card = holder.firstElementChild;
      if (DOC) {
        // the doctor as tall as lets the card's face end above the pills (his legs go off the bottom), no wider than the
        // room's panel; the word card fills the face, its picture and its strip side by side
        const [iw, ih] = DOC.size;
        const f = DOC.card;
        const H = Math.min(room / (f.y + f.h), ((x1 - x0) * 0.96 * ih) / iw);
        const Wd = (H * iw) / ih;
        const cx = (x0 + x1) / 2;
        Object.assign(stand.style, { left: px(cx - Wd / 2), top: px(top), width: px(Wd), height: px(H) });
        Object.assign(holder.style, { left: px(f.x * Wd), top: px(f.y * H), width: px(f.w * Wd), height: px(f.h * H) });
        judgeBox.style.left = px(cx);
        judgeBox.style.width = "max-content";
        return;
      }
      let w = Math.min((x1 - x0) * 0.58, room * 1.2);
      holder.style.width = px(w);
      if (card) {
        // the strip keeps its height: the picture (4:3) gives what's left, so the whole card fits
        const h = card.offsetHeight;
        if (h > room) w = Math.max(120, w - ((h - room) * 4) / 3);
        holder.style.width = px(w);
      }
      const cx = (x0 + x1) / 2;
      Object.assign(stand.style, { left: px(cx - w / 2), top: px(top), width: px(w), height: px(rr.height - top) });
      judgeBox.style.left = px(cx);
      judgeBox.style.width = "max-content";
    };
    ctx.on(root, "resize", () => {
      place();
      mouthPlace();
    });

    const judge = (id, ok, detail) => {
      if (id in st.judged) return;
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    // s08 w6N fix: the test's view takes in her whole open eye where the close-up's would cut it (tablets)
    const vbOf = () => (S.svg.getAttribute("viewBox") || "0 0 800 500").split(/[\s,]+/).map(Number);
    const camera = (safe) => {
      const a0 = vbOf();
      S.setSafe(safe);
      const b = vbOf();
      S.svg.setAttribute("viewBox", a0.join(" "));
      return (u) => S.svg.setAttribute("viewBox", a0.map((v, k) => (v + (b[k] - v) * u).toFixed(1)).join(" "));
    };
    const testSafe = () => (tablet && readEye && readEye.x - 48 < SAFE[0] ? [readEye.x - 48, SAFE[1]] : null);
    const toTest = async () => {
      // the camera pulls back from the eyes to the test (a cross-fade; the art batch makes it a cut, art plan 2.1)
      st.busy = true;
      showDropper(null);
      S.tools([], null);
      if (st.loadVoice) st.loadVoice();
      const wide = testSafe();
      const cam = wide ? camera(wide) : null;
      await tween(450, (u) => {
        dropsG.setAttribute("opacity", 1 - u);
        testG.setAttribute("opacity", u);
        if (cam) cam(u);
      });
      if (cam) cam(1);
      st.view = "test";
      stand.classList.remove("hidden");
      stand.classList.add("on");
      st.busy = false;
    };
    // CLN-107: a line of hers starts only once the one before it is said
    const after = (prev, fn) => Promise.resolve(prev).catch(() => {}).then(() => (st.gone ? null : fn()));
    const lineOf = (id) => HS.L.show(HS.L.join([BY[id].lex]));
    // her bubble under her mouth: her guess written while the word is supported (stage 1-2: study), else talking dots
    const mouthAt = () => (readEye ? { x: readEye.x + 40, y: readEye.y + 92 } : null);
    let mouthEl = null;
    const mouthPlace = () => {
      const m = mouthAt();
      if (!mouthEl || !m) return;
      const c = S.client(m.x, m.y);
      const rr = S.root.getBoundingClientRect();
      mouthEl.style.left = px(c.x - rr.left);
      mouthEl.style.top = px(c.y - rr.top);
    };
    const mouthSay = (text) => {
      S.root.querySelectorAll(".eye-said").forEach((n) => n.remove());
      if (!mouthAt()) return;
      const el = (mouthEl = S.h("div", `eye-said${text ? "" : " talk"}`, S.root, text || ""));
      if (!text) {
        el.innerHTML = "<i></i><i></i><i></i>";
        // ART-18 (contract-14): the talking dots move by the one shared talk animation (Lifecycle.talk)
        const T = root.Lifecycle && root.Lifecycle.talk;
        if (T) el.querySelectorAll("i").forEach((d) => T.dom(d));
      }
      mouthPlace();
      ctx.after(fast() ? 120 : 1100, () => el.classList.add("fade"));
      ctx.after(fast() ? 300 : 1800, () => el.remove());
    };

    /* ---- the card ---- */
    let cardEl = null;
    let stuck = null;
    const stageOf = (id) => HS.stageOf(id);
    const supported = (id) => stageOf(id) <= 2;
    const makeCard = async (c) => {
      const WC = await HS.wordCardKit().catch(() => null);
      if (st.gone) return null;
      holder.innerHTML = "";
      const t = BY[c.id];
      const w = W(t);
      const stg = stageOf(t.id);
      const word = {
        id: t.id,
        kutchi: w.kutchi,
        english: w.english,
        rec: !!w.placeholder,
        picture: { src: url(t.icon), fit: "contain" },
        // the speaker: the doctor says the card's word (the family's clip on the one voice path)
        say: () => ctx.say(lineOf(t.id), { who: "doctor", noBubble: true }),
      };
      let el;
      if (WC && WC.card) {
        // the picture is the test itself: always shown; the Kutchi text and English fade by the word's stage
        const sl = WC.slots(stg, { placeholder: word.rec });
        el = WC.card(holder, word, { stage: stg, progress: HS.progress() || undefined, slots: { picture: true, english: sl.english, kutchiText: sl.kutchi }, cls: "eye-card" });
      } else {
        // (no shared card on the page: the picture alone)
        el = S.h("section", "wc wc-card eye-card", holder);
        const im = S.h("img", null, S.h("div", "wc-slot wc-pic", el));
        im.alt = "";
        im.src = word.picture.src;
      }
      el.dataset.card = String(c.i);
      // rule 6: past support the strip (its Kutchi, English and speaker) waits until the card is judged
      el.classList.toggle("eye-hush", !supported(t.id));
      el.classList.add("eye-in");
      ctx.after(fast() ? 50 : 500, () => el.classList.remove("eye-in"));
      return el;
    };
    const unhush = () => cardEl && cardEl.classList.remove("eye-hush");
    const shakeCard = () => {
      if (!cardEl) return;
      cardEl.classList.remove("eye-shake");
      void cardEl.offsetWidth;
      cardEl.classList.add("eye-shake");
    };
    // the doctor names the card (its word, the family's clip), after her line
    const nameCard = (c) => {
      unhush();
      if (cardEl) cardEl.classList.add("eye-named");
      st.reading = after(st.reading, () => (cardEl && cardEl.wc ? cardEl.wc.speak() : ctx.say(lineOf(c.id), { who: "doctor", noBubble: true })));
      return st.reading;
    };
    // she says her guess every 1.5 s until it is judged (never while the mic listens)
    const guessLoop = async (c) => {
      const me = c;
      while (!st.gone && st.awaiting && st.awaiting.c === me) {
        if (st.listening || st.busy) {
          await wait(200);
          continue;
        }
        const t0 = Date.now();
        S.face("read");
        mouthSay(supported(me.id) && supported(me.said) ? String(W(BY[me.said]).kutchi || "") : null);
        await (st.reading = after(st.reading, () => ctx.say(lineOf(me.said), { who: "patient", noBubble: true })));
        S.face("neutral");
        await wait(fast() ? 400 : Math.max(600, K.sayEveryMs - (Date.now() - t0)));
      }
    };
    const openCard = async (c) => {
      if (st.view !== "test") await toTest();
      if (st.gone) return;
      if (c.i === 0) ctx.card.now("chart");
      cardEl = await makeCard(c);
      if (st.gone) return;
      place();
      st.awaiting = { c, wrong: c.wrong };
      showJudge(true);
      S.cue("card", Object.assign({ watch: true }, CUES.card), haaBtn); // (the step's name for the help log: the demo is the real pill)
      // principle 3: the rungs. The demo card's haa shows itself the first time (it is right: never haa on a misread, CLN-60);
      // a judged card's rungs lift the whole pill row, never the answer (the leak test: no winning by waiting)
      if (root.Onboard && root.Onboard.stuck && ctx.onboardOn !== false) {
        if (stuck) stuck.stop();
        // each live control has its own hole and glow (Zafar, 22 Oct): never one box round the row (the doctor's trousers lit in the gaps)
        const live = mic ? [haaBtn, naBtn, mic] : [haaBtn, naBtn];
        // the rungs count from this card coming up (her guess, not the child, was the last thing)
        if (root.NaniGuide && root.NaniGuide.poke) root.NaniGuide.poke();
        // the real pill (or row) lifts; the ghost hand rides at its lower right corner, never over its word (EASY-09)
        const mover = c.demo ? haaBtn : judgeBox;
        const mr = mover.getBoundingClientRect();
        stuck = root.Onboard.stuck(c.demo ? "eye-card-demo" : "eye-card", {
          id: c.demo ? "clinic/heal-eye-card-demo" : "clinic/heal-eye-card",
          first: c.demo,
          target: live,
          live,
          item: { x: mr.right - Math.min(14, mr.width * 0.1), y: mr.bottom - Math.min(8, mr.height * 0.15) },
          move: (dx, dy, t) => {
            const lift = t > 0.06 && t < 0.94 ? 1.06 : 1;
            mover.style.translate = dx || dy ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : "";
            mover.style.scale = lift === 1 ? "" : String(lift);
          },
          path: { dx: 0, dy: -22 },
          hand: true,
          line: () => (st.awaiting && st.awaiting.c === c ? ctx.say(lineOf(c.said), { who: "patient", noBubble: true }) : null),
        });
      }
      guessLoop(c);
    };
    const nextCard = () => {
      if (stuck) stuck.done();
      stuck = null;
      st.busy = true;
      return NjgButtonsMoveOn(() => {
        st.busy = false;
        advance();
      });
    };
    const NjgButtonsMoveOn = (fn) => (NB && NB.moveOn ? NB.moveOn(fn, { ms: fast() ? 120 : 900, ready: st.reading, cap: 4000, reason: "eye-card" }) : wait(fast() ? 120 : 900).then(fn));
    const onJudge = async (saysRight, via = "pill") => {
      if (!st.awaiting || st.busy || st.over || st.redrop) return;
      const { c, wrong } = st.awaiting;
      S.uncue();
      S.did();
      const ok = saysRight === !wrong;
      if (!c.demo) {
        const k = P.cards.filter((x) => !x.demo).indexOf(c);
        judge(RID(k), ok, { said: saysRight ? yesNo.yes : yesNo.no, via, cue: supported(c.id) ? "text" : cardEl && cardEl.wc ? cardEl.wc.cue() : "kutchi" });
      }
      if (!ok) {
        // EY13, decision 59 (CLN-107): a wrong yes / no shakes red, the card shakes gently and the doctor names it; the
        // child judges again (the first judgement is what's scored); a misread then gets the drop
        const b = saysRight ? haaBtn : naBtn;
        b.classList.remove("nope-red");
        void b.offsetWidth;
        b.classList.add("nope-red");
        ctx.after(fast() ? 200 : 600, () => b.classList.remove("nope-red"));
        shakeCard();
        nameCard(c);
        if (!wrong) return; // she read it right: the pills stay live
        st.awaiting = null;
        showJudge(false);
        return redropFor(c);
      }
      st.awaiting = null;
      showJudge(false);
      if (wrong) {
        // CLN-62: she misread and the child said na: the doctor names it, then the dropper for her eye, then she says it right
        nameCard(c);
        return redropFor(c);
      }
      // she said it right and the child said so: the card glows gold, its word shows, and the next one comes up
      unhush();
      if (cardEl) cardEl.classList.add("eye-ok");
      S.face("happy", 700);
      nextCard();
    };
    const redropFor = (c) => {
      st.redrop = { c };
      showDropper(readEye, true, HANG.redrop);
      S.cue("redrop", CUES.redrop, { x: readEye.x, y: readEye.y - tipOf(HANG.redrop) / 2, r: 52 });
    };
    const readAgain = async (c) => {
      // after the drop she sees it: she says the card's own word, then the next card
      S.face("read");
      mouthSay(supported(c.id) ? String(W(BY[c.id]).kutchi || "") : null);
      await (st.reading = after(st.reading, () => ctx.say(lineOf(c.id), { who: "patient", noBubble: true })));
      S.face("happy", 700);
      if (cardEl) cardEl.classList.add("eye-ok");
      nextCard();
    };
    const advance = () => {
      st.i++;
      const c = cur();
      if (!c) return finish();
      open();
    };
    const open = async () => {
      const c = cur();
      if (c.kind === "drops") {
        ctx.card.now(c.both ? "drops-right" : "drops", c.strip ? { strip: c.strip } : {});
        const te = c.both ? EY.right : sore; // CLN-187: from level 2 the first row's eye (the patient's right)
        return S.cue("drops", CUES.drops, () => S.toolEls.drops, { target: { x: te.x, y: te.y - 55, r: 110 } }); // S02-G: the dropper and the eye
      }
      if (c.kind === "card") return openCard(c.card);
    };
    const closeDrops = () => {
      const c = cur();
      if (!c || c.kind !== "drops") return;
      if (c.both) {
        ["right", "left"].forEach((sd) => {
          judge(`drops-${sd}`, true, `${st.n[sd]} of ${c.both[sd]}`);
          ctx.card.tick(`drops-${sd}`);
        });
        eyeCounts.forEach((b) => b.remove());
      } else {
        judge("drops-count", true, `${st.drops} of ${c.count}`);
        ctx.card.tick("drops");
      }
      S.uncue();
      advance();
    };
    const finish = async () => {
      st.over = true;
      if (stuck) stuck.done();
      S.uncue();
      showJudge(false);
      showDropper(null);
      ctx.card.tick("chart");
      ctx.card.now(null);
      // CLN-62 (P88): after the last card she looks up, both eyes open and clear, happy, and says "I can see!"
      S.root.querySelectorAll(".eye-said").forEach((n) => n.remove());
      await Promise.resolve(st.reading).catch(() => {});
      if (st.gone) return;
      stand.classList.remove("on");
      stand.classList.add("hidden");
      if (soreEl) soreEl.setAttribute("opacity", eyesArt ? 1 : 0);
      const cam = camera(null); // the close-up's own crop again
      await tween(450, (u) => {
        testG.setAttribute("opacity", 1 - u);
        dropsG.setAttribute("opacity", u);
        cam(u);
      });
      cam(1);
      st.view = "drops";
      S.face("happy");
      blink();
      const said = S.say("eye-better", "patient");
      await Promise.race([Promise.resolve(said).catch(() => {}), wait(fast() ? 1200 : 4000)]);
      await wait(900);
      if (st.gone) return;
      ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words });
    };

    // CLN-186: the re-cut bottle in the strip too (data art.drop.tool)
    S.tools([{ id: "drops", glyph: "💧", img: (DA && DA.tool) || "assets/clinic/items-v2/eye-drops.webp" }], (id) => {
      if (id === "drops" && cur() && cur().kind === "drops") showDropper(sore, false);
    });
    const dropIn = async (at, hang) => {
      await fallDrop(at, hang);
      S.face("wince", 400);
      blink();
    };
    const full = (c, sd) => (c.both ? st.n[sd] >= c.both[sd] : st.drops >= c.count);
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      if (st.redrop) {
        if (Math.hypot(p.x - readEye.x, p.y - (readEye.y - 40)) > 90) return;
        const cc = st.redrop.c;
        st.redrop = null;
        S.uncue();
        st.busy = true;
        dropIn(readEye, HANG.redrop).then(() => {
          showDropper(null);
          st.busy = false;
          readAgain(cc);
        });
        return;
      }
      if (c.kind !== "drops") return;
      if (S.sel !== "drops") return;
      const sd = eyeAt(p);
      if (!sd) return;
      // principle 4: a count ends at the right number; an extra drop on a full eye doesn't land
      if (full(c, sd)) return;
      const eye = EY[sd];
      st.drops++;
      st.n[sd]++;
      if (c.both) {
        // CLN-187: the dropper goes to the eye tapped; each eye keeps its own count beside it, and the card's lit row
        // follows the eye still short of its count
        if (dropperAt !== eye) showDropper(eye, false);
        const short = ["right", "left"].find((x) => st.n[x] < c.both[x]);
        if (short && short !== st.nowEye) ctx.card.now(`drops-${(st.nowEye = short)}`, c.strip ? { strip: c.strip } : {});
        ["right", "left"].forEach((x) => (x === sd || st.n[x] > 0) && countEye(x, x === sd));
      } else {
        ctx.tally("drops", st.drops);
        if (ctx.level >= 3) S.count(st.drops);
      }
      dropIn(eye);
      const k = st.n[soreSide];
      if (sd === soreSide && soreEl && eyesArt) soreEl.setAttribute("opacity", Math.min(1, 0.34 * k));
      else if (sd === soreSide && soreEl) soreEl.setAttribute("opacity", Math.max(0.08, 0.55 - 0.18 * k));
      // D5 (SH-38), Sprint 11 (no Done): at the count the row turns gold and the step closes by itself, at every level
      const done = c.both ? ["right", "left"].every((x) => full(c, x)) : full(c, sd);
      if (done) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), closeDrops, 900, c.both ? null : "drops");
      st.busy = true;
      ctx.after(fast() ? 60 : 250, () => (st.busy = false));
    });

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        HS.wordCardKit().catch(() => null); // (the card is wanted after the drops: asked for now)
        open();
      },
      destroy() {
        st.gone = true;
        bob++;
        if (stuck) stuck.stop();
        if (SP && SP.cancel && st.listening) SP.cancel();
        stand.remove();
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        /** the "I can see" moment is on screen (CLN-62: the sandbox shoots it) */
        get seeing() {
          return st.over && st.view === "drops";
        },
        /** the redrop is up: the dropper over her open eye (CLN-62) */
        get redrop() {
          return !!st.redrop;
        },
        /** TEST HOOK (s11-clinic; read-only): the card on show and how it's judged ({i, id, said, wrong, demo, hushed}) */
        get card() {
          const a0 = st.awaiting;
          if (!a0) return null;
          const c = a0.c;
          return { i: c.i, id: c.id, said: c.said, wrong: c.wrong, demo: c.demo, hushed: !!(cardEl && cardEl.classList.contains("eye-hush")) };
        },
        /** TEST HOOK (s11-clinic; read-only): client px boxes of the card, each pill and the mic */
        layout() {
          const box = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
          };
          return { card: box(cardEl), yes: box(haaBtn), no: box(naBtn), mic: box(mic), judge: box(judgeBox), view: st.view };
        },
        /** TEST HOOK (CLN-62; read-only): the hanging dropper's bottle, client px ({left, top, width, height}), or null */
        dropper() {
          if (!dropperAt || dropper.getAttribute("opacity") === "0") return null;
          const r = (dropper.querySelector("image") || dropper).getBoundingClientRect();
          return r.width > 0 ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
        },
        /** TEST HOOK (CLN-62; read-only): the sore eye, client px: the close-up's sore eye, or her open eye in the eye test */
        soreEye() {
          const e = st.view === "test" ? readEye : sore;
          if (!e) return null;
          const h = st.view === "test" ? { rx: 30, ry: 20 } : EYA && EYA.eyeR ? { rx: EYA.eyeR[0], ry: EYA.eyeR[1] } : { rx: 92, ry: 54 };
          const p0 = S.client(e.x - h.rx, e.y - h.ry);
          const p1 = S.client(e.x + h.rx, e.y + h.ry);
          return { left: p0.x, top: p0.y, width: p1.x - p0.x, height: p1.y - p0.y };
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          if (st.redrop) return Object.assign({ do: "tap", what: "redrop" }, S.client(readEye.x, readEye.y - 30));
          if (c.kind === "drops") {
            const sd = c.both ? ["right", "left"].find((x) => st.n[x] < c.both[x]) : st.drops < c.count ? soreSide : null;
            if (!sd) return { do: "wait" };
            if (S.sel !== "drops") return tool("drops");
            return Object.assign({ do: "tap", what: c.both ? `drop ${sd}` : "drop" }, c.both ? S.client(EY[sd].x, EY[sd].y - 34 - 60) : S.client(sore.x, DROPPER_TAP.y));
          }
          if (st.awaiting) {
            const b = (st.awaiting.wrong ? naBtn : haaBtn).getBoundingClientRect();
            return { do: "tap", x: b.left + b.width / 2, y: b.top + b.height / 2, what: st.awaiting.wrong ? "no" : "yes" };
          }
          return { do: "wait" };
        },
        slip() {
          // judge the first judged card the wrong way
          if (!st.awaiting || st.awaiting.c.i !== 1 || st.busy) return null;
          const b = (st.awaiting.wrong ? haaBtn : naBtn).getBoundingClientRect();
          return { do: "tap", x: b.left + b.width / 2, y: b.top + b.height / 2, what: "misjudge" };
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "eye",
    part: "eye",
    ailments: ["sore-eye"],
    items: ["drops-green", "pointer", "patch"],
    itemsFor: { "sore-eye": ["drops-green", "pointer", "patch"] },
    gestures: ["tap", "voice"],
    levels: [1, 2, 3, 4],
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => plan(level, rng).steps.map((x) => x.kind),
    // CLN-189: the cards' pictures by word (the colour check reads them: build/test_shared_heal_chart.mjs), the waiting
    // words' too
    chartPictures: ALL.map((t) => ({ lex: t.lex, icon: t.icon })),
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
