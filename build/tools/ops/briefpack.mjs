// What brief.mjs adds beyond the template (cost-and-speed changes 1, 4, 5): the default model table, the context pack (a decisions
// digest and the rules the task names, pasted, under 2k words), and the overlap check for live briefs.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib.mjs";

// change 1: who does what (model, effort, why). A spec's "kind" picks the row; its own "model" still wins.
export const MODEL_TABLE = {
  art: { model: "Fable", effort: "high", why: "art judgement" },
  design: { model: "Fable", effort: "high", why: "design" },
  review: { model: "Fable", effort: "high", why: "the review before main" },
  code: { model: "Opus", effort: "high", why: "game code" },
  shared: { model: "Opus", effort: "high", why: "the shared layer" },
  spec: { model: "Sonnet", effort: "medium", why: "specs" },
  driver: { model: "Sonnet", effort: "medium", why: "drivers and tools" },
  tools: { model: "Sonnet", effort: "medium", why: "tools" },
  docs: { model: "Sonnet", effort: "medium", why: "docs" },
  verdicts: { model: "Sonnet", effort: "medium", why: "verdict merging" },
  report: { model: "Sonnet", effort: "medium", why: "reports" },
  text: { model: "Haiku", effort: "low", why: "text-only expects" },
  counts: { model: "Haiku", effort: "low", why: "counts" },
  logs: { model: "Haiku", effort: "low", why: "log scraping" },
};
export const modelFor = (kind) => MODEL_TABLE[kind] || null;
export const modelTableText = () => Object.entries(MODEL_TABLE).map(([k, v]) => `${k}: ${v.model} ${v.effort}`).join("; ");

const words = (s) => String(s).split(/\s+/).filter(Boolean);
const clip = (s, n) => { const w = words(s); return w.length <= n ? s.trim() : w.slice(0, n).join(" ") + " ..."; };

