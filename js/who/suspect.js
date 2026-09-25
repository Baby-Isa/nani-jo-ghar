/*
 * Who did it?: a suspect, greybox. Composes a figure from the person's data
 * (shape, height, fill) plus attribute overlays drawn in code (glasses, cap,
 * held item, paw trace). The foundation's overlay-at-anchor sprites (shared
 * with Dress up) replace the drawn overlays in phase 3; the anchors are the
 * same (head, hands/paws).
 *
 * Every suspect gets the same idle and the same states (leak rule 3.2):
 * standing, forward, sat, glow, caught, notme, shrug. Guilty and caught
 * faces only ever play after an accusation.
 *
 *   Who.Suspect.svg(person, attrs, opts) -> SVG markup (the figure alone)
 *   Who.Suspect.mount(world, s, i, x, P, scene) -> { el, fig, hands, x }
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const S = (Who.Suspect = {});

  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c * k)));
    return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, "0")).join("")}`;
  };

  // the figure, drawn in a 180-wide box, h tall; the head sits near the top
  S.svg = function (person, attrs, opts) {
    opts = opts || {};
    const g = person.grey;
    const h = Math.round(g.h * (opts.scale || 600));
    const W = 180;
    const fill = g.fill;
    const dark = shade(fill, 0.7);
    const parts = [];
    const cx = W / 2;
    if (g.shape === "person") {
      const hr = 46;
      const hy = hr + 14;
      parts.push(`<rect x="${cx - 70}" y="${hy + hr - 6}" width="140" height="${h - hy - hr + 6}" rx="46" fill="${fill}"/>`);
      if (attrs.gender === "f") parts.push(`<path d="M${cx - hr - 8},${hy + 16} Q${cx},${hy - hr - 30} ${cx + hr + 8},${hy + 16} L${cx + hr + 14},${hy + hr + 40} L${cx - hr - 14},${hy + hr + 40} Z" fill="${dark}"/>`);
      parts.push(`<g class="head"><circle cx="${cx}" cy="${hy}" r="${hr}" fill="${shade(fill, 1.12)}"/>`);
      parts.push(`<circle cx="${cx - 16}" cy="${hy - 4}" r="5" fill="#3b2a1e"/><circle cx="${cx + 16}" cy="${hy - 4}" r="5" fill="#3b2a1e"/>`);
      parts.push(`<path d="M${cx - 12},${hy + 20} Q${cx},${hy + 28} ${cx + 12},${hy + 20}" stroke="#3b2a1e" stroke-width="3" fill="none"/>`);
      if (person.fixed && person.fixed.age === "old" && attrs.gender === "m") parts.push(`<path d="M${cx - 30},${hy + 18} Q${cx},${hy + 70} ${cx + 30},${hy + 18}" fill="#eee" opacity="0.85"/>`);
      if (attrs.wears === "glasses") parts.push(`<g stroke="#222" stroke-width="4" fill="rgba(200,230,255,0.35)"><circle cx="${cx - 17}" cy="${hy - 4}" r="13"/><circle cx="${cx + 17}" cy="${hy - 4}" r="13"/><line x1="${cx - 4}" y1="${hy - 4}" x2="${cx + 4}" y2="${hy - 4}"/></g>`);
      if (attrs.wears === "cap") parts.push(`<path d="M${cx - hr + 2},${hy - 14} Q${cx},${hy - hr - 26} ${cx + hr - 2},${hy - 14} Z" fill="#fbfbf6" stroke="#ccc" stroke-width="2"/>`);
      parts.push(`</g>`);
    } else if (g.shape === "cat") {
      const hr = 44;
      const hy = hr + 30;
      parts.push(`<ellipse cx="${cx}" cy="${hy + hr + (h - hy - hr) / 2}" rx="68" ry="${(h - hy - hr) / 2 + 20}" fill="${fill}"/>`);
      parts.push(`<g class="head"><path d="M${cx - 40},${hy - 20} L${cx - 30},${hy - hr - 28} L${cx - 8},${hy - hr + 4} Z M${cx + 40},${hy - 20} L${cx + 30},${hy - hr - 28} L${cx + 8},${hy - hr + 4} Z" fill="${dark}"/>`);
      parts.push(`<circle cx="${cx}" cy="${hy}" r="${hr}" fill="${shade(fill, 1.08)}"/>`);
      parts.push(`<ellipse cx="${cx - 16}" cy="${hy - 6}" rx="6" ry="8" fill="#3b2a1e"/><ellipse cx="${cx + 16}" cy="${hy - 6}" rx="6" ry="8" fill="#3b2a1e"/>`);
      parts.push(`<path d="M${cx - 6},${hy + 10} L${cx + 6},${hy + 10} L${cx},${hy + 17} Z" fill="#c9788a"/>`);
      parts.push(`<g stroke="#3b2a1e" stroke-width="2"><line x1="${cx - 12}" y1="${hy + 16}" x2="${cx - 48}" y2="${hy + 10}"/><line x1="${cx - 12}" y1="${hy + 20}" x2="${cx - 48}" y2="${hy + 24}"/><line x1="${cx + 12}" y1="${hy + 16}" x2="${cx + 48}" y2="${hy + 10}"/><line x1="${cx + 12}" y1="${hy + 20}" x2="${cx + 48}" y2="${hy + 24}"/></g></g>`);
    } else {
      const hr = 36;
      const hy = hr + 20;
      parts.push(`<ellipse cx="${cx}" cy="${hy + hr + (h - hy - hr) / 2}" rx="56" ry="${(h - hy - hr) / 2 + 16}" fill="${fill}"/>`);
      parts.push(`<g class="head"><circle cx="${cx}" cy="${hy}" r="${hr}" fill="${shade(fill, 1.1)}"/>`);
      parts.push(`<circle cx="${cx - 12}" cy="${hy - 6}" r="5" fill="#3b2a1e"/><path d="M${cx + 8},${hy - 2} L${cx + 46},${hy + 8} L${cx + 8},${hy + 18} Z" fill="#e89a2a"/></g>`);
    }
    return `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>`;
  };

  S.height = (person, scene) => Math.round(person.grey.h * scene.figure.scale);

  // a held item: the existing item art when there is one, else a drawn swatch
  S.heldHTML = function (a, cls) {
    if (!a) return "";
    if (a.img) return `<img class="held ${cls || ""}" src="${a.img}" alt="" draggable="false" onerror="this.outerHTML='<div class=&quot;held drawn ${cls || ""}&quot; style=&quot;background:${a.colour}&quot;></div>'">`;
    return `<div class="held drawn ${cls || ""}" style="background:${a.colour}"></div>`;
  };

  S.mount = function (world, s, i, x, P, scene) {
    const person = P.who.people[s.id];
    const h = S.height(person, scene);
    const base = scene.figure.base[person.kind] || scene.figure.base.person;
    const el = document.createElement("div");
    el.className = "sus";
    el.dataset.i = i;
    const fig = document.createElement("div");
    fig.className = "fig";
    fig.style.left = `${x - scene.figure.width / 2}px`;
    fig.style.top = `${base - h}px`;
    fig.innerHTML = S.svg(person, s.attrs);
    const hands = document.createElement("div");
    hands.className = "hands";
    const hs = scene.hands;
    const pawFill = shade(person.grey.fill, 1.05);
    hands.style.left = `${x - hs.dx - hs.w}px`;
    hands.style.top = `${scene.ledgeY - hs.h / 2}px`;
    hands.style.width = `${2 * (hs.dx + hs.w)}px`;
    hands.style.height = `${hs.h}px`;
    hands.innerHTML =
      `<div class="paw" style="left:0;top:0;width:${hs.w}px;height:${hs.h}px;background:${pawFill}"></div>` +
      `<div class="paw" style="right:0;top:0;width:${hs.w}px;height:${hs.h}px;background:${pawFill}"></div>`;
    if (s.attrs.holds) {
      const a = Who.Case.attrOf(P, "holds", s.attrs.holds);
      const wrap = document.createElement("div");
      wrap.innerHTML = S.heldHTML(a);
      const img = wrap.firstChild;
      img.style.left = `${2 * (hs.dx + hs.w) - hs.item.size / 2 - 6}px`;
      img.style.top = `${hs.item.dy + hs.h}px`;
      hands.appendChild(img);
    }
    el.appendChild(fig);
    el.appendChild(hands);
    world.appendChild(el);
    return { el, fig, hands, x, top: base - h, base, h };
  };

  // the dealt card / close-up: the figure with its item and a visible trace
  S.cardSVG = function (P, s) {
    const person = P.who.people[s.id];
    const svg = S.svg(person, s.attrs);
    const t = s.attrs.trace ? Who.Case.attrOf(P, "trace", s.attrs.trace) : null;
    const hd = s.attrs.holds ? Who.Case.attrOf(P, "holds", s.attrs.holds) : null;
    return `<div class="card-fig" style="position:relative;display:inline-block">${svg}` +
      `<div style="display:flex;gap:10px;justify-content:center;align-items:center;margin-top:-8px">` +
      `<span style="width:42px;height:26px;border-radius:50%;background:${shade(person.grey.fill, 1.05)};box-shadow:inset 0 0 0 9px ${t ? t.colour : "transparent"};display:inline-block"></span>` +
      `<span style="width:42px;height:26px;border-radius:50%;background:${shade(person.grey.fill, 1.05)};box-shadow:inset 0 0 0 9px ${t ? t.colour : "transparent"};display:inline-block"></span>` +
      (hd ? `<span style="display:inline-block;width:60px;height:60px;position:relative">${S.heldHTML(hd, "card-held").replace('class="held', 'style="width:60px;height:60px;position:static" class="held')}</span>` : "") +
      `</div></div>`;
  };
})(window);
