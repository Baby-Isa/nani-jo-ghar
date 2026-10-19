// s08 wave 4A, the daal: contracts 65 (the chop's waves without a gap) and 66 (a stir lap at the flag, its number heard in step),
// each red on a timeline of what the old station did and green on what it does now. The timelines use the probe's own event
// shapes (lib/contract-hook.mjs life entries, lib/sound.mjs lines and clips). node --test build/sandbox/contract-daal.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, CHECKS } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const run = (r) => analyse(r, { root: ROOT, retired: [], clip: () => 0.4, lexicon: new Set(["trae", "ba", "char", "firai"]), numbers: new Set() });
const of = (out, c) => out.filter((b) => b.check === c);
const page = (flow, timeline) => ({ flow, size: "1366x768", t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const life = (t, what, step, by) => C(t, "life", { what, reason: String(step), by });
const line = (id, t, text, role) => ({ type: "line", id, who: "cook", text, t, ...(role ? { role } : {}) });
const play = (pid, t, text) => ({ type: "play", pid, t, via: "speechSynthesis", text, dur: 0.4 });
const T = 1e6;
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);
const stage = C(T, "stage", { key: "cook:station1:marble" });

test("contracts 65 and 66 are registered", () => {
  for (const k of ["contract-65", "contract-66"]) assert.ok(CHECKS[k] && CHECKS[k].item && CHECKS[k].how.length > 40, k);
});

test("contract-65: a wave that waits a flight after the last one is a break; waves that run on pass", () => {
  const throws = (gapMs) => {
    const tl = [stage, life(T + 10, "decoys", 3, "chop lookalike:0")];
    let t = T + 100;
    for (let w = 0; w < 3; w++) {
      for (let i = 0; i < 4; i++) {
        tl.push(life(t, "chop-throw", w, "every:600"));
        t += 600;
      }
      t += gapMs;
    }
    return sorted(tl);
  };
  const old = of(run(page("cook:daar@L3", throws(2400))), "contract-65");
  assert.equal(old.length, 2);
  assert.match(old[0].measured, /a gap of 2400 ms between the waves/);
  assert.equal(of(run(page("cook:daar@L3", throws(0))), "contract-65").length, 0);
  assert.equal(of(run(page("cook:daar@L3", throws(450))), "contract-65").length, 0);
  // a daal chop that logged nothing cannot be judged: a break
  assert.equal(of(run(page("cook:daar", sorted([stage, life(T + 10, "decoys", 1, "chop lookalike:0")]))), "contract-65").length, 1);
  // another station's flow, no chop: nothing
  assert.equal(of(run(page("cook:chai-tray", sorted([stage]))), "contract-65").length, 0);
});

test("contract-66: off the flag, a late number and a quiet lap with nothing said are breaks; in step passes", () => {
  const stir = (laps) => sorted([stage, life(T + 50, "say-start", 1, "Firai! Trae! Jaldi jaldi."), ...laps]);
  // in step: each lap's number starts 80 ms after it, the lap took 800 ms
  const ok = [];
  for (let n = 1; n <= 3; n++) {
    const t = T + 1000 * n;
    ok.push(life(t, "stir-lap", n, "deg:3 da:10 ms:800 ok"), line(10 + n, t + 5, ["", "Hakro!", "Ba!", "Trae!"][n], "laps"), play(100 + n, t + 80, "x"));
  }
  assert.equal(of(run(page("cook:daar", stir(ok))), "contract-66").length, 0);
  // the old stir: counted at 0.92 of any turn (wherever the ladle was), the number late behind the last one
  const bad = [
    life(T + 1000, "stir-lap", 1, "deg:-140 da:8 ms:800 ok"),
    line(21, T + 1005, "Hakro!", "laps"),
    play(201, T + 1900, "x"),
    life(T + 3000, "stir-lap", 2, "deg:2 da:8 ms:700 quiet"),
  ];
  const b = of(run(page("cook:daar", stir(bad))), "contract-66");
  assert.equal(b.length, 3, JSON.stringify(b.map((x) => x.measured)));
  assert.ok(b.some((x) => /140 degrees from the flag/.test(x.measured)));
  assert.ok(b.some((x) => /started 900 ms after the lap/.test(x.measured)));
  assert.ok(b.some((x) => /left out \(quiet\) though no other line/.test(x.measured)));
  // quiet while Nani's line sounds: fine
  const busy = [line(30, T + 900, "Firai! Trae! Jaldi jaldi."), play(300, T + 950, "x"), life(T + 1100, "stir-lap", 1, "deg:0 da:5 ms:900 quiet")];
  assert.equal(of(run(page("cook:daar", stir(busy))), "contract-66").length, 0);
  // a stir with no lap logged: a break
  assert.equal(of(run(page("cook:daar@L2", stir([]))), "contract-66").length, 1);
});
