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

/**
 * Did GitHub Pages deploy this commit? The API path of publish.mjs, for a machine that can't reach github.io: the workflow run named
 * "pages build and deployment" whose head_sha is the commit (GET /repos/{o}/{r}/actions/runs?head_sha=). `gh api` when gh is there, else
 * curl with GH_TOKEN. Polls every 20 s up to timeoutMs. Returns {deployed, state, text}; state is "success", "failure", "in_progress",
 * "queued", "none" (no run for that commit yet) or "error" (the API couldn't be asked).
 */
export async function pagesDeployed(owner, repo, sha, { timeoutMs = 900000, everyMs = 20000, onWait = () => {}, ask } = {}) {
  if (!/^[0-9a-f]{7,40}$/i.test(sha || "")) return { deployed: false, state: "error", text: `not a commit sha: "${sha}"` };
  const path = (s) => `repos/${owner}/${repo}/actions/runs?head_sha=${s}&per_page=30`;
  const call = ask || ((p) => {
    try { return sh("gh", ["api", p]); } catch (e) { /* no gh: curl */ }
    return sh("curl", ["-sS", "-m", "30", "-H", `Authorization: Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN || ""}`, "-H", "Accept: application/vnd.github+json", `https://api.github.com/${p}`]);
  });
  const t0 = Date.now();
  let state = "none", note = "";
  for (;;) {
    try {
      const j = JSON.parse(call(path(sha)));
      if (!j.workflow_runs) { state = "error"; note = (j.message || "no workflow_runs in the reply").slice(0, 120); }
      else {
        const runs = j.workflow_runs.filter((r) => /pages build and deployment/i.test(r.name)).sort((x, y) => new Date(y.created_at) - new Date(x.created_at));
        if (!runs.length) state = "none";
        else state = runs[0].status === "completed" ? runs[0].conclusion || "failure" : runs[0].status;
      }
    } catch (e) { state = "error"; note = e.message.slice(0, 120); }
    if (state === "success" || state === "failure" || state === "error" || state === "cancelled") break;
    if (Date.now() - t0 >= timeoutMs) break;
    onWait(`Pages run for ${sha.slice(0, 8)}: ${state}; asking again in ${Math.round(everyMs / 1000)} s`);
    await new Promise((r) => setTimeout(r, Math.min(everyMs, Math.max(1000, timeoutMs - (Date.now() - t0)))));
  }
  const deployed = state === "success";
  const secs = Math.round((Date.now() - t0) / 1000);
  const text = deployed ? `Pages deployed ${sha.slice(0, 8)} (the "pages build and deployment" run succeeded; asked through the GitHub API, ${secs} s)`
    : state === "error" ? `could not ask the GitHub API (${note}): check the pages-build-deployment run for ${sha.slice(0, 8)} (GitHub MCP actions_list) and the site after a hard refresh`
    : `Pages run for ${sha.slice(0, 8)} is "${state}" after ${secs} s (API path): check the run, then the site after a hard refresh`;
  return { deployed, state, text };
}
