/* s09-mock: the pieces every mock page shares: the frame, the real guide box and buttons (js/shared), the dock and a card.
   Lab only. No Kutchi is written here that does not already exist in data/lang or data/family-audio.json: a line still to
   record is its English in grey italic (.ph), with data-rec in the markup only (decision 84). */
(function (global) {
  "use strict";
  const ROOT = "../../";
  // js/shared/character.js and friends resolve "assets/..." against the page: from the lab, point them at the root
  global.njgV = (u) => (/^(\.\.\/|https?:|data:|\/)/.test(u) ? u : ROOT + u);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const M = (global.Mock = {});
  M.ROOT = ROOT;
  M.q = new URLSearchParams(global.location.search);
  M.esc = esc;
  M.FACE = ROOT + "assets/cook/characters/nani-face.webp";
  M.BULB = ROOT + "assets/ui/results/icon-bulb.webp";

  /** A line: {k: Kutchi (recorded or in the lexicon), e: English, rec: true when the Kutchi is still to record}.
   *  Her guide line is Kutchi only; a line to record shows its English in grey italic (decision 84). */
  M.lineHtml = (L) => (L.rec ? `<span class="ph" data-rec="to record">${esc(L.e)}</span>` : L.k.split(/(\{[^}]+\})/).map((p) => (p.startsWith("{") ? `<span class="word">${esc(p.slice(1, -1))}</span>` : esc(p))).join(""));
  M.kutchiPlain = (L) => (L.rec ? L.e : L.k.replace(/[{}]/g, ""));

  /** The sidebar: the shared guide box (face = replay, bulb, mute), an optional card, the dock. */
  M.side = function (side, o = {}) {
    const g = document.createElement("div");
    side.appendChild(g);
    const guide = global.NaniGuide.mount(g, { face: M.FACE, bulb: M.BULB, onBulb: () => {}, onReplay: () => {} });
    if (o.card) side.appendChild(o.card);
    const dock = document.createElement("div");
    dock.className = "mk-dock";
    dock.innerHTML = `
      <button type="button" class="mk-help" aria-label="What do I do here?">?</button>
      <button type="button" class="mk-home" aria-label="Home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5.5v-5.5h-5V21H4a1 1 0 0 1-1-1z"/></svg></button>
      <button type="button" class="mk-book" aria-label="The book"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#2a2522" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 2z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 2z"/></svg></button>`;
    side.appendChild(dock);
    return guide;
  };

  /** A white card in the order card's look: a face (optional), a headline, and a row of small pictures. */
  M.card = function (o = {}) {
    const c = document.createElement("section");
    c.className = "oc-card mk-card";
    const face = o.face ? `<span class="oc-face"><img alt="" src="${esc(o.face)}"><span class="say-badge" aria-hidden="true"></span></span>` : "";
    c.innerHTML = `${o.head || face ? `<div class="oc-head">${face}${o.head ? `<span class="mk-head">${o.head}</span>` : ""}</div>` : ""}<div class="mk-pics">${(o.pics || []).map((p) => (p === "→" ? `<svg class="mk-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>` : `<span class="mk-pic ${p.cls || ""}">${p.svg || (p.src ? `<img alt="" src="${esc(p.src)}">` : "")}</span>`)).join("")}</div>`;
    return c;
  };

  /** The grown-ups' label on the mock (hidden with ?clean=1). */
  M.note = function (play, text) {
    if (M.q.get("clean") === "1") document.documentElement.setAttribute("data-clean", "");
    const n = document.createElement("div");
    n.className = "mk-note";
    n.textContent = text;
    play.appendChild(n);
  };

  /** The frame: <div class="njg-frame"><aside class="njg-side mk-side"> + <main class="njg-play mk-play">. */
  M.frame = function () {
    const app = document.createElement("div");
    app.className = "njg-frame mk-app";
    const side = document.createElement("aside");
    side.className = "njg-side mk-side";
    const play = document.createElement("main");
    play.className = "njg-play mk-play";
    app.append(side, play);
    document.body.appendChild(app);
    return { app, side, play };
  };
})(window);
