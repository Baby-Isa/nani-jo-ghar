// run16 fix-daar, DAAR-55 (the Fable eye judge's "the chop light goes off and comes back about +1350 to +1520 ms, the finger left on
// the knife between", daar L4 beside chai): the sandbox's own pixel checks (lib/lightshot.mjs's under.jpg, lib/lightpix.mjs) hide the
// shared light's layers to photograph what is under them; the kit's finger is not one of them. A screencast frame the browser draws
// while they are hidden is not the screen a child sees and must never reach the side-by-side's strips (lib/keyframes.mjs subscribes
// to lib/framebuf.mjs). The hide window was recorded only once the light was shown again, so a frame arriving DURING the hide was
// let through. This plays the screencast with a fake CDP session: a frame before, during and after a hide.
//   node --test build/tools/review/run16/framebuf-hide.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import * as FB from "../../../sandbox/lib/framebuf.mjs";

function fakePage() {
  const cdp = new EventEmitter();
  cdp.send = async () => ({});
  const page = { context: () => ({ newCDPSession: async () => cdp }), screenshot: async () => Buffer.from("x") };
  return { page, cdp };
}
const frame = (cdp, t) => cdp.emit("Page.screencastFrame", { data: Buffer.from(String(t)).toString("base64"), metadata: { timestamp: t / 1000 }, sessionId: 1 });
const tick = () => new Promise((r) => setTimeout(r, 5));

// the hide as the pixel checks do it: lightshot.mjs and lightpix.mjs's own sequence (FB.hideFor where the sandbox has it; else the
// old order: hide, the screenshot taken, shown again, then the window recorded)
async function hideLikeTheChecks(page, during) {
  if (typeof FB.hideFor === "function") return FB.hideFor(page, during);
  const from = Date.now();
  try { await during(); } finally { FB.hidWindow(page, from, Date.now()); }
}

test("DAAR-55: a frame drawn while a pixel check has the light hidden never reaches the strips", async () => {
  const { page, cdp } = fakePage();
  const fb = new FB.FrameBuffer(page);
  const got = [];
  fb.subscribe((f) => got.push(f.t));
  await tick();
  const t0 = Date.now();
  frame(cdp, t0 - 400); // before the hide: kept
  await tick();
  let during = null;
  await hideLikeTheChecks(page, async () => {
    await new Promise((r) => setTimeout(r, 200));
    during = Date.now();
    frame(cdp, during); // drawn and delivered while hidden (the screenshot takes 200-400 ms on a busy machine)
    await new Promise((r) => setTimeout(r, 200));
  });
  await new Promise((r) => setTimeout(r, 400));
  const after = Date.now();
  frame(cdp, after); // well after it is shown again: kept
  await tick();
  await fb.stop().catch(() => {});
  assert.ok(got.includes(t0 - 400), "the frame before the hide is kept");
  assert.ok(got.includes(after), "the frame after the hide is kept");
  assert.ok(!got.includes(during), `a frame drawn while the light was hidden reached the strips (kept: ${got.map((t) => t - t0).join(", ")} ms)`);
});
