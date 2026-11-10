// The publish gate (Zafar, 9-10 Nov: one tool per check tier; it replaces decision 89's "no publish while a fixable row is open"):
//   publish.mjs refuses (not --force with his words) unless check-publish (build/tools/tiers/check-publish.mjs, tier 3b) passed on
//   the commit it publishes, or on an earlier one with only the tier result files changed since, and wrote its known-fails list.
//   The open rows are no longer a blocker: they go into the known-fails list, published with it.
// Pure parts here (unit tested in publishgate.test.mjs and build/tools/tiers/tiers.test.mjs); gather() reads the disk and git.
import { readFileSync } from "node:fs";
import { parseRegressions, statusKind, plain, REGRESSIONS } from "../review/lib/regressions.mjs";
import { passedOn, head } from "../tiers/lib.mjs";

// a row that may stay open at a publish says what it waits on
export const WAITS = /\b(?:wait(?:s|ing)?\s+(?:on|for)|needs?)\s+(?:Mum|art|Zafar|his\b|the art|an art run)|two strikes: Zafar|before app store/i;
// Zafar, 21 Oct: every open row carries one label, so "all the art ones" or "all my decisions" is one search
export const LABELS = ["to fix: code", "to fix: check", "waiting on Zafar", "waiting on Mum", "waiting on art", "before app store"];
export function unlabelled(md) {
  return parseRegressions(md).filter((r) => ["open", "reopened"].includes(statusKind(r.status)) && !LABELS.some((l) => plain(r.status).trim().startsWith(l))).map((r) => r.id);
}
export const GAME_FILE = /^(?:js|css|data|assets)\/|^[^/]+\.html$/;

export function rowBlockers(md) {
  return parseRegressions(md).filter((r) => ["open", "reopened"].includes(statusKind(r.status)) && !WAITS.test(plain(r.status))).map((r) => r.id);
}
export function waiting(md) {
  return parseRegressions(md).filter((r) => ["open", "reopened"].includes(statusKind(r.status)) && WAITS.test(plain(r.status))).map((r) => r.id);
}
// pass: the passing check-publish result for this code (lib.mjs passedOn) or null
export function gateProblems({ head: h = "", pass = null } = {}) {
  if (!pass) return [`check-publish has not passed on this commit (${String(h).slice(0, 10)}): node build/tools/tiers/check-publish.mjs (tier 3b; /publish runs it)`];
  if (!Array.isArray(pass.knownFails)) return [`check-publish's result on ${String(pass.commit).slice(0, 10)} has no known-fails list: run it again`];
  return [];
}
// a contract break a fix-list row covers while it waits on Mum, art or Zafar (build/tools/review/data/contract-known.json:
// [{check, flow, row}]) is a known fail of that row, not a new one; the row must still say it waits
export function openBreaks(breaks, known, md) {
  const waits = new Set(parseRegressions(md).filter((r) => WAITS.test(plain(r.status))).map((r) => r.id));
  return breaks.filter((b) => !known.some((k) => k.check === b.check && (k.flow === b.flow || (k.flow.endsWith("*") && b.flow.startsWith(k.flow.slice(0, -1)))) && waits.has(k.row)));
}
export function gather() {
  const md = readFileSync(REGRESSIONS, "utf8");
  const h = head(), pass = passedOn("publish", h);
  return { head: h, pass, waiting: waiting(md), open: rowBlockers(md) };
}
