#!/usr/bin/env node
// Card typography study (6 Nov, Zafar: "it just feels clunky ... the line spacing ... the Kutchi and English just sit too close together
// ... really close to the speaker ... with a lot of space above"). Mock only: each option is CSS injected into the real game (chai L1),
// nothing in the game changes. See build/reports/card-typography-2026-11-06.md.
//   COOK_TEST_PORT=8858 flock -w 900 /tmp/njg-browser-8858.lock node build/tools/cards/typo-options.mjs [--out DIR] [--sizes a,b] [--only o1,o2]
// At the order pop-up and at the shelf view (the order card in the side panel, Nani's box shut, a copy of the order card under it so the
// next card's peek can be measured) it writes three content cases onto the item cards, applies each option, lets the card's own fit run
// (WordCard.fit14), measures every visible item card and the panel's fit, and shoots the side panel and the pop-up.
// Writes <out>/<size>/<case>-<option>.png, <out>/<size>/popup-<option>.png and <out>/measure.json
// Round 2 (6 Nov evening): --only o2,r2A,r2B,r2C --sizes 971x412,971x318,740x320,1280x665,1920x1080 --no-popup (r2Css below)
// Round 3 (6 Nov night): --only o2,r2B,r3w100,r3w90,r3w85,r3w80,r3w70 --sizes 971x412,971x318,740x320,1280x665,1920x1080 --no-popup --hidden r3w85 [--g 7] (r3Css below)
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer, launch, newPage, SIZES, sleep } from "../../sandbox/lib/env.mjs";
import { cookStation } from "../../sandbox/flows/cook.mjs";
import { OPTIONS as FONTS } from "../fonts/options-b.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const OUT = val("out", join(HERE, "..", "..", "screenshots", "typo"));
const ONLY = val("only", null);
const DPR = +val("dpr", 2);
SIZES["971x318"] = SIZES["971x318"] || { width: 971, height: 318, label: "Zafar's phone in a browser (with its bars)", touch: true };
SIZES["971x412"] = SIZES["971x412"] || { width: 971, height: 412, label: "Zafar's phone without the browser's banner", touch: true };
const sizes = val("sizes", "971x412,971x318,740x320,930x430,1280x665").split(",");
const px = (n) => `calc(var(--njg-px) * ${n})`;

// the three content cases (only real Kutchi forms, Mum's recorded words; the pictures are the game's where it has one, a stand-in where not)
const I = "/assets/cook/items/";
export const CASES = {
  one: [["paani", "water"], ["chai", "chai"], ["dudh", "milk"], ["khun", "sugar"]],
  two: [["fudino ji chutney", "mint chutney", I + "icon-ph-lili.webp"], ["amli ji chutney", "tamarind chutney", I + "icon-ph-amli.webp"], ["hakro khun", "brown sugar", I + "icon-cook-khun.webp"], ["nair ji chutney", "coconut chutney", null]],
  mixed: [["fudino ji chutney", "mint chutney", I + "icon-ph-lili.webp"], ["chai", "chai"], ["hakro khun", "brown sugar", I + "icon-cook-khun.webp"], ["paani", "water"]],
};

// ---------- the options ----------
// base: what Zafar approved this morning (2b + Lora: English 12 px on phones, may shrink to 10 on one line; the Kutchi Lora 600)
// (english-options.mjs's newcard, copied: that file runs its study when imported)
const NUDGEFIT = `@media (max-height: 500px) {
    body #side .wc14-it .wc14-en, body .wc14-it .wc14-en { font-size: clamp(${px(12)}, 10cqi, max(${px(12)}, var(--njg-card14-u19))); line-height: 1 !important; }
    .wc14-it > .wc14-slot-k { margin-top: 3cqi !important; }
    .wc14-it > .wc14-spk { margin-top: 2.5cqi !important; } }`;
const BASE = FONTS.L.faces.replaceAll("__MOCKFONTS__", "/build/tools/fonts/woff2") + "\n" + FONTS.L.css + "\n" + NUDGEFIT;
const FACES = {
  nunito: `"Nunito", system-ui, sans-serif`,
  "nunito-sans": `"NJG Nunito Sans", system-ui, sans-serif`,
  "source-sans": `"NJG Source Sans 3", system-ui, sans-serif`,
  figtree: `"NJG Figtree", system-ui, sans-serif`,
  atkinson: `"NJG Atkinson Next", system-ui, sans-serif`,
  "dm-sans": `"NJG DM Sans", system-ui, sans-serif`,
};
const W2 = "/build/tools/fonts/woff2-sans";
const FACE_CSS = [["NJG Nunito Sans", "nunito-sans"], ["NJG Source Sans 3", "source-sans-3"], ["NJG Figtree", "figtree"], ["NJG Atkinson Next", "atkinson-hyperlegible-next"], ["NJG DM Sans", "dm-sans"]]
  .map(([f, file]) => `@font-face { font-family: '${f}'; font-style: normal; font-weight: 200 1000; font-display: block; src: url(${W2}/${file}.woff2) format('woff2'); }`).join("\n");

