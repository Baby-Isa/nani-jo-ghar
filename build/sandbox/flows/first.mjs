// First launch, from a new device: index.html -> first.html (make your character, arrive at Nani's house,
// Cook's pantry round, "Can you make me chai?", Cook's chai round, Nani sips, the Eid picture story, Yes/No) -> the house.
// Hooks: window.__story.state(), __charmaker.choices(), __first, __home. The Cook rounds are played by CookPlayer.
import { BASE, sleep } from "../lib/env.mjs";
import { CookPlayer } from "../lib/cook-player.mjs";

const SPEED = 3;
const PICKS = { body: "girl", skin: "s4", hair: "h3", eyes: "e4", top: "t4", bottom: "b5" };
const onPage = (page, name) => page.url().split("?")[0].endsWith("/" + name);

async function story(page) { return page.evaluate(() => (window.__story ? window.__story.state() : null)).catch(() => null); }
async function waitScene(page, scene, timeout = 30000) {
  const t0 = Date.now();
  let st = null;
  while (Date.now() - t0 < timeout) { st = await story(page); if (st && st.scene === scene) return st; await page.waitForTimeout(100); }
  throw new Error(`expected story scene "${scene}", got "${st && st.scene}" at ${page.url()}`);
}
async function tapSel(page, sel, timeout = 8000) {
  const t0 = Date.now();
  for (;;) {
    const box = await page.locator(sel).first().boundingBox().catch(() => null);
    if (box) {
      const x = box.x + box.width / 2, y = box.y + box.height / 2;
      const top = await page.evaluate(([x, y, s]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest(s)); }, [x, y, sel]);
      if (top || Date.now() - t0 > timeout) { await page.mouse.click(x, y); return; }
    } else if (Date.now() - t0 > timeout) throw new Error(`${sel} is not on screen`);
    await page.waitForTimeout(150);
  }
}
async function nextArrow(page, rec, name) {
  await page.waitForSelector("#st-next.in", { timeout: 40000 });
  await page.waitForTimeout(350);
  if (name) await rec.state(name);
  await tapSel(page, "#st-next");
  await page.waitForTimeout(250);
}

async function makeCharacter(ctx, picks, prefix) {
  const { page, rec } = ctx;
  await page.waitForSelector(".cm .cm-sw", { timeout: 20000 });
  await page.waitForTimeout(500);
  await rec.state(`${prefix}-start`);
  let first = true;
  for (const [cat, sw] of Object.entries(picks)) {
    await tapSel(page, `.cm-tab[data-cat="${cat}"]`);
    await page.waitForSelector(`.cm-swatches[data-cat="${cat}"]`);
    if (first) { first = false; await rec.state(`${prefix}-tab-${cat}`); }
    await tapSel(page, `.cm-sw[data-sw="${sw}"]`);
    await page.waitForTimeout(120);
  }
  await rec.state(`${prefix}-made`);
  await tapSel(page, "#cm-done");
}

async function cookRound(ctx, kind, timeoutMs) {
  const { page, rec } = ctx;
  await page.waitForURL((u) => u.pathname.endsWith("/cook.html"), { timeout: 30000 });
  await page.waitForSelector("#njg-play", { timeout: 20000 });
  await page.waitForTimeout(700);
  await rec.state(`${kind}-round-play-button`);
  await tapSel(page, "#njg-play");
  const P = new CookPlayer(page, rec, { speed: SPEED, prefix: `${kind}-round-` });
  try {
    await P.play(() => onPage(page, "first.html"), { timeout: timeoutMs });
  } catch (e) {
    // the page navigating away mid-evaluate is the normal way a round ends
    try { await page.waitForURL((u) => u.pathname.endsWith("/first.html"), { timeout: 20000 }); } catch (e2) { throw e; }
  } finally { for (const c of P.covers) rec.note(`covered tap (${kind} round): ${c}`); }
  await page.waitForURL((u) => u.pathname.endsWith("/first.html"), { timeout: 30000 });
  await page.waitForLoadState("load");
  await page.waitForFunction(() => window.Save && window.__story, null, { timeout: 30000 });
}

// Plays the whole first launch. Used by the "first" flow; returns after the house is showing.
export async function firstLaunch(ctx, { picks = PICKS } = {}) {
  const { page, rec } = ctx;
  await page.goto(`${BASE}/index.html?speed=${SPEED}`, { waitUntil: "load" });
  await page.waitForURL((u) => u.pathname.endsWith("/first.html"), { timeout: 30000 });
  await waitScene(page, "character");
  await makeCharacter(ctx, picks, "character");
  await waitScene(page, "arrive");
  await page.waitForSelector(".st-card.in", { timeout: 30000 });
  await nextArrow(page, rec, "arrive");
  await cookRound(ctx, "pantry", 600000);
  await waitScene(page, "ask-chai");
  await nextArrow(page, rec, "ask-chai");
  await cookRound(ctx, "chai", 600000);
  await waitScene(page, "sip");
  await nextArrow(page, rec, "sip");
  await waitScene(page, "eid");
  for (let i = 0; i < 4; i++) { await page.waitForSelector("#st-next.in", { timeout: 40000 }); await nextArrow(page, rec, `eid-panel-${i + 1}`); }
  await waitScene(page, "help");
  await page.waitForSelector(".st-choice.in .st-no", { timeout: 40000 });
  await page.waitForTimeout(400);
  await rec.state("yes-no");
  await page.locator(".st-no").click(); // No shakes, Nani asks again (UX 14)
  await page.waitForTimeout(500);
  await rec.state("no-shakes");
  await page.waitForTimeout(2600);
  await tapSel(page, ".st-yes");
  await page.waitForTimeout(500);
  await rec.state("yes");
  await page.waitForURL((u) => u.pathname.endsWith("/index.html"), { timeout: 30000 });
  await page.waitForSelector("a.door", { timeout: 15000 });
  await page.waitForSelector("#who .dot.has-char svg", { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  await rec.state("house-with-character");
}

export const firstFlow = {
  id: "first",
  group: "first",
  title: "First launch: character, arrive, pantry round, chai round, Eid story, Yes/No, the house",
  timeoutMs: 1500000,
  async run(ctx) {
    await firstLaunch(ctx);
    ctx.reachedEnd = true;
  },
};
