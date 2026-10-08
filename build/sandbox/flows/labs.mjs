// What Zafar plays (decision 76, the route run): every tile on labs.html, each mapped to the flow that plays it, and the
// lab.html tiles for Cook on the one game host (lab:cook/<game>@L1..4, the story round "pantry, then the chai order",
// one customer, the story errand and free play), played through the host's page with the sandbox's Cook player.
// `run.mjs --list` prints the tile map; a tile with no flow says why (TILE_GAPS).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, BASE, sleep } from "../lib/env.mjs";
import { CookPlayer } from "../lib/cook-player.mjs";
import { waitBadges, readBadges } from "../lib/results.mjs";

const COOK_GAMES = ["fetch", "chai-tray", "maani-line", "mishkaki-grill", "daar", "chop", "tadka", "stir", "assemble", "samosa", "recipe-chai", "recipe-maani", "recipe-daal", "recipe-chaat", "recipe-samosa", "recipe-mishkaki", "order"];
const Q = "nonav=1&seed=7&speed=3";
const LONG = { "recipe-maani": 1200, "recipe-daal": 1200, "recipe-chaat": 1200, "recipe-samosa": 1500, "recipe-mishkaki": 1200, samosa: 900, daar: 900, "maani-line": 600 };

const hostState = (page) => page.evaluate("window.njgTest ? String(njgTest.state()) : 'loading'").catch(() => "loading");

// one Cook plan on lab.html: every stage the host runs (the player hands Cook's own hook over, as test_cook_host.mjs does),
// then the one end screen
export function labCook({ id, title, query, timeoutS = 400 }) {
  return {
    id, group: "labs", title, timeoutMs: timeoutS * 1000,
    async run(ctx) {
      const { page, rec } = ctx;
      await page.goto(`${BASE}/lab.html`, { waitUntil: "load" });
      await page.evaluate(() => localStorage.clear());
      await page.goto(`${BASE}/lab.html?${query}&${Q}`, { waitUntil: "load" });
      const t0 = Date.now();
      let stages = 0, results = 0;
      const badges = [];
      while (Date.now() - t0 < ctx.timeoutMs - 30000) {
        await page.waitForFunction(() => /\/playing|results|done|idle/.test(String(window.njgTest && njgTest.state())), null, { timeout: 60000 });
        const st = await hostState(page);
        if (/\/playing/.test(st)) {
          const game = st.split("/").slice(0, -1).join("/");
          stages++;
          await page.evaluate(() => import("./js/cook/mount.js").then((m) => { window.__cook = m.Cook.testHook; window.Cook = m.Cook; }));
          await sleep(400);
          await rec.state(`${game.split("/").pop()}-start`, { settle: 200 });
          const P = new CookPlayer(page, rec, { prefix: `${game.split("/").pop()}-` });
          P.helped = true;
          try { await P.play(async () => !(await hostState(page)).startsWith(game + "/"), { timeout: ctx.timeoutMs - (Date.now() - t0) - 30000 }); }
          finally { for (const c of P.covers) rec.note(`covered tap: ${c}`); }
          continue;
        }
        if (/results/.test(st)) {
          results++;
          await page.waitForSelector(".njg-results .rs-card", { timeout: 30000 });
          await waitBadges(page);
          badges.push(await readBadges(page));
          await rec.state("results-badges");
          if (await page.$(".njg-results .rs-next")) { await page.click(".njg-results .rs-next"); await sleep(900); await rec.state("results-words"); }
          const act = (await page.$('.njg-results [data-act="list"]')) || (await page.$(".njg-results .rs-act.primary")) || (await page.$(".njg-results .rs-act"));
          if (act) await act.click();
          await sleep(900);
          break;
        }
        await sleep(300);
      }
      if (!results) rec.stop(`no end screen (${stages} stages played)`);
      await rec.state("end");
      ctx.extra = { stages, badges };
      ctx.reachedEnd = results > 0;
    },
  };
}

export function labFlows() {
  const f = [];
  for (const g of COOK_GAMES) for (const L of [1, 2, 3, 4]) f.push(labCook({ id: `lab:cook/${g}${L > 1 ? `@L${L}` : ""}`, title: `labs.html: Cook on the game host, ${g}, level ${L}`, query: `mode=cook&game=${g}&level=${L}`, timeoutS: LONG[g] || 400 }));
  // the story round: Nani's pantry to its end, then on into the chai order (the next station)
  for (const L of [1, 2, 3, 4]) f.push(labCook({ id: `lab:cook/round${L > 1 ? `@L${L}` : ""}`, title: `labs.html: Cook story round (the pantry, then the chai order), level ${L}`, query: `mode=cook&level=${L}`, timeoutS: 700 }));
  f.push(labCook({ id: "lab:cook/story-birthday", title: "labs.html: Story, birthday, cook-guests (chapter 1)", query: "mode=cook&play=story&arc=birthday&chapter=1&errand=cook-guests", timeoutS: 900 }));
  f.push(labCook({ id: "lab:cook/free", title: "labs.html: Cook free play (as the map starts it)", query: "mode=cook&play=free", timeoutS: 500 }));
  return f;
}