// one coherent set: o = { face, enW, enPx, enCol, kPx, kLh, padK, gapKE, gapES, spk, align, foot (the card's padding under the speaker, card units: the speaker's tap area runs down to it) }
//   gaps in card units (cqi: 1 = 1% of the card's width; on a phone's item card 1cqi is about 0.76 px), sizes in px at the phone floor
const IT = "body.njg-s14 #side .oc-card.oc-s14 .oc-row14 > .oc-row.oc-it14";
const ITX = "body.njg-s14 .wc.wc14-it"; // every item card (the side panel's and any other)
function setCss(o) {
  const rows = { bottom: ["auto 1fr auto auto", 2, 3, 4, "end"], centre: ["auto 1fr auto auto 1fr auto", 3, 4, 6, "end"], top: ["auto auto auto 1fr auto", 2, 3, 5, "start"] }[o.align];
  const spkW = `calc(var(--njg-tap-drawn, ${px(48)}) * ${o.spk})`;
  const c = [FACE_CSS, BASE, `
  /* the item card's rows: ${o.align}-aligned words, the speaker at the card's foot */
  ${IT}, ${ITX} { grid-template-rows: ${rows[0]} !important; }
  ${IT} > .wc14-slot-k, ${ITX} > .wc14-slot-k { grid-row: ${rows[1]} !important; align-self: ${rows[4]} !important; margin-top: ${o.padK}cqi !important; }
  ${IT} > .wc14-slot-e, ${ITX} > .wc14-slot-e { grid-row: ${rows[2]} !important; margin-top: ${o.gapKE}cqi !important; align-self: start !important; }
  ${IT} > .wc14-spk, ${ITX} > .wc14-spk { grid-row: ${rows[3]} !important; margin-top: ${o.gapES}cqi !important; align-self: end !important; }
  /* the Kutchi: Lora 600 (the base), its two lines' spacing */
  body.njg-s14 .wc14-it .wc-slot.wc14-k, body.njg-s14 #side .oc-row.oc-it14 .wc14-k { line-height: ${o.kLh} !important; }
  /* the English: its face, weight, colour; size left to the card's fit (no !important on the size) */
  body.njg-s14 .wc14 .wc-slot.wc14-en, body.njg-s14 #side .wc14 .wc-slot.wc14-en { font-family: ${FACES[o.face]} !important; font-weight: ${o.enW} !important; color: ${o.enCol} !important; line-height: 1.1 !important; letter-spacing: ${o.enLs || 0}em; }
  /* the speaker drawn ${Math.round((1 - o.spk) * 100)}% smaller; its 48 px tap area kept (the ::after ring, css/shared/order-card.css) */
  body.njg-s14 #side .oc-row.oc-it14 > .oc-spk.wc14-spk { width: ${spkW} !important; }
  .wc14-it > .wc14-spk { width: clamp(calc(var(--njg-tap) * ${o.spk}), ${Math.round(32 * o.spk)}cqi, calc(var(--njg-card14-u60) * ${o.spk})) !important; }
  /* the tap areas split at the middle of the English-to-speaker gap: the English's (its dots) reaches down to that line, the speaker's
     up to it, and 48 px wide; the speaker's runs down to the card's foot */
  ${IT} > .oc-spk.wc14-spk::after { inset: calc(-${o.gapES / 2}cqi) min(0px, calc((100% - var(--njg-tap)) / 2)) calc(-1 * ${o.foot}cqi) !important; border-radius: var(--njg-card14-u14) !important; }
  body.njg-s14 .wc14-it .wc14-en-dots { inset: calc(-1 * var(--njg-card14-u2)) calc(-1 * var(--njg-card14-u2)) calc(-${o.gapES / 2}cqi) !important; }
  @media (max-height: 500px) {
    body #side .wc14-it .wc14-en, body .wc14-it .wc14-en { font-size: clamp(${px(o.enPx)}, 10cqi, max(${px(o.enPx)}, var(--njg-card14-u19))); }
    ${o.kPx ? `body.njg-s14 #side .oc-row.oc-it14 .wc14-k { font-size: clamp(${px(o.kPx)}, ${Math.round(o.kPx / 14.5 * 16)}cqi, max(${px(o.kPx)}, var(--njg-card14-u32))); }` : ""}
  }
  /* the pop-up card: the same English face, weight and colour, the same Kutchi line spacing, the same speaker scale */
  body.njg-s14 .wc14-big .wc-slot.wc14-k { line-height: ${o.kLh} !important; }
  body.njg-s14 .wc14-big > .wc14-in { gap: 2.4cqi; }
  body.njg-s14 .wc14-big .wc14-slot-e { margin-top: ${(o.gapKE * 0.5).toFixed(2)}cqi; }
  body.njg-s14 .wc14-big:not(.wc14-side) .wc14-spk { width: clamp(var(--njg-tap), ${Math.round(25 * o.spk)}cqi, calc(var(--njg-card14-u112) * ${o.spk})) !important; margin-top: ${o.popSpk || 2.5}cqi !important; }
  `];
  return c.join("\n");
}

const GREY = "#6f6660"; // a warm grey: 5.6:1 on the card's cream (AA for small text)
const GREY2 = "#7b726b"; // lighter: 4.7:1
export const SETS = {
  o1: { name: "1 Tidy: today's layout, spaced", face: "nunito", enW: 500, enPx: 12, enCol: GREY, kLh: 1.08, padK: 3, gapKE: 3.5, gapES: 5, spk: 0.88, align: "bottom", foot: 7 },
  o2: { name: "2 Centred block, Nunito Sans", face: "nunito-sans", enW: 600, enPx: 12, enCol: GREY, kLh: 1.08, padK: 4, gapKE: 3.5, gapES: 5, spk: 0.87, align: "centre", foot: 7 },
  o3: { name: "3 Top-aligned, speaker at the foot, Figtree", face: "figtree", enW: 500, enPx: 12, enCol: GREY, kLh: 1.08, padK: 5, gapKE: 3.5, gapES: 5, spk: 0.87, align: "top", foot: 7 },
  o4: { name: "4 Quieter English 11 px, Atkinson", face: "atkinson", enW: 500, enPx: 11, enCol: GREY2, kLh: 1.1, padK: 3, gapKE: 4, gapES: 6, spk: 0.85, align: "centre", foot: 7 },
  o5: { name: "5 Roomy: centred, +6 px card, Source Sans 3", face: "source-sans", enW: 600, enPx: 12, enCol: GREY, kLh: 1.12, padK: 6, gapKE: 5, gapES: 8, spk: 0.86, align: "centre", foot: 7 },
};
// the English faces side by side, every one on option 2's layout (the mixed case at his phone size only)
export const FACESETS = Object.fromEntries(Object.keys(FACES).map((f) => [`f-${f}`, { ...SETS.o2, name: `face: ${f}`, face: f, enW: ["atkinson", "figtree", "nunito"].includes(f) ? 500 : 600 }]));

// ---------- round 2 (6 Nov evening; Zafar: "English should stay aligned with other cards' English if they're both on one line, with the
// Kutchi centre aligned. Speaker has to stay at bottom but can we improve or tie in? ... keep the speaker prominent for non readers") ----------
// Option 2 (Nunito Sans 600 grey English, Lora 600 Kutchi) plus:
//  1. the row's alignment by the row's own measurement: a small row pass after the fit (in settle below) sets every card's Kutchi area
//     to the row's tallest Kutchi (min-height), the Kutchi centred in it, so the Englishes start on one line; the English sits at the top
//     of its area and the spare goes above the speaker, so the speakers sit on one line at the cards' foot. (Not CSS subgrid: the item
//     card is a size container, container-type: inline-size, for its cqi units, and a contained grid cannot be a subgrid; Chrome
//     computes it as none. The build runs the same pass at the end of WordCard.fit14.)
//  2. one English size per row (the fit's smallest in the row, shared: the same row pass);
//  3. a speaker treatment: A a soft footer band, B a thin divider line, C a full-width foot button; each with the circle at today's full
//     size and its tap area the card's whole foot (from the middle of the gap under the English down to the card's edge);
//  4. bigger pictures on big screens (min-height 501px: the picture box 6:5 instead of 4:3, the picture 96% of it instead of 88%).
const R2PROP = `@property --njg-itpad { syntax: '<length>'; inherits: true; initial-value: 0px; }`;
function r2Css(t) {
  const o = { ...SETS.o2, spk: t.spk };
  const top = t.gEx + t.padTop; // the speaker's margin above it: the gap under the English, then the treatment's own room
  const cardR = "calc(var(--njg-card14-u14) - var(--njg-card14-u1p5))";
  const zone = {
    // A: a soft footer band, the card's cream a shade warmer, across the card's foot to its edges; the circle seated in it
    A: `${IT}::before { margin: ${t.gEx}cqi calc(-1 * var(--njg-itpad)) calc(-1 * var(--njg-itpad) * ${t.padB}) !important; border-radius: 0 0 ${cardR} ${cardR};
          background: linear-gradient(to bottom, #f6eddf, #f3e8d6); box-shadow: inset 0 1px 0 rgba(220, 203, 174, .55); }`,
    // B: a thin divider above the speaker zone (the card art's rule colour, fading at its ends), the circle under it
    B: `${IT}::before { margin: ${t.gEx}cqi 6cqi 0 !important; align-self: start !important; height: max(1px, 1.4cqi);
          background: linear-gradient(to right, transparent, var(--njg-card14-rule) 18%, var(--njg-card14-rule) 82%, transparent); }`,
    // C: a full-width foot button: a rounded bar the card's inner width, the circle centred in it
    C: `${IT}::before { margin: ${t.gEx}cqi 0 calc(-1 * ${t.padTop}cqi) !important; border-radius: 999px;
          background: linear-gradient(to bottom, #f7efe2, #f1e6d3); box-shadow: inset 0 0 0 1px rgba(220, 203, 174, .8), 0 1px 0 rgba(255, 255, 255, .7); }`,
  }[t.t];
  return [setCss(o), R2PROP, `
  /* 1. the item card's rows: picture, Kutchi area (min-height from the row pass, the Kutchi centred), English, the spare, the speaker zone */
  ${IT} { grid-template-rows: auto auto auto 1fr auto !important; --njg-itpad: 2.6cqi; padding: var(--njg-itpad) var(--njg-itpad) calc(var(--njg-itpad) * ${t.padB}) !important; isolation: isolate; }
  ${IT} > * { grid-column: 1 !important; }
  ${IT} > .wc14-pic { grid-row: 1 !important; }
  ${IT} > .wc14-slot-k { grid-row: 2 !important; align-self: stretch !important; display: flex; flex-direction: column; justify-content: center; }
  ${IT} > .wc14-slot-e { grid-row: 3 !important; align-self: start !important; }
  ${IT} > .wc14-spk { grid-row: 5 !important; align-self: end !important; margin-top: ${top}cqi !important; z-index: 1; }
  /* 3. the speaker zone: drawn by the card's ::before in the speaker's row, under the circle */
  ${IT}::before { content: "" !important; display: block !important; grid-row: 5; grid-column: 1; align-self: stretch; justify-self: stretch; z-index: 0; pointer-events: none; position: static; }
  ${zone}
  /* the tap areas: the speaker's runs the card's whole width, from the middle of the gap under the English to the card's foot; the
     English's dots reach down to that line */
  ${IT} > .oc-spk.wc14-spk::after { inset: calc(-1 * ${t.padTop + t.gEx / 2}cqi) calc((100% - 100cqi) / 2 - var(--njg-itpad)) calc(-1 * var(--njg-itpad) * ${t.padB}) !important; border-radius: 0 0 ${cardR} ${cardR} !important; }
  body.njg-s14 .wc14-it .wc14-en-dots { inset: calc(-1 * var(--njg-card14-u2)) calc(-1 * var(--njg-card14-u2)) calc(-${t.gEx / 2}cqi) !important; }
  /* 4. bigger pictures on big screens (phones unchanged) */
  @media (min-height: 501px) {
    ${IT} > .wc14-pic { aspect-ratio: 6 / 5 !important; }
    ${IT} > .wc14-pic > img.wc-img { inset: 2% !important; width: 96% !important; height: 96% !important; }
  }
  `].join("\n");
}
export const R2 = {
  // (spk: the circle against today's; gEx: the gap under the English, cqi; padTop: the zone's room above the circle, cqi; padB: the
  // card's padding under the circle, a share of its sides' padding; sized so a two-line row still shows the next card's headline at 971x318)
  A: { name: "A Footer band", t: "A", spk: 0.94, gEx: 3, padTop: 5, padB: 0.65 },
  B: { name: "B Divider line", t: "B", spk: 0.94, gEx: 4, padTop: 4, padB: 0.75 },
  C: { name: "C Foot button", t: "C", spk: 0.94, gEx: 3, padTop: 3.5, padB: 0.8 },
};

// ---------- round 3 (6 Nov night; Zafar: "the English word chai sits under the Kutchi word for chai directly ... that looks better ...
// keep the words paired together"; "Let's do the divider line ... 70, 80, 85 and 90% ... the padding should be equal: the bottom of the
// card up to the bottom of the speaker; the top of the speaker up to the divider line; the divider line up to the bottom of the English
// word") ----------
// Round 2's B (the divider, Lora 600, Nunito Sans 600 grey, one English size per row, the 30 px speaker with its full-foot tap area,
// bigger pictures on big screens) with:
//  1. the English paired under its own Kutchi, the pair centred between the picture and the divider (round 1's option 2: the row's
//     spare split above and below it); no row alignment of the English (the row pass keeps only the one English size per row);
//  2. one gap g (card units, cqi of the card) three times: the card's bottom edge to the speaker's bottom, the speaker's top to the
//     divider, the divider to the bottom of the row's lowest English. The cards of a row are one height (the row stretches them) and
//     the divider sits a fixed g + speaker + g above the foot, so it is at one height across the row; the card whose words are tallest
//     has no spare, so its English sits g above the divider and every other English sits higher (never the divider raised to meet it);
//  3. the divider a real element in the mock (.njg-r3-div, so it can be measured; the build can use the card's ::before), t.w of round
//     2's line (88% of the card's inner width, its ends fading), centred.
// (g is on children of the card only, so all three are in the card's own cqi: the card's padding is in the row's cqi, a different unit;
// the card's bottom padding is 0 and the speaker's bottom margin is g less the card's border, set to 1 px: the 1.5 px token is drawn
// 1 px at dpr 2 anyway, and a fixed width keeps the foot exact at every dpr.)
const R3LINE = "max(1px, 1.4cqi)";
function r3Css(t) {
  const o = { ...SETS.o2, spk: 0.94 };
  const g = t.g;
  const cardR = "calc(var(--njg-card14-u14) - var(--njg-card14-u1p5))";
  return [setCss(o), R2PROP, `
  /* 1. rows: picture, spare, Kutchi, English, spare, divider, speaker (option 2's centred pair; the speaker at the foot) */
  ${IT} { grid-template-rows: auto 1fr auto auto 1fr auto auto !important; --njg-itpad: 2.6cqi; padding: var(--njg-itpad) var(--njg-itpad) 0 !important; border-width: 1px !important; isolation: isolate; }
  ${IT} > * { grid-column: 1 !important; }
  ${IT} > .wc14-pic { grid-row: 1 !important; }
  ${IT} > .wc14-slot-k { grid-row: 3 !important; }
  ${IT} > .wc14-slot-e { grid-row: 4 !important; align-self: start !important; }
  /* 2. the divider and the speaker: g, g, g */
  ${IT} > .njg-r3-div { display: block; grid-row: 6 !important; justify-self: center; width: ${(88 * t.w).toFixed(2)}cqi; height: ${R3LINE}; margin: ${g}cqi 0 0; pointer-events: none;
        background: linear-gradient(to right, transparent, var(--njg-card14-rule) 18%, var(--njg-card14-rule) 82%, transparent); }
  ${IT} > .wc14-spk { grid-row: 7 !important; align-self: end !important; margin: ${g}cqi 0 calc(${g}cqi - 1px) !important; z-index: 1; }
  /* the tap areas: the speaker's the card's whole width, from the middle of the gap above the divider down to the card's edge; the
     English's dots reach down half a gap */
  ${IT} > .oc-spk.wc14-spk::after { inset: calc(-1 * (${1.5 * g}cqi + ${R3LINE})) calc((100% - 100cqi) / 2 - var(--njg-itpad)) calc(-1 * ${g}cqi) !important; border-radius: 0 0 ${cardR} ${cardR} !important; }
  body.njg-s14 .wc14-it .wc14-en-dots { inset: calc(-1 * var(--njg-card14-u2)) calc(-1 * var(--njg-card14-u2)) calc(-${g / 2}cqi) !important; }
  /* bigger pictures on big screens (round 2; phones unchanged) */
  @media (min-height: 501px) {
    ${IT} > .wc14-pic { aspect-ratio: 6 / 5 !important; }
    ${IT} > .wc14-pic > img.wc-img { inset: 2% !important; width: 96% !important; height: 96% !important; }
  }
  `].join("\n");
}
// g: the one gap, in the card's cqi (7: 4.4 px on his phone's item card; the report has the measured px per size)
const R3G = +val("g", 7);
export const R3 = Object.fromEntries([100, 90, 85, 80, 70].map((w) => [`r3w${w}`, { name: `Divider ${w}%${w === 100 ? " (round 2's B)" : ""}`, w: w / 100, g: R3G }]));

export const OPTIONS = {
  today: { css: "", name: "Today (the game)" },
  base: { css: FACE_CSS + "\n" + BASE, name: "Approved this morning (2b + Lora)" },
  ...Object.fromEntries(Object.entries(SETS).map(([k, o]) => [k, { css: setCss(o), name: o.name, set: o }])),
  ...Object.fromEntries(Object.entries(FACESETS).map(([k, o]) => [k, { css: setCss(o), name: o.name, set: o, only: { sizes: ["971x412"], cases: ["mixed"] } }])),
  ...Object.fromEntries(Object.entries(R2).map(([k, t]) => [`r2${k}`, { css: r2Css(t), name: t.name, r2: t, rowSize: true }])),
  ...Object.fromEntries(Object.entries(R3).map(([k, t]) => [k, { css: r3Css(t), name: t.name, r3: t, rowSize: true, enSizeOnly: true }])),
};

// ---------- in the page ----------
function writeCase(rows) {
  const cards = [...document.querySelectorAll("#side .m-order > .oc-card:first-child .oc-row.oc-it14")];
  if (!window.__njgPics) window.__njgPics = Object.fromEntries(cards.map((c) => [c.querySelector(".wc14-k")?.textContent.trim(), c.querySelector("img.wc-img")?.getAttribute("src")]));
  cards.forEach((c, i) => {
    const r = rows[i]; if (!r) return;
    const k = c.querySelector(".wc14-k"), e = c.querySelector(".wc14-en"), img = c.querySelector("img.wc-img");
    if (k) k.textContent = r[0];
    if (e) e.textContent = r[1];
    const src = r[2] || window.__njgPics[r[0]] || window.__njgPics.khun;
    if (img && src) img.setAttribute("src", src);
  });
  // the copy under it (the next order card's peek): rebuilt from the first
  document.querySelectorAll("#side .oc-card.njg-mock-next").forEach((n) => n.remove());
  const first = document.querySelector("#side .m-order > .oc-card");
  if (first) { const n = first.cloneNode(true); n.classList.add("njg-mock-next"); first.after(n); }
  const m = document.querySelector("#mission"); if (m) m.scrollTop = 0;
  document.querySelectorAll("#side .oc-row14").forEach((r) => { r.scrollLeft = 0; });
}

function measure() {
  const R = (e) => { const b = e.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), b: +b.bottom.toFixed(1), r: +b.right.toFixed(1) }; };
  const fs = (e) => +parseFloat(getComputedStyle(e).fontSize).toFixed(1);
  const side = document.querySelector("#side"), guide = document.querySelector("#guide"), mission = document.querySelector("#mission");
  const cards = [...document.querySelectorAll("#side .m-order > .oc-card")];
  const p = parseFloat(getComputedStyle(side).getPropertyValue("--njg-p")) || 1;
  const pxv = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--njg-px")) || 1;
  const maskFoot = 22 * p * pxv;
  const out = { side: R(side), guide: R(guide), guideOpen: guide.classList.contains("ng-open"), mission: R(mission), p, maskFoot: +maskFoot.toFixed(1), cards: cards.map(R), items: [] };
  const live = document.querySelector("#live"); if (live) out.live = R(live);
  const c1 = cards[0], c2 = cards[1];
  if (c1) {
    out.head = R(c1.querySelector(".oc-head")); out.row = R(c1.querySelector(".oc-row14"));
    const mb = out.mission.b, fadeTop = mb - maskFoot;
    out.fit = { card1Whole: out.cards[0].b <= mb + 0.5, card1Clear: out.cards[0].b <= fadeTop + 0.5 };
    if (c2) {
      const h2 = c2.querySelector(".oc-headline") || c2.querySelector(".oc-head");
      const hb = R(h2);
      out.fit.next = { top: out.cards[1].y, headlineBottom: hb.b, headlineTop: hb.y };
      out.fit.peekPx = +(mb - out.cards[1].y).toFixed(1); // how much of the next card shows (in the fade or not)
      out.fit.headlineClear = hb.b <= fadeTop + 0.5; // its headline whole and above the fade
      out.fit.headlineShows = hb.b <= mb + 0.5; // its headline whole, maybe in the fade
      out.fit.spareForHeadline = +(fadeTop - hb.b).toFixed(1); // >0: room to spare with the headline clear of the fade; <0: short by that much
      out.fit.spareForHeadlineInFade = +(mb - hb.b).toFixed(1);
      out.fit.spareForPeek8 = +(mb - (out.cards[1].y + 8)).toFixed(1); // room to spare for an 8 px peek of the next card
    }
    const row = c1.querySelector(".oc-row14"), rb = row.getBoundingClientRect();
    for (const it of c1.querySelectorAll(".oc-row.oc-it14")) {
      const b = it.getBoundingClientRect(); if (b.left > rb.right - 4 || b.width === 0) continue;
      const k = it.querySelector(".wc14-k"), en = it.querySelector(".wc14-en"), spk = it.querySelector(".wc14-spk"), pic = it.querySelector(".wc14-pic");
      const kb = k.getBoundingClientRect(), eb = en.getBoundingClientRect(), sb = spk.getBoundingClientRect(), pb = pic.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(k).lineHeight) || fs(k) * 1.1;
      // the tap areas: the speaker's ::after, the English's dots (hidden English) or its own box
      const sa = getComputedStyle(spk, "::after");
      const sInset = ["top", "right", "bottom", "left"].map((s) => parseFloat(sa[s]) || 0);
      let sHit = { t: sb.top + sInset[0], r: sb.right - sInset[1], b: sb.bottom - sInset[2], l: sb.left + sInset[3] };
      // a tap area is cut by the row's own box (the row scrolls across, so it clips) and by the card's neighbours
      const clipB = Math.min(sHit.b, rb.bottom); const clipT = Math.max(sHit.t, rb.top);
      const ed = it.querySelector(".wc14-en-dots"); const edcs = ed ? getComputedStyle(ed) : null;
      const eIn = edcs ? ["top", "right", "bottom", "left"].map((s) => parseFloat(edcs[s]) || 0) : [0, 0, 0, 0];
      const eHit = { t: eb.top + eIn[0], b: eb.bottom - eIn[2], l: eb.left + eIn[3], r: eb.right - eIn[1] };
      const xOver = Math.min(eHit.r, sHit.r) > Math.max(eHit.l, sHit.l);
      out.items.push({
        word: k.textContent.trim(), en: en.textContent.trim(), kPx: fs(k), enPx: fs(en), kLines: Math.round(kb.height / lh), enLines: Math.round(eb.height / (parseFloat(getComputedStyle(en).lineHeight) || fs(en))),
        enFace: getComputedStyle(en).fontFamily.split(",")[0].replace(/"/g, ""), enW: getComputedStyle(en).fontWeight, enCol: getComputedStyle(en).color, kFace: getComputedStyle(k).fontFamily.split(",")[0].replace(/"/g, ""),
        card: R(it), picR: R(pic), kR: R(k), enR: R(en), spkR: R(spk),
        gapPicK: +(kb.top - pb.bottom).toFixed(1), gapKE: +(eb.top - kb.bottom).toFixed(1), gapES: +(sb.top - eb.bottom).toFixed(1), foot: +(b.bottom - sb.bottom).toFixed(1),
        spkHit: { w: +(sHit.r - sHit.l).toFixed(1), h: +(clipB - clipT).toFixed(1), hUncut: +(sHit.b - sHit.t).toFixed(1) },
        hitOverlap: xOver ? +Math.max(0, eHit.b - sHit.t).toFixed(1) : 0,
        enTop: +eb.top.toFixed(1), kSlot: R(it.querySelector(".wc14-slot-k") || k), spkTop: +sb.top.toFixed(1),
        zoneTop: +(sb.top - parseFloat(getComputedStyle(spk).marginTop) + (parseFloat(getComputedStyle(it, "::before").marginTop) || 0)).toFixed(1),
        clipped: [k, en].some((e) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2) || [k, en].some((e) => getComputedStyle(e).textOverflow === "ellipsis" && e.scrollWidth > e.clientWidth),
        overlap: kb.bottom > eb.top + 0.5 || eb.bottom > sb.top + 0.5 || pb.bottom > kb.top + 0.5,
        outside: [kb, eb, sb].some((x) => x.bottom > b.bottom + 0.5 || x.left < b.left - 0.5 || x.right > b.right + 0.5),
      });
    }
  }
  // round 2: the row's alignment (cards wholly in view): the one-line Englishes' tops, the speakers' tops, the Kutchi areas' heights
  const vis = out.items.filter((i) => out.row && i.card.r <= out.row.r + 1);
  const spread = (a) => (a.length ? +(Math.max(...a) - Math.min(...a)).toFixed(1) : 0);
  out.align = { enTop1: spread(vis.filter((i) => i.enLines === 1).map((i) => i.enTop)), spkTop: spread(vis.map((i) => i.spkTop)), kArea: spread(vis.map((i) => i.kSlot.h)), cardH: spread(vis.map((i) => i.card.h)),
    zoneGap: vis.length ? +Math.min(...vis.map((i) => i.zoneTop - i.enR.b)).toFixed(1) : null, enPx: [...new Set(out.items.map((i) => i.enPx))] };
  // round 3: the three gaps on every card of the first order card's row (the cards scrolled out of view too: the row is one height):
  // foot = the card's bottom edge to the speaker's bottom; spk = the speaker's top to the divider's bottom; en = the divider's top to the
  // bottom of the row's lowest English (enOwn: to this card's own English); divTop: the divider's top (one height across the row)
  if (c1) {
    const cs = [...c1.querySelectorAll(".oc-row14 > .oc-row.oc-it14")];
    const rr = cs.map((it) => ({ it, b: it.getBoundingClientRect(), d: it.querySelector(":scope > .njg-r3-div"), s: it.querySelector(".wc14-spk").getBoundingClientRect(), e: it.querySelector(".wc14-en").getBoundingClientRect(), k: it.querySelector(".wc14-k").getBoundingClientRect(), p: it.querySelector(".wc14-pic").getBoundingClientRect() }));
    const lowE = Math.max(...rr.map((x) => x.e.bottom)), rowR = c1.querySelector(".oc-row14").getBoundingClientRect().right;
    const f1 = (v) => +v.toFixed(2);
    out.r3 = rr.map(({ it, b, d, s, e, k, p }) => {
      const db = d && d.getBoundingClientRect();
      return { word: it.querySelector(".wc14-k").textContent.trim(), en: it.querySelector(".wc14-en").textContent.trim(), cardH: f1(b.height), cardW: f1(b.width), inView: b.right <= rowR + 1,
        foot: f1(b.bottom - s.bottom), spk: db ? f1(s.top - db.bottom) : null, en: db ? f1(db.top - lowE) : f1(s.top - lowE), enOwn: db ? f1(db.top - e.bottom) : f1(s.top - e.bottom),
        divTop: db ? f1(db.top - b.top) : null, divW: db ? f1(db.width) : null, divH: db ? f1(db.height) : null, spkW: f1(s.width),
        picToK: f1(k.top - p.bottom), kToE: f1(e.top - k.bottom), css: ["paddingBottom", "borderBottomWidth"].map((q) => getComputedStyle(it)[q]).concat([getComputedStyle(it.querySelector(".wc14-spk")).marginBottom, getComputedStyle(it.querySelector(".wc14-spk")).marginTop]).join(" "), hidden: it.classList.contains("wc14-hide-en"),
        overlap: k.bottom > e.top + 0.5 || (db ? e.bottom > db.top + 0.5 || db.bottom > s.top + 0.5 : e.bottom > s.top + 0.5) || s.bottom > b.bottom + 0.5 };
    });
  }
  const big = document.querySelector(".njg-mock-pop") || document.querySelector(".wc14-big:not(.wc14-side)");
  if (big && big.getBoundingClientRect().width) {
    const k = big.querySelector(".wc14-k"), en = big.querySelector(".wc14-en"), spk = big.querySelector(".wc14-spk");
    out.popup = { card: R(big), k: k && R(k), en: en && R(en), spk: spk && R(spk), kPx: k && fs(k), enPx: en && fs(en),
      gapKE: k && en ? +(en.getBoundingClientRect().top - k.getBoundingClientRect().bottom).toFixed(1) : null,
      gapES: en && spk ? +(spk.getBoundingClientRect().top - en.getBoundingClientRect().bottom).toFixed(1) : null,
      clipped: [k, en].filter(Boolean).some((e) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2),
      outside: [k, en, spk].filter(Boolean).some((x) => x.getBoundingClientRect().bottom > big.getBoundingClientRect().bottom + 0.5) };
  }
  return out;
}

