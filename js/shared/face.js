/*
 * The face circle (S13-A2; ART-08, the kit review 2 and decision 5, Zafar 26 Oct): ONE maker for every face circle in every game.
 * Each person has one centred crop (data/faces.json: the S12 passport sheet's cuts, eyes at the same height, filling the circle),
 * drawn at one of three sizes only, each a token (css/shared/tokens.css): row (--njg-face: a card's face, a bubble's speaker),
 * guide (--njg-guide-face: the guide box) and big (--njg-big-face: the order pop-up, a heal game's corner face). The look is
 * css/shared/face.css; a game never sizes or crops a face of its own (build/sandbox/lib/contract.mjs contract-42).
 *
 *   Face.html(who, size, o) -> '<span class="njg-face njg-face-<size>" data-who=..><img class="njg-face-img"></span>'
 *   Face.circle(who, size, o) -> the same, an element
 *        who: a person id (data/faces.json people or aliases: nani, nana, doctor, girl, patient); size: "row" | "guide" | "big"
 *        o.src: the picture to use for a person with no cut yet (Cook's other customers), or before the table has loaded
 *        o.alt: its alt text (default the person's name); o.cls: more classes on the circle
 *   Face.button(who, size, o) -> <button class="njg-face-btn face-say ..."> the circle in its tap area (never under 48 px,
 *        --njg-face-hit), with the speaker badge (the face is replay); o.cls: the place's own role class (oc-face, ng-face ...),
 *        o.label: its aria-label (default "Hear it again"), o.badge: false for no badge; o.imgCls: a class on the picture (a
 *        host that swaps its mood picture finds it by that)
 *   Face.set(el, who, o)   point a circle (or a button holding one) at another person or picture (a card's new asker)
 *   Face.src(who, o)       the picture's URL for who (o.src when the table has none)
 *   Face.SIZES             ["row", "guide", "big"]
 *   Face.ready             a Promise of the table (the page loads data/faces.json at once; node reads it from disk)
 *
 * Every circle keeps its talk (the kit's njg-talk on the circle while its person speaks: css/shared/focus.css).
 * Plain <script>: window.Face (Shared.face); CommonJS for the unit tests.
 */
