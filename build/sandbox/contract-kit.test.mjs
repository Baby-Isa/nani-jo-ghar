// S13-A2's contract checks on fixtures: contract-42 (one face circle, three sizes), contract-44 (one finger, the kit's; a stuck help's
// spotlight always gets its finger) and contract-34's widening (every go-on, done and pill button is the kit's .njg-btn).
//   node --test build/sandbox/contract-kit.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyse, CHECKS, SPOT_NO_FINGER_MS } from "./lib/contract.mjs";

const run = (timeline, check, flow = "cook:samosa") =>
  analyse({ flow, size: "1280x665", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "cook:station1:tray", t: 1000 }, ...timeline] }, { lexicon: new Set(), numbers: new Set() }).filter((x) => x.check === check);

test("the new checks are listed", () => {
  for (const k of ["contract-42", "contract-44"]) assert.ok(CHECKS[k] && CHECKS[k].item && CHECKS[k].how, k);
  assert.match(CHECKS["contract-34"].how, /njg-btn/);
});

test("contract-42 (ART-08): a kit circle at its token passes; a game's own face, no size, or a width off its token is a break", () => {
  const fk = (list, t = 1200) => ({ type: "c", k: "facekit", t, list });
  const ok = { sel: "button.njg-face-btn.njg-face-btn-row > .njg-face", kit: true, size: "row", w: 44, h: 44, tok: 44 };
  assert.equal(run([fk([ok, { ...ok, sel: "button.ng-face > .njg-face", size: "guide", w: 56, h: 56, tok: 56 }])], "contract-42").length, 0);
  assert.equal(run([fk([{ ...ok, w: 44.6, h: 43.5 }])], "contract-42").length, 0, "within 1 px");
  const own = run([fk([{ sel: "span.cv-face", kit: false, size: null, w: 58, h: 58, tok: 0 }])], "contract-42");
  assert.equal(own.length, 1);
  assert.match(own[0].measured, /not the kit's face circle/);
  assert.match(run([fk([{ ...ok, size: null }])], "contract-42")[0].measured, /no size/);
  const off = run([fk([{ ...ok, w: 48, h: 48 }])], "contract-42");
  assert.equal(off.length, 1);
  assert.match(off[0].measured, /drawn 48 x 48 px, its size \(row\) is 44 px/);
  // the same face reported again is one break
  assert.equal(run([fk([{ ...ok, w: 48, h: 48 }]), fk([{ ...ok, w: 48, h: 48 }], 1500)], "contract-42").length, 1);
});

// (the S14 roll-out: a station whose showing is all taps has no finger at all, as chai; the finger rules below are a gesture station's, maani's roll)
test("contract-44 (SH-130): one kit finger passes; a game's own finger or two at once is a break", () => {
  const fg = (list, help, t) => ({ type: "c", k: "fingers", t, list, help });
  const kit = { sel: "div.ob-finger", kit: true };
  assert.equal(run([fg([kit], true, 1200), fg([], false, 5000)], "contract-44", "cook:maani-line").length, 0);
  assert.match(run([fg([{ sel: "div.co-finger", kit: false }], false, 1200)], "contract-44", "cook:maani-line")[0].measured, /finger of its own/);
  assert.match(run([fg([kit, kit], true, 1200)], "contract-44", "cook:maani-line")[0].measured, /2 fingers on screen at once/);
});

test("contract-44 (SH-130): the help's spotlight with no finger for 2 s or more is a break; a moment before the finger comes is not", () => {
  const fg = (list, help, t) => ({ type: "c", k: "fingers", t, list, help });
  const kit = { sel: "div.ob-finger", kit: true };
  // the eye test's card step at the laptop size: the box and the lit row, no finger, until the step ends
  const red = run([fg([], true, 1200), fg([], false, 1200 + SPOT_NO_FINGER_MS + 1500)], "contract-44", "cook:maani-line");
  assert.equal(red.length, 1);
  assert.match(red[0].measured, /spotlight showed 3\.5 s with no finger/);
  // the finger comes 300 ms after the box
  assert.equal(run([fg([], true, 1200), fg([kit], true, 1500), fg([], false, 9000)], "contract-44", "cook:maani-line").length, 0);
});

test("contract-44 in chai (Zafar, 28 Oct: no finger, no target): the lit box alone passes; any finger is a break", () => {
  const kit = { sel: "div.ob-finger", kit: true };
  const fg = (list, help, t) => ({ type: "c", k: "fingers", t, list, help });
  assert.equal(run([fg([], true, 1200), fg([], false, 1200 + SPOT_NO_FINGER_MS + 1500)], "contract-44", "cook:chai-tray").length, 0);
  assert.match(run([fg([kit], true, 1200)], "contract-44", "cook:chai-tray")[0].measured, /a finger on screen/);
});

test("contract-34 (S13-A2): a done, go-on or pill button that is not the kit's .njg-btn is a break; the kit's pass", () => {
  const btns = (list, pills = []) => ({ type: "c", k: "buttons", t: 1200, list, pills, exp: null });
  const kitDone = { sel: "button#done-btn.njg-btn.njg-done", go: false, arrow: null, kit: true };
  const kitPill = { sel: "button.njg-btn.njg-pill.cl-pill", text: "haa", kit: true, pill: true };
  assert.equal(run([btns([kitDone], [kitPill])], "contract-34").length, 0);
  const own = run([btns([{ sel: "button.cl-go.done", go: false, arrow: null, kit: false }], [{ sel: "button.cl-pill", text: "Salaam", kit: false, pill: true }])], "contract-34");
  assert.equal(own.length, 2);
  assert.ok(own.every((x) => /is not the kit's button/.test(x.measured)));
  // an old sample with no kit flag (before S13-A2) is not judged on it
  assert.equal(run([btns([{ sel: "button#done-btn", go: false, arrow: null }])], "contract-34").length, 0);
});
