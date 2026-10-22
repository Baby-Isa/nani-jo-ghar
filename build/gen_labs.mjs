#!/usr/bin/env node
/*
 * labs.html, generated (target-model § 6.1: "labs.html is generated from every mode's lab() list, so it never goes
 * stale"). Never hand-edit labs.html: change a mode's lab() or the lists below, then run this.
 *
 *   node build/gen_labs.mjs           write labs.html
 *   node build/gen_labs.mjs --check   exit 1 if labs.html isn't what this would write (a stale or hand-edited page)
 *
 * The page (Sprint 10, Zafar 21 Oct), top to bottom:
 *   1. a top row: the New player toggle (Sprint 11, Zafar 22 Oct: on, every launch plays a reset "New player" profile; his own
 *      player is never wiped; labsPlayer below), the Walkthrough (Cook's own ?first=pantry chain, then chai), the house, the day builder;
 *   2. "Play any game": every Cook station and every clinic game once each, each with a level picker and a Play button (like
 *      lab/clinic-heal-host.html), made from the moved modes' lab() lists (js/<mode>/main.js: the mode interface, js/shared/mode.js),
 *      plus the day's door, ride and book;
 *   3. one folded <details> "Behind the scenes": every retired, old, parked, test and demo page, once each. Nothing is deleted.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { labList, labUrl, errandsOf } from "../js/shared/mode.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "labs.html");

// ---------------------------------------------------------------- the top row

/** The Walkthrough (Zafar, 21 Oct): Cook's own first-launch chain, pantry (the chai things) then one cup of chai, then back here. */
export const WALKTHROUGH = "cook.html?app=1&first=pantry&then=" + encodeURIComponent("cook.html?app=1&first=chai&then=labs.html");

export const TOP = [
  { id: "new-player", toggle: true, title: "New player", text: "On: every launch plays a fresh New player (no words, every first-time help, level 1). Off: your own player, never wiped." },
  { href: WALKTHROUGH, title: "Walkthrough", text: "Nani's pantry list, then one cup of chai, as a new player sees it." },
  { href: "index.html", title: "The house", text: "Nani's house, the game as the child plays it." },
  { href: "lab/day.html", title: "The day builder", text: "Pick the stages of a day in order, or one game, and play it." },
];

/**
 * The New player toggle (Sprint 11, Zafar 22 Oct), the page's own logic, embedded in labs.html as written here (so the unit test
 * runs the same code). Save: js/shared/save.js; store: a localStorage-like object (every access wrapped). On: before a launch the
 * dedicated "New player" profile (made once with Save.addPlayer, its id remembered) is selected and reset (Save.resetPlayer). Off:
 * the grown-up's own player (remembered when the toggle goes on) is selected again; it is never reset.
 */
export function labsPlayer(Save, store) {
  var NAME = "New player", K_ON = "njg-labs-new-player", K_OWN = "njg-labs-own-player", K_NEW = "njg-labs-new-player-id";
  var get = function (k) { try { return store.getItem(k); } catch (e) { return null; } };
  var put = function (k, v) { try { if (v == null) store.removeItem(k); else store.setItem(k, v); } catch (e) { /* this visit only */ } };
  var has = function (id) { return !!id && Save.players().some(function (p) { return p.id === id; }); };
  var newId = function () {
    var id = get(K_NEW);
    if (has(id)) return id;
    var p = Save.players().filter(function (q) { return q.name === NAME; })[0];
    return p ? p.id : null;
  };
  var ownId = function () {
    var id = get(K_OWN);
    if (has(id) && id !== newId()) return id;
    var p = Save.players().filter(function (q) { return q.id !== newId(); })[0];
    return p ? p.id : null;
  };
  var remember = function () { var c = Save.currentId(); if (c && c !== newId()) put(K_OWN, c); };
  var api = {
    NAME: NAME,
    on: function () { return get(K_ON) === "1"; },
    setOn: function (v) { remember(); put(K_ON, v ? "1" : "0"); return api.label(); },
    /** The player a launch plays as, chosen (and, when on, reset) now. -> that player */
    launch: function () {
      remember();
      if (api.on()) {
        var id = newId();
        if (!id) { id = Save.addPlayer({ name: NAME }).id; put(K_NEW, id); }
        Save.select(id);
        Save.resetPlayer(id);
        return Save.current();
      }
      var own = ownId();
      if (own) Save.select(own);
      else Save.addPlayer({ name: "Player 1" });
      return Save.current();
    },
    /** Who will play: the badge's words */
    label: function () {
      if (api.on()) return NAME + " (fresh every launch)";
      var own = ownId();
      var p = Save.players().filter(function (q) { return q.id === own; })[0];
      return p ? p.name : "Player 1";
    },
  };
  return api;
}