// ---------- the run ----------
// (--print-css NAME: the option's CSS to stdout, nothing run)
if (val("print-css", null)) { console.log(OPTIONS[val("print-css")].css); process.exit(0); }
const srv = await startServer();
const browser = await launch();
const data = {};
mkdirSync(OUT, { recursive: true });
const wanted = Object.entries(OPTIONS).filter(([n]) => !ONLY || ONLY.split(",").includes(n));

async function settle(page, o = {}) {
  await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
  await page.evaluate(() => (document.fonts && document.fonts.ready) || null).catch(() => {});
  await sleep(200);
  await page.evaluate(() => document.querySelectorAll("#side .wc14-it > .wc14-slot-k").forEach((k) => { k.style.minHeight = ""; }));
  // round 3: the divider, a real element in each item card (removed for every other option)
  await page.evaluate((on) => document.querySelectorAll("#side .oc-row.oc-it14").forEach((c) => {
    const d = c.querySelector(":scope > .njg-r3-div");
    if (on && !d) { const n = document.createElement("i"); n.className = "njg-r3-div"; n.setAttribute("aria-hidden", "true"); c.appendChild(n); }
    if (!on && d) d.remove();
  }), !!o.r3);
  await page.evaluate(() => { const W = window.WordCard; if (W && W.fit14) W.fit14(); });
  // round 2, the row pass (the build: the end of WordCard.fit14): (a) one English size per row, the fit's smallest in the row shared by
  // every card in it (an English the fit wrapped keeps its size); (b) every card's Kutchi area as tall as the row's tallest Kutchi
  if (o.rowSize) await page.evaluate((enSizeOnly) => document.querySelectorAll("#side .oc-row14").forEach((row) => {
    const ens = [...row.querySelectorAll(".wc14-it .wc14-en")].filter((e) => e.offsetParent);
    const min = Math.min(...ens.map((e) => parseFloat(getComputedStyle(e).fontSize)));
    if (isFinite(min)) ens.forEach((e) => { if (parseFloat(getComputedStyle(e).fontSize) > min + 0.05) { e.style.fontSize = `${min}px`; const d = e.parentNode.querySelector(".wc14-dots"); if (d) d.style.fontSize = `${min}px`; } });
    if (enSizeOnly) return; // round 3: the English paired under its own Kutchi, no Kutchi area to line up
    const ks = [...row.querySelectorAll(".wc14-it > .wc14-slot-k")].filter((k) => k.offsetParent);
    ks.forEach((k) => { k.style.minHeight = ""; });
    const h = Math.max(...ks.map((k) => k.getBoundingClientRect().height));
    if (isFinite(h)) ks.forEach((k) => { k.style.minHeight = `${h}px`; });
  }), !!o.enSizeOnly);
  await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
  await sleep(100);
}
// Nani's box held shut while shooting (the game opens her help card again after a wait): its shut look, the arrow pointing down
const SHUT = `body.njg-s14 #guide.ng-s14 .ng-help { grid-template-rows: 0fr !important; transition: none !important; }
  body.njg-s14 #guide.ng-s14 .ng-arrow svg { transform: none !important; }`;
