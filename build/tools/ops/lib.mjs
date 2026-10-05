// Shared helpers for the ops tools: the review tools' argument parsing and paths, plus git, the UK clock and the overnight log.
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
export { ROOT, rel, args, help, die, more } from "../review/lib/common.mjs";
import { ROOT } from "../review/lib/common.mjs";

export const OPS = join(ROOT, "build", "tools", "ops");
export const LOG = join(ROOT, "docs", "process", "overnight-log.md");
export const STATUS = join(ROOT, "docs", "status.md");

// run a command in the repo; returns stdout trimmed ("" on failure when soft)
export function sh(cmd, argv = [], { soft = false, input } = {}) {
  try {
    return execFileSync(cmd, argv, { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], input, maxBuffer: 64 << 20 }).trim();
  } catch (e) {
    if (soft) return "";
    throw new Error(`${cmd} ${argv.join(" ")} failed: ${(e.stderr || e.message || "").toString().trim().split("\n").slice(-3).join(" | ")}`);
  }
}
export const git = (...a) => sh("git", a);
export const gitSoft = (...a) => sh("git", a, { soft: true });
export const branch = () => gitSoft("rev-parse", "--abbrev-ref", "HEAD");

// "2026-10-05 19:09" in UK time
export function ukStamp(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}
// a UK "YYYY-MM-DD HH:MM" back to a Date (BST/GMT worked out by trying both offsets)
export function fromUk(s) {
  const m = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d)/.exec(s);
  if (!m) return null;
  for (const off of [1, 0]) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - off, +m[5]));
    if (ukStamp(d) === `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`) return d;
  }
  return null;
}
// append one line to the overnight log (append only)
export function logLine(text) {
  const line = `- ${ukStamp()} UK · ${text.replace(/\s+/g, " ").trim()}`;
  const cur = readFileSync(LOG, "utf8");
  appendFileSync(LOG, (cur.endsWith("\n") ? "" : "\n") + line + "\n");
  return line;
}
export const readText = (p) => readFileSync(p, "utf8");
