// The font options mocked on the real screens (fonts across the game, 6 Nov; build/reports/fonts-across-the-game-2026-11-06.md).
// Mock only: the shooter (shoot.mjs) serves these faces in place of the Google Fonts sheet and injects the option's CSS into the page.
// Nothing here is loaded by the game.
//
//   A  today: Fraunces for the Kutchi on cards, Nani's line and the order line; Nunito for the pills, the bubbles, the door and the UI
//   B  Nunito for every Kutchi word (one face per word, the sans); Fraunces dropped
//   C  Fraunces for every Kutchi word (one face per word, the serif): the cards as today, and the pills, bubbles, the door, the clinic
//   D  Andika for every Kutchi word (one face per word, an infant face: single-storey a and g); Nunito for the rest
//
// The "Kutchi word" selectors come from the inventory (inventory.mjs, every screen at every size): where the game draws a word
// or a line a child is meant to read or hear as Kutchi. English and the grown-ups' UI keep Nunito in every option.

const WOFF = "__MOCKFONTS__";
// today's link asks Fraunces upright at 600 and 700 only (no italic: the browser slants it); B-D add the true italic and the full axis
const FRAUNCES_TODAY = [600, 700].map((w) => `@font-face { font-family: 'Fraunces'; font-style: normal; font-weight: ${w}; font-display: block; src: url(${WOFF}/fraunces-roman.woff2) format('woff2'); }`).join("\n");
const FRAUNCES_FULL = `@font-face { font-family: 'Fraunces'; font-style: normal; font-weight: 100 900; font-display: block; src: url(${WOFF}/fraunces-roman.woff2) format('woff2'); }
@font-face { font-family: 'Fraunces'; font-style: italic; font-weight: 100 900; font-display: block; src: url(${WOFF}/fraunces-italic.woff2) format('woff2'); }`;
const ANDIKA = `@font-face { font-family: 'Andika'; font-style: normal; font-weight: 400; font-display: block; src: url(${WOFF}/andika-400.woff2) format('woff2'); }
@font-face { font-family: 'Andika'; font-style: normal; font-weight: 500 900; font-display: block; src: url(${WOFF}/andika-700.woff2) format('woff2'); }
@font-face { font-family: 'Andika'; font-style: italic; font-weight: 400 900; font-display: block; src: url(${WOFF}/andika-700-italic.woff2) format('woff2'); }`;
const NUNITO_ITALIC = `@font-face { font-family: 'Nunito'; font-style: italic; font-weight: 200 1000; font-display: block; src: url(${WOFF}/nunito-italic.woff2) format('woff2'); }`;

// where a Kutchi word or line is drawn (DOM); the canvas words follow the tokens (--njg-font-word, --njg-font-display) through
// Tokens.font() when the scene draws them, so the token override reaches them
export const KUTCHI_SEL = [
  // (the s14 card's word, the order headline, Nani's line and the word tiles take --njg-card14-font; the play-area bubble, the
  // dish names and Cook's older panels take cook.css's --kutchi-font; the shelf pills and every drawn word take --njg-font-word)
  ".cv-k",                 // the conversation bubble's Kutchi (the greeting, "Salamun alaykum!")
  ".rs-word > b",          // the end screen's word review
  ".njg-tally-n",          // the tally chip's number word
  ".day-k",                // the door: Nani's lines, the weather and activity cards, Ha! and Na
  ".cl-words .ku",         // the clinic: a Kutchi word in a line (Nani's box, the order card)
  ".hs-said", ".eye-said", // the clinic's heal games: a said word in the scene
];

const faceCss = (stack) => `html:root { --mock-word: ${stack}; --kutchi-font: var(--mock-word) !important; }
${KUTCHI_SEL.join(", ")} { font-family: var(--mock-word) !important; }`;

export const OPTIONS = {
  A: { name: "A: today", faces: FRAUNCES_TODAY, css: "" },
  B: {
    name: "B: Nunito for every word",
    faces: FRAUNCES_FULL + "\n" + NUNITO_ITALIC,
    css: `html:root { --njg-card14-font: "Nunito", system-ui, sans-serif !important; --njg-font-word: "Nunito", sans-serif !important; }
${faceCss('"Nunito", system-ui, sans-serif')}`,
  },
  C: {
    name: "C: Fraunces for every word",
    faces: FRAUNCES_FULL + "\n" + NUNITO_ITALIC,
    css: `html:root { --njg-font-word: "Fraunces", Georgia, serif !important; }
${faceCss('"Fraunces", Georgia, serif')}`,
  },
  D: {
    name: "D: Andika for every word",
    faces: FRAUNCES_FULL + "\n" + NUNITO_ITALIC + "\n" + ANDIKA,
    css: `html:root { --njg-card14-font: "Andika", "Nunito", sans-serif !important; --njg-font-word: "Andika", "Nunito", sans-serif !important; }
${faceCss('"Andika", "Nunito", sans-serif')}`,
  },
};
