// The gate's page cache (cost-and-speed change 3): a page is replayed only when its flow, its size or the code and data its
// mode is built from changed since the last approved run. The hashes are git tree hashes of the mode's folders (plus the
// sandbox's own drivers and the language data), dirty files by content, so an edit you have not committed still counts.
// cache: build/lint/gate-cache.json  { "<flow>@<size>": "<hash>" }, written only when a gate's --check passed.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { ROOT } from "./env.mjs";

export const CACHE_FILE = join(ROOT, "build", "lint", "gate-cache.json");
const sha = (s) => createHash("sha1").update(s).digest("hex").slice(0, 20);
const git = (...a) => { const r = spawnSync("git", a, { cwd: ROOT, encoding: "utf8" }); return r.status === 0 ? r.stdout.trim() : ""; };

// the folders a flow's pages are built from
export function modeDirs(flow) {
  const m = /^(cook|lab:cook|clinic|mode:(\w+)|house|first)/.exec(flow) || [];
  const k = m[1] && m[1].startsWith("lab:cook") ? "cook" : m[2] || m[1] || "";
  const dirs = ["js/shared", "css/shared", "js/core", "data/lang", "build/sandbox/flows", "build/sandbox/drivers", "build/sandbox/lib"];
  if (k === "cook") dirs.push("js/cook", "css/cook", "assets/cook", "data/cook");
  else if (k === "clinic") dirs.push("js/clinic", "css/clinic", "assets/clinic", "data/clinic");
  else if (k) dirs.push(`js/${k}`, `css/${k}`);
  return dirs;
}
const dirtyCache = new Map();
function dirtyHash(dir) {
  if (!dirtyCache.has(dir)) {
    const files = git("ls-files", "-m", "-o", "--exclude-standard", "--", dir).split("\n").filter(Boolean).sort();
    dirtyCache.set(dir, files.length ? sha(files.map((f) => { try { return `${f}:${sha(readFileSync(join(ROOT, f)))}`; } catch (e) { return `${f}:gone`; } }).join(",")) : "");
  }
  return dirtyCache.get(dir);
}
export function pageHash(flowId, size) {
  const parts = modeDirs(flowId).map((d) => `${d}:${git("rev-parse", `HEAD:${d}`) || "-"}${dirtyHash(d) ? `|${dirtyHash(d)}` : ""}`);
  return sha(`${flowId}@${size}|${parts.join(",")}`);
}
export function loadCache() { try { return JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch (e) { return {}; } }
export function saveCache(cache) { mkdirSync(dirname(CACHE_FILE), { recursive: true }); writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1) + "\n"); }
// split jobs [{flow:{id}, size}] into those to play and those whose hash matches the last approved run
export function planGate(jobs, cache = loadCache()) {
  const todo = [], skipped = [], hashes = {};
  for (const j of jobs) {
    const key = `${j.flow.id}@${j.size}`, h = (hashes[key] = pageHash(j.flow.id, j.size));
    (cache[key] === h && !j.flow.static ? skipped : todo).push(j);
  }
  return { todo, skipped, hashes };
}
