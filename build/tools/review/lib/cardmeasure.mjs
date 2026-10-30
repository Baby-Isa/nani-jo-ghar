// S14 tools, B9 (SH-165, SH-168): the lab check's two measures on a page's cards, in one place so labcheck.mjs (a lab page, cook.html,
// lab.html, the clinic's states) and the unit tests read the same code. In the page: SPILLS (every word that leaves its card) and
// SPACING (the side-by-side word card's speaker: how far it sits from its words and from the card's edge, against the item card's own
// speaker padding). Out of the page: judgeSpacing.
//
// Zafar, 29 Oct (SH-165): "the speaker shouldn't sit so far over to the right. Make it padded to the right of the item card the same
// amount the speaker is padded to the bottom of the item cards ... If needed though it can move over when the word requires": the
// speaker follows its words at one fixed gap, the item card's speaker padding, and is never pushed to the card's far edge.

// each word that leaves the card it is in (the nearest box with a fill, an edge or a shadow): [description]
export const SPILLS = () => {
  const shown = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05; };
  const cardOf = (el) => {
    for (let x = el; x && x !== document.body; x = x.parentElement) {
      const s = getComputedStyle(x);
      if (/hidden|clip|auto|scroll/.test(s.overflowX + s.overflowY)) return null; // clipped, not spilled (the text-clipped lint's)
      const fill = s.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor);
      if (fill || parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== "none") return x;
    }
    return null;
  };
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const s = (n.nodeValue || "").trim();
    if (!s || !n.parentElement || !shown(n.parentElement) || n.parentElement.closest("script, style, .opts")) continue;
    const card = cardOf(n.parentElement);
    if (!card) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect(), c = card.getBoundingClientRect();
    if (r.width < 1) continue;
    const over = Math.max(c.left - r.left, r.right - c.right, c.top - r.top, r.bottom - c.bottom);
    if (over > 2) out.push(`"${s.slice(0, 30)}" ${Math.round(over)} px outside ${card.tagName.toLowerCase()}.${String(card.className).split(" ").slice(0, 2).join(".")}`);
  }
  return [...new Set(out)];
};

// the word cards' speakers: for each visible big word card (.wc14-big) with a speaker (.wc14-spk): its kind (side-by-side or stacked),
// the card's box, the speaker's, the words' glyph box (the right edge of its text), in page px
export const SPACING = () => {
  const shown = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 2 && r.height > 2 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.3; };
  const box = (r) => [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.right * 10) / 10, Math.round(r.bottom * 10) / 10];
  const out = [];
  document.querySelectorAll(".wc14-big").forEach((card) => {
    if (!shown(card) || card.closest(".wc14-flyer")) return;
    const spk = card.querySelector(".wc14-spk");
    if (!spk || !shown(spk)) return;
    // the words: the Kutchi text's own glyphs (the range of its text, not its box, which may be wider)
    const k = card.querySelector(".wc14-k") || card.querySelector("[class*='wc14-k']");
    let words = null;
    if (k) { const rg = document.createRange(); rg.selectNodeContents(k); const r = rg.getBoundingClientRect(); if (r.width > 1) words = box(r); }
    const tokenGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--njg-card14-spk-gap")) || null;
    out.push({ side: card.classList.contains("wc14-side"), card: box(card.getBoundingClientRect()), spk: box(spk.getBoundingClientRect()), words, tokenGap, cls: String(card.className).slice(0, 60) });
  });
  return out;
};

export const SPACING_TOL = 3;       // px: a gap within this of the item card's own speaker padding is the same gap
/**
 * rows: SPACING()'s. The reference is the stacked card's speaker padding to its bottom edge (the item card's), else the page's token.
 * A side-by-side card must hold its speaker beside its words at that gap (never further, unless the word is too long for the card: the
 * speaker then sits at the card's right padding), and its right padding must be no more than the reference when the speaker sits at the end.
 * -> [{ok, what}]
 */
export function judgeSpacing(rows, { tol = SPACING_TOL } = {}) {
  const stacked = rows.find((r) => !r.side);
  const pad = stacked ? stacked.card[3] - stacked.spk[3] : null;
  const out = [];
  for (const r of rows.filter((x) => x.side)) {
    const ref = pad != null ? pad : r.tokenGap;
    if (ref == null) { out.push({ ok: null, what: "side-by-side card: no item card or token on the page to measure its speaker's gap against" }); continue; }
    const padRight = r.card[2] - r.spk[2];
    const gap = r.words ? r.spk[0] - r.words[2] : null;
    if (gap == null) { out.push({ ok: null, what: "side-by-side card: its words have no glyphs to measure from" }); continue; }
    // the speaker follows the words at the reference gap; if it sits further, the card's far edge is what holds it (the word needed the room)
    const atEdge = padRight <= ref + tol;
    const ok = (gap <= ref + tol && gap >= 0) || atEdge;
    out.push({ ok, what: `side-by-side card: the speaker is ${Math.round(gap)} px from its words and ${Math.round(padRight)} px from the card's right edge; the item card pads its speaker ${Math.round(ref)} px${ok ? "" : ` (the speaker sits ${Math.round(gap - ref)} px too far from its words and is not at the edge either)`}` });
  }
  return out;
}
