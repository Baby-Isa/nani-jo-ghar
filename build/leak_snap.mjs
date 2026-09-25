#!/usr/bin/env node
/*
 * Snap's Node leak bot (no browser): docs/modes/snap-design.md 8.4, D5, and
 * the build brief's phase 0. It deals real rounds from data/snap.json and
 * data/scenes/orchard.json and plays them with js/snap/sim.js, the same pure
 * evaluator (js/snap/photo.js) and dealer (js/snap/requests.js) the browser uses.
 *
 *   node build/leak_snap.mjs --unit          the evaluator fixtures
 *   node build/leak_snap.mjs --fair [N]      N seeds per mini-game x level: every row has an achievable frame, >= 3 kinds
 *   node build/leak_snap.mjs --leakbot [N]   every strategy, N rounds per mini-game x level; writes build/reports/snap-leakbot.md
 *   node build/leak_snap.mjs --leakbot N --game g4   one mini-game only
 *   node build/leak_snap.mjs                 all three (N = data/snap.json leakbot.rounds, 500)
 *
 * Exit code 1 if a fixture fails, a round isn't fair, the oracle earns the
 * ear star in under 95% of rounds, any blind strategy reaches 10%, or the
 * blind strategies pooled reach 5%.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const Photo = require(path.join(ROOT, "js/snap/photo.js"));
const Req = require(path.join(ROOT, "js/snap/requests.js"));
const Sim = require(path.join(ROOT, "js/snap/sim.js"));
const snap = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snap.json"), "utf8"));
const scene = JSON.parse(fs.readFileSync(path.join(ROOT, "data/scenes/orchard.json"), "utf8"));

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const numAfter = (f) => {
  const i = args.indexOf(f);
  const n = i >= 0 ? Number(args[i + 1]) : NaN;
  return Number.isFinite(n) ? n : null;
};
const all = !has("--unit") && !has("--fair") && !has("--leakbot");
const N = numAfter("--leakbot") || numAfter("--fair") || (snap.leakbot && snap.leakbot.rounds) || 500;
const GAMES = { g1: [1, 2, 3], g2: [1, 2, 3], g4: [1, 2] };
const only = numAfter("--game") ? null : args.includes("--game") ? args[args.indexOf("--game") + 1] : null;
let failed = 0;
const fail = (msg) => {
  failed++;
  console.log("  FAIL " + msg);
};

/* ---------------- --unit: the evaluator fixtures ---------------- */
function unit() {
  console.log("--unit: evaluator fixtures");
  const rules = Req.knobs(snap, "g2", 1).photo;
  const F = { x: 0, y: 0, w: 400, h: 200, zoom: 2 };
  const sp = (id, kind, size, x, y, w, h = w) => ({ id, kind, size, x, y, w, h });
  const check = (name, got, want) => {
    if (got === want) console.log(`  ok   ${name}`);
    else fail(`${name}: got ${got}, want ${want}`);
  };
  // exactly N: three whole mangoes and a fourth 49% showing is three; at 50% it's four
  const three = [sp("a", "fru-05", "mid", 60, 100, 100), sp("b", "fru-05", "mid", 180, 100, 100), sp("c", "fru-05", "mid", 300, 100, 100)];
  const p49 = Photo.printRecord(three.concat([sp("d", "fru-05", "mid", 401, 100, 100)]), F);
  check("exactly 3 with a fourth at 49% showing", Photo.matches(p49, { kind: "count", noun: "fru-05", n: 3 }, rules).ok, true);
  const p50 = Photo.printRecord(three.concat([sp("d", "fru-05", "mid", 400, 100, 100)]), F);
  check("a fourth at 50% showing makes it 4", Photo.matches(p50, { kind: "count", noun: "fru-05", n: 3 }, rules).ok, false);
  check("  ...and it is 4", Photo.countOf(p50, "fru-05", rules), 4);
  check("other nouns don't matter to a count", Photo.matches(Photo.printRecord(three.concat([sp("k", "fru-01", "mid", 240, 40, 60)]), F), { kind: "count", noun: "fru-05", n: 3 }, rules).ok, true);
  // main subject: a bigger same-noun decoy takes the main-subject place
  const bigMain = [sp("m", "fru-05", "big", 200, 100, 150)];
  check("the big mango, alone in the middle, is 'vadho aamo'", Photo.matches(Photo.printRecord(bigMain, F), { kind: "pick", noun: "fru-05", size: "big" }, rules).ok, true);
  const small = [sp("s", "fru-05", "small", 200, 100, 76), sp("B", "fru-05", "big", 330, 100, 150)];
  check("a small mango beside a bigger mango is not 'nindho aamo'", Photo.matches(Photo.printRecord(small, F), { kind: "pick", noun: "fru-05", size: "small" }, rules).ok, false);
  const rival = [sp("m", "fru-05", "big", 200, 100, 150), sp("r", "fru-05", "mid", 340, 100, 110)];
  check("a mid mango over half the big one's area is a rival", Photo.matches(Photo.printRecord(rival, F), { kind: "pick", noun: "fru-05", size: "big" }, rules).ok, false);
  const offC = [sp("m", "fru-05", "big", 120, 100, 150)];
  check("the big mango off the middle third is not the main subject", Photo.matches(Photo.printRecord(offC, F), { kind: "pick", noun: "fru-05", size: "big" }, rules).ok, false);
  const tiny = [sp("m", "fru-05", "small", 200, 100, 40)];
  check("a small mango under 8% of the frame is not the main subject", Photo.matches(Photo.printRecord(tiny, F), { kind: "pick", noun: "fru-05", size: "small" }, rules).ok, false);
  // the mid size never matches a row, and is never asked
  const mid = [sp("m", "fru-05", "mid", 200, 100, 110)];
  check("a mid mango is neither 'vadho' nor 'nindho'", ["big", "small"].some((size) => Photo.matches(Photo.printRecord(mid, F), { kind: "pick", noun: "fru-05", size }, rules).ok), false);
  let midAsked = 0;
  for (let s = 1; s <= 300; s++) for (const lv of [1, 2, 3]) Req.makeRound(snap, scene, "g2", lv, s).rows.forEach((r) => (midAsked += r.size === "mid" ? 1 : 0));
  check("the dealer never asks the mid size (900 rounds)", midAsked, 0);
  // nar: the excluded fruit at 9% showing is out; at 11% it's in
  const bananaAt = (vis) => sp("k", "fru-01", "mid", 400 + 50 - vis * 100, 100, 100);
  check("'trae aamo, nar kelo' with a banana 9% showing", Photo.matches(Photo.printRecord(three.concat([bananaAt(0.09)]), F), { kind: "count", noun: "fru-05", n: 3, not: "fru-01" }, rules).ok, true);
  check("'trae aamo, nar kelo' with a banana 11% showing", Photo.matches(Photo.printRecord(three.concat([bananaAt(0.11)]), F), { kind: "count", noun: "fru-05", n: 3, not: "fru-01" }, rules).ok, false);
  // the lens star is rated on the biggest thing in frame, whatever the row
  const lensP = Photo.printRecord([sp("m", "fru-01", "big", 200, 100, 150), sp("s", "fru-05", "small", 40, 40, 30)], F);
  check("lens rates the biggest thing (a banana), not the wanted mango", Photo.lensScore(lensP, rules).of, "m");
  // recasts say what's really there
  check("recast of four mangoes for 'trae aamo'", JSON.stringify(Photo.recast(p50, { kind: "count", noun: "fru-05", n: 3 }, rules)), JSON.stringify([4, "fru-05"]));
  check("recast of a small mango for 'vadho aamo'", JSON.stringify(Photo.recast(Photo.printRecord(tiny.map((s) => Object.assign({}, s, { w: 90, h: 90 })), F), { kind: "pick", noun: "fru-05", size: "big" }, rules)), JSON.stringify(["ph-small", "fru-05"]));
  check("recast of a broken 'nar kelo'", JSON.stringify(Photo.recast(Photo.printRecord(three.concat([bananaAt(0.6)]), F), { kind: "count", noun: "fru-05", n: 3, not: "fru-01" }, rules)), JSON.stringify([1, "fru-01"]));
  // the frame stays inside the orchard
  const fr = Photo.frameAt(10, 10, 1, { w: 800, h: 450 }, { w: 2400, h: 900 });
  check("a frame at the corner is kept inside the scene", fr.x === 0 && fr.y === 0, true);
  // the print record is a pure function of the scene and the frame
  const r1 = Req.makeRound(snap, scene, "g1", 2, 42);
  const r2 = Req.makeRound(snap, scene, "g1", 2, 42);
  check("the same seed deals the same round", JSON.stringify(r1.rows) + r1.lay.spots.length, JSON.stringify(r2.rows) + r2.lay.spots.length);
}

