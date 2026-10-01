/*
 * Modes as plug-ins (target-model § 6.1; rules H1, H7, H56, H57, decision 22) and the shell side of starting one.
 *
 * THE MODE INTERFACE. Every mode is one folder, js/<mode>/, whose main.js default-exports one object:
 *   {
 *     id: "clinic",
 *     data: ["data/clinic/levels.json"],          // loaded before the first round (mode.loaded[path])
 *     games: { waiting, pharmacy, heal },          // its mini-games (js/shared/host.js has their interface)
 *     plan(entry, ctx) -> [{game, level?, params?} | {pause: name}, ...]   or {game: "<round name>", stages: [...]}
 *     lab() -> [{game, label, levels?, note?}]     // what labs.html lists: lab.html?mode=<id>&game=<game>&level=<n>
 *     free: { endless: true } | false,             // free play: rounds keep coming until the child stops (H50)
 *     actions: ["again", "next", "list", "home"],  // the end screen's buttons it offers (H34), in the one order
 *     states?() -> [...],  dev?: true              // dev: a test-site mode, never on the child's map
 *   }
 * A mode never draws its own end screen, badges, bulb or buttons; never opens another mode; never touches the save
 * (target-model § 6.3). The host runs its stages; the shell (this file) decides what runs.
 *
 * THE ENTRY: how a round was asked for. The core's play context (js/core/context.js: story | free) plus the lab:
 *   { play: "story" | "free" | "lab", arc, chapter, errand, level, game, place, seed }
 *   story  an errand in an arc chapter (data/arcs/<arc>.json): the arc must be open, the chapter reached, the
 *          errand this mode's; the errand's settings fill the entry (its level, its params)
 *   free   from the map (data/map.json): the place must be open; a mode that is on no place is opened by the
 *          story that names it in a chapter's "opens" (Unlocks.why says which story: "locked until …")
 *   lab    lab.html: one stage alone, or the whole plan, on the test site; never locked
 * resolveEntry() answers { ok, entry, errand?, place?, why? }; why is Unlocks.why()'s answer, so a locked place
 * says which story opens it.
 *
 * ARCS FEED UNLOCKS: arcRules(arcs) turns each chapter's "opens": [ids] into rules
 * ({after: {arc, chapter}}) and each arc's "open" rule into "arc:<id>"; withArcRules(base, arcs) adds them to
 * data/unlocks.json's rules (the file wins where both say something; build/host/check_arcs.mjs reports it).
 *
 * THE SHELL LOOP: playMode({mode, entry, host, core, arcs, map, nav}) resolves the entry, plans, runs the host,
 * records story progress (the errand done; the chapter when its last errand is done, which opens what it opens;
 * the arc after its last chapter) and follows the end screen's answer: again (the same entry), next (free: a new
 * round; story: the next errand), list (the lab list), home.
 *
 * ES module; no globals. Browser-only helpers (loadMode, loadNeeds) take their loaders as arguments in tests.
 */
import { validateGame } from "./host.js";

export { createHost, validateGame, seeded, HostLeft } from "./host.js";

export const PLAYS = ["story", "free", "lab"];
export const ACTIONS = ["again", "next", "list", "home"];
const ID = /^[a-z0-9][a-z0-9_-]{0,47}$/;
const id = (v) => (typeof v === "string" && ID.test(v) ? v : null);
const int = (v, lo, hi) => {
  const n = typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : NaN;
  return Number.isInteger(n) && n >= lo && n <= hi ? n : null;
};

/* ---------------- the mode interface ---------------- */

