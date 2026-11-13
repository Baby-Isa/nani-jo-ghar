#!/usr/bin/env node
// The byte proof of a rename (s19-night-art; build/reports/s19-art-rename-plan.md "Proof"): two load checks of the same pages, one
// before the rename and one after (node build/tools/review/loadcheck.mjs --only cook:<k> --json <file>), must load the same pictures
// by content (the same multiset of content hashes on every page), every renamed picture under its first name's hash, and no picture that
// does not exist. Exit 0 when they agree, 1 otherwise.
//   node build/tools/art/byteproof.mjs <before.json> <after.json> [--pages cook:samosa,...]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function compare(before, after, pages = null) {
  const out = { pages: [], ok: true };
  for (const id of pages || Object.keys(after)) {
    const b = before[id], a = after[id];
    if (!b || !a) { out.pages.push({ id, ok: false, why: `${!b ? "no before" : "no after"} for ${id}` }); out.ok = false; continue; }
    const hs = (x) => Object.values(x.hashes || {}).map((h) => h || "missing").sort();
    const hb = hs(b), ha = hs(a);
    const same = hb.length === ha.length && hb.every((h, i) => h === ha[i]);
    const newMissing = (a.missing || []).filter((u) => !(b.missing || []).includes((a.first || {})[u] || u));
    const renamed = Object.keys(a.first || {}).length;
    // a renamed picture's hash is its first name's hash before
    const wrong = Object.entries(a.first || {}).filter(([u, f]) => b.hashes && b.hashes[f] && b.hashes[f] !== a.hashes[u]).map(([u]) => u);
    const ok = same && !newMissing.length && !wrong.length;
    if (!ok) out.ok = false;
    out.pages.push({ id, ok, pictures: ha.length, renamed, why: ok ? "" : [!same ? `content differs (${hb.length} before, ${ha.length} after)` : "", newMissing.length ? `missing: ${newMissing.join(", ")}` : "", wrong.length ? `changed bytes: ${wrong.join(", ")}` : ""].filter(Boolean).join("; ") });
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2);
  const files = argv.filter((x) => !x.startsWith("--") && argv[argv.indexOf(x) - 1] !== "--pages");
  const pi = argv.indexOf("--pages");
  const r = compare(JSON.parse(readFileSync(files[0], "utf8")), JSON.parse(readFileSync(files[1], "utf8")), pi >= 0 ? argv[pi + 1].split(",") : null);
  for (const p of r.pages) console.log(`${p.ok ? "same" : "DIFF"} ${p.id.padEnd(22)} ${p.pictures ?? "-"} pictures, ${p.renamed ?? 0} by their new names${p.why ? `: ${p.why}` : ""}`);
  console.log(`byteproof: ${r.pages.filter((p) => p.ok).length}/${r.pages.length} pages load the same pictures byte for byte`);
  process.exit(r.ok ? 0 : 1);
}