/* ---------------- --fair: every row achievable, >= 3 kinds ---------------- */
function fair(n) {
  console.log(`--fair: ${n} seeds per mini-game x level`);
  const out = {};
  for (const [game, levels] of Object.entries(GAMES))
    for (const level of levels) {
      let rows = 0;
      let bad = 0;
      let fewKinds = 0;
      let retries = 0;
      for (let seed = 1; seed <= n; seed++) {
        const r = Req.makeRound(snap, scene, game, level, 100000 + seed);
        retries += r.tries;
        if (new Set(r.lay.spots.map((s) => s.kind)).size < 3) fewKinds++;
        r.rows.forEach((row) => {
          rows++;
          const f = Req.frameFor(row, r.lay, r.K);
          if (!f || !Photo.matches(f.print, row, r.K.photo).ok) bad++;
        });
      }
      out[`${game}.${level}`] = { rows, bad, fewKinds, retries };
      const ok = !bad && !fewKinds;
      console.log(`  ${ok ? "ok  " : "FAIL"} ${game} level ${level}: ${rows} rows, ${bad} without an achievable frame, ${fewKinds} rounds under 3 kinds, ${(retries / n).toFixed(2)} re-deals a round`);
      if (!ok) failed++;
    }
  return out;
}

/* ---------------- --leakbot: every strategy ---------------- */
function leakbot(n) {
  console.log(`--leakbot: ${n} rounds per strategy x mini-game x level`);
  const G = snap.leakbot.gate;
  const table = [];
  for (const [game, levels] of Object.entries(GAMES).filter(([g]) => !only || g === only))
    for (const level of levels) {
      const K = Req.knobs(snap, game, level);
      let pooledEar = 0;
      let pooledN = 0;
      let worst = { name: "", rate: 0 };
      const line = { game, level, rates: {} };
      for (const [name, st] of Object.entries(Sim.STRATEGIES)) {
        if (!Sim.applies(st, game, K)) continue;
        let ear = 0;
        let offered = 0;
        let lens = 0;
        let voice = 0;
        let memory = null;
        for (let i = 0; i < n; i++) {
          const seed = 1 + i + level * 100003 + game.charCodeAt(1) * 7777;
          const res = Sim.play({ snap, scene, game, level, seed, strategy: st, memory });
          memory = res.right;
          ear += res.ear ? 1 : 0;
          offered += res.earOffered ? 1 : 0;
          lens += res.lens ? 1 : 0;
          voice += res.voice ? 1 : 0;
        }
        const rate = ear / n;
        line.rates[name] = { ear: rate, offered: offered / n, lens: lens / n, voice: voice / n };
        if (name === "oracle") {
          if (rate < G.oracle) fail(`${game} level ${level}: the oracle earns the ear star in only ${pct(rate)}`);
          if (game === "g4" && voice / n < G.oracle) fail(`${game} level ${level}: the oracle earns the voice star in only ${pct(voice / n)}`);
          continue;
        }
        pooledEar += ear;
        pooledN += n;
        if (rate > worst.rate) worst = { name, rate };
        if (rate >= G.perStrategy) fail(`${game} level ${level}: ${name} earns the ear star in ${pct(rate)}`);
        if (game === "g4" && voice > 0) fail(`${game} level ${level}: ${name} earns the voice star (${voice}) without speaking`);
      }
      line.pooled = pooledEar / pooledN;
      line.worst = worst;
      if (line.pooled >= G.combined) fail(`${game} level ${level}: blind strategies pooled earn the ear star in ${pct(line.pooled)}`);
      console.log(`  ${game} level ${level}: oracle ${pct(line.rates.oracle.ear)} (lens ${pct(line.rates.oracle.lens)}${game === "g4" ? `, voice ${pct(line.rates.oracle.voice)}` : ""}); blind pooled ${pct(line.pooled)}, worst ${worst.name || "-"} ${pct(worst.rate)}`);
      table.push(line);
    }
  writeReport(table, n);
  return table;
}
const pct = (r) => `${(r * 100).toFixed(1)}%`;

