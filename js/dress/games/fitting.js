/*
 * G1 The fitting (design D.2; kind K1, upper body). Nana, Ma or Ali stands
 * at the mirror from the waist up (the existing crop, greyed: house
 * clothes never count) and says what they want ("Muke [red kurta] khape.
 * Ne [green cap]." and, from level 2, "Nar [shawl]." and a change of
 * mind). The rail has a row of hangers per slot (head, top, wrap), every
 * kind in every colour. Tap a hanger to put it on (what was on that slot
 * goes back); tap it on them to take it off. Level 1 checks each piece as
 * it goes on (only asked slots get a word); from level 2, Done is the
 * mirror check. Unasked slots are free. Mechanics: pick, wear, check,
 * change. (Big Ma's pass me belongs to the table in the greybox.)
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const Doll = Dress.Doll;
  const M = Dress.Mech;
  const G = (Dress.Games = Dress.Games || {});

  function railPos(r) {
    const S = Dress.scene.fitting.rail;
    const pos = {};
    S.rows.forEach((slot, ri) => {
      const items = r.rack.areas.rail.filter((i) => i.slot === slot);
      const cw = S.w / Math.max(items.length, 6);
      const h = Math.min(S.rowH - 70, cw * 1.25);
      items.forEach((it, j) => (pos[it.id] = { x: S.x + j * cw + 4, y: S.y + ri * S.rowH + 34, w: cw - 8, h }));
    });
    return pos;
  }

  function draw(r) {
    const S = Dress.scene.fitting;
    const pos = r.pos || (r.pos = railPos(r));
    const who = r.round.who;
    const worn = r.state.wears.filter((w) => w.who === who);
    const wornIds = new Set(worn.map((w) => w.item.id));
    let h = `<rect x="0" y="0" width="1600" height="900" fill="#eadfcb"/><rect x="0" y="780" width="1600" height="120" fill="#d8c3a2"/>`;
    // the rail: a rod per slot, hangers, the clothes (no labels)
    const RL = S.rail;
    RL.rows.forEach((slot, ri) => {
      const y = RL.y + ri * RL.rowH;
      h += `<rect x="${RL.x - 10}" y="${y + 8}" width="${RL.w + 20}" height="10" rx="5" fill="#7a5a3a"/>`;
    });
    r.rack.areas.rail.forEach((it) => {
      const p = pos[it.id];
      const hook = `<path d="M${p.x + p.w / 2} ${p.y - 26} q0 -10 8 -10 M${p.x + p.w / 2} ${p.y - 26} L${p.x + p.w / 2} ${p.y - 8} L${p.x + 8} ${p.y + 6} L${p.x + p.w - 8} ${p.y + 6} Z" fill="none" stroke="#6b5a4c" stroke-width="3"/>`;
      if (wornIds.has(it.id)) {
        h += `<g class="empty-hook">${hook}</g>`;
        return;
      }
      h += `<g class="it" data-act="wear" data-id="${it.id}" data-slot="${it.slot}" data-kind="${it.kind}" data-colour="${it.colour}"><rect x="${p.x}" y="${p.y - 30}" width="${p.w}" height="${p.h + 30}" fill="transparent"/>${hook}${Doll.flat(it.kind, it.colour, p.x, p.y, p.w, p.h)}</g>`;
    });
    // the client, the mirror
    h += `<ellipse cx="${S.place.cx}" cy="${S.place.bottom - 10}" rx="300" ry="30" fill="#c9ad85"/>`;
    h += `<g class="client" data-act="client">${Doll.figure(who, worn.map((w) => Object.assign({ id: w.item.id }, w.item)), { mood: r.mood || "neutral" })}</g>`;
    h += Doll.mirror();
    r.draw(h);
    // a worn piece is tapped on the figure to take it off
    document.querySelectorAll("#scene .client .ov").forEach((g) => g.setAttribute("data-act", "off"));
    expectNext(r);
  }

  function expectNext(r) {
    if (r.busy) return;
    const who = r.round.who;
    const rows = r.rows;
    for (const row of rows) {
      const on = r.state.wears.filter((w) => w.who === who && w.slot === row.slot);
      if (row.no) {
        const bad = on.find((w) => w.item.kind === row.garment);
        if (bad) return r.expect({ kind: "tap", sel: `#scene .client .ov[data-id="${bad.item.id}"]` });
        continue;
      }
      if (on[0] && on[0].item.kind === row.garment && on[0].item.colour === row.colour) continue;
      const it = r.rack.areas.rail.find((i) => i.slot === row.slot && i.kind === row.garment && i.colour === row.colour);
      return r.expect({ kind: "tap", sel: `#scene [data-act="wear"][data-id="${it.id}"]` });
    }
    r.expect({ kind: "tap", sel: "#dress-done" });
  }

  async function moodFor(r, mood, ms = 900) {
    r.mood = mood;
    draw(r);
    await Dress.wait(ms).catch(() => {});
    if (!r.alive()) return;
    r.mood = "neutral";
    draw(r);
  }

  G.fitting = {
    async run(r) {
      const who = r.round.who;
      r.cardHidden = r.round.hideCard;
      const fire = r.round.check === "live" ? null : M.change.arm(r);
      r.onTap(async (act, d) => {
        if (act === "wear") {
          const item = r.rack.areas.rail.find((i) => i.id === d.id);
          const w = M.wear.put(r, { who, slot: item.slot, item }, { single: true });
          if (r.round.check === "live") {
            const v = M.check.live(r, w);
            if (v === false) {
              r.state.wears.splice(r.state.wears.indexOf(w), 1);
              r.busy = true;
              draw(r);
              await r.say(Lang.line(Dress.data.real.lines.oops), { who, ms: 800 });
              const entry = Dress.instruction(r.round).find((e) => e.row.slot === item.slot);
              if (entry) await r.say(entry.line, { who });
              r.busy = false;
            } else if (v) {
              const row = r.rows.find((x) => x.slot === item.slot);
              if (row) r.markRow(row.id);
              moodFor(r, "happy");
            }
          }
          return draw(r);
        }
        if (act === "off") {
          const w = r.state.wears.find((x) => x.item.id === d.id);
          if (w) {
            M.wear.off(r, w);
            if (r.round.check === "live") {
              const row = r.rows.find((x) => x.slot === w.slot);
              if (row) r.markRow(row.id, false);
            }
          }
          draw(r);
        }
      });
      r.redraw = () => draw(r);
      draw(r);
      const g = await M.check.run(r, {
        grade: (st) => Dress.Grade.check(r.round, st),
        before: fire ? () => fire().then(() => draw(r)) : null,
        onOk: async () => {
          // the mirror: they name each piece as they look
          r.mood = "happy";
          draw(r);
          for (const { row, line } of Dress.instruction(r.round)) {
            r.markRow(row.id);
            if (!row.no) await r.say(line, { who, ms: 700 });
          }
          await r.say(Lang.line("dress-lovely"), { who, ms: 900 });
        },
      });
      return { grade: g };
    },
    expectNext,
  };
})(window);
