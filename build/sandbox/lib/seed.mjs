// S14 tools, B11 (SH-168; rows SH-159 the word pill, SH-160 the level-up): a save-seeding driver. The pictures of a learned word's pill, its
// return after a miss and a level-up need a player who has played: "no driver seeds a save for pictures yet" (s14-rules). This opens
// Cook's page, makes the child's save what the profile says through the game's own services (never by writing storage by hand: the
// progress service's pill() and heard(), Cook.save.levelUp, the first-time coaches), waits for the save to land, and leaves it for the
// page the flow goes to next (cook.html or lab.html: one origin, one save).
//
// profiles (the evidence specs' `profile` field; lib/evidence.mjs PROFILES):
//   returning      every first-time help seen, every Cook word heard right five times (the SH-138 returning player)
//   pill-hidden    returning, and the chai words' pills earned: three right in a row (the Kutchi goes, the speaker stays)
//   pill-miss      pill-hidden, then one miss on "paani" (water): its Kutchi is back until one right pick; the others stay hidden
//   levelup-ready  returning, and chai's level count at level 1 with two rounds done (the next round at that level moves it up)
//   levelup-done   returning, and chai's level count already at level 2 (the next self-picked order is the second level's)

export const SEED_PROFILES = {
  returning: "help seen, every word heard right",
  "pill-hidden": "returning, the chai words' pills earned (three right in a row)",
  "pill-miss": "pill-hidden, then a miss on paani: its Kutchi is back",
  "levelup-ready": "returning, chai at level 1 with two rounds done",
  "levelup-done": "returning, chai already at level 2",
};
export const CHAI_WORDS = ["cook-paani", "cook-dudh", "cook-chai", "cook-khun"];
export const isSeedProfile = (p) => Object.prototype.hasOwnProperty.call(SEED_PROFILES, p);

// the in-page work (a function: its source goes to the page)
function seedInPage(profile, chaiWords) {
  const C = window.Cook;
  if (!C || !C.core || !C.core.progress) return { ok: false, why: "Cook's core is not up (open cook.html first)" };
  const P = C.core.progress;
  if (window.njgTest && window.njgTest.cook && window.njgTest.cook.coachesSeen) window.njgTest.cook.coachesSeen();
  // every word the data knows: heard right five times (a returning child: the card's word shows from the start)
  const ids = Object.keys((C.data && C.data.words) || {});
  for (const id of ids) for (let i = 0; i < 5; i++) { C.markSeen(id); C.markRight(id); }
  const out = { ok: true, words: ids.length };
  if (profile === "pill-hidden" || profile === "pill-miss") {
    for (const id of chaiWords) for (let i = 0; i < 3; i++) P.pill(id, { ok: true, firstTry: true });
    if (profile === "pill-miss") P.pill("cook-paani", { ok: false, firstTry: true });
  }
  if (profile === "levelup-ready" || profile === "levelup-done") {
    C.save.levelUp = Object.assign({}, C.save.levelUp, { "chai-tray": profile === "levelup-ready" ? { level: 1, streak: 2 } : { level: 2, streak: 0 } });
  }
  if (C.writeSave) C.writeSave();
  out.pill = Object.fromEntries(chaiWords.map((id) => { const r = (P.get ? P.get(id) : null) || {}; return [id, { run: r.pillRun || 0, earned: !!r.pillEarned, hidden: !!r.pillHidden }]; }));
  out.levelUp = C.save.levelUp || null;
  return out;
}

/**
 * page: a page on cook.html (its title up). Returns what the save holds then ({ok, words, pill: {id: {run, earned, hidden}}, levelUp}).
 * The page may go on to lab.html or play where it is: the save is the one in storage.
 */
export async function seedCook(page, profile) {
  if (!isSeedProfile(profile)) throw new Error(`seedCook: no profile "${profile}" (${Object.keys(SEED_PROFILES).join(", ")})`);
  const r = await page.evaluate(`(${seedInPage})(${JSON.stringify(profile)}, ${JSON.stringify(CHAI_WORDS)})`);
  // the one save writes through a short debounce: leave it a beat before the page goes
  await page.waitForTimeout(500);
  return r;
}
