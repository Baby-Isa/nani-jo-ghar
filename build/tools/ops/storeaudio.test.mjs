import { test } from "node:test";
import assert from "node:assert/strict";
import { releaseStatus, verdict } from "./storeaudio.mjs";

const clip = (approved, checked) => ({ id: "x", speaker: "mum", file: "a.mp3", approved, checked });

test("a store build fails while any playable clip is short of final (Zafar, 12 Nov)", () => {
  const r = releaseStatus([clip("final"), clip("game"), { id: "skip", file: null }]);
  assert.equal(r.playable, 2);
  assert.equal(verdict(r).ok, false);
  assert.match(verdict(r).text, /STORE BUILD BLOCKED: 1 of/);
  assert.equal(verdict(r, { store: false }).ok, true);
});
test("every clip final passes the store gate; a dropped take (redo) never counts", () => {
  const r = releaseStatus([clip("final"), clip("game", "redo")]);
  assert.equal(r.dropped, 1);
  assert.equal(verdict(r).ok, true);
});
test("the game check fails only on a playable clip with no release status", () => {
  assert.equal(verdict(releaseStatus([clip(undefined)]), { store: false }).ok, false);
  assert.equal(verdict(releaseStatus([clip("game"), clip("draft", "redo")]), { store: false }).ok, true);
});