// the last n decisions, each clipped (a table row: | N | date | decision | ... |): the live log plus decisions 1-99 in the archive
export const DECISION_FILES = [join(ROOT, "docs", "archive", "decisions", "decisions-log-99.md"), join(ROOT, "docs", "archive", "decisions", "decisions-1-to-99.md")]; // the log stopped at 99 (Zafar, 14 Oct): decisions now live in their docs
export function decisionsDigest(n = 15, perRow = 45, files = DECISION_FILES) {
  let text = ""; for (const f of [].concat(files)) { try { text += readFileSync(f, "utf8") + "\n"; } catch (e) { /* a missing file adds nothing */ } }
  if (!text) return [];
  const rows = text.split("\n").map((l) => /^\|\s*(\d+)\s*\|\s*([^|]*)\|\s*([^|]*)\|/.exec(l)).filter(Boolean).map((m) => ({ n: +m[1], date: m[2].trim(), text: m[3].trim() }));
  const byN = new Map(rows.map((r) => [r.n, r])); // the live log wins over the archive for the same number
  return [...byN.values()].sort((a, b) => a.n - b.n).slice(-n).map((r) => `- **${r.n}** (${r.date}): ${clip(r.text, perRow)}`);
}
// rulebook sections ("2" -> "## 2. ..." up to the next "## ") as bullets; budget in words per call, bullets dropped from the end
// the rulebook was retired on 13 Oct (decision 99); its text is kept whole in the archive and lives word for word in the design docs
export const RULEBOOK = join(ROOT, "docs", "archive", "process", "rules-2026-10-13.md");
export function ruleSections(secs, budget, file = RULEBOOK) {
  let text = ""; try { text = readFileSync(file, "utf8"); } catch (e) { return []; }
  const parts = text.split(/^## /m).slice(1), out = [];
  const per = Math.max(60, Math.floor(budget / Math.max(1, secs.length)));
  for (const s of secs) {
    const p = parts.find((x) => new RegExp(`^${s}\\.`).test(x));
    if (!p) { out.push(`### rules.md §${s}: not found`); continue; }
    const lines = p.split("\n"), head = lines[0].trim();
    const bullets = lines.filter((l) => /^- /.test(l));
    let used = 0, kept = [];
    for (const b of bullets) { const w = words(b).length; if (used + w > per) break; used += w; kept.push(b); }
    out.push(`### rules.md §${head}`, ...kept, ...(kept.length < bullets.length ? [`(+${bullets.length - kept.length} more bullets: read rules.md §${s})`] : []));
  }
  return out;
}
// bullets of the rulebook that cite a rule ID the task text names, e.g. (E5) or (H1, H2); IDs like B3, C8, E32
export function namedRules(taskText, file = RULEBOOK) {
  const ids = [...new Set(String(taskText).match(/\b[A-J]\d{1,2}\b/g) || [])];
  if (!ids.length) return [];
  let text = ""; try { text = readFileSync(file, "utf8"); } catch (e) { return []; }
  const hits = [];
  for (const l of text.split("\n")) {
    if (!/^- /.test(l)) continue;
    const cite = /\(([A-J]\d{1,2}(?:[,\s–-]+[A-J]?\d{1,2}|,\s*decisions?[^)]*)*)[^)]*\)\s*$/.exec(l);
    if (cite && ids.some((id) => new RegExp(`\\b${id}\\b`).test(l.slice(-80)))) hits.push(clip(l, 60));
  }
  return hits.slice(0, 12);
}
export function contextPack(spec, { maxWords = 2000 } = {}) {
  const taskText = (spec.tasks || []).map((t) => `${t.do} ${t.accept || ""}`).join(" ");
  const L = [`# Context pack: ${spec.name}`, "", "Pasted, not linked: the latest decisions, the rules this task names and the checks it must pass. The design facts are in the area docs the brief lists.", ""];
  L.push("## The last 15 decisions (logged to 13 Oct; later ones live in the design docs; the newest wins)", ...decisionsDigest(15), "");
  const named = namedRules(taskText);
  if (named.length) L.push("## Rules this task names (their text now lives in the design docs)", ...named, "");
  L.push("## The checks this session must pass (they are the rules; docs/tools.md)",
    "- `node build/tools/review/checks.mjs` before every push (unit tests, words, bump, specs, docs limits, picture loads).",
    "- Red then green per fix-list row: `node build/tools/review/evidence.mjs --run --rows <ID>` fails before the fix and passes after; the judge is never you.",
    "- The sandbox with its contract checks on the flows you touched: `node build/tools/review/touched.mjs` prints the command.", "");
  if (spec.rules && spec.rules.length) { const used = words(L.join("\n")).length; L.push("## Archived rulebook sections this spec asks for", ...ruleSections(spec.rules.map(String), Math.max(120, maxWords - used - 60))); }
  let out = L.join("\n") + "\n";
  while (words(out).length > maxWords && L.length > 8) { L.splice(L.length - 1, 1); out = L.join("\n") + "\n"; } // never over budget
  return out;
}