// ---- the tile map: every labs.html tile -> its flows, or why none ----
export const TILE_GAPS = {
  "lab/clinic-core.html": "old lab index (tagged old): its stages are the clinic.html stage flows",
  "lab/clinic-heal-a.html": "old dev page (v2, tagged old): the same games run as clinic:heal-*",
  "lab/clinic-heal-b.html": "old dev page (v2, tagged old): the same games run as clinic:heal-*",
  "lab/clinic-heal-c.html": "old dev page (v2, tagged old): the same games run as clinic:heal-*",
  "lab/shared.html": "a reference sheet of shared pieces (tagged old), nothing to play",
  "lab/conversations.html": "a sound board of the conversations (each plays alone), not a game round",
  "lab/family-audio.html": "the family clip checker, not a game",
  "lab/shared-ui.html": "a reference sheet (the end screen and the ghost hand on a fake station): the real end screens are in every flow",
  "lab/order-card.html": "a reference sheet of the order card's states: the real cards are in every Cook and clinic flow",
  "lab/kit.html": "a reference sheet of the sidebar kit: the real kit is in every flow",
  "lab.html?mode=demo": "test adapters (tagged test): the same pantry and scrape run as lab:cook/fetch and clinic:heal-cut",
  "lab.html?mode=clinic&play=free": "locked until the story opens it (a locked card, no round)",
};
export function tiles() {
  const html = readFileSync(join(ROOT, "labs.html"), "utf8");
  const out = [];
  const re = /<a class="card" href="([^"]+)"><b>(.*?)<\/b>/g;
  let m;
  while ((m = re.exec(html))) out.push({ href: m[1].replace(/&amp;/g, "&"), title: m[2].replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "-").trim() });
  return out;
}
// the flow ids that play a tile (at every level they have), or {gap: why}
export function tileFlows(t, flows) {
  const ids = flows.map((f) => f.id);
  const q = new URLSearchParams(t.href.split("?")[1] || "");
  const page = t.href.split("?")[0];
  const pick = (pre) => ids.filter((i) => i === pre || i.startsWith(pre + "@") || i.startsWith(pre + "#"));
  for (const [k, why] of Object.entries(TILE_GAPS)) if (t.href.startsWith(k)) return { gap: why };
  if (page === "cook.html") return { flows: ids.filter((i) => i.startsWith("cook:")) };
  if (page === "clinic.html" && !q.get("stage") && !q.get("patient")) return { flows: pick("clinic:morning") };
  if (page === "clinic.html" && q.get("patient")) return { flows: pick("clinic:patient") };
  if (page === "clinic.html" && q.get("stage") === "heal") return { flows: pick(`clinic:heal-${q.get("game")}`) };
  if (page === "clinic.html") return { flows: pick(`clinic:${q.get("stage")}`) };
  if (page === "lab/clinic-heal-host.html") { const g = q.get("game"); const a = pick(`clinic:heal-${g}`); return { flows: a.length ? a : pick(`clinic:heal-extra-${g}`), note: "the same game through the clinic's pipeline" }; }
  if (page === "lab.html" && q.get("mode") === "clinic") {
    const g = q.get("game");
    // lab.html runs the same clinic mode plug-in through the same host as clinic.html: its stage flows play it
    if (!g) return { flows: pick("clinic:patient"), note: "clinic.html, same plug-in and host" };
    const stage = ["waiting", "diagnosis", "pharmacy", "sendoff"].includes(g) ? `clinic:${g}` : `clinic:heal-${g}`;
    const a = pick(stage);
    return { flows: a.length ? a : pick(`clinic:heal-extra-${g}`), note: "clinic.html, same plug-in and host" };
  }
  if (page === "lab.html" && q.get("mode") === "cook") {
    if (q.get("play") === "story") return { flows: pick("lab:cook/story-birthday") };
    if (q.get("play") === "free") return { flows: pick("lab:cook/free") };
    return { flows: pick(`lab:cook/${q.get("game") || "round"}`) };
  }
  const mode = page.replace(/\.html$/, "");
  const mf = ids.filter((i) => i === `mode:${mode}` || i.startsWith(`mode:${mode}#`));
  if (mf.length) return { flows: mf, note: "parked mode: its smoke flow (the first mini-game at level 1)" };
  return { gap: "no flow" };
}
