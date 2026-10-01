// The end-of-round card (js/shared/results.js) pops its badges in one at a time (the stopwatch counts up, the tick gauge fills, then the
// light bulb, about 2.2 s in all). A screenshot taken before the last one has landed shows an empty slot: that was the "hints badge
// missing" on the first sandbox shots of chai-tray at 844x390. Wait until every badge is in, then let it settle.
export async function waitBadges(page, { timeout = 8000, settle = 450 } = {}) {
  try {
    await page.waitForFunction(() => {
      const b = [...document.querySelectorAll(".njg-results .rs-badge")];
      return b.length > 0 && b.every((x) => x.classList.contains("in") && !x.classList.contains("pre"));
    }, null, { timeout });
  } catch (e) { /* page 2 (the words) or no badges: carry on */ }
  await page.waitForTimeout(settle);
}

// what the badges on screen say, for the report: [{badge, shown, box}]
export async function readBadges(page) {
  return page.evaluate(() => [...document.querySelectorAll(".njg-results .rs-badge")].map((x) => {
    const r = x.getBoundingClientRect();
    return { badge: x.dataset.badge, tier: (x.className.match(/tier-(\w+)/) || [])[1] || "", hn: x.dataset.hn || "", shown: x.classList.contains("in") && getComputedStyle(x).opacity > 0.5, left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom), vw: innerWidth, vh: innerHeight };
  }));
}