function writeReport(table, n) {
  const names = Object.keys(Sim.STRATEGIES);
  const head = `| Mini-game · level | ${names.join(" | ")} | Blind pooled |\n|---|${names.map(() => "---").join("|")}|---|`;
  const rows = table.map((l) => `| ${({ g1: "G1 Just so many", g2: "G2 The big one", g4: "G4 Ali's camera" })[l.game]} · ${l.level} | ${names.map((k) => (l.rates[k] ? pct(l.rates[k].ear) : "–")).join(" | ")} | **${pct(l.pooled)}** |`);
  const voice = table.filter((l) => l.game === "g4").map((l) => `| G4 · ${l.level} | ${pct(l.rates.oracle.voice)} | ${pct(Math.max(...names.filter((k) => k !== "oracle" && l.rates[k]).map((k) => l.rates[k].voice)))} |`);
  const md = `# Snap: leak-bot report

Generated by \`node build/leak_snap.mjs --leakbot ${n}\` on ${new Date().toISOString().slice(0, 10)}: ${n} rounds per strategy per mini-game per level, dealt from \`data/snap.json\` and \`data/scenes/orchard.json\`, played by \`js/snap/sim.js\` on the same evaluator (\`js/snap/photo.js\`) as the browser. Every row in G1, G2 and G4 is real Kutchi from the family's lists (fruit, numbers 1-5; *vadho*, *nindho* and *nar* are drafts): no placeholder row is in the gate.

**Gates** (design 8.4, build brief phase 0): oracle ≥ ${pct(snap.leakbot.gate.oracle)}; every blind strategy < ${pct(snap.leakbot.gate.perStrategy)}; blind strategies pooled < ${pct(snap.leakbot.gate.combined)}. **Result: ${failed ? "FAIL" : "all pass"}.**

## Ear star rate by strategy

${head}
${rows.join("\n")}

## Voice star (G4, Ali's camera)

The oracle's \`listen()\` stub hears the card; the blind bots' returns \`null\` (they can't speak), so they get the pills, which move the round on and credit nothing.

| Level | Oracle | Best blind |
|---|---|---|
${voice.join("\n")}

## The strategies

- **oracle**: knows the rows; shoots each row's guaranteed frame; hands in the right print.
- **random**: random frames at random zooms; random hand-in.
- **salience**: the biggest bunches (G1) or the big fruit left to right (G2); hands in in shot order.
- **onePerKind**: one print of every kind (a count it can make, chosen at random; G2: big or small at random); random hand-in. D5's "one per kind".
- **fillFrame**: a whole bunch in the frame, zoomed out, one per bunch. D5's "fill the frame".
- **middleSize** (G2): the mid-sized one of each kind. D5's "the middle size".
- **everythingAlone** (leave-out levels): one kind alone in each print. D5's "everything alone".
- **shotOrder**: one per kind, handed in in the order shot.
- **rowShape**: one print per row, shaped by what the card shows (a "Nar" row gets a print with one kind alone), and at the hand-in the print made for a row of the same shape as the one Nani's line shows.
- **freshProfile**: a new profile, so every word is at stage 1 and its fruit twinkle: the bot shoots exactly those. Stage-1 rows are taught, not tested: the ear star is not offered.
- **sceneMemory**: last round's right frames shot again (the orchard is re-dealt from the seed).
`;
  const dir = path.join(ROOT, "build/reports");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "snap-leakbot.md"), md);
  console.log("  wrote build/reports/snap-leakbot.md");
}

const t0 = Date.now();
if (all || has("--unit")) unit();
if (all || has("--fair")) fair(N);
if (all || has("--leakbot")) leakbot(N);
console.log(`${failed ? `${failed} FAILED` : "all passed"} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(failed ? 1 : 0);
