#!/usr/bin/env node
// Publish: bump_version -> commit -> push the branch and HEAD:main -> wait for GitHub Pages to serve the new stamp -> screenshot the live labs page.
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { ROOT, args, help, die, sh, git, gitSoft, branch, logLine } from "./lib.mjs";

const HELP = `
node build/tools/ops/publish.mjs [--go] [--site URL] [--timeout 900] [--allow-dirty] [--log] [--trailer TEXT]
  Dry run by default: checks the branch, the tree, whether origin/main is already in this branch, what bump_version would
  stamp and how many commits would reach main; prints the steps; changes nothing and uses no network beyond git fetch.
  --go publishes (rules B7-B9; only when Zafar has approved publishing):
    1. python3 build/bump_version.py, commit "Publish: version <stamp>"
    2. git push -u origin <branch>, then git push origin HEAD:main (network errors retried at 2, 4, 8, 16 s)
    3. polls <site>/js/version.js every 20 s until it serves the new stamp (--timeout seconds, default 900)
    4. screenshots <site>/labs.html at 1366x768 into build/screenshots/publish/<stamp>-labs.png: look at it before telling Zafar
  --site     the Pages URL (default from the origin remote: https://<owner>.github.io/<repo>)
  --trailer  the commit's closing lines (default: Co-Authored-By, plus Claude-Session when
             CLAUDE_CODE_REMOTE_SESSION_ID is set; pass the session's own lines to be sure)
  --log      append one line to docs/process/overnight-log.md
  If origin/main has commits this branch lacks, it stops: merge origin/main, take the real side of any ?v= conflict, re-run.
  If this container can't reach github.io, step 3 says so: check the pages-build-deployment run for the commit instead
  (GitHub MCP actions_list) and look at the site in a browser after a hard refresh.`;
const a = args(); help(HELP, a);
const GO = a.has("go"), br = branch();
const remote = gitSoft("remote", "get-url", "origin");
const m = /github\.com[/:]([^/]+)\/([^/.]+)/.exec(remote) || /\/git\/([^/]+)\/([^/.]+)/.exec(remote);
const SITE = (a.val("site") || (m ? `https://${m[1].toLowerCase()}.github.io/${m[2]}` : "")).replace(/\/$/, "");
const say = (s) => console.log(s);

// ---- preflight
if (!br || br === "HEAD") die("Detached HEAD: check out the working branch first.");
if (br === "main") die("On main: publish from the working branch (B7).");
gitSoft("fetch", "-q", "origin", "main");
const dirty = gitSoft("status", "--porcelain").split("\n").filter(Boolean);
const behind = +gitSoft("rev-list", "--count", "HEAD..origin/main") || 0, ahead = +gitSoft("rev-list", "--count", "origin/main..HEAD") || 0;
const stampNow = sh("python3", ["build/bump_version.py", "--check"]);
const dry = sh("python3", ["build/bump_version.py", "--dry-run"]);
const files = (dry.split(": ")[1] || "").split(", ").filter(Boolean).length;
say(`${GO ? "PUBLISH" : "DRY RUN"}: branch ${br}, ${ahead} commit(s) would reach main, origin/main ${behind ? `has ${behind} commit(s) this branch lacks` : "already in this branch"}`);
say(`  tree: ${dirty.length ? `${dirty.length} uncommitted change(s) (${dirty.slice(0, 3).map((x) => x.slice(3)).join(", ")}${dirty.length > 3 ? ", ..." : ""})` : "clean"}`);
say(`  version: live stamp in this branch ${stampNow}; bump would rewrite ${files} files`);
say(`  site: ${SITE || "unknown (pass --site)"}`);
const problems = [];
if (behind) problems.push("merge origin/main first (git merge origin/main; on ?v= conflicts take the real side; then re-run)");
if (dirty.length && !a.has("allow-dirty")) problems.push("commit or stash the uncommitted changes (or --allow-dirty to include them in the publish commit)");
if (!ahead) problems.push("nothing to publish: main already has this branch");
if (!GO) {
  say("Steps --go would run: bump_version -> commit -> push branch -> push HEAD:main -> poll js/version.js -> screenshot labs.html");
  say(problems.length ? `Blockers: ${problems.join("; ")}` : "Ready: re-run with --go once Zafar has approved publishing.");
  process.exit(0);
}
if (problems.length) die(`Not publishing: ${problems.join("; ")}`);

