// ART-74 (probes-open, run 16): the raw ChatGPT upload folders (assets/ChatGPT 261110 1, assets/ChatGPT 261110 2 and their kin,
// 230 MB) are not in the site's assets: every image is kept under sources/art/. Reads the git tree of a ref (default HEAD; the
// publish puts this tree on main), so it can be shown red on an older commit:  node build/test_no_upload_folders.mjs [ref]
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ref = process.argv[2] || "HEAD";
const dirs = execFileSync("git", ["ls-tree", "-d", "--name-only", ref, "assets/"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
const bad = dirs.filter((d) => /^assets\/ChatGPT\b/i.test(d));
if (bad.length) { console.error(`FAIL ${ref}: upload folders in assets/: ${bad.join(", ")}`); process.exit(1); }
console.log(`ok ${ref}: no ChatGPT upload folder in assets/ (${dirs.length} folders)`);
