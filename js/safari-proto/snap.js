/*
 * Snap from the jeep (prototype, proto-safari 2 Nov 2026; build/reports/designs/safari.md §3A and its critique).
 *
 * The jeep's window (a fixed roof and rail) over the ride: the three scenes of Zafar's mock-ups (the waterhole's elephants, the
 * tree's giraffes, the long grass's zebra) pass from right to left, again and again. The jeep stops by some animals and Hannah
 * Mami says one instruction, big in her box, with the shared word tiles under her (a tile for every animal, and from L2 every
 * doing word; none glows for the answer). THE FARM'S SNAP GESTURE (critique 1: no shutter button, the cog the only button):
 * tap an animal and the camera frame glides to it; its corners go gold; tap inside the gold frame: click, flash, and the photo
 * prints onto the dashboard. A right photo ticks at once (gold first go). A wrong one still prints: it wobbles, she says what's
 * in it ("That's the elephant running!") and asks again (the row will tick plain). Tapping another animal first moves the frame.
 * The first photo is taken before the jeep moves; the jeep drives on to the next animals only after a tick.
 *   L1  the animal's name, where two kinds stand in view: "Take a photo of the giraffe." 3 photos
 *   L2  what it's doing, among animals of one kind: "Take a photo of the elephant that's swimming." 3 photos
 *   L3  the doing word alone: "Who's running?" 5 photos
 *   L4  big or small too: "Take a photo of the nindho giraffe that's eating." 5 photos (the design's 7 is long for a lab try)
 * THE ONE-ANSWER RULE is coded: an ask is only made where exactly one animal in view fits it, and (L2-L4) where the new word is
 * what picks it (two of a kind in view at L2, two kinds at L1 and L3, two of the same kind and doing at L4).
 * Not built (the design's): the animals moving and reacting (they are part of the mock-up pictures), the frame following a
 * moving animal, the speed calls (L2+), the lion in the tree and climb, the monkeys on the bonnet, babies, the print for Ali.
 */
import { ANIMALS, VERBS, SCENES } from "./art.js";

const it = (kind, mods) => (mods && mods.length ? { fn: "Item", kind, mods } : { fn: "Item", kind });
const SIZE = { big: "a.big", small: "a.small" };
const ICON = {
  eat: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 38C10 20 24 8 40 8c0 18-12 30-30 30z" fill="currentColor"/><path d="M10 38L30 18" stroke="var(--njg-white)" stroke-width="3" stroke-linecap="round"/></svg>',
  swim: '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"><path d="M4 18c5-5 9 5 14 0s9 5 14 0 9 5 12 1"/><path d="M4 28c5-5 9 5 14 0s9 5 14 0 9 5 12 1"/><path d="M4 38c5-5 9 5 14 0s9 5 14 0 9 5 12 1"/></svg>',
  run: '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"><path d="M18 12h24M6 24h36M14 36h28"/></svg>',
};

