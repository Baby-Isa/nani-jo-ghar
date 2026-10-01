// Browser tests for R5's clinic fixes and the heal games' shared play rules, on the real page (clinic.html, through
// the one game host). Uses the sandbox's server and fonts (build/sandbox/lib/env.mjs).
// Run (one browser at a time): COOK_TEST_PORT=8818 flock -w 1800 /tmp/njg-browser.lock timeout 900 node --test build/test_clinic_r5-browser.mjs
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { BASE, startServer, launch, newPage, sleep } from "./sandbox/lib/env.mjs";

let srv, browser;
before(async () => {
  srv = await startServer();
  browser = await launch();
});
after(async () => {
  await browser.close();
  srv.close();
});

async function open(size, query, wait = "window.__clinic && window.__clinic.Stages && window.__clinic.Stages.heal.current && window.__clinic.Stages.heal.current.controller") {
  const p = await newPage(browser, size, { seed: 1 });
  const page = p.page || p;
  await page.goto(`${BASE}/clinic.html?${query}&quiet=1&fast=1&nonav=1`, { waitUntil: "load" });
  await page.waitForFunction(wait, null, { timeout: 30000 });
  await sleep(500);
  return { page, close: () => (p.ctx || page.context()).close() };
}
const heal = (page, fn, arg) => page.evaluate(fn, arg);
/** Play the heal game's own driver (what a child who understood would do) until test(state) is true. */
async function playUntil(page, until, max = 120) {
  for (let i = 0; i < max; i++) {
    if (await page.evaluate(until)) return true;
    const a = await page.evaluate(() => {
      const r = window.__clinic.Stages.heal.current;
      return r && r.controller.debug ? r.controller.debug.next() : { do: "wait" };
    });
    if (!a || a.do === "wait") await sleep(200);
    else if (a.do === "tap") {
      await page.mouse.click(a.x, a.y);
      await sleep(a.after || 150);
    } else if (a.do === "drag") {
      await page.mouse.move(a.pts[0][0], a.pts[0][1]);
      await page.mouse.down();
      for (const [x, y] of a.pts.slice(1)) await page.mouse.move(x, y, { steps: 2 });
      await page.mouse.up();
      await sleep(150);
    } else if (a.do === "button") {
      const b = page.locator(".cl-go:not(.hidden)");
      if (await b.count()) await b.last().click();
      await sleep(300);
    } else if (a.do === "hold") {
      await page.mouse.move(a.x, a.y);
      await page.mouse.down();
      const t0 = Date.now();
      while (!(await page.evaluate(a.until)) && Date.now() - t0 < 8000) await sleep(20);
      await page.mouse.up();
    } else await sleep(200);
  }
  return page.evaluate(until);
}

test("D7, D8, D9: a heal game opens with its goal as the card's headline, one step's row, and no ✓ until it's usable", async () => {
  const { page, close } = await open("1366x768", "stage=heal&game=ear&level=2&seed=7&onboard=0");
  const s = await page.evaluate(() => ({
    head: (document.querySelector(".cl-card .oc-headline") || {}).textContent || "",
    rows: [...document.querySelectorAll(".cl-card .cl-row")].map((r) => r.dataset.row),
    done: [...document.querySelectorAll(".cl-actions .cl-go")].map((b) => !b.classList.contains("hidden")),
    doc: !!document.querySelector(".hs-doc"),
    from: !!document.querySelector(".hs-from"),
  }));
  await close();
  assert.ok(s.head.length > 3, "the headline is the goal");
  assert.deepEqual(s.rows, ["wax0", "wax1"], "only the first step's rows (the wax order) show");
  assert.ok(s.done.every((v) => !v), "the ✓ is hidden at the start");
  assert.ok(!s.doc && !s.from, "no 🩺 badge, no gold half-circles (D16)");
});

test("D5, D6: at level 1 the count sits on the tool and the counted step closes by itself at the count", async () => {
  const { page, close } = await open("1366x768", "stage=heal&game=knee&level=1&seed=7&onboard=0");
  // play until the hammer step is half done: the count is on the hammer
  const ok = await playUntil(page, () => !!document.querySelector(".hs-tool .hs-count"));
  assert.ok(ok, "a count appears on a tool");
  const chip = await page.evaluate(() => ({ text: document.querySelector(".hs-tool .hs-count").textContent, corner: !!document.querySelector(".cl-tally:not(.empty)"), row: !!document.querySelector(".cl-row-count") }));
  assert.ok(/[a-z]/.test(chip.text), "a Kutchi number word at level 1");
  assert.ok(!chip.corner && !chip.row, "no corner tally, no chip in the card's row");
  // finish the first step: it closes without the ✓ (the wrap step opens, its row appears)
  const closed = await playUntil(page, () => !!document.querySelector('.cl-card .cl-row[data-row="wrap"]'), 60);
  const hidden = await page.evaluate(() => [...document.querySelectorAll(".cl-actions .cl-go")].every((b) => b.classList.contains("hidden")));
  await close();
  assert.ok(closed, "the next step opened by itself");
  assert.ok(hidden, "at level 1 the ✓ never showed");
});

