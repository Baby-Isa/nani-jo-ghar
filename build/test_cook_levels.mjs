#!/usr/bin/env node
/*
 * CK-35 (Zafar, 14 Oct: level 1's timing windows widen for a five-year-old): the boil and tawa timing windows from
 * data/cook.json, the way the game reads them (js/cook/zone.js Mech.knobs: levels merged in order, then the profile).
 *   node --test build/test_cook_levels.mjs
 * A window is how long the ring stays in its green band: (hi - lo) / rate, in seconds.
 * 1. Level 1 is wide enough for a five-year-old: the boil at least 1.6 s (it was about 1.2 s), the tawa at least 1.3 s
 *    on both sides (it was about 0.9 s).
 * 2. Above level 1 each level is about 15% quicker (design system 11, checks-to-build 11): every step is at most 0.87x
 *    the level below, and no cliff (at least 0.7x).
 * 3. The maani station's tawa (js/cook/stations/maani-line.js: level 1's rates, x(1/(1 - levelSpeed)) per level, the
 *    band from its tawa zone's level) keeps the same ladder.
 * 4. The chai tray's boil (the "tray" profile) is not changed by this row: its own slow, listening windows stay.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const data = J("data/cook.json");
const maani = J("data/stations/maani-line.json");

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const merge = (out, add) => {
  Object.entries(add || {}).forEach(([k, v]) => {
    if (k === "profiles") return;
    out[k] = isObj(v) && isObj(out[k]) ? merge(Object.assign({}, out[k]), v) : v;
  });
  return out;
};
/** Mech.knobs (js/cook/zone.js) without the upgrades. */
function knobs(levels, level, profile) {
  const n = Math.max(1, Math.min(levels.length, level));
  const out = {};
  for (let i = 0; i < n; i++) merge(out, levels[i]);
  if (profile) for (let i = 0; i < n; i++) merge(out, (levels[i].profiles || {})[profile]);
  return out;
}
const win = (band, rate) => (band[1] - band[0]) / rate;
const ladder = (name, ws) => {
  for (let i = 1; i < ws.length; i++) {
    const r = ws[i] / ws[i - 1];
    assert.ok(r <= 0.87, `${name}: level ${i + 1} is ${r.toFixed(2)}x level ${i}'s window (${ws[i].toFixed(2)} s after ${ws[i - 1].toFixed(2)} s): at most 0.87x`);
    assert.ok(r >= 0.7, `${name}: level ${i + 1} is ${r.toFixed(2)}x level ${i}'s window (${ws[i].toFixed(2)} s after ${ws[i - 1].toFixed(2)} s): a cliff, about 0.85x`);
  }
};

const boil = data.mechanics.boil.levels;
const tawa = data.mechanics.tawa.levels;

test("CK-35: the boil's level 1 window is wide (at least 1.6 s)", () => {
  const k = knobs(boil, 1);
  const w = win(k.band, k.rate);
  assert.ok(w >= 1.6, `boil L1 window ${w.toFixed(2)} s`);
  assert.ok(k.band[1] < 0.95, "the band ends short of the boil-over");
});

test("CK-35: the tawa's level 1 window is wide on both sides (at least 1.3 s)", () => {
  const k = knobs(tawa, 1);
  for (const rate of [k.rate * (1 + 0 * k.speedUp), k.rate2]) {
    const w = win(k.band, rate);
    assert.ok(w >= 1.3, `tawa L1 window ${w.toFixed(2)} s at rate ${rate}`);
  }
});

test("CK-35: above level 1 the boil and tawa windows shrink about 15% per level", () => {
  ladder("boil", boil.map((_, i) => { const k = knobs(boil, i + 1); return win(k.band, k.rate); }));
  ladder("tawa", tawa.map((_, i) => { const k = knobs(tawa, i + 1); return win(k.band, k.rate); }));
  ladder("tawa side 2", tawa.map((_, i) => { const k = knobs(tawa, i + 1); return win(k.band, k.rate2); }));
});

test("CK-35: the maani station's tawa keeps the same ladder", () => {
  const speed = (data.timing && data.timing.levelSpeed) || 0.15;
  const k1 = knobs(tawa, 1);
  const st = maani.mechanic.levels;
  const ws = st.map((_, i) => {
    const level = i + 1;
    const zl = (knobs(st, level).zones || {}).tawa || {};
    const kl = knobs(tawa, zl.level || 1);
    const up = Math.pow(1 / (1 - speed), level - 1);
    return win(kl.band || k1.band, k1.rate * up);
  });
  assert.ok(ws[0] >= 1.3, `maani L1 tawa window ${ws[0].toFixed(2)} s`);
  ladder("maani tawa", ws);
});

test("CK-35: the chai tray's boil windows are its own (unchanged by the level 1 widening)", () => {
  // the tray profile's band and rate as they were before CK-35 (S05): the chai's listening round is slow on purpose
  const before = [
    [[0.66, 0.86], 0.09],
    [[0.7, 0.85], 0.068],
    [[0.72, 0.84], 0.052],
  ];
  before.forEach(([band, rate], i) => {
    const k = knobs(boil, i + 1, "tray");
    assert.deepEqual(k.band, band, `tray L${i + 1} band`);
    assert.equal(k.rate, rate, `tray L${i + 1} rate`);
  });
});
