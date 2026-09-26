/*
 * Mechanic: check (new; D.3, 6.2-6.4). Nani's check of a layout.
 *  - Live at level 1 (k.live and the game's liveCheck): each drop of a
 *    thing a row names is checked as it lands. Right: only the soft place
 *    sound. Wrong: a gentle wiggle and that row's ear star is gone; the
 *    thing stays where it was put, and nothing says where it should go.
 *  - Done (every level): the rows in a FRESH random order (never the
 *    ladder's). Right: the thing hops, the row ticks, Nani says the row
 *    again (a second hearing, in context). Wrong: it wiggles; "Arre re!",
 *    then what it is, then what she asked; the board unlocks and the player
 *    moves it (a prompt, never an auto-move), taps Done, and she re-checks
 *    only that row. After two misses a ghost shows one right place (rung
 *    6); after three she carries on.
 *  - S1 "What's this?" (D.4) at level 1: after ticking a row Nani holds the
 *    thing up and asks; the child says it (Tidy.Say: voice, pills, or a
 *    parent's tick). Right: she says it back. Unsure: she says it. It never
 *    costs the ear; said rows count towards the voice star.
 * Knobs (data/tidy.json mechanics.check): live, whatsThis, whatsThisPills.
 */
(function (global) {
  const Tidy = global.Tidy;
  const Cook = global.Cook;
  const Rules = Tidy.Rules;
  const Rel = Tidy.Rel;
  const shuffle = (a) => Rules.util.shuffle(Math.random, a);

  Tidy.Mech.define("check", {
    run(z, p, k) {
      const H = z.host;
      if (k.live && H.kn.liveCheck) {
        H.on("drop", ({ iid, to, swapped }) => {
          if (H.done || H.checking || swapped || to === "tray") return;
          const lost = Rules.liveWrong(H.R, H.pl, iid, to);
          if (!lost.length) return;
          H.view.anim(iid, "wiggle");
          Tidy.sfx("soft");
          lost.forEach((id) => H.loseRow(id));
        });
      }
      if (k.whatsThis && H.kn.liveCheck) H.voiceRound = true;
      return { done: () => doneCheck(H, k) };
    },
  });

  /** The things a row is about (for the hop), and the one to wiggle when it fails. */
  function involved(H, row) {
    const st = H.state();
    const B = H.R.B;
    const ids = Object.keys(H.R.items);
    const r = row.type === "not" ? row.rule : row;
    const sel = row.type === "class" ? row.all : row.type === "not" ? row.rule.all : row;
    const mine = ids.filter((i) => Rel.matches(H.R.items[i], sel));
    const ok = (i) => H.pl[i] !== "tray" && B.byId[H.pl[i]] && r.rel && Rel.satisfies(st, B, H.pl[i], r.rel, r.anchor, i);
    const good = mine.filter(ok);
    let culprit = null;
    if (row.type === "place") culprit = mine.find((i) => H.pl[i] !== "tray") || mine[0];
    if (row.type === "count") culprit = good.length > row.n ? good[0] : mine.find((i) => !ok(i)) || mine[0];
    if (row.type === "leave") culprit = mine.find((i) => H.pl[i] !== (H.R.start[i] || "tray"));
    if (row.type === "class") culprit = mine.find((i) => !ok(i));
    if (row.type === "not") culprit = good[0];
    return { good: row.type === "leave" ? mine : good, culprit };
  }

  /** "What it is": the thing and where it is now, in the same words as a row. */
  function whatItIs(H, iid) {
    const it = H.R.items[iid];
    const s = H.R.B.byId[H.pl[iid]];
    const tag = s && (s.tags.find((t) => t.anchor && !(H.R.B.aById[t.anchor] && H.R.B.aById[t.anchor].kind === "person-seat" && !H.R.people[t.anchor])) || s.tags[0]);
    if (!tag) {
      if (H.pl[iid] === "tray") return Tidy.rowLine({ type: "place", item: it.word, attrs: it.attrs, rel: "on", anchor: "__tray" }, trayRound(H));
      return Tidy.line([...(it.attrs.colour ? [{ w: it.attrs.colour }] : []), { w: it.word }]);
    }
    return Tidy.rowLine({ type: "place", item: it.word, attrs: it.attrs, rel: tag.rel, anchor: tag.anchor || null }, H.R);
  }
  // the tray as an anchor, only for saying "it's on the tray"
  const trayRound = (H) => Object.assign({}, H.R, { B: Object.assign({}, H.R.B, { aById: Object.assign({}, H.R.B.aById, { __tray: { id: "__tray", word: "ph-t-tray" } }) }) });

  const joinLines = (lines) => ({ segs: lines.flatMap((l, i) => (i ? [{ t: " ", lang: null }] : []).concat(l.segs)), en: lines.map((l) => l.en).join(" ") });

  async function doneCheck(H, k) {
    H.checking = true;
    H.locked = true;
    Tidy.expect({ what: "checking" });
    for (const row of shuffle(H.R.rows)) {
      if (H.dead) return;
      let tries = 0;
      for (;;) {
        const inv = involved(H, row);
        if (H.holds(row)) {
          inv.good.forEach((i) => H.view.anim(i, "hop", k.hopMs));
          Tidy.Sidebar.mark(row.id, "ok");
          Tidy.sfx("right");
          await Tidy.nani(H.lines[row.id]);
          await Tidy.wait(k.sayGapMs);
          if (!tries && k.whatsThis && H.kn.liveCheck && (row.type === "place" || row.type === "count") && inv.good[0]) await whatsThis(H, row, inv.good[0], k);
          break;
        }
        tries++;
        H.loseRow(row.id);
        Tidy.Sidebar.mark(row.id, "bad");
        if (inv.culprit) H.view.anim(inv.culprit, "wiggle", k.wiggleMs);
        Tidy.sfx("soft");
        const parts = [Tidy.frame("oops")];
        if (inv.culprit && row.type !== "not" && row.type !== "leave") parts.push(whatItIs(H, inv.culprit));
        parts.push(H.lines[row.id]);
        await Tidy.nani(joinLines(parts));
        if (tries >= 3) break; // she carries on; the row stays unticked
        if (tries >= 2) Tidy.Help.ghost(H, row); // rung 6, shown after two misses
        H.locked = false;
        Tidy.expect({ what: "fix", row: row.id, iid: inv.culprit });
        await Tidy.waitDone(H);
        H.locked = true;
        Tidy.expect({ what: "checking" });
      }
    }
    H.checking = false;
  }

  /** S1: "What's this?" Three audio pills (or the voice, or a parent's tick). */
  async function whatsThis(H, row, iid, k) {
    const n = H.view.nodes[iid];
    n.classList.add("up");
    const words = [...new Set(Object.values(H.R.items).map((it) => it.word))].filter((w) => w !== row.item);
    const choices = [row.item, ...shuffle(words).slice(0, Math.max(0, k.whatsThisPills - 1))];
    const ask = Tidy.frame("whatsthis");
    Tidy.nani(ask, { speak: true });
    const r = await Tidy.Say.moment({ ask, choices, answer: row.item, parent: H.opts.grandparent, timeoutMs: Tidy.Mech.knobs("tell", H.level).timeoutMs });
    n.classList.remove("up");
    H.said.rows++;
    if (r.choice === row.item) {
      H.said.right++;
      if (r.by === "voice" || r.by === "parent") H.said.voice++;
      Tidy.sfx("right");
    }
    await Tidy.speakWord(row.item); // she says it back, or says it for you
    Tidy.Sidebar.stars(H);
  }
  Tidy.Check = { involved, whatItIs };

  Tidy.Mech.lab("check", { name: "Check", verb: "Live at level 1, Done after", game: "putaway", level: 2 });
})(window);
