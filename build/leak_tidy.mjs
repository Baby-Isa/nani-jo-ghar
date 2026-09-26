#!/usr/bin/env node
/*
 * Tidy up: the generator checks and the leak bot, headless (no browser).
 * docs/modes/tidy-up-design.md 8.1 (checks 1-5), 8.4 (the bot), build brief
 * phase 0.
 *
 *   node build/leak_tidy.mjs --gen 1000 --bot 500
 *   node build/leak_tidy.mjs --bot 200 --game box --seed 7
 *   node build/leak_tidy.mjs --bot 500 --md build/reports/tidy-leak.md
 *
 * --gen N: N rounds per game x board x level x kind: how many pass the four
 *          per-round checks (solvable, >=3 options a row, the everyday
 *          layout fails, no forced row) within 50 re-rolls, the re-roll
 *          rate, and check 5 (flat priors): no (thing, place) pair is the
 *          answer more than 1.5x its fair share.
 * --bot N: every strategy in js/tidy/bot.js plays N rounds of each; the
 *          ear-star rate is printed. Pass: every strategy under 10% except
 *          Reader (the English placeholder hole, reported apart). Ali's turn
 *          (K5) is played by pills alone (no voice): its win rate.
 * Exit code 1 if anything fails.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const Rules = require(path.join(ROOT, "js/tidy/rules.js"));
const Bot = require(path.join(ROOT, "js/tidy/bot.js"));
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));

const args = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return dflt;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
};
const GEN = Number(arg("gen", 0)) || 0;
const BOT = Number(arg("bot", 0)) || 0;
const SEED = Number(arg("seed", 1)) || 1;
const ONLY = arg("game", null);
const MD = arg("md", null);
if (!GEN && !BOT) {
  console.log("usage: node build/leak_tidy.mjs [--gen N] [--bot N] [--game putaway|dastarkhwan|box] [--seed S] [--md out.md]");
  process.exit(2);
}

// the data, exactly as the page loads it
const data = read("data/tidy.json");
const scenes = {};
for (const f of ["kitchen-tidy", "sitting-room-tidy", "worktop-tidy"]) scenes[f] = read(`data/scenes/${f}.json`);
const content = {};
for (const w of read("data/content.json").words) content[w.id] = { kutchi: (w.kutchi && w.kutchi.text) || null, english: w.english, image: w.image };
Rules.init(data, scenes, content);

const combos = [];
for (const game of ["putaway", "dastarkhwan", "box"]) {
  if (ONLY && ONLY !== game) continue;
  const G = data.games[game];
  for (const board of Object.keys(G.boards)) {
    for (let level = G.boards[board].minLevel || 1; level <= G.levels.length; level++) {
      const kn = Rules.knobs(game, level, board);
      for (const kind of kn.kinds.filter((k) => k !== "K5")) combos.push({ game, board, level, kind, code: G.code });
    }
  }
}
const label = (c) => `${c.code} ${c.game}/${c.board} L${c.level} ${c.kind}`;
const pct = (a, b) => (b ? (100 * a) / b : 0);
const fmt = (x) => `${x.toFixed(1)}%`;
let failures = 0;
const md = [];
const out = (s = "") => {
  console.log(s);
  md.push(s);
};

/* ---------------- --gen: the solver checks ---------------- */
if (GEN) {
  out(`## Generator checks: ${GEN} rounds per row (seed ${SEED})`);
  out("");
  out("| Game / board / level / kind | Pass | Re-rolls (mean, max of 100) | Flat priors: most-said place vs fair share | Notes on failed rounds |");
  out("|---|---|---|---|---|");
  for (const c of combos) {
    const rng = Rules.rng(SEED * 7919 + combos.indexOf(c));
    let ok = 0;
    let rer = 0;
    let rmax = 0;
    const notes = {};
    const pair = {}; // word -> {place said -> n}
    const expect = {}; // word -> {place said -> its fair share}: 1/k for each of the k places on offer that round
    const groups = new Set();
    for (let i = 0; i < GEN; i++) {
      const r = Rules.make(c.game, { board: c.board, level: c.level, kind: c.kind, rng });
      if (r.checks.ok) ok++;
      else r.checks.notes.forEach((n) => (notes[n.replace(/r\d+/, "row")] = (notes[n.replace(/r\d+/, "row")] || 0) + 1));
      rer += r.rerolls;
      rmax = Math.max(rmax, r.rerolls);
      const where = {};
      r.B.groups.forEach((g) => g.spots.forEach((s) => (where[s] = where[s] || g.key)));
      r.addressable.forEach((g) => groups.add(g));
      r.rows.forEach((row) => {
        if (row.type !== "place" && row.type !== "count") return;
        const iid = Object.keys(r.items).find((j) => r.items[j].word === row.item && r.solution[j] !== "tray");
        if (!iid) return;
        // a person's cushion is a person, not a place: priors are over what's said (the anchor)
        if (row.anchor && typeof row.anchor === "object") return; // relative to another thing, not a place
        const said = (k) => {
          const g = r.B.groups.find((x) => x.key === k);
          return g && r.people[g.anchor] ? `in-front|${r.people[g.anchor]}` : k;
        };
        const key = said(`${row.rel}|${row.anchor || ""}`);
        (pair[row.item] = pair[row.item] || {})[key] = (pair[row.item][key] || 0) + 1;
        const e = (expect[row.item] = expect[row.item] || {});
        r.addressable.forEach((k) => (e[said(k)] = (e[said(k)] || 0) + 1 / r.addressable.length));
      });
    }
    // check 5, flat priors. (a) each place said: observed against its fair share (1/k of
    // the rows made when k places were on offer), which must stay under 1.5x; (b) each
    // (thing, place) pair: a pair over 1.5x counts only if it is also clearly not chance:
    // more than 4.1 standard deviations over (Bonferroni: 5% across the ~2,000 cells of a
    // full run), since that many small cells always hold a few 1.5x flukes.
    let worst = 0;
    let worstAt = "";
    const placeObs = {};
    const placeExp = {};
    Object.keys(pair).forEach((w) => {
      Object.keys(expect[w]).forEach((g) => {
        placeObs[g] = (placeObs[g] || 0) + (pair[w][g] || 0);
        placeExp[g] = (placeExp[g] || 0) + expect[w][g];
      });
    });
    Object.keys(placeExp).forEach((g) => {
      if (placeExp[g] < 40) return;
      const ratio = placeObs[g] / placeExp[g];
      if (ratio > worst) (worst = ratio), (worstAt = g);
    });
    let pairFlag = "";
    let pairWorst = 0;
    Object.keys(pair).forEach((w) =>
      Object.keys(pair[w]).forEach((g) => {
        const e = expect[w][g];
        if (e < 20) return;
        const ratio = pair[w][g] / e;
        const z = (pair[w][g] - e) / Math.sqrt(e);
        if (ratio > 1.5 && z > 4.1 && ratio > pairWorst) (pairWorst = ratio), (pairFlag = `${w}@${g} ${ratio.toFixed(2)}x z=${z.toFixed(1)}`);
      })
    );
    const pass = pct(ok, GEN);
    const flat = worst <= 1.5 && !pairFlag;
    if (pass < 100 || !flat) failures++;
    const noteTxt = Object.entries(notes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([n, k]) => `${n} (${k})`)
      .join("; ");
    out(`| ${label(c)} | ${fmt(pass)}${pass < 100 ? " **FAIL**" : ""} | ${(rer / GEN).toFixed(2)}, ${rmax} | ${worst ? worst.toFixed(2) + " (" + worstAt.replace(/\|$/, "") + ")" : "n/a"}${flat ? "" : " **FAIL** " + (pairFlag || worstAt)} | ${noteTxt || "-"} |`);
  }
  out("");
}