// ---------------------------------------------------------------- the day's door, ride and book (day.html)

/** A pick other than a level: the door's weather, the book's day. {v} in a url is the chosen value. */
export const DAY_GAMES = [
  { title: "The door", text: "The morning door: Nani at the door, the weather in the sky, her lines and the answer.", tpl: "day.html?stages=door:{v}", pick: { label: "Weather", options: [["sunny", "sunny"], ["cloudy", "cloudy"], ["raining", "raining"], ["night", "night"]] } },
  { title: "The window ride", text: "The ride to the farm, looking out of the window.", tpl: "day.html?stage=ride&day=2&level={v}", pick: { label: "Level", options: [[1, "1"], [2, "2"], [3, "3"]] } },
  { title: "The evening book", text: "Nani's book of the day, with the day's words.", tpl: "day.html?stage=book&log={v}", pick: { label: "After", options: [["kitchen", "a kitchen day"], ["clinic", "a clinic day"], ["farm", "the farm"]] } },
];

// ---------------------------------------------------------------- Behind the scenes: pages that are not a game to play

/** Titles and texts are trusted HTML (entities as written); a moved mode's labels are escaped. */
export const BEHIND = [
  {
    title: "Parked modes",
    lead: "Not in the child's game yet; they run as they are.",
    cards: [
      { href: "find.html", title: "Find it", text: "Nani's list + Check the bag.", tag: "parked" },
      { href: "monsoon.html", title: "Monsoon rush", text: "Kitchen leak, drip count, You call it (speaking). Drizzle and Busy.", tag: "parked" },
      { href: "who.html?lab=1", title: "Who did it?", text: "Look closer, Who ate this one?, Keep who fits, Tell Ali.", tag: "parked" },
      { href: "tidy.html", title: "Tidy up", text: "Put it away, the dastarkhwan, the fruit box, Ali's turn.", tag: "parked" },
      { href: "dress.html", title: "Dress up", text: "Lay it out, the fitting, Big Ma's mending, bangles.", tag: "parked" },
      { href: "snap.html?lab=1", title: "Snap", text: "Just so many, The big one, Show Nani, Ali's camera.", tag: "parked" },
    ],
  },
  {
    title: "Old lab pages",
    lead: "Replaced by the game grid above; kept, never deleted.",
    cards: [
      { href: "lab/clinic-core.html", title: "Clinic lab index", text: "Every stage &times; variant &times; level, and every healing game in the pipeline.", tag: "old" },
      { href: "lab/clinic-heal-a.html", title: "Heal dev page A", text: "v2: scrape, knee, ear, tooth.", tag: "old" },
      { href: "lab/clinic-heal-b.html", title: "Heal dev page B", text: "v2: the soothing drinks, fever, boing.", tag: "old" },
      { href: "lab/clinic-heal-c.html", title: "Heal dev page C", text: "v2: eye, foot; the extras unchanged.", tag: "old" },
      { href: "lab/shared.html", title: "Shared pieces", text: "Speech, the \"which one?\" chooser, relations, stars, overlays.", tag: "old" },
    ],
  },
  {
    title: "Clinic dev pages",
    cards: [
      { href: "clinic.html?lab=1", title: "Clinic lab bar", text: "Pick a morning, a patient, one stage (with its variant) or one healing game, with the log." },
      { href: "lab/clinic-heal-host.html?game=cut&level=1", title: "Heal host", text: "Any registered healing game on the real clinic screen: game, level, side, who, seed, tray." },
    ],
  },
  {
    title: "Reference sheets and sound boards",
    cards: [
      { href: "lab/conversations.html", title: "Conversations", text: "The nine MVP exchanges: play each one, boy/girl voice, register, placeholder flags; simulate the first launch, Cook and the clinic." },
      { href: "lab/family-audio.html", title: "Family voice clips", text: "Mum's and Zafar's words from the recordings (Section B, then Round 3): play each one, tick the good ones." },
      { href: "lab/shared-ui.html", title: "End-of-round screen and onboarding", text: "The three badges and word review; the ghost-hand onboarding on a fake chai station." },
      { href: "lab/word-card.html", title: "Word card and hint rungs", text: "Sprint 11: the shared word card at its five stages (English, then the picture, then the Kutchi text fade; the free reveals), and the real item's demo with the 5 s and 15 s rungs." },
      { href: "lab/play-log.html", title: "Play log", text: "Where players hesitated on this device: each step's seconds to the first action, taps that did nothing and help shown; slow steps flagged; export as JSON." },
      { href: "lab/order-card.html", title: "Order card", text: "The shared person card (person &rarr; items &rarr; parts): every state, in the sidebar and the request pop-up." },
      { href: "lab/kit.html", title: "Shared kit: every state", text: "The frame's sidebar kit on one sheet: the guide box, the order card (stacked and pills), the tally and the bulb. <code>?part=results</code> or <code>?part=words</code> opens the end screen." },
    ],
  },
];

