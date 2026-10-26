// CLN-126 / CLN-127 proof: plays the fever heal game (level 1, real pace) with its own debug driver and records, for
// every line SHE says, whether her bubble (.cl-bubble.who-patient) was on screen while it played, and where its tail
// pointed against her face (the art's head and mouth anchors). Prints one line per patient line and a summary;
// exit 1 if a line of hers had no bubble.
//   COOK_TEST_PORT=8896 flock -w 900 /tmp/njg-browser.lock timeout 300 node build/tools/review/fever_bubbles.mjs [level] [size] [seed]
import { BASE, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
const level = +(process.argv[2] || 1);
const size = process.argv[3] || "1280x665";
const seed = process.argv[4] || "11";
const srv = await startServer();
const browser = await launch();
let bad = 0;
try {
  const { page } = await newPage(browser, size);
  await page.addInitScript(() => { try { localStorage.setItem("njg-test", "1"); } catch (e) {} });
  await page.goto(`${BASE}/clinic.html?stage=heal&game=fever&level=${level}&seed=${seed}&quiet=1&fast=0&nonav=1&onboard=0`, { waitUntil: "load" });
  await page.waitForFunction(() => window.Clinic && Clinic.Kit && Clinic.Kit.Voice && window.njgTest?.clinic && njgTest.clinic.Stages && njgTest.clinic.Stages.heal.current, null, { timeout: 30000 });
  // every patient line: sampled every 50 ms while it plays
  await page.evaluate(() => {
    const V = Clinic.Kit.Voice;
    window.__lines = [];
    const say = V.say;
    V.say = function (line, opts = {}) {
      const who = opts.who || (line && line.who) || "doctor";
      const p = say.apply(this, arguments);
      if (who === "patient") {
        const rec = { text: Clinic.Kit.plain(typeof line === "string" ? { english: line } : line), seen: 0, samples: 0, tail: null, face: null };
        window.__lines.push(rec);
        let playing = false;
        const t = setInterval(() => {
          if (!playing && V.busy) playing = true;
          const b = document.querySelector(".cl-bubble.who-patient");
          rec.samples++;
          if (b && b.getBoundingClientRect().width > 0) {
            rec.seen++;
            const r = b.getBoundingClientRect();
            // the tail's tip from its own drawn box (::before): CLN-127's face placement draws it out of the bubble's side
            const cs = getComputedStyle(b, "::before");
            const tl = parseFloat(cs.left), tt = parseFloat(cs.top), tw = parseFloat(cs.width) || 0, th = parseFloat(cs.height) || 0;
            const pl = b.dataset.njgPlace || "";
            const bl = parseFloat(getComputedStyle(b).borderLeftWidth) || 0, bt = parseFloat(getComputedStyle(b).borderTopWidth) || 0;
            const x0 = r.left + bl + (isNaN(tl) ? r.width / 2 : tl), y0 = r.top + bt + (isNaN(tt) ? 0 : tt);
            rec.tail = pl === "face-right" ? { x: Math.round(x0), y: Math.round(y0 + th), place: pl } : pl === "face-left" ? { x: Math.round(x0 + tw), y: Math.round(y0 + th), place: pl } : { x: Math.round(x0 + tw / 2), y: Math.round(pl === "below" ? y0 : y0 + th), place: pl };
            const sp = V.speakers.patient && V.speakers.patient();
            if (sp) { const q = sp.getBoundingClientRect(); rec.face = { l: Math.round(q.left), t: Math.round(q.top), r: Math.round(q.right), b: Math.round(q.bottom) }; }
          }
        }, 50);
        p.then(() => setTimeout(() => clearInterval(t), 60));
      }
      return p;
    };
  });
  const m = page.mouse;
  const t0 = Date.now();
  while (Date.now() - t0 < 150000) {
    const a = await page.evaluate(() => { const r = njgTest.clinic.Stages.heal.current; return r && r.controller.debug ? r.controller.debug.next() : null; }).catch(() => null);
    if (!a) break;
    if (a.do === "tap") { await m.move(a.x, a.y); await m.down(); await m.up(); await page.waitForTimeout(600); }
    else if (a.do === "button") { const v = page.locator(".cl-go:not(.hidden)"); if (await v.count()) await v.last().click().catch(() => {}); await page.waitForTimeout(600); }
    else await page.waitForTimeout(250);
    if (await page.evaluate(() => !!njgTest.clinic.last || !njgTest.clinic.Stages.heal.current)) break;
  }
  await page.waitForTimeout(1500);
  const lines = await page.evaluate(() => window.__lines);
  for (const l of lines) {
    const ok = l.seen > 0;
    if (!ok) bad++;
    // CLN-127: where the tip lands on her head: hair (its top third), face (eyes to chin) or off her head
    const at = !l.tail || !l.face ? "-" : l.tail.x < l.face.l - 2 || l.tail.x > l.face.r + 2 || l.tail.y > l.face.b + 2 ? "off her head" : l.tail.y < l.face.t + (l.face.b - l.face.t) / 3 ? "on her hair" : "at her face";
    console.log(`${ok ? "bubble" : "NO BUBBLE"}  "${l.text}"  on screen ${l.seen}/${l.samples} samples  tail tip ${l.tail ? `${l.tail.x},${l.tail.y} (${l.tail.place})` : "-"}  her head anchor ${l.face ? `${l.face.l},${l.face.t}-${l.face.r},${l.face.b}` : "-"}  tip ${at}`);
  }
  console.log(`${lines.length} lines of hers, ${bad} without a bubble`);
} finally { await browser.close(); srv.close(); }
process.exit(bad ? 1 : 0);
