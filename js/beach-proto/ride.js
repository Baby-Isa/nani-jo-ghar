/*
 * The ride on the water (prototype, proto-beach 2 Nov 2026; build/reports/designs/beach-boat.md §3.5; the boat day).
 *
 * From the boat: its rail along the foot is the window frame, the sea runs past in three layers (far: a ship; middle: boats,
 * birds, a buoy; near: fish). NANI hosts (she names things as they pass). THE SENTENCE LAYOUT: one at a time ("Chakli nar!":
 * look, a bird; the other nouns to record), the word tiles under her: On the sea (bird, boat, fish, buoy, ship), from L2 the
 * small-and-big pair. Things are asked only as they come into view, and the asked thing never passes alone (a look-alike or another
 * thing passes with it). Tap it as it passes: it bounces and the instruction ticks; a wrong one shakes and she says it again (it
 * will tick plain). If it sails out of view, nothing is lost: it comes round again.
 *   L1  one named thing at a time; one steady speed (Zafar, 1 Nov: the start stays simple)
 *   L2  a size ("the big boat", the small one passing beside it); after the first find Nani calls "Jaldi jaldi!" to the boatman
 *       and the boat rushes (her sun hat blows off into the sea: the reason to go fishing), then "slowly" (to record) and it eases
 *   L3, L4  as L2 (two things in one line; counts: not built)
 * Not built: the child's own speaking turn (rung 1: say "jaldi!" after Nani; the pills), the shared window ride's engine.
 */
const LEX = { bird: "n.bird", boat: "n.boat", fish: "n.fish", buoy: "n.buoy", ship: "n.ship" };
const LANE = { ship: { y: 0.4, h: 0.08 }, bird: { y: 0.3, h: 0.07 }, boat: { y: 0.6, h: 0.12 }, buoy: { y: 0.64, h: 0.08 }, fish: { y: 0.8, h: 0.06 } };
const CROSS = { ship: 9000, bird: 6000, boat: 6500, buoy: 6500, fish: 5000 }; // ms to cross the window at the steady speed
const SIZED = ["boat", "fish"];
const I = (kind, extra) => Object.assign({ fn: "Item", kind }, extra || {});

