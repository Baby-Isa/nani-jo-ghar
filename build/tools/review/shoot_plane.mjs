// Shoot and measure the clinic rooms where the doctor and the girl stand together (CLN-154, s08-doctor-stitch):
// the seated exam, the standing check-up, the send-off at the front door and the waiting room's call. For each room and
// size: a screenshot, and (as shares of the room picture) her and his feet lines, their body heights and his ÷ hers,
// his height as a share of the room's door, her crown on his body, and her tap areas' radii in px (the hit zones the
// diagnosis uses: heal-art.json taps, times the figure's tap pad).
// s08-placement-fix (CLN-155..157): his shoes' boxes (read off his picture's alpha, so a before tree needs no data), the
// clearance to the furniture the judge named (the exam bed's front leg, the exam door's frame), the contact shadows
// drawn, the send-off's help tray against both figures' feet, his crown under the screen's top, and the moments: every
// line said with the doctor's view at that moment (`lines`), and a shot held on one of his lines (exam-talk: his first
// line to her in D1; exam-front, stand-front: the ailment, his line to the player). `boing` is the drop machine's shot.
//   COOK_TEST_PORT=8844 flock -w 3600 /tmp/njg-browser.lock timeout 900 node build/tools/review/shoot_plane.mjs <out-dir> [--root <dir>] [--sizes 800x360,844x390,1366x768] [--rooms exam,stand,door,waiting]
// --root serves another copy of the site (a before tree: `git archive <sha> js css data clinic.html | tar -x -C <dir>`, assets linked).
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { BASE, startServer, launch, newPage, sleep } from "../../sandbox/lib/env.mjs";

