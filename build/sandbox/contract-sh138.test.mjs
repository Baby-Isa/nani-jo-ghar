// SH-138 (Zafar, 27 Oct: "how it won't pass quality control again"): contract-51 (every word inside its card), 52 (a bubble keeps
// faces and the side panel clear), 53 (the help's light holds one thing), 54 (the side panel's buttons stay in it), read from the
// hook's layout, bubble and spot samples (lib/contract-hook.mjs).
// node --test build/sandbox/contract-sh138.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.6, lexicon: new Set(["muke", "chai", "khape"]), numbers: new Set(["ek", "ba"]) });
const of = (out, c) => out.filter((b) => b.check === c);
const T = 1e6;
const page = (timeline) => ({ flow: "cook:chai", size: "740x320", t0: T, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const lay = (t, o = {}) => ({ type: "c", k: "layout", t, spill: [], rail: [], side: { l: 0, t: 0, r: 250, b: 320 }, ...o });

test("contract-51: a word inside its card is no break; one spilling out is, once per card and word", () => {
  assert.equal(of(run(page([lay(T)])), "contract-51").length, 0);
  const s = { card: "div.wc-card", text: "hakro khun", over: 14 };
  const b = of(run(page([lay(T, { spill: [s] }), lay(T + 100, { spill: [s] })])), "contract-51");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /hakro khun/);
});

test("contract-54: the side panel's buttons inside it are no break; one outside is", () => {
  assert.equal(of(run(page([lay(T)])), "contract-54").length, 0);
  assert.equal(of(run(page([lay(T, { rail: [{ sel: "button#btn-home.rail-btn", out: true }] })])), "contract-54").length, 1);
});

const head = { who: "nana", src: "cook", box: { l: 400, t: 100, r: 480, b: 180 } };
const bub = (t, box) => ({ type: "c", k: "bubble", t, list: [{ who: "nana", text: "Salamun alaykum!", box, tail: { x: 440, y: 95 }, kit: true }], heads: [head], play: { l: 250, t: 0, r: 740, b: 320 }, side: { l: 0, t: 0, r: 250, b: 320 }, vw: 740, vh: 320 });
test("contract-52: a bubble above the head is no break; over the face, or into the side panel, is", () => {
  assert.equal(of(run(page([bub(T, { l: 380, t: 20, r: 560, b: 90 })])), "contract-52").length, 0, "green: above his head");
  assert.match(of(run(page([bub(T, { l: 300, t: 110, r: 560, b: 190 })])), "contract-52")[0].measured, /covers nana's face/);
  assert.match(of(run(page([bub(T, { l: 200, t: 20, r: 420, b: 90 })])), "contract-52")[0].measured, /side panel/);
});

const spot = (t, hole, things) => ({ type: "c", k: "spot", t, holes: [hole], things });
const bottle = { id: "paani", l: 300, t: 200, r: 340, b: 280 };
const milk = { id: "dudh", l: 360, t: 200, r: 400, b: 280 };
test("contract-53: a light hugging one thing (its pill too) is no break; over two things, or far too big, is", () => {
  assert.equal(of(run(page([spot(T, { l: 292, t: 192, r: 348, b: 310 }, [bottle, milk])])), "contract-53").length, 0, "green: the bottle and its pill");
  assert.match(of(run(page([spot(T, { l: 250, t: 190, r: 410, b: 300 }, [bottle, milk])])), "contract-53")[0].measured, /holds 2 things/);
  assert.match(of(run(page([spot(T, { l: 250, t: 150, r: 350, b: 310 }, [bottle, milk])])), "contract-53")[0].measured, /times the size of paani/);
});

test("contract-53 (CHAI-36): a help layer dimming with nothing lit is a break", () => {
  assert.match(of(run(page([{ type: "c", k: "spot", t: T, holes: [], things: [bottle], dark: 1 }])), "contract-53")[0].measured, /nothing lit/);
});
