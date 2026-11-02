/*
 * The drinks (prototype, proto-clinic 2 Nov 2026; build/reports/designs/clinic-every-part.md §3E, its critique 3 and 15).
 *
 * The family's drink for a tummy ache or a cough, made at the counter: the doctor names what goes in, "Muke aadu de. Ne paani."
 * (Give me ginger. And water.) Chai's order card: one card per thing. All six things stay on the counter (ginger, honey, milk,
 * turmeric, lemon, water): tap one, then the cup; it goes in. A wrong one hops back (a funny shake, the line again, the row ticks
 * plain). A counted row ticks the moment its number is reached; an extra spoon doesn't land. Then tap the cup, then the patient:
 * she sips, and a tiny polite burp (ginger) or a clear "aah".
 *
 *   L1  one drink named by its two things                 L2  a spoon count for the honey or the turmeric (2-3 spoons)
 *   L3  as L2, heard only (the card's picture off)          L4  as L3, three spoons at most... and four things in the cup
 * The design's L3 ("the drink for his cough": D-11, a frame missing) and L4 halves wait for their frames. The four drinks are
 * taste.js's; Mum confirms which is the family's remedy for what (decision 17).
 */
const C = "assets/cook/items/";
const THINGS = {
  ginger: { lex: "n.ginger", img: `${C}veg-aadu-whole-t.webp`, spoon: false },
  honey: { lex: "n.honey", img: `${C}shelf-ph-honey-bare-f.webp`, spoon: true },
  milk: { lex: "n.milk", img: `${C}shelf-cook-dudh-bare-f.webp`, spoon: false },
  turmeric: { lex: "n.turmeric", img: `${C}spice-hardar-bowl-t.webp`, spoon: true },
  lemon: { lex: "n.lemon", img: `${C}veg-limu-whole-t.webp`, spoon: false },
  water: { lex: "n.water", img: `${C}shelf-cook-paani-bare-f.webp`, spoon: false },
};
// the four drinks (taste.js's): what's in each, and what it's for (to Mum)
const DRINKS = [
  { id: "ginger-water", has: ["ginger", "water"], for: "tummy" },
  { id: "honey-milk", has: ["honey", "milk"], for: "cough" },
  { id: "turmeric-milk", has: ["turmeric", "milk"], for: "throat" },
  { id: "lemon-water", has: ["lemon", "water"], for: null },
];
const A = { cup: "assets/clinic/items-s08c/steel-cup-s08c.webp", girl: "assets/clinic/patients/girl/girl-front.webp", boy: "assets/clinic/patients/boy/boy-front.webp" };
const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);

