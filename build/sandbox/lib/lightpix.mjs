// S14 tools, B8 (SH-164, Zafar 29 Oct: "the highlight on the burner isn't clear enough because the burner is black ... it might need
// lightening inside the highlight box"): the light's contrast, measured on the picture. A beat after the first-time help's light comes up
// (the S14 hook's k "lit" event) the sandbox takes the screen twice, with the light and without it (its layer hidden for one frame), and
// measures each lit box: the mean brightness inside it (8 px in from its edge) with the light and under it. On a dark thing (under it,
// darker than DARK_BELOW of 255) the light must lift the inside by at least LIGHT_LIFT: the soft warm fill. A lit black burner that
// looks as black as it did is a lit box nobody can see. (The dimmed screen round the box is measured too, for the sheet's words.)
import { decodePng } from "../../tools/review/lib/png.mjs";

export const DARK_BELOW = 110;        // of 255: what is under the box is a dark thing
export const LIGHT_LIFT = 12;         // of 255: the light lifts a dark thing's inside by at least this (set from chai on 30 Oct, see s14-tools.md)
const INSET = 8;                      // px in from the box's edge (the lit box's own gold line and glow are not "inside")
const OUTSET = [8, 34];               // the ring of dimmed screen: from 8 to 34 px outside the box
export const lum = (data, o) => 0.3 * data[o] + 0.59 * data[o + 1] + 0.11 * data[o + 2];

function meanIn(img, l, t, r, b, step) {
  let s = 0, n = 0;
  for (let y = Math.max(0, Math.floor(t)); y < Math.min(img.h, Math.ceil(b)); y += step) for (let x = Math.max(0, Math.floor(l)); x < Math.min(img.w, Math.ceil(r)); x += step) { s += lum(img.data, (y * img.w + x) * 4); n++; }
  return n ? s / n : null;
}
function meanRing(img, l, t, r, b, k, step) {
  let s = 0, n = 0;
  for (let y = Math.max(0, Math.floor(t - OUTSET[1] * k)); y < Math.min(img.h, Math.ceil(b + OUTSET[1] * k)); y += step) {
    for (let x = Math.max(0, Math.floor(l - OUTSET[1] * k)); x < Math.min(img.w, Math.ceil(r + OUTSET[1] * k)); x += step) {
      const d = Math.hypot(Math.max(l - x, 0, x - r), Math.max(t - y, 0, y - b));
      if (d >= OUTSET[0] * k && d <= OUTSET[1] * k) { s += lum(img.data, (y * img.w + x) * 4); n++; }
    }
  }
  return n ? s / n : null;
}

/**
 * lit, under: images {w, h, data (RGBA)} of the page with the light and without it (same size); holes [[l, t, r, b]] in page px; vw the
 * page's width (the image may be at another scale) -> [{box, lin, under, lift, lout}] (numbers null where a box is too small).
 */
export function measureLight(lit, under, holes, vw = lit.w) {
  const k = lit.w / vw;
  return holes.map((hb) => {
    const [l, t, r, b] = hb.map((v) => v * k);
    const inL = l + INSET * k, inT = t + INSET * k, inR = r - INSET * k, inB = b - INSET * k;
    if (inR - inL < 6 || inB - inT < 6) return { box: hb, lin: null, under: null, lift: null, lout: null };
    const step = Math.max(2, Math.round(3 * k));
    const lin = meanIn(lit, inL, inT, inR, inB, step), un = under ? meanIn(under, inL, inT, inR, inB, step) : null, lout = meanRing(lit, l, t, r, b, k, step);
    const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
    return { box: hb, lin: r1(lin), under: r1(un), lift: lin != null && un != null ? r1(lin - un) : null, lout: r1(lout) };
  });
}

/**
 * The sandbox's side: on a "lit" event, a beat later (the light has faded in), if the same light is still up, shoot with the light, hide
 * its layer for one frame, shoot again, show it; push the measure into the sound log as {type: "c", k: "lightpix"}. Never throws.
 */
export function lightPix(e, page, sound, { wait = 550 } = {}) {
  if (!e || e.type !== "c" || e.k !== "lit" || !e.holes || !e.holes.length) return;
  setTimeout(async () => {
    try {
      const HOLES = () => { const o = []; for (const l of document.querySelectorAll(".njg-onboard.on:not(.ob-empty)")) { try { for (const h of JSON.parse(l.dataset.holes || "[]")) o.push([Math.round(h.x), Math.round(h.y), Math.round(h.x + h.w), Math.round(h.y + h.h)]); } catch (x) { /* none */ } } return o; };
      const still = await page.evaluate(`(${HOLES})()`);
      // (the light has moved on, or is closing: a closed layer keeps its holes while it fades out for 300 ms, without "on"; measured
      // then, both shots are without the light and it reads as no lift: the orchestrator, 30 Oct, contract-84 at test speed 3)
      if (JSON.stringify(still) !== JSON.stringify(e.holes)) return;   // the light has moved on: nothing to measure
      const vw = page.viewportSize().width;
      const lit = decodePng(await page.screenshot({ animations: "allow", timeout: 5000 }));
      if (JSON.stringify(await page.evaluate(`(${HOLES})()`)) !== JSON.stringify(e.holes)) return;   // (it closed while the shot was taken)
      await page.evaluate(() => document.querySelectorAll(".njg-onboard").forEach((l) => { l.dataset.njgWas = l.style.visibility || ""; l.style.visibility = "hidden"; }));
      let under = null;
      try { under = decodePng(await page.screenshot({ animations: "allow", timeout: 5000 })); } finally {
        await page.evaluate(() => document.querySelectorAll(".njg-onboard").forEach((l) => { l.style.visibility = l.dataset.njgWas || ""; delete l.dataset.njgWas; })).catch(() => {});
      }
      sound.push({ type: "c", k: "lightpix", t: Date.now(), at: e.t, page: e.page, holes: measureLight(lit, under, e.holes, vw) });
    } catch (x) { /* the page went away: a measure only */ }
  }, wait);
}
