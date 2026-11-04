// SH-207 (Zafar, 4 Nov): the word ladder changes only between games: a frozen progress service reads the words as they were when
// the game began; its writes still reach the save and show once it thaws (the end screen, the next game)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createProgress } from "../../js/core/progress.js";
import { createSave } from "../../js/core/save.js";

const progressData = JSON.parse(readFileSync(new URL("../../data/progress.json", import.meta.url), "utf8"));
const make = () => {
  const Save = createSave({});
  Save.use(Save.memoryStore());
  return createProgress({ save: Save, data: progressData, followCook: false });
};

test("a word earning its pill mid-game keeps its Kutchi until the game ends", () => {
  const P = make();
  P.freeze();
  for (let i = 0; i < 5; i++) P.pill("cook-dudh", { ok: true }, 3);
  assert.equal(P.pillShows("cook-dudh"), true, "frozen: still shown as at the start");
  assert.equal(P.live()["cook-dudh"].pillHidden, true, "but recorded in the save");
  P.thaw();
  assert.equal(P.pillShows("cook-dudh"), false, "thawed: the next game hides it");
});

test("a word first met mid-game reads as new until the game ends", () => {
  const P = make();
  P.freeze();
  P.meet("cook-aadu");
  assert.equal(P.get("cook-aadu").seen || 0, 0);
  P.thaw();
  assert.ok((P.get("cook-aadu").seen || 0) > 0);
});

test("freezing again takes the latest words", () => {
  const P = make();
  P.freeze();
  for (let i = 0; i < 3; i++) P.pill("cook-chai", { ok: true }, 3);
  P.freeze();
  assert.equal(P.pillShows("cook-chai"), false);
});
