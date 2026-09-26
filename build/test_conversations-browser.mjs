// Browser smoke test for the Conversations lab (lab/conversations.html, js/shared/conversations.js):
// the bubbles at a phone (390x844) and a laptop (1366x768); UX §14 (a wrong pill shakes and
// buzzes, the speaker cycles embarrassed looks and asks again until the right pill); the dodging
// No (E5); the boy/girl reply voice read from the save; placeholder flags in the line table; and
// the three placement simulations (first launch, Cook, the clinic) run to the end, with the
// frequency rule declining the extra moments. Screenshots: build/reports/conversations-mvp/.
// One browser, port 8812 (CONV_TEST_PORT overrides).
// Run: node build/test_conversations-browser.mjs   (needs the global playwright; Chromium in /opt/pw-browsers)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = Number(process.env.CONV_TEST_PORT || 8812);
const SHOTS = path.join(ROOT, "build/reports/conversations-mvp");
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch (e) {
  pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".mp3": "audio/mpeg", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const fails = [];
const check = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) fails.push(what);
};
const opts = { headless: true };
if (fs.existsSync("/opt/pw-browsers/chromium")) opts.executablePath = "/opt/pw-browsers/chromium";
let browser;
try {
  browser = await pw.chromium.launch(opts);
} catch (e) {
  browser = await pw.chromium.launch({ headless: true });
}
fs.mkdirSync(SHOTS, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(w, h, extra = "") {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 600, isMobile: w < 600 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/404|Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.addInitScript(() => {
    window.__vib = [];
    try {
      Object.defineProperty(navigator, "vibrate", { value: (ms) => (window.__vib.push(ms), true), configurable: true });
    } catch (e) {
      /* ignore */
    }
  });
  await page.goto(`http://localhost:${PORT}/lab/conversations.html?speed=4&silent=1&idle=60000${extra}`);
  await page.waitForSelector("body[data-ready]");
  return { ctx, page, errors };
}
// tap a pill twice (hear it, then say it)
async function tapTap(page, sel) {
  // force: a throbbing pill is never "stable" to Playwright
  await page.click(sel, { force: true, timeout: 3000 });
  await sleep(450);
  await page.click(sel, { force: true, timeout: 3000 });
}
// answer every moment right (after one wrong try, if asked) until the simulation ends
async function autoAnswer(page, { wrongFirst = false, limit = 60000 } = {}) {
  const t0 = Date.now();
  let moments = 0;
  while (Date.now() - t0 < limit) {
    const running = await page.evaluate(() => !!document.body.dataset.running);
    const box = await page.$(".cv-replies.in");
    if (!running && !box) return moments;
    if (box && !(await box.evaluate((b) => b.dataset.handled))) {
      await box.evaluate((b) => (b.dataset.handled = "1"));
      moments++;
      await sleep(250);
      const wrong = await page.$('.cv-pill[data-correct="false"]:not(.gone)');
      if (wrongFirst && wrong) {
        await tapTap(page, '.cv-pill[data-correct="false"]:not(.gone)');
        await sleep(700);
      }
      const right = '.cv-pill[data-correct="true"]:not(.gone)';
      if (await page.$(right)) await tapTap(page, right);
    }
    await sleep(120);
  }
  return moments;
}

for (const [w, h] of [[1366, 768], [390, 844]]) {
  const tag = `${w}x${h}`;
  const { ctx, page, errors } = await open(w, h);
  await page.evaluate(() => Save.clear("conversations"));

  // the line table flags placeholders
  const ph = await page.$$eval("#lines tr[data-ph]", (rows) => rows.map((r) => r.dataset.line));
  check(ph.includes("help-cook") && ph.includes("who-am-i") && ph.includes("x-kida"), `${tag}: placeholder lines flagged in the lab (${ph.join(", ")})`);
  check(!(await page.$('#lines tr[data-line="fine"][data-ph]')), `${tag}: family lines are not flagged`);

  // the voice: boy -> Zafar, girl -> Mum, read from the save
  await page.click('#gender button[data-v="girl"]');
  check((await page.evaluate(() => Conversations.childVoice(Conversations.gender()))) === "mum", `${tag}: girl -> Mum's voice`);
  await page.click('#gender button[data-v="boy"]');
  check((await page.evaluate(() => Conversations.childVoice(Conversations.gender()))) === "zafar", `${tag}: boy -> Zafar's voice`);

  // one exchange, UX §14: E4 from Nana, tap Na twice
  await page.selectOption("#ex", "request.make");
  await page.selectOption("#sp", "nana");
  await page.click('#stage button[data-v="S1"]');
  await page.click('#rung button[data-v="1"]');
  await page.click("#play");
  await page.waitForSelector(".cv-replies.in .cv-pill");
  await sleep(1000); // the ghost finger, the first time ever
  const moods = [];
  for (let i = 0; i < 3; i++) {
    await tapTap(page, '.cv-pill[data-correct="false"]');
    await page.waitForSelector(".cv-pill.shake", { timeout: 2000 }).catch(() => null);
    await sleep(120);
    moods.push(await page.$eval("#mood", (e) => e.textContent));
    if (i === 0) {
      const shaking = await page.$(".cv-pill.shake");
      check(!!shaking, `${tag}: a wrong pill shakes`);
      await page.screenshot({ path: path.join(SHOTS, `wrong-shake-${tag}.png`) });
    }
    await sleep(700);
  }
  check(new Set(moods.filter(Boolean)).size >= 3, `${tag}: the speaker cycles embarrassed looks (${moods.join(" | ")})`);
  check((await page.evaluate(() => window.__vib.length)) >= 3, `${tag}: the phone buzzes on each wrong reply`);
  check(!!(await page.$(".cv-pill.throb")), `${tag}: after two wrongs the right pill throbs`);
  check(!!(await page.$(".cv-replies.in")), `${tag}: the conversation doesn't move on`);
  await tapTap(page, '.cv-pill[data-correct="true"]');
  await page.waitForFunction(() => !document.querySelector(".cv-layer") && !document.body.dataset.running, null, { timeout: 8000 });
  const last = await page.$eval("#log", (e) => e.textContent.trim().split("\n").pop());
  check(/first try no/.test(last) && /4 tries/.test(last), `${tag}: the first try is logged (${last})`);

  // the bubbles: a clean shot mid-question, and nothing wider than the screen
  await page.selectOption("#ex", "wellbeing.howareyou");
  await page.click('#stage button[data-v="S2"]');
  await page.click("#play");
  await page.waitForSelector(".cv-replies.in .cv-pill");
  await sleep(400);
  const overflow = await page.evaluate(() => {
    const r = [...document.querySelectorAll(".cv-bubble, .cv-pill")].map((e) => e.getBoundingClientRect());
    return r.some((b) => b.left < -1 || b.right > innerWidth + 1 || b.top < -1 || b.bottom > innerHeight + 1) || document.scrollingElement.scrollWidth > innerWidth + 1;
  });
  check(!overflow, `${tag}: bubbles and pills fit the screen`);
  check((await page.$$(".cv-pill")).length === 3, `${tag}: S2 how are you offers both registers and a distractor`);
  await page.screenshot({ path: path.join(SHOTS, `howareyou-S2-${tag}.png`) });
  await page.click("#bulb");
  await sleep(150);
  check(!!(await page.$(".cv-bubble .cv-en")), `${tag}: the light bulb flips to English`);
  await page.screenshot({ path: path.join(SHOTS, `bulb-english-${tag}.png`) });
  await tapTap(page, '.cv-pill[data-correct="true"]');
  await page.waitForFunction(() => !document.body.dataset.running, null, { timeout: 8000 });
  const l2 = await page.$eval("#log", (e) => e.textContent.trim().split("\n").pop());
  check(/register asked aai, chose aai/.test(l2), `${tag}: register recorded (${l2})`);
  // the waving hand skips: the speaker says the answer and carries on
  await page.click("#play");
  await page.waitForSelector(".cv-replies.in .cv-pill");
  await page.click(".cv-skip");
  await page.waitForFunction(() => !document.body.dataset.running, null, { timeout: 8000 });
  const l3 = await page.$eval("#log", (e) => e.textContent.trim().split("\n").pop());
  check(/via skip/.test(l3), `${tag}: the skip hand (${l3})`);

  if (w === 1366) {
    // the first launch: FL2..FL8, the No that dodges at FL7
    await page.click('#stage button[data-v="S1"]');
    await page.click("#sim-first");
    let dodged = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 60000) {
      const running = await page.evaluate(() => !!document.body.dataset.running);
      if (!running) break;
      const box = await page.$(".cv-replies.in:not([data-handled])");
      if (box) {
        await box.evaluate((b) => (b.dataset.handled = "1"));
        await sleep(250);
        const lines = await page.$$eval(".cv-pill", (ps) => ps.map((p) => p.dataset.line));
        const isHelp = await page.$eval(".cv-bubble .cv-text", (e) => /help me cook/i.test(e.textContent)).catch(() => false);
        if (isHelp) {
          const no = await page.$('.cv-pill[data-line="na"]');
          const bb = await no.boundingBox();
          await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
          await page.mouse.down();
          await page.mouse.up();
          await sleep(200);
          dodged = await page.$eval('.cv-pill[data-line="na"]', (p) => p.classList.contains("dodge"));
          await page.screenshot({ path: path.join(SHOTS, `first-launch-dodge-${tag}.png`) });
          await sleep(900);
        }
        if (lines.length) await tapTap(page, '.cv-pill[data-correct="true"]:not(.gone)');
      }
      await sleep(120);
    }
    const log = await page.$eval("#log", (e) => e.textContent);
    check(/FL2[\s\S]*greet\.salaam/.test(log) && /FL4[\s\S]*request\.make/.test(log) && /FL5: /.test(log) && /request\.help-cook/.test(log) && /FL8[\s\S]*wellbeing\.howareyou/.test(log), `${tag}: the first launch runs FL2, FL4, FL5, FL7, FL8`);
    check(dodged, `${tag}: FL7's No dodges the finger`);
    check(/request\.help-cook[^\n]*untested/.test(log), `${tag}: FL7 is untested (placeholder question)`);

    // Cook: one per visit, then the 2-minute clock declines the rest
    await page.click("#reset");
    const nC = await (async () => {
      await page.click("#sim-cook");
      return autoAnswer(page, { wrongFirst: true });
    })();
    const logC = await page.$eval("#log", (e) => e.textContent);
    check(nC >= 1 && /declined: cap/.test(logC), `${tag}: Cook plays ${nC} moment(s), the rest declined by the frequency rule`);
    check(/CK7 declined: (cap|busy)|CK7 [^\n]*where\.kida/.test(logC), `${tag}: CK7 is offered (or declined) in the chai round`);
    await page.screenshot({ path: path.join(SHOTS, `cook-day-log-${tag}.png`) });

    // the clinic: the fake clock moves 2+ minutes per patient, so each can get one
    await page.click("#reset");
    await page.click("#sim-clinic");
    const nL = await autoAnswer(page, { wrongFirst: true });
    const logL = await page.$eval("#log", (e) => e.textContent);
    check(nL >= 3, `${tag}: the clinic morning plays ${nL} moments (one per patient, 2 min apart)`);
    check(/CL1 [^\n]*greet\.salaam · doctor/.test(logL), `${tag}: CL1 the doctor's salaam`);
    check(/CL3 [^\n]*kin\.who-am-i[^\n]*untested/.test(logL), `${tag}: CL3 who am I? (untested)`);
    const state = await page.evaluate(() => Save.get("conversations"));
    check(state && state.types && Object.keys(state.types).length >= 2, `${tag}: tracking saved in the 'conversations' namespace`);
    await page.screenshot({ path: path.join(SHOTS, `clinic-log-${tag}.png`), fullPage: true });
  }
  check(errors.length === 0, `${tag}: no page errors${errors.length ? `: ${errors.join(" | ")}` : ""}`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(fails.length ? `\n${fails.length} FAILED` : "\nall passed");
process.exit(fails.length ? 1 : 0);
