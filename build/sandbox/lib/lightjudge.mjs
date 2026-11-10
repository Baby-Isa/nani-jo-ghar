// The light pictures judged (s19-checks-1, contract-112): every light lib/lightshot.mjs caught is judged by lib/lightjudge.py (pixels,
// numpy) once the pages are played, and each page's lights carry their verdict for the contract check (lib/contract-screen.mjs).
// A light already judged (verdict.json beside it) is read, not judged again, unless NJG_REJUDGE=1. The raw pictures of a light that
// passed are deleted (disk; the fixtures keep theirs: NJG_KEEP_LIGHTS=1); a failing light keeps its two pictures and its mark.jpg.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const JUDGE = join(dirname(fileURLToPath(import.meta.url)), "lightjudge.py");

/** Judge light folders (absolute paths) with the Python judge; -> {dir: verdict}. */
export function judgeDirs(dirs, { rejudge = !!process.env.NJG_REJUDGE } = {}) {
  const out = {};
  const todo = dirs.filter((d) => existsSync(join(d, "with.jpg")) && (rejudge || !existsSync(join(d, "verdict.json"))));
  for (let i = 0; i < todo.length; i += 150) {
    const r = spawnSync("python3", [JUDGE, ...todo.slice(i, i + 150)], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (r.status !== 0) for (const d of todo.slice(i, i + 150)) out[d] = { ok: false, error: true, fails: [`the light judge did not run: ${(r.stderr || "").trim().split("\n").pop()}`] };
  }
  for (const d of dirs) {
    if (out[d]) continue;
    try { out[d] = JSON.parse(readFileSync(join(d, "verdict.json"), "utf8")); } catch (e) { out[d] = { ok: false, error: true, fails: ["no verdict: its pictures were not kept"] }; }
  }
  return out;
}

/** Every page's caught lights judged; each r.lights[i].verdict set. */
export function judgeLights(results, { root, log = () => {}, keep = !!process.env.NJG_KEEP_LIGHTS } = {}) {
  const dirs = [];
  for (const r of results) for (const l of r.lights || []) dirs.push(join(root, l.dir));
  if (!dirs.length) return;
  const v = judgeDirs(dirs);
  let bad = 0;
  for (const r of results) for (const l of r.lights || []) {
    const d = join(root, l.dir);
    l.verdict = v[d];
    if (!l.verdict || !l.verdict.ok) { bad++; continue; }
    if (!keep) for (const f of ["before.jpg", "with.jpg"]) try { rmSync(join(d, f)); } catch (e) { /* gone */ }
  }
  log(`lights: ${dirs.length} judged on their pictures, ${bad} failing (lib/lightjudge.py)`);
}