(function (root, factory) {
  const F = factory(root);
  if (typeof module === "object" && module.exports) module.exports = F;
  else {
    root.Face = F;
    (root.Shared = root.Shared || {}).face = F;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const F = {};
  F.SIZES = ["row", "guide", "big"];
  F.FILE = "data/faces.json";
  let table = { people: {}, aliases: {} };
  let base = "";
  const take = (j) => {
    if (j && typeof j === "object") table = { people: j.people || {}, aliases: j.aliases || {}, sizes: j.sizes || {} };
    return table;
  };
  const isNode = typeof module === "object" && module.exports && typeof require === "function";
  if (isNode) {
    try {
      take(JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "..", "..", F.FILE), "utf8")));
    } catch (e) {
      /* no table: every face is drawn from the picture its game gives */
    }
    F.ready = Promise.resolve(table);
  } else {
    const self = root.document && root.document.currentScript && root.document.currentScript.src;
    base = self ? self.replace(/js\/shared\/face\.js.*$/, "") : "";
    const url = base + F.FILE;
    F.ready =
      typeof root.fetch === "function"
        ? root
            .fetch(typeof root.njgV === "function" ? root.njgV(url) : url)
            .then((r) => (r && r.ok ? r.json() : null))
            .then(take)
            .then((t) => (refresh(), t))
            .catch(() => table)
        : Promise.resolve(table);
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (who) => String(who || "").toLowerCase().replace(/^the /, "").trim();
  /** The person's table entry ({name, src, eyeY}) or null. */
  F.person = function (who) {
    const id = norm(who);
    const k = table.aliases && table.aliases[id] ? table.aliases[id] : id;
    return (table.people && table.people[k]) || null;
  };
  F.id = function (who) {
    const id = norm(who);
    return table.aliases && table.aliases[id] ? table.aliases[id] : id;
  };
  const stamp = (u) => {
    if (!u || /^(data:|blob:|https?:)/.test(u)) return u;
    const v = typeof root.njgV === "function" ? root.njgV(u) : root.NJG_V && !/[?&]v=/.test(u) ? `${u}${u.includes("?") ? "&" : "?"}v=${root.NJG_V}` : u;
    return v;
  };
  F.src = function (who, o = {}) {
    const p = F.person(who);
    if (p && p.src) return stamp(base + p.src);
    return o.src || "";
  };
  const sizeOf = (s) => (F.SIZES.includes(s) ? s : "row");
  F.html = function (who, size, o = {}) {
    const p = F.person(who);
    const alt = o.alt != null ? o.alt : (p && p.name) || "";
    const src = F.src(who, o);
    const id = who ? F.id(who) : "";
    // (a person with no cut yet, drawn from the game's own picture: Cook's badge close-ups, framed from the top)
    const own = !p && src ? " njg-face-own" : "";
    return `<span class="njg-face njg-face-${sizeOf(size)}${own}${o.cls ? ` ${esc(o.cls)}` : ""}"${id ? ` data-who="${esc(id)}"` : ""}${o.src ? ` data-src="${esc(o.src)}"` : ""}><img class="njg-face-img${o.imgCls ? ` ${esc(o.imgCls)}` : ""}" alt="${esc(alt)}"${src ? ` src="${esc(src)}"` : ""} draggable="false"></span>`;
  };
  const make = (html) => {
    const t = root.document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  F.circle = (who, size, o = {}) => make(F.html(who, size, o));
  F.BADGE = '<span class="say-badge" aria-hidden="true"></span>';
  F.buttonHtml = function (who, size, o = {}) {
    const label = esc(o.label || "Hear it again");
    return `<button class="njg-face-btn njg-face-btn-${sizeOf(size)} face-say${o.cls ? ` ${esc(o.cls)}` : ""}" type="button" aria-label="${label}"${o.title ? ` title="${esc(o.title)}"` : ""}>${F.html(who, size, { src: o.src, alt: o.alt, imgCls: o.imgCls })}${o.badge === false ? "" : F.BADGE}</button>`;
  };
  F.button = (who, size, o = {}) => make(F.buttonHtml(who, size, o));
  /**
   * A circle already made (Face.circle, kept between redraws so it never flashes blank while its picture decodes) put in its
   * tap area: the button Face.button makes, round that very circle. Called again with the same circle, the same button.
   */
  F.wrap = function (circle, o = {}) {
    if (!circle) return null;
    if (circle.__njgFaceBtn) return circle.__njgFaceBtn;
    const m = /njg-face-(row|guide|big)\b/.exec(circle.className || "");
    const b = root.document.createElement("button");
    b.type = "button";
    b.className = `njg-face-btn njg-face-btn-${m ? m[1] : "row"} face-say${o.cls ? ` ${o.cls}` : ""}`;
    b.setAttribute("aria-label", o.label || "Hear it again");
    b.appendChild(circle);
    if (o.badge !== false) b.insertAdjacentHTML("beforeend", F.BADGE);
    circle.__njgFaceBtn = b;
    return b;
  };
  /**
   * Make an element a circle of one of the three sizes (a host's own box that holds a picture: the heal corner face), or give a
   * circle (or a button holding one) another of the three (Nani's pass-me card, big when it comes onto the stage).
   */
  F.size = function (el, size) {
    if (!el || !el.classList) return el;
    const s = sizeOf(size);
    const put = (x, pre) => {
      F.SIZES.forEach((k) => x.classList.remove(`${pre}-${k}`));
      x.classList.add(pre, `${pre}-${s}`);
    };
    if (el.classList.contains("njg-face-btn")) {
      put(el, "njg-face-btn");
      const c = el.querySelector(".njg-face");
      if (c) put(c, "njg-face");
    } else put(el, "njg-face");
    return el;
  };
  /** Point a circle (or a button holding one) at another person or picture. */
  F.set = function (el, who, o = {}) {
    if (!el) return null;
    const c = el.classList && el.classList.contains("njg-face") ? el : el.querySelector && el.querySelector(".njg-face");
    if (!c) return null;
    const img = c.querySelector("img");
    const id = who ? F.id(who) : "";
    if (id) c.dataset.who = id;
    else delete c.dataset.who;
    if (o.src) c.dataset.src = o.src;
    const src = F.src(who, o);
    c.classList.toggle("njg-face-own", !F.person(who) && !!src);
    if (img && src && img.getAttribute("src") !== src) img.src = src;
    if (img && o.alt != null) img.alt = o.alt;
    else if (img && F.person(who)) img.alt = F.person(who).name || img.alt;
    return c;
  };
  // the table arrived after some circles were drawn: give them their person's picture
  function refresh() {
    const d = root.document;
    if (!d || !d.querySelectorAll) return;
    d.querySelectorAll(".njg-face[data-who]").forEach((c) => {
      const img = c.querySelector("img");
      const src = F.src(c.dataset.who, { src: c.dataset.src });
      if (img && src && img.getAttribute("src") !== src) img.src = src;
    });
  }
  F.refresh = refresh;
  return F;
});