// ---------------------------------------------------------------- building the page

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const href = (h) => h.replace(/&/g, "&amp;");
const tagOf = (t) => (t ? ` <em class="tag">${t}</em>` : "");
const card = (c) => `    <a class="card" href="${href(c.href)}"><b>${c.title}${tagOf(c.tag)}</b><span>${c.text}</span></a>`;
const grid = (cards) => [`  <div class="grid">`, ...cards.map(card), `  </div>`].join("\n");
const sub = (s) => [`  <h3>${s.title}</h3>`, s.lead ? `  <p class="lead">${s.lead}</p>` : null, grid(s.cards)].filter(Boolean).join("\n");

/** A game with a picker and a Play button: the link works without script (the first option), the script keeps it in step. */
function gameCard({ title, text, tpl, pick }) {
  if (!pick) return [`    <div class="game">`, `      <b>${title}</b>`, `      <span>${text}</span>`, `      <div class="bar"><a class="play" href="${href(tpl)}">Play</a></div>`, `    </div>`].join("\n");
  const first = pick.options[0][0];
  const id = `p-${Math.abs([...tpl].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))}`;
  return [
    `    <div class="game" data-tpl="${href(tpl)}">`,
    `      <b>${title}</b>`,
    `      <span>${text}</span>`,
    `      <div class="bar">`,
    `        <label for="${id}">${pick.label}</label>`,
    `        <select id="${id}">${pick.options.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join("")}</select>`,
    `        <a class="play" href="${href(tpl.replace("{v}", first))}">Play</a>`,
    `      </div>`,
    `    </div>`,
  ].join("\n");
}
const levelPick = (levels) => ({ label: "Level", options: levels.map((l) => [l, String(l)]) });

/** What a lab() note says when it only names the plumbing ("through the one game host"): left off the card. The healing games say what they play. */
const GENERIC = [/^A Station-lab station/, /^One healing game, mounted/, /^A whole recipe/];
const HEAL_NOTES = { cut: "The scrape: clean and cover.", knee: "Tap, then wrap.", ear: "Torch, pluck, drops.", tooth: "Brush, drill, sugar bug.", taste: "Droppers and cups.", fever: "The conversation.", boing: "The comic injection.", eye: "Drops and the pirate patch.", foot: "Hot or cold, the thorn." };

