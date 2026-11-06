// The font sample of 6 Nov (b): Zafar liked Lora and Fraunces, wanted less bold and "a little bit of serif" (fonts-sample-2026-11-06.md).
// Mock only: shoot.mjs serves these faces and injects each option's CSS; nothing here is loaded by the game.
// Every option is a full set of roles; Nunito keeps the English, the buttons and the UI labels in every option.
//   heading  the order card's headline (the biggest Kutchi line)       card  the Kutchi word on a card (order card, word moment, tiles)
//   line     Nani's line, the bubbles, the door's lines                   pill  the shelf pills (drawn), the end screen's words
const W = "__MOCKFONTS__";
const face = (fam, file, style = "normal", wt = "100 900") => `@font-face { font-family: '${fam}'; font-style: ${style}; font-weight: ${wt}; font-display: block; src: url(${W}/${file}) format('woff2'); }`;
const FACES = [
  face("Fraunces", "fraunces-roman.woff2"), face("Fraunces", "fraunces-italic.woff2", "italic"),
  face("Fraunces Full", "fraunces-full-normal.woff2"),
  face("Lora", "lora-normal.woff2", "normal", "400 700"), face("Lora", "lora-italic.woff2", "italic", "400 700"),
  face("Literata", "literata-normal.woff2", "normal", "200 900"), face("Literata", "literata-italic.woff2", "italic", "200 900"),
  face("Source Serif 4", "source-serif-4-normal.woff2", "normal", "200 900"), face("Source Serif 4", "source-serif-4-italic.woff2", "italic", "200 900"),
  face("Alegreya", "alegreya-normal.woff2", "normal", "400 900"), face("Alegreya", "alegreya-italic.woff2", "italic", "400 900"),
  face("Nunito", "nunito-italic.woff2", "italic", "200 1000"),
].join("\n");

const SEL = {
  heading: [".oc-card.oc-s14 .oc-headline"],
  card: [".wc14 .wc-slot.wc14-k", ".wc-k", ".wt-word"],
  line: ["body.njg-s14 #guide.ng-s14 .ng-line", ".wp .wp-text", ".cv-k", ".day-k", ".ir", ".lc"],
  pill: [".wr-pill b", ".rs-word > b", ".njg-tally-n"],
};
const FR = `"Fraunces Full", "Fraunces", Georgia, serif`;
const stack = (f) => (f === "Fraunces" ? FR : `"${f}", Georgia, serif`);
// Fraunces with its SOFT and WONK axes off (no soft blobs, no leaning letters) and the optical size following the size
const vary = (f) => (f === "Fraunces" ? `font-variation-settings: "SOFT" 0, "WONK" 0 !important; font-optical-sizing: auto !important;` : "");

// roles: { heading: [face, weight], card: [...], line: [...], pill: [...] }
function css(roles) {
  const out = [`html:root { --njg-card14-font: ${stack(roles.card[0])} !important; --kutchi-font: ${stack(roles.line[0])} !important; --njg-font-word: ${stack(roles.pill[0])} !important; }`];
  for (const [role, [f, w]] of Object.entries(roles)) out.push(`${SEL[role].join(", ")} { font-family: ${stack(f)} !important; font-weight: ${w} !important; ${vary(f)} }`);
  return out.join("\n");
}

const mk = (name, roles, why) => ({ name, roles, why, faces: FACES, css: css(roles) });
export const OPTIONS = {
  A: { name: "A: today", faces: FACES, css: "", roles: null, why: "Fraunces 700 on the cards and Nani's line, Baloo 2 800 in the bubbles, Nunito on the pills" },
  L: mk("1: Lora throughout", { heading: ["Lora", 600], card: ["Lora", 600], line: ["Lora", 500], pill: ["Lora", 600] }, "one calm book face; semibold only for the words that must stand out"),
  F: mk("2: Fraunces bold + Lora", { heading: ["Fraunces", 600], card: ["Fraunces", 600], line: ["Lora", 500], pill: ["Lora", 600] }, "Fraunces (soft and wonk off) for the headline and the card word, Lora for everything spoken"),
  G: mk("3: Lora + Fraunces headline", { heading: ["Fraunces", 600], card: ["Lora", 600], line: ["Lora", 500], pill: ["Lora", 600] }, "Lora everywhere a word is read; Fraunces only for the one big headline"),
  T: mk("4: Literata", { heading: ["Literata", 600], card: ["Literata", 600], line: ["Literata", 450], pill: ["Literata", 600] }, "made for reading on screens (Google Play Books); big x-height, open letters"),
  S: mk("5: Source Serif 4", { heading: ["Source Serif 4", 600], card: ["Source Serif 4", 600], line: ["Source Serif 4", 450], pill: ["Source Serif 4", 600] }, "Adobe's plain, clean serif; the least ornament, very clear letters"),
  R: mk("6: Alegreya", { heading: ["Alegreya", 600], card: ["Alegreya", 600], line: ["Alegreya", 500], pill: ["Alegreya", 600] }, "a warm, hand-made book face; the most character, small letters"),
};
