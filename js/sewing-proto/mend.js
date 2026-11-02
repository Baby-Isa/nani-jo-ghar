/*
 * Mend (prototype, proto-sewing 2 Nov 2026; build/reports/designs/sewing.md §3c, its critique, games-at-a-glance §7).
 *
 * Big Ma's table, straight down: Nana's kurta laid flat, long-sleeved, ALWAYS showing more faults than he asks for (a torn sleeve,
 * a button come off, a torn pocket, later a hole), so only the said one counts. THE SENTENCE LAYOUT: Nana says one instruction at
 * a time in the box ("My [sleeve] is torn": all to record), and under him the word tiles: Nana's kurta (its parts: sleeve, pocket,
 * buttons, a tile for each part on the kurta, asked or not, drawn without a fault) and What's wrong (torn, a hole from L3).
 *   1. Tap the fault he names: the needle comes to it.
 *   2. A tear or a hole: drag the needle along the lit zig-zag over it (the track); it zips shut. A button: it hops from the tin
 *      onto its spot with a pling.
 * A wrong fault wobbles and stays (it isn't fixed or removed); he says it again (the step will tick plain). Each round is a fresh
 * kurta with its faults in fresh places, so the fault left over is never the next ask. Nothing glows on the answer.
 *   L1  two rounds; two faults (a torn sleeve and a button off), one asked
 *   L2  two rounds; three faults (a torn pocket joins), one asked
 *   L3  two rounds; four faults (a hole joins: "There's a hole in my kurta"), two asked in order ("Pela [sleeve], ne poi [pocket]")
 *   L4  as L3, both asks "torn" (the sleeve and the pocket, in order), so the part and the order decide, not the fault word
 * Not built: "not the sleeve" (no said last), "two buttons" (a count), the hem too long (cut along its chalk), the patch from the
 * scrap tin, Simba pouncing on the loose button, the sleeve flapping like a windsock, other customers (Ma, Ali, the girl).
 */
import { svg, KURTA_SPOTS } from "./cloth.js";
import { BIGMA } from "./art.js";

const W = typeof window !== "undefined" ? window : globalThis;
const PART_LEX = { sleeve: "n.sleeve", pocket: "n.pocket", button: "n.buttons", kurta: "n.kurta" };

