// The device voice model and the heardWhole expect (S13-V, LNG-16): pure parts, no browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { utterances, uttOfPlay, uttMs } from "./lib/device-voice.mjs";
import { heardWhole } from "./lib/evidence-probe.mjs";
import { parseExpect, parseCapture } from "./lib/evidence.mjs";

const u = (ev, uid, t, x = {}) => ({ type: "utt", ev, uid, pid: uid, text: `w${uid}`, t, load: "a", ...x });

test("utterances: heard, cut, silent (dropped or cancelled before it started), never started", () => {
  const list = utterances([
    u("speak", 1, 100), u("start", 1, 180), u("end", 1, 600),
    u("speak", 2, 700), u("start", 2, 780), u("cut", 2, 900, { by: "VoiceStop.stop(\"stage:x\")" }),
    u("speak", 3, 1000), u("dropped", 3, 1000, { why: "spoken before the device's voices were in" }),
    u("speak", 4, 1100),
    { type: "utt", ev: "voices-asked", t: 50, load: "a" }, { type: "utt", ev: "cancel", t: 900, load: "a" },
  ]);
  assert.deepEqual(list.map((x) => x.outcome), ["heard", "cut", "silent", "pending"]);
  assert.match(list[2].by, /voices/);
  assert.equal(uttOfPlay(list, { pid: "0|3", t0: 1010 }).uid, 3);
  assert.ok(uttMs("muke chai khape") >= 1000);
});

test("heardWhole: the opening is heard whole only when every part started and ended; a child's tap-through is the design", () => {
  const line = (t0, plays) => ({ text: "Muke chai khape,", t0, plays });
  const dev = (pid, t0) => ({ pid: `0|${pid}`, via: "speechSynthesis", t0, text: "w" });
  // the opening's first word dropped before the voices were in
  let U = utterances([u("speak", 1, 1000), u("dropped", 1, 1000, { why: "spoken before the device's voices were in" }), u("speak", 2, 1300), u("start", 2, 1380), u("end", 2, 1800)]);
  let r = heardWhole({ lines: [line(1000, [dev(1, 1000), dev(2, 1300)])] }, U, [990], 1000, 0);
  assert.equal(r.ok, false);
  assert.match(r.why, /silent/);
  // all heard, starting 20 ms after the order
  U = utterances([u("speak", 1, 1000), u("start", 1, 1080), u("end", 1, 1500)]);
  r = heardWhole({ lines: [line(1010, [dev(1, 1000)])] }, U, [990], 1000, 0);
  assert.equal(r.ok, true);
  // a clip cut by the child's tap through the card: heard whole until the tap
  const clip = { pid: "0|9", via: "webaudio", url: "assets/audio/family/mum/maani-rc.mp3", t0: 1500, dur: 1, end: 1700, why: "stop" };
  r = heardWhole({ lines: [line(1010, [dev(1, 1000), clip])] }, U, [990], 1000, 0, [{ type: "utt", ev: "cancel", t: 1705, by: "VoiceStop.stop(\"request-popup\")" }]);
  assert.equal(r.ok, true);
  // the same clip cut by a stage's stop is a loss
  r = heardWhole({ lines: [line(1010, [dev(1, 1000), clip])] }, U, [990], 1000, 0, [{ type: "utt", ev: "cancel", t: 1705, by: "VoiceStop.stop(\"stage:x\")" }]);
  assert.equal(r.ok, false);
  // a line starting late
  r = heardWhole({ lines: [line(2500, [dev(1, 1000)])] }, U, [990], 1000, 0);
  assert.equal(r.ok, false);
});

test("the spec words: utter, heardWhole, a strip of up to 60 frames (a film, S14 tools: was 30 until the film of a whole order)", () => {
  assert.deepEqual(parseCapture("utter"), { kind: "utter", raw: "utter" });
  assert.equal(parseExpect("heardWhole:life:request").ms, 1000);
  assert.equal(parseExpect("heardWhole:life:request<=1500").ms, 1500);
  assert.equal(parseCapture("strip:body:24x200").n, 24);
  assert.equal(parseCapture("strip:body:60x200").n, 60);
  assert.ok(parseCapture("strip:body:61x200").error);
});