// change 5 (rule: single owner per shared file): two live briefs must not own one path. A spec's "owns" entries are path globs
// (the first token of an entry, comma-separated entries allowed); a literal path, a dir/** or a dir/*.ext pattern.
export function ownedPaths(owns) {
  // "js/cook/** except words.js, lang.js and mechanics/fetch.js (package B)": the exceptions are relative to the glob's folder
  const out = [];
  for (const entry of owns || []) {
    const clean = String(entry).replace(/\([^)]*\)/g, " ");
    const [ownPart, exPart] = clean.split(/\s+except\s+/i);
    const pieces = (s) => s.split(/,\s+|\s+and\s+/).map((x) => x.trim().split(/\s+/)[0].replace(/[`.;:]+$/, "")).filter((t) => /[\w*]\/[\w*.\-/]*|\.\w+$/.test(t) && !/^(the|rows|all|every)$/i.test(t));
    const brace = (t) => { const m = /^(.*)\{([^}]*)\}(.*)$/.exec(t); return m ? m[2].split(",").map((x) => m[1] + x + m[3]) : [t]; };
    const own = pieces(ownPart).flatMap(brace), ex = (exPart ? pieces(exPart) : []).flatMap(brace);
    for (const t of own) {
      const dir = t.replace(/\*.*$/, "").replace(/[^/]*$/, "");
      out.push(ex.length ? { path: t, except: ex.map((e) => (e.includes("/") && dir && !e.startsWith(dir) && !/^(js|css|data|assets|build|docs|\.claude)\//.test(e) ? dir + e : /^(js|css|data|assets|build|docs|\.claude)\//.test(e) ? e : dir + e)) } : { path: t, except: [] });
    }
  }
  const seen = new Set();
  return out.filter((o) => (seen.has(o.path + "|" + o.except.join()) ? false : seen.add(o.path + "|" + o.except.join())));
}
const norm = (p) => {
  const star = p.indexOf("*");
  if (star < 0) return { kind: "file", path: p };
  const head = p.slice(0, star);
  if (/\/\*\*$/.test(p) || p.slice(star).startsWith("**")) return { kind: "dir", path: head.endsWith("/") ? head : head.replace(/[^/]*$/, "") };
  const dir = head.replace(/[^/]*$/, "");
  return { kind: "pattern", path: dir, re: new RegExp("^" + p.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*") + "$") };
};
export function pathsOverlap(x, y) {
  const a = norm(x), b = norm(y);
  if (a.kind === "file" && b.kind === "file") return a.path === b.path;
  if (a.kind === "file") return b.kind === "dir" ? a.path.startsWith(b.path) : b.re.test(a.path);
  if (b.kind === "file") return pathsOverlap(y, x);
  if (a.kind === "dir" && b.kind === "dir") return a.path.startsWith(b.path) || b.path.startsWith(a.path);
  const [d, p] = a.kind === "dir" ? [a, b] : [b, a];
  if (p.kind === "pattern" && d.kind === "dir") return p.path.startsWith(d.path);
  return p.path === (d.path || p.path) && (a.kind === "pattern" && b.kind === "pattern" ? a.path === b.path : true);
}
// specs: [{name, live, owns, file}] -> [{a, b, pathA, pathB}] for the live ones only
export function overlaps(specs) {
  const live = specs.filter((s) => s.live === true), out = [];
  for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) {
    for (const pa of ownedPaths(live[i].owns)) for (const pb of ownedPaths(live[j].owns)) {
      if (!pathsOverlap(pa.path, pb.path)) continue;
      // a path the other brief carves out ("except ...") is not owned by it
      const carved = (x, y) => x.except.some((e) => pathsOverlap(e, y.path) && (norm(y.path).kind === "file" || norm(y.path).path.startsWith(norm(e).path)));
      if (carved(pa, pb) || carved(pb, pa)) continue;
      out.push({ a: live[i].name, b: live[j].name, pathA: pa.path, pathB: pb.path });
    }
  }
  return out;
}
export function liveSpecs(dir = join(ROOT, "build", "tools", "ops", "specs")) {
  const out = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) { try { const s = JSON.parse(readFileSync(join(dir, f), "utf8")); out.push({ ...s, file: f }); } catch (e) { /* not a spec */ } }
  return out;
}

// checks-to-build 14 (B17, B2-B4): the files a session's commits touched that its spec does not own (its own report is always
// its own). owns: the spec's owns list; files: paths from git diff --name-only. -> [paths outside the scope]
export function outsideScope(owns, files, { report } = {}) {
  const owned = ownedPaths(owns);
  const mine = (f) => owned.some((o) => pathsOverlap(o.path, f) && !o.except.some((e) => pathsOverlap(e, f)));
  return files.filter((f) => f && !mine(f) && !(report && f === `build/reports/${String(report).replace(/\.md$/, "")}.md`));
}
// a brief that sets up helper sessions breaks the one-or-two-sessions rule
export const NAMES_HELPERS = (text) => /\b(spawn|launch|start|use|open)\b[^.\n]{0,40}\bhelper (session|agent)s?\b/i.test(String(text || ""));
