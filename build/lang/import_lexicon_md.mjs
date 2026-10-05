// Layer 3: the tables in docs/language/lexicon.md § 6 (Mum's 5 Oct recordings: cooking verbs, kitchen things and
// food, describing words). Each row becomes one entry per Kutchi word, with the row's English, gender, plural,
// recording reference and status. Re-run after Mum's next round once its rows are in that file. § 6.4 (pronouns,
// "of", "be") is knowledge the hand files and the seed already hold; this importer checks it is present.
import { readText, parseTable, plain, slug, RANK } from "./lib.mjs";
import { autoParadigm } from "./hand/dsl.mjs";

const SOURCE = "lexicon.md §6";

const bolds = (cell) => Array.from(String(cell || "").matchAll(/\*\*\*(.+?)\*\*\*/g)).map((m) => m[1].trim());
const italics = (s) => Array.from(String(s || "").matchAll(/(?<!\*)\*([^*]+)\*(?!\*)/g)).map((m) => m[1].trim());

/** Per-item status from a status cell such as "confirmed; *wiji chad* spelling ✓ 5 Oct" or "*kapi chad* spelling ✓; *kap* ⚠". */
function statusFor(item, cell) {
  const text = String(cell || "");
  const segs = text.split(";").map((s) => s.trim());
  const mentioned = segs.filter((s) => italics(s).some((i) => i.toLowerCase() === item.toLowerCase()) || bolds(s).some((i) => i.toLowerCase() === item.toLowerCase()));
  const judge = (s) => (/⚠/.test(s) ? "draft" : /confirmed|✓/.test(s) ? "confirmed" : null);
  for (const s of mentioned) {
    const j = judge(s);
    if (j) return j;
  }
  // row level: the segments that name no item
  const anon = segs.filter((s) => !italics(s).length && !bolds(s).length);
  for (const s of anon) {
    const j = judge(s);
    if (j) return j;
  }
  if (/⚠/.test(text) && !/confirmed|✓/.test(text)) return "draft";
  if (/confirmed|✓/.test(text)) return "confirmed";
  return "draft";
}

const SAME = { wapar: "v.wapur" }; // the same word spelled two ways in the notes (a clash, kept)

