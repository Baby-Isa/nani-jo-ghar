// S08 wave 1A (voice and help in every game): contracts 22 to 26, each red on a timeline of what the build before this wave did
// and green on what the new voice queue and help ladder do. The timelines are small ones built from the probe's own event shapes
// (build/sandbox/lib/contract-hook.mjs, lib/sound.mjs). node --test build/sandbox/contract-voice.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const clip = () => 0.6;
const LEX = new Set(["muke", "bhar", "chai", "khape"]);
const NUMS = new Set(["ek", "ba", "trae"]);
const run = (r) => analyse(r, { root: ROOT, retired: [], clip, lexicon: LEX, numbers: NUMS });
const of = (out, c) => out.filter((b) => b.check === c);
const clone = (x) => JSON.parse(JSON.stringify(x));
const page = (flow, timeline, size = "1366x768") => ({ flow, size, t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const stage = (t, key) => C(t, "stage", { key });
const life = (t, what, step = "", o = {}) => C(t, "life", { what, reason: step, at: t, ...o });
const line = (id, t, text, o = {}) => ({ type: "line", id, who: "cook", text, t, ...o });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const play = (pid, t, url, dur, o = {}) => ({ type: "play", via: "webaudio", url, pid, dur, t, ...o });
const playEnd = (pid, t, why = "ended") => ({ type: "play-end", pid, why, t });
const tap = (t, o = {}) => C(t, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true, exp: { cook: { kind: "tap" } }, ...o });
const T = 1e6;
const ST = "cook:station1:chai";
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);

test("contract-22: a step line said twice within 10 s (samosa's per-put step, daal's tadka order) is a break; once, or 10 s later, passes", () => {
  const tl = sorted([stage(T, ST), life(T, "stage-start", "cook:station"),
    line(1, T + 8000, "Bhar!"), lineEnd(1, T + 8600), line(2, T + 11000, "Bhar!"), lineEnd(2, T + 11600)]);
  const b = of(run(page("cook:samosa", tl)), "contract-22");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /"Bhar!" said twice, 3000 ms apart/);
  const later = clone(tl);
  later.find((e) => e.type === "line" && e.id === 2).t = T + 18700;
  assert.equal(of(run(page("cook:samosa", sorted(later))), "contract-22").length, 0, "10 s later is a new saying");
  // a help line (role howto) is judged against the real clock, a plain line against the child's time (10 s / the test speed)
  const help = clone(tl);
  help.forEach((e) => e.type === "line" && (e.role = "howto"));
  help.find((e) => e.type === "line" && e.id === 2).t = T + 14000;
  assert.equal(of(run(page("cook:samosa", sorted(help))), "contract-22").length, 1, "6 s apart on the real clock");
  const slow = clone(tl);
  slow.find((e) => e.type === "line" && e.id === 2).t = T + 14000;
  assert.equal(of(run(page("cook:samosa", sorted(slow))), "contract-22").length, 0, "6 s at test speed 3 is 18 s of a child's time");
  assert.equal(of(run(page("cook:samosa#speed1", sorted(slow))), "contract-22").length, 1, "at a child's pace it is 6 s");
  // a replay the child asked for (a tap on the face or the card) is hers
  const asked = clone(tl);
  asked.push(tap(T + 10800, { side: true, play: false, on: "button.ng-face" }));
  assert.equal(of(run(page("cook:samosa", sorted(asked))), "contract-22").length, 0);
  // numbers counted as you go, and item words (their own check), are not repeats
  const counts = sorted([stage(T, ST), line(1, T + 8000, "Ba!", { role: "laps" }), lineEnd(1, T + 8500), line(2, T + 9000, "Ba!"), lineEnd(2, T + 9500), line(3, T + 9600, "Chai", { role: "item" }), line(4, T + 9800, "Chai", { role: "item" })]);
  assert.equal(of(run(page("cook:daar", counts)), "contract-22").length, 0);
});

test("contract-22: a clip cut short by the next line starting over it is a break; a stop the game made, or a clip that finished, passes", () => {
  const tl = sorted([stage(T, ST), line(1, T + 100, "Muke chai khape."), play(1, T + 110, "assets/audio/family/mum/bhar-rc.mp3", 2.0), playEnd(1, T + 900, "stop"), lineEnd(1, T + 900),
    line(2, T + 880, "Bhar!"), play(2, T + 890, "assets/audio/family/mum/bhar-rc.mp3", 0.6), playEnd(2, T + 1490), lineEnd(2, T + 1500)]);
  const b = of(run(page("cook:chai-tray#speed1", tl)), "contract-22");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /cut off 1210 ms before its end/);
  const stopped = clone(tl);
  stopped.push({ type: "voice-stop", why: "VoiceStop.stop", t: T + 895 });
  assert.equal(of(run(page("cook:chai-tray#speed1", sorted(stopped))), "contract-22").length, 0, "a stage end or a tap through the pop-up stops it on purpose");
  // at the test speed (3) the clip timers run short and the cut is the test's, not the game's: not judged
  assert.equal(of(run(page("cook:chai-tray", tl)), "contract-22").length, 0);
  const whole = clone(tl);
  whole.find((e) => e.type === "play-end" && e.pid === 1).t = T + 2110;
  whole.find((e) => e.type === "play-end" && e.pid === 1).why = "ended";
  assert.equal(of(run(page("cook:chai-tray#speed1", sorted(whole))), "contract-22").length, 0);
});

