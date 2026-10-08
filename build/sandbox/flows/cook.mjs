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
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 }); // R4: the title has no visible heading (E1)
}

// mode: "fair" (what the game asks), "mistake" (a wrong pick where the mini-game allows it, then on to the end), "hint" (the unguided lab:
// waits for the hesitation hint and glow, presses the light bulb, peeks at a closed card) or "takeback" (E14: once something is placed
// and the station offers it, take it back, then carry on to the end)
// speed: Cook's test speed (3, the default, about 4x quicker to run); 1 plays at a child's pace, so the voice's timing
// against the stage ends is the real one (S04-A, the contract's voice check: "#speed1")
export function cookStation(key, level = 1, { recipe = false, mode = "fair", group = "cook", speed = 3 } = {}) {
  const labKey = recipe ? `recipe:${key}` : key;
  // a recipe is "cook:<id>" unless a station has the same key ("cook:recipe:<id>")
  const id = `cook:${recipe && KEPT.includes(key) ? "recipe:" : ""}${key}` + (level > 1 ? `@L${level}` : "") + (mode !== "fair" ? `#${mode}` : "") + (speed !== 3 ? `#speed${speed}` : "");
  return {
    id,
    group,
    title: `Cook, Station lab: ${labKey}, level ${level}${mode !== "fair" ? `, ${mode} player` : ""}`,
    timeoutMs: (LONG[labKey] || LONG[key] || 300) * 1000 * (mode === "hint" ? 1.3 : 1) * (speed < 3 ? 2.5 : 1),
    async run(ctx) {
      const { page, rec } = ctx;
      await openCook(ctx, { speed });
      const P = new CookPlayer(page, rec, { mode, speed });
      // #takeback: the first-time coaches count as seen (the grown-ups' skip), so the take-back is tested, not the coach (4d)
      if (mode === "takeback") await page.evaluate(() => window.__cook.coachesSeen && window.__cook.coachesSeen());
      await page.evaluate(([k, l, g]) => { __cook.lab(k, g, { level: l }); }, [labKey, level, mode !== "hint"]);
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
      ctx.extra = { badges: P.badges, bulbs: P.bulbs, peeks: P.peeks, mistakes: [...P.made], tookBack: P.tookBack };
      // #takeback (E14, R4): the station took something back and the round still ran to its end; a station that never
      // offers a take-back is noted (a gap for the regression list), not failed
      if (mode === "takeback" && !P.tookBack) rec.note("take-back: this station offered none (no __cook.expectation().undo before Done)");
      ctx.reachedEnd = true;
    },
  };
}

export const cookTitle = {
  id: "cook:title",
  group: "cook",
  title: "Cook: the title, its grown-ups' \"?\", the Station lab list, the word book, the shop",
  timeoutMs: 90000,
  async run(ctx) {
    const { page, rec } = ctx;
    await openCook(ctx);
    await rec.state("title");
    // R4 (E1): the Station lab and the settings are behind the title's grown-ups' "?"
    const gu = await page.$("#gu-btn");
    if (gu) { await gu.click(); await sleep(300); await rec.state("title-grown-ups"); }
    const lab = await page.$("#t-lab");
    if (lab) { await lab.click(); await sleep(400); await rec.state("station-lab-list"); const d = await page.$(".lab-parts summary"); if (d) { await d.click(); await sleep(200); await rec.state("station-lab-parts-open"); } await page.click("#lab-back").catch(() => {}); await sleep(300); }
    else rec.stop("no #t-lab button on the title");
    const book = await page.$("#t-book");
    if (book) { await book.click(); await sleep(500); await rec.state("recipe-book"); await page.click("#book-close").catch(() => {}); await sleep(300); }
    const shop = await page.$("#t-shop");
    if (shop) { await shop.click(); await sleep(400); await rec.state("shop"); const g = await page.$("#gu-btn"); if (g) { await g.click(); await sleep(300); await rec.state("shop-grown-ups"); await g.click(); } await page.click("#shop-done").catch(() => {}); await sleep(300); }
    ctx.reachedEnd = true;
  },
};