export function importLexiconMd(S) {
  const text = readText("docs/language/lexicon.md");
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^## 6\. Words from Mum's 5 Oct recordings/.test(l));
  if (start < 0) throw new Error("lexicon.md: § 6 not found");
  let section = null;
  const added = { verbs: 0, nouns: 0, adjectives: 0, phrases: 0, skipped: [] };
  const rank = RANK.lexicon;
  for (let i = start; i < lines.length; i++) {
    const h = lines[i].match(/^### (6\.\d)/);
    if (h) section = h[1];
    if (!/^\|/.test(lines[i]) || !/^\|[\s-:|]+\|?$/.test(lines[i + 1] || "")) continue;
    const t = parseTable(lines, i);
    i = t.end - 1;
    const hdr = t.header.map((x) => x.toLowerCase());
    const col = (re) => hdr.findIndex((x) => re.test(x));
    const cK = 0;
    const cE = col(/^english/);
    const cS = col(/^source/);
    const cSt = col(/^status/);
    const cG = col(/^gender/);
    const cP = col(/more than one/);
    const cN = col(/^notes/);
    for (const row of t.rows) {
      const items = bolds(row[cK]);
      const english = plain(row[cE]);
      const source = plain(row[cS] || "");
      const srcStr = `lexicon.md ${section ? "§" + section : "§6"} (${source || "no recording ref"})`;
      if (!items.length) {
        added.skipped.push(`${section}: ${plain(row[cK])}`);
        continue;
      }
      const statusCell = row[cSt] || "";
      if (section === "6.1") {
        const glosses = english.includes(",") && english.split(",").length === items.length ? english.split(",").map((x) => x.trim()) : null;
        items.forEach((item, idx) => {
          if (/^[A-Z]\s/.test(item)) return;
          const multi = item.trim().split(/\s+/).length > 1;
          const st = statusFor(item, statusCell);
          const gloss = glosses ? glosses[idx] : english;
          if (!multi) {
            const id = SAME[item] || `v.${slug(item)}`;
            S.add({ id, pos: "V", lemma: item, gloss, forms: { "imp.informal": { t: item, src: srcStr } }, status: st, src: srcStr, notes: plain(row[cN] || "") ? [plain(row[cN])] : undefined }, { source: SOURCE, rank });
            added.verbs++;
          } else {
            S.add({ id: `phr.${slug(item)}`, pos: "Phrase", lemma: item, gloss: glosses ? gloss : `${english} (${item})`, forms: { "-": item }, status: st, src: srcStr, notes: plain(row[cN] || "") ? [plain(row[cN])] : undefined }, { source: SOURCE, rank });
            added.phrases++;
          }
        });
      } else if (section === "6.2") {
        const gcell = plain(row[cG] || "");
        const gender = /^he\b/.test(gcell) ? "he" : /^she\b/.test(gcell) ? "she" : null;
        const plurals = bolds(row[cP]);
        const glosses = english.split(/\s*[;·]\s*/);
        items.forEach((item, idx) => {
          const st = statusFor(item, statusCell);
          const e = {
            id: `n.${slug(item)}`,
            pos: "N",
            lemma: item,
            gloss: english.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim().split(/,|;/)[0],
            gender,
            status: st,
            src: srcStr,
          };
          if (!("gender" in e)) e.gender = null;
          const par = autoParadigm("N", item, gender);
          if (par) e.paradigm = par;
          const yu = plurals.find((p) => p.toLowerCase().startsWith(item.toLowerCase()) && p.length > item.length);
          if (yu) e.forms = { "pl.dir": { t: yu, src: srcStr }, "pl.obl": { t: yu, src: srcStr } };
          if (items.length > 1) e.open = [{ q: `Two words for the same thing (${items.join(" / ")}): which one does the game use?`, src: srcStr }];
          const notes = [];
          const annot = String(row[cK]).match(new RegExp(`\\*\\*\\*${item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*\\*\\*\\s*\\(([^)]*)\\)`));
          if (annot) notes.push(`${item}: ${plain(annot[1])}`);
          const pcell = plain(row[cP] || "");
          if (pcell && !yu && pcell !== "?" && pcell !== "–") notes.push(`one / more than one: ${pcell}`);
          if (gender == null && gcell && gcell !== "?" && gcell !== "–") notes.push(`gender column: ${gcell}`);
          if (notes.length) e.notes = notes;
          if (gender == null) e.ask = { gender: ["new"] };
          S.add(e, { source: SOURCE, rank });
          added.nouns++;
        });
      } else if (section === "6.3") {
        const after = plain(row[col(/before a postposition/)] || "");
        const inv = /invariant/.test(plain(row[cN] || "") + after + plain(row[cK])) || /never changes/.test(plain(row[cK]));
        for (const span of bolds(row[cK])) {
          if (/^X\b/.test(span) || span === "bo") continue; // X ma X and bo: the hand file holds them
          const forms = span.split("·").map((x) => x.trim().replace(/\?$/, ""));
          const lemma = forms[0].split(/\s+/).length > 1 ? forms[0] : forms[0];
          const st = statusFor(forms[0], statusCell);
          if (lemma.includes(" ")) {
            S.add({ id: `phr.${slug(lemma)}`, pos: "Phrase", lemma, gloss: `${english} (${lemma})`, forms: { "-": lemma }, status: st, src: srcStr }, { source: SOURCE, rank });
            added.phrases++;
            continue;
          }
          const e = { id: `a.${slug(lemma)}`, pos: "A", lemma, gloss: english.split(",")[0].replace(/\s*\(.*\)/, "").trim(), status: st, src: srcStr };
          if (forms.length >= 2 && /o$/.test(lemma)) e.paradigm = "adj.o";
          else if (/she/.test(plain(row[cK]))) e.forms = { "she.*.dir": { t: lemma, src: srcStr } };
          else if (!/o$/.test(lemma)) e.paradigm = "adj.invariant";
          else e.paradigm = inv ? "adj.invariant" : "adj.o";
          S.add(e, { source: SOURCE, rank });
          added.adjectives++;
        }
      }
    }
  }
  return added;
}
