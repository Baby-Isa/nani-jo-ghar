// Browser test for Sprint 19's shared first-time light (s19-lights), the page parts of js/shared/onboard.js on a bare page: one light at
// a time (the newest wins, the one under it back when it goes), a press inside a light's box takes it away (SH-236) unless it stays,
// Onboard.began, a script's step dark while the child does its move and back after MOVE.back, the one finger along a script's roll with
// the game's thing riding under it (SH-119, MAA-20), a game's demo (Onboard.gesture) logged as the kit's, and the circle look.
// One browser, port 8894 (LIGHTS_TEST_PORT overrides). Run under a lock:
//   flock -w 1800 /tmp/njg-browser-8894.lock timeout 300 node build/test_lights_s19_page.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PORT = Number(process.env.LIGHTS_TEST_PORT || 8894);
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch (e) {
  pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright"));
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/css/shared/tokens.css"><link rel="stylesheet" href="/css/shared/onboard.css">
<style>body{margin:0;width:1000px;height:600px}#a,#b{position:absolute;width:100px;height:80px;background:#c96}#a{left:100px;top:100px}#b{left:500px;top:300px}</style></head>
<body><div id="a"></div><div id="b"></div>
<script>window.__log=[];window.Lifecycle={note(w,i){__log.push(Object.assign({what:w},i||{}))},ghost(s,i){__log.push(Object.assign({what:"ghost",step:s},i||{}))}};</script>
<script src="/js/shared/uistore.js"></script><script src="/js/shared/onboard.js"></script></body></html>`;
const server = http.createServer((req, res) => {
  const u = req.url.split("?")[0];
  if (u === "/page.html") {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(PAGE);
  }
  const p = path.join(ROOT, decodeURIComponent(u));
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
const browser = await pw.chromium.launch(opts);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const open = async () => {
  const page = await browser.newPage({ viewport: { width: 1000, height: 600 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:${PORT}/page.html`);
  await page.waitForFunction(() => !!window.Onboard);
  return { page, errors };
};
// the drawn boxes, layer by layer: [{id, on, buried, holes}]
const layers = (page) => page.evaluate(() => [...document.querySelectorAll(".njg-onboard")].map((l) => ({ id: l.dataset.t || "", on: l.classList.contains("on"), buried: l.classList.contains("ob-buried"), holes: JSON.parse(l.dataset.holes || "[]") })));