export default async function snap(F) {
  const lv = F.level;
  const N = [3, 3, 5, 5][lv - 1];
  const doc = F.root.ownerDocument;
  const W = doc.defaultView;

  /* ----- the window: the sky, the ride (three copies of the three scenes), the jeep's roof and rail, the frame, the prints ----- */
  const win = doc.createElement("div");
  win.className = "sf-ride";
  F.scene.appendChild(win);
  win.innerHTML = '<div class="sf-sky"></div><div class="sf-strip"></div><div class="sf-roof"></div><div class="sf-rail"></div><div class="sf-flash"></div>';
  const strip = win.querySelector(".sf-strip");
  const flash = win.querySelector(".sf-flash");
  const frame = doc.createElement("button");
  frame.type = "button";
  frame.className = "sf-frame";
  frame.setAttribute("aria-label", "Take the photo");
  frame.innerHTML = "<i></i><i></i><i></i><i></i>";
  frame.hidden = true;
  win.appendChild(frame);
  const tray = doc.createElement("div");
  tray.className = "sf-prints";
  win.appendChild(tray);

  const widthU = SCENES.map((s) => s.ar * (s.crop[1] - s.crop[0])); // each scene's width, in strip heights
  const total = widthU.reduce((a, b) => a + b, 0);
  const startU = widthU.map((_, i) => widthU.slice(0, i).reduce((a, b) => a + b, 0));
  const COPIES = 4; // (the jeep stays in the second copy; the next stop can be up to a loop ahead)
  const spots = []; // {el, kind, verb, size, u (its middle, in strip heights from the strip's start), scene, box}
  for (let c = 0; c < COPIES; c++)
    SCENES.forEach((s, k) => {
      const d = doc.createElement("div");
      d.className = "sf-place";
      d.dataset.scene = s.id;
      d.style.setProperty("--ar", String(s.ar));
      d.style.setProperty("--w", String(widthU[k]));
      d.style.setProperty("--c0", String(s.crop[0]));
      d.style.backgroundImage = `url("${typeof W.njgV === "function" ? W.njgV(s.img) : s.img}")`;
      strip.appendChild(d);
      for (const a of s.who) {
        const b = doc.createElement("button");
        b.type = "button";
        b.className = "sf-spot";
        b.setAttribute("aria-label", a.kind);
        const span = s.crop[1] - s.crop[0];
        Object.assign(b.style, { left: `${((a.box[0] - s.crop[0]) / span) * 100}%`, width: `${((a.box[2] - a.box[0]) / span) * 100}%`, top: `${a.box[1] * 100}%`, height: `${(a.box[3] - a.box[1]) * 100}%` });
        if (a.size === "small") b.style.zIndex = "2";
        d.appendChild(b);
        spots.push(Object.assign({ el: b, scene: s, u: c * total + startU[k] + (((a.box[0] + a.box[2]) / 2 - s.crop[0]) * s.ar), hw: ((a.box[2] - a.box[0]) / 2) * s.ar }, a));
      }
    });

  /* ----- the layout by height: the ride's height, and where the jeep stands (its centre, in strip heights) ----- */
  let hs = 1;
  let viewU = 2.5;
  let centre = total * 1;
  function layout() {
    const r = win.getBoundingClientRect();
    hs = Math.max(40, Math.min(r.height * 0.74, r.width / 2.1));
    viewU = r.width / hs;
    win.style.setProperty("--hs", `${hs}px`);
    place(false);
  }
  function place(animate, ms = 0) {
    const off = centre * hs - win.getBoundingClientRect().width / 2;
    strip.style.transition = animate ? `transform ${ms}ms cubic-bezier(.45,.05,.35,1)` : "none";
    strip.style.transform = `translateX(${-off}px)`;
  }
  F.on(W, "resize", () => layout());

  /* ----- the stops and the asks (the one-answer rule) ----- */
  const inView = (c) => spots.filter((s) => Math.abs(s.u - c) + s.hw * 0.8 < viewU / 2);
  const count = (V, f) => V.filter(f).length;
  function asksAt(c) {
    const V = inView(c);
    const out = [];
    const kinds = Array.from(new Set(V.map((s) => s.kind)));
    if (lv === 1) {
      if (kinds.length >= 2) for (const k of kinds) if (V.some((s) => s.kind === k && s.verb)) out.push({ kind: k, fits: (s) => s.kind === k });
    } else if (lv === 2) {
      for (const s of V) if (s.verb && count(V, (o) => o.kind === s.kind && o.verb === s.verb) === 1 && count(V, (o) => o.kind === s.kind) >= 2) out.push({ kind: s.kind, verb: s.verb, fits: (o) => o === s });
    } else if (lv === 3) {
      for (const s of V) if (s.verb && count(V, (o) => o.verb === s.verb) === 1 && kinds.length >= 2) out.push({ verb: s.verb, fits: (o) => o === s, kind: s.kind });
    } else {
      for (const s of V)
        if (s.verb && s.size && count(V, (o) => o.kind === s.kind && o.verb === s.verb && o.size === s.size) === 1 && (count(V, (o) => o.kind === s.kind && o.verb === s.verb) >= 2 || count(V, (o) => o.kind === s.kind && o.size === s.size) >= 2))
          out.push({ kind: s.kind, verb: s.verb, size: s.size, fits: (o) => o === s });
    }
    return out;
  }
  // the stops: every scene's middle and every seam, in the middle copy (their asks are the same in every copy)
  const stopsU = [];
  SCENES.forEach((s, k) => {
    stopsU.push(total + startU[k] + widthU[k] / 2);
    stopsU.push(total + startU[k]);
    stopsU.push(total + startU[k] + widthU[k] * 0.3, total + startU[k] + widthU[k] * 0.7);
  });

  /* ----- the round: the route planned up front (with replacement: the same ask can come twice) ----- */
  layout();
  const plan = [];
  let at = null;
  let guard = 0;
  while (plan.length < N && guard++ < 200) {
    const cands = stopsU
      .flatMap((u) => [u - total, u, u + total])
      .filter((u) => (at == null ? u >= total && u < 2 * total : u > at + 0.8 && u < at + total + 0.8))
      .map((u) => ({ u, asks: asksAt(((u - total) % total + total) % total + total) }))
      .filter((x) => x.asks.length);
    if (!cands.length) break;
    // (the nearest few stops ahead, so the ride keeps moving forward without looping past everything)
    cands.sort((a, b) => a.u - b.u);
    const pickFrom = at == null ? cands : cands.slice(0, 3);
    const stop = F.pick(pickFrom);
    plan.push({ u: stop.u, ask: F.pick(stop.asks) });
    at = stop.u;
  }

  const lineOf = (a) => {
    const x = a.kind ? it(ANIMALS[a.kind].lex, a.size ? [SIZE[a.size]] : null) : null;
    const v = a.verb ? it(VERBS[a.verb].lex) : null;
    if (lv === 1) return { fn: "TakeAPhotoOfTheX", x };
    if (lv === 3) return { fn: "WhoSV", v };
    return { fn: "TakeAPhotoOfTheXThatSV", x, v };
  };
  const rows = plan.map((p, i) =>
    F.row({
      key: `snap${i}`,
      line: lineOf(p.ask),
      word: lv === 3 ? it(VERBS[p.ask.verb].lex) : it(ANIMALS[p.ask.kind].lex, p.ask.size ? [SIZE[p.ask.size]] : null),
      tiles: [lv !== 3 && p.ask.kind, lv >= 2 && p.ask.verb, lv === 4 && p.ask.size].filter(Boolean),
      target: () => liveSpot(p),
      data: p,
    })
  );
  // the right animal in view now (copies: the one nearest the jeep)
  const liveSpot = (p) => {
    const V = inView(centre).filter(p.ask.fits);
    V.sort((a, b) => Math.abs(a.u - centre) - Math.abs(b.u - centre));
    return V[0] ? V[0].el : null;
  };

  /* ----- the tiles: every animal; from L2 every doing word; at L4 big and small (neutral pictures) ----- */
  const groups = [{ label: it("n.wild-animals"), tiles: Object.keys(ANIMALS).map((k) => ({ key: k, word: it(ANIMALS[k].lex), lex: ANIMALS[k].lex, picture: ANIMALS[k].img })) }];
  if (lv >= 2) groups.push({ label: it("n.what-they-do"), tiles: Object.keys(VERBS).map((v) => ({ key: v, word: it(VERBS[v].lex), lex: VERBS[v].lex, picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="sf-icon">${ICON[v]}</span>`) })) });
  if (lv === 4)
    groups.push({
      label: it("n.big-and-small"),
      tiles: [{ pair: ["small", "big"].map((z) => ({ key: z, word: it(ANIMALS.giraffe.lex, [SIZE[z]]), lex: SIZE[z], picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="sf-size ${z}"></span>`) })) }],
    });
  F.sentence(groups);

  /* ----- the jeep drives to the next stop ----- */
  let moving = false;
  async function driveTo(u) {
    moving = true;
    aim(null);
    if (u == null) return (moving = false);
    while (u - centre > total * 1.5) u -= total;
    const dist = u - centre;
    const ms = F.T(Math.max(900, Math.min(4200, dist * [1500, 1300, 1150, 1000][lv - 1])));
    centre = u;
    place(true, ms);
    await F.sleep(ms + F.T(80));
    // (keep the jeep in the middle copy: the same picture, one loop back)
    if (centre >= 2 * total) {
      centre -= total;
      place(false);
    }
    moving = false;
    F.acted();
  }
  centre = plan.length ? plan[0].u : total;
  place(false);
  F.beforeNext = async (next) => {
    if (next) await driveTo(next.data.u);
  };

  /* ----- aim and shoot ----- */
  let aimed = null;
  let goldT = null;
  function aim(spot) {
    aimed = spot;
    win.querySelectorAll(".sf-spot.aimed").forEach((e) => e.classList.remove("aimed"));
    frame.classList.remove("gold");
    if (goldT) clearTimeout(goldT);
    if (!spot) {
      frame.hidden = true;
      return;
    }
    const wr = win.getBoundingClientRect();
    const r = spot.el.getBoundingClientRect();
    const pad = Math.min(r.width, r.height) * 0.08;
    frame.hidden = false;
    Object.assign(frame.style, { left: `${r.left - wr.left - pad}px`, top: `${r.top - wr.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    spot.el.classList.add("aimed");
    goldT = setTimeout(() => aimed === spot && frame.classList.add("gold"), F.T(420));
  }
  spots.forEach((s) =>
    F.on(s.el, "click", () => {
      F.acted();
      if (moving || !F.live || !F.current()) return;
      aim(s);
    })
  );
  let shooting = false;
  F.on(frame, "click", async () => {
    F.acted();
    const r = F.current();
    if (!aimed || !frame.classList.contains("gold") || shooting || moving || !r) return;
    shooting = true;
    const s = aimed;
    if (W.Sfx) W.Sfx.play("click");
    flash.classList.remove("on");
    void flash.offsetWidth;
    flash.classList.add("on");
    const pr = printOf(s);
    aim(null);
    if (r.data.ask.fits(s)) {
      F.add(r);
      F.jiggle(pr, "sf-pop");
    } else {
      F.oops(r, pr, { line: false });
      F.stopVoice();
      await F.speak(s.verb ? F.say({ fn: "ThatSTheXV", x: it(ANIMALS[s.kind].lex, lv === 4 && s.size ? [SIZE[s.size]] : null), v: it(VERBS[s.verb].lex) }) : F.say({ fn: "ThatSTheX", x: it(ANIMALS[s.kind].lex) }));
      if (!F.dead && F.current() === r) await F.sayLine(r);
    }
    shooting = false;
  });
  /** The instant camera's print: the scene cropped round the animal, on the dashboard. */
  function printOf(s) {
    const p = doc.createElement("div");
    p.className = "sf-print";
    const im = doc.createElement("div");
    im.className = "sf-print-pic";
    const span = s.box[2] - s.box[0];
    const cx = (s.box[0] + s.box[2]) / 2;
    const cy = (s.box[1] + s.box[3]) / 2;
    const side = Math.max(span * s.scene.ar, s.box[3] - s.box[1]) * 1.15; // a square round the animal, in scene heights
    const zoom = 1 / side; // the print's height is the scene's height times zoom
    im.style.backgroundImage = s.el.parentElement.style.backgroundImage;
    im.style.backgroundSize = `${s.scene.ar * zoom * 100}% ${zoom * 100}%`;
    const px = (cx * s.scene.ar - side / 2) / (s.scene.ar - side);
    const py = (cy - side / 2) / (1 - side);
    im.style.backgroundPosition = `${Math.max(0, Math.min(1, px)) * 100}% ${Math.max(0, Math.min(1, py)) * 100}%`;
    p.appendChild(im);
    tray.appendChild(p);
    while (tray.children.length > 7) tray.firstElementChild.remove();
    return p;
  }

  /* ----- the round ----- */
  await F.ask({ guide: "snap-head" });
  F.begin();
  F.teach("snap-aim", () => rows[0] && rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    Array.from(tray.children).forEach((p, i) => F.after(F.T(120 * i), () => F.jiggle(p, "sf-pop")));
    await F.sleep(F.T(700));
  });
}
