// Shoot and measure the clinic rooms where the doctor and the girl stand together (CLN-154, s08-doctor-stitch):
// the seated exam, the standing check-up, the send-off at the front door and the waiting room's call. For each room and
// size: a screenshot, and (as shares of the room picture) her and his feet lines, their body heights and his ÷ hers,
// his height as a share of the room's door, her crown on his body, and her tap areas' radii in px (the hit zones the
// diagnosis uses: heal-art.json taps, times the figure's tap pad).
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
const DOOR = { exam: [0.054, 0.742], "exam-L3": [0.054, 0.742], stand: [0.047, 0.728], door: [0.078, 0.728], waiting: null };
const ROOMS = {
  exam: "stage=diagnosis&level=1&variant=D1",
  "exam-L3": "stage=diagnosis&level=3&variant=D2",
  stand: "stage=diagnosis&level=3&variant=D3",
  door: "stage=sendoff&level=1&variant=E1",
  waiting: "stage=waiting&level=1&variant=W1",
};
const rooms = opt("--rooms", Object.keys(ROOMS).join(",")).split(",");
// the exam rooms: CB2b; the D3 check-up: CB3b (the morning at L3); the send-off at the front door: CB5; the waiting room's call (his wave at his door): CB1b
mkdirSync(out, { recursive: true });
const srv = await startServer(root ? { "/": resolve(root) } : {});
const browser = await launch();
const rows = [];
try {
  for (const size of sizes) {
    for (const room of rooms) {
      const { ctx, page, errors } = await newPage(browser, size);
      await page.goto(`${BASE}/clinic.html?${ROOMS[room]}&seed=1&quiet=1&fast=1&nonav=1&onboard=0`, { waitUntil: "load" });
      await page.waitForFunction(() => window.__clinic && window.__clinic.ready && document.querySelector(".cl-doc-art"), null, { timeout: 30000 });
      await sleep(2500);
      const m = await page.evaluate((door) => {
        const S = Clinic.Stages;
        const fig = S.env && S.env.fig;
        const doc = document.querySelector(".cl-doc-art");
        const box = document.querySelector(".cl-scene");
        const B = box.getBoundingClientRect();
        const fy = (y) => +((y - B.top) / B.height).toFixed(3);
        const A = Clinic.Kit.doctorArt();
        const V = A.views[(A.poses && A.poses[doc.__doc.view]) || doc.__doc.view] || A.views[doc.__doc.view];
        const dr = doc.getBoundingClientRect();
        const dFeet = dr.top + V.feet * dr.height;
        const dBody = (dr.height * (A.fig_h || 676)) / V.h;
        const r = { view: doc.__doc.view, file: V.file.split("/").pop(), docFeet: fy(dFeet), docH: +(dBody / B.height).toFixed(3), docCrown: fy(dFeet - dBody), roomPx: Math.round(B.height) };
        if (door) r.docOfDoor = +(dBody / ((door[1] - door[0]) * B.height)).toFixed(3);
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
        if (art && art.base) {
          const g = art.base.getBoundingClientRect();
          const gV = art.V;
          const gFeet = g.top + (gV.feet != null ? gV.feet : 0.98) * g.height;
          // her sitting art has no fig_h in the data: it was cut at 440 (build/tools/art/specs/s07.cut.json girl-wide)
          const gBody = (g.height * (gV.fig_h || art.spec.fig_h || 440)) / gV.h;
          Object.assign(r, { girlFeet: fy(gFeet), girlH: +(gBody / B.height).toFixed(3), ratio: +(dBody / gBody).toFixed(3), girlCrownOnHim: +((dFeet - (gFeet - gBody)) / dBody).toFixed(3) });
          const T = fig && fig.tapAnchors && art.view === "front" && art.spec.taps;
          if (T) {
            const k = art.tapPad || 1;
            const taps = {};
            for (const [key, t] of Object.entries(T)) taps[key] = +(t[2] * g.height * k).toFixed(1);
            r.tapPad = k;
            r.taps = taps;
            r.tapMin = Math.min(...Object.values(taps));
            r.tapHand = taps["hand.left"] || taps.hand || null;
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
        return r;
      }, DOOR[room]);
      const shot = join(out, `${room}-${size}.png`);
      await page.screenshot({ path: shot });
      rows.push({ room, size, ...m, errors: errors.length });
      console.log(room, size, JSON.stringify({ ...m, taps: undefined }));
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  srv.close();
}
writeFileSync(join(out, "plane.json"), JSON.stringify(rows, null, 1) + "\n");