export function validateMode(m) {
  const out = [];
  if (!m || typeof m !== "object") return ["not an object"];
  if (!id(m.id)) out.push("id: a kebab-case id");
  if (!m.games || typeof m.games !== "object" || !Object.keys(m.games).length) out.push("games: at least one mini-game");
  else
    Object.entries(m.games).forEach(([k, g]) => {
      validateGame(g).forEach((p) => out.push(`games.${k}: ${p}`));
      if (g && g.id && g.id !== k) out.push(`games.${k}: its id is "${g.id}" (the key and the id must match: "<mode>/<game>" is its address)`);
    });
  if (typeof m.plan !== "function") out.push("plan(entry, ctx): not a function");
  if (typeof m.lab !== "function") out.push("lab(): not a function (labs.html is made from it)");
  if (m.data != null && !Array.isArray(m.data)) out.push("data: a list of data files");
  if (m.actions != null && (!Array.isArray(m.actions) || m.actions.some((a) => !ACTIONS.includes(a)))) out.push(`actions: some of ${ACTIONS.join(", ")}`);
  if (m.free != null && m.free !== false && typeof m.free !== "object") out.push("free: {endless} or false");
  return out;
}

/** A mode, checked. Throws on a mode the host can't run. */
export function defineMode(m) {
  const p = validateMode(m);
  if (p.length) throw new Error(`mode ${m && m.id}: ${p.join("; ")}`);
  return m;
}

/* ---------------- the entry ---------------- */

export function makeEntry(o = {}) {
  const play = PLAYS.includes(o.play) ? o.play : o.arc ? "story" : o.game ? "lab" : "free";
  const e = { play, arc: null, chapter: null, errand: null, level: int(o.level, 1, 9), game: id(o.game), place: id(o.place), seed: int(o.seed, 0, 2147483647) };
  if (play === "story") {
    e.arc = id(o.arc);
    e.chapter = int(o.chapter, 1, 99);
    e.errand = id(o.errand);
  }
  if (o.mode) e.mode = id(o.mode);
  if (o.params && typeof o.params === "object") e.params = Object.assign({}, o.params);
  return e;
}

export function entryFromQuery(search) {
  const q = search instanceof URLSearchParams ? search : new URLSearchParams(search || "");
  const o = {};
  ["mode", "play", "arc", "chapter", "errand", "level", "game", "place", "seed"].forEach((k) => q.has(k) && (o[k] = q.get(k)));
  return makeEntry(o);
}

export function entryToQuery(e) {
  const keys = ["mode", "play", "arc", "chapter", "errand", "level", "game", "place", "seed"];
  return keys
    .filter((k) => e[k] != null && e[k] !== "")
    .map((k) => `${k}=${encodeURIComponent(e[k])}`)
    .join("&");
}

/** The play context the core knows (story | free); a lab is neither. */
export const playContext = (e) => ({ play: e.play, arc: e.arc, chapter: e.chapter, errand: e.errand, level: e.level, place: e.place });

/* ---------------- arcs (data/arcs/<arc>.json) ---------------- */

/** Every errand of an arc, in story order: [{chapter: n, errand, at}]. */
export function errandsOf(arc) {
  const out = [];
  (arc.chapters || []).forEach((c, ci) =>
    (c.flow || []).forEach((step, at) => {
      if (step.errand) out.push({ chapter: ci + 1, chapterId: c.id, errand: step.errand, at });
    })
  );
  return out;
}

export function findErrand(arc, errandId, chapter = null) {
  return errandsOf(arc).find((x) => x.errand.id === errandId && (chapter == null || x.chapter === chapter)) || null;
}

/** Unlock rules the arcs imply: a chapter's "opens" ids open after that chapter; an arc's own "open" rule is "arc:<id>". */
export function arcRules(arcs) {
  const rules = {};
  const notes = [];
  Object.values(arcs || {}).forEach((a) => {
    if (!a || !a.id) return;
    rules[`arc:${a.id}`] = a.open || { open: "always" };
    (a.chapters || []).forEach((c, ci) =>
      (c.opens || []).forEach((oid) => {
        const rule = { after: { arc: a.id, chapter: ci + 1 } };
        if (rules[oid]) notes.push(`${oid}: opened by more than one chapter (${JSON.stringify(rules[oid])} and ${JSON.stringify(rule)}); the first wins`);
        else rules[oid] = rule;
      })
    );
  });
  return { rules, notes };
}

/** data/unlocks.json's rules plus the arcs' (the file wins where both say something). */
export function withArcRules(base, arcs) {
  const { rules } = arcRules(arcs);
  const own = (base && base.rules) || {};
  return Object.assign({}, base, { rules: Object.assign({}, rules, own) });
}

