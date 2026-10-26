#!/usr/bin/env node
// What a page said and played, as text (S13-V: the one voice player's before/after proof). From a sandbox run's stored pages
// (build/screenshots/sandbox/<run>/data), per page: every line in order with the source of each piece (a family clip's file, a
// placeholder TTS file, the device voice) and every sound effect the sound hook saw (the njg-sfx events and any <audio> that is
// not a voice). Times are left out, so a before and an after of the same flows compare line for line (diff the two files).
//   node build/sandbox/voicelog.mjs --run <sandbox run id> [--flows cook:chai-tray,clinic:heal-eye] [--out file]
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/env.mjs";
import * as Contract from "./lib/contract.mjs";
import { classify } from "./lib/sound.mjs";

const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const run = val("--run");
if (!run) { console.error("--run <sandbox run id>"); process.exit(2); }
const dir = join(ROOT, "build", "screenshots", "sandbox", run, "data");
if (!existsSync(dir)) { console.error(`no ${dir}`); process.exit(2); }
const want = val("--flows") ? val("--flows").split(",") : null;

const src = (p) => {
  if (p.via === "speechSynthesis") return `device voice "${p.text || ""}"`;
  const c = classify(p);
  return `${c.kind} ${String(p.url || "").split("?")[0]}`;
};
export function pageLog(r) {
  const tl = Contract.timeline(r);
  const v = Contract.voice(tl, { root: ROOT });
  const out = [`## ${r.flow} @ ${r.size}${r.variant ? ` [${r.variant}]` : ""} (${r.complete ? "end reached" : "stopped"})`];
  const rows = [];
  for (const l of v.lines) if ((l.text || "").trim()) rows.push([l.t0, `line ${l.who || "?"}: "${l.text}" <- ${l.plays.map(src).join(" + ") || "nothing played"}`]);
  for (const e of tl) if (e.type === "play" && e.via === "sfx") rows.push([e.t, `sfx ${e.url}`]);
  rows.sort((a, b) => a[0] - b[0]);
  return out.concat(rows.map((x) => x[1])).join("\n");
}

const pages = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8"))).filter((r) => !want || want.includes(r.flow)).sort((a, b) => `${a.flow}${a.size}`.localeCompare(`${b.flow}${b.size}`));
const text = `# voice and sound log, sandbox run ${run}\n\n${pages.map(pageLog).join("\n\n")}\n`;
if (val("--out")) writeFileSync(val("--out"), text);
else process.stdout.write(text);
