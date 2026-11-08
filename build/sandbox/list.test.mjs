// run.mjs --list is whole under load (s19-checks audit, 8 Nov): its lines and then process.exit() cut the list short when several ran at
// once (341-372 of 399 lines), so evidence.mjs --lint-specs, inside a concurrent checks.mjs, read real flows as missing and failed.
// Six lists at once must all be whole. Run: node --test build/sandbox/list.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const RUN = fileURLToPath(new URL("./run.mjs", import.meta.url));
const list = () => new Promise((res, rej) => execFile(process.execPath, [RUN, "--list"], { maxBuffer: 1 << 26 }, (e, out) => (e ? rej(e) : res(out))));

test("six run.mjs --list at once are all whole, ending with the viewports line", async () => {
  const outs = await Promise.all(Array.from({ length: 6 }, list));
  const n = outs.map((o) => o.split("\n").length);
  assert.equal(new Set(n).size, 1, `line counts ${n}`);
  for (const o of outs) assert.match(o, /\nviewports \("all sizes"\): .*\n$/);
});
