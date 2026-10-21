// S08 wave 1A: Nani's help ladder (js/shared/guide.js stepper; SH-60, SH-95, SH-96, PAN-16). The numbers are shrunk so the
// test runs in a second or two; the rules are the real ones. node --test build/test_shared_guide.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

globalThis.self = globalThis;
const G = createRequire(import.meta.url)("../js/shared/guide.js");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const make = (level = 1) => {
  const log = [];
  const st = G.stepper({
    level: () => level,
    show: (html) => log.push(["show", html]),
    clear: () => log.push(["clear"]),
    speak: (s) => (log.push(["speak", s.html]), Promise.resolve()),
    glow: (s, on) => log.push(["glow", s.html, on]),
    onHelp: () => log.push(["help"]),
  });
  return { st, log };
};
const kinds = (log) => log.map((x) => x[0]).filter((k) => k !== "clear");

test("the ladder's table: 7, 8, 11 and 15 s by level; a repeat after 10 s; the bulbs pulse at 17 s (2 s later than before at level 1)", () => {
  assert.deepEqual(G.PAUSE, [7000, 8000, 11000, 15000]);
  assert.equal(G.REPEAT, 10000);
  assert.ok(G.BULB_PULSE >= 15000 && G.BULB_PULSE <= 20000);
});

test("a step opens: its line is shown at once (SH-63, Zafar 21 Oct), nothing said or lit, at any level; the help comes after the pause, voice and glow together", async () => {
  G.PAUSE = [300, 300, 300, 300];
  G.REPEAT = 5000;
  for (const level of [1, 3]) {
    const { st, log } = make(level);
    G.poke();
    st.open({ html: `Bhar ${level}!`, line: null });
    assert.deepEqual(kinds(log), ["show"], `L${level}: the line shown at the open, nothing said or lit`);
    await wait(150);
    assert.deepEqual(kinds(log), ["show"], "nor before the pause");
    await wait(450);
    // voice and glow together
    assert.deepEqual(kinds(log), ["show", "help", "speak", "glow"], `L${level}: voice and glow together`);
    assert.equal(log.find((x) => x[0] === "glow")[2], true);
    st.close();
  }
});

test("the pause is counted from the LAST action: a poke restarts it; a help never comes again with no action (SH-60); the same line is not said again before the repeat time", async () => {
  G.PAUSE = [400, 400, 400, 400];
  G.REPEAT = 700;
  const { st, log } = make(1);
  G.poke();
  st.open({ html: "Samosa waar!" });
  await wait(250);
  st.poke(); // the child did something
  await wait(300); // 550 ms after the open, 300 after the poke: still no help
  assert.deepEqual(kinds(log), ["show"]);
  await wait(300); // 400+ after the poke
  assert.deepEqual(kinds(log), ["show", "help", "speak", "glow"]);
  log.length = 0;
  await wait(1000); // past the repeat with no action: SH-60, the help "shouldn't persist"
  assert.deepEqual(kinds(log), [], "never again while the child does nothing");
  st.poke(); // the child acts: the pause runs again from that action
  await wait(750); // (the ladder's clock ticks every 200 ms)
  assert.ok(kinds(log).includes("glow"), "after an action and the pause, the help again");
  st.close();
});

test("a line that was just said (the daar's tadka order at the start) is not said again by the help; the glow still comes (PAN-16)", async () => {
  G.PAUSE = [250, 250, 250, 250];
  G.REPEAT = 5000;
  const { st, log } = make(2);
  G.poke();
  G.markSaid("Pela jeeru. Ne poi rai.");
  st.open({ html: "x", line: { segs: [{ t: "Pela jeeru. Ne poi rai.", lang: "k" }] } });
  await wait(600);
  assert.ok(!kinds(log).includes("speak"), "not said twice");
  assert.ok(kinds(log).includes("glow") && kinds(log).includes("show"));
  st.close();
  // her own bulb or a wrong tap asks for it: that is said whatever was said before
  const m = make(2);
  G.poke();
  G.markSaid("Bhar!");
  m.st.open({ html: "Bhar!", line: { segs: [{ t: "Bhar!", lang: "k" }] }, helpAfter: false });
  m.st.help();
  assert.ok(kinds(m.log).includes("speak"));
  m.st.close();
});

test("closing a step stops its help: no voice or glow after the step is done; its line stays until the next step (SH-63)", async () => {
  G.PAUSE = [250, 250, 250, 250];
  const { st, log } = make(1);
  G.poke();
  st.open({ html: "Waar!" });
  st.close();
  await wait(500);
  // SH-63 (Zafar, 21 Oct: never empty): the line stays until the next step opens; close({clear: true}) (the stage's end) clears it
  assert.ok(!kinds(log).includes("speak") && !log.some((x) => x[0] === "glow" && x[2]) && log[log.length - 1][0] !== "clear", JSON.stringify(log));
  st.open({ html: "Tar!" });
  st.close({ clear: true });
  assert.equal(log[log.length - 1][0], "clear");
});

test("the page's idle clock: poke() and idleMs(); the bulbs' pulse is a class on both bulbs", () => {
  G.poke();
  assert.ok(G.idleMs() < 50);
  const hit = [];
  const mk = () => ({ classList: { toggle: (c, on) => hit.push([c, on]) } });
  globalThis.document = { querySelectorAll: () => [mk(), mk()] };
  G.pulseBulbs(true);
  G.pulseBulbs(false);
  delete globalThis.document;
  assert.deepEqual(hit, [["help-pulse", true], ["help-pulse", true], ["help-pulse", false], ["help-pulse", false]]);
});
