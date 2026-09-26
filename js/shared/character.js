/*
 * The player's character: data-driven layers, tinted per choice
 * (docs/first-launch-story.md, "Character creation"; docs/shared-api.md 13).
 *
 * data/character-options.json lists the categories (each a row of picture
 * swatches: a colour, or a variant such as boy/girl) and the layers, bottom
 * to top. Each layer is an SVG file whose fill="currentColor" parts take the
 * colour of one category's choice; "{body}" (any variant category's id) in a
 * file name picks the file. So a new category is data plus layer files, with
 * no change here.
 *
 *   await Character.load()                  the options, and every layer file (cached)
 *   Character.defaults()                    {category: swatch id} for a new character
 *   Character.normalize(choices)            fill in anything missing or no longer offered
 *   Character.svg(choices, {view, title})   the picture as an SVG string (view: a viewBox,
 *                                           a category id for its focus, or "badge")
 *   Character.hands(choices)                the Cook hands skin (player-boy / player-girl)
 *   Character.get(id?) / Character.put(choices, id?)   the player's save ("character" namespace:
 *                                           {v, choices, hands, updated}); get() is null if none
 *   Character.badge(el, id?)                draw a player's face into an element (or leave it)
 *
 * Plain <script> after save.js: window.Character; Node: require() (the pure parts).
 */
(function (root, factory) {
  const C = factory(root);
  if (typeof module === "object" && module.exports) module.exports = C;
  else root.Character = C;
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const C = {};
  const URL = "data/character-options.json";
  const v = (u) => (root && root.njgV ? root.njgV(u) : u);
  let opts = null;
  let loading = null;
  const files = {}; // file -> inner SVG markup

  C.use = function (o, layerFiles) {
    opts = o;
    Object.assign(files, layerFiles || {});
    return C;
  };
  C.options = () => opts;

  const inner = (text) =>
    String(text)
      .replace(/<\?xml[^>]*>/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^[\s\S]*?<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
      .trim();

  /** Every file a layer can use, for every variant choice. */
  C.layerFiles = function (o = opts) {
    const variants = o.categories.filter((c) => c.variant);
    const out = new Set();
    o.layers.forEach((L) => {
      let names = [L.file];
      variants.forEach((c) => {
        const key = `{${c.id}}`;
        if (!L.file.includes(key)) return;
        names = names.flatMap((n) => c.swatches.map((s) => n.split(key).join(s.id)));
      });
      names.forEach((n) => out.add(n));
    });
    return Array.from(out);
  };

  C.load = function (url = URL) {
    if (opts && C.layerFiles().every((f) => f in files)) return Promise.resolve(opts);
    if (loading) return loading;
    const get = (u) => root.fetch(v(u)).then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${u}: ${r.status}`))));
    loading = get(url)
      .then((t) => {
        opts = JSON.parse(t);
        return Promise.all(
          C.layerFiles().map((f) =>
            get(f)
              .then((t2) => (files[f] = inner(t2)))
              .catch(() => (files[f] = ""))
          )
        );
      })
      .then(() => opts)
      .catch((e) => {
        loading = null;
        throw e;
      });
    return loading;
  };

  const cat = (id) => opts.categories.find((c) => c.id === id);
  C.defaults = function () {
    const out = {};
    opts.categories.forEach((c) => (out[c.id] = c.default || (c.swatches[0] || {}).id));
    return out;
  };
  C.normalize = function (choices) {
    const out = C.defaults();
    Object.keys(choices || {}).forEach((k) => {
      const c = cat(k);
      if (c && c.swatches.some((s) => s.id === choices[k])) out[k] = choices[k];
    });
    return out;
  };
  C.swatch = (catId, id) => {
    const c = cat(catId);
    return (c && c.swatches.find((s) => s.id === id)) || null;
  };
  C.hands = function (choices) {
    const ch = C.normalize(choices);
    let hands = null;
    opts.categories.forEach((c) => {
      const s = C.swatch(c.id, ch[c.id]);
      if (s && s.hands) hands = s.hands;
    });
    return hands;
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  C.svg = function (choices, o = {}) {
    const ch = C.normalize(choices);
    let view = o.view || opts.viewBox;
    if (view === "badge") view = opts.badge || opts.viewBox;
    else if (cat(view)) view = cat(view).focus || opts.viewBox;
    const body = opts.layers
      .map((L) => {
        let f = L.file;
        opts.categories.filter((c) => c.variant).forEach((c) => (f = f.split(`{${c.id}}`).join(ch[c.id])));
        const s = L.tint ? C.swatch(L.tint, ch[L.tint]) : null;
        const colour = (s && s.color) || "#999";
        return `<g data-layer="${esc(L.id)}" style="color:${esc(colour)}">${files[f] || ""}</g>`;
      })
      .join("");
    const title = o.title ? `<title>${esc(o.title)}</title>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${esc(view)}" preserveAspectRatio="xMidYMid meet" class="${esc(o.cls || "njg-char")}" ${o.title ? 'role="img"' : 'aria-hidden="true"'}>${title}${body}</svg>`;
  };

  /* ---------------- the save ---------------- */
  const S = () => root.Save;
  C.NS = "character";
  C.get = function (playerId) {
    const Save = S();
    if (!Save) return null;
    const d = Save.get(C.NS, playerId);
    return d && d.choices ? d : null;
  };
  C.put = function (choices, playerId) {
    const ch = opts ? C.normalize(choices) : Object.assign({}, choices);
    const rec = { v: 1, choices: ch, hands: opts ? C.hands(ch) : null, updated: new Date().toISOString() };
    S().set(C.NS, rec, playerId);
    return rec;
  };
  /** Draw a player's face into el (for the home screen's badge and the picker); false if they have none. */
  C.badge = function (el, playerId) {
    const rec = C.get(playerId);
    if (!rec || !el) return Promise.resolve(false);
    return C.load()
      .then(() => {
        el.innerHTML = C.svg(rec.choices, { view: "badge" });
        el.classList.add("has-char");
        return true;
      })
      .catch(() => false);
  };
  return C;
});