try {
  /* one light at a time */
  {
    const { page, errors } = await open();
    await page.evaluate(() => {
      window.A = Onboard.light("#a", { pass: true });
      A.layer.dataset.t = "a";
    });
    await sleep(200);
    await page.evaluate(() => {
      window.B = Onboard.light("#b", { pass: true });
      B.layer.dataset.t = "b";
    });
    await sleep(200);
    let L = await layers(page);
    check(L.find((l) => l.id === "a").holes.length === 0 && L.find((l) => l.id === "a").buried, "one light at a time: the older light is buried, no box");
    check(L.find((l) => l.id === "b").holes.length === 1, "the newest light is drawn");
    check((await page.evaluate(() => Onboard.lightsShown())) === 1, "one light shown");
    await page.evaluate(() => B.close());
    await sleep(200);
    L = await layers(page);
    check(L.find((l) => l.id === "a").holes.length === 1 && !L.find((l) => l.id === "a").buried, "the light under it comes back when it goes");
    /* a press inside the box takes it away (SH-236); outside, nothing */
    await page.mouse.click(900, 50);
    await sleep(60);
    check((await page.evaluate(() => A.box() != null && A.layer.classList.contains("on"))), "a press outside the box: the light stays");
    const t0 = Date.now();
    await page.mouse.down({ button: "left" }).catch(() => {});
    await page.mouse.move(150, 140);
    await page.mouse.down();
    const gone = await page.evaluate(() => !A.layer.classList.contains("on"));
    await page.mouse.up();
    check(gone && Date.now() - t0 < 300, "a press inside the box: gone at once (SH-236)");
    // a light that stays, and one with its own tap (onTap: its click still comes)
    let tapped = 0;
    await page.exposeFunction("tapped", () => tapped++);
    await page.evaluate(() => {
      window.S = Onboard.light("#a", { pass: true, stay: true });
      window.T = Onboard.light("#b", { pass: true, onTap: () => window.tapped() });
    });
    await sleep(150);
    await page.mouse.click(550, 340);
    await sleep(100);
    check(tapped === 1 && !(await page.evaluate(() => T.layer.classList.contains("on"))), "a lit control's own tap still reaches it, and the light goes");
    await page.mouse.click(150, 140);
    await sleep(100);
    check(await page.evaluate(() => S.layer.classList.contains("on") && S.box() != null), "o.stay: the press keeps it");
    await page.evaluate(() => { S.close(); window.C = Onboard.light("#a", { pass: true }); });
    await sleep(100);
    await page.evaluate(() => Onboard.began("roll"));
    check(!(await page.evaluate(() => C.layer.classList.contains("on"))), "Onboard.began: the light goes");
    // a function giving a LIST of rects (Cook.Coach.thingBox: a thing's picture and pill) lights their union; so does a list of
    // functions each giving one part (s19-games' interim form)
    const u = await page.evaluate(async () => {
      const box = (h) => JSON.parse(h.layer.dataset.holes || "[]")[0] || null;
      const L1 = Onboard.light(() => [[300, 100, 60, 60], [290, 170, 80, 30]], { pass: true });
      await new Promise((r) => setTimeout(r, 120));
      const a = box(L1);
      L1.close();
      const parts = [[300, 100, 60, 60], [290, 170, 80, 30]];
      const L2 = Onboard.light([0, 1, 2].map((i) => () => parts[i] || null), { pass: true });
      await new Promise((r) => setTimeout(r, 120));
      const b = box(L2);
      L2.close();
      return { a, b };
    });
    const whole = (h) => h && h.x <= 290 && h.y <= 100 && h.x + h.w >= 370 && h.y + h.h >= 200;
    check(whole(u.a), `a function giving a list of parts: one box round them all (${JSON.stringify(u.a)})`);
    check(whole(u.b), `a list of functions, one part each: the same (${JSON.stringify(u.b)})`);
    check(errors.length === 0, `no page errors (${errors.join("; ")})`);
    await page.close();
  }

  /* a script's roll: one finger, the thing riding under it; dark while the child moves, back after MOVE.back */
  {
    const { page, errors } = await open();
    await page.evaluate(() => {
      Onboard.MOVE.back = 300;
      window.carried = [];
      const st = {
        spotlight: "#a",
        ghost: { gesture: "roll", from: [140, 110, 20, 20], to: [140, 150, 20, 20], ms: 900, carry: (dx, dy, t, p) => carried.push([Math.round(dx), Math.round(dy), p]) },
        wait: "done",
      };
      window.R = Onboard.run("lights-test", [st, { spotlight: "#b", ghost: { gesture: "tap" }, wait: "done" }], { force: true, oneFinger: true });
    });
    await sleep(500);
    const f = await page.evaluate(() => ({ fingers: document.querySelectorAll(".ob-finger").length, ghostOn: !!document.querySelector(".ob-ghost.on"), pressed: !!document.querySelector(".ob-finger-in.pressed") }));
    check(f.fingers === 1 && !f.ghostOn, `one finger along the roll, the kit's (${f.fingers} fingers, old hand ${f.ghostOn})`);
    await sleep(500);
    const c = await page.evaluate(() => carried);
    const ys = c.filter((x) => x[2]).map((x) => x[1]);
    check(ys.length > 5 && Math.min(...ys) < -5 && Math.max(...ys) > 5, `the thing rides under the finger up and down (dy ${Math.min(...ys)} to ${Math.max(...ys)})`);
    check(c.length && c[c.length - 1][0] === 0 && c[c.length - 1][1] === 0, "and home after");
    const kit = await page.evaluate(() => __log.filter((e) => e.what === "ghost"));
    check(kit.length >= 1 && kit.every((g) => !(g.at && typeof g.at === "object")), "logged as the kit's ghost (no point of a game's own)");
    // the child presses on the lit thing: dark at once, no finger
    await page.mouse.move(150, 140);
    await page.mouse.down();
    await sleep(50);
    let s = await page.evaluate(() => ({ holes: JSON.parse(document.querySelector(".njg-onboard").dataset.holes || "[]").length, fingers: [...document.querySelectorAll(".ob-finger")].filter((x) => x.style.display !== "none").length, hidden: Onboard.active().hidden() }));
    check(s.holes === 0 && s.fingers === 0 && s.hidden, `the move started: no box, no finger (${JSON.stringify(s)})`);
    await sleep(500);
    s = await page.evaluate(() => JSON.parse(document.querySelector(".njg-onboard").dataset.holes || "[]").length);
    check(s === 0, "dark while the child still holds it");
    await page.mouse.up();
    await sleep(150);
    check((await page.evaluate(() => JSON.parse(document.querySelector(".njg-onboard").dataset.holes || "[]").length)) === 0, "dark just after the release");
    await sleep(400);
    check((await page.evaluate(() => JSON.parse(document.querySelector(".njg-onboard").dataset.holes || "[]").length)) === 1, "back after MOVE.back with the step still open");
    // the step's moment came for a later one: jump
    await page.evaluate(() => Onboard.active().jump(1));
    await sleep(600);
    check((await page.evaluate(() => Onboard.active().machine.state().index)) === 1, "jump: on to the later step");
    await page.evaluate(() => Onboard.active().skip());
    check(errors.length === 0, `no page errors (${errors.join("; ")})`);
    await page.close();
  }

  /* a game's demo: one finger, the circle look, stops on a press */
  {
    const { page, errors } = await open();
    await page.evaluate(() => {
      window.G = Onboard.gesture(() => ({ from: { x: 300, y: 300 }, to: { x: 300, y: 400 } }), { gesture: "roll", ms: 800, step: "demo-roll", look: "circle" });
    });
    await sleep(400);
    const d = await page.evaluate(() => ({ n: document.querySelectorAll(".ob-finger").length, circle: !!document.querySelector(".ob-finger.ob-circle"), log: __log.filter((e) => e.what === "ghost").map((e) => [e.step, e.gesture, !!e.at]) }));
    check(d.n === 1 && d.circle, "the demo's one finger, in the circle look (MAA-20's pair)");
    check(d.log.length === 1 && d.log[0][0] === "demo-roll" && d.log[0][1] === "roll" && !d.log[0][2], "logged as the kit's");
    await page.mouse.click(800, 100);
    await sleep(100);
    check((await page.evaluate(() => document.querySelectorAll(".ob-finger").length)) === 0, "a press: the demo stops");
    check(errors.length === 0, `no page errors (${errors.join("; ")})`);
    await page.close();
  }

  /* the lab's pair for Zafar's pick (MAA-20): the roll with the finger, and with the circle; the pin rides it */
  for (const [state, circle] of [["roll-finger", false], ["roll-circle", true]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 665 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://localhost:${PORT}/lab/sections/kit-lights.html?state=${state}`);
    await page.waitForFunction(() => window.KitLights && window.KitLights.ready);
    const seen = { fingers: 0, circle: false, moved: new Set() };
    for (let i = 0; i < 14; i++) {
      await sleep(150);
      const f = await page.evaluate(() => ({ n: [...document.querySelectorAll(".ob-finger")].filter((x) => x.style.display !== "none").length, circle: !!document.querySelector(".ob-finger.ob-circle"), pin: document.querySelector("#kl-pin").style.translate || "" }));
      seen.fingers = Math.max(seen.fingers, f.n);
      seen.circle = seen.circle || f.circle;
      seen.moved.add(f.pin);
    }
    check(seen.fingers === 1 && seen.circle === circle, `lab ${state}: one ${circle ? "circle" : "finger"}`);
    check(seen.moved.size >= 3, `lab ${state}: the pin rides up and down (${seen.moved.size} places)`);
    check(errors.length === 0, `lab ${state}: no page errors (${errors.join("; ")})`);
    await page.close();
  }
  /* the pair side by side (MAA-20, Zafar's pick): the finger on one board, the circle on the other, both pins riding */
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 665 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://localhost:${PORT}/lab/sections/kit-lights.html?state=roll-pair`);
    await page.waitForFunction(() => window.KitLights && window.KitLights.ready);
    const seen = { hands: 0, circles: 0, a: new Set(), b: new Set() };
    for (let i = 0; i < 14; i++) {
      await sleep(150);
      const f = await page.evaluate(() => {
        const on = [...document.querySelectorAll(".ob-finger")].filter((x) => x.style.display !== "none");
        return { circles: on.filter((x) => x.classList.contains("ob-circle")).length, hands: on.filter((x) => !x.classList.contains("ob-circle")).length, a: document.querySelector("#kl-pin").style.translate || "", b: document.querySelector("#kl-pin-b").style.translate || "" };
      });
      seen.hands = Math.max(seen.hands, f.hands);
      seen.circles = Math.max(seen.circles, f.circles);
      seen.a.add(f.a);
      seen.b.add(f.b);
    }
    const boards = await page.evaluate(() => [...document.querySelectorAll(".kl-roll")].map((r) => r.getBoundingClientRect()).map((r) => [r.left, r.right]));
    check(seen.hands === 1 && seen.circles === 1, `lab roll-pair: one finger and one circle together (${seen.hands}, ${seen.circles})`);
    check(seen.a.size >= 3 && seen.b.size >= 3, `lab roll-pair: both pins ride (${seen.a.size}, ${seen.b.size} places)`);
    check(boards.length === 2 && boards[0][1] <= boards[1][0], `lab roll-pair: side by side, not overlapping (${JSON.stringify(boards)})`);
    check(errors.length === 0, `lab roll-pair: no page errors (${errors.join("; ")})`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(fails.length ? `FAILED: ${fails.length}` : "all ok");
process.exit(fails.length ? 1 : 0);
