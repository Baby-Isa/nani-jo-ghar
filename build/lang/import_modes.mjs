// Layer 7: the parked modes (dress, who, relations, monsoon, snap, tidy, find). They borrow Cook's and the content
// master's words by id and add English placeholders of their own (kutchi: null): each becomes one to-record entry per
// English word (or an alias of the word the engine already knows: a closable gap), and each line they say becomes an
// engine meaning with an unknown rule. Nothing here is Kutchi: no mode has Kutchi of its own. Re-run when a mode's data changes.
import { readJSON, RANK } from "./lib.mjs";
import { importLine, recordWord } from "./import_cook.mjs";

const SOURCE = "parked modes";
const MODES = ["dress", "who", "relations", "monsoon", "snap", "tidy", "find"];

const isWordObj = (o) => o && typeof o === "object" && !Array.isArray(o) && typeof o.english === "string" && !("hex" in o && false);

function posOf(id, o, mode) {
  if (/^nm-/.test(id) || o.name) return "PN";
  if (o.kind === "colour" || /^(ph-)?(red|green|white|blue|yellow|dark|light|old|young|big|small)$/.test(id.replace(/^ph-/, ""))) return "A";
  if (/^ph-rel-/.test(id)) return "Post";
  if (/^(it's|the sun|it stopped|thunder)/i.test(o.english)) return "Phrase";
  return "N";
}

/** collect every {english, kutchi: null} object under a mode's data, keyed by its id */
function collect(node, out, path = []) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return;
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("_") || k === "real" || k === "lines" || k === "from_content") continue;
    if (isWordObj(v) && (v.kutchi == null || typeof v.kutchi === "string") && /^[a-z0-9-]+$/i.test(k)) out.push({ id: k, o: v, path: path.join(".") });
    else if (v && typeof v === "object") collect(v, out, [...path, k]);
  }
}

export function importModes(S) {
  const rank = RANK.modes;
  const stat = { words: 0, lines: 0, unknown: 0, toRecord: 0 };
  for (const mode of MODES) {
    const d = readJSON(`data/${mode}.json`);
    const found = [];
    collect(d, found);
    const seen = new Set();
    for (const { id, o, path } of found) {
      if (seen.has(id)) continue;
      seen.add(id);
      if (S.find(id)) continue; // a word of Cook's or the content master, already loaded
      if (o.kutchi) continue; // none of the modes has Kutchi of its own
      const pos = posOf(id, o, mode);
      const src = `data/${mode}.json ${path ? path + "." : ""}${id}: an English placeholder, to record${o.src ? " (" + String(o.src).slice(0, 120) + ")" : ""}`;
      if (pos === "PN") {
        S.add({ pos: "PN", lemma: o.english, gloss: o.english, gender: null, forms: { "*": o.english }, statusDefault: "draft", src: `data/${mode}.json ${path ? path + "." : ""}${id}: a character's name in the game's cast; not yet said by the family`, aliases: [id], ask: { gender: ["new"] } }, { source: SOURCE, rank });
      } else recordWord(S, { pos, english: o.english, src, alias: id, file: `data/${mode}.json`, ask: o.qfm || o.ask || "new", rank });
      stat.words++;
    }
    for (const [key, ln] of Object.entries(d.lines || {})) {
      if (key.startsWith("_") || !ln || typeof ln !== "object") continue;
      const en = ln.e || ln.en || ln.english;
      if (!en) continue;
      const r = importLine(S, mode, key, { e: en, src: ln.ask ? `asked as ${ln.ask}` : "an English placeholder, to record", record: true }, { frames: {}, src: `data/${mode}.json`, okWords: new Set(), rank, ask: `to record with Mum (the ${mode} mode's line has no Kutchi yet)` });
      stat.lines++;
      if (r.kind === "unknown-frame") stat.unknown++;
      else stat.toRecord++;
    }
  }
  return stat;
}