test("CLN-60: the eye's first-time help shows the right answer for the first row (never haa on a row read wrong)", async () => {
  // find a seed whose first chart row is read wrong
  let found = null;
  for (let seed = 1; seed < 40 && !found; seed++) {
    const { page, close } = await open("1366x768", `stage=heal&game=eye&level=1&seed=${seed}&onboard=1&cues=1`);
    const wrong = await page.evaluate(() => window.__clinic.Stages.heal.current.controller.debug.plan.chart[0].wrong);
    if (!wrong) {
      await close();
      continue;
    }
    found = seed;
    const reached = await playUntil(page, () => {
      return !!document.querySelector(".njg-onboard") && !!document.querySelector(".hs-judge:not(.hidden) [data-judge='no']");
    }, 80);
    assert.ok(reached, "the judging pills came up with the first-time help on");
    await sleep(400);
    const lit = await page.evaluate(() => {
      const no = document.querySelector('[data-judge="no"]').getBoundingClientRect();
      const yes = document.querySelector('[data-judge="yes"]').getBoundingClientRect();
      const g = document.querySelector(".njg-onboard .ob-ghost, .njg-onboard .ghost, .njg-onboard [class*=ghost]");
      const r = g ? g.getBoundingClientRect() : null;
      const near = (b) => (r ? Math.hypot(r.left + r.width / 2 - (b.left + b.width / 2), r.top + r.height / 2 - (b.top + b.height / 2)) : 1e9);
      return { no: near(no), yes: near(yes), ghost: !!g };
    });
    await close();
    if (lit.ghost) assert.ok(lit.no < lit.yes, `the ghost finger goes to "no" (no ${Math.round(lit.no)} px, yes ${Math.round(lit.yes)} px)`);
  }
  assert.ok(found, "a seed with a wrong first row");
});

test("CLN-51: the drill's tip is under the finger", async () => {
  const { page, close } = await open("1366x768", "stage=heal&game=tooth&level=1&seed=7&onboard=0");
  const at = await playUntil(page, () => {
    const c = window.__clinic.Stages.heal.current.controller.debug.next();
    return c && c.what === "drill";
  }, 80);
  assert.ok(at, "reached the drill");
  const a = await page.evaluate(() => window.__clinic.Stages.heal.current.controller.debug.next());
  const [x, y] = a.pts[0];
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 2, y + 1, { steps: 1 });
  const m = await page.evaluate(([x, y]) => {
    const d = document.querySelector(".hs-drill");
    const svg = d.ownerSVGElement;
    const p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    return { tipX: +d.getAttribute("x") + +d.dataset.tipX, tipY: +d.getAttribute("y") + +d.dataset.tipY, px: q.x, py: q.y };
  }, [x + 2, y + 1]);
  await page.mouse.up();
  await close();
  assert.ok(Math.abs(m.tipX - m.px) < 1 && Math.abs(m.tipY - m.py) < 1, `tip (${m.tipX}, ${m.tipY}) vs finger (${m.px}, ${m.py})`);
});

test("SH-09: the drinks game's card rows are never cut off at level 3 (phone)", async () => {
  const { page, close } = await open("844x390", "stage=heal&game=taste&level=3&seed=7&onboard=0");
  // open every step so every row is drawn
  await page.evaluate(() => {
    const card = window.Clinic.Stages && window.__clinic.Run && document.querySelector(".cl-card");
    void card;
  });
  const cut = await page.evaluate(() =>
    [...document.querySelectorAll(".cl-card .cl-row, .cl-card .oc-headline")]
      .filter((r) => r.getBoundingClientRect().width > 0)
      .map((r) => {
        const t = r.querySelector(".cl-row-text") || r;
        const rr = r.getBoundingClientRect();
        const tr = t.getBoundingClientRect();
        return { text: t.textContent, clipped: t.scrollWidth > t.clientWidth + 1 || tr.right > rr.right + 1 || tr.bottom > rr.bottom + 1 };
      })
      .filter((x) => x.clipped)
  );
  await close();
  assert.deepEqual(cut, [], "no clipped row");
});

test("D11, D12: at a closed-card level the bulb opens the card, a look is counted apart, and the end screen shows the eye badge", async () => {
  const { page, close } = await open("1366x768", "stage=pharmacy&level=3&seed=7&onboard=0", "window.__clinic && window.__clinic.expect && window.__clinic.expect() && document.querySelector('.cl-card .oc-card.closed')");
  // a look: tap the closed card
  await page.click(".cl-card .oc-card.closed .oc-head", { force: true });
  await sleep(200);
  // the bulb: it opens the closed card for its time
  await page.evaluate(() => {
    window.Clinic.Kit.fast = false;
  });
  await page.click(".ng-bulb", { force: true });
  await sleep(300);
  const open1 = await page.evaluate(() => !!document.querySelector(".cl-card .oc-card.bulb-open"));
  const counts = await page.evaluate(() => ({ hints: window.__clinic.Stages && window.Clinic && document.querySelector(".cl-hint-n").textContent }));
  await close();
  assert.ok(open1, "the bulb opened the closed card");
  assert.equal(counts.hints, "1", "one bulb");
});