/** The errands done in an arc, from the save (story.arcs[arc].errands). */
export function errandsDone(save, arcId) {
  const s = save ? save.get("story") : {};
  return Object.assign({}, ((s.arcs || {})[arcId] || {}).errands);
}

/** The next errand to play in an arc (the first not done, in story order), or null when all are done. */
export function nextErrand(arc, save) {
  const done = errandsDone(save, arc.id);
  return errandsOf(arc).find((x) => !done[x.errand.id]) || null;
}

/* ---------------- resolving an entry ---------------- */

/**
 * Can this entry be played, and with what? { ok, entry, errand?, place?, why? }
 * unlocks: an Unlocks (js/core/unlocks.js) made with withArcRules(); arcs: {id: arc}; map: data/map.json.
 */
export function resolveEntry(entry, { mode, unlocks, arcs = {}, map = null, save = null } = {}) {
  const e = makeEntry(entry);
  if (entry && entry.params) e.params = Object.assign({}, entry.params);
  const no = (why) => ({ ok: false, entry: e, why });
  if (!mode) return no({ kind: "no-mode" });
  if (e.game && !mode.games[e.game]) return no({ kind: "no-game", game: e.game });
  if (e.play === "lab") return { ok: true, entry: e };

  if (e.play === "story") {
    const arc = arcs[e.arc];
    if (!arc) return no({ kind: "no-arc", arc: e.arc });
    const arcWhy = unlocks ? unlocks.why(`arc:${arc.id}`) : null;
    if (arcWhy) return no(Object.assign({ kind: "locked" }, arcWhy));
    const found = e.errand ? findErrand(arc, e.errand, e.chapter) : nextErrand(arc, save);
    if (!found) return no({ kind: "no-errand", arc: arc.id, errand: e.errand });
    if (found.errand.mode !== mode.id) return no({ kind: "other-mode", mode: found.errand.mode, errand: found.errand.id });
    // chapters come in order: chapter n once chapter n-1 is finished
    const prog = unlocks ? unlocks.arc(arc.id) : { chapter: 0, done: false };
    if (found.chapter > 1 && !prog.done && prog.chapter < found.chapter - 1) return no({ kind: "locked", id: `${arc.id}/${found.chapter}`, arc: arc.id, chapter: found.chapter - 1 });
    const set = found.errand.settings || {};
    e.chapter = found.chapter;
    e.errand = found.errand.id;
    if (e.level == null && set.level != null) e.level = set.level;
    const fromErrand = found.errand.entry || {};
    if (!e.game && fromErrand.game) e.game = fromErrand.game;
    e.params = Object.assign({}, fromErrand.params, set.params, e.params);
    return { ok: true, entry: e, errand: found.errand, arc };
  }

  // free play: from the map, or opened by a story
  if (!mode.free) return no({ kind: "no-free", mode: mode.id });
  const places = (map && map.places) || [];
  const place = (e.place && places.find((p) => p.id === e.place)) || places.find((p) => (p.modes || []).some((m) => m.mode === mode.id));
  if (place) {
    if (!(place.modes || []).some((m) => m.mode === mode.id)) return no({ kind: "not-here", place: place.id, mode: mode.id });
    const why = unlocks ? unlocks.why(place.unlock || place.id) : null;
    if (why) return no(Object.assign({ kind: "locked", place: place.id }, why));
    e.place = place.id;
    return { ok: true, entry: e, place };
  }
  const why = unlocks ? unlocks.why(mode.id) : null;
  if (why) return no(Object.assign({ kind: "locked" }, why));
  return { ok: true, entry: e };
}

/** Plain words for grown-ups (the lab and the "?" pop-up) about why something is locked. Never shown to the child. */
export function whyText(why) {
  if (!why) return "";
  if (why.kind === "locked" && why.arc) return `Locked until the ${why.arc} story${why.chapter ? ` (chapter ${why.chapter})` : ""}.`;
  if (why.kind === "locked" && why.unknown) return `Locked: nothing opens "${why.id}" yet.`;
  if (why.kind === "no-arc") return `There is no arc "${why.arc}".`;
  if (why.kind === "no-errand") return `There is no errand "${why.errand}" in ${why.arc} (or every errand is done).`;
  if (why.kind === "other-mode") return `That errand belongs to ${why.mode}.`;
  if (why.kind === "no-free") return "This mode has no free play.";
  if (why.kind === "no-game") return `There is no game "${why.game}".`;
  return JSON.stringify(why);
}