// ---- 1. bump and commit
sh("python3", ["build/bump_version.py"]);
const stamp = sh("python3", ["build/bump_version.py", "--check"]);
git("add", "-A");
// the attribution lines the session's system prompt gives (CLAUDE.md, Git and publishing)
const sid = process.env.CLAUDE_CODE_REMOTE_SESSION_ID || process.env.CLAUDE_CODE_SESSION_ID || "";
const trailer = a.val("trailer") || `Co-Authored-By: Claude <noreply@anthropic.com>${sid.startsWith("session_") ? `\nClaude-Session: https://claude.ai/code/${sid}` : ""}`;
git("commit", "-q", "-m", `Publish: version ${stamp}\n\n${trailer}`);
const sha = git("rev-parse", "HEAD");
say(`1. bumped to ${stamp}, commit ${sha.slice(0, 8)}`);

// ---- 2. push, retrying network errors
async function push(...ref) {
  for (const wait of [0, 2, 4, 8, 16]) {
    if (wait) { say(`   push failed, retrying in ${wait} s`); await new Promise((r) => setTimeout(r, wait * 1000)); }
    try { git("push", ...ref); return; } catch (e) { if (!/network|timed out|unable to access|RPC failed|Connection|reset/i.test(e.message)) throw e; }
  }
  throw new Error(`push ${ref.join(" ")} failed after retries`);
}
await push("-u", "origin", br);
await push("origin", "HEAD:main");
say(`2. pushed ${br} and HEAD:main (${sha.slice(0, 8)})`);

// ---- 3. wait for Pages
const t0 = Date.now(), limit = +a.val("timeout", 900) * 1000;
let live = null, reach = true;
while (Date.now() - t0 < limit) {
  try {
    const r = await fetch(`${SITE}/js/version.js?nocache=${Date.now()}`, { cache: "no-store" });
    live = (/const V = "([^"]+)"/.exec(await r.text()) || [])[1] || null;
    if (live === stamp) break;
  } catch (e) { reach = false; break; }
  await new Promise((r) => setTimeout(r, 20000));
}
const ok = live === stamp;
say(`3. Pages: ${ok ? `serving ${stamp} after ${Math.round((Date.now() - t0) / 1000)} s` : reach ? `still serving ${live || "?"} after ${a.val("timeout", 900)} s: check the pages-build-deployment run` : "github.io not reachable from here: check the pages-build-deployment run for this commit, then the site after a hard refresh"}`);

// ---- 4. screenshot the live labs page
if (ok) {
  try {
    const require = createRequire(import.meta.url);
    let pw; try { pw = require("playwright"); } catch { pw = require(join(sh("npm", ["root", "-g"]), "playwright")); }
    const browser = await pw.chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(`${SITE}/labs.html?v=${stamp}`, { waitUntil: "networkidle", timeout: 60000 });
    const dir = join(ROOT, "build", "screenshots", "publish"); mkdirSync(dir, { recursive: true });
    const shot = join(dir, `${stamp}-labs.png`);
    await page.screenshot({ path: shot, fullPage: true });
    await browser.close();
    say(`4. screenshot build/screenshots/publish/${stamp}-labs.png: look at it before telling Zafar`);
  } catch (e) { say(`4. screenshot failed (${e.message.split("\n")[0]}): open ${SITE}/labs.html yourself`); }
}
if (a.has("log")) say(`Logged: ${logLine(`Published ${stamp} to main (${sha.slice(0, 8)}); Pages ${ok ? "serving it" : "not confirmed"}.`)}`);