const args = process.argv.slice(2);
const out = resolve(args[0] || "build/screenshots/plane");
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const root = opt("--root", null);
const sizes = opt("--sizes", "800x360,844x390,1366x768").split(",");
// the rooms' doors (shares of the 1536 x 1024 picture, read off the backgrounds: the leaf's or opening's top and its threshold)
const EXAM_DOOR = [0.054, 0.742];
const STAND_DOOR = [0.047, 0.728];
// what he must stand clear of, read off the room pictures (s08-placement-judge): the exam bed's right front leg (its right
// edge x, its foot y) and the exam door's frame (its left edge x); the waiting room's desk corner (its left edge x)
const CLEAR = { exam: { bedLegR: 0.75, doorFrameL: 0.94 }, waiting: { deskL: 0.875 } };
// room: [query, door, clear, act]; act: "talk" holds his first line after a tap (D1: [Does it hurt here?], to her), "end"
// plays the stage through and holds the ailment (his line to the player), "tray" waits for the send-off's choice
const ROOMS = {
  exam: ["stage=diagnosis&level=1&variant=D1", EXAM_DOOR, CLEAR.exam],
  "exam-talk": ["stage=diagnosis&level=1&variant=D1", EXAM_DOOR, CLEAR.exam, "talk"],
  "exam-front": ["stage=diagnosis&level=1&variant=D1", EXAM_DOOR, CLEAR.exam, "end"],
  "exam-L3": ["stage=diagnosis&level=3&variant=D2", EXAM_DOOR, CLEAR.exam],
  stand: ["stage=diagnosis&level=3&variant=D3", STAND_DOOR, null],
  "stand-front": ["stage=diagnosis&level=3&variant=D3", STAND_DOOR, null, "end"],
  door: ["stage=sendoff&level=1&variant=E1", [0.078, 0.728], null, "tray"],
  "door-L2": ["stage=sendoff&level=2", [0.078, 0.728], null, "tray"],
  "door-L3": ["stage=sendoff&level=3", [0.078, 0.728], null, "tray"],
  waiting: ["stage=waiting&level=1&variant=W1", null, CLEAR.waiting],
  boing: ["stage=heal&game=boing&level=1", null, null, "boing"],
};
const rooms = opt("--rooms", "exam,exam-L3,stand,door,waiting").split(",");
// the exam rooms: CB2b; the D3 check-up: CB3b (the morning at L3); the send-off at the front door: CB5; the waiting room's call (his wave at his door): CB1b
mkdirSync(out, { recursive: true });
const srv = await startServer(root ? { "/": resolve(root) } : {});
const browser = await launch();
const rows = [];
// every line said, with the doctor's view as it starts; window.__hold(i, who) true holds that line (its bubble stays up)
const SAY_LOG = () => {
  window.__lines = [];
  window.__held = null;
  const t = setInterval(() => {
    const V = window.Clinic && Clinic.Kit && Clinic.Kit.Voice;
    if (!V || !V.say || V.say.__logged) return;
    clearInterval(t);
    const orig = V.say;
    V.say = function (line, o = {}) {
      const doc = document.querySelector(".cl-doc-art");
      const S = Clinic.Stages;
      const rec = { who: o.who || null, en: (line && (line.english || line.text)) || String(line || ""), view: doc && doc.__doc ? doc.__doc.view : null, current: !!(S && S.current), card: !!o.noBubble };
      window.__lines.push(rec);
      const p = orig.apply(this, arguments);
      if (window.__hold && window.__hold(window.__lines.length - 1, rec)) {
        window.__held = rec;
        return new Promise(() => {});
      }
      return p;
    };
    V.say.__logged = true;
  }, 5);
};
try {
  for (const size of sizes) {
    for (const room of rooms) {
      const [query, door, clear, act] = ROOMS[room];
      const { ctx, page, errors } = await newPage(browser, size);
      await page.addInitScript(SAY_LOG);
      await page.goto(`${BASE}/clinic.html?${query}&seed=1&quiet=1&fast=1&nonav=1&onboard=0`, { waitUntil: "load" });
      await page.waitForFunction((boing) => window.njgTest?.clinic && window.njgTest?.clinic.ready && document.querySelector(boing ? ".bo-lever, svg" : ".cl-doc-art"), act === "boing", { timeout: 30000 });
      await sleep(act === "boing" ? 3000 : 2500);
      if (act === "talk" || act === "end") {
        // his first line after the child's tap (to her), or the ailment (said once the stage is played: S.current null)
        await page.evaluate((a) => {
          const n0 = window.__lines.length;
          window.__hold = (i, r) => r.who === "doctor" && !r.card && (a === "talk" ? i >= n0 : !r.current);
        }, act);
        for (let k = 0; k < 40; k++) {
          const held = await page.evaluate(() => !!window.__held);
          if (held) break;
          const e = await page.evaluate(() => { const c = Clinic.Stages.current; return c && c.expect ? c.expect() : null; });
          if (e && e.kind === "tap" && e.target) await page.click(e.target, { timeout: 3000, force: true }).catch(() => {});
          else if (e && e.kind === "point") await page.mouse.click(e.x, e.y);
          await sleep(400);
        }
        await sleep(300);
      }
      if (act === "tray") await page.waitForSelector(".cl-help-tray .cl-face-card, .cl-thought .cl-face-card", { timeout: 15000 }).catch(() => {});
      if (act === "tray") await sleep(600);
      if (act === "boing") {
        const shot = join(out, `${room}-${size}.png`);
        await page.screenshot({ path: shot });
        rows.push({ room, size, machineArt: await page.evaluate(() => !!document.querySelector('image[href*="machine"]')), errors: errors.length });
        console.log(room, size);
        await ctx.close();
        continue;
      }
      const m = await page.evaluate(async ({ door, clear }) => {
        const S = Clinic.Stages;
        const fig = S.env && S.env.fig;
        const doc = document.querySelector(".cl-doc-art");
        const box = document.querySelector(".cl-scene");
        const B = box.getBoundingClientRect();
        const fy = (y) => +((y - B.top) / B.height).toFixed(3);
        const fx = (x) => +((x - B.left) / B.width).toFixed(3);
        const A = Clinic.Kit.doctorArt();
        const V = A.views[(A.poses && A.poses[doc.__doc.view]) || doc.__doc.view] || A.views[doc.__doc.view];
        const dr = doc.getBoundingClientRect();
        const dFeet = dr.top + V.feet * dr.height;
        const dBody = (dr.height * (A.fig_h || 676)) / V.h;
        const r = { view: doc.__doc.view, file: V.file.split("/").pop(), docFeet: fy(dFeet), docH: +(dBody / B.height).toFixed(3), docCrown: fy(dFeet - dBody), docCrownPx: Math.round(dFeet - dBody), roomPx: Math.round(B.height) };
        if (door) r.docOfDoor = +(dBody / ((door[1] - door[0]) * B.height)).toFixed(3);
        // the feet in a drawn picture, read off its alpha: each foot's box (client px) in the bottom band of the picture
        const feetOf = async (img) => {
          if (!img || !img.naturalWidth) return [];
          if (img.decode) await img.decode().catch(() => {});
          const w = img.naturalWidth, h = img.naturalHeight;
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0);
          const a = g.getImageData(0, 0, w, h).data;
          const on = (x, y) => a[(y * w + x) * 4 + 3] > 128;
          let bot = h - 1;
          while (bot > 0 && ![...Array(w).keys()].some((x) => on(x, bot))) bot--;
          // the column runs 6% of the picture up from its lowest row: one per foot
          const yRun = Math.max(0, bot - Math.round(h * 0.03));
          const runs = [];
          for (let x = 0; x < w; x++) {
            if (!on(x, yRun)) continue;
            const s = x;
            while (x < w && on(x, yRun)) x++;
            if (x - s > w * 0.04) runs.push([s, x]);
          }
          const R = img.getBoundingClientRect();
          // the drawn picture's own left and right (alpha), not its canvas
          let xl = w, xr = 0;
          for (let y = 0; y <= bot; y += 2) for (let x = 0; x < w; x++) if (on(x, y)) { if (x < xl) xl = x; if (x > xr) xr = x; }
          img.__drawn = { l: R.left + (xl / w) * R.width, r: R.left + (xr / w) * R.width };
          return runs.map(([s, e], i) => {
            // widen to the foot's own extent below the run (never past half way to the next foot), and its own lowest row
            const lo = i ? Math.round((runs[i - 1][1] + s) / 2) : 0, hi = i < runs.length - 1 ? Math.round((e + runs[i + 1][0]) / 2) : w;
            let x0 = s, x1 = e, yb = yRun;
            for (let y = yRun; y <= bot; y++) for (let x = lo; x < hi; x++) if (on(x, y)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y > yb) yb = y; }
            return { l: R.left + (x0 / w) * R.width, r: R.left + (x1 / w) * R.width, b: R.top + (yb / h) * R.height };
          });
        };
        const docImg = doc.querySelector("img.cl-doc-base");
        const shoes = await feetOf(docImg);
        r.docShoes = shoes.map((s) => [fx(s.l), fx(s.r), fy(s.b)]);
        if (clear && clear.bedLegR != null && shoes.length) r.shoeClearOfBedLeg = +(Math.min(...shoes.map((s) => fx(s.l))) - clear.bedLegR).toFixed(3);
        // his drawn right edge (alpha, not the canvas) to the exam door's frame
        if (clear && clear.doorFrameL != null && docImg && docImg.__drawn) r.clearOfDoorFrame = +(clear.doorFrameL - fx(docImg.__drawn.r)).toFixed(3);
        if (clear && clear.deskL != null && shoes.length) r.shoeClearOfDesk = +(clear.deskL - Math.max(...shoes.map((s) => fx(s.r)))).toFixed(3);
        // the contact shadows (s08-placement-fix): ellipses under his feet and hers
        const sh = (sel) => [...document.querySelectorAll(sel)].filter((n) => n.getBoundingClientRect().width > 0);
        r.shadowsDoc = sh(".cl-doc-art .cl-shadow").length;
        r.shadowsGirl = sh(".cl-patient-layer .cl-shadow").length;
        // s08-rejudge-fixes: each shadow's drawn size in px [w, h] and its centre's offset from its foot's centre (px, + = right)
        const px = (sel) => sh(sel).map((n) => { const b = n.getBoundingClientRect(); return [+b.width.toFixed(1), +b.height.toFixed(1)]; });
        r.shadowPxDoc = px(".cl-doc-art .cl-shadow");
        r.shadowPxGirl = px(".cl-patient-layer .cl-shadow");
        let art = fig && fig.art;
        if (!art || !art.base || !art.base.isConnected) {
          // a stage that keeps no S.env (the send-off): her drawn picture, matched to its data by file
          const img = document.querySelector(".cl-patient-layer .fig-art-base");
          const G = ((Clinic.HealHost && Clinic.HealHost.healArt) || S._healArt || {}).patients.girl;
          const st = G.stand;
          const name = img && img.src.split("/").pop().replace("@2x", "");
          const cands = [st, ...Object.values(st.turns || {})];
          const hit = img && (cands.find((v) => [v.front, v.file, v.wave].some((f) => f && f.endsWith(name))) || st);
          art = hit ? { base: img, V: Object.assign({ fig_h: st.fig_h }, hit), spec: st, view: "none" } : null;
        }
        let girlShoes = [];
        if (art && art.base) {
          const g = art.base.getBoundingClientRect();
          const gV = art.V;
          const gFeet = g.top + (gV.feet != null ? gV.feet : 0.98) * g.height;
          // her sitting art has no fig_h in the data: it was cut at 440 (build/tools/art/specs/s07.cut.json girl-wide)
          const gBody = (g.height * (gV.fig_h || art.spec.fig_h || 440)) / gV.h;
          Object.assign(r, { girlFeet: fy(gFeet), girlH: +(gBody / B.height).toFixed(3), ratio: +(dBody / gBody).toFixed(3), girlCrownOnHim: +((dFeet - (gFeet - gBody)) / dBody).toFixed(3) });
          girlShoes = await feetOf(art.base);
          r.girlShoes = girlShoes.map((s) => [fx(s.l), fx(s.r), fy(s.b)]);
          if (shoes.length && girlShoes.length) r.feetGap = +(Math.max(...girlShoes.map((s) => fy(s.b))) - Math.max(...shoes.map((s) => fy(s.b)))).toFixed(3);
          const T = fig && fig.tapAnchors && art.view === "front" && art.spec.taps;
          if (T) {
            const k = art.tapPad || 1;
            const taps = {};
            for (const [key, t] of Object.entries(T)) taps[key] = +(t[2] * g.height * k).toFixed(1);
            r.tapPad = k;
            r.taps = taps;
            r.tapMin = Math.min(...Object.values(taps));
            r.tapHand = taps["hand.left"] || taps.hand || null;
            // her hand and her forearm's centres, drawn px apart (the judge: 17 px on a phone, under a fingertip)
            const c = (key) => T[key] && [g.left + T[key][0] * g.width, g.top + T[key][1] * g.height];
            const hh = c("hand.left") || c("hand"), ff = c("forearm.left");
            if (hh && ff) r.handForearmPx = +Math.hypot(hh[0] - ff[0], hh[1] - ff[1]).toFixed(1);
            // the real hit test: a tap 0.95 of the radius out from each area's centre, that part alone asked for, no slack
            let hit = 0;
            for (const [key, t] of Object.entries(T)) {
              const [p, sd] = key.split(".");
              const cx = g.left + t[0] * g.width + 0.95 * taps[key];
              const cy = g.top + t[1] * g.height;
              const got = fig.partAt(cx, cy, { active: [p], pad: 0, closeup: /^(eye|ear|nose|mouth|tooth|throat)$/.test(p) });
              if (got && got.part === p && (got.side || null) === (sd || null)) hit++;
            }
            r.tapHits = `${hit}/${Object.keys(T).length}`;
          }
        }
        // the send-off's choice: the tray's (or the thought bubble's) box in room shares, and how far it covers each one's feet (px)
        const tray = document.querySelector(".cl-help-tray") || document.querySelector(".cl-thought");
        if (tray) {
          const t = tray.getBoundingClientRect();
          r.tray = { cls: tray.className, l: fx(t.left), r: fx(t.right), c: fx((t.left + t.right) / 2), top: fy(t.top) };
          const cover = (feet) => Math.max(0, ...feet.map((s) => (s.r > t.left && s.l < t.right ? Math.max(0, s.b - t.top) : 0)));
          r.trayOverDocFeetPx = +cover(shoes).toFixed(1);
          r.trayOverGirlFeetPx = +cover(girlShoes).toFixed(1);
        }
        return r;
      }, { door, clear });
      m.lines = await page.evaluate(() => (window.__lines || []).filter((l) => l.who === "doctor").map((l) => `${l.card ? "card" : "say"} ${l.view}: ${l.en}`));
      const shot = join(out, `${room}-${size}.png`);
      await page.screenshot({ path: shot });
      rows.push({ room, size, ...m, errors: errors.length });
      console.log(room, size, JSON.stringify({ ...m, taps: undefined, lines: undefined }));
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  srv.close();
}
writeFileSync(join(out, "plane.json"), JSON.stringify(rows, null, 1) + "\n");
