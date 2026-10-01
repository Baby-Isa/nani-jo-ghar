// node --test build/sandbox/baseline.test.mjs : the ratchet's logic, no browser.
import test from "node:test";
import assert from "node:assert/strict";
import { flatten, compare } from "./lib/baseline.mjs";

const run = (flow, size, complete, findings) => ({ flow, size, complete, errors: [], states: [{ name: "s1", page: "x.html", findings }] });
const f = (check, selector) => ({ check, selector, measured: "1px", text: "" });

test("a finding is new only if its check, flow, size and selector are not in the baseline", () => {
  const base = { ...flatten([run("a", "1366x768", true, [f("tap-small", "button#x"), f("text-small", "span.y")])]) };
  const cur = flatten([run("a", "1366x768", true, [f("tap-small", "button#x"), f("tap-small", "button#new")])]);
  const c = compare(base, cur, new Set(["a@1366x768"]));
  assert.deepEqual(c.added.map((x) => x.selector), ["button#new"]);
  assert.deepEqual(c.fixed.map((x) => x.selector), ["span.y"]);
});

test("the same selector at another size is a different finding; flows outside the run are ignored", () => {
  const base = flatten([run("a", "1366x768", true, [f("tap-small", "button#x")]), run("b", "1366x768", true, [f("tap-small", "button#z")])]);
  const cur = flatten([run("a", "800x360", true, [f("tap-small", "button#x")])]);
  const c = compare(base, cur, new Set(["a@800x360"]));
  assert.equal(c.added.length, 1);
  assert.equal(c.fixed.length, 0); // nothing of the baseline was in this run's scope
});

test("a flow that reached its end and now stops short fails the check", () => {
  const base = flatten([run("a", "1366x768", true, [])]);
  const cur = flatten([run("a", "1366x768", false, [])]);
  assert.deepEqual(compare(base, cur, new Set(["a@1366x768"])).incomplete, ["a@1366x768"]);
});

test("a known selector turning up in another flow is moved, not new; a fixed one is dropped only if it is gone everywhere", () => {
  const base = flatten([run("a", "1366x768", true, [f("tap-small", "button#x")]), run("b", "1366x768", true, [f("text-small", "span.y")])]);
  const cur = flatten([run("a", "1366x768", true, [f("text-small", "span.y")]), run("b", "1366x768", true, [])]);
  const c = compare(base, cur, new Set(["a@1366x768", "b@1366x768"]));
  assert.deepEqual(c.added, []);
  assert.deepEqual(c.moved.map((x) => x.selector), ["span.y"]);
  assert.deepEqual(c.fixed.map((x) => x.selector), ["button#x"]); // span.y (flow b) is not fixed: it is still there, in flow a
});

import { append } from "./lib/baseline.mjs";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("a page the baseline has never seen is reported; one that does not reach its end fails", () => {
  const base = flatten([run("a", "1366x768", true, [])]);
  const cur = flatten([run("a", "1366x768", true, []), run("b", "1366x768", true, []), run("c", "1366x768", false, [])]);
  const c = compare(base, cur, new Set(["a@1366x768", "b@1366x768", "c@1366x768"]));
  assert.deepEqual(c.unbaselined.sort(), ["b@1366x768", "c@1366x768"]);
  assert.deepEqual(c.newIncomplete, ["c@1366x768"]);
});

test("append adds the findings and pages the baseline lacks and changes nothing that is there", () => {
  const dir = mkdtempSync(join(tmpdir(), "njg-base-"));
  {
    const base = flatten([run("a", "1366x768", true, [f("tap-small", "button#x")])]);
    // an existing flow-size gains a finding of a new kind; a new flow-size appears
    const cur = flatten([run("a", "1366x768", true, [f("tap-small", "button#x"), f("covered", "button#y")]), run("b", "800x360", true, [f("text-small", "span.z")])]);
    const out = append({ version: 1, generated: "then", flows: base.flows, findings: base.findings.map((x) => ({ key: x.key, measured: x.measured })) }, cur, { path: join(dir, "b.json") });
    assert.equal(out.added, 2);
    assert.equal(out.generated, "then");
    assert.deepEqual(out.findings.map((x) => x.key).sort(), ["covered|a|1366x768|button#y", "tap-small|a|1366x768|button#x", "text-small|b|800x360|span.z"]);
    assert.deepEqual(Object.keys(out.flows).sort(), ["a@1366x768", "b@800x360"]);
    assert.deepEqual(out.flows["a@1366x768"], base.flows["a@1366x768"]); // untouched
    const written = JSON.parse(readFileSync(join(dir, "b.json"), "utf8"));
    assert.equal(written.findings.length, 3);
  }
});
