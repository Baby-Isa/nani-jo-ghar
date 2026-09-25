/*
 * T3 The box (D.2): the fruit box for the guests (fruit nouns and counts,
 * real Kutchi today). `pack` + `check` on the 3x3 box; Simba knocked it
 * (K2) and his `paw` from level 2. At Done the lid closes with a ribbon.
 */
(function (global) {
  const Tidy = global.Tidy;
  Tidy.Game.define("box", {
    name: "The fruit box",
    zones: (H) => [{ id: "box", main: true, region: [0, 0, 1600, 900], mechs: ["pack", "check", "paw"], params: { force: H.opts.paw } }],
    async after(H) {
      const lid = Tidy.el("div", "surf box-grid", H.main.el);
      Object.assign(lid.style, { left: "480px", top: "-700px", width: "640px", height: "630px", transition: "top .6s ease", zIndex: 80 });
      lid.innerHTML = `<div style="position:absolute;left:300px;top:0;width:40px;height:100%;background:#c8483c"></div><div style="position:absolute;top:295px;left:0;height:40px;width:100%;background:#c8483c"></div>`;
      await Tidy.wait(30);
      lid.style.top = "60px";
      await Tidy.wait(800);
    },
  });
})(window);
