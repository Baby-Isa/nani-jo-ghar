/*
 * The fitting (prototype, proto-sewing 2 Nov 2026; build/reports/designs/sewing.md §3d, its critique, games-at-a-glance §7).
 *
 * Big Ma's room, front on: the customer full length on Big Ma's low stool (the hem, the sleeves, the stool and the floor always
 * in frame), the tall mirror behind, the wall rail at shoulder height beside them with today's pieces and Big Ma's others as
 * look-alikes. THE SENTENCE LAYOUT: the asker is in the box, one instruction at a time; the garment word is ALWAYS in the line
 * (critique MUST 1). L1-L2 Ali: "Muke [kurta] khape" (I want the kurta; the engine's want frame, kurta to record). L3-L4 Big Ma:
 * "[The] wadho [kurta]. Hi Nana lai ai." (the big kurta; this is for Nana). Under it the word tiles: Clothes, Colours (L2+),
 * Sizes (L3+), People (L3+): a tile for every piece and person in the scene, asked or not.
 *   1. Tap the piece on the rail: it lifts.  2. Tap the person: it swishes on.
 *   Right: Big Ma "Barabar!" (just right, a family word); they twirl in the mirror; the flash of her camera; the piece goes back on
 *   the rail (nothing is removed, so the last pick is never forced). The row ticks.
 *   Wrong, each with its own gag, then the piece hops back and they say it again (the row will tick plain; nobody frowns):
 *     too big: the kurta pools over the stool onto the floor, the sleeves flop past the hands; Big Ma laughs "Wadho!" (big!)
 *     too small: it sticks halfway, the hem at the chest; "Nindho!" (small!)
 *     the wrong garment: the cap drops over the eyes; the dupatta lands on the head like a tent
 *     the wrong colour: it fits; they look down, puzzled; Big Ma names the colour worn
 *   L1  one person (Ali); two rounds; the rail: today's kurta and a cap of the same colour (so the colour can't decide)
 *   L2  one person; two rounds; three on the rail: the kurta in two colours and a cap; the colour and the garment decide
 *   L3  two people (Ali small, Nana big); Big Ma says the piece, its size and whom; the big and the small kurta, the cap, the
 *       dupatta (a decoy); no colour word (three tile groups at most)
 *   L4  two people; four kurtas, two colours of each size: the size, the colour and the person decide (the garment is always kurta)
 * Known leak: the big kurtas are always Nana's, so "Nana" alone gives the size (sewing.md wants who gets which size said, not
 * fixed: needs a size gag that isn't a wrong answer, or caps of two sizes).
 * Not built: "not the green one" (no said last), take off ("take off the cap": the empty hanger), the photo in the book, the
 * speaking moment (how do I look? bo fine / barabar), Going out (Nani calls the weather: the shawl or the umbrella; its words
 * are to record), the opening joke (Ali stuck in his old kurta).
 */
import { svg, COLOUR_LEX } from "./cloth.js";
import { ALI, NANA, BIGMA } from "./art.js";

const W = typeof window !== "undefined" ? window : globalThis;
const LEX = { kurta: "n.kurta", cap: "n.cap", dupatta: "n.dupatta" };
const PEOPLE = { ali: Object.assign({ size: "small" }, ALI), nana: Object.assign({ size: "big" }, NANA) };