const inject = (page, css) => page.evaluate((c) => { let s = document.getElementById("njg-mock-typo"); if (!s) { s = document.createElement("style"); s.id = "njg-mock-typo"; document.head.appendChild(s); } s.textContent = c; }, css);

async function panel(page, size) {
  const dir = join(OUT, size); mkdirSync(dir, { recursive: true });
  // Nani's box shut (the arrow's state), the list at its top
  await page.evaluate(() => { try { window.Cook.UI.helperOpen(false, { by: "quiet" }); } catch (e) { /* the class alone */ } const g = document.querySelector("#guide"); if (g) g.classList.remove("ng-open"); });
  await sleep(900);
  for (const [cs, rows] of Object.entries(CASES)) {
    await page.evaluate(`(${writeCase.toString()})(${JSON.stringify(rows)})`);
    for (const [name, o] of wanted) {
      if (o.only && (!o.only.sizes.includes(size) || !o.only.cases.includes(cs))) continue;
      await inject(page, SHUT + "\n" + o.css); await settle(page, o);
      await page.evaluate(() => { const m = document.querySelector("#mission"); if (m) m.scrollTop = 0; document.querySelectorAll("#side .oc-row14").forEach((r) => { r.scrollLeft = 0; }); });
      const m = await page.evaluate(`(${measure.toString()})()`);
      data[`${size}|${cs}|${name}`] = m;
      const s = m.side;
      await page.screenshot({ path: join(dir, `${cs}-${name}.png`), clip: { x: 0, y: 0, width: Math.ceil(s.r) + 2, height: Math.ceil(s.b) }, animations: "disabled" }).catch((e) => console.log("shot", e.message));
    }
  }
  // round 3 (--hidden r3w85): the English hidden (its dots, a tap shows it for 3 s), then the first card's English peeking
  const hid = val("hidden", null);
  if (hid && OPTIONS[hid]) for (const cs of ["mixed", "two"]) {
    await page.evaluate(`(${writeCase.toString()})(${JSON.stringify(CASES[cs])})`);
    for (const st of ["hidden", "peek"]) {
      await inject(page, SHUT + "\n" + OPTIONS[hid].css);
      await page.evaluate((st) => document.querySelectorAll("#side .m-order > .oc-card .oc-row.oc-it14").forEach((c, i) => {
        c.classList.add("wc14-hide-en"); const e = c.querySelector(".wc14-en"); if (e) e.classList.toggle("wc14-peek", st === "peek" && i % 4 === 0);
      }), st);
      await settle(page, OPTIONS[hid]);
      await page.evaluate(() => { const m = document.querySelector("#mission"); if (m) m.scrollTop = 0; document.querySelectorAll("#side .oc-row14").forEach((r) => { r.scrollLeft = 0; }); });
      const m = await page.evaluate(`(${measure.toString()})()`);
      data[`${size}|${st}-${cs}|${hid}`] = m;
      await page.screenshot({ path: join(dir, `${st}-${cs}-${hid}.png`), clip: { x: 0, y: 0, width: Math.ceil(m.side.r) + 2, height: Math.ceil(m.side.b) }, animations: "disabled" }).catch((e) => console.log("shot", e.message));
    }
    await page.evaluate(() => document.querySelectorAll("#side .oc-row.oc-it14").forEach((c) => { c.classList.remove("wc14-hide-en"); c.querySelector(".wc14-en")?.classList.remove("wc14-peek"); }));
  }
  await inject(page, "");
}

