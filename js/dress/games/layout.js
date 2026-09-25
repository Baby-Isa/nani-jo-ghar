/*
 * G2 Lay it out (design D.2; kind K2, flat-lay). Eid eve: Nani says what
 * each person will wear tomorrow ("For Nana: [white kurta]. Ne [green
 * cap]."); the wardrobe shelf holds folded clothes (every kind in every
 * colour: the balanced decoys); the bed has one pile per person, with
 * their face. Tap a thing to take it (with more than one pile, then tap
 * whose pile); tap a thing on a pile to put it back. Level 1 checks each
 * piece as it goes down; from level 2 Nani looks over the piles at Done,
 * and may change her mind. Mechanics: fetch (the shelf into the piles),
 * wear (flat), check, change.
 */
(function (global) {
  const Dress = global.Dress;
  const Doll = Dress.Doll;
  const M = Dress.Mech;
  const G = (Dress.Games = Dress.Games || {});

  const SHELF = { x: 70, y: 30, w: 1460, h: 390 };
  const BED = { x: 120, y: 470, w: 1360, h: 410 };

  function layoutPos(r) {
    const items = r.rack.areas.shelf;
    const cols = Math.ceil(items.length / 2);
    const cw = Math.min(200, (SHELF.w - 40) / cols);
    const x0 = SHELF.x + (SHELF.w - cw * cols) / 2;
    const pos = {};
    items.forEach((it) => {
      const row = it.spot % 2;
      const col = Math.floor(it.spot / 2);
      pos[it.id] = { x: x0 + col * cw + 6, y: SHELF.y + 28 + row * 185, w: cw - 12, h: 150 };
    });
    return pos;
  }
  function pileBoxes(r) {
    const n = r.round.people.length;
    const pad = 40;
    const w = (BED.w - pad * (n + 1)) / n;
    const out = {};
    r.round.people.forEach((who, i) => (out[who] = { x: BED.x + pad + i * (w + pad), y: BED.y + 60, w, h: BED.h - 90 }));
    return out;
  }

  function draw(r) {
    const pos = r.pos || (r.pos = layoutPos(r));
    const piles = pileBoxes(r);
    const worn = new Set(r.state.wears.map((w) => w.item.id));
    let h = `<rect x="0" y="0" width="1600" height="900" fill="#e8dcc6"/>`;
    // the wardrobe: two shelves
    h += `<rect x="${SHELF.x - 20}" y="${SHELF.y - 10}" width="${SHELF.w + 40}" height="${SHELF.h + 20}" rx="18" fill="#9c7650" stroke="#5b4a3c" stroke-width="4"/>`;
    [0, 1].forEach((row) => (h += `<rect x="${SHELF.x}" y="${SHELF.y + 12 + row * 185}" width="${SHELF.w}" height="175" rx="8" fill="#c9a77f"/><rect x="${SHELF.x}" y="${SHELF.y + 180 + row * 185}" width="${SHELF.w}" height="10" fill="#7a5a3a"/>`));
    r.rack.areas.shelf.forEach((it) => {
      if (worn.has(it.id)) return;
      const p = pos[it.id];
      const sel = r.held === it.id ? " sel" : "";
      h += `<g class="it${sel}" data-act="take" data-id="${it.id}" data-kind="${it.kind}" data-colour="${it.colour}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="10" fill="transparent"/>${Doll.flat(it.kind, it.colour, p.x + 4, p.y + 4, p.w - 8, p.h - 8)}</g>`;
    });
    // the bed and one pile per person
    h += `<rect x="${BED.x}" y="${BED.y}" width="${BED.w}" height="${BED.h}" rx="30" fill="#f1e6d6" stroke="#5b4a3c" stroke-width="4"/><rect x="${BED.x + 20}" y="${BED.y + 14}" width="${BED.w - 40}" height="36" rx="18" fill="#fffaf1" stroke="#b9a58a" stroke-width="3"/>`;
    Object.entries(piles).forEach(([who, b]) => {
      const mine = r.state.wears.filter((w) => w.who === who && w.slot === "pile");
      h += `<g class="pile" data-act="pile" data-who="${who}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="20" fill="#e7d7bf" stroke="#b9a58a" stroke-width="3" stroke-dasharray="12 8"/><clipPath id="pc-${who}"><circle cx="${b.x + 44}" cy="${b.y + 44}" r="34"/></clipPath><circle cx="${b.x + 44}" cy="${b.y + 44}" r="36" fill="#fffaf1" stroke="#5b4a3c" stroke-width="3"/><image href="${Dress.face(who)}" x="${b.x + 10}" y="${b.y + 10}" width="68" height="68" clip-path="url(#pc-${who})"/></g>`;
      const cols = 3;
      const cw = Math.min(150, (b.w - 20) / cols);
      mine.forEach((w, i) => {
        const x = b.x + 10 + (i % cols) * cw + (i >= cols ? cw / 2 : 0);
        const y = b.y + 92 + Math.floor(i / cols) * 70;
        h += `<g class="it" data-act="back" data-id="${w.item.id}" data-kind="${w.item.kind}" data-colour="${w.item.colour}">${Doll.flat(w.item.kind, w.item.colour, x, y, cw - 8, 180)}</g>`;
      });
    });
    r.draw(h);
    expectNext(r);
  }

  /** What someone who understood would do next (the test and "Big Ma helps" read it). */
  function expectNext(r) {
    if (r.busy) return;
    const rows = r.rows;
    const wears = r.state.wears;
    const g = Dress.Grade.check(Object.assign({}, r.round, { rows, change: null }), r.state);
    const extra = g.extras[0];
    if (extra) return r.expect({ kind: "tap", sel: `#scene [data-act="back"][data-id="${extra.item.id}"]` });
    const bad = g.rows.find((x) => !x.ok);
    if (!bad) return r.expect({ kind: "tap", sel: "#dress-done" });
    const row = rows.find((x) => x.id === bad.id);
    const it = r.rack.areas.shelf.find((i) => i.kind === row.garment && i.colour === row.colour && !wears.some((w) => w.item.id === i.id));
    if (!it) return r.expect({ kind: "tap", sel: "#dress-done" });
    if (r.round.people.length > 1 && r.held === it.id) return r.expect({ kind: "tap", sel: `#scene [data-act="pile"][data-who="${row.who}"] circle` });
    r.expect({ kind: "tap", sel: `#scene [data-act="take"][data-id="${it.id}"]` });
  }

  async function put(r, who, itemId) {
    const item = r.rack.areas.shelf.find((i) => i.id === itemId);
    r.held = null;
    const w = M.wear.put(r, { who, slot: "pile", item });
    if (r.round.check === "live") {
      const v = M.check.live(r, w);
      if (v === false) {
        // back it goes, and Nani says the row again (the first one still to do for that person)
        r.state.wears.splice(r.state.wears.indexOf(w), 1);
        draw(r);
        r.busy = true;
        await r.say(global.Cook.Lang.line(Dress.data.real.lines.oops), { ms: 800 });
        const g = Dress.Grade.check(r.round, r.state);
        const todo = r.rows.find((x) => x.who === who && !g.rows.find((y) => y.id === x.id).ok);
        const entry = todo && Dress.instruction(r.round).find((e) => e.row.id === todo.id);
        if (entry) await r.say(entry.line);
        r.busy = false;
      } else if (v) {
        const g = Dress.Grade.check(r.round, r.state);
        g.rows.forEach((x) => x.ok && r.markRow(x.id));
      }
    }
    draw(r);
  }

  G.layout = {
    async run(r) {
      r.cardHidden = r.round.hideCard;
      const fire = r.round.check === "live" ? null : M.change.arm(r);
      r.onTap(async (act, d) => {
        if (act === "take") {
          if (r.round.people.length === 1) return put(r, r.round.people[0], d.id);
          r.held = r.held === d.id ? null : d.id;
          return draw(r);
        }
        if (act === "pile" && r.held) return put(r, d.who, r.held);
        if (act === "back") {
          const w = r.state.wears.find((x) => x.item.id === d.id);
          M.wear.off(r, w);
          if (r.round.check === "live") r.rows.forEach((x) => r.markRow(x.id, false));
          if (r.round.check === "live") Dress.Grade.check(r.round, r.state).rows.forEach((x) => x.ok && r.markRow(x.id));
          draw(r);
        }
      });
      draw(r);
      r.redraw = () => draw(r);
      const g = await M.check.run(r, {
        grade: (st) => Dress.Grade.check(r.round, st),
        before: fire ? () => fire().then(() => draw(r)) : null,
        onOk: async () => {
          Dress.Grade.check(r.round, r.state).rows.forEach((x) => r.markRow(x.id));
          await r.say(global.Cook.Lang.line("dress-lovely"), { ms: 900 });
        },
      });
      return { grade: g };
    },
    expectNext,
  };
})(window);
