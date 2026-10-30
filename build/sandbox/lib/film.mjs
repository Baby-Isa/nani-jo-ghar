// S14 tools, B1 (SH-167): the evidence tool's film. A strip of more than FILM_FROM frames is a film: every frame is taken on the
// clock, the frames where the picture changed go on the sheet (pickKeys), and a text table lists every frame (slot, real ms, how
// much changed, where the pop-out and the order row were).
//
// Why the old strips said "did not change" (found 30 Oct, s14-tools, from the before run of SH-152, SH-154, CHAI-39, SH-157):
//  1. The window was too short and started too late. A strip began at the first big card of the order (`visible:.wc14-pop`, found by an
//     80 ms poll) and filmed 1.2 s (8 x 150 ms), or 1 s and 2 s (the brief's extra 4 x 250 and 4 x 500). Chai's order lasts 6-14 s: the
//     row's glide came 0.1 s after the pop appeared (before the first frame), the card's flight into the row 1.3 s after it (after
//     the last frame). In between nothing moved in the crop.
//  2. The crop was the order card alone (#mission): the pop-out, which is the thing that moves, is outside it.
//  3. "Moved" was the largest difference against the first frame only, over a mean, so a small card sliding in a big crop read as 0.
// The fix: a film takes the whole order (from `life:request`, 10-15 s), of the whole screen, and judges motion between neighbours.
import { FILM_KEEP } from "./evidence.mjs";

// the page's facts at one frame: where the big card and the cards in flight are, how far the order row is scrolled, the bubbles,
// every face (njgTest.faces(), B2) when the page has the hook
export const FILM_FACTS = `(() => {
  const r = (e) => { const b = e.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
  const q = (s) => Array.from(document.querySelectorAll(s)).filter((e) => e.getBoundingClientRect().width > 2).map(r);
  const row = document.querySelector(".oc-row14");
  let faces = null;
  try { const T = window.njgTest; const h = T && (T.faces ? T : T.cook && T.cook.faces ? T.cook : T.clinic && T.clinic.faces ? T.clinic : null); faces = h ? h.faces().map((x) => [x.left, x.top, x.right, x.bottom].map(Math.round)) : null; } catch (e) { faces = null; }
  return { pop: q(".wc14-pop"), fly: q(".wc14-flyer"), row: row ? Math.round(row.scrollLeft) : null, bub: q(".cv-bubble").length, faces };
})()`;

// a small picture of a frame to compare: every STEP-th pixel's RGB of the (already cropped) RGBA image
export function sigOf(img, step = 0) {
  const n = img.w * img.h;
  const st = step || Math.max(1, Math.floor(n / 24000));
  const out = new Uint8Array(Math.ceil(n / st) * 3);
  let j = 0;
  for (let i = 0; i < n; i += st) { const o = i * 4; out[j++] = img.data[o]; out[j++] = img.data[o + 1]; out[j++] = img.data[o + 2]; }
  return out;
}
// mean difference of two signatures, 0-255 per channel (the evidence tool's frameDiff scale); 255 when the sizes differ
export function sigDiff(a, b) {
  if (!a || !b || a.length !== b.length) return 255;
  let d = 0;
  for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]);
  return d / a.length;
}
// a crop of an RGBA image {w, h, data} (x, y, width, height in its px)
export function cropImg(img, x, y, w, h) {
  x = Math.max(0, Math.min(img.w - 1, x)); y = Math.max(0, Math.min(img.h - 1, y));
  w = Math.max(1, Math.min(img.w - x, w)); h = Math.max(1, Math.min(img.h - y, h));
  const data = Buffer.alloc(w * h * 4);
  for (let r = 0; r < h; r++) img.data.copy(data, r * w * 4, ((y + r) * img.w + x) * 4, ((y + r) * img.w + x + w) * 4);
  return { w, h, data };
}
// the frames to show: the first, the last, and the ones where the cumulative change crosses equal steps, so a still stretch costs
// no frame and a flight of 0.6 s gets several. diffs[k] is the change from frame k-1 to k (diffs[0] = 0). Returns sorted indexes.
export function pickKeys(diffs, keep = FILM_KEEP, still = 0.05) {
  const n = diffs.length;
  if (n <= keep) return diffs.map((_, k) => k);
  const total = diffs.reduce((s, d, k) => s + (k && d > still ? d : 0), 0);
  const keys = new Set([0, n - 1]);
  if (total > 0) {
    let cum = 0;
    const cums = diffs.map((d, k) => (cum += k && d > still ? d : 0));
    for (let j = 1; j < keep - 1; j++) {
      const want = (j * total) / (keep - 1);
      const k = cums.findIndex((c) => c >= want);
      if (k >= 0) keys.add(k);
    }
  }
  return [...keys].sort((a, b) => a - b);
}
// did anything move? the largest change between two neighbouring frames (not against the first: a glide that is over by the end
// of a long strip still shows), and how many neighbours changed
export function filmMotion(diffs, still = 0.05) {
  const moved = diffs.filter((d, k) => k && d > still);
  return { moving: moved.length > 0, steps: moved.length, max: Math.round(Math.max(0, ...diffs) * 100) / 100 };
}
// the per-frame table: slot ms, real ms, change from the last frame, the page's facts, * for the frames on the sheet
export function filmTable({ times = [], ms = 0, diffs = [], facts = [], keys = [] }) {
  const box = (b) => (b ? `[${b.join(",")}]` : "");
  const lines = ["frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces"];
  times.forEach((t, k) => {
    const f = facts[k] || {};
    lines.push(`${String(k).padStart(3)}${keys.includes(k) ? "*" : " "} ${String(k * ms).padStart(7)} ${String(t).padStart(7)} ${(diffs[k] || 0).toFixed(2).padStart(6)}  ${(f.pop || []).map(box).join(" ").padEnd(24)} ${String((f.fly || []).length).padStart(4)}  ${String(f.row == null ? "-" : f.row).padStart(4)}  ${String(f.bub == null ? "-" : f.bub).padStart(5)}  ${f.faces ? f.faces.length : "-"}`);
  });
  return lines.join("\n");
}
