// build/gen_labs.mjs: labs.html is generated from every moved mode's lab() list plus the static list of modes not
// yet moved. It keeps every link the hand-kept page had, and it is never stale. Run: node --test build/host/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { render } from "../gen_labs.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const before = readFileSync(new URL("./fixtures/labs-links-before.txt", import.meta.url), "utf8").split("\n").filter((l) => l && !l.startsWith("#"));
const links = (html) => [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));

test("the generated labs.html keeps every link the hand-kept page had (R0's parked and old labels too)", async () => {
  const html = await render();
  const now = links(html);
  assert.equal(before.length, 36);
  for (const h of before) assert.ok(now.includes(h), `lost ${h}`);
  assert.equal((html.match(/<em class="tag">parked<\/em>/g) || []).length, 6);
  assert.equal((html.match(/<em class="tag">old<\/em>/g) || []).length, 5);
});

test("labs.html on disk is what the generator writes (never hand-edited, never stale)", () => {
  const out = execFileSync("node", [fileURLToPath(new URL("../gen_labs.mjs", import.meta.url)), "--check"]).toString();
  assert.match(out, /up to date/);
});

test("every moved mode's lab() entries are listed, with story and free play; every page a link names exists", async () => {
  const html = await render();
  const now = links(html);
  for (const h of ["lab.html?mode=demo&game=pantry&level=1", "lab.html?mode=demo&game=scrape&level=1", "lab.html?mode=demo&level=1", "lab.html?mode=demo&play=story&arc=demo&chapter=1&errand=helper", "lab.html?mode=demo&play=free"]) assert.ok(now.includes(h), h);
  for (const h of now) assert.ok(existsSync(ROOT + h.split("?")[0]), `no page ${h}`);
});
