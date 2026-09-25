/*
 * Find it, F4: Ali's turn (docs/find-it-design.md D2, D4 moment 2; brief
 * 8.3 task 3). Role reversal: you're Nani. Your list is pictures (you can
 * see it; you say it); Ali stands at the stall and picks what he HEARD, so
 * you see what you said. Level 1: the thing. From level 2, a second moment
 * for how many (the numbers 1-4); level 4 adds the size. A wrong act and
 * Ali looks puzzled and puts it back ("Nar!"), one retry, then the pills.
 * Then Ali packs your bag, with one mistake (he's little): check it
 * against your pictures (the `bag` mechanic).
 *
 * Stars: the voice star (every moment recognised, or a parent's ✓ with a
 * parent; pills never earn it), sharp eyes (the bag's mistake found first
 * time), no help. No ear star: nothing here is heard and chosen.
 * Settings: data/find.json mechanics.ali.levels.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Find = global.Find;
  const V = Find.View;
  const $ = (s) => document.querySelector(s);
  const esc = UI.esc;

  function listCard(wants, now) {
    let card = $("#ali-card");
    if (!card) {
      card = document.createElement("div");
      card.id = "ali-card";
      card.className = "card";
      $("#live").prepend(card);
    }
    card.innerHTML =
      `<div class="ac-head"><img class="ac-face" src="assets/cook/characters/nani-badge.webp" alt=""><b>Your list: tell Ali</b></div>` +
      `<div class="ali-list">${wants
        .map((w, i) => `<div class="ali-pic${w.size ? ` ap-${w.size === "ph-big" ? "big" : "small"}` : ""}${i < now ? " done" : i === now ? " now" : ""}" title="${esc(Cook.data.words[w.noun].english)}"><img alt="" src="${esc(Find.picture(w.noun))}">${w.count > 1 || Find.data.mechanics.ali.showOne ? `<span class="ap-n">${w.count}</span>` : ""}</div>`)
        .join("")}</div>`;
    return card;
  }

  async function run(round) {
    const scene = round.scene;
    const k = round.knobs;
    V.build(scene);
    V.onTap((x, y) => round.tap(x, y));
    const { wants, units } = Find.makeWants(k, scene);
    round.items = await Find.placeItems(scene, units);
    round.items.forEach((it) => V.addItem(it));
    V.openZoom();
    if (!round.alive()) throw new Cook.Abort("left");
    round.noEar = true;
    round.noProgress = true;
    round.rows = wants.map((w) => Find.ladderRow(w));
    round.L = Find.ladder(round.rows);
    const listed = wants.filter((w) => !w.not);
    V.actor(true, { x: 1320, top: 260 });
    UI.gist(Find.data.mechanics.ali.goal, { key: "find-ali" });
    const stall = [...new Set(round.items.map((x) => x.noun))];
    const env = Find.env(scene);
    const live = (noun, size) => round.items.filter((it) => !it.gone && it.noun === noun && (!size || it.size === size));
    for (let i = 0; i < listed.length; i++) {
      const w = listed[i];
      listCard(listed, i);
      // 1. the thing: Ali goes to what he heard (its things twinkle), puzzled if it's not on your list
      await Find.tell(round, {
        choices: Find.Gen.closedSet([w.noun], stall, env, { min: k.choices || 5, max: k.choices || 5 }),
        expected: w.noun,
        caption: i === 0 ? "Tell Ali what to buy. Tap the microphone and say it in Kutchi." : null,
        actor: {
          async act(choice) {
            const its = live(choice);
            V.twinkle(its, true);
            await Cook.wait(650);
            V.twinkle(its, false);
            // not on your list: Ali looks puzzled and puts it back (the pills or "say it again" follow)
            V.actorMood(choice === w.noun ? "pleased" : "puzzled");
            if (choice !== w.noun) Cook.sfx.soft();
          },
        },
        accept: (choice) => choice === w.noun,
      });
      // 2. the size (level 4)
      if (w.size) {
        await Find.tell(round, {
          choices: Find.Gen.SIZES.slice(),
          expected: w.size,
          actor: {
            async act(choice) {
              V.twinkle(live(w.noun, choice), true);
              await Cook.wait(500);
              V.twinkle(live(w.noun, choice), false);
              V.actorMood(choice === w.size ? "pleased" : "puzzled");
            },
          },
          accept: (choice) => choice === w.size,
        });
      }
      // 3. how many (from level 2): he takes as many as he heard
      const n = w.count;
      if (k.numbers) {
        const nums = [1, 2, 3, 4].map((x) => Cook.numId(x));
        await Find.tell(round, {
          choices: nums,
          expected: Cook.numId(w.count),
          actor: {
            act(choice) {
              const m = nums.indexOf(choice) + 1;
              if (m !== w.count) {
                V.actorMood("puzzled");
                return Cook.wait(500);
              }
              V.actorMood("pleased");
            },
          },
          accept: (choice) => choice === Cook.numId(w.count),
        });
      }
      // into the basket
      const its = live(w.noun, w.size).slice(0, n);
      for (const it of its) {
        it.gone = true;
        round.basket.push(it);
        V.fly(it, V.basketSpot(round.basket.length - 1));
        await Cook.wait(160);
      }
      Cook.sfx.right();
    }
    listCard(listed, listed.length);
    // Ali packs your bag, with one mistake: check it against your pictures
    const bag = await Find.checkBag(round, { who: "ali", listed: round.rows });
    round.handOverride = !!bag && bag.misses === 0;
    UI.hideGist();
    V.actor(false);
    const card = $("#ali-card");
    if (card) card.remove();
    return round.finish();
  }
  Find.Mech.define("ali", { run });
  Find.Mech.lab("ali", { name: "Ali's turn", verb: "F4: you say it", mech: "ali", opts: {} });
})(window);