/* ---------------- story progress ---------------- */

/**
 * An errand was played to the end: record it, and finish its chapter when that was the chapter's last errand
 * (which opens what the chapter opens), and the arc after its last chapter. Returns {chapterDone, arcDone}.
 */
export function finishErrand({ save, unlocks, arc, chapter, errand }) {
  if (!save || !arc) return { chapterDone: false, arcDone: false };
  save.update("story", (s) => {
    s.arcs = Object.assign({}, s.arcs);
    const a = (s.arcs[arc.id] = Object.assign({ chapter: 0, done: false }, s.arcs[arc.id]));
    a.errands = Object.assign({}, a.errands, { [errand]: new Date().toISOString() });
    return s;
  });
  const done = errandsDone(save, arc.id);
  const inChapter = errandsOf(arc).filter((x) => x.chapter === chapter);
  const chapterDone = inChapter.length > 0 && inChapter.every((x) => done[x.errand.id]);
  if (chapterDone && unlocks) unlocks.finishChapter(arc.id, chapter);
  const arcDone = chapterDone && errandsOf(arc).every((x) => done[x.errand.id]);
  if (arcDone && unlocks) unlocks.finishArc(arc.id);
  return { chapterDone, arcDone };
}

/* ---------------- labs ---------------- */

export const labUrl = (modeId, game, level, extra = "") => `lab.html?mode=${encodeURIComponent(modeId)}${game ? `&game=${encodeURIComponent(game)}` : ""}${level ? `&level=${level}` : ""}${extra}`;

/** Every lab entry of the given modes: [{mode, game, label, levels, note, url}]. */
export function labList(modes) {
  const out = [];
  for (const m of modes) {
    for (const l of m.lab() || []) {
      const levels = l.levels || (m.games[l.game] && m.games[l.game].levels) || [1];
      out.push({ mode: m.id, game: l.game || null, label: l.label || l.game || m.id, levels, note: l.note || "", url: labUrl(m.id, l.game, levels[0]) });
    }
  }
  return out;
}

/* ---------------- the end screen's buttons ---------------- */

const LABEL = { again: "Again", next: "Next", list: "All games", home: "Home" };
const ICON = { again: "again", next: "next", list: "grid", home: "home" };

/** The end screen's action ids for this play: a lab offers the list (never home or next); story and free play don't. */
export function actionIds(mode, play) {
  let ids = (mode.actions || ["again", "home"]).filter((a) => ACTIONS.includes(a));
  if (play === "lab") ids = ids.filter((a) => a !== "home" && a !== "next").concat(["list"]);
  else ids = ids.filter((a) => a !== "list");
  if (play === "free" && !(mode.free && mode.free.endless)) ids = ids.filter((a) => a !== "next");
  return ACTIONS.filter((a) => ids.includes(a));
}

/**
 * Results.show's actions, in the one order, the last primary. endActions: the shared button kit's
 * (NjgButtons.endActions: its labels and icons, the one place they're chosen); without it, plain ones.
 */
export function actionsFor(mode, play, endActions = null) {
  const ids = actionIds(mode, play);
  if (endActions) return endActions(Object.fromEntries(ids.map((a) => [a, true])));
  return ids.map((a, i) => ({ id: a, label: LABEL[a], icon: ICON[a], elId: `njg-end-${a}`, primary: i === ids.length - 1 }));
}

/* ---------------- the shell loop ---------------- */

/**
 * Play a mode from an entry until the child leaves it. nav: {home(), list(), go(entry), locked(why, resolved)}.
 * Returns the last result. Every round goes through the one host.
 */