/** Strip the mode prefix a lab() label carries ("Cook: Chai tray" -> "Chai tray"); the section names the mode. */
const plain = (label) => {
  const t = label.replace(/^(Cook|Clinic heal|Clinic heal \(parked\)|Clinic): /, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** The moved modes (js/<mode>/main.js), loaded through the mode interface. */
export async function movedModes(root = ROOT) {
  const dirs = readdirSync(join(root, "js"), { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(join(root, "js", d.name, "main.js")));
  const out = [];
  for (const d of dirs.sort((a, b) => a.name.localeCompare(b.name))) out.push((await import(pathToFileURL(join(root, "js", d.name, "main.js")).href)).default);
  return out;
}

/**
 * Every lab() entry of the moved modes, sorted into the page's sections: {play: [{title, groups}], behind: [cards]}.
 * A dev (test) mode and a parked game or a test variant (an entry with its own `extra` query) go behind the scenes.
 */
export function sortEntries(modes, arcs) {
  const groups = {}; // "Cook stations" -> [gameCard args]
  const put = (g, c) => (groups[g] = groups[g] || []).push(c);
  const behind = { test: [], story: [] };
  const noteOf = (m, l) => (m.id === "clinic" && HEAL_NOTES[l.game]) || (GENERIC.some((re) => re.test(l.note || "")) ? "" : l.note || "");
  const card1 = (m, l, extra = {}) => ({ title: esc(plain(l.label)), text: esc(noteOf(m, l)), tpl: labUrl(m.id, l.game, "{v}", l.extra || ""), pick: levelPick(l.levels), ...extra });
  for (const m of modes) {
    if (m.dev) {
      // a test mode (the demo adapters): its lab list, its story errands and free play, tagged test
      labList([m]).forEach((l) => behind.test.push({ href: l.url, title: esc(l.label), tag: "test", text: `${l.note ? esc(l.note) + " " : ""}${l.levels.length > 1 ? `Levels ${l.levels[0]}&ndash;${l.levels[l.levels.length - 1]}: change <code>level=</code>.` : `Level ${l.levels[0]}.`}` }));
    } else {
      for (const l of labList([m])) {
        if (/^Parked/.test(l.note)) behind.test.push({ href: l.url, title: esc(l.label), tag: "parked", text: `${esc(l.note)} Levels ${l.levels[0]}&ndash;${l.levels[l.levels.length - 1]}: change <code>level=</code>.` });
        else if (l.url.includes("&eyetest=")) behind.test.push({ href: l.url, title: esc(l.label), tag: "test", text: `${esc(l.note)} Levels ${l.levels[0]}&ndash;${l.levels[l.levels.length - 1]}: change <code>level=</code>.` });
        else if (m.id === "cook") {
          if (l.game && /^recipe-/.test(l.game)) put("Cook: a whole dish, every station in turn", card1(m, l));
          else if (l.game === "order" || l.game === null) put("Cook: rounds", card1(m, l));
          else put("Cook stations", card1(m, l));
        } else if (m.id === "clinic") {
          if (l.game && ["waiting", "diagnosis", "pharmacy", "sendoff"].includes(l.game)) put("Clinic: the stages", card1(m, l));
          else if (l.game === null) {
            put("Clinic: a patient and a morning", { title: "A clinic morning", text: "The clinic as the child plays it: a morning of patients, then close the clinic. Saves the clinic's progress.", tpl: "clinic.html?level={v}", pick: levelPick([1, 2, 3, 4]) });
            put("Clinic: a patient and a morning", card1(m, l));
          }
          else put("Clinic: the healing games", card1(m, l));
        } else put(`${esc(m.id)}`, card1(m, l));
      }
    }
    // story errands and free play of this mode: a test mode's go with its tests, a real mode's under "Story and free play"
    const into = m.dev ? behind.test : behind.story;
    Object.values(arcs)
      .flatMap((a) => errandsOf(a).map((x) => Object.assign({ arc: a }, x)))
      .filter((x) => x.errand.mode === m.id && x.errand.status === "playable")
      .forEach((x) => into.push({ href: labUrl(m.id, null, null, `&play=story&arc=${x.arc.id}&chapter=${x.chapter}&errand=${x.errand.id}`), title: `Story: ${esc(x.arc.id)}, ${esc(x.errand.id)}`, tag: x.arc.test ? "test" : null, text: `Chapter ${x.chapter} of the ${esc(x.arc.id)} arc, as story mode plays it (data/arcs/${esc(x.arc.id)}.json).` }));
    if (m.free) into.push({ href: labUrl(m.id, null, null, "&play=free"), title: m.dev ? "Free play" : `${esc(m.id)}: free play`, tag: m.dev ? "test" : null, text: "As the map starts it: locked until the story that opens it says so." });
  }
  return { groups, behind };
}

const ORDER = ["Cook stations", "Cook: a whole dish, every station in turn", "Cook: rounds", "Clinic: a patient and a morning", "Clinic: the healing games", "Clinic: the stages"];

export async function render(root = ROOT) {
  const index = JSON.parse(readFileSync(join(root, "data/arcs/index.json"), "utf8"));
  const arcs = Object.fromEntries(index.arcs.map((a) => [a.id, JSON.parse(readFileSync(join(root, "data/arcs", `${a.id}.json`), "utf8"))]));
  const V = (readFileSync(join(root, "js/version.js"), "utf8").match(/const V = "([^"]*)"/) || [])[1] || "0";
  const { groups, behind } = sortEntries(await movedModes(root), arcs);
  const names = ORDER.filter((g) => groups[g]).concat(Object.keys(groups).filter((g) => !ORDER.includes(g)));
  const play = names.map((g) => `  <h2 class="grp">${esc(g)}</h2>\n  <div class="games">\n${groups[g].map(gameCard).join("\n")}\n  </div>`);
  play.push(`  <h2 class="grp">A day at Nani's: the door, the ride, the book</h2>\n  <div class="games">\n${DAY_GAMES.map(gameCard).join("\n")}\n  </div>`);
  const hidden = BEHIND.map((s) => ({ ...s }));
  hidden.splice(2, 0, { title: "Test, demo and parked games", lead: "On the game host (lab.html); made from each mode's lab() list.", cards: behind.test });
  hidden.splice(3, 0, { title: "Story and free play", lead: "Story mode's errands and free play, as the map starts them.", cards: behind.story });
  const top = TOP.map((t) =>
    t.toggle
      ? `    <label class="top toggle" id="${t.id}"><input type="checkbox" id="${t.id}-toggle"><i class="switch" aria-hidden="true"></i><b>${t.title}</b><span>${t.text}</span></label>`
      : `    <a class="top" href="${href(t.href)}"><b>${t.title}</b><span>${t.text}</span></a>`
  );
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nani jo Ghar: game labs</title>
<!-- GENERATED by build/gen_labs.mjs from every mode's lab() list: never hand-edit. -->
<style>
  :root { --bg: #fbf5ec; --ink: #3b2a20; --muted: #7a6558; --card: #fff; --line: #e6d6c3; --accent: #8a4b2a; --go: #2f6b4f; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 1180px; margin: 0 auto; padding: 20px 16px 48px; }
  h1 { color: var(--accent); margin: 0 0 4px; font-size: 1.7rem; }
  p.lead { color: var(--muted); margin: 0 0 12px; }
  h2 { font-size: 1.25rem; margin: 28px 0 4px; color: var(--accent); }
  h2.grp { font-size: 1.02rem; margin: 22px 0 8px; color: var(--ink); }
  h3 { font-size: 1.02rem; margin: 20px 0 8px; }
  .top-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 14px 0 6px; }
  .top { display: block; text-align: left; font: inherit; color: inherit; background: var(--card); border: 2px solid var(--accent); border-radius: 14px; padding: 14px 16px; text-decoration: none; cursor: pointer; min-height: 88px; }
  .top:hover, .top:focus-visible { background: #fff7ea; }
  .top b { display: block; color: var(--accent); font-size: 1.2rem; margin-bottom: 2px; }
  .top span { color: var(--muted); font-size: .92rem; }
  .top.toggle { position: relative; padding-right: 76px; }
  .top.toggle input { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .top.toggle .switch { position: absolute; right: 16px; top: 16px; width: 48px; height: 28px; border-radius: 14px; background: var(--line); transition: background .2s; }
  .top.toggle .switch::after { content: ""; position: absolute; left: 3px; top: 3px; width: 22px; height: 22px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: left .2s; }
  .top.toggle input:checked ~ .switch { background: var(--go); }
  .top.toggle input:checked ~ .switch::after { left: 23px; }
  .top.toggle input:focus-visible ~ .switch { outline: 3px solid var(--accent); outline-offset: 2px; }
  .top.toggle.on { background: #eef7f1; border-color: var(--go); }
  #player-badge { display: inline-block; margin: 8px 0 0; padding: 8px 14px; border-radius: 999px; background: #fff; border: 2px solid var(--line); color: var(--ink); font-weight: 600; }
  #player-badge.on { background: #e7f3ec; border-color: #b7d8c5; color: #1f4d37; }
  .grid, .games { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  .games { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }
  a.card { display: block; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; text-decoration: none; color: inherit; }
  a.card:hover { border-color: var(--accent); }
  a.card b, .game b { display: block; color: var(--accent); font-size: 1.1rem; margin-bottom: 2px; }
  a.card span, .game > span { color: var(--muted); font-size: .92rem; }
  .game { display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; }
  .game > span { flex: 1 1 auto; }
  .bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
  .bar label { font-size: .9rem; color: var(--muted); }
  .bar select { font: inherit; min-height: 44px; padding: 0 10px; border-radius: 10px; border: 1px solid var(--line); background: #fff; color: var(--ink); }
  a.play { margin-left: auto; display: inline-flex; align-items: center; justify-content: center; min-height: 44px; min-width: 84px; padding: 0 18px; border-radius: 10px; background: var(--go); color: #fff; font-weight: 700; text-decoration: none; }
  a.play:hover, a.play:focus-visible { background: #24543e; }
  em.tag { font: 600 .72rem/1 system-ui, sans-serif; font-style: normal; color: var(--muted); border: 1px solid var(--line); border-radius: 6px; padding: 2px 6px; margin-left: 6px; vertical-align: middle; white-space: nowrap; }
  details.behind { margin-top: 36px; border-top: 2px solid var(--line); padding-top: 12px; }
  details.behind > summary { cursor: pointer; font-size: 1.15rem; font-weight: 700; color: var(--accent); padding: 8px 0; min-height: 44px; }
  .note { font-size: .9rem; color: var(--muted); margin-top: 28px; }
</style>
</head>
<body>
<main>
  <h1>Game labs</h1>
  <p class="lead">Everything to show and try, for grown-ups. Words are mostly English placeholders until the family's recordings go in.</p>

  <div class="top-row">
${top.join("\n")}
  </div>
  <p id="player-badge" role="status">Playing as: your player</p>

  <h2>Play any game</h2>
  <p class="lead">Pick a level, press Play. At the end, All games comes back here.</p>
${play.join("\n\n")}

  <details class="behind" id="behind">
    <summary>Behind the scenes</summary>
    <p class="lead">Retired, old, parked, test and demo pages, each once. Nothing is deleted.</p>
${hidden.map(sub).join("\n\n")}
  </details>

  <p class="note">Speaking moments ask for the microphone; if you say no, word pills appear instead. Nothing you say leaves the device.</p>
</main>
<script src="js/version.js?v=${V}"></script>
<script src="js/shared/save.js?v=${V}"></script>
<script>
  // Play: the level (or weather, or day) picked goes into the link
  document.querySelectorAll(".game").forEach(function (g) {
    var sel = g.querySelector("select"), a = g.querySelector("a.play"), tpl = g.getAttribute("data-tpl");
    if (!sel) return;
    sel.addEventListener("change", function () { a.setAttribute("href", tpl.replace("{v}", encodeURIComponent(sel.value))); });
  });
  // New player (Sprint 11, Zafar 22 Oct): a toggle. On, every launch plays the reset "New player" profile; off, the grown-up's own player
  var LabsPlayer = (${labsPlayer.toString()})(Save, (function () { try { return window.localStorage; } catch (e) { return { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} }; } })());
  var tog = document.getElementById("new-player-toggle"), badge = document.getElementById("player-badge"), box = document.getElementById("new-player");
  function show() {
    var on = LabsPlayer.on();
    tog.checked = on;
    box.classList.toggle("on", on);
    badge.classList.toggle("on", on);
    badge.textContent = "Playing as: " + LabsPlayer.label();
  }
  tog.addEventListener("change", function () {
    LabsPlayer.setOn(tog.checked);
    // on: every picker back at its first option (level 1), every Play link with it
    if (tog.checked) document.querySelectorAll(".game select").forEach(function (sel) { sel.selectedIndex = 0; sel.dispatchEvent(new Event("change")); });
    show();
  });
  // every launch (Play, the Walkthrough, the house, the day builder) plays as the player the toggle says, fresh when on
  document.querySelectorAll("a.play, a.top").forEach(function (a) {
    a.addEventListener("click", function () {
      try { LabsPlayer.launch(); } catch (e) { /* the save is unreachable: the page plays as it can */ }
    });
  });
  try { show(); } catch (e) { badge.textContent = "Could not reach the save on this device."; }
</script>
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
    console.log(`gen_labs: wrote labs.html (${(html.match(/class="card"/g) || []).length} page links, ${(html.match(/class="game"/g) || []).length} games)`);
  }
}
