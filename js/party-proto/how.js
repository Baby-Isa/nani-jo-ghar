/*
 * How are you? (prototype, proto-party 2 Nov 2026; build/reports/designs/party-guests.md §3 stage B, its critique). The guests
 * have been playing; Zara's mum asks you to go round and help. Tap a guest: you ask "Ki aiye?" (how are you?) and they answer
 * ("I'm thirsty."); their card lands in Zara's mum's order card (chai's order card: not a sentence order, one card per guest).
 * Then a thing from the tea trolley (food, water, a chair, a fan, a shawl, a balloon: all six always there), then the guest:
 * the right one and they say thank you, the card ticks. A wrong one: a funny wobble, it goes back, they say it again (the card
 * ticks plain); from L2 their face then shows how they feel.
 *
 *   L1  two guests (Ali and Ma); hungry, thirsty, tired or sad; their faces show it.
 *   L2  three guests (Ali, Ma, Zara); any of the six feelings; the faces show nothing until you try; one guest is fine
 *       ("Aau theek ai.": nothing to give; offered something, "Na, thank you.").
 * To record (grey English): the six "I'm hungry." lines (and "Go round and ask everyone how they are."); fan, shawl, balloon.
 * Recorded or in the engine: "Ki aiye?" (draft, to check), "Aau theek ai.", "Na, thank you.", "Thank you!", samosa, paani, kursi.
 */
import { CAST, FACES, FEEL_FACE, FIXES, SVG } from "./art.js";

const FIX_OF = { hungry: "food", thirsty: "water", tired: "chair", sad: "balloon", hot: "fan", cold: "shawl" };
const GIRL_FACE = { hot: "hot", cold: "cold", sad: "sad", fine: "happy" };