async function popup(page, size) {
  const dir = join(OUT, size); mkdirSync(dir, { recursive: true });
  // the pop-up flies into its row a moment later: a still copy of it is pinned where it stands (its own size), the game's one hidden
  await page.evaluate(() => {
    const src = document.querySelector(".wc14-big:not(.wc14-side)"); if (!src) return;
    const b = src.getBoundingClientRect();
    const big = src.cloneNode(true); big.classList.add("njg-mock-pop"); big.classList.remove("wc-pop", "wc14-flyer");
    Object.assign(big.style, { position: "fixed", left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", margin: "0", zIndex: "9999", animation: "none", transform: "none" });
    document.body.appendChild(big); src.style.visibility = "hidden"; window.__njgPop = big;
    const k = big.querySelector(".wc14-k"), e = big.querySelector(".wc14-en"), img = big.querySelector("img.wc-img");
    if (k) k.textContent = "fudino ji chutney"; if (e) e.textContent = "mint chutney"; if (img) img.setAttribute("src", "/assets/cook/items/icon-ph-lili.webp");
  });
  for (const [name, o] of wanted) {
    if (o.only) continue;
    await page.evaluate(() => { const p = window.__njgPop; if (p && !p.isConnected) document.body.appendChild(p); }); await inject(page, o.css); await settle(page);
    const m = await page.evaluate(`(${measure.toString()})()`);
    data[`${size}|popup|${name}`] = { popup: m.popup };
    const b = m.popup && m.popup.card; if (!b) continue;
    const pad = 12, W = await page.evaluate(() => { const p = window.__njgPop; if (p && !p.isConnected) document.body.appendChild(p); return [innerWidth, innerHeight]; });
    const x = Math.max(0, b.x - pad), y = Math.max(0, b.y - pad);
    await page.screenshot({ path: join(dir, `popup-${name}.png`), clip: { x, y, width: Math.min(W[0] - x, b.w + 2 * pad), height: Math.min(W[1] - y, b.h + 2 * pad) }, animations: "disabled" }).catch((e) => console.log("shot", e.message));
  }
  await inject(page, "");
  await page.evaluate(() => { document.querySelectorAll(".njg-mock-pop").forEach((n) => n.remove()); document.querySelectorAll(".wc14-big").forEach((n) => { n.style.visibility = ""; }); });
}

async function runSize(size) {
  const np = await newPage(browser, size, { dpr: DPR });
  const page = np.page, done = new Set();
  const rec = {
    names: new Map(),
    async state(name, o = {}) {
      if (o.settle) await page.waitForTimeout(o.settle);
      if (name === "order-card-big" && !done.has("popup") && !argv.includes("--no-popup")) {
        await page.waitForFunction(() => [...document.querySelectorAll(".wc14-big .wc14-en")].some((e) => e.getBoundingClientRect().width > 0), null, { timeout: 15000 }).then(() => page.waitForTimeout(400)).catch(() => {});
        done.add("popup"); await popup(page, size); if (argv.includes("--popup-only")) throw new Error("enough states");
      }
      if (name === "view-marble" && !done.has("panel")) { await page.waitForTimeout(400); done.add("panel"); await panel(page, size); throw new Error("enough states"); }
      return name;
    },
    note() {}, pend() {}, stop(m) { throw new Error(m); },
  };
  const t0 = Date.now();
  try { await cookStation("chai-tray", 1).run({ page, rec, timeoutMs: 300000, profile: "seen" }); } catch (e) { if (!/enough states/.test(e.message)) console.log(`  ${size}: ${e.message.split("\n")[0]}`); }
  console.log(`  ${size}: ${Math.round((Date.now() - t0) / 1000)} s, states ${[...done].join(",")}`);
  await np.ctx.close();
}

for (const s of sizes) await runSize(s);
writeFileSync(join(OUT, "measure.json"), JSON.stringify(data, null, 1));
await browser.close();
srv.close();