test("contract-23: an item's name on a tap over a line, at level 3 or 4, or again within 10 s is a break; said when quiet, once, at level 1, passes", () => {
  const base = sorted([stage(T, ST), line(1, T + 100, "Muke chai khape."), play(1, T + 110, "assets/audio/family/mum/bhar-rc.mp3", 1.5), playEnd(1, T + 1610), lineEnd(1, T + 1620),
    line(2, T + 900, "Chai", { role: "item" }), play(2, T + 910, "assets/audio/family/mum/bhar-rc.mp3", 0.5), playEnd(2, T + 1410), lineEnd(2, T + 1420)]);
  const over = of(run(page("cook:chai-tray", base)), "contract-23");
  assert.equal(over.length, 1);
  assert.match(over[0].measured, /item word "Chai" started while "Muke chai khape\." was being said/);
  // quiet: after the line
  const quiet = clone(base);
  quiet.find((e) => e.type === "line" && e.id === 2).t = T + 2500;
  quiet.find((e) => e.type === "play" && e.pid === 2).t = T + 2510;
  quiet.find((e) => e.type === "play-end" && e.pid === 2).t = T + 3010;
  quiet.find((e) => e.type === "line-end" && e.id === 2).t = T + 3020;
  assert.equal(of(run(page("cook:chai-tray", sorted(quiet))), "contract-23").length, 0);
  // level 3 and 4: never
  assert.match(of(run(page("cook:chai-tray@L3", sorted(quiet))), "contract-23")[0].measured, /said at level 3/);
  assert.equal(of(run(page("cook:chai-tray@L4", sorted(quiet))), "contract-23").length, 1);
  // the same word again within 10 s
  const again = clone(quiet);
  again.push(line(3, T + 6000, "Chai", { role: "item" }), play(3, T + 6010, "assets/audio/family/mum/bhar-rc.mp3", 0.5), playEnd(3, T + 6510), lineEnd(3, T + 6520));
  assert.match(of(run(page("cook:chai-tray", sorted(again))), "contract-23")[0].measured, /again 3500 ms after the last time/);
  // a pop the queue dropped (something was speaking) made no sound and is not judged
  const dropped = clone(base).filter((e) => !((e.type === "play" || e.type === "play-end") && e.pid === 2));
  assert.equal(of(run(page("cook:chai-tray", dropped)), "contract-23").length, 0);
});

test("contract-24: the help (voice and glow) before the idle time of its level is a break; counted from the last action, after it passes", () => {
  const help = (t, level) => life(t, "help", "idle", { by: `L${level} 1` });
  // level 1 waits 7 s: a help 3 s after the step opened (what the 5 s timer without a poke did) breaks
  const early = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), life(T + 500, "step-open", "1", { by: "L1" }), help(T + 3500, 1)]);
  const b = of(run(page("cook:chai-tray", early)), "contract-24");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /Nani's help \(voice and glow\) came 3000 ms after the last action \(L1 waits 7000 ms\)/);
  // 7.5 s after the step opened: passes
  const ok = clone(early);
  ok.find((e) => e.what === "help").t = ok.find((e) => e.what === "help").at = T + 8000;
  assert.equal(of(run(page("cook:chai-tray", sorted(ok))), "contract-24").length, 0);
  // the timer restarts on every action: a tap at 6 s makes a help at 8 s early
  const poked = clone(ok);
  poked.push(tap(T + 6000));
  assert.equal(of(run(page("cook:chai-tray", sorted(poked))), "contract-24").length, 1);
  // level 3 waits 11 s: 8 s is early at L3, fine at L1
  assert.equal(of(run(page("cook:chai-tray@L3", sorted(clone(ok)))), "contract-24").length, 1);
  assert.equal(of(run(page("cook:chai-tray@L4", sorted(clone(ok)))), "contract-24").length, 1);
  // a glow switching on at the start of a level 4 station (chaat L4: "still highlighting the first item") breaks
  const glow = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), C(T + 300, "hl", { n: 1, list: ["cook:bowl"] }), C(T + 4000, "hl", { n: 0, list: [] })]);
  assert.match(of(run(page("cook:assemble@L4", glow)), "contract-24")[0].measured, /the glow on bowl came 300 ms after the last action \(L4 waits 15000 ms\)/);
  glow[2].t = T + 16000; glow[3].t = T + 19000;
  assert.equal(of(run(page("cook:assemble@L4", glow)), "contract-24").length, 0);
  // a step line of hers said at once (L1 said it as the step opened)
  const said = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), line(1, T + 400, "Chulo bar!", { role: "howto" }), lineEnd(1, T + 900)]);
  assert.match(of(run(page("cook:chai-tray", said)), "contract-24")[0].measured, /her step line "Chulo bar!" was said 400 ms/);
  // a wrong pick is an action and the game answers it: #mistake is left alone
  assert.equal(of(run(page("cook:chai-tray#mistake", said)), "contract-24").length, 0);
});

