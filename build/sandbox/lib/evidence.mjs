// The evidence loop's spec (decision 82, docs/architecture/evidence-loop.md): build/sandbox/data/evidence.json, keyed by row id.
// An entry is 1-3 probes, or {human: "..."} (only Zafar's ear or feel), or {needsDecision: "...", probes} (to docs/status.md, never a
// sheet). The words a probe may use are the file's own header lists (_capture, _expect, _at, _moments, _drivers). Pure (no browser,
// no git), so it is unit tested:
//   parseCapture(s) / parseExpect(s)    one capture or expect string -> {kind, ...} (or {error})
//   normalizeSpec(spec, ctx)            the whole file -> {rows, human, decision, rowErrors, errors, warnings}: an unknown flow, path,
//                                       level, size, capture or profile, or an `at` no driver reaches, is an error of that row (its
//                                       probes are not played; the row is a tool failure until the spec or the driver is fixed)
//   planPages(rowIds, rows)             the probes -> page runs: one per (flow id, size, profile, seed, want, webgl, dpr), serving
//                                       every probe on it; flow "repo" probes (a script's output, at "now") need no page
//   momentMatches(want, name)           does a moment name answer `at`/`after`? (lib/moments.mjs: names and aliases)
//   unknownWords(text, lexicon)         the words a child sees that are not Kutchi (the family lexicon): `lexicon`
//   voiceOrder, wordOrder, movesOn, traceStats, silentAfter, gapMs: the expects decided after the page
// The runtime that reaches the moments and captures is lib/evidence-probe.mjs; the CLI is build/tools/review/evidence.mjs.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ALIASES } from "./moments.mjs";

export const SPEC_FILE = (root) => join(root, "build", "sandbox", "data", "evidence.json");
export const DEFAULT_SIZE = "1366x768";
export const PHONE_SIZES = ["844x390", "800x360"];
export const MAX_EVERY = 8;      // an every:<moment> probe captures at most this many times (a probe's "max" changes it)
export const MAX_STRIP = 12;     // frames in one filmstrip
export const PROFILES = ["fresh", "seen", "second-play"];
export const KINDS = ["layout", "detail", "art", "motion", "text", "voice"];

// ---------- selectors ----------
// a CSS selector; canvas:<name> (a Phaser display object whose texture key or name contains it); tool:<id> (a heal game's tool);
// hook:cook.<fn> / hook:heal.<fn> (the boxes a game's own test hook reports: lib/evidence-probe.mjs BOXES)
export const cssOf = (sel) => (/^tool:/.test(sel) ? `.hs-tool[data-tool="${sel.slice(5).replace(/"/g, "")}"]` : sel);