export default async function ride(F) {
  const lv = F.level;
  const KINDS = Object.keys(LEX);
  let asks;
  if (lv === 1) asks = F.shuffle(KINDS).slice(0, 4).map((kind) => ({ kind }));
  else {
    const sizes = F.shuffle(["big", "small", F.pick(["big", "small"])]);
    asks = F.shuffle([{ kind: "boat", size: sizes[0] }, { kind: "fish", size: sizes[1] }, { kind: F.pick(["bird", "buoy"]) }, { kind: F.pick(SIZED), size: sizes[2] }]);
  }
  const np = (t) => I(LEX[t.kind], t.size ? { mods: [`a.${t.size}`] } : {});

  /* ----- the scene ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="bp-sky"></div><div class="bp-ride-sea"><i></i><i></i><i></i></div><div class="bp-rail"></div>');
  const hat = F.put("bp-litter k-hat bp-nanihat", { x: 0.12, y: 0.86, h: 0.07 });

  const rows = asks.map((t, i) =>
    F.row({
      key: `see${i}`,
      line: { fn: "Command", verb: "v.look", obj: np(t) },
      word: I(LEX[t.kind]),
      tiles: [t.kind, t.size].filter(Boolean),
      target: () => floaters.find((e) => matches(e, t)),
      data: t,
    })
  );
  const tile = (k) => ({ key: k, word: I(LEX[k]), lex: LEX[k], picture: (box) => box.insertAdjacentHTML("beforeend", k === "bird" ? '<img class="bp-tileimg" src="assets/day/ride/s09r/bird.webp" alt="">' : `<span class="bp-tilepic bp-litter bp-sea-${k}"></span>`) });
  const groups = [{ label: { en: "on the sea" }, tiles: KINDS.map(tile) }];
  if (lv >= 2)
    groups.push({
      label: { en: "sizes" },
      tiles: [{ pair: [
        { key: "small", word: { fn: "Amt", x: "a.small" }, lex: "a.small", picture: (box) => box.insertAdjacentHTML("beforeend", '<span class="bp-tilepic bp-plain small"></span>') },
        { key: "big", word: { fn: "Amt", x: "a.big" }, lex: "a.big", picture: (box) => box.insertAdjacentHTML("beforeend", '<span class="bp-tilepic bp-plain"></span>') },
      ] }],
    });
  F.sentence(groups);

  /* ----- the things floating past ----- */
  let floaters = [];
  let pace = 1; // 1 steady; 0.55 quickly; 1.4 slowly
  const matches = (el, t) => !el.classList.contains("seen") && el.dataset.kind === t.kind && (!t.size || el.dataset.size === t.size);
  function launch(t, delay = 0) {
    const L = LANE[t.kind];
    const h = t.size === "small" ? L.h * 0.55 : L.h;
    const el = F.put(`bp-floater bp-sea-${t.kind}`, { x: 1.12, y: L.y + (F.rng() - 0.5) * 0.04, h, tag: "button", html: t.kind === "bird" ? '<img src="assets/day/ride/s09r/bird.webp" alt="">' : "" });
    el.dataset.kind = t.kind;
    el.dataset.size = t.size || "";
    el.setAttribute("aria-label", `${t.size || ""} ${t.kind}`.trim());
    const ms = F.T(CROSS[t.kind] * pace);
    el.style.transition = `left ${ms}ms linear`;
    floaters.push(el);
    F.on(el, "click", () => spotted(el));
    F.after(F.T(40) + delay, () => el.style.setProperty("--x", "-0.15"));
    F.after(ms + delay + F.T(200), () => {
      floaters = floaters.filter((x) => x !== el);
      el.remove();
    });
    return el;
  }
  // the stream: every so often something passes; the asked thing comes into view soon after it's asked, never alone
  let nextAt = 0;
  function stream() {
    if (F.dead) return;
    const r = F.current();
    const now = Date.now();
    if (r && F.live && !floaters.some((e) => matches(e, r.data)) && now >= nextAt) {
      const t = r.data;
      const twin = t.size ? { kind: t.kind, size: t.size === "big" ? "small" : "big" } : { kind: F.pick(KINDS.filter((k) => k !== t.kind && LANE[k].y !== LANE[t.kind].y)) };
      const first = F.rng() < 0.5;
      launch(first ? t : twin, 0);
      launch(first ? twin : t, F.T(500));
      nextAt = now + F.T(3500);
    } else {
      const k = F.pick(KINDS);
      launch({ kind: k, size: SIZED.includes(k) && lv >= 2 ? F.pick(["big", "small"]) : null });
    }
    F.after(F.T(1700 * pace), stream);
  }

  const busy = false;
  let speedDone = false;
  async function spotted(el) {
    F.acted();
    const r = F.current();
    if (!r || busy || el.classList.contains("seen")) return;
    if (!matches(el, r.data)) return F.oops(r, el);
    el.classList.add("seen");
    F.jiggle(el);
    F.add(r);
    if (lv >= 2 && !speedDone) {
      speedDone = true;
      // (the child's taps stay live while Nani calls: never wait for speech)
      F.after(F.T(900), async () => {
        // Nani to the boatman: quickly! The boat rushes; her hat blows off
        await F.speak(F.say({ fn: "Exclaim", x: "phrase.quickly-quickly-doubling-for-emphasis" }));
        pace = 0.55;
        F.root.classList.add("bp-fast");
        hat.classList.add("blown");
        F.speak(F.lineOf("rd-hat"));
        F.after(F.T(6000), async () => {
          if (F.dead) return;
          await F.speak(F.say({ fn: "Amt", x: "adv.slowly" }));
          pace = 1.4;
          F.root.classList.remove("bp-fast");
        });
      });
    }
  }

  await F.ask({ guide: "rd-head" });
  F.begin();
  stream();
  // (no first-time light here: the coach's light would hold a thing that sails on and out of view)
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    await F.sleep(F.T(600));
  });
}
