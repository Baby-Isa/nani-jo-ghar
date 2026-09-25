/*
 * Snap mechanic: Show Nani, the hand-in (docs/modes/snap-design.md D2 G3,
 * D3 `handin`, 6.4). NEW.
 *
 * Nani asks for every row again, in a new random order, by voice (the line
 * shows its words as dots once they're known). The player taps a print to
 * hand it over. Right: "Ghan." and she keeps it. Wrong: she says what's
 * really in it, built from the print record (a recast: "Arre re! Char
 * aamo."), then the row again, and the player chooses again. None fits:
 * "take another" goes back to the orchard for one more frame. The ear star
 * needs each tested row right first time. Nothing on screen says which row
 * she is asking: no highlight on the card, and the prints are in shot order.
 *
 * Settings (data/snap.json mechanics.handin.levels): goBackFrames, minTested, reactMs.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const UI = Cook.UI;
  const Snap = global.Snap;
  const Photo = Snap.Photo;
  const $ = (s) => document.querySelector(s);

  const H = (Snap.Handin = {});
  Snap.Mech.define("handin", { run: (round) => H.run(round) });

  /** Nani's ask: "Show me trae aamo." (a leave-out: "... Nar kelo."). The frame is an English placeholder until the family gives it. */
  H.askLine = function (row) {
    const lines = [Lang.line("snap-show", Snap.rowPhrase(row))];
    if (row.not) lines.push(Lang.line(Lang.frames().no, Lang.phrase([row.not])));
    return Lang.join(lines);
  };
  /** What's really in a print, said back: "Arre re! Char aamo." then the row again. */
  H.recastLine = function (print, row, K) {
    const parts = Photo.recast(print, row, K.photo);
    const lines = [Lang.line("oops")];
    if (parts) lines.push(Lang.bare(Lang.phrase(parts.map((p) => (typeof p === "number" && p > 10 ? null : p)).filter((p) => p != null))));
    lines.push(H.askLine(row));
    return Lang.join(lines);
  };

  function render(round) {
    const box = $("#handin .hi-prints");
    box.innerHTML = "";
    const r = box.getBoundingClientRect();
    const live = round.prints.filter((p) => !p.used);
    const cols = Math.max(2, Math.ceil(Math.sqrt(live.length * 1.6)));
    const w = Math.max(90, Math.min(260, (r.width - 16 * (cols + 1)) / cols));
    live.forEach((p) => {
      const el = Snap.Prints.thumb(round.lay, Snap.scene, p.frame, w);
      el.classList.add("hi-print");
      if (p.by === "ali") el.classList.add("by-ali");
      el.dataset.i = p.i;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Give Nani this photo");
      box.appendChild(el);
    });
  }

  H.run = async function (round) {
    const K = round.K;
    const el = $("#handin");
    round.vf.root.classList.add("hidden");
    el.classList.remove("hidden");
    round.asked = [];
    const order = Cook.shuffle(round.rows.slice());
    let resolveAct = null;
    const onClick = (ev) => {
      const pe = ev.target.closest(".hi-print");
      if (pe && resolveAct) {
        Cook.sfx.pop();
        const r = resolveAct;
        resolveAct = null;
        r({ kind: "pick", p: round.prints[Number(pe.dataset.i)], el: pe });
      }
      if (ev.target.closest("#hi-back") && resolveAct) {
        Cook.sfx.click();
        const r = resolveAct;
        resolveAct = null;
        r({ kind: "back" });
      }
    };
    el.addEventListener("click", onClick);
    const act = () => new Promise((res) => (resolveAct = res));
    try {
      for (const r of order) {
        round.asking = r;
        round.asked.push(r.i);
        let first = true;
        render(round);
        // a tap on a print while she's still asking counts (and cuts her short)
        let next = act();
        await Snap.say("nani", H.askLine(r.row));
        while (!r.done) {
          if (!round.alive()) throw new Cook.Abort();
          if (!round.prints.some((p) => !p.used)) {
            // nothing left to hand over: back for a frame
            if (first) round.earMiss(r, `no photo for ${Lang.plain(r.line)}`, "none");
            first = false;
            await round.goBack(K.handin.goBackFrames);
            $("#handin").classList.remove("hidden");
            round.vf.root.classList.add("hidden");
            render(round);
            next = act();
            continue;
          }
          $("#hi-back").classList.remove("hidden");
          const a = await next;
          if (a.kind === "back") {
            if (first) round.earMiss(r, `none of the photos was ${Lang.plain(r.line)}`, "none");
            first = false;
            await round.goBack(K.handin.goBackFrames);
            $("#handin").classList.remove("hidden");
            round.vf.root.classList.add("hidden");
            render(round);
            next = act();
            await Snap.say("nani", H.askLine(r.row));
            continue;
          }
          const m = Photo.matches(a.p.print, r.row, K.photo);
          if (m.ok) {
            a.p.used = true;
            r.done = true;
            r.firstRight = first;
            r.gave = a.p.i;
            round.lens.push(a.p.lens);
            a.el.classList.add("given");
            Cook.sfx.right();
            UI.mission.refresh();
            await Snap.say("nani", Lang.line("here"), { ms: K.handin.reactMs });
            break;
          }
          // wrong: the print comes back, Nani says what's really in it, then the row again
          if (first) round.earMiss(r, `${Lang.plain(r.line)}: ${m.why}`, r.row.not && /in the photo/.test(m.why) ? "no" : r.row.kind === "pick" ? "pick" : "count");
          first = false;
          a.el.classList.remove("wiggle");
          void a.el.offsetWidth;
          a.el.classList.add("wiggle");
          Cook.sfx.soft();
          next = act();
          await Snap.say("nani", H.recastLine(a.p.print, r.row, K));
        }
      }
    } finally {
      el.removeEventListener("click", onClick);
      el.classList.add("hidden");
      round.asking = null;
    }
  };
})(window);
