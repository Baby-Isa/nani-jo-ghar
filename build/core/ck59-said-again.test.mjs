// CK-59 (Zafar, 6 Nov night): the said-again rule is per speaker
import { test } from "node:test";
import assert from "node:assert/strict";
const W = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const { loadCookEngine } = await import(`${W}/build/test_cook_harness.mjs`);
const { createVoice } = await import(`${W}/js/core/voice.js`);

test("CK-59: Nana then the cousin both say dudh; Nana not twice; an unnamed line still judged against all", async () => {
  const { Cook } = await loadCookEngine({ seed: 1 });
  const played = [];
  const player = { play: (u) => (played.push(u), Promise.resolve(true)), stop() {}, synth: async () => true };
  Cook.core = { voice: createVoice({ index: null, player, path: "test", phrases: false, gapMs: 0 }) };
  Cook.speed = 1;
  let now = 1e6;
  const real = Date.now;
  Date.now = () => now;
  try {
    const L = Cook.Lang;
    const dudh = (by) => Object.assign({}, L.phrase(["cook-dudh"]), by ? { by } : {});
    assert.equal(await L.speak(dudh("nana")), true, "Nana says dudh");
    now += 7800;
    assert.equal(L.hasVoice(dudh("cousin")), true, "the cousin may say it (log: 7.8 s later)");
    assert.equal(await L.speak(dudh("cousin")), true, "the cousin says dudh");
    now += 1000;
    assert.equal(L.hasVoice(dudh("nana")), false, "Nana again 8.8 s after her own: not said");
    assert.equal(L.hasVoice(dudh("cousin")), false, "the cousin again 1 s after: not said");
    assert.equal(L.hasVoice(dudh()), false, "an unnamed line is judged against every speaker");
    now += 1300;
    assert.equal(L.hasVoice(dudh("nana")), true, "Nana after 10 s of her own");
    assert.equal(L.hasVoice(dudh("cousin")), false, "the cousin still within his 10 s");
    // an unnamed line said first holds back a named one (the order read, then the station's own line, PAN-16)
    const chai = (by) => Object.assign({}, L.line("need", L.phrase(["cook-chai"])), by ? { by } : {});
    assert.equal(await L.speak(chai()), true);
    now += 500;
    assert.equal(L.hasVoice(chai("ma")), false, "unnamed then named: said again");
  } finally {
    Date.now = real;
  }
});
