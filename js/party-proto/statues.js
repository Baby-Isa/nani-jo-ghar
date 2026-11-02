/*
 * Musical statues (prototype, proto-party 2 Nov 2026; build/reports/designs/do-it-engine.md, games-at-a-glance "Musical
 * statues"; Zafar 1 Nov: "the recommendation for now"). Zara and Yusuf dance while Nani CLAPS (the family's rule: no music
 * with instruments, so the beat is her clapping: a clapping-hands picture that claps and a soft click on each clap, no tune).
 * When the clapping stops she calls a pose ("We!": sit). The pose cards along the bottom are pictures only and shuffle at every
 * stop, so only the heard word picks; tap the card: both dancers snap into the pose with a click and hold it, then the clapping
 * comes back. A wrong card: they try that pose, wobble and giggle, and she says it again (the stop's card ticks plain).
 * Tap a dancer while they dance for a wiggle (just for fun).
 *
 * Chai's order card (not a sentence order): one card per stop, made when she calls it; the card shows the word with NO
 * picture (its picture would be the pose card's picture: matching, not listening).
 *   L1  sit, jump, turn round: three cards, four stops.
 *   L2  sit, jump, turn round, stand up, dance: five cards, five stops ("Dance!" sets them going again).
 * To record (grey English): jump, stand up, turn round, dance, and her opening line. "We!" (sit) is in the engine.
 * "Turn round" is not firai (the engine's turn is flip or stir): Mum gives the word.
 */
import { CAST, POSES, SVG } from "./art.js";

export default {
  opts: {},
  async run(F) {
    const lv = F.level;
    F.scene.insertAdjacentHTML("beforeend", '<div class="pp-wall"></div><div class="pp-bunting"></div><div class="pp-bunting b3"></div><div class="pp-floor"></div>');
    const clap = F.put("pp-clap", { x: 0.9, y: 0.24, h: 0.13, html: SVG.clap });
    clap.setAttribute("aria-hidden", "true");
    const dancers = ["zara", "yusuf"].map((id, i) => {
      const el = F.put("pp-dancer", { x: i ? 0.64 : 0.36, y: 0.7, h: CAST[id].h, img: CAST[id].img, tag: "button", z: 5 });
      el.setAttribute("aria-label", id);
      F.on(el, "click", () => {
        F.acted();
        F.jiggle(el);
      });
      return el;
    });
    const kinds = lv === 1 ? ["sit", "jump", "turn"] : ["sit", "jump", "turn", "stand", "dance"];
    const cardsBox = document.createElement("div");
    cardsBox.className = "pp-cards";
    F.scene.appendChild(cardsBox);
    const cards = {};
    kinds.forEach((k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pp-pose";
      b.dataset.pose = k;
      b.setAttribute("aria-label", "a pose card");
      b.innerHTML = POSES[k];
      b.disabled = true;
      cardsBox.appendChild(b);
      cards[k] = b;
    });
    const shuffleCards = () => F.shuffle(kinds).forEach((k) => cardsBox.appendChild(cards[k]));
    const callOf = (k) => (k === "sit" ? { fn: "Command", verb: "v.sit" } : { fn: "Say", x: (F.L.linearizer.lexOf(`party-proto.line.statues-${k}`) || {}).id });

    // the stops: no pose twice in a row; L2 ends on "dance"
    const nStops = lv === 1 ? 4 : 5;
    const stops = [];
    while (stops.length < nStops) {
      const k = F.pick(kinds.filter((x) => x !== stops[stops.length - 1] && (lv === 1 || x !== "dance" || stops.length >= 2)));
      stops.push(k);
    }

    const setPose = (p) => dancers.forEach((d) => (d.dataset.pose = p || ""));
    let clapT = null;
    const clapping = (on) => {
      clap.classList.toggle("on", on);
      dancers.forEach((d) => d.classList.toggle("dance", on));
      if (clapT) clapT.stop ? clapT.stop() : null;
      clapT = null;
      if (on) {
        let alive = true;
        const beat = () => {
          if (!alive || F.dead) return;
          if (window.Sfx) window.Sfx.play("click", { volume: 0.35 });
          F.after(F.T(450), beat);
        };
        beat();
        clapT = { stop: () => (alive = false) };
      }
    };

    F.setGuide("statues-guide");
    F.draw();
    F.begin();
    await F.speak(F.lineOf("statues-guide"));

    let want = null; // {k, row, done()}
    Object.entries(cards).forEach(([k, b]) =>
      F.on(b, "click", async () => {
        F.acted();
        if (!want || b.disabled) return;
        const w = want;
        if (k !== w.k) {
          // they try the wrong pose, wobble and giggle; she says it again
          setPose(k);
          dancers.forEach((d) => F.jiggle(d, "pp-shake"));
          F.jiggle(b, "pp-shake");
          F.oops(w.row, null);
          await F.sleep(F.T(700));
          if (want === w) setPose("");
          return;
        }
        want = null;
        Object.values(cards).forEach((c) => (c.disabled = true));
        if (window.Sfx) window.Sfx.play("click", { volume: 0.6 });
        setPose(k === "dance" ? "" : k);
        dancers.forEach((d) => d.classList.add("freeze"));
        F.focus(w.row);
        F.tick(w.row);
        w.done();
      })
    );

    for (let i = 0; i < stops.length; i++) {
      if (F.dead) return;
      const k = stops[i];
      setPose("");
      dancers.forEach((d) => d.classList.remove("freeze"));
      clapping(true);
      await F.sleep(F.T(2200 + F.rng() * 1400));
      clapping(false);
      // the stop: her call, its card (no picture), then the cards wake up shuffled
      const call = callOf(k);
      const row = F.row({ key: `stop${i}`, line: call, word: call, picture: null, target: () => cards[k] });
      row.away = false;
      F.focus(row);
      F.draw();
      shuffleCards();
      Object.values(cards).forEach((c) => (c.disabled = false));
      if (i === 0) F.teach("pose", () => cards[k]);
      const got = new Promise((res) => (want = { k, row, done: res }));
      F.setGuide(call);
      F.sayLine(row);
      await got;
      await F.sleep(F.T(k === "dance" ? 500 : 1300));
    }
    clapping(false);
    await F.finish(async () => {
      for (let n = 0; n < 2; n++) {
        dancers.forEach((d) => F.jiggle(d));
        await F.sleep(F.T(500));
      }
    });
  },
};
