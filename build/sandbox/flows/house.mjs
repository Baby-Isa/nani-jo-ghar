// The house (index.html) for a returning device: two players, so "Who's playing?" comes first; then the house, the lab doors,
// the player picker with its add form, and the grown-ups' panel (press and hold the cog).
// Hook: __home.state(). The save is seeded through the app's own Save API (no game code changes).
import { BASE, sleep } from "../lib/env.mjs";

export const houseFlow = {
  id: "house",
  group: "house",
  title: "The house: who's playing, the doors, the picker, the grown-ups' panel",
  timeoutMs: 120000,
  async run(ctx) {
    const { page, rec } = ctx;
    // a device that has played: two children who have finished their first launch
    await page.goto(`${BASE}/lab/shared.html`, { waitUntil: "load" }).catch(() => {});
    await page.waitForFunction(() => window.Save, null, { timeout: 15000 });
    await page.evaluate(() => {
      Save.init();
      for (const p of Save.players()) Save.removePlayer(p.id);
      const a = Save.addPlayer({ name: "Maryam", colour: Save.COLOURS[0] });
      const b = Save.addPlayer({ name: "Zayn", colour: Save.COLOURS[2] });
      Save.setFlag("firstDone", true, a.id); Save.setFlag("firstDone", true, b.id);
      Save.select(a.id);
    });
    await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
    await page.waitForSelector("#picker:not([hidden]) .tile", { timeout: 15000 });
    await sleep(500);
    await rec.state("whos-playing");
    await page.locator("#picker .tile[data-id]").first().click();
    await page.waitForSelector("a.door", { timeout: 10000 });
    await sleep(700);
    await rec.state("house");
    // the other doors, as "coming soon"
    await page.goto(`${BASE}/index.html?labs=1`, { waitUntil: "load" });
    await page.waitForSelector("a.door.is-soon", { timeout: 10000 }).catch(() => rec.stop("no lab doors with ?labs=1"));
    await sleep(700);
    await rec.state("house-lab-doors");
    // the picker, and its add form
    await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
    await page.waitForSelector("a.door", { timeout: 10000 });
    await page.click("#who");
    await page.waitForSelector("#picker:not([hidden]) .add-tile", { timeout: 5000 });
    await sleep(300);
    await rec.state("picker");
    await page.click(".add-tile");
    await sleep(300);
    await rec.state("picker-add-player");
    await page.keyboard.press("Escape").catch(() => {});
    await page.evaluate(() => { const s = document.querySelector("#picker"); if (s) s.hidden = true; });
    // the grown-ups' panel: press and hold the cog
    const box = await page.locator("#grownups").boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await sleep(1800);
    await page.mouse.up();
    await page.waitForSelector("#grown:not([hidden])", { timeout: 5000 }).catch(() => rec.stop("the grown-ups' panel did not open on a 1.5 s hold"));
    await sleep(400);
    await rec.state("grown-ups-panel");
    ctx.reachedEnd = true;
  },
};
