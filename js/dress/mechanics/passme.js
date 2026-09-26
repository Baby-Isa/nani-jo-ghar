/*
 * Dress up mechanic `passme` (reused from Cook's pass me: the helper asks
 * for a met word from look-alikes). Big Ma: "Muke hikdo [needle] dine."
 * (the frame is real Kutchi from data/cook.json; the tools are English
 * placeholders until F72-F77 come back). Her card comes forward in the
 * sidebar, never over the play area; the tools are pictures only. The
 * first tap is the one that counts for the ear. Cook's passme draws its
 * tray from painted props; this greybox port draws the tools in code.
 *
 *   await Dress.Mech.passme.run(r, {want, options, who}) -> {first: bool}
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  M.passme = {
    async run(r, { want, options, who = "bigma" }) {
      const box = document.querySelector("#moment");
      const line = Lang.line(Dress.data.real.lines.give, { segs: Lang.word(want), en: Cook.english(want) });
      box.innerHTML = `<div class="mo-tools">${options.map((t) => `<button class="mo-tool" type="button" data-tool="${t}" aria-label="A tool"><svg viewBox="0 0 100 100">${Dress.Doll.flat(t, null, 0, 0, 100, 100)}</svg></button>`).join("")}</div>`;
      box.classList.remove("hidden");
      await r.say(line, { who });
      let first = null;
      for (;;) {
        r.expect({ kind: "tap", sel: `#moment .mo-tool[data-tool="${want}"]` });
        const got = await new Promise((resolve) => {
          const h = (ev) => {
            const b = ev.target.closest(".mo-tool");
            if (!b) return;
            box.removeEventListener("click", h);
            resolve(b.dataset.tool);
          };
          box.addEventListener("click", h);
          r.offs.push(() => box.removeEventListener("click", h));
        });
        r.check();
        if (first == null) first = got === want;
        if (got === want) break;
        r.expect({ kind: "wait" });
        r.lose("ear");
        await r.say(Lang.line(Dress.data.real.lines.oops), { who, ms: 800 });
        await r.say(line, { who });
      }
      box.classList.add("hidden");
      await r.say(Lang.line(Dress.data.real.lines.here), { who, ms: 700 }).catch(() => {});
      return { first };
    },
  };
})(window);