export default async function fit(F) {
  const lv = F.level;
  const two = lv >= 3;
  const byColour = lv === 2 || lv === 4; // (L3 adds the size and the person instead: three tile groups at most)
  const cols = F.shuffle(["red", "green", "blue"]).slice(0, 2);
  // the rail: {k, c, size}
  let rail;
  if (lv === 1) rail = [{ k: "kurta", c: cols[0], size: "small" }, { k: "cap", c: cols[0], size: "small" }];
  else if (lv === 2) rail = [{ k: "kurta", c: cols[0], size: "small" }, { k: "kurta", c: cols[1], size: "small" }, { k: "cap", c: cols[0], size: "small" }];
  else if (lv === 3) rail = [{ k: "kurta", c: cols[0], size: "small" }, { k: "kurta", c: cols[0], size: "big" }, { k: "cap", c: cols[0], size: "small" }, { k: "dupatta", c: cols[1], size: "big" }];
  else rail = [{ k: "kurta", c: cols[0], size: "small" }, { k: "kurta", c: cols[0], size: "big" }, { k: "kurta", c: cols[1], size: "small" }, { k: "kurta", c: cols[1], size: "big" }];
  rail = F.shuffle(rail).map((p, i) => Object.assign({ id: `p${i}` }, p));
  const people = two ? F.shuffle(["ali", "nana"]) : ["ali"];
  // the asks: a piece and (L3+) its person, by size (the big ones are Nana's; the cap and the small ones Ali's)
  const askable = rail.filter((p) => p.k !== "dupatta");
  const asks = [0, 1].map(() => {
    const p = F.pick(askable);
    return { p, who: p.size === "big" ? "nana" : "ali" };
  });

  /* ----- the scene: the wall, the floor, the mirror, the stools, the people, the rail, Big Ma ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sw-room-wall"></div><div class="sw-room-floor"></div>');
  const mx = two ? 0.3 : 0.3;
  F.put("sw-mirror wide", { x: mx, y: 0.84, h: 0.74, w: two ? 0.44 : 0.24 });
  const personEls = {};
  people.forEach((who, i) => {
    const x = two ? [0.19, 0.41][i] : 0.3;
    F.put("sw-stool wide", { x, y: 0.97, h: 0.1, w: 0.12 });
    const P = PEOPLE[who];
    const el = F.put(`sw-person sw-${who}`, { x, y: 0.875, h: who === "nana" ? 0.68 : 0.56, tag: "button", html: `<span class="sw-legs"></span><span class="sw-arm l"></span><span class="sw-arm r"></span><span class="sw-torso"></span><img class="sw-head" src="${F.stamp ? F.stamp(P.face) : P.face}" alt=""><span class="sw-worn"></span>` });
    el.dataset.who = who;
    el.setAttribute("aria-label", P.name);
    personEls[who] = el;
  });
  F.put("sw-railbar wide", { x: 0.77, y: 0.2, h: 0.022, w: 0.44 });
  const railEls = rail.map((p, i) => {
    const x = 0.57 + (0.4 * (i + 0.5)) / rail.length;
    const h = p.k === "cap" ? 0.12 : p.size === "big" ? 0.3 : 0.22;
    const el = F.put(`sw-hang sw-k-${p.k}`, { x, y: 0.2 + h + 0.02, h, tag: "button", html: `<span class="sw-hanger"></span>${svg(p.k, { colour: p.c, length: "long", hang: true })}` });
    el.dataset.id = p.id;
    el.setAttribute("aria-label", "clothes");
    return el;
  });
  F.put("sw-bigma-r", { x: 0.92, y: 1.0, h: 0.36, img: BIGMA.body, z: 4 });

  /* ----- the asks ----- */
  const piece = (p, withSize) => ({ fn: "Item", kind: LEX[p.k], mods: [...(withSize && p.k === "kurta" ? [p.size === "big" ? "a.big" : "a.small"] : []), ...(byColour ? [COLOUR_LEX[p.c]] : [])] });
  const steps = asks.map((a, i) => {
    const line = two ? [{ fn: "TheX", x: piece(a.p, true) }, { fn: "ForWho", x: { fn: "Item", kind: PEOPLE[a.who].lex } }] : { fn: "Need", who: "p1", thing: piece(a.p, false) };
    const tiles = [a.p.k];
    if (byColour) tiles.push(`c-${a.p.c}`);
    if (two && a.p.k === "kurta") tiles.push(a.p.size);
    if (two) tiles.push(a.who);
    return { i, a, line, word: piece(a.p, two), tiles };
  });
  const rows = steps.map((s, k) =>
    F.row({
      key: `fit${k}`,
      line: s.line,
      word: s.word,
      tiles: s.tiles,
      target: () => (sel && sel.dataset.id === s.a.p.id ? personEls[s.a.who] : railEls.find((e) => e.dataset.id === s.a.p.id)),
      data: s,
    })
  );
  const pic = (k, o = {}) => (box) => box.insertAdjacentHTML("beforeend", svg(k, Object.assign({ colour: "plain", cls: "sw-tilepic", length: "long" }, o)));
  const kinds = [...new Set(rail.map((p) => p.k))];
  // (L4's rail is all kurtas: no clothes group; the garment word is still in every line)
  const groups = kinds.length > 1 ? [{ label: { fn: "Item", kind: "n.clothes" }, tiles: kinds.map((k) => ({ key: k, word: { fn: "Item", kind: LEX[k] }, lex: LEX[k], picture: pic(k) })) }] : [];
  if (byColour) groups.push({ label: { fn: "Item", kind: "n.colours" }, tiles: cols.map((c) => ({ key: `c-${c}`, word: { fn: "Item", kind: "n.kurta", mods: [COLOUR_LEX[c]] }, lex: COLOUR_LEX[c], picture: pic("piece", { colour: c }) })) });
  if (two) {
    groups.push({ label: { fn: "Item", kind: "n.sizes" }, tiles: [{ pair: ["big", "small"].map((s) => ({ key: s, word: { fn: "Item", kind: "n.kurta", mods: [s === "big" ? "a.big" : "a.small"] }, lex: s === "big" ? "a.big" : "a.small", picture: pic(s) })) }] });
    groups.push({ label: null, tiles: ["ali", "nana"].map((w) => ({ key: w, word: { fn: "Item", kind: PEOPLE[w].lex }, lex: PEOPLE[w].lex, picture: PEOPLE[w].face })) });
  }
  F.sentence(groups);

  /* ----- the two taps ----- */
  let sel = null;
  let busy = false;
  railEls.forEach((el) =>
    F.on(el, "click", () => {
      F.acted();
      if (busy || !F.current()) return;
      if (sel) sel.classList.remove("lift", "sel");
      sel = sel === el ? null : el;
      if (sel) sel.classList.add("lift");
    })
  );
  Object.values(personEls).forEach((pe) =>
    F.on(pe, "click", async () => {
      F.acted();
      const r = F.current();
      if (!r || busy) return;
      if (!sel) {
        F.jiggle(pe);
        return;
      }
      busy = true;
      F.pause(true);
      const p = rail.find((x) => x.id === sel.dataset.id);
      const pieceEl = sel;
      sel.classList.remove("lift");
      sel = null;
      pieceEl.classList.add("away");
      await wear(pe, p);
      const a = r.data.a;
      const right = p.id === a.p.id && pe.dataset.who === a.who;
      if (right) {
        await F.speak(F.say({ fn: "Exclaim", x: { fn: "Item", kind: "a.proper" } }));
        pe.classList.add("sw-twirl");
        await F.sleep(F.T(700));
        flash();
        await F.sleep(F.T(500));
        pe.classList.remove("sw-twirl");
      } else {
        await gag(pe, p, a);
      }
      off(pe);
      pieceEl.classList.remove("away");
      F.jiggle(pieceEl);
      F.pause(false);
      busy = false;
      if (right) F.add(r);
      else F.oops(r, null);
    })
  );

  /** It swishes on: the worn layer shows the piece, sized against the person (fit, too big, too small, or the wrong garment). */
  async function wear(pe, p) {
    const worn = pe.querySelector(".sw-worn");
    const who = PEOPLE[pe.dataset.who];
    const fitCls = p.k === "kurta" ? (p.size === who.size ? "fit" : p.size === "big" ? "toobig" : "toosmall") : "fit";
    worn.className = `sw-worn on k-${p.k} ${fitCls}`;
    worn.innerHTML = svg(p.k, { colour: p.c, length: "long", stretch: p.k === "kurta", hang: true });
    if (W.Sfx) W.Sfx.play("whoosh", { volume: 0.25 });
    F.jiggle(pe, "sw-wriggle");
    await F.sleep(F.T(700));
  }
  async function gag(pe, p, a) {
    const who = PEOPLE[pe.dataset.who];
    const hold = F.sleep(F.T(1600)); // (the gag stays long enough to be seen, however quick the line)
    if (p.k === "kurta" && p.size !== who.size) {
      // the size gag: Big Ma laughs the size it is
      pe.classList.add("sw-giggle");
      await F.speak(F.say({ fn: "Exclaim", x: { fn: "Item", kind: p.size === "big" ? "a.big" : "a.small" } }));
    } else if (p.k !== a.p.k || pe.dataset.who !== a.who) {
      pe.classList.add("sw-giggle");
      await F.sleep(F.T(900));
    } else {
      // the wrong colour: it fits; a puzzled look down, and the colour worn named
      pe.classList.add("sw-puzzled");
      await F.speak(F.say({ fn: "Item", kind: LEX[p.k], mods: [COLOUR_LEX[p.c]] }));
    }
    await hold;
    pe.classList.remove("sw-giggle", "sw-puzzled");
  }
  function off(pe) {
    const worn = pe.querySelector(".sw-worn");
    worn.className = "sw-worn";
    worn.innerHTML = "";
  }
  function flash() {
    const f = F.put("sw-flash wide", { x: 0.5, y: 1, h: 1, w: 1, z: 30 });
    if (W.Sfx) W.Sfx.play("tap", { volume: 0.3 });
    F.after(F.T(500), () => f.remove());
  }

  await F.ask({ guide: "fit-head" });
  F.begin();
  F.teach("sew-rail", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    Object.values(personEls).forEach((pe) => pe.classList.add("sw-twirl"));
    await F.sleep(F.T(700));
  });
}