// ---- the day-level flows: story days, the shop, the open kitchen ----
const RECIPE_IDS = ["chai", "maani", "daal", "chaat", "samosa", "mishkaki"];
// a save as the one-save migration reads it (see build/test_cook.py open_kitchen_save)
const saveAt = (day, extra = {}) => ({ v: 1, mode: "relaxed", coins: 0, day, best: {}, owned: [], slots: [], words: {}, taught: Object.fromEntries(RECIPE_IDS.slice(0, Math.max(0, day - 1)).map((r) => [r, true])), finished: false, freeRounds: 0, rulesSeen: day > 1, playDays: [], ...extra });

// a story day, from the title: start it, play every order in it, the day's summary, the shop, back to the title.
export function cookDay(n) {
  return {
    id: `cook:day${n}`,
    group: "cook",
    title: `Cook, story day ${n}: from the title, every order, the summary, the shop`,
    timeoutMs: 1500 * 1000,
    async run(ctx) {
      const { page, rec } = ctx;
      await openCook(ctx, { save: saveAt(n, { coins: 20 }) });
      const P = new CookPlayer(page, rec);
      await rec.state("title");
      await page.click("#t-start");
      await sleep(500);
      try {
        await P.play(() => page.evaluate("!!document.querySelector('#sum-shop, #sum-finale')"), { timeout: ctx.timeoutMs - 60000 });
      } finally { for (const c of P.covers) rec.note(`covered tap: ${c}`); }
      await sleep(600);
      await rec.state("day-summary");
      if (await page.$("#sum-finale")) {
        await page.click("#sum-finale"); await sleep(700);
        await rec.state("finale");
        await page.click("#fin-shop");
      } else await page.click("#sum-shop");
      await sleep(400);
      await rec.state("shop");
      const buys = await page.$$("[data-buy]:not([disabled])");
      if (buys.length) { await buys[0].click(); await sleep(300); await rec.state("shop-bought"); }
      await page.click("#shop-done");
      await sleep(500);
      await rec.state("title-after");
      ctx.reachedEnd = true;
    },
  };
}

// the shop on its own: with coins, buy, buy again, leave
export const cookShop = {
  id: "cook:shop",
  group: "cook",
  title: "Cook: the shop with coins to spend: buy, buy again, leave",
  timeoutMs: 120000,
  async run(ctx) {
    const { page, rec } = ctx;
    await openCook(ctx, { save: saveAt(4, { coins: 200 }) });
    await page.click("#t-shop"); await sleep(500);
    await rec.state("shop");
    let bought = 0;
    for (let i = 0; i < 3; i++) {
      const b = await page.$("[data-buy]:not([disabled])");
      if (!b) break;
      await b.click(); bought++; await sleep(350);
      if (i === 0) await rec.state("shop-bought");
    }
    await rec.state("shop-after");
    ctx.extra = { bought };
    await page.click("#shop-done"); await sleep(400);
    await rec.state("title-after");
    ctx.reachedEnd = true;
  },
};

// free cooking: the open kitchen. A finished save, serve two customers, close the kitchen, the summary
export const cookOpenKitchen = {
  id: "cook:open-kitchen",
  group: "cook",
  title: "Cook: free cooking, the open kitchen: serve two customers, close the kitchen, the summary",
  timeoutMs: 1200 * 1000,
  async run(ctx) {
    const { page, rec } = ctx;
    await openCook(ctx, { save: { v: 1, mode: "relaxed", coins: 40, day: 7, best: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 }, owned: [], slots: [], words: {}, taught: Object.fromEntries(RECIPE_IDS.map((r) => [r, true])), finished: true, freeRounds: 0, rulesSeen: true, playDays: [] } });
    await page.waitForSelector("#t-free", { timeout: 10000 });
    await rec.state("title");
    await page.click("#t-free");
    await page.waitForSelector("#close-kitchen", { timeout: 15000 });
    await rec.state("kitchen-open");
    const P = new CookPlayer(page, rec);
    try {
      await P.play(() => page.evaluate("!!document.querySelector('#sum-shop, #sum-finale')"), { timeout: ctx.timeoutMs - 60000, closeKitchenAfter: 2 });
    } finally { for (const c of P.covers) rec.note(`covered tap: ${c}`); }
    await sleep(500);
    const served = await page.evaluate("__cook.state().cards.length");
    if (served < 2) rec.stop(`open kitchen: only ${served} of 2 customers served before closing`);
    await rec.state("summary");
    ctx.reachedEnd = true;
  },
};
