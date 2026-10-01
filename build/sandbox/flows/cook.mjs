// Cook: the title, then every station in the Station lab (the hook: __cook.lab(key, guided, {level})), played fair.
// "fetch" is Nani's pantry. "cook:<recipe>" plays a whole recipe (recipe:<id>), every station in turn.
import { BASE, sleep } from "../lib/env.mjs";
import { CookPlayer } from "../lib/cook-player.mjs";

export const KEPT = ["fetch", "chai-tray", "maani-line", "mishkaki-grill", "daar", "chop", "tadka", "stir", "assemble", "samosa"];
export const RECIPES = ["chai", "maani", "daal", "chaat", "samosa", "mishkaki"];
export const PARTS = ["passme", "pour", "boil", "count", "roll", "flip", "fill", "fry", "thread", "grill", "roll-tawa"];
// stations that cook a whole order on one screen take longer (seconds, at test speed 3)
const LONG = { "maani-line": 600, samosa: 900, daar: 900, mishkaki: 900, "recipe:maani": 1200, "recipe:daal": 1200, "recipe:chaat": 1200, "recipe:samosa": 1500, "recipe:mishkaki": 1200 };

export async function openCook(ctx, { speed = 3, save } = {}) {
  const { page } = ctx;
  await page.goto(`${BASE}/cook.html?speed=${speed}`, { waitUntil: "load" });
  await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem("njg-cook-v1", JSON.stringify(s)); }, save || null);
  await page.goto(`${BASE}/cook.html?speed=${speed}`, { waitUntil: "load" });
  await page.waitForSelector("#panel h1", { timeout: 20000 });
}

export function cookStation(key, level = 1, { recipe = false } = {}) {
  const labKey = recipe ? `recipe:${key}` : key;
  // a recipe is "cook:<id>" unless a station has the same key ("cook:recipe:<id>")
  const id = `cook:${recipe && KEPT.includes(key) ? "recipe:" : ""}${key}` + (level > 1 ? `@L${level}` : "");
  return {
    id,
    group: "cook",
    title: `Cook, Station lab: ${labKey}, level ${level}`,
    timeoutMs: (LONG[labKey] || LONG[key] || 300) * 1000,
    async run(ctx) {
      const { page, rec } = ctx;
      await openCook(ctx);
      const P = new CookPlayer(page, rec);
      await page.evaluate(([k, l]) => { __cook.lab(k, true, { level: l }); }, [labKey, level]);
      await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
      await sleep(500);
      await rec.state("start");
      try {
        await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: ctx.timeoutMs - 20000 });
      } finally {
        for (const c of P.covers) rec.note(`covered tap: ${c}`);
      }
      await sleep(400);
      await rec.state("result");
      ctx.reachedEnd = true;
    },
  };
}

export const cookTitle = {
  id: "cook:title",
  group: "cook",
  title: "Cook: the title, the Station lab list, the word book",
  timeoutMs: 90000,
  async run(ctx) {
    const { page, rec } = ctx;
    await openCook(ctx);
    await rec.state("title");
    const lab = await page.$("#t-lab");
    if (lab) { await lab.click(); await sleep(400); await rec.state("station-lab-list"); const d = await page.$(".lab-parts summary"); if (d) { await d.click(); await sleep(200); await rec.state("station-lab-parts-open"); } await page.click("#lab-back").catch(() => {}); await sleep(300); }
    else rec.stop("no #t-lab button on the title");
    const book = await page.$("#t-book");
    if (book) { await book.click(); await sleep(500); await rec.state("recipe-book"); await page.click("#book-close").catch(() => {}); await sleep(300); }
    const shop = await page.$("#t-shop");
    if (shop) { await shop.click(); await sleep(400); await rec.state("shop"); await page.click("#shop-done").catch(() => {}); await sleep(300); }
    ctx.reachedEnd = true;
  },
};