export default {
  opts: {},
  async run(F) {
    const lv = F.level;
    const drink = F.pick(lv === 1 ? DRINKS : DRINKS.filter((d) => d.has.some((t) => THINGS[t].spoon)));
    const spoons = lv >= 2 ? 2 + Math.floor(F.rng() * 2) : 1;

    /* ----- the scene: the counter with all six things, the cup, the patient at the side ----- */
    F.scene.insertAdjacentHTML("beforeend", '<div class="cp-wall"></div><div class="cp-counter"></div>');
    const who = drink.for === "cough" ? A.boy : A.girl;
    const patient = F.put("cp-patient", { x: 0.86, y: 0.98, h: 0.78, img: who, tag: "button", z: 4 });
    patient.setAttribute("aria-label", "the patient");
    const cup = F.put("cp-cup", { x: 0.4, y: 0.69, h: 0.24, img: A.cup, tag: "button", z: 8, html: '<div class="cp-cup-in"></div>' });
    cup.setAttribute("aria-label", "the cup");
    const order = F.shuffle(Object.keys(THINGS));
    const els = {};
    order.forEach((t, i) => {
      const x = 0.07 + i * 0.12;
      const el = F.put("cp-thing-pick", { x, y: 0.93, h: 0.18, img: THINGS[t].img, tag: "button", z: 10 });
      el.setAttribute("aria-label", t);
      els[t] = el;
    });

    /* ----- the order card: one card per thing ----- */
    const item = (t) => {
      const n = THINGS[t].spoon && lv >= 2 ? spoons : null;
      return n ? { fn: "Unit", n, unit: "n.spoon", of: { fn: "Item", kind: THINGS[t].lex } } : { fn: "Item", kind: THINGS[t].lex };
    };
    const rows = drink.has.map((t, i) =>
      F.row({
        key: t,
        line: i === 0 ? { fn: "GiveMe", x: item(t) } : { fn: "And", x: item(t) },
        word: item(t),
        need: THINGS[t].spoon && lv >= 2 ? spoons : 1,
        picture: THINGS[t].img,
        data: { t },
        target: () => (held === t ? cup : els[t]),
      })
    );

    /* ----- play ----- */
    let held = null;
    const hold = (t) => {
      held = t;
      Object.entries(els).forEach(([k, el]) => {
        el.classList.toggle("sel", k === t);
        el.classList.toggle("lift", k === t);
      });
    };
    Object.entries(els).forEach(([t, el]) =>
      F.on(el, "click", () => {
        F.acted();
        hold(t);
        F.jiggle(el);
      })
    );
    let giving = false;
    let given = null;
    F.on(cup, "click", async () => {
      F.acted();
      if (giving) {
        cup.classList.add("sel");
        given = "cup";
        return;
      }
      if (!held) return F.jiggle(cup);
      const t = held;
      const r = rows.find((x) => x.data.t === t);
      if (!r) {
        // not in this drink: it hops back, the line again (the first open row ticks plain)
        await F.fly(THINGS[t].img, els[t], cup, { ms: 320 });
        F.oops(rows.find((x) => !x.done), els[t]);
        return;
      }
      if (F.full(r)) return F.jiggle(cup, "cp-shake"); // the number is reached: the extra spoon doesn't land
      F.focus(r);
      F.add(r);
      await F.fly(THINGS[t].img, els[t], cup, { ms: 420 });
      const box = cup.querySelector(".cp-cup-in");
      if (box.children.length < 4) {
        const im = document.createElement("img");
        im.src = stamp(THINGS[t].img);
        im.alt = "";
        box.appendChild(im);
      }
    });
    F.on(patient, "click", async () => {
      F.acted();
      if (!giving || given !== "cup") return F.jiggle(patient);
      given = "done";
      cup.classList.remove("sel");
      await F.fly(A.cup, cup, patient, { ms: 520 });
      cup.classList.add("gone");
      F.jiggle(patient, "cp-bounce");
      bubble(drink.has.includes("ginger") ? "burp! hee hee" : "aah", patient);
      if (done) done();
    });
    function bubble(text, at) {
      const a = at.getBoundingClientRect();
      const pr = F.play.getBoundingClientRect();
      const b = document.createElement("div");
      b.className = "cp-bubble";
      b.textContent = text;
      Object.assign(b.style, { left: `${a.left + a.width / 2 - pr.left}px`, top: `${a.top + a.height * 0.1 - pr.top}px` });
      F.play.appendChild(b);
      F.after(F.T(1400), () => b.remove());
    }

    let done = null;
    await F.ask({ guide: rows[0].line && { fn: "GiveMe", x: item(drink.has[0]) } });
    F.begin();
    F.teach("thing", els[drink.has[0]]).then(() => F.teach("cup", cup));
    F.focus(rows[0]);
    // (the end waits for the cup to reach the patient: the give is the natural next thing, never a button)
    await new Promise((res) =>
      F.whenAll(() => {
        giving = true;
        hold(null);
        F.teach("give", cup).then(() => F.teach("patient", patient));
        done = res;
      })
    );
    await F.finish(async () => {
      F.jiggle(patient, "cp-bounce");
      await F.sleep(F.T(800));
    });
  },
};
