// Screenshot retention (cost-and-speed change 8): keep the last approved run and the current one, plus everything newer than the
// approved run; delete the older sandbox runs at the start of a run. The approved run is recorded by an approved gate
// (build/lint/last-approved-run.json). No record, nothing deleted. Evidence sheets (build/screenshots/evidence) are never touched.
import { readFileSync, writeFileSync, readdirSync, statSync, rmSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { ROOT } from "./env.mjs";

export const APPROVED_FILE = join(ROOT, "build", "lint", "last-approved-run.json");
export const SANDBOX_DIR = join(ROOT, "build", "screenshots", "sandbox");
export function approvedRun(file = APPROVED_FILE) { try { return JSON.parse(readFileSync(file, "utf8")).run || null; } catch (e) { return null; } }
export function recordApproved(run, file = APPROVED_FILE) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify({ run, date: new Date().toISOString() }) + "\n"); }
// the run folders to delete: older than the approved run, and neither it nor the current one. dry: list only
export function pruneSandbox({ current, dir = SANDBOX_DIR, approvedFile = APPROVED_FILE, dry = false } = {}) {
  const ap = approvedRun(approvedFile);
  if (!ap) return [];
  let names; try { names = readdirSync(dir); } catch (e) { return []; }
  let apTime; try { apTime = statSync(join(dir, ap)).mtimeMs; } catch (e) { return []; }
  const gone = [];
  for (const n of names) {
    if (n === ap || n === current) continue;
    let st; try { st = statSync(join(dir, n)); } catch (e) { continue; }
    if (!st.isDirectory() || st.mtimeMs >= apTime) continue;
    gone.push(n);
    if (!dry) rmSync(join(dir, n), { recursive: true, force: true });
  }
  return gone;
}
