// The sprint check's logic (build/tools/review/sprintcheck.mjs, decision 78), no git, no browser, so it is unit tested:
//   sprintRows(old, new)      the rows a sprint touched: added, or their status or issue text changed (and rows that went away)
//   checkWords(text, ids)     what a row's Check (or issue) names: flows, levels, paths, sizes, "every game"
//   planRows(rows, ctx)       each row -> the sandbox flow ids (and sizes) that show its state, or UNMAPPED
//   groupJobs(plan, ...)      the plan -> run.mjs invocations (one per size set)
//   pickShots(row, results, breaks)  the shots for a row's evidence sheet
import { parseRegressions, plain, statusKind, flowsForRows, contractChecksOf } from "./regressions.mjs";

// ---------- 1. the rows a sprint touched ----------
export function sprintRows(oldText, newText) {
  const before = new Map(parseRegressions(oldText || "").map((r) => [r.id, r]));
  const now = parseRegressions(newText);
  const out = [];
  for (const r of now) {
    const o = before.get(r.id), why = [];
    if (!o) why.push("added");
    else {
      if (plain(o.status) !== plain(r.status)) why.push(statusKind(o.status) === statusKind(r.status) ? "status note" : `status ${statusKind(o.status)} -> ${statusKind(r.status)}`);
      if (plain(o.issue) !== plain(r.issue)) why.push("issue");
    }
    if (why.length) out.push({ ...r, change: why.join(", ") });
  }
  const ids = new Set(now.map((r) => r.id));
  const removed = [...before.values()].filter((r) => !ids.has(r.id)).map((r) => ({ ...r, change: "removed" }));
  return { rows: out, removed };
}

