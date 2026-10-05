// The screen lint: measures what is ON SCREEN (computed styles and boxes), not the code.
// `pageLint` runs inside the page; `lintPage(page)` is the Node side. The sandbox (build/sandbox)
// calls it at every recorded state and size. It never touches game code: the click-listener
// recorder (CLICK_HOOK) is injected with page.addInitScript.
//
// Checks (only on VISIBLE elements: shown, not fully clipped, not parked off screen):
//   text-clipped     text cut off by its own box or a parent with overflow hidden/clip (TXT-01, TXT-02)
//   ellipsis         text-overflow: ellipsis (or a line clamp) that is actually truncating (TXT-01)
//   text-small       text rendered under 14 px, transforms included (TXT-05)
//   tap-small        a tappable thing under 48x48 px (LAY-04)
//   text-offscreen   text running outside the viewport
//   tap-offscreen    a tappable thing partly outside the viewport
//   page-scroll      the page itself scrolls (LAY-02)
//   scroll-container a visible box that scrolls (a scroll bar on a child screen, CMP-07)
//   covered          something sits on top of a tappable thing: the topmost element at its visible centre is neither it nor
//                    its child (LAY-06). A full-screen scrim or modal over everything is by design and not reported.
//   covers-play-area something other than the canvas is on top of the middle of the play area (LAY-06)
//   word-broken      a word split across two lines, mid-word (TXT-10)
// Off-screen findings on a thing that is moving (a belt dish, a slide-in) are dropped: it is passing through, not parked there.
// Each finding: {check, selector, measured, text}.

export const CLICK_HOOK = `(() => {
  if (window.__njgClickables) return;
  const list = (window.__njgClickables = []);
  const seen = new WeakSet();
  const kinds = new Set(["click", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"]);
  const orig = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    try {
      if (kinds.has(type) && this instanceof Element && !seen.has(this)) { seen.add(this); list.push(new WeakRef(this)); }
    } catch (e) {}
    return orig.call(this, type, fn, opts);
  };
})();`;

