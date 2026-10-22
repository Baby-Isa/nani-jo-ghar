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

test("the generated labs.html keeps every page the hand-kept page linked (R0's parked and old labels too)", async () => {
  const html = await render();
  const now = links(html);
  const pages = new Set(now.map((h) => h.split("?")[0]));
  assert.equal(before.length, 36);
  // Sprint 10: a game is listed once (the grid's Play button, or Behind the scenes), so the old per-stage and per-game links collapse
  // to their page; no page the old list reached is lost
  for (const h of before) assert.ok(pages.has(h.split("?")[0]), `lost the page of ${h}`);
  assert.ok((html.match(/<em class="tag">parked<\/em>/g) || []).length >= 6, "the six parked modes keep their label");
  assert.equal((html.match(/<em class="tag">old<\/em>/g) || []).length, 5);
});

test("Sprint 10: the top row, the game grid and one folded Behind the scenes; no clinic game or stage listed twice", async () => {
  const html = await render();
  const top = html.slice(html.indexOf('class="top-row"'), html.indexOf("Play any game"));
  assert.deepEqual([...top.matchAll(/<b>([^<]+)<\/b>/g)].map((m) => m[1]), ["New player", "Walkthrough", "The house", "The day builder"]);
  assert.match(top, /id="new-player"/);
  assert.match(top, /href="cook\.html\?app=1&amp;first=pantry&amp;then=cook\.html%3Fapp%3D1%26first%3Dchai%26then%3Dlabs\.html"/, "the walkthrough is Cook's own pantry, then chai chain");
  assert.equal((html.match(/<details/g) || []).length, 1, "one folded section");
  assert.match(html, /<details class="behind" id="behind">\s*<summary>Behind the scenes<\/summary>/);
  const grid = html.slice(html.indexOf("Play any game"), html.indexOf('<details class="behind"'));
  // every Cook station and every clinic game once, each with a picker and a Play button
  for (const g of ["fetch", "chai-tray", "maani-line", "mishkaki-grill", "daar", "chop", "tadka", "stir", "assemble", "samosa"]) assert.equal((grid.match(new RegExp(`data-tpl="lab\\.html\\?mode=cook&amp;game=${g}&amp;level=\\{v\\}"`, "g")) || []).length, 1, `cook ${g} once`);
  for (const g of ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot", "waiting", "diagnosis", "pharmacy", "sendoff"]) assert.equal((grid.match(new RegExp(`data-tpl="lab\\.html\\?mode=clinic&amp;game=${g}&amp;level=\\{v\\}"`, "g")) || []).length, 1, `clinic ${g} once`);
  assert.ok((grid.match(/<a class="play"/g) || []).length >= 30);
  for (const d of ["day.html?stages=door:", "day.html?stage=ride", "day.html?stage=book"]) assert.ok(grid.includes(d), d);
  // the clinic's games are not also listed as lab-bar, heal-host or stage links
  const all = links(html);
  for (const g of ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"]) {
    const ways = all.filter((h) => new RegExp(`[?&]game=${g}(&|$)`).test(h) && /clinic/.test(h));
    assert.ok(ways.length <= 2, `${g} listed ${ways.length} ways: ${ways.join(" ")}`);
  }
  assert.equal(all.filter((h) => h.startsWith("clinic.html?lab=1&stage=")).length, 0, "the old per-stage lab-bar links are gone");
});

test("labs.html on disk is what the generator writes (never hand-edited, never stale)", () => {
  const out = execFileSync("node", [fileURLToPath(new URL("../gen_labs.mjs", import.meta.url)), "--check"]).toString();
  assert.match(out, /up to date/);
});

test("Sprint 11 (Zafar, 22 Oct): New player is a toggle; on, every launch plays a reset New player; off, the own player, never wiped", async () => {
  const { labsPlayer } = await import("../gen_labs.mjs");
  const { createRequire } = await import("node:module");
  const Save = createRequire(import.meta.url)("../../js/shared/save.js");
  Save.use(Save.memoryStore());
  const store = Save.memoryStore();
  const own = Save.addPlayer({ name: "Zafar" });
  Save.set("words", { "n.tea": { understand_stage: 4 } });
  const L = labsPlayer(Save, store);
  assert.equal(L.on(), false);
  assert.equal(L.label(), "Zafar");
  assert.equal(L.launch().id, own.id, "off: his own player");
  L.setOn(true);
  const a = L.launch();
  assert.equal(a.name, "New player");
  assert.notEqual(a.id, own.id);
  Save.set("words", { "n.tea": { understand_stage: 3 } });
  Save.set("ui", { onboarded: { "cook/fetch": true } });
  const b = L.launch();
  assert.equal(b.id, a.id, "made once");
  assert.deepEqual(Save.get("words"), {}, "reset before every launch: no words known");
  assert.deepEqual(Save.get("ui"), {}, "every onboarding again");
  assert.equal(Save.players().filter((p) => p.name === "New player").length, 1);
  L.setOn(false);
  assert.equal(L.launch().id, own.id, "off again: back to his own player");
  assert.equal(Save.get("words", own.id)["n.tea"].understand_stage, 4, "his own player is never wiped");
  const html = await render();
  assert.match(html, /<label class="top toggle" id="new-player"><input type="checkbox" id="new-player-toggle">/);
  assert.match(html, /id="player-badge"/);
  assert.ok(html.includes(labsPlayer.toString()), "the page runs the tested code");
});

test("every moved mode's lab() entries are listed, with story and free play; every page a link names exists", async () => {
  const html = await render();
  const now = links(html);
  for (const h of ["lab.html?mode=demo&game=pantry&level=1", "lab.html?mode=demo&game=scrape&level=1", "lab.html?mode=demo&level=1", "lab.html?mode=demo&play=story&arc=demo&chapter=1&errand=helper", "lab.html?mode=demo&play=free"]) assert.ok(now.includes(h), h);
  for (const h of now) assert.ok(existsSync(ROOT + h.split("?")[0]), `no page ${h}`);
});