// ---------- 2. what a Check names ----------
// words -> base flow ids. Only ids that exist in the live flow list are kept. A Check starts with how it is checked ("eye:", "ear:",
// "auto:"); those words are dropped first so "ear: tap through ..." does not name the ear game ("eye: ear" still does)
const W = (re, ...ids) => ({ re, ids });
export const FLOW_WORDS = [
  W(/\bscrapes?\b|\bplasters?\b|\bgraze\b|\bcut (?:game|card)\b|\bheal[- ]cut\b/i, "clinic:heal-cut"),
  W(/\bknees?\b|\bbandages?\b/i, "clinic:heal-knee"),
  W(/\bears?\b(?! drops)|\bear ?wax\b|\bcotton bud/i, "clinic:heal-ear"),
  W(/\btooth\b|\bteeth\b|\btoothbrush/i, "clinic:heal-tooth"),
  W(/\btaste\b|\bthundo\b|\bsoothing drink/i, "clinic:heal-taste"),
  W(/\bfever\b|\bthermometer\b/i, "clinic:heal-fever"),
  W(/\bboing\b|\blolli\b/i, "clinic:heal-boing"),
  W(/\beye\b(?!\s*(?:\/|contact|line|level|catch))/i, "clinic:heal-eye"),
  W(/\bfoot\b|\btoes\b|\bsplinter\b|\btweezers?\b/i, "clinic:heal-foot"),
  W(/\btummy\b/i, "clinic:heal-extra-tummy"),
  W(/\bhic(?:cups?)?\b/i, "clinic:heal-extra-hic"),
  W(/\bhair\b/i, "clinic:heal-extra-hair"),
  W(/\bwaiting[- ]room\b|\bseats?\b/i, "clinic:waiting"),
  W(/\bdiagnos/i, "clinic:diagnosis"),
  W(/\bpharmacy\b/i, "clinic:pharmacy"),
  W(/\bsend[- ]?off\b/i, "clinic:sendoff"),
  W(/\bclinic morning\b|\bmorning\b/i, "clinic:morning"),
  W(/\bone patient\b/i, "clinic:patient"),
  W(/\bpantry\b|\bfetch\b|\berrand\b/i, "cook:fetch"),
  W(/\bchai[- ]tray\b|\btray\b/i, "cook:chai-tray"),
  W(/\bchai\b(?![- ]tray)/i, "cook:chai"),
  W(/\bmaani\b/i, "cook:maani-line"),
  W(/\bdaa?[rl]\b/i, "cook:daar"),
  W(/\bchaat\b/i, "cook:chaat"),
  W(/\bchop\b|\bknife\b|\bslic(?:e|ing)\b/i, "cook:chop"),
  W(/\btadka\b/i, "cook:tadka"),
  W(/\bstir\b/i, "cook:stir"),
  W(/\bassemble\b/i, "cook:assemble"),
  W(/\bsamosa\b/i, "cook:samosa"),
  W(/\bsekelo\b|\bmishkaki\b|\bgrill\b/i, "cook:mishkaki-grill"),
  W(/\bshop\b/i, "cook:shop"),
  W(/(?<!open )\bkitchen\b/i, "cook:day1"), // the story day opens in the kitchen (Nani at the counter)
  W(/\bopen kitchen\b|\bfree play\b/i, "cook:open-kitchen"),
  W(/\bstory round\b|\bthe round\b/i, "lab:cook/round"),
  W(/\bbirthday\b/i, "lab:cook/story-birthday"),
  W(/\bcook(?:'s)? title\b|\btitle screen\b/i, "cook:title"),
  W(/\bfirst launch\b|\bfirst run\b|\bfresh profile\b|\bonboarding\b/i, "first"),
  W(/\bthe house\b|\bhome screen\b|\bhouse\b/i, "house"),
  W(/\btidy\b/i, "mode:tidy"), W(/\bwho did\b/i, "mode:who"), W(/\bdress[- ]up\b/i, "mode:dress"), W(/\bmonsoon\b/i, "mode:monsoon"),
  W(/\bsnap\b/i, "mode:snap"), W(/\bfind it\b/i, "mode:find"),
];
const GENERIC = [[/\bcook\b/i, "lab:cook/round"], [/\bclinic\b/i, "clinic:patient"]];
const EVERY = /\bevery (?:game|station|stage|screen|end screen|mode|heal game)\b|\beach (?:game|station)\b|\ball (?:games|stations)\b|\beverywhere\b/i;
const METHOD = /(^|[\s;,(·])(?:eye\/ear|ear\/eye|eye|ear|auto|play|listen|code)\s*:/gi;
// "eye: knee L1–L3 after every turn (`shoot_knee_wrap.mjs`) · CMP-13" -> the words that say where to look
export function cleanCheck(text) {
  return plain(String(text || ""))
    .replace(METHOD, "$1 ")
    .replace(/\b[A-Z]{2,5}-\d+\b/g, " ") // rule ids
    .replace(/\bbuild\/\S+|\S+\.(?:mjs|js|py|json|md)\b/g, " ") // tool paths
    .replace(/contract check \(decision \d+\)/gi, "contract check")
    .replace(/\s+/g, " ").trim();
}
export function checkWords(text, baseIds, { raw = false } = {}) {
  const t = raw ? plain(String(text || "")) : cleanCheck(text);
  const known = new Set(baseIds);
  const flows = new Set();
  // explicit flow ids (`clinic:heal-knee@L2`, `lab:cook/chop`)
  const exact = [];
  for (const m of t.matchAll(/\b((?:cook|clinic|lab|mode):[\w/-]+(?:@L\d)?(?:#\w+)?)/g)) { const b = m[1].replace(/[@#].*$/, ""); if (known.has(b)) { flows.add(b); if (m[1] !== b) exact.push(m[1]); } }
  for (const { re, ids } of FLOW_WORDS) if (re.test(t)) for (const id of ids) if (known.has(id)) flows.add(id);
  // story days
  for (const m of t.matchAll(/\b(?:story )?day ?(\d)\b/gi)) if (known.has(`cook:day${m[1]}`)) flows.add(`cook:day${m[1]}`);
  if (/\bstory day\b|\bday summary\b/i.test(t) && ![...flows].some((f) => /^cook:day\d/.test(f))) flows.add("cook:day1");
  // Labs tiles: the station's tile on the game host too
  if (/\blabs?\b|\btiles?\b/i.test(t)) for (const f of [...flows]) { const g = f.replace(/^cook:/, ""); for (const c of [`lab:cook/${g}`, `lab:cook/recipe-${g}`]) if (f.startsWith("cook:") && known.has(c)) flows.add(c); }
  // levels: L2, L1–L3, levels 1-3
  const levels = new Set();
  for (const m of t.matchAll(/\bL(\d)(?:\s*(?:[–-]|to)\s*L?(\d))?\b/g)) { const a = +m[1], b = m[2] ? +m[2] : a; for (let i = Math.min(a, b); i <= Math.max(a, b); i++) levels.add(i); }
  for (const m of t.matchAll(/\blevels? (\d)(?:\s*(?:[–-]|to|and)\s*(\d))?/gi)) { const a = +m[1], b = m[2] ? +m[2] : a; for (let i = Math.min(a, b); i <= Math.max(a, b); i++) levels.add(i); }
  // paths
  const paths = new Set();
  if (/#mistake|\bmistakes?\b|\bwrong (?:pick|answer|item|tap)\b/i.test(t)) paths.add("mistake");
  if (/#hint|\bhints?\b|\bbulb\b|\bhesitat/i.test(t)) paths.add("hint");
  if (/#takeback|\btake(?:s)?[- ]?back\b|\bundo\b/i.test(t)) paths.add("takeback");
  if (/#speed1|\bchild's pace\b|\bspeed 1\b|\breal time\b/i.test(t)) paths.add("speed1");
  // sizes (390x844 is the upright phone: the rotate card)
  const sizes = new Set();
  for (const m of t.matchAll(/\b(\d{3,4})\s*[x×]\s*(\d{3,4})\b/g)) sizes.add(`${m[1]}x${m[2]}`);
  return { flows: [...flows], exact, levels: [...levels].sort(), paths: [...paths], sizes: [...sizes], every: EVERY.test(t), text: t };
}

// ---------- 3. rows -> flows ----------
const baseOf = (id) => id.replace(/[@#].*$/, "");
export const levelOf = (id) => { const m = /@L(\d)/.exec(id); return m ? +m[1] : 1; };
export const pathOf = (id) => { const m = /#(\w+)/.exec(id); return m ? m[1] : "fair"; };
// a base id's variants, narrowed by the levels and paths a Check names (none named: every level and path, like --touched)
export function narrow(base, allIds, levels, paths) {
  const vs = allIds.filter((f) => f === base || f.startsWith(base + "@") || f.startsWith(base + "#"));
  if (!levels.length && !paths.length) return { ids: vs };
  let out = vs.filter((f) => (!levels.length || levels.includes(levelOf(f))) && (paths.length ? paths.includes(pathOf(f)) : pathOf(f) === "fair"));
  // what the flow has of it: the levels on the fair path, else the paths at any level, else the levels on any path
  if (!out.length && levels.length && paths.length) out = vs.filter((f) => levels.includes(levelOf(f)) && pathOf(f) === "fair");
  if (!out.length && paths.length) out = vs.filter((f) => paths.includes(pathOf(f)));
  if (!out.length && levels.length) out = vs.filter((f) => levels.includes(levelOf(f)));
  if (!out.length) return { ids: vs.filter((f) => f === base).length ? [base] : vs.slice(0, 1), note: `${base} has no ${[levels.length ? "L" + levels.join("/") : "", paths.map((p) => "#" + p).join("/")].filter(Boolean).join(" ")}: its first level instead` };
  return { ids: out };
}

// ctx: {allIds (every live flow id), sizes (SIZES of env.mjs), route (CONTRACT_ROUTE)}
export function planRows(rows, allRows, { allIds, sizes: SIZES = {}, route = [] }) {
  const baseIds = [...new Set(allIds.map(baseOf))];
  const inverse = flowsForRows(allRows, baseIds); // the regress.mjs lookup, inverted
  const plan = [];
  for (const r of rows) {
    const p = { id: r.id, status: plain(r.status), kind: statusKind(r.status), issue: plain(r.issue), check: plain(r.check), source: plain(r.source), section: [r.h2, r.h3].filter(Boolean).join(" > "), change: r.change || "", contract: contractChecksOf(r.id), flows: [], sizes: [], via: "", notes: [] };
    plan.push(p);
    if (p.kind === "retired") { p.via = "retired"; continue; }
    const cw = checkWords(r.check, baseIds);
    let bases = [], via = "";
    if (cw.flows.length) { bases = cw.flows; via = "check"; }
    else if ((inverse.get(r.id) || []).length) { bases = inverse.get(r.id); via = "section"; }
    else {
      const iw = checkWords(r.issue, baseIds, { raw: true });
      if (iw.flows.length) { bases = iw.flows; via = "issue"; }
    }
    let ids = [];
    for (const b of bases) { const n = narrow(b, allIds, cw.levels, cw.paths); ids.push(...n.ids); if (n.note) p.notes.push(n.note); }
    for (const e of cw.exact) if (allIds.includes(e) && !ids.includes(e)) ids.push(e);
    if (!ids.length && (cw.every || p.contract.length || EVERY.test(plain(r.issue)))) { ids = route.filter((f) => allIds.includes(f)); via = "route (the 8 Oct contract route: a sample of every game)"; }
    // last: a row that only says "Cook" or "the clinic": the story round on the game host (what Zafar plays) and one patient
    if (!ids.length) {
      for (const [re, b] of GENERIC) if (re.test(cw.text) && baseIds.includes(b)) ids.push(...narrow(b, allIds, cw.levels, cw.paths).ids);
      if (ids.length) via = "generic (only 'Cook' or 'the clinic' named: a sample)";
    }
    // sizes: the upright phone is the rotate card's own; other named sizes narrow where the row's flows run
    const named = cw.sizes.filter((s) => SIZES[s]);
    if (named.some((s) => SIZES[s].upright) && allIds.includes("rotate-card")) { if (!ids.includes("rotate-card")) ids.push("rotate-card"); p.notes.push("390x844 named: the rotate card"); }
    p.sizes = named.filter((s) => !SIZES[s].upright);
    p.flows = [...new Set(ids)];
    p.via = p.flows.length ? via : "";
    if (cw.levels.length || cw.paths.length) p.notes.push(`narrowed to ${[cw.levels.length ? "L" + cw.levels.join(",") : "", ...cw.paths.map((x) => "#" + x)].filter(Boolean).join(" ")}`);
    p.words = shotWords(cw.text, p.flows);
  }
  return plan;
}

// ---------- 4. the run: one run.mjs invocation per size set ----------
// flowInfo(id) -> {sizes: [...default sizes], upright: bool}. quick/sizes override the rows' own sizes (upright flows keep theirs)
export function groupJobs(plan, flowInfo, { quick = false, sizes = null, quickSize = "1366x768" } = {}) {
  const want = new Map(); // flow id -> Set of size keys ("" = the flow's own sizes)
  const add = (f, key) => { if (!want.has(f)) want.set(f, new Set()); want.get(f).add(key); };
  for (const p of plan) for (const f of p.flows) {
    const info = flowInfo(f) || {};
    if (info.upright || info.static) add(f, "");
    else if (quick) add(f, quickSize);
    else if (sizes) add(f, sizes.join(","));
    else add(f, p.sizes.length ? p.sizes.join(",") : "");
  }
  const groups = new Map();
  for (const [f, keys] of want) {
    // a flow wanted at its own sizes and at named ones: its own sizes, plus the named sizes it lacks
    const own = keys.has("") ? (flowInfo(f) || {}).sizes || [] : null;
    for (const k of keys) {
      if (k === "") { if (!groups.has("")) groups.set("", []); groups.get("").push(f); continue; }
      const extra = own ? k.split(",").filter((s) => !own.includes(s)) : k.split(",");
      if (!extra.length) continue;
      const kk = extra.join(",");
      if (!groups.has(kk)) groups.set(kk, []);
      groups.get(kk).push(f);
    }
  }
  return [...groups.entries()].map(([sizes, flows]) => ({ sizes: sizes ? sizes.split(",") : null, flows: [...new Set(flows)] }));
}
export function pagesOf(group, flowInfo) {
  return group.flows.reduce((n, f) => { const i = flowInfo(f) || {}; return n + (i.static ? 1 : group.sizes ? group.sizes.length : (i.sizes || []).length); }, 0);
}

// ---------- 5. the shots for a row's sheet ----------
const STOP = new Set("the and a an of in on at to for with after before every each all any its it is be as by from or not no one two three then when while what that this into over out up down only also more most less than like his her their our your yes cook clinic game games station stations screen screens level levels both same new old check checks contract decision zoom shot shots".split(" "));
const SYN = { bandage: ["wrap", "turn"], wrap: ["bandage", "turn"], popup: ["pop", "request", "intro"], "pop-up": ["popup", "request", "intro"], badge: ["badges", "results"], badges: ["results"], end: ["results", "end"], bulb: ["hint", "bulb"], hint: ["hint", "bulb"], mistake: ["mistake", "wrong"], bubble: ["bubble", "speech", "say"], button: ["done", "next", "buttons"], card: ["card", "order"], words: ["words", "review"], summary: ["summary", "end"] };
export function shotWords(text, flows = []) {
  const inIds = new Set(flows.flatMap((f) => f.toLowerCase().split(/[^a-z0-9]+/)));
  const ws = new Set();
  for (const w of String(text || "").toLowerCase().replace(/pop-up/g, "popup").split(/[^a-z0-9-]+/)) {
    if (w.length < 3 || STOP.has(w) || /^\d/.test(w) || /^l\d$/.test(w) || inIds.has(w)) continue;
    ws.add(w); for (const s of SYN[w] || []) ws.add(s);
  }
  return [...ws];
}
// result: one run.mjs data file ({flow, size, states:[{name, shot}], cshots}); breaks: this flow-size's contract breaks for the row's checks
// -> [{shot, label, why}] at most `max`
export function pickShots(p, result, breaks = [], { max = 4 } = {}) {
  const out = [], seen = new Set();
  const take = (shot, label, why) => { if (shot && !seen.has(shot) && out.length < max) { seen.add(shot); out.push({ shot, label, why }); } };
  for (const b of breaks) take(b.shot, `${b.check} BREAK: ${b.state}`, "break");
  const states = (result.states || []).filter((s) => s.shot);
  const words = p.words || [];
  const tokens = (s) => s.name.toLowerCase().split(/[^a-z0-9]+/);
  const hits = states.filter((s) => tokens(s).some((t) => words.some((w) => t === w || (w.length > 3 && t.startsWith(w)))));
  for (const s of hits) take(s.shot, s.name, "words");
  if (!hits.length) {
    const find = (re) => states.find((s) => re.test(s.name));
    const n = states.length;
    for (const s of [find(/start/) || states[0], find(/mid/) || states[Math.floor(n / 2)], find(/^end$|results-badges/) || states[n - 1]]) if (s) take(s.shot, s.name, "start/mid/end");
  }
  return out;
}