export default async function mend(F) {
  const lv = F.level;
  const lexLine = (key) => {
    const e = F.L.linearizer.lexOf(`sewing-proto.line.${key}`);
    return { fn: "Say", x: e ? e.id : "phrase.fix-it" };
  };
  /* ----- the rounds: each a fresh kurta, its faults, and the asks ----- */
  const rounds = [0, 1].map(() => {
    const side = F.pick(["sleeveL", "sleeveR"]);
    let faults = [{ spot: side, kind: "torn", part: "sleeve" }, { spot: "button", kind: "off", part: "button" }];
    if (lv >= 2) faults.push({ spot: "pocket", kind: "torn", part: "pocket" });
    if (lv >= 3) faults.push({ spot: "hole", kind: "hole", part: "kurta" });
    const askable = faults.slice();
    // (L4: both asks are "torn", on the sleeve and the pocket, so the part decides and the order matters)
    const asks = lv === 4 ? F.shuffle(askable.filter((f) => f.kind === "torn")) : F.shuffle(askable).slice(0, lv >= 3 ? 2 : 1);
    return { faults, asks };
  });
  const lineFor = (f) => (f.kind === "off" ? lexLine("mend-off") : f.kind === "hole" ? { fn: "ThereSAHoleInMyX", x: { fn: "Item", kind: "n.kurta" } } : { fn: "MyXIsTorn", x: { fn: "Item", kind: PART_LEX[f.part] } });
  const wordFor = (f) => (f.kind === "hole" ? { fn: "Item", kind: "n.hole" } : f.kind === "off" ? { fn: "Item", kind: "n.buttons" } : { fn: "Item", kind: PART_LEX[f.part], mods: ["a.torn"] });
  const tileKeys = (f) => (f.kind === "hole" ? ["hole"] : f.kind === "off" ? ["button"] : [f.part, "torn"]);
  const steps = [];
  rounds.forEach((rd, ri) =>
    rd.asks.forEach((f, ai) => {
      const line = rd.asks.length === 2 ? { fn: "FirstThen", a: wordFor(rd.asks[0]), b: wordFor(rd.asks[1]) } : lineFor(f);
      steps.push({ ri, ai, f, line: rd.asks.length === 2 ? [line, lineFor(f)] : lineFor(f), word: wordFor(f), tiles: tileKeys(f) });
    })
  );

  /* ----- the scene: the table, the needle and thread, the button tin, Big Ma watching ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sw-table"></div>');
  F.put("sw-watch", { x: 0.1, y: 0.22, h: 0.18, img: BIGMA.face });
  const tin = F.put("sw-tin sw-tin-small wide", { x: 0.9, y: 0.95, h: 0.18, w: 0.14, html: svg("button", { colour: "white", cls: "sw-tin-btn" }) });
  F.put("sw-needle-rest", { x: 0.9, y: 0.4, h: 0.18, html: svg("needle", { colour: "plain" }) });
  let garment = null;
  let faultEls = [];
  let round = -1;
  function deal(ri) {
    round = ri;
    if (garment) {
      const old = garment;
      old.classList.add("sw-away");
      F.after(F.T(450), () => old.remove());
    }
    const rd = rounds[ri];
    garment = F.put("sw-flat sw-c-white", { x: 0.5, y: 0.99, h: 0.94, html: svg("kurta", { colour: "white", length: "long", buttons: 3, faults: rd.faults.map((f) => (f.kind === "off" ? "button" : f.part === "pocket" ? "pocket" : "x")).concat(["pocket-ok"]) }) });
    faultEls = rd.faults.map((f) => {
      const s = KURTA_SPOTS[f.spot];
      const b = F.doc.createElement("button");
      b.type = "button";
      b.className = `sw-fault sw-fault-${f.kind}`;
      b.style.left = `${s.x * 100}%`;
      b.style.top = `${s.y * 100}%`;
      b.dataset.spot = f.spot;
      b.setAttribute("aria-label", "fault");
      b.innerHTML = f.kind === "off" ? svg("off", { colour: "white", cls: "sw-fault-pic" }) : `<span class="sw-fault-mark"></span>`;
      garment.appendChild(b);
      F.on(b, "click", () => pick(b));
      return b;
    });
    F.jiggle(garment);
  }

  const rows = steps.map((s, k) =>
    F.row({
      key: `fix${k}`,
      line: s.line,
      word: s.word,
      tiles: s.tiles,
      target: () => faultEls.find((e) => e.dataset.spot === s.f.spot && !e.classList.contains("mended")),
      data: s,
    })
  );
  const pic = (k) => (box) => box.insertAdjacentHTML("beforeend", svg(k, { colour: "plain", cls: "sw-tilepic" }));
  const parts = [
    { key: "sleeve", word: { fn: "Item", kind: "n.sleeve" }, lex: "n.sleeve", picture: pic("sleeve") },
    { key: "button", word: { fn: "Item", kind: "n.buttons" }, lex: "n.buttons", picture: pic("button") },
  ];
  if (lv >= 2) parts.push({ key: "pocket", word: { fn: "Item", kind: "n.pocket" }, lex: "n.pocket", picture: pic("pocket") });
  const wrong = [{ key: "torn", word: { fn: "Item", kind: "a.torn" }, lex: "a.torn", picture: pic("torn") }];
  if (lv >= 3) wrong.push({ key: "hole", word: { fn: "Item", kind: "n.hole" }, lex: "n.hole", picture: (box) => box.insertAdjacentHTML("beforeend", '<span class="sw-tilepic sw-holepic"></span>') });
  F.sentence([
    { label: { fn: "Of", owner: { fn: "Item", kind: "pn.nana" }, thing: { fn: "Item", kind: "n.kurta" } }, tiles: parts },
    { label: { en: "what's wrong" }, tiles: wrong },
  ]);

  /* ----- a fix ----- */
  let busy = false;
  async function pick(b) {
    F.acted();
    const r = F.current();
    if (!r || busy || b.classList.contains("mended")) return;
    if (r.data.ri !== round || b.dataset.spot !== r.data.f.spot) {
      F.oops(r, b); // a wobble; the fault stays; he says it again
      return;
    }
    busy = true;
    F.pause(true);
    const f = r.data.f;
    b.classList.add("sel");
    if (f.kind === "off") {
      // the button hops from the tin onto its spot: pling
      await F.fly(null, tin, b, { cls: "sw-flybtn sw-c-white", size: b.getBoundingClientRect().height * 0.8, ms: 460 });
      if (W.Sfx) W.Sfx.play("bing", { volume: 0.2 });
    } else {
      const s = KURTA_SPOTS[f.spot];
      const half = f.kind === "hole" ? 0.06 : 0.08;
      await F.track({ parent: garment, x1: s.x - half, y1: s.y, x2: s.x + half, y2: s.y, tool: "needle", zig: true, toolHtml: svg("needle", { colour: "plain" }), name: "sew-needle" });
      if (W.Sfx) W.Sfx.play("whoosh", { volume: 0.25 });
    }
    if (F.dead) return;
    b.classList.remove("sel");
    b.classList.add("mended");
    F.jiggle(garment, "sw-flap");
    F.pause(false);
    busy = false;
    F.add(r);
    // the round's asks done: a fresh kurta comes in (never the one left over)
    const next = rows.find((x) => !x.done);
    if (next && next.data.ri !== round) {
      await F.sleep(F.T(500));
      deal(next.data.ri);
    }
  }

  deal(0);
  await F.ask({ guide: "mend-head" });
  F.begin();
  F.teach("sew-fault", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.jiggle(garment, "sw-flap");
    await F.sleep(F.T(500));
  });
}