// ---------- capture strings ----------
// shot | crop:<sel> | zoom2:<sel> | strip:<sel>:<n>x<ms> | trace:<sel>:<ms> | voice | dom:<sel> | text[:<sel>] | contract:<n> |
// ref:<path> | cmd:<command>; and <capture>@<moment>: that capture taken at another moment of the same play
export function parseCapture(s) {
  let t = String(s || "").trim();
  let atMoment = null;
  const am = /^(crop|zoom2|dom|text|shot|strip|trace):(.+)@([\w:.#-]+)$/.exec(t);
  if (am && !/^(cmd|ref):/.test(t)) { atMoment = am[3]; t = t.slice(0, t.length - am[3].length - 1); }
  const x = parseOne(t);
  return atMoment && !x.error ? { ...x, atMoment, raw: s } : x;
}
function parseOne(t) {
  if (t === "shot") return { kind: "shot", raw: t };
  if (t === "voice") return { kind: "voice", raw: t };
  if (t === "text") return { kind: "dom", sel: "body", raw: t };
  let m;
  if ((m = /^strip:(.+):(\d+)x(\d+)$/.exec(t))) {
    const n = +m[2], ms = +m[3];
    if (n < 2 || n > MAX_STRIP) return { error: `strip "${t}": 2 to ${MAX_STRIP} frames` };
    if (ms < 20 || ms > 5000) return { error: `strip "${t}": 20 to 5000 ms between frames` };
    return { kind: "strip", sel: m[1].trim(), n, ms, raw: t };
  }
  if (/^strip:/.test(t)) return { error: `strip "${t}": write strip:<selector>:<frames>x<ms>, e.g. strip:.cl-fig:6x120` };
  if ((m = /^trace:(.+):(\d+)$/.exec(t))) {
    const ms = +m[2];
    if (ms < 200 || ms > 30000) return { error: `trace "${t}": 200 to 30000 ms` };
    return { kind: "trace", sel: m[1].trim(), ms, raw: t };
  }
  if (/^trace:/.test(t)) return { error: `trace "${t}": write trace:<selector>:<ms>, e.g. trace:.cl-fig:2000` };
  if ((m = /^contract:(\d+|cover)$/.exec(t))) return { kind: "contract", check: m[1] === "cover" ? "cover" : `contract-${m[1]}`, raw: t };
  if ((m = /^ref:(.+)$/.exec(t))) return { kind: "ref", path: m[1].trim(), raw: t };
  if ((m = /^cmd:(.+)$/.exec(t))) {
    const c = parseCmd(m[1].trim());
    return c.error ? { error: `cmd "${m[1].trim()}": ${c.error}` } : { kind: "cmd", cmd: m[1].trim(), argv: c.argv, raw: t };
  }
  if ((m = /^(crop|zoom2|dom|text):(.+)$/.exec(t))) return m[2].trim() ? { kind: m[1] === "text" ? "dom" : m[1], sel: m[2].trim(), raw: t } : { error: `"${t}": no selector` };
  return { error: `unknown capture "${t}" (shot, crop:, zoom2:, strip:<sel>:<n>x<ms>, trace:<sel>:<ms>, voice, dom:, contract:<n>, ref:, cmd:)` };
}
// a cmd capture: the repo's own read-only scripts, no shell (quotes are honoured; ; | & > < ` $( are refused)
const CMD_OK = new Set(["node", "python3", "grep", "ls"]);
export function parseCmd(s) {
  const argv = [];
  let cur = "", q = null, any = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = null; else if (c === "\\" && q === '"' && i + 1 < s.length && s[i + 1] === '"') cur += s[++i]; else cur += c; continue; }
    if (c === '"' || c === "'") { q = c; any = true; continue; }
    if (/[;&|<>`$]/.test(c)) return { error: `"${c}" is not allowed (no shell)` };
    if (/\s/.test(c)) { if (cur || any) argv.push(cur); cur = ""; any = false; continue; }
    cur += c;
  }
  if (q) return { error: "an unclosed quote" };
  if (cur || any) argv.push(cur);
  if (!argv.length || !CMD_OK.has(argv[0])) return { error: `only ${[...CMD_OK].join(", ")} (the repo's own scripts)` };
  if ((argv[0] === "node" || argv[0] === "python3") && !/^build\//.test(argv[1] || "")) return { error: "a script under build/" };
  if (argv.includes("--go") || /bump_version|\/ops\/(?!publish)/.test(argv.join(" "))) return { error: "a script that changes the repo or the site is never run by the evidence loop" };
  return { argv };
}

// ---------- expect strings (the machine assertions; anything else is read by the reviewer) ----------
// The words of the spec file's _expect list. "!" in front negates (true <-> false; undecided stays undecided).
export const EXPECT_WORDS = ["lexicon", "textMatches:", "hasWord:", "count:", "inside:", "noOverlap:", "centredOn:", "order:", "sameOrder:", "noClip:", "lines:", "minFont:", "minSize:", "countsUp:", "silentAfter:", "familyOnly", "gapMs:", "times:", "lastsMs:", "traceAmp:", "tracePeriod:", "traceRepeats:", "clipClass:", "liveInput", "pass"];
const OP = "(>=|<=|=|<|>)";
export function parseExpect(s, { contractChecks = null } = {}) {
  let t = String(s || "").trim(), not = false;
  if (t.startsWith("!")) { not = true; t = t.slice(1).trim(); }
  const x = parseExpectOne(t, contractChecks);
  return x.error ? x : { ...x, not, raw: String(s).trim() };
}
const pair = (s) => { const i = s.indexOf(","); return i < 0 ? null : [s.slice(0, i).trim(), s.slice(i + 1).trim()]; };
function parseExpectOne(t, contractChecks) {
  let m;
  if (t === "lexicon" || t === "no-english" || t === "kutchi-only") return { kind: "lexicon" };
  if ((m = /^textMatches:(.+)$/s.exec(t))) {
    let src = m[1], flags = "";
    if (src.startsWith("(?i)")) { src = src.slice(4); flags = "i"; }
    // u: emoji ranges work; a pattern that is only valid without it keeps working
    try { new RegExp(src, flags + "u"); flags += "u"; } catch (e) { try { new RegExp(src, flags); } catch (e2) { return { error: `textMatches: bad regex ${src}` }; } }
    return { kind: "textMatches", re: src, flags };
  }
  if ((m = /^hasWord:([\w-]+)$/.exec(t))) return { kind: "hasWord", tag: m[1] };
  if ((m = /^(one|none):(.+)$/.exec(t))) return { kind: "count", sel: m[2].trim(), op: "=", n: m[1] === "one" ? 1 : 0 };
  if ((m = new RegExp(`^count:(.+?)${OP}(\\d+)$`).exec(t))) return { kind: "count", sel: m[1].trim(), op: m[2], n: +m[3] };
  if ((m = /^(inside|noOverlap|centredOn):(.+)$/.exec(t))) {
    const p = /^(.+?) in (.+)$/.exec(m[2]) || null;
    const ab = m[1] === "inside" && p ? [p[1].trim(), p[2].trim()] : pair(m[2]);
    return ab ? { kind: m[1], sel: ab[0], box: ab[1] } : { error: `${t}: write ${m[1]}:<a>,<b>` };
  }
  if ((m = /^order:(.+)$/.exec(t))) { const items = m[1].split(",").map((x) => x.trim()).filter(Boolean); return items.length >= 2 ? { kind: "order", items, sels: items.every((x) => /^[.#[]|:|^[a-z]+\[/.test(x)) } : { error: `${t}: at least two items` }; }
  if ((m = /^(?:sameOrder|voice-order):(.+)$/.exec(t))) return { kind: "sameOrder", sel: m[1].trim() };
  if ((m = /^noClip:(.+)$/.exec(t))) return { kind: "noClip", sel: m[1].trim() };
  if ((m = new RegExp(`^lines:(.+?)${OP}(\\d+)$`).exec(t))) return { kind: "lines", sel: m[1].trim(), op: m[2], n: +m[3] };
  if ((m = /^(minFont|minSize):(.+?)>=(\d+(?:\.\d+)?)$/.exec(t))) return { kind: m[1], sel: m[2].trim(), op: ">=", n: +m[3] };
  if ((m = /^countsUp:(.+)$/.exec(t))) return { kind: "countsUp", sel: m[1].trim() };
  if ((m = /^silentAfter:(.+)$/.exec(t))) return { kind: "silentAfter", moment: m[1].trim() };
  if (t === "familyOnly" || t === "family-voice") return { kind: "familyOnly" };
  if ((m = new RegExp(`^gapMs:(.+?),(.+?)${OP}(\\d+)$`).exec(t))) return { kind: "gapMs", a: m[1].trim(), b: m[2].trim(), op: m[3], n: +m[4] };
  if ((m = /^moves-on:(\d+)-(\d+)$/.exec(t))) return { kind: "movesOn", min: +m[1], max: +m[2] };
  // times:<moment><op><n>: how many times the moment came while the probe was armed (each ghost-finger play: life:ghost)
  if ((m = new RegExp(`^times:(.+?)${OP}(\\d+)$`).exec(t))) return { kind: "times", moment: m[1].trim(), op: m[2], n: +m[3] };
  if ((m = new RegExp(`^lastsMs:(.+?)${OP}(\\d+)$`).exec(t))) return { kind: "lastsMs", sel: m[1].trim(), op: m[2], n: +m[3] };
  if ((m = new RegExp(`^(traceAmp|tracePeriod|traceRepeats|amp|period):(.+?)${OP}(\\d+(?:\\.\\d+)?)$`).exec(t))) return { kind: { amp: "traceAmp", period: "tracePeriod" }[m[1]] || m[1], sel: m[2].trim(), op: m[3], n: +m[4] };
  if ((m = /^clipClass:([\w-]+)$/.exec(t))) return { kind: "clipClass", cls: m[1] };
  if ((m = /^contract-(\d+)$/.exec(t))) {
    if (contractChecks && !contractChecks.includes(t)) return { error: `unknown contract check "${t}"` };
    return { kind: "contract", check: t };
  }
  if (t === "pass") return { kind: "pass" };
  if (t === "liveInput") return { kind: "free", why: "liveInput: needs the tap-during-speech driver's record (for the reviewer until then)" };
  return { kind: "free", warning: `expect "${t}" is not in the vocabulary (${EXPECT_WORDS.join(" ")}): the reviewer judges it` };
}
export const cmp = (n, op, want) => (op === ">=" ? n >= want : op === "<=" ? n <= want : op === ">" ? n > want : op === "<" ? n < want : Math.abs(n - want) < 1e-9);
// an expect's outcome with its "!" applied
export const negate = (e, r) => (e.not && r.ok != null ? { ...r, ok: !r.ok, why: `not (${r.why})` } : r);

// ---------- moments ----------
// A moment name is "<source>:<name>": life:request|stage-start|stage-end|advance|results|popup-fold|popup-open (the shared
// Lifecycle and the request pop-up), rec:<state> (each state a sandbox player records), host:<njgTest.state()>, cook:<kind> /
// cook-done:<kind> (just before / after the Cook player does what __cook.expectation() asked), exp:<key>, phase:<phase>,
// only:<selector> (that expectation's key, phase, the one click left), clinic:<stage>/<kind>, heal:<step> / heal-done:<step> /
// step:<step> (before / after / after: a heal game's debug step, its `what`, else its `do`), visible:<selector> (each time it turns
// visible), bubble (a speech bubble shows), page:start, page:end. `at` matches when its words (split on - / :) are a run of the
// name's words ("results-words" answers rec:results-words and rec:fetch-results-words); visible:/only: match their selector exactly;
// a named moment of the spec's _moments is an alias (lib/moments.mjs ALIASES).
const words = (s) => String(s || "").toLowerCase().split(/[-/:\s]+/).filter(Boolean);
export function momentMatches(want, name) {
  want = String(want || "").trim();
  if (ALIASES[want]) return ALIASES[want].pats.some((w) => momentMatches(w, name));
  const sel = /^(visible|only|hidden):(.+)$/.exec(want);
  if (sel) return name === want;
  if (/^(visible|only|hidden):/.test(name)) return false;
  // "heal:" / "cook:" (a word and a colon): every name that starts so (each move of a heal game, just before it)
  if (/^[a-z-]+:$/.test(want)) return name.startsWith(want);
  // page:start comes before the flow has opened its page (a blank tab, then a navigation): it answers only itself, never "start"
  if (name === "page:start" && want !== "page:start") return false;
  const w = words(want), n = words(name);
  if (!w.length || w.length > n.length) return false;
  for (let i = 0; i + w.length <= n.length; i++) if (w.every((x, j) => n[i + j] === x)) return true;
  return false;
}
// "every:<moment>" -> {every: true, at: "<moment>"}
export const parseAt = (at) => { const m = /^every:(.+)$/.exec(String(at || "").trim()); return m ? { every: true, at: m[1].trim() } : { every: false, at: String(at || "").trim() }; };
// the selectors a page must watch for visible:/hidden: moments and lastsMs
export function watchList(probes) {
  const out = new Set();
  const add = (w) => { const m = /^(?:visible|hidden):(.+)$/.exec(String(w || "")); if (m) out.add(m[1]); if (ALIASES[w]) for (const p of ALIASES[w].pats) add(p); };
  for (const p of probes) { add(p.at); add(p.after); for (const e of p.expect || []) if (e.kind === "lastsMs") out.add(cssOf(e.sel)); for (const c of p.capture || []) if (c.atMoment) add(c.atMoment); }
  return [...out];
}

// ---------- defaults from the row (Fable 4): the sizes and levels its Check names ----------
export function defaultsFromRow(text) {
  const t = String(text || "").replace(/\*\*|`/g, "");
  const sizes = [];
  for (const m of t.matchAll(/\b(\d{3,4})\s*[x×]\s*(\d{3,4})\b/g)) { const s = `${m[1]}x${m[2]}`; if (!sizes.includes(s)) sizes.push(s); }
  if (!sizes.length && /\bphones?\b/i.test(t)) sizes.push(...PHONE_SIZES);
  const levels = new Set();
  for (const m of t.matchAll(/\bL(\d)(?:\s*(?:[–-]|to)\s*L?(\d))?\b/g)) { const a = +m[1], b = m[2] ? +m[2] : a; for (let i = Math.min(a, b); i <= Math.max(a, b); i++) levels.add(i); }
  return { sizes, levels: [...levels].sort() };
}

// ---------- the spec ----------
// ctx: {resolve(flowId) -> flow|null, kindOf(base) -> {levels, paths}|null, sizes: SIZES, contractChecks, moments(flowId) -> patterns,
//       reachable(want, patterns), drivers: [names in _drivers], rowText: {ID: Check text}}
const FIELDS = new Set(["flow", "path", "level", "levels", "sizes", "at", "after", "capture", "expect", "note", "delay", "max", "profile", "want", "seed", "webgl", "kind"]);
export function normalizeProbe(p, ctx, where, rowText = "") {
  const errors = [], warnings = [];
  const err = (s) => errors.push(`${where}: ${s}`);
  if (!p || typeof p !== "object") { err("a probe is an object"); return { errors, warnings, probes: [] }; }
  for (const k of Object.keys(p)) if (!FIELDS.has(k) && !k.startsWith("_")) warnings.push(`${where}: unknown field "${k}" ignored`);
  if (!p.flow || typeof p.flow !== "string") err("no flow");
  let base = String(p.flow || ""), level = p.level == null || Array.isArray(p.level) ? null : +p.level, path = p.path == null ? null : String(p.path);
  const m = /^(.*?)(?:@L(\d))?(?:#(\w+))?$/.exec(base);
  if (m && (m[2] || m[3])) {
    base = m[1];
    if (m[2] && level != null && level !== +m[2]) err(`flow "${p.flow}" says L${m[2]} but level is ${level}`);
    if (m[3] && path != null && path !== m[3]) err(`flow "${p.flow}" says #${m[3]} but path is ${path}`);
    level = level ?? (m[2] ? +m[2] : null); path = path ?? (m[3] || null);
  }
  path = path || "fair";
  // capture and expect first (a repo probe is only these)
  const capture = [];
  const caps = p.capture == null ? [] : Array.isArray(p.capture) ? p.capture : [p.capture];
  if (!caps.length) err("no capture");
  for (const c of caps) { const x = parseCapture(c); if (x.error) err(x.error); else capture.push(x); }
  const expect = [];
  const exps = p.expect == null ? [] : Array.isArray(p.expect) ? p.expect : [p.expect];
  for (const e of exps) { if (e == null || e === "") continue; const x = parseExpect(e, ctx); if (x.error) err(x.error); else { if (x.warning) warnings.push(`${where}: ${x.warning}`); expect.push(x); } }
  for (const e of expect) if (/^trace/.test(e.kind) && !capture.some((c) => c.kind === "trace" && c.sel === e.sel)) err(`${e.raw} needs a trace:${e.sel}:<ms> capture`);
  if (expect.some((e) => ["sameOrder", "movesOn", "familyOnly", "silentAfter", "clipClass", "gapMs"].includes(e.kind)) && !capture.some((c) => c.kind === "voice")) capture.push(parseCapture("voice"));
  const kind = p.kind == null ? inferKind(capture) : String(p.kind);
  if (!KINDS.includes(kind)) err(`unknown kind "${kind}" (${KINDS.join(", ")})`);
  if (base === "repo") {
    if (capture.some((c) => !["cmd", "ref"].includes(c.kind))) err(`flow "repo" takes only cmd: and ref: captures`);
    return { errors, warnings, probes: errors.length ? [] : [{ repo: true, flow: "repo", level: 1, path: "fair", flowId: "repo", sizes: [], at: "now", every: false, after: null, capture, expect, note: p.note ? String(p.note) : "", kind: "text", raw: p }] };
  }
  const fromRow = defaultsFromRow(rowText);
  const k = ctx.kindOf ? ctx.kindOf(base) : null;
  // levels: a list (one panel per level), else the level, else the levels its row's Check names, else 1
  const lv = Array.isArray(p.levels) ? p.levels : Array.isArray(p.level) ? p.level : null;
  let levels = lv ? lv.map(Number) : level != null ? [level] : fromRow.levels.length && k ? fromRow.levels.filter((L) => k.levels.includes(L)) : [1];
  if (!levels.length) levels = [1];
  for (const L of levels) if (!Number.isInteger(L) || L < 1) err(`level ${L} is not a level`);
  const sizes = p.sizes == null ? (fromRow.sizes.length ? fromRow.sizes : [DEFAULT_SIZE]) : Array.isArray(p.sizes) ? p.sizes.map(String) : [String(p.sizes)];
  if (!sizes.length) err("sizes is empty");
  for (const s of sizes) if (!ctx.sizes[s]) err(`unknown size "${s}" (the sandbox has ${Object.keys(ctx.sizes).join(", ")}: add it to lib/env.mjs SIZES first)`);
  const at = parseAt(p.at);
  if (!at.at) err("no at (the moment)");
  const delay = (p.delay == null ? 0 : +p.delay) + ((ALIASES[at.at] && ALIASES[at.at].delay) || 0);
  if (!(delay >= 0 && delay <= 10000)) err(`delay ${p.delay}: 0 to 10000 ms`);
  const max = p.max == null ? MAX_EVERY : +p.max;
  if (!(max >= 1 && max <= 20)) err(`max ${p.max}: 1 to 20`);
  const profile = p.profile == null ? null : String(p.profile);
  if (profile && !PROFILES.includes(profile)) err(`unknown profile "${profile}" (${PROFILES.join(", ")})`);
  // want: words the order must hold, "/regex/flags", "people:N", "said:<words or regex>" (what was said only); or {order, people}
  const want = p.want == null ? null : typeof p.want === "string" ? [p.want] : Array.isArray(p.want) ? p.want.map(String) : typeof p.want === "object" ? [...[].concat(p.want.order ?? []).map(String), ...(p.want.people != null ? [`people:${+p.want.people}`] : [])] : null;
  if (p.want != null && !(want && want.length)) err(`want: a string, a list of strings or {order, people}`);
  for (const w of want || []) { const re = /^\/(.+)\/([a-z]*)$/.exec(w.replace(/^said:/, "")); if (re) try { new RegExp(re[1], re[2]); } catch (e) { err(`want ${w}: not a regex (${e.message})`); } }
  const seed = p.seed == null ? null : +p.seed;
  if (seed != null && !(Number.isInteger(seed) && seed >= 0)) err(`seed ${p.seed} is not a whole number`);
  // a driver of the spec's _drivers that the sandbox does not have yet
  if (k && !k.paths.includes(path) && (ctx.drivers || []).includes(path)) err(`driver "${path}" is described in _drivers but not built in the sandbox yet (flows/*.mjs)`);
  const out = [];
  for (const L of levels) {
    const flowId = `${base}${L > 1 ? `@L${L}` : ""}${path !== "fair" ? `#${path}` : ""}`;
    if (p.flow && !errors.length && !ctx.resolve(flowId)) {
      if (!ctx.resolve(base) && !k) err(`unknown flow "${base}" (run.mjs --list shows them)`);
      else if (k && !k.paths.includes(path)) err(`unknown path "${path}" for ${base} (${k.paths.join(", ")})`);
      else if (k && !k.levels.includes(L)) err(`no level ${L} in ${base} (${k.levels.join(", ")})`);
      else err(`${flowId}: no such flow (${base} has no other levels or paths)`);
      continue;
    }
    // reachability (Fable 2): an `at` or `after` no driver of this flow can reach is refused before the run
    if (ctx.moments && !errors.length) {
      const pats = ctx.moments(flowId);
      for (const [f, v] of [["at", at.at], ["after", p.after], ...capture.filter((c) => c.atMoment).map((c) => [`${c.raw}'s @`, c.atMoment])]) if (v && !ctx.reachable(v, pats)) err(`${f} "${v}": no driver of ${flowId} reaches it (add it to the driver and lib/moments.mjs first)`);
    }
    out.push({ flow: base, level: L, path, flowId, sizes, at: at.at, every: at.every, after: p.after ? String(p.after) : null, capture, expect, note: p.note ? String(p.note) : "", delay, max, profile, want, seed, webgl: !!p.webgl, kind, dpr: capture.some((c) => c.kind === "zoom2") ? 2 : 1, raw: p });
  }
  return { errors, warnings, probes: errors.length ? [] : out };
}
export function inferKind(capture) {
  const k = new Set(capture.map((c) => c.kind));
  if (k.has("strip") || k.has("trace")) return "motion";
  if (k.has("zoom2")) return "detail";
  if ([...k].every((x) => ["voice", "dom", "cmd", "contract", "ref"].includes(x))) return k.has("voice") && !k.has("dom") ? "voice" : "text";
  return "layout";
}
export function normalizeSpec(spec, ctx) {
  const rows = {}, human = {}, decision = {}, obsolete = {}, rowErrors = {}, errors = [], warnings = [];
  if (!spec || typeof spec !== "object" || Array.isArray(spec)) return { rows, human, decision, obsolete, rowErrors, errors: ["the spec is an object keyed by row id"], warnings };
  const drivers = Object.keys(spec._drivers || {});
  const c2 = { ...ctx, drivers: ctx.drivers || drivers };
  for (const [id, entry] of Object.entries(spec)) {
    if (id.startsWith("_")) continue;
    if (!/^[A-Z][A-Z]*-[A-Z0-9-]*\d+$/.test(id)) { errors.push(`${id}: not a row id`); continue; }
    let arr = entry;
    if (entry && !Array.isArray(entry) && typeof entry === "object") {
      if (entry.human) { human[id] = String(entry.human); continue; }
      if (entry.needsDecision) { decision[id] = String(entry.needsDecision); continue; }
      // {obsolete: why}: the row asks about a state the game no longer has (no page, no sheet; listed for its owner)
      if (entry.obsolete) { obsolete[id] = String(entry.obsolete); continue; }
      arr = [entry];
    }
    if (!arr || !arr.length) { errors.push(`${id}: no probes`); continue; }
    if (arr.length > 3) warnings.push(`${id}: ${arr.length} probes (the design says 1-3)`);
    rows[id] = [];
    arr.forEach((p, i) => {
      const r = normalizeProbe(p, c2, `${id} probe ${i + 1}`, (ctx.rowText || {})[id] || "");
      if (r.errors.length) (rowErrors[id] = rowErrors[id] || []).push(...r.errors);
      errors.push(...r.errors); warnings.push(...r.warnings);
      for (const x of r.probes) rows[id].push({ ...x, i });
    });
  }
  return { rows, human, decision, obsolete, rowErrors, errors, warnings };
}
export function loadSpec(root) {
  const f = SPEC_FILE(root);
  if (!existsSync(f)) return {};
  return JSON.parse(readFileSync(f, "utf8"));
}

// ---------- the plan: probes -> page runs ----------
// a page is one (flow id, size) played one way: the profile, seed, wanted order, renderer and pixel ratio are part of it.
// clinic flows play with the first-time help off already, so "seen" is their default (they share the plain page)
export const variantOf = (p) => [p.profile && !(p.profile === "seen" && /^clinic:(?!patient)/.test(p.flowId) && !/#hint/.test(p.flowId)) ? `p-${p.profile}` : "", p.seed != null ? `s${p.seed}` : "", p.want ? `w-${p.want.join("+").toLowerCase().replace(/[^a-z0-9+]+/g, "-").slice(0, 40)}` : "", p.webgl ? "gl" : "", p.dpr > 1 ? `x${p.dpr}` : ""].filter(Boolean).join("_");
export const pageKey = (flowId, size, variant = "") => `${flowId}@@${size}${variant ? `@@${variant}` : ""}`;
// the probe's id in the outputs: ROW-p<probe>-L<level>-<size>
export const probeId = (row, i, level, size) => `${row}-p${i + 1}-L${level}-${size}`;
// rowIds: the rows wanted; rows: normalized spec rows -> {pages: [{key, flow, size, variant, profile, seed, want, webgl, dpr, probes}],
// repo: [{row, i, capture, expect}], noSpec}. A capture taken at another moment (<capture>@<moment>) rides as its own probe
export function planPages(rowIds, rows) {
  const pages = new Map(), noSpec = [], repo = [];
  for (const id of rowIds) {
    const probes = rows[id];
    if (!probes) { noSpec.push(id); continue; }
    for (const p of probes) {
      if (p.repo) { repo.push({ row: id, i: p.i, capture: p.capture, expect: p.expect, note: p.note, kind: p.kind }); continue; }
      for (const size of p.sizes) {
        const variant = variantOf(p);
        const k = pageKey(p.flowId, size, variant);
        if (!pages.has(k)) pages.set(k, { key: k, flow: p.flowId, size, variant, profile: variant.includes("p-") ? p.profile : null, seed: p.seed, want: p.want, webgl: p.webgl, dpr: p.dpr, probes: [] });
        const own = p.capture.filter((c) => !c.atMoment);
        pages.get(k).probes.push({ row: id, i: p.i, level: p.level, at: p.at, every: p.every, after: p.after, capture: own, expect: p.expect, delay: p.delay, max: p.max, note: p.note, kind: p.kind });
        for (const c of p.capture.filter((c) => c.atMoment)) pages.get(k).probes.push({ row: id, i: p.i, level: p.level, sub: c.atMoment, at: c.atMoment, every: false, after: null, capture: [c], expect: [], delay: 0, max: 1, note: `${c.raw}`, kind: p.kind });
      }
    }
  }
  return { pages: [...pages.values()], repo, noSpec };
}

// ---------- lexicon: the words a child sees, against the family lexicon (Fable 10: never an English dictionary) ----------
const NAMES = new Set(["nani", "nana", "ma", "mum", "ali", "bapa", "masi", "kaka", "kaki", "dada", "dadi"]);
export function unknownWords(text, lexicon) {
  const out = [];
  for (const w of String(text || "").toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []) {
    const x = w.replace(/’/g, "'").replace(/^'+|'+$/g, "");
    if (x.length < 2 || NAMES.has(x) || lexicon.has(x) || lexicon.has(x.replace(/'s$/, ""))) continue;
    if (!out.includes(x)) out.push(x);
  }
  return out;
}
// every word form of data/lang/lexicon.json (lemmas, forms, aliases) and of the family's recorded lines (data/family-audio.json
// kutchi, data/lang/clips.json): the words a child may read. Decision 81: "Thank you!" is Kutchi. tags: pos -> words (hasWord:number)
export function lexiconWords(root, { tags = false } = {}) {
  const set = new Set(), byTag = {};
  const split = (s) => String(s || "").toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || [];
  const add = (s, tag) => { for (const w of split(s)) { const x = w.replace(/’/g, "'"); set.add(x); if (tag) (byTag[tag] = byTag[tag] || new Set()).add(x); } };
  const walk = (v, tag) => { if (typeof v === "string") add(v, tag); else if (Array.isArray(v)) v.forEach((x) => walk(x, tag)); else if (v && typeof v === "object") { if (typeof v.t === "string") add(v.t, tag); for (const [k, x] of Object.entries(v)) if (!/^(src|notes|gloss|glossPl|status|id|pos|ref|person|number|gender|why|about|_about|history|ask|paradigm|open|clusivity|t)$/.test(k)) walk(x, tag); } };
  const read = (f) => { try { return JSON.parse(readFileSync(join(root, f), "utf8")); } catch (e) { return null; } };
  const TAG = { Num: "number", PN: "name" };
  const lex = read("data/lang/lexicon.json");
  // the engine inflects at play time (chundo -> chunda, S05-T2): expand each entry's paradigm cells ({stem} / {lemma}) so an inflected form the game writes is known
  const par = (read("data/lang/paradigms.json") || {}).paradigms || {};
  const inflected = (e) => { const pd = par[e.paradigm]; if (!pd || !e.lemma) return []; let stem = e.lemma; const dr = pd.stem && pd.stem.drop; if (dr && stem.endsWith(dr)) stem = stem.slice(0, -dr.length);
    return Object.values(pd.cells || {}).map((c) => (c && typeof c === "object" ? c.make : c)).filter((m) => typeof m === "string").map((m) => m.replace(/\{stem\}/g, stem).replace(/\{lemma\}/g, e.lemma)); };
  for (const e of (lex && lex.entries) || []) { const tag = e.loan === "en" ? "loan" : TAG[e.pos] || null; /* decision 87: loan: "en" is Kutchi */ add(e.lemma, tag); inflected(e).forEach((f) => add(f, tag)); walk(e.forms || {}, tag); walk(e.aliases || [], tag); if (e.say) walk(e.say, tag); }
  const fam = read("data/family-audio.json");
  for (const e of Array.isArray(fam) ? fam : []) add(e.kutchi);
  const clips = read("data/lang/clips.json");
  if (clips) walk(clips.clips || clips.entries || clips);
  add("thank you"); // decision 81
  return tags ? { words: set, tags: Object.fromEntries(Object.entries(byTag).map(([k, v]) => [k, v])) } : set;
}

// ---------- the expects decided after the page ----------
const norm = (s) => String(s || "").toLowerCase().normalize("NFC").replace(/[^\p{L}\p{M}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
// sameOrder: rows (screen order) against the spoken lines (time order) -> {ok: true|false|null, heard, why}
export function voiceOrder(rows, lines) {
  const L = lines.map(norm);
  const heard = rows.map((r) => {
    const t = norm(r);
    if (!t) return -1;
    return L.findIndex((l) => l === t || (t.length >= 3 && l.includes(t)) || (l.length >= 3 && t.includes(l)));
  });
  const got = heard.filter((i) => i >= 0);
  if (got.length < 2) return { ok: null, heard, why: `only ${got.length} of ${rows.length} rows heard as a line: a reviewer judges` };
  for (let i = 1; i < got.length; i++) if (got[i] < got[i - 1]) return { ok: false, heard, why: `a row heard as line ${got[i] + 1}, after a later row's line ${got[i - 1] + 1}` };
  return { ok: true, heard, why: `${got.length} of ${rows.length} rows said top to bottom` };
}
// order of words in a text: each item's first occurrence comes after the one before
export function wordOrder(items, text) {
  const t = norm(text);
  const at = items.map((x) => t.indexOf(norm(x)));
  if (at.some((i) => i < 0)) return { ok: null, why: `not found: ${items.filter((_, i) => at[i] < 0).join(", ")}` };
  for (let i = 1; i < at.length; i++) if (at[i] < at[i - 1]) return { ok: false, why: `"${items[i]}" comes before "${items[i - 1]}"` };
  return { ok: true, why: `${items.join(" < ")}` };
}
// moves-on (CLN-83): each stage end -> the next request within [min, max] ms, with no button pressed between
export function movesOn(tl, min, max, from = 0) {
  const life = tl.filter((e) => e.type === "c" && e.k === "life");
  const ends = life.filter((e) => e.what === "stage-end" && e.t >= from && e.reason !== "end");
  const out = [];
  for (const e of ends) {
    const next = life.find((x) => x.what === "request" && x.t > e.t);
    if (!next) continue;
    const pressed = tl.some((x) => x.type === "c" && x.k === "input" && x.next && x.t > e.t && x.t < next.t);
    const ms = next.t - e.t;
    out.push({ ms, pressed, ok: !pressed && ms >= min && ms <= max });
  }
  if (!out.length) return { ok: null, why: "no stage end followed by a request on this page" };
  return { ok: out.every((x) => x.ok), why: `${out.length} stage ends: ${out.map((x) => `${x.ms} ms${x.pressed ? " after a button press" : ""}`).join(", ")}` };
}
// silentAfter: plays [{t0, t1}] and the moment times -> nothing starts, or still sounds, more than 150 ms after each moment
export function silentAfter(plays, times, slack = 150, bounds = []) {
  if (!times.length) return { ok: null, why: "the moment never came" };
  const bad = [];
  for (const t of times) {
    // the window ends at the next stage-start or request after the moment (a new stage may speak), else 4 s (as contract-3)
    const next = bounds.filter((b) => b > t + 50).sort((a, b) => a - b)[0];
    const end = next != null ? Math.min(next, t + 4000) : t + 4000;
    for (const p of plays) if ((p.t0 > t + slack && p.t0 < end) || (p.t0 <= t && p.t1 > t + slack)) bad.push(`${p.url || p.text || p.via} at ${((p.t0 - t) / 1000).toFixed(2)} s`);
  }
  return { ok: !bad.length, why: bad.length ? `${bad.length} clips after it: ${bad.slice(0, 3).join("; ")}` : `${times.length} moments, silent after each${bounds.length ? " (to the next stage-start or request)" : ""}` };
}
// gapMs: the time from moment a to the next moment b. seen: [{name, t}]
export function gapMs(seen, a, b, matches) {
  const ia = seen.findIndex((x) => matches(a, x.name));
  if (ia < 0) return { ms: null, why: `${a} never came` };
  const nb = seen.slice(ia + 1).find((x) => matches(b, x.name));
  return nb ? { ms: nb.t - seen[ia].t, why: `${a} -> ${b}: ${nb.t - seen[ia].t} ms` } : { ms: null, why: `${b} never came after ${a}` };
}
// traces (motion): samples [{t, x, y, o}] -> amplitude (px, the larger of across and down), period (ms), repeats
export function traceStats(samples) {
  const s = (samples || []).filter((x) => x && isFinite(x.y));
  if (s.length < 3) return { amp: null, period: null, repeats: null, n: s.length };
  const range = (k) => Math.max(...s.map((x) => x[k])) - Math.min(...s.map((x) => x[k]));
  const amp = Math.max(range("x"), range("y"));
  const mid = (Math.max(...s.map((x) => x.y)) + Math.min(...s.map((x) => x.y))) / 2;
  const ups = [];
  for (let i = 1; i < s.length; i++) if (s[i - 1].y < mid && s[i].y >= mid) ups.push(s[i].t);
  const gaps = ups.slice(1).map((t, i) => t - ups[i]);
  const moving = amp > 0.5;
  const period = moving && gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null;
  return { amp: Math.round(amp * 10) / 10, period, repeats: moving ? ups.length : 0, n: s.length };
}
// a "to record" placeholder (grey italic + the grown-ups' flag) and the grown-ups' own places (the "?" pop-up, the lab bar)
export const NOT_FOR_CHILD_SEL = ".rs-ph, .rs-rec, .oc-rec, .oc-headline.rec, .rec, [data-rec], [class$=\"-rec\"], [class*=\"-rec \"]";
export const GROWNUP_SEL = ".gu-pop, .gu-btn, #gu-btn, .njg-grownup, .cl-lab-bar, .cl-lab-out, #lab, #lab-out";