export default {
  opts: { person: FACES.zaraMum },
  async run(F) {
    const lv = F.level;
    const stamp = F.stamp;
    F.scene.insertAdjacentHTML("beforeend", '<div class="pp-wall"></div><div class="pp-bunting"></div><div class="pp-bunting b2"></div><div class="pp-floor"></div><div class="pp-sofa"></div><div class="pp-trolley"></div>');

    /* ----- who and how they feel ----- */
    const who = lv === 1 ? ["ali", "ma"] : F.shuffle(["ali", "ma", "zara"]);
    const pool = F.shuffle(lv === 1 ? ["hungry", "thirsty", "tired", "sad"] : ["hungry", "thirsty", "tired", "sad", "hot", "cold"]);
    const feels = who.map((_, i) => pool[i]);
    if (lv >= 2) feels[Math.floor(F.rng() * who.length)] = "fine";
    const faceOf = (g, f) => (g === "zara" ? (GIRL_FACE[f] ? `assets/clinic/patients/girl/girl-head-${GIRL_FACE[f]}.webp` : "assets/clinic/patients/girl/girl-head-neutral.webp") : `${CAST[g].feel}${FEEL_FACE[f]}.png`);

    const xs = who.length === 2 ? [0.32, 0.68] : [0.2, 0.5, 0.8];
    const guests = who.map((g, i) => {
      const el = F.put("pp-person", { x: xs[i], y: 0.78, h: CAST[g].h * 0.95, img: CAST[g].img, tag: "button", z: 5 });
      el.setAttribute("aria-label", g);
      const feel = document.createElement("div");
      feel.className = `pp-feel${lv >= 2 ? " hide" : ""}`;
      feel.innerHTML = `<img alt="" src="${stamp(faceOf(g, feels[i]))}">`;
      el.appendChild(feel);
      return { g, i, el, feel, how: feels[i], asked: false };
    });

    /* ----- the trolley: all six fixes ----- */
    const order = F.shuffle(Object.keys(FIXES));
    const fixEls = {};
    order.forEach((k, i) => {
      const f = FIXES[k];
      const el = F.put("pp-fix", { x: 0.1 + i * 0.16, y: 0.8, h: f.h, img: f.img || null, tag: "button", z: 8, html: f.svg ? `<span class="pp-shape">${SVG[f.svg]}</span>` : null });
      if (f.svg) el.style.aspectRatio = "0.8";
      el.setAttribute("aria-label", k);
      fixEls[k] = el;
    });

    /* ----- the order card: one card per guest, landing when they answer ----- */
    const feelMeaning = (f) => (f === "fine" ? { fn: "ImFine" } : { fn: "Say", x: (F.L.linearizer.lexOf(`party-proto.line.feel-${f}`) || {}).id });
    // (each guest's card is made when they answer: nothing on the panel before it's said; chai P7)
    const rows = [];
    const rowOf = (q) => {
      const meaning = feelMeaning(q.how);
      return F.row({
        key: `guest${q.i}`,
        line: meaning,
        word: meaning,
        picture: lv === 1 ? faceOf(q.g, q.how) : null,
        target: () => (q.how === "fine" ? q.el : held === FIX_OF[q.how] ? q.el : fixEls[FIX_OF[q.how]]),
        data: q,
      });
    };
    let allIn = null;

    /* ----- play ----- */
    let held = null;
    let busy = false;
    const hold = (k) => {
      held = k;
      Object.entries(fixEls).forEach(([kk, el]) => {
        el.classList.toggle("sel", kk === k);
        el.classList.toggle("lift", kk === k);
      });
    };
    const askHow = F.lineOf({ fn: "Say", x: "phrase.how-are-you-informal-tu-ki-aiye-without-the-tu" });
    const thanks = F.lineOf({ fn: "Exclaim", x: "phrase.thank-you-the-english-words-the-family-says-them" });
    const noThanks = F.lineOf({ fn: "Say", x: "phrase.no-thank-you" });

    Object.entries(fixEls).forEach(([k, el]) =>
      F.on(el, "click", () => {
        F.acted();
        hold(held === k ? null : k);
      })
    );
    guests.forEach((q, i) =>
      F.on(q.el, "click", async () => {
        F.acted();
        if (busy) return;
        if (rows[i] && rows[i].done) return F.jiggle(q.el);
        busy = true;
        try {
          if (!q.asked) {
            // ask how they are; they answer, and their card lands
            q.asked = true;
            if (held) hold(null);
            const r = (rows[i] = rowOf(q));
            await F.bubble(q.el, askHow);
            F.jiggle(q.el);
            await F.bubble(q.el, r.line);
            r.away = false;
            if (guests.every((x) => x.asked) && allIn) F.whenAll(allIn);
            F.focus(r);
            F.draw();
            if (q.how === "fine") {
              await F.sleep(F.T(300));
              F.tick(r);
            }
            return;
          }
          const r = rows[i];
          if (!held) {
            await F.bubble(q.el, r.line); // (tapped again: they say it again)
            return;
          }
          if (q.how === "fine") {
            await F.bubble(q.el, noThanks); // fine, thank you: nothing needed, never a miss
            hold(null);
            return;
          }
          if (held !== FIX_OF[q.how]) {
            // a wrong fix: a funny wobble, it goes back; they say it again; from L2 their face shows it now
            const back = held;
            hold(null);
            F.jiggle(fixEls[back], "pp-shake");
            q.feel.classList.remove("hide");
            F.oops(r, q.el, { line: false });
            await F.bubble(q.el, r.line);
            return;
          }
          const k = held;
          hold(null);
          const src = FIXES[k].img;
          await F.fly(src, fixEls[k], q.el, { ms: 520 });
          q.feel.classList.remove("hide");
          q.feel.innerHTML = `<img alt="" src="${stamp(q.g === "zara" ? "assets/clinic/patients/girl/girl-head-happy.webp" : `${CAST[q.g].feel}happy.png`)}">`;
          F.jiggle(q.el);
          F.focus(r);
          F.tick(r);
          await F.bubble(q.el, thanks);
        } finally {
          busy = false;
        }
      })
    );

    // (no ask: each guest's card lands when they answer; her line first, a tap never lost)
    F.draw();
    F.setGuide("how-guide");
    F.begin();
    F.speak(F.lineOf("how-guide"));
    F.teach("guest", () => guests[0].el);

    await new Promise((res) => (allIn = res));
    await F.finish(async () => {
      for (const q of guests) F.jiggle(q.el);
    });
  },
};
