// Two flows that are not about one game: the rotate card (the upright phone, on every page) and the static CSS lint.
import { BASE, sleep } from "../lib/env.mjs";
import { lintCssAll } from "../../lint/css.mjs";

// Every page, held upright on a phone (390x844): the "please turn me" card must be what shows, and nothing may be clipped or cut.
export const ROTATE_PAGES = ["index.html", "first.html", "cook.html", "clinic.html", "tidy.html", "who.html", "dress.html", "monsoon.html", "snap.html", "find.html"];
export const rotateFlow = {
  id: "rotate-card",
  group: "extra",
  upright: true,
  sizes: ["390x844"],
  title: "The upright phone (390x844): the rotate card on every page",
  timeoutMs: 180000,
  async run(ctx) {
    const { page, rec } = ctx;
    for (const pg of ROTATE_PAGES) {
      await page.goto(`${BASE}/${pg}`, { waitUntil: "load" }).catch(() => {});
      await sleep(1200);
      const name = pg.replace(".html", "") + "-upright";
      const card = await page.evaluate(() => {
        const q = document.querySelector("#rotate, .rotate, .rotate-card, [data-rotate], .njg-rotate");
        if (!q) return null;
        const r = q.getBoundingClientRect();
        return { shown: r.width > 0 && r.height > 0 && getComputedStyle(q).display !== "none" && getComputedStyle(q).visibility !== "hidden", w: Math.round(r.width), h: Math.round(r.height) };
      });
      await rec.state(name);
      if (!card) rec.note(`${pg}: no rotate card element found upright`);
      else if (!card.shown) rec.note(`${pg}: the rotate card exists but is not shown upright`);
    }
    ctx.reachedEnd = true;
  },
};

// The static CSS lint as a "flow": no page, one result of findings (spacing on the grid)
export const cssFlow = {
  id: "css",
  group: "extra",
  title: "The static CSS lint: spacing values on the grid (css/**)",
  static: () => lintCssAll(),
};