/* ---------------- --bot: the non-speaker ---------------- */
if (BOT) {
  const strategies = Bot.STRATEGIES;
  out(`## Leak bot: ear-star rate over ${BOT} rounds (seed ${SEED}); pass is under 10% (Reader reported apart)`);
  out("");
  out(`| Game / board / level / kind | ${strategies.join(" | ")} |`);
  out(`|---|${strategies.map(() => "---").join("|")}|`);
  const worst = {};
  for (const c of combos) {
    const cells = [];
    for (const s of strategies) {
      if (s === "liveprobe" && !Rules.knobs(c.game, c.level, c.board).liveCheck) {
        cells.push("-");
        continue;
      }
      if (s === "nameswrong" && c.kind !== "K2") {
        cells.push("-");
        continue;
      }
      const rng = Rules.rng(SEED * 104729 + combos.indexOf(c) * 31 + strategies.indexOf(s));
      const memory = {};
      if (s === "prior") {
        for (let i = 0; i < 200; i++) {
          const r = Rules.make(c.game, { board: c.board, level: c.level, kind: c.kind, rng });
          Bot.learn(memory, Rules.view(r), r.solution);
        }
      }
      let ears = 0;
      for (let i = 0; i < BOT; i++) {
        const r = Rules.make(c.game, { board: c.board, level: c.level, kind: c.kind, rng });
        const view = Rules.view(r, { reader: s === "reader" });
        const lost = new Set();
        const live = !!r.knobs.liveCheck;
        const probe = (iid, spot, pl) => {
          const l = Rules.liveWrong(r, pl, iid, spot);
          l.forEach((x) => lost.add(x));
          return l.length > 0;
        };
        const pl = Bot.play(view, s, { rng, memory, probe: live ? probe : null, named: r.rows.map((x) => x.item).filter(Boolean) });
        if (live && s !== "liveprobe") {
          // every thing it moved was one drop, checked as it landed
          Object.keys(pl).forEach((iid) => pl[iid] !== r.start[iid] && pl[iid] !== "tray" && Rules.liveWrong(r, pl, iid, pl[iid]).forEach((x) => lost.add(x)));
        }
        if (Rules.grade(r, pl, [...lost]).ear) ears++;
        if (s === "copylast" || s === "prior") Bot.learn(memory, view, r.solution);
      }
      const rate = pct(ears, BOT);
      worst[s] = Math.max(worst[s] || 0, rate);
      const bad = rate >= 10 && s !== "reader";
      if (bad) failures++;
      cells.push(`${fmt(rate)}${bad ? " **FAIL**" : ""}`);
    }
    out(`| ${label(c)} | ${cells.join(" | ")} |`);
  }
  out(`| **worst** | ${strategies.map((s) => fmt(worst[s] || 0)).join(" | ")} |`);
  out("");

  // Ali's turn (K5) by pills alone: the round is won only if Ali understood every row
  out(`## Ali's turn (T4, K5) without a voice: win rate over ${BOT} rounds by pills alone`);
  out("");
  out(`| Flipped game / level (listens a row) | ${Bot.PILL_STRATEGIES.join(" | ")} | Blind estimate |`);
  out(`|---|${Bot.PILL_STRATEGIES.map(() => "---").join("|")}|---|`);
  for (const game of ["putaway", "dastarkhwan", "box"]) {
    if (ONLY && ONLY !== game) continue;
    const G = data.games[game];
    for (let level = 1; level <= G.levels.length; level++) {
      const base = Rules.knobs(game, level).kinds.find((k) => k !== "K5");
      const cells = [];
      let est = 0;
      let listensTxt = "";
      for (const s of Bot.PILL_STRATEGIES) {
        const rng = Rules.rng(SEED * 15485863 + level * 17 + Bot.PILL_STRATEGIES.indexOf(s) + game.length);
        let wins = 0;
        let estSum = 0;
        for (let i = 0; i < BOT; i++) {
          const r = Rules.make(game, { level, kind: base, rng });
          const rows = Rules.aliListens(r, level);
          let all = true;
          let p = 1;
          rows.forEach((x) => {
            const said = Bot.pills(x.listens, s, { rng, slot: 1 });
            x.listens.forEach((l, k) => {
              p *= 1 / l.choices.length;
              if (said[k] !== l.answer) all = false;
            });
          });
          if (rows.length < (data.star_sets.tidy.voiceTested || 2)) all = false;
          if (all) wins++;
          estSum += p;
          listensTxt = rows[0] ? rows[0].listens.map((l) => `${l.slot}/${l.choices.length}`).join("+") : "";
        }
        est = estSum / BOT;
        const rate = pct(wins, BOT);
        if (rate >= 10) failures++;
        cells.push(`${fmt(rate)}${rate >= 10 ? " **FAIL**" : ""}`);
      }
      out(`| ${G.code} ${game} L${level} (${listensTxt}) | ${cells.join(" | ")} | ${fmt(100 * est)} |`);
    }
  }
  out("");
}

out(failures ? `**${failures} failing cell(s).**` : "All checks pass.");
if (MD) fs.writeFileSync(path.resolve(MD), md.join("\n") + "\n");
process.exit(failures ? 1 : 0);