test("contract-25: the bulbs pulse after 15-20 s stuck: before 15 s, or never in a 25 s stretch with no action, is a break", () => {
  const pulse = (t, on) => life(t, "bulb-pulse", on ? "on" : "off");
  const tl = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), tap(T + 1000), pulse(T + 5000, true), pulse(T + 5200, false)]);
  const early = of(run(page("cook:chai-tray", tl)), "contract-25");
  assert.equal(early.length, 1);
  assert.match(early[0].measured, /began to pulse 4000 ms after the last action/);
  const ok = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), tap(T + 1000), pulse(T + 17500, true), tap(T + 26000), pulse(T + 26000, false), tap(T + 27000)]);
  assert.equal(of(run(page("cook:chai-tray", ok)), "contract-25").length, 0);
  const never = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), tap(T + 1000), tap(T + 27000)]);
  const b = of(run(page("cook:chai-tray", never)), "contract-25");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /26 s with no action and the bulbs never pulsed/);
});

test("contract-26: the opening line under the request pop-up is heard whole; a word with no sound (the cancel race) is a break", () => {
  const f = "assets/audio/family/mum/bhar-rc.mp3";
  const tl = sorted([stage(T, ST), C(T + 50, "popup", { open: true }),
    line(1, T + 100, "Muke bhar.", { role: null }), play(1, T + 120, f, 0.5), playEnd(1, T + 620), lineEnd(1, T + 1500),
    C(T + 2000, "popup", { open: false })]);
  const b = of(run(page("cook:chai-tray", tl)), "contract-26");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /"Muke bhar\." was not heard whole: muke had no sound/);
  // the device voice says the word (a play of speechSynthesis with its text): heard
  const heard = clone(tl);
  heard.push({ type: "play", via: "speechSynthesis", text: "Muke", pid: 9, dur: 0.6, est: true, t: T + 110 }, playEnd(9, T + 700));
  assert.equal(of(run(page("cook:chai-tray", sorted(heard))), "contract-26").length, 0);
  // an English placeholder word in the line (never spoken) is not a missing sound
  const ph = clone(heard);
  ph.find((e) => e.type === "line").text = "Muke bhar with.";
  assert.equal(of(run(page("cook:chai-tray", sorted(ph))), "contract-26").length, 0);
});

test("the queue's turns (Lifecycle say-start / say-end): a line asked for while another sounds plays after it; its clips are its own, nothing overlaps", () => {
  const f = "assets/audio/family/mum/bhar-rc.mp3";
  // line 2 is asked for at 0.4 s, while line 1 sounds until 1.6 s, and plays 1.7-2.3 s (without the turns the clip would be line 2's, at call time)
  const tl = sorted([stage(T, ST),
    line(1, T + 100, "Muke bhar."), life(T + 110, "say-start", "1", { by: "Muke bhar." }), play(1, T + 120, f, 1.5), playEnd(1, T + 1620), life(T + 1630, "say-end", "1"), lineEnd(1, T + 1640),
    line(2, T + 400, "Bhar!"), life(T + 1700, "say-start", "2", { by: "Bhar!" }), play(2, T + 1710, f, 0.6), playEnd(2, T + 2310), life(T + 2320, "say-end", "2"), lineEnd(2, T + 2330)]);
  const out = run(page("cook:chai-tray", tl));
  assert.equal(of(out, "contract-7").length, 0);
  assert.equal(of(out, "contract-22").length, 0);
  // the second clip starting over the first (a queue that did not wait): contract-7 sees two lines sounding together
  const over = clone(tl);
  over.find((e) => e.type === "play" && e.pid === 2).t = T + 900;
  const st = over.find((e) => e.what === "say-start" && e.reason === "2");
  st.t = st.at = T + 890;
  assert.equal(of(run(page("cook:chai-tray", sorted(over))), "contract-7").length, 1);
});
