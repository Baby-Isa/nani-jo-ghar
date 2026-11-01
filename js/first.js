/*
 * The first launch page (first.html): the story player with this page's own
 * scene, making the character. Where the player is lives in their save, so a
 * reload (or coming back from a Cook round) carries on from the same scene.
 */
(function (global) {
  "use strict";
  const Save = global.Save;
  const C = global.Character;
  const Story = global.Story;
  const host = document.getElementById("story");
  Save.init();
  const me = Save.ensurePlayer();
  // the corner ⌂ stays away during the first launch (the house comes at the end)
  document.documentElement.classList.add("njg-first");

  let choices = (C.get() || {}).choices || null;
  let leaving = false;
  global.addEventListener("beforeunload", () => (leaving = true));
  global.addEventListener("pagehide", () => (leaving = true));
  Story.setChild((view) => (C.options() ? C.svg(choices || C.defaults(), { view: view === "badge" ? "badge" : undefined }) : ""));

  // SHARED-6 (sweep, 1 Nov): the family's clip list (data/family-audio.json) starts now, with the character's pictures, not after
  // the story's first line asks for its clip; FamilyVoice.load caches one promise on root.njgFamilyAudio, so the story's own
  // load() and js/core/voice.js share the one fetch (CK-48). Nothing waits for it here: the first scene shows as soon as it did
  if (global.FamilyVoice) global.FamilyVoice.load().catch(() => {});
  // the character is drawn in every scene: have its pictures ready first
  C.load()
    .catch(() => {})
    .then(() =>
      Story.play("data/story/first-launch.json", {
        el: host,
        kinds: {
          async character() {
            const done = await global.CharMaker.open(host, { choices });
            choices = done;
            // the record keeps the Cook hands too (player-boy / player-girl), for when Cook's hands read it
            C.put(done);
          },
        },
      }),
    )
    .catch((e) => {
      // (a fetch cut off because the page is going somewhere else isn't an error)
      if (!leaving) console.error(e);
    });
  global.__first = { player: () => me.id };
})(window);
