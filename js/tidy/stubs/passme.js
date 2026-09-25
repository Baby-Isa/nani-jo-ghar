/*
 * STAND-IN for Cook's `passme` (js/cook/mechanics/passme.js, reused per
 * D.3): Cook's is drawn by its Phaser UI, so until the shell hoists it this
 * is the same verb in Tidy's sidebar. Once in a round (T1, level 2), Nani
 * asks for a known word NOT on this board ("Muke hikdo {x} dine.", the
 * real frame) with three pictures from ONE look-alike group (Cook's rule),
 * in the sidebar column, never over the board. It doesn't touch the rows.
 * Knobs: none of its own; the moment comes after `afterMs`.
 */
(function (global) {
  const Tidy = global.Tidy;
  const Cook = global.Cook;
  const $ = (s) => document.querySelector(s);

  Tidy.Mech.define("passme", {
    run(z, p, k) {
      const H = z.host;
      const onBoard = new Set(Object.values(H.R.items).map((it) => it.word));
      const groups = (Tidy.data.lookalikes.groups || []).filter((g) => g.every((w) => !onBoard.has(w) && Tidy.picture(w)));
      if (!groups.length) return {};
      const g = groups[Math.floor(Math.random() * groups.length)];
      const want = g[Math.floor(Math.random() * g.length)];
      const t = setTimeout(async () => {
        if (H.done || H.dead) return;
        const box = $("#passme");
        const line = Tidy.frame("give", Cook.Lang.phrase([want]));
        $(".pm-say", box).innerHTML = Tidy.html(line, { reveal: true });
        const tray = $(".pm-tray", box);
        tray.innerHTML = "";
        const sh = (a) => Tidy.Rules.util.shuffle(Math.random, a);
        sh([want, ...sh(g.filter((w) => w !== want)).slice(0, 2)]).forEach((w) => {
          const b = document.createElement("button");
          b.type = "button";
          b.dataset.word = w;
          b.innerHTML = `<img src="${Tidy.picture(w)}" alt="">`;
          b.onclick = async () => {
            if (w === want) {
              Tidy.sfx("coin");
              Tidy.coins++;
              $("#coins").textContent = Tidy.coins;
              box.classList.add("hidden");
              await Tidy.speak(Tidy.frame("thanks"));
            } else {
              Tidy.sfx("soft");
              await Tidy.speak(line);
            }
          };
          tray.appendChild(b);
        });
        box.classList.remove("hidden");
        await Tidy.speak(line);
      }, (p.afterMs || 12000) / (Cook.speed || 1));
      H.cleanup = (H.cleanup || []).concat(() => clearTimeout(t));
      H.on("done", () => $("#passme").classList.add("hidden"));
      return {};
    },
  });
})(window);