export async function playMode({ mode, entry, host, core = {}, unlocks = null, arcs = {}, map = null, nav = {}, maxRounds = Infinity, onRound, prepare, endActions = null } = {}) {
  let e = makeEntry(entry);
  if (entry && entry.params) e.params = Object.assign({}, entry.params);
  let last = null;
  for (let n = 0; n < maxRounds; n++) {
    const r = resolveEntry(e, { mode, unlocks, arcs, map, save: core.save });
    if (!r.ok) {
      if (nav.locked) await nav.locked(r.why, r);
      return Object.assign({ locked: true }, r);
    }
    const ent = r.entry;
    const plan = mode.plan(ent, { level: ent.level, params: ent.params || {} });
    if (prepare) await prepare(plan, ent);
    const res = await host.run({ mode, plan, play: ent.play === "lab" ? { play: "lab", level: ent.level } : playContext(ent), level: ent.level, seed: ent.seed, actions: actionsFor(mode, ent.play, endActions), params: ent.params || null });
    last = Object.assign({ entry: ent }, res);
    if (res.left) return last;
    if (ent.play === "story") last.story = finishErrand({ save: core.save, unlocks, arc: r.arc, chapter: ent.chapter, errand: ent.errand });
    if (onRound) onRound(last);
    const action = (res.out && res.out.action) || "done";
    if (action === "again") continue;
    if (action === "next" && ent.play === "free") {
      e = Object.assign({}, ent, { seed: null });
      continue;
    }
    if (action === "next" && ent.play === "story") {
      const nx = nextErrand(r.arc, core.save);
      if (!nx) return (nav.home && nav.home(last), last);
      const ne = makeEntry({ play: "story", arc: r.arc.id, chapter: nx.chapter, errand: nx.errand.id });
      if (nx.errand.mode !== mode.id) return (nav.go && nav.go(Object.assign({ mode: nx.errand.mode }, ne)), last);
      e = ne;
      continue;
    }
    if (action === "list" && nav.list) nav.list(last);
    else if (nav.home) nav.home(last);
    return last;
  }
  return last;
}

/* ---------------- loading (browser) ---------------- */

/** Load a mode's main.js and its data. importer(url) and fetchJSON(path) are injectable (tests). */
export async function loadMode(modeId, { base = "", stamp = (u) => u, importer = (u) => import(u), fetchJSON } = {}) {
  if (!id(modeId)) throw new Error(`no such mode "${modeId}"`);
  const mod = await importer(stamp(`${base}js/${modeId}/main.js`));
  const mode = defineMode(mod.default || mod);
  mode.loaded = {};
  const get = fetchJSON || (async (p) => (await fetch(stamp(base + p))).json());
  await Promise.all((mode.data || []).map(async (p) => (mode.loaded[p] = await get(p).catch(() => null))));
  return mode;
}

/** Classic scripts and stylesheets the planned games need (adapters over today's code), each once, in order. */
export async function loadNeeds(games, { base = "", stamp = (u) => u, doc = typeof document !== "undefined" ? document : null } = {}) {
  if (!doc) return [];
  const loaded = (loadNeeds.done = loadNeeds.done || new Set());
  const list = [];
  for (const g of games) {
    const n = (g && g.needs) || {};
    for (const href of n.styles || []) {
      if (loaded.has(href)) continue;
      loaded.add(href);
      const l = doc.createElement("link");
      l.rel = "stylesheet";
      l.href = stamp(base + href);
      doc.head.appendChild(l);
      list.push(href);
    }
    for (const src of n.scripts || []) {
      if (loaded.has(src)) continue;
      loaded.add(src);
      await new Promise((res) => {
        const s = doc.createElement("script");
        s.src = stamp(base + src);
        s.onload = () => res(true);
        s.onerror = () => res(false);
        doc.body.appendChild(s);
      });
      list.push(src);
    }
  }
  return list;
}

/** The games a plan uses (to load their needs first). */
export function gamesOf(mode, plan) {
  const steps = Array.isArray(plan) ? plan : (plan && plan.stages) || [];
  return [...new Set(steps.filter((s) => s.game).map((s) => s.game))].map((g) => mode.games[g]).filter(Boolean);
}
