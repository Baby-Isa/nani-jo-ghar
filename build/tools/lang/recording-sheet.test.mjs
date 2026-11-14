// The one recording sheet's generator (Zafar, 14 Nov). Run by checks.mjs through build/tools/ops/recordings.test.mjs, which imports it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { inflateRawSync } from "node:zlib";
import { loadSheet, serialise, addRow, nextId, validate, ordered, statusText, renderMd, renderDocx, documentXml, stale, norm, SOURCE, MD, DOCX } from "./recording-sheet.mjs";

const mini = () => ({
  _about: "test", updated: "2026-11-14",
  sections: [{ id: "G-NEG", group: "Grammar", title: "Negation", about: "" }, { id: "CK-CHAI", group: "Cook", title: "Chai", about: "" }],
  rows: [],
});
// the files of a zip, by name -> text (stored with deflate)
function unzip(buf) {
  const out = {};
  for (let i = 0; i + 30 < buf.length && buf.readUInt32LE(i) === 0x04034b50;) {
    const comp = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), xl = buf.readUInt16LE(i + 28);
    const name = buf.slice(i + 30, i + 30 + nl).toString(), data = buf.slice(i + 30 + nl + xl, i + 30 + nl + xl + comp);
    out[name] = inflateRawSync(data).toString("utf8");
    i += 30 + nl + xl + comp;
  }
  return out;
}

test("rows get the next id in their section and are never repeated (the same key, or the same English)", () => {
  const s = mini();
  const a = addRow(s, { section: "G-NEG", en: "No, thank you.", status: "to record", source: "Round 5 L1", keys: ["gap:x"] });
  assert.equal(a.added, true);
  assert.equal(a.row.id, "G-NEG-01");
  assert.equal(nextId(s, "G-NEG"), "G-NEG-02");
  const b = addRow(s, { section: "CK-CHAI", en: "no, thank you", status: "to record", source: "Round 6 R6-3" });
  assert.equal(b.added, false, "the same English (case and punctuation aside) merges");
  assert.equal(a.row.source, "Round 5 L1; Round 6 R6-3");
  const c = addRow(s, { section: "G-NEG", en: "Something else", status: "to record", source: "engine", keys: ["gap:x"] });
  assert.equal(c.added, false, "the same key merges");
  assert.equal(norm("Don’t “run”!"), norm("don't run"));
  // an answer arriving for an open row moves it on; a done row is never moved back
  addRow(s, { section: "G-NEG", en: "No, thank you.", status: "answered", date: "2026-11-12", source: "12 Nov" });
  assert.equal(a.row.status, "answered");
  addRow(s, { section: "G-NEG", en: "No, thank you.", status: "to record", source: "later" });
  assert.equal(a.row.status, "answered");
});

test("the source's rules: ids, sections, statuses, a source, and a who beside any Kutchi", () => {
  const s = mini();
  s.rows.push({ id: "G-NEG-01", section: "G-NEG", en: "No.", status: "to record", source: "x", kutchi: "na" });
  s.rows.push({ id: "G-NEG-01", section: "G-NEG", en: "Not this.", status: "maybe", source: "x" });
  s.rows.push({ id: "CK-CHAI-01", section: "CK-CHAI", en: "Chai", status: "recorded", date: "2026-11-12", source: "x" });
  const errs = validate(s).join("\n");
  assert.match(errs, /Kutchi with no "who"/);
  assert.match(errs, /repeated id/);
  assert.match(errs, /status "maybe"/);
  assert.match(errs, /recorded with no clip/);
});

test("what's left comes first, then what is done; each row's status in plain words", () => {
  const rows = [
    { id: "CK-CHAI-01", status: "recorded", date: "2026-11-12", clip: ["a", "b"], en: "x" },
    { id: "CK-CHAI-02", status: "to record", kutchi: "chai", who: "Mum", en: "x" },
    { id: "CK-CHAI-03", status: "to confirm", en: "x" },
    { id: "CK-CHAI-04", status: "to record", en: "x" },
  ];
  assert.deepEqual(ordered(rows).map((r) => r.id), ["CK-CHAI-04", "CK-CHAI-02", "CK-CHAI-03", "CK-CHAI-01"]);
  assert.equal(statusText(rows[0]), "Recorded 12 Nov (clip a +1)");
  assert.equal(statusText(rows[1]), "Kutchi known: just record");
  assert.equal(statusText(rows[3]), "Needs Mum's Kutchi");
});

test("the same source always gives the same two files: tables in grammar-first order, done rows grey", () => {
  const s = mini();
  addRow(s, { section: "CK-CHAI", en: "Put water in the pan.", status: "recorded", date: "2026-11-12", clip: ["paani-tapele-me-wij"], kutchi: "Paani tapele me wij", who: "Mum", source: "12 Nov" });
  addRow(s, { section: "G-NEG", en: "No milk.", status: "to record", source: "Round 5" });
  assert.equal(serialise(s), serialise(JSON.parse(serialise(s))));
  const md = renderMd(s);
  assert.equal(md, renderMd(s));
  assert.ok(md.indexOf("### G-NEG") < md.indexOf("### CK-CHAI"), "grammar first");
  assert.match(md, /\| ID \| Ask Mum \(English\) \| What it is for \| Status \| Kutchi \(Mum's answer\) \| Source \|/);
  const d1 = renderDocx(s), d2 = renderDocx(s);
  assert.ok(d1.equals(d2), "byte for byte");
  const parts = unzip(d1);
  assert.deepEqual(Object.keys(parts).sort(), ["[Content_Types].xml", "_rels/.rels", "docProps/core.xml", "word/_rels/document.xml.rels", "word/document.xml", "word/styles.xml"]);
  assert.equal(parts["word/document.xml"], documentXml(s));
  assert.match(parts["word/document.xml"], /<w:tbl>/);
  assert.match(parts["word/document.xml"], /8A8A8A[^]*Paani tapele me wij/, "a done row is grey");
  assert.match(parts["word/document.xml"], /orient="landscape"/);
  assert.match(parts["docProps/core.xml"], /2026-11-14T00:00:00Z/, "the date is the source's, never the clock's");
});

test("the real sheet keeps its rules and both files are current (no diff on a second run)", () => {
  const s = loadSheet();
  assert.deepEqual(validate(s), []);
  assert.deepEqual(stale(s), [], `run node build/tools/lang/recording-sheet.mjs (${MD}, ${DOCX} from ${SOURCE})`);
  const groups = [...new Set(s.sections.map((x) => x.group))];
  assert.equal(groups[0], "Grammar", "grammar first");
  assert.deepEqual(s.sections.filter((x) => x.group === "Cook").map((x) => x.id), ["CK-CHAI", "CK-EGGS", "CK-BAKE", "CK-CORN", "CK-PANTRY", "CK-CHOP", "CK-CHAAT", "CK-DAAR", "CK-SAMOSA", "CK-MAANI", "CK-SEKELO", "CK-ALL"]);
  // decision 27's endings and Zafar's 14 Nov line are on it
  for (const k of ["khapeti", "khapanti", "khapeto", "khapanta"]) assert.ok(s.rows.some((r) => r.section === "G-VERB" && r.kutchi === k), k);
  assert.ok(s.rows.some((r) => /akho burichad/.test(r.en) && r.status === "to confirm"));
});