// Runs in the page. Self-contained (it is serialised with toString()).
export async function pageLint(opts) {
  const MIN_TEXT = (opts && opts.minText) || 14;
  const MIN_TAP = (opts && opts.minTap) || 48;
  const TOL = 1.5;
  const vw = window.innerWidth, vh = window.innerHeight;
  const out = [];
  const csCache = new Map();
  const cs = (el) => { let c = csCache.get(el); if (!c) { c = getComputedStyle(el); csCache.set(el, c); } return c; };
  const STATE = new Set("in on off live show shown active hidden done ok holding pulse throb reading glow open closed ready wrong right bad good sel selected current lit dim flash shake pop fade fading visible enter leave idle busy hover focus pressed".split(" "));

  function seg(el) {
    const tag = el.tagName.toLowerCase();
    if (el.id && !/\d{3,}/.test(el.id)) return tag + "#" + el.id;
    const cls = (typeof el.className === "string" ? el.className : (el.className && el.className.baseVal) || "")
      .split(/\s+/).filter((c) => c && !STATE.has(c) && !/\d/.test(c)).sort().slice(0, 2);
    return tag + (cls.length ? "." + cls.join(".") : "");
  }
  function selector(el) {
    const parts = [];
    for (let n = el, i = 0; n && n.nodeType === 1 && i < 4; n = n.parentElement, i++) {
      parts.unshift(seg(n));
      if (n.id && !/\d{3,}/.test(n.id)) break;
      if (n === document.body) break;
    }
    return parts.join(" > ");
  }

  // ---- visibility ----
  const opCache = new Map();
  function opacity(el) {
    if (!el || el === document.documentElement) return 1;
    let v = opCache.get(el);
    if (v === undefined) { v = (parseFloat(cs(el).opacity) || 0) * opacity(el.parentElement); opCache.set(el, v); }
    return v;
  }
  function clipAncestors(el) {
    const res = [];
    let pos = cs(el).position;
    for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      const c = cs(n);
      const transformed = c.transform !== "none" || c.filter !== "none" || c.perspective !== "none";
      const positioned = c.position !== "static";
      if (pos === "fixed" && !transformed) continue;
      if (pos === "absolute" && !positioned && !transformed) continue;
      if (c.overflowX !== "visible" || c.overflowY !== "visible") res.push(n);
      pos = c.position;
    }
    return res;
  }
  function padBox(n) {
    const r = n.getBoundingClientRect();
    const sx = n.offsetWidth ? r.width / n.offsetWidth : 1, sy = n.offsetHeight ? r.height / n.offsetHeight : 1;
    const l = r.left + n.clientLeft * sx, t = r.top + n.clientTop * sy;
    return { left: l, top: t, right: l + n.clientWidth * sx, bottom: t + n.clientHeight * sy };
  }
  function inter(a, b) {
    return { left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) };
  }
  // the part of el that can be seen, or null (hidden, transparent, parked off screen, fully clipped)
  function shown(el, rect) {
    const c = cs(el);
    if (c.visibility !== "visible" || c.display === "none") return null;
    if (opacity(el) < 0.05) return null;
    if (rect.width <= 0 && rect.height <= 0) return null;
    let vis = inter(rect, { left: 0, top: 0, right: vw, bottom: vh });
    for (const a of clipAncestors(el)) {
      const c2 = cs(a);
      const b = padBox(a);
      if (c2.overflowX === "visible") { b.left = -1e9; b.right = 1e9; }
      if (c2.overflowY === "visible") { b.top = -1e9; b.bottom = 1e9; }
      vis = inter(vis, b);
    }
    if (vis.right - vis.left <= 0 || vis.bottom - vis.top <= 0) return null;
    return vis;
  }

  const moving = []; // off-screen findings re-measured later: a thing that is moving (a belt, a slide-in) is not parked off screen
  const add = (check, el, measured, extra) => out.push(Object.assign({ check, selector: selector(el), measured, text: ((extra && extra.text) || (el.textContent || "").trim()).replace(/\s+/g, " ").slice(0, 30) }, extra && extra.detail ? { detail: extra.detail } : {}));

  // ---- text ----
  function ownTextRects(el) {
    const rects = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 0 && q.height > 0) rects.push(q);
    }
    return rects;
  }
  function scaleOf(el) {
    if (el instanceof SVGElement) {
      try { const m = el.getScreenCTM(); if (m) return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1; } catch (e) {}
      return 1;
    }
    // the scale is the product of the ancestors' transforms, not rect/offsetWidth (wrong for a wrapped inline span)
    let k = 1;
    for (let a = el; a && a.nodeType === 1; a = a.parentElement) {
      const t = cs(a).transform;
      if (!t || t === "none") continue;
      try { const m = new DOMMatrixReadOnly(t); const d = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); if (d > 0 && isFinite(d)) k *= d; } catch (e) {}
    }
    return k;
  }
  const all = document.querySelectorAll("body *");
  for (const el of all) {
    const tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "OPTION" || tag === "TEMPLATE") continue;
    const isField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    const rects = isField ? [el.getBoundingClientRect()] : ownTextRects(el);
    if (!rects.length) continue;
    const box = el.getBoundingClientRect();
    const vis = shown(el, box.width || box.height ? box : rects[0]);
    if (!vis) continue;
    const c = cs(el);
    const fs = parseFloat(c.fontSize) || 0;
    const sc = scaleOf(el);
    const eff = fs * sc;
    // 14 px text under a fitted scale of 0.99x reads 13.9 px: sub-pixel noise (the glyphs render at 14 px), not small text; the floor is 0.15 px under the minimum
    if (eff > 0 && eff < MIN_TEXT - 0.15) add("text-small", el, eff.toFixed(1) + "px", { detail: `font-size ${fs}px x scale ${sc.toFixed(2)}` });
    if (isField) continue;
    // text rectangle (union of own text)
    let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
    for (const q of rects) { L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); }
    // ellipsis / line clamp that is actually truncating
    const clamp = c.webkitLineClamp && c.webkitLineClamp !== "none";
    let ell = false;
    if (c.textOverflow === "ellipsis" && c.overflowX !== "visible" && el.scrollWidth > el.clientWidth + 1) { ell = true; add("ellipsis", el, `${el.scrollWidth}px of text in ${el.clientWidth}px`); }
    else if (clamp && el.scrollHeight > el.clientHeight + 1) { ell = true; add("ellipsis", el, `line-clamp ${c.webkitLineClamp}: ${el.scrollHeight}px of text in ${el.clientHeight}px`); }
    // clipped by its own box or a parent (overflow hidden / clip)
    let clipped = null;
    for (const a of [el, ...clipAncestors(el)]) {
      const ca = cs(a);
      const hx = ca.overflowX === "hidden" || ca.overflowX === "clip";
      const hy = ca.overflowY === "hidden" || ca.overflowY === "clip";
      if (!hx && !hy) continue;
      if (a === el && ell) continue;
      const b = padBox(a);
      const slop = fs * sc * 0.3;
      let px = 0;
      if (hx) px = Math.max(px, R - b.right, b.left - L);
      if (hy) px = Math.max(px, B - (b.bottom + slop), (b.top - slop) - T);
      if (px > TOL && (!clipped || px > clipped.px)) clipped = { px, a };
    }
    if (clipped && !ell) add("text-clipped", el, `cut by ${Math.round(clipped.px)}px`, { detail: clipped.a === el ? "its own box" : "parent " + selector(clipped.a) });
    // a word split across two lines (not at a hyphen or a space)
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || n.nodeValue.length > 600) continue;
      const re = /[^\s\u00ad\-\u2010-\u2014]{3,}/g;
      let m, broke = null;
      while (!broke && (m = re.exec(n.nodeValue))) {
        const rg = document.createRange();
        rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
        const rs = Array.from(rg.getClientRects()).filter((q) => q.width > 0.5 && q.height > 0);
        if (rs.length > 1 && Math.max(...rs.map((q) => q.top)) - Math.min(...rs.map((q) => q.top)) > rs[0].height * 0.6) broke = m[0];
      }
      if (broke) { add("word-broken", el, `"${broke}" is split across lines`, { text: broke }); break; }
    }
    // outside the viewport
    const out_ = Math.max(-L, -T, R - vw, B - vh);
    if (out_ > TOL) { add("text-offscreen", el, `${Math.round(out_)}px outside the screen`); moving.push([out[out.length - 1], el, el.getBoundingClientRect()]); }
  }

  // ---- covering (LAY-06) ----
  // a full-viewport fixed scrim or modal over everything is by design (the results card, the first-time help, a panel)
  const scrimCache = new Map();
  function inScrim(n) {
    for (let a = n; a && a !== document.documentElement; a = a.parentElement) {
      let v = scrimCache.get(a);
      if (v === undefined) {
        const c = cs(a);
        const r = a.getBoundingClientRect();
        v = (c.position === "fixed" || c.position === "absolute") && r.width >= vw * 0.9 && r.height >= vh * 0.9 && a !== document.body;
        scrimCache.set(a, v);
      }
      if (v) return true;
    }
    return false;
  }
  const modalLike = (n) => !!(n.closest && n.closest(".njg-onboard, [role=dialog], dialog, [aria-modal=true]"));

  // ---- tap targets ----
  const cand = new Set(document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=radio], [role=tab], [role=checkbox], [role=switch], [role=link], [onclick]'));
  for (const w of window.__njgClickables || []) {
    const el = w.deref();
    if (el && el.isConnected && el !== document.body && el !== document.documentElement && el.tagName !== "CANVAS" && el.tagName !== "HTML") cand.add(el);
  }
  for (const el of cand) {
    if (!el.isConnected) continue;
    const c = cs(el);
    if (c.pointerEvents === "none" || el.disabled) continue;
    const r = el.getBoundingClientRect();
    const vis = shown(el, r);
    if (!vis) continue;
    // a big container with a delegated listener is not a button
    if (r.width * r.height > vw * vh * 0.4) continue;
    // an SVG child with no size of its own (a <g>) measures by its box
    if (r.width < MIN_TAP - 0.5 || r.height < MIN_TAP - 0.5) add("tap-small", el, `${Math.round(r.width)}x${Math.round(r.height)}px`);
    // covered: the topmost element at the middle of what can be seen of it
    {
      const cx = (vis.left + vis.right) / 2, cy = (vis.top + vis.bottom) / 2;
      const top = document.elementFromPoint(cx, cy);
      if (top && top !== el && !el.contains(top) && !(top.tagName === "LABEL" && (top.contains(el) || top.control === el)) && !inScrim(top) && !modalLike(top)) {
        const own = el.closest && el.closest("[role=dialog], dialog, [aria-modal=true]");
        if (!(own && own.contains(top))) { add("covered", el, `covered by ${selector(top)} at (${Math.round(cx)},${Math.round(cy)})`, { detail: selector(top) }); moving.push([out[out.length - 1], top, top.getBoundingClientRect()]); } // a cover that is moving is passing by
      }
    }
    const o = Math.max(-r.left, -r.top, r.right - vw, r.bottom - vh);
    if (o > TOL) { add("tap-offscreen", el, `${Math.round(o)}px outside the screen`); moving.push([out[out.length - 1], el, r]); }
  }

  // ---- the play area: nothing but the canvas on top of its middle (LAY-06) ----
  {
    let cv = null, best = 0;
    for (const c of document.querySelectorAll("canvas")) {
      const r = c.getBoundingClientRect();
      if (shown(c, r) && r.width * r.height > best) { best = r.width * r.height; cv = c; }
    }
    if (cv && best > vw * vh * 0.4) {
      const r = cv.getBoundingClientRect();
      const seenTop = new Set();
      for (const fx of [0.4, 0.55, 0.7]) for (const fy of [0.3, 0.5, 0.7]) {
        const x = Math.min(vw - 1, Math.max(0, r.left + r.width * fx)), y = Math.min(vh - 1, Math.max(0, r.top + r.height * fy));
        const top = document.elementFromPoint(x, y);
        if (!top || top === cv || cv.contains(top) || inScrim(top) || modalLike(top) || seenTop.has(top)) continue;
        seenTop.add(top);
        add("covers-play-area", top, `on top of the play area at (${Math.round(x)},${Math.round(y)})`);
        moving.push([out[out.length - 1], top, top.getBoundingClientRect()]);
      }
    }
  }

  // ---- scrolling ----
  const se = document.scrollingElement || document.documentElement;
  const ho = cs(document.documentElement).overflowX, hb = cs(document.body).overflowX;
  const vo = cs(document.documentElement).overflowY, vb = cs(document.body).overflowY;
  const hidden = (a, b) => a === "hidden" || a === "clip" || (a === "visible" && (b === "hidden" || b === "clip"));
  if (se.scrollWidth > vw + 1 && !hidden(ho, hb)) out.push({ check: "page-scroll", selector: "html", measured: `sideways: ${se.scrollWidth}px in ${vw}px`, text: "" });
  if (se.scrollHeight > vh + 1 && !hidden(vo, vb)) out.push({ check: "page-scroll", selector: "html", measured: `down: ${se.scrollHeight}px in ${vh}px`, text: "" });
  for (const el of all) {
    const c = cs(el);
    const sx = (c.overflowX === "auto" || c.overflowX === "scroll") && el.scrollWidth > el.clientWidth + 1;
    const sy = (c.overflowY === "auto" || c.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1;
    if (!sx && !sy) continue;
    if (!shown(el, el.getBoundingClientRect())) continue;
    add("scroll-container", el, (sx ? `sideways ${el.scrollWidth}>${el.clientWidth}` : "") + (sx && sy ? ", " : "") + (sy ? `down ${el.scrollHeight}>${el.clientHeight}` : ""));
  }
  if (moving.length) {
    await new Promise((res) => setTimeout(res, 120));
    for (const [f, el, r0] of moving) {
      const r1 = el.getBoundingClientRect();
      if (Math.abs(r1.left - r0.left) > 1.5 || Math.abs(r1.top - r0.top) > 1.5) out.splice(out.indexOf(f), 1);
    }
  }
  // one finding per (check, selector): keep the worst-looking first
  const seen = new Map();
  for (const f of out) { const k = f.check + "|" + f.selector; if (!seen.has(k)) seen.set(k, f); else seen.get(k).count = (seen.get(k).count || 1) + 1; }
  return Array.from(seen.values());
}

export async function lintPage(page, opts = {}) {
  return page.evaluate(`(${pageLint.toString()})(${JSON.stringify(opts)})`);
}
