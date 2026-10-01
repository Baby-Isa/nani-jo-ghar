#!/usr/bin/env node
/*
 * labs.html, generated (target-model § 6.1: "labs.html is generated from every mode's lab() list, so it never goes
 * stale"). Never hand-edit labs.html: change a mode's lab() or the STATIC list below, then run this.
 *
 *   node build/gen_labs.mjs           write labs.html
 *   node build/gen_labs.mjs --check   exit 1 if labs.html isn't what this would write (a stale or hand-edited page)
 *
 * Two parts:
 *   - every MOVED mode (js/<mode>/main.js, the mode interface: js/shared/mode.js): one card per lab() entry
 *     (lab.html?mode=…&game=…&level=…), plus its story errands (data/arcs: errands of this mode that are
 *     playable) and its free play;
 *   - STATIC: the modes and pages not yet moved, exactly as labs.html listed them by hand (R0's parked and old
 *     labels included). A mode's cards leave STATIC when its main.js lands (R4 Cook, R5 the clinic).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { labList, labUrl, errandsOf } from "../js/shared/mode.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "labs.html");

// titles and texts are trusted HTML (entities as written); a moved mode's labels are escaped
export const STATIC = [
  {
    title: "Live games",
    cards: [
      {href: "cook.html", title: "Cook with Nani", text: "The main game (calm UI, batch 1 art, Wave 6b: end-of-round screen, tap-measure pour, onboarding per station)."},
      {href: "find.html", title: "Find it", text: "Nani's list + Check the bag.", tag: "parked"},
    ],
  },
  {
    title: "New modes (labs)",
    cards: [
      {href: "monsoon.html", title: "Monsoon rush", text: "Kitchen leak, drip count, You call it (speaking). Drizzle and Busy.", tag: "parked"},
      {href: "who.html?lab=1", title: "Who did it?", text: "Look closer, Who ate this one?, Keep who fits, Tell Ali.", tag: "parked"},
      {href: "tidy.html", title: "Tidy up", text: "Put it away, the dastarkhwan, the fruit box, Ali's turn.", tag: "parked"},
      {href: "dress.html", title: "Dress up", text: "Lay it out, the fitting, Big Ma's mending, bangles.", tag: "parked"},
      {href: "snap.html?lab=1", title: "Snap", text: "Just so many, The big one, Show Nani, Ali's camera.", tag: "parked"},
    ],
  },
  {
    title: "The clinic: full build, rough placeholder art",
    lead: "The whole pipeline: waiting room, diagnosis, the pharmacy belt, heal, send-off. Words are English placeholders until the family's recordings go in; the art is throwaway.",
    cards: [
      {href: "clinic.html", title: "The clinic", text: "Play a clinic morning (the first ever is one tiny patient). Saves your progress."},
      {href: "lab/clinic-core.html", title: "Clinic lab index", text: "Every stage &times; variant &times; level, and every healing game in the pipeline.", tag: "old"},
      {href: "clinic.html?lab=1", title: "Clinic lab bar", text: "Pick a morning, a patient, one stage or one healing game."},
    ],
  },
  {
    title: "Clinic stages",
    cards: [
      {href: "clinic.html?lab=1&stage=waiting&level=1&variant=W1", title: "1 Waiting room", text: "W1&ndash;W4 (W3 is spoken)."},
      {href: "clinic.html?lab=1&stage=diagnosis&level=1&variant=D1", title: "2 Diagnosis", text: "D1, D1b, D2, D3, with the face magnifier."},
      {href: "clinic.html?lab=1&stage=pharmacy&level=1", title: "3 Pharmacy belt", text: "Tap what the doctor needs; the handover."},
      {href: "clinic.html?lab=1&stage=heal&game=cut&level=1", title: "4 Heal", text: "Mounts one healing game (the scrape here)."},
      {href: "clinic.html?lab=1&stage=sendoff&level=1&variant=E1", title: "5 Send-off", text: "E1&ndash;E4 (E3 and E4 are spoken)."},
      {href: "clinic.html?lab=1&patient=1&level=1", title: "One patient", text: "All five stages, then the end-of-round screen."},
    ],
  },
  {
    title: "Clinic healing games (labs)",
    cards: [
      {href: "lab/clinic-heal-host.html?game=cut&level=1", title: "Heal: cut", text: "the scrape (core). Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=knee&level=1", title: "Heal: knee", text: "knee: tap, then wrap. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=ear&level=1", title: "Heal: ear", text: "ear: torch, pluck, drops. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=tooth&level=1", title: "Heal: tooth", text: "tooth: brush, drill, sugar bug. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=taste&level=1", title: "Heal: taste", text: "taste: droppers and cups. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=fever&level=1", title: "Heal: fever", text: "fever: the conversation. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=boing&level=1", title: "Heal: boing", text: "boing: the comic injection. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=eye&level=1", title: "Heal: eye", text: "eye: drops and the pirate patch. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=foot&level=1", title: "Heal: foot", text: "foot: hot or cold, the thorn. Levels 1&ndash;3 in the lab bar."},
      {href: "lab/clinic-heal-host.html?game=tummy&level=1&src=js%2Fclinic%2Fheal%2Fgames%2Ftummy.js&src=js%2Fclinic%2Fheal%2Fgames%2Fhic.js&src=js%2Fclinic%2Fheal%2Fgames%2Fhair.js", title: "Heal extra: tummy", text: "bubbles and burps (maybe later; lab only)."},
      {href: "lab/clinic-heal-host.html?game=hic&level=1&src=js%2Fclinic%2Fheal%2Fgames%2Ftummy.js&src=js%2Fclinic%2Fheal%2Fgames%2Fhic.js&src=js%2Fclinic%2Fheal%2Fgames%2Fhair.js", title: "Heal extra: hic", text: "hiccups (maybe later; lab only)."},
      {href: "lab/clinic-heal-host.html?game=hair&level=1&src=js%2Fclinic%2Fheal%2Fgames%2Ftummy.js&src=js%2Fclinic%2Fheal%2Fgames%2Fhic.js&src=js%2Fclinic%2Fheal%2Fgames%2Fhair.js", title: "Heal extra: hair", text: "the beetles (maybe later; lab only)."},
      {href: "lab/clinic-heal-a.html", title: "Heal dev page A", text: "v2: scrape, knee, ear, tooth.", tag: "old"},
      {href: "lab/clinic-heal-b.html", title: "Heal dev page B", text: "v2: the soothing drinks, fever, boing.", tag: "old"},
      {href: "lab/clinic-heal-c.html", title: "Heal dev page C", text: "v2: eye, foot; the extras unchanged.", tag: "old"},
    ],
  },
  {
    title: "Behind the scenes",
    cards: [
      {href: "lab/shared.html", title: "Shared pieces", text: "Speech, the \"which one?\" chooser, relations, stars, overlays.", tag: "old"},
      {href: "lab/conversations.html", title: "Conversations", text: "The nine MVP exchanges: play each one, boy/girl voice, register, placeholder flags; simulate the first launch, Cook and the clinic."},
      {href: "lab/family-audio.html", title: "Family voice clips", text: "Mum's and Zafar's words from the recordings (Section B, then Round 3): play each one, tick the good ones."},
      {href: "lab/shared-ui.html", title: "End-of-round screen and onboarding", text: "The three badges and word review; the ghost-hand onboarding on a fake chai station."},
      {href: "lab/order-card.html", title: "Order card", text: "The shared person card (person &rarr; items &rarr; parts): every state, in the sidebar and the request pop-up."},
    ],
  },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const href = (h) => h.replace(/&/g, "&amp;");
const card = (c) => `    <a class="card" href="${href(c.href)}"><b>${c.title}${c.tag ? ` <em class="tag">${c.tag}</em>` : ""}</b><span>${c.text}</span></a>`;
const section = (s) => [`  <h2>${s.title}</h2>`, s.lead ? `  <p class="lead">${s.lead}</p>` : null, `  <div class="grid">`, ...s.cards.map(card), `  </div>`].filter(Boolean).join("\n");

/** The moved modes (js/<mode>/main.js), loaded through the mode interface. */
export async function movedModes(root = ROOT) {
  const dirs = readdirSync(join(root, "js"), { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(join(root, "js", d.name, "main.js")));
  const out = [];
  for (const d of dirs.sort((a, b) => a.name.localeCompare(b.name))) out.push((await import(pathToFileURL(join(root, "js", d.name, "main.js")).href)).default);
  return out;
}

/** The generated sections for the moved modes. */
export function hostSections(modes, arcs) {
  if (!modes.length) return [];
  return modes.map((m) => {
    const levels = (ls) => (ls.length > 1 ? `Levels ${ls[0]}&ndash;${ls[ls.length - 1]}: change <code>level=</code>.` : `Level ${ls[0]}.`);
    const cards = labList([m]).map((l) => ({ href: l.url, title: esc(l.label), tag: m.dev ? "test" : null, text: `${l.note ? esc(l.note) + " " : ""}${levels(l.levels)}` }));
    Object.values(arcs)
      .flatMap((a) => errandsOf(a).map((x) => Object.assign({ arc: a }, x)))
      .filter((x) => x.errand.mode === m.id && x.errand.status === "playable")
      .forEach((x) => cards.push({ href: labUrl(m.id, null, null, `&play=story&arc=${x.arc.id}&chapter=${x.chapter}&errand=${x.errand.id}`), title: `Story: ${esc(x.arc.id)}, ${esc(x.errand.id)}`, tag: x.arc.test ? "test" : null, text: `Chapter ${x.chapter} of the ${esc(x.arc.id)} arc, as story mode plays it (data/arcs/${esc(x.arc.id)}.json).` }));
    if (m.free) cards.push({ href: labUrl(m.id, null, null, "&play=free"), title: "Free play", tag: m.dev ? "test" : null, text: "As the map starts it: locked until the story that opens it says so." });
    return { title: `${esc(m.id)}: on the game host`, lead: "Runs through the one game host (lab.html; js/shared/host.js). Made from the mode's own lab() list by build/gen_labs.mjs.", cards };
  });
}

export async function render(root = ROOT) {
  const index = JSON.parse(readFileSync(join(root, "data/arcs/index.json"), "utf8"));
  const arcs = Object.fromEntries(index.arcs.map((a) => [a.id, JSON.parse(readFileSync(join(root, "data/arcs", `${a.id}.json`), "utf8"))]));
  const moved = await movedModes(root);
  const host = hostSections(moved, arcs);
  // the moved modes go just before "Behind the scenes"
  const behind = STATIC.findIndex((s) => s.title === "Behind the scenes");
  const sections = STATIC.slice(0, behind).concat(host, STATIC.slice(behind));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nani jo Ghar: game labs</title>
<!-- GENERATED by build/gen_labs.mjs from every mode's lab() list and its STATIC list: never hand-edit. -->
<style>
  :root { --bg: #fbf5ec; --ink: #3b2a20; --muted: #7a6558; --card: #fff; --line: #e6d6c3; --accent: #8a4b2a; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; }
  h1 { color: var(--accent); margin: 0 0 4px; font-size: 1.7rem; }
  p.lead { color: var(--muted); margin: 0 0 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  a.card { display: block; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; text-decoration: none; color: inherit; }
  a.card:hover { border-color: var(--accent); }
  a.card b { display: block; color: var(--accent); font-size: 1.1rem; margin-bottom: 2px; }
  a.card span { color: var(--muted); font-size: .92rem; }
  h2 { font-size: 1.05rem; margin: 28px 0 10px; }
  em.tag { font: 600 .72rem/1 system-ui, sans-serif; font-style: normal; color: var(--muted); border: 1px solid var(--line); border-radius: 6px; padding: 2px 6px; margin-left: 6px; vertical-align: middle; white-space: nowrap; }
  .note { font-size: .9rem; color: var(--muted); margin-top: 28px; }
</style>
</head>
<body>
<main>
  <h1>Game labs</h1>
  <p class="lead">Grey-box versions of the new modes, for trying the mechanics. Every lab has level and game pickers at the top. Words are mostly English placeholders until the family's recordings go in.</p>

${sections.map(section).join("\n\n")}

  <p class="note">Speaking moments ask for the microphone; if you say no, word pills appear instead. Nothing you say leaves the device.</p>
</main>
</body>
</html>
`;
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const html = await render();
  if (process.argv.includes("--check")) {
    const cur = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
    if (cur !== html) {
      console.error("gen_labs: labs.html is stale or hand-edited: run node build/gen_labs.mjs");
      process.exit(1);
    }
    console.log("gen_labs: labs.html is up to date");
  } else {
    writeFileSync(OUT, html);
    console.log(`gen_labs: wrote labs.html (${(html.match(/class="card"/g) || []).length} cards)`);
  }
}
