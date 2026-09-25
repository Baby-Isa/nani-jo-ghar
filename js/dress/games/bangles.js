/*
 * G4 Bangles (design D.2; the first spoken number). Ma's wrist, close up;
 * "Muke trae [red] khape. Ne bo [gold]." The tray has a column per colour,
 * every column the same height (the tray never says how many). Tap a
 * column to slide the next bangle on; tap one on her wrist to take it off.
 * Done: Ma checks. Then "say how many" (design D.4): Ma holds up her wrist
 * and asks "[How many?]" about one colour; the child counts and says the
 * number aloud (hikdo..panj, real Kutchi). She jingles her wrist as many
 * times as she heard. Pills and a grown-up's tick are always there.
 * Mechanics: pick, count, wear, check, say.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const Doll = Dress.Doll;
  const M = Dress.Mech;
  const G = (Dress.Games = Dress.Games || {});
  const T = () => Dress.scene.table;

  function draw(r, { point = null } = {}) {
    const box = T().bangleTray;
    const arm = T().wrist;
    const cols = [...new Set(r.rack.areas.tray.map((b) => b.col))].sort((a, b) => a - b);
    const cw = box.w / cols.length;
    let h = `<rect x="0" y="0" width="1600" height="900" fill="#e4d3bb"/><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="24" fill="#8f3e37" stroke="#5b2a24" stroke-width="5"/>`;
    const onWrist = r.state.wears.filter((w) => w.slot === "wrist");
    cols.forEach((col) => {
      const mine = r.rack.areas.tray.filter((b) => b.col === col);
      const left = mine.filter((b) => !onWrist.some((w) => w.item.id === b.id));
      const x = box.x + col * cw + cw / 2;
      const colour = mine[0].colour;
      h += `<g class="it col" data-act="take" data-col="${col}" data-colour="${colour}" data-kind="ph-bangle"><rect x="${x - cw / 2 + 6}" y="${box.y + 10}" width="${cw - 12}" height="${box.h - 20}" rx="16" fill="rgba(0,0,0,.12)"/><rect x="${x - 6}" y="${box.y + 60}" width="12" height="${box.h - 120}" rx="6" fill="#d9c7a8"/>`;
      left.forEach((b, i) => (h += Doll.flat("ph-bangle", colour, x - 70, box.y + box.h - 140 - i * 64, 140, 110)));
      h += `</g>`;
    });
    h += Doll.arm(arm);
    onWrist.forEach((w, i) => (h += Doll.wristBangle(arm, i, w.item.colour, w.item.id).replace('class="wb"', `class="wb it" data-act="back"`)));
    if (point) {
      onWrist.forEach((w, i) => {
        if (w.item.colour !== point) return;
        h += `<circle class="ping" cx="${arm.x + arm.w * 0.36 + i * 26}" cy="${arm.y + arm.h * 0.5 - arm.h * 0.26}" r="10" fill="#ffd98a" stroke="#5b4a3c" stroke-width="2"/>`;
      });
    }
    r.draw(h);
    expectNext(r);
  }

  function expectNext(r) {
    if (r.busy || r.phase !== "place") return;
    const on = r.state.wears.filter((w) => w.slot === "wrist");
    const rows = r.rows;
    const extra = on.find((w) => !rows.some((x) => x.colour === w.item.colour));
    if (extra) return r.expect({ kind: "tap", sel: `#scene [data-act="back"][data-id="${extra.item.id}"]` });
    for (const row of rows) {
      const mine = on.filter((w) => w.item.colour === row.colour);
      if (mine.length > row.count) return r.expect({ kind: "tap", sel: `#scene [data-act="back"][data-id="${mine[mine.length - 1].item.id}"]` });
      if (mine.length < row.count) return r.expect({ kind: "tap", sel: `#scene [data-act="take"][data-colour="${row.colour}"]` });
    }
    r.expect({ kind: "tap", sel: "#dress-done" });
  }

  G.bangles = {
    async run(r) {
      r.phase = "place";
      r.cardHidden = r.round.hideCard;
      r.onTap((act, d) => {
        if (r.phase !== "place") return;
        if (act === "take") {
          const on = new Set(r.state.wears.map((w) => w.item.id));
          const next = r.rack.areas.tray.filter((b) => b.colour === d.colour && !on.has(b.id)).pop();
          if (next && r.state.wears.length < 14) M.wear.put(r, { who: "ma", slot: "wrist", item: next });
        } else if (act === "back") {
          const w = r.state.wears.find((x) => x.item.id === d.id);
          if (w) M.wear.off(r, w);
        }
        draw(r);
      });
      r.redraw = () => draw(r);
      draw(r);
      const g = await M.check.run(r, { grade: (st) => Dress.Grade.check(r.round, st) });
      r.phase = "say";
      let said = null;
      const sy = r.round.say;
      if (sy) {
        draw(r, { point: sy.colour });
        // on her wrist now (after the check): how many of that colour really are there?
        const answer = r.state.wears.filter((w) => w.item.colour === sy.colour).length;
        if (answer >= 1 && answer <= sy.choices.length) {
          said = await M.say.run(r, {
            choices: sy.choices,
            answer,
            who: "ma",
            prompt: Lang.join([Lang.line("dress-howmany"), Lang.bare({ segs: Lang.word(sy.colour), en: Cook.english(sy.colour) })]),
            act: async (choice) => {
              const n = sy.choices.indexOf(choice) + 1;
              for (let i = 0; i < n; i++) {
                if (Cook.sfx.tick) Cook.sfx.tick();
                else if (Cook.sfx.pop) Cook.sfx.pop();
                await Dress.wait(220).catch(() => {});
              }
              await r.say(Lang.numLine(n), { who: "ma", ms: 700 });
            },
          });
          r.state.voice = said.voice;
          r.state.sayVia = said.via;
        }
      }
      draw(r);
      await r.say(Lang.line("dress-lovely"), { who: "ma", ms: 900 });
      return { grade: g, said };
    },
    expectNext,
  };
})(window);
