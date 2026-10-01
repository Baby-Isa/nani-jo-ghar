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
