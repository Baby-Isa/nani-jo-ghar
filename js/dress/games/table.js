/*
 * G3 Big Ma's mending (design D.2; kind K3, the table, top view). A kurta
 * laid flat. Level 1: "Sew on bo vadha [buttons], [red]." Count and size
 * are real Kutchi today (hikdo..panj, vadho/nindho, drafts); the colour
 * and the thing are placeholders. Level 2 adds a motif on a named part
 * ("[a yellow flower] [on the pocket]"); level 3 puts three attributes on
 * one noun and splits the sleeve into left and right. The tin never runs
 * out and nothing ends by itself: Done ends it. Then Big Ma asks for a
 * tool ("Muke hikdo [needle] dine.") and each piece is stitched on.
 * Mechanics: pick, count, wear (parts as slots), check, passme, stitch.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const Doll = Dress.Doll;
  const M = Dress.Mech;
  const G = (Dress.Games = Dress.Games || {});
  const SIZE = { big: 58, small: 36 };

  const T = () => Dress.scene.table;
  function gridPos(items, box, cols) {
    const rows = Math.ceil(items.length / cols);
    const cw = (box.w - 40) / cols;
    const ch = Math.min(cw, (box.h - 60) / rows);
    const pos = {};
    items.forEach((it) => (pos[it.id] = { x: box.x + 20 + (it.spot % cols) * cw, y: box.y + 40 + Math.floor(it.spot / cols) * ch, w: cw, h: ch }));
    return pos;
  }
  /** The part regions to tap: the sleeve is one part, or left and right from level 3. */
  function parts(r) {
    const P = T().parts;
    const sides = r.round.knobs.motif && r.round.knobs.motif.sides;
    const keys = ["ph-collar", "ph-pocket", "ph-hem"].concat(sides ? ["ph-sleeve:ph-left", "ph-sleeve:ph-right"] : ["ph-sleeve"]);
    return keys.map((k) => {
      const [part, side] = k.split(":");
      const box = k === "ph-sleeve" ? P["ph-sleeve:ph-left"] : P[k];
      const out = [{ key: k, part, side: side || null, box }];
      if (k === "ph-sleeve") out.push({ key: k, part, side: null, box: P["ph-sleeve:ph-right"] });
      return out;
    }).flat();
  }
  const slotOf = (p) => `part:${p.part}${p.side ? ":" + p.side : ""}`;

  function kurta() {
    const K = T().kurta;
    const { x, y, w, h } = K;
    return `<path d="M${x + w * 0.36} ${y} L${x + w * 0.46} ${y + 10} Q${x + w * 0.5} ${y + 60} ${x + w * 0.54} ${y + 10} L${x + w * 0.64} ${y} L${x + w} ${y + h * 0.1} L${x + w * 0.98} ${y + h * 0.5} L${x + w * 0.8} ${y + h * 0.48} L${x + w * 0.8} ${y + h} L${x + w * 0.2} ${y + h} L${x + w * 0.2} ${y + h * 0.48} L${x + w * 0.02} ${y + h * 0.5} L${x} ${y + h * 0.1} Z" fill="#f4efe6" stroke="#5b4a3c" stroke-width="4" stroke-linejoin="round"/><path d="M${x + w * 0.5} ${y + 60} L${x + w * 0.5} ${y + h * 0.62}" stroke="#b9a58a" stroke-width="3"/>`;
  }

  function draw(r) {
    const A = r.rack.areas;
    const pos = r.pos || (r.pos = Object.assign({}, A.tin ? gridPos(A.tin, T().tin, A.tin.length > 6 ? 4 : 3) : {}, A.tray ? gridPos(A.tray, T().tray, A.tray.length > 9 ? 4 : 3) : {}));
    let h = `<rect x="0" y="0" width="1600" height="900" fill="#b88a5c"/><rect x="20" y="20" width="1560" height="860" rx="24" fill="#c99b6a" stroke="#8a6440" stroke-width="4"/>`;
    h += kurta();
    // the parts: faint dashed outlines, no labels
    parts(r).forEach((p) => (h += `<rect class="part${r.held ? " live" : ""}" data-act="part" data-part="${p.part}" data-side="${p.side || ""}" x="${p.box.x}" y="${p.box.y}" width="${p.box.w}" height="${p.box.h}" rx="14" fill="rgba(255,255,255,.02)" stroke="#b9a58a" stroke-width="2" stroke-dasharray="6 8"/>`));
    // the placket: button spots down the front
    const PK = T().placket;
    if (A.tin) {
      for (let i = 0; i < PK.n; i++) h += `<circle cx="${PK.x}" cy="${PK.y + i * PK.gap}" r="20" fill="none" stroke="#c9b596" stroke-width="2" stroke-dasharray="4 5"/>`;
      h += `<ellipse cx="${T().tin.x + T().tin.w / 2}" cy="${T().tin.y + T().tin.h / 2}" rx="${T().tin.w / 2}" ry="${T().tin.h / 2}" fill="#8c96a0" stroke="#4d565f" stroke-width="6"/>`;
      A.tin.forEach((it) => {
        const p = pos[it.id];
        const s = SIZE[it.size || "big"] * 1.3;
        h += `<g class="it" data-act="tin" data-id="${it.id}" data-kind="ph-button" data-colour="${it.colour}" data-size="${it.size || ""}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="transparent"/>${Doll.flat("ph-button", it.colour, p.x + (p.w - s) / 2, p.y + (p.h - s) / 2, s, s)}</g>`;
      });
    }
    if (A.tray) {
      h += `<rect x="${T().tray.x}" y="${T().tray.y}" width="${T().tray.w}" height="${T().tray.h}" rx="20" fill="#e9dcc4" stroke="#5b4a3c" stroke-width="4"/>`;
      A.tray.forEach((it) => {
        const p = pos[it.id];
        const s = (it.size === "small" ? 0.55 : 0.85) * Math.min(p.w, p.h);
        h += `<g class="it${r.held === it.id ? " sel" : ""}" data-act="tray" data-id="${it.id}" data-kind="${it.motif}" data-colour="${it.colour}" data-size="${it.size || ""}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="transparent"/>${Doll.flat(it.motif, it.colour, p.x + (p.w - s) / 2, p.y + (p.h - s) / 2, s, s)}</g>`;
      });
    }
    // what's on the kurta
    const placed = r.state.wears;
    placed
      .filter((w) => w.slot === "placket")
      .forEach((w, i) => {
        const s = SIZE[w.item.size || "big"];
        w.at = { x: PK.x, y: PK.y + i * PK.gap };
        h += `<g class="it placed" data-act="back" data-n="${r.state.wears.indexOf(w)}">${Doll.flat("ph-button", w.item.colour, PK.x - s / 2, w.at.y - s / 2, s, s)}</g>`;
      });
    if (A.tin) h += M.count.tally(PK.x + 90, PK.y - 50, placed.filter((w) => w.slot === "placket").length);
    const byPart = {};
    placed
      .filter((w) => w.slot.startsWith("part:"))
      .forEach((w) => {
        const n = (byPart[w.slot] = (byPart[w.slot] || 0) + 1) - 1;
        const [, part, side] = w.slot.split(":");
        const p = parts(r).find((q) => q.part === part && (q.side || null) === (side || null));
        const s = w.item.size === "small" ? 40 : 64;
        w.at = { x: p.box.x + 20 + s / 2 + (n % 3) * (s + 6), y: p.box.y + 16 + s / 2 + Math.floor(n / 3) * (s + 6) };
        // while a motif is in hand, what's on the part lets the tap through to the part
        h += `<g class="it placed${r.held ? " inert" : ""}" data-act="back" data-n="${r.state.wears.indexOf(w)}">${Doll.flat(w.item.motif, w.item.colour, w.at.x - s / 2, w.at.y - s / 2, s, s)}</g>`;
      });
    r.draw(h);
    expectNext(r);
  }

  function expectNext(r) {
    if (r.busy || r.phase !== "place") return;
    const g = Dress.Grade.check(r.round, Object.assign({}, r.state, { passed: r.round.passme.want }));
    const backSel = (w) => `#scene [data-act="back"][data-n="${r.state.wears.indexOf(w)}"]`;
    if (g.extras.length) {
      const w = r.state.wears.find((x) => x.item === g.extras[0].item && x.slot === g.extras[0].slot);
      return r.expect({ kind: "tap", sel: backSel(w) });
    }
    for (const row of r.rows) {
      if (row.thing === "ph-button") {
        const on = r.state.wears.filter((w) => w.slot === "placket");
        const wrong = on.find((w) => w.item.colour !== row.colour || (row.size && w.item.size !== row.size));
        if (wrong) return r.expect({ kind: "tap", sel: backSel(wrong) });
        if (on.length > row.count) return r.expect({ kind: "tap", sel: backSel(on[on.length - 1]) });
        if (on.length < row.count) {
          const it = r.rack.areas.tin.find((i) => i.colour === row.colour && (!row.size || i.size === row.size));
          return r.expect({ kind: "tap", sel: `#scene [data-act="tin"][data-id="${it.id}"]` });
        }
      }
      if (row.thing === "motif") {
        const slot = Dress.Grade.partSlot(row);
        const on = r.state.wears.filter((w) => w.slot === slot);
        const wrong = on.find((w) => w.item.colour !== row.colour || w.item.motif !== row.motif || (row.size && w.item.size !== row.size));
        if (wrong) return r.expect({ kind: "tap", sel: backSel(wrong) });
        if (on.length > row.count) return r.expect({ kind: "tap", sel: backSel(on[on.length - 1]) });
        if (on.length < row.count) {
          const it = r.rack.areas.tray.find((i) => i.colour === row.colour && i.motif === row.motif && (!row.size || i.size === row.size));
          if (r.held !== it.id) return r.expect({ kind: "tap", sel: `#scene [data-act="tray"][data-id="${it.id}"]` });
          return r.expect({ kind: "tap", sel: `#scene [data-act="part"][data-part="${row.part}"][data-side="${row.side || ""}"]` });
        }
      }
    }
    r.expect({ kind: "tap", sel: "#dress-done" });
  }

  G.table = {
    async run(r) {
      const A = r.rack.areas;
      r.phase = "place";
      r.cardHidden = r.round.hideCard;
      r.onTap((act, d) => {
        if (r.phase !== "place") return;
        if (act === "tin") {
          if (r.state.wears.filter((w) => w.slot === "placket").length >= T().placket.n) return;
          M.wear.put(r, { slot: "placket", item: A.tin.find((i) => i.id === d.id) });
        } else if (act === "tray") r.held = r.held === d.id ? null : d.id;
        else if (act === "part" && r.held) {
          M.wear.put(r, { slot: slotOf({ part: d.part, side: d.side || null }), item: A.tray.find((i) => i.id === r.held) });
          r.held = null;
        } else if (act === "back") M.wear.off(r, r.state.wears[Number(d.n)]);
        draw(r);
      });
      r.redraw = () => draw(r);
      draw(r);
      // Done checks the sewing (the tool comes after, and is its own ear decision)
      const g = await M.check.run(r, { grade: (st) => Dress.Grade.check(r.round, Object.assign({}, st, { passed: r.round.passme.want })) });
      r.phase = "pass";
      const pm = await M.passme.run(r, Object.assign({ who: "bigma" }, r.round.passme));
      r.state.passFirst = pm.first;
      r.state.passed = r.round.passme.want;
      // stitch each piece on, one at a time
      r.phase = "stitch";
      draw(r);
      const targets = r.state.wears.map((w) => ({ x: w.at.x, y: w.at.y, r: w.slot === "placket" ? 34 : 40 }));
      const st = await M.stitch.run(r, targets, r.round.level);
      r.state.hand = st.score;
      await r.say(Lang.line("dress-lovely"), { who: "bigma", ms: 900 });
      return { grade: g, stitch: st };
    },
    expectNext,
  };
})(window);
