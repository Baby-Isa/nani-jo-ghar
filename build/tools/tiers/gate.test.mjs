// The gate's lists and its reading of a contract run (Sprint 20 P3). node --test build/tools/tiers/gate.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadLists, splitBreaks, judgeContract, finalLine } from "./gate.mjs";
import { ROOT } from "../review/lib/common.mjs";
import { CHECKS } from "../../sandbox/lib/contract.mjs";

const lists = loadLists();

test("every contract check is in exactly one list; no list names a check that does not exist", () => {
  const b = Object.keys(lists.blocking), ad = Object.keys(lists.advisory);
  assert.deepEqual(b.filter((k) => ad.includes(k)), [], "in both lists");
  const neither = Object.keys(CHECKS).filter((k) => !b.includes(k) && !ad.includes(k));
  assert.deepEqual(neither, [], "in neither list (add it to one, with Zafar's yes for any move)");
  assert.deepEqual([...b, ...ad].filter((k) => !CHECKS[k]), [], "named but not a check");
});

test("the advisory list is the 18 that broke in s19-r2-gate, each with a reason", () => {
  assert.equal(Object.keys(lists.advisory).length, 18);
  for (const [k, why] of Object.entries(lists.advisory)) assert.ok(why.length > 20, k);
  assert.ok(/Zafar's written yes/.test(lists._about));
});

test("a blocking break fails; an advisory break does not; a check in neither list blocks", () => {
  const page = { flow: "cook:chai-tray", size: "740x320", complete: true, errors: [] };
  const adv = { check: "contract-114", item: "no-snap", flow: "cook:chai-tray", size: "740x320", measured: "x" };
  const blk = { check: Object.keys(lists.blocking)[0] };
  assert.equal(judgeContract({ pages: [page], breaks: [adv] }, lists, 1).problems.length, 0);
  assert.equal(judgeContract({ pages: [page], breaks: [adv] }, lists, 1).advisoryTotal, 1);
  assert.equal(judgeContract({ pages: [page], breaks: [{ ...blk, flow: "f", size: "s", measured: "m" }] }, lists, 1).problems.length, 1);
  assert.equal(splitBreaks([{ check: "contract-9999" }], lists).unknown.length, 1);
});

test("a page that did not end, a page error, or fewer pages than asked is a failure", () => {
  const ok = { flow: "f", size: "s", complete: true, errors: [] };
  assert.equal(judgeContract({ pages: [{ ...ok, complete: false }], breaks: [] }, lists, 1).problems.length, 1);
  assert.equal(judgeContract({ pages: [{ ...ok, errors: ["boom"] }], breaks: [] }, lists, 1).problems.length, 1);
  assert.equal(judgeContract({ pages: [ok], breaks: [] }, lists, 2).problems.length, 1);
  assert.equal(judgeContract({ pages: [ok], breaks: [] }, lists, 1).problems.length, 0);
});

test("the final line", () => {
  assert.equal(finalLine(["chai-tray"], [{ id: "checks", ok: true, minutes: 3 }, { id: "contract", ok: false, minutes: 9.5 }], false, 12.5), "GATE FAIL chai-tray: checks pass 3, contract FAIL 9.5; 12.5 min");
});
