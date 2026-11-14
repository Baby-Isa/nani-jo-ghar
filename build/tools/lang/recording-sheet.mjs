#!/usr/bin/env node
// The one recording sheet (Zafar, 14 Nov): every question for Mum is a row in ONE source, data/lang/recording-sheet.json, and this
// generator makes the Word sheet (docs/language/recording-sheet.docx) and its markdown twin (docs/language/recording-sheet.md) from it.
// Grammar first, then each game; the source is only ever added to (a row is never deleted or renumbered: answered rows stay, marked).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { deflateRawSync } from "node:zlib";
import { ROOT, args, help, die } from "../ops/lib.mjs";

export const SOURCE = "data/lang/recording-sheet.json";
export const DOCX = "docs/language/recording-sheet.docx";
export const MD = "docs/language/recording-sheet.md";
export const STATUSES = ["to record", "to confirm", "answered", "recorded", "confirmed", "closed"];
export const OPEN = new Set(["to record", "to confirm"]);
export const FIELDS = ["id", "section", "en", "for", "status", "date", "clip", "kutchi", "who", "note", "source", "keys"];

/* ---------------- the source ---------------- */
export const norm = (s) => String(s || "").toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[×x]3\b/g, "").replace(/\((?:three times|say it once)\)/g, "")
  .replace(/[^a-z0-9' ]+/g, " ").replace(/'/g, "").replace(/\s+/g, " ").trim();
export function loadSheet(root = ROOT) {
  const p = join(root, SOURCE);
  if (!existsSync(p)) die(`No ${SOURCE}.`);
  return JSON.parse(readFileSync(p, "utf8"));
}
const canon = (row) => { const o = {}; for (const f of FIELDS) if (row[f] != null && row[f] !== "" && !(Array.isArray(row[f]) && !row[f].length)) o[f] = row[f]; return o; };
// one row per line, fields in a fixed order: the same sheet always gives the same bytes, and a diff shows one line per changed row
export function serialise(sheet) {
  const head = { _about: sheet._about, updated: sheet.updated };
  const L = ["{"];
  for (const [k, v] of Object.entries(head)) L.push(` ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
  L.push(' "sections": [');
  sheet.sections.forEach((s, i) => L.push(`  ${JSON.stringify({ id: s.id, group: s.group, title: s.title, about: s.about })}${i < sheet.sections.length - 1 ? "," : ""}`));
  L.push(" ],", ' "rows": [');
  sheet.rows.forEach((r, i) => L.push(`  ${JSON.stringify(canon(r))}${i < sheet.rows.length - 1 ? "," : ""}`));
  L.push(" ]", "}", "");
  return L.join("\n");
}
export function saveSheet(sheet, root = ROOT) { writeFileSync(join(root, SOURCE), serialise(sheet)); }

export const rowNum = (id) => +((/-(\d+)$/.exec(id) || [])[1] || 0);
export function nextId(sheet, section) {
  const n = Math.max(0, ...sheet.rows.filter((r) => r.section === section).map((r) => rowNum(r.id)));
  return `${section}-${String(n + 1).padStart(2, "0")}`;
}
// add a question; one already on the sheet (the same engine key, or the same English) is merged into, never repeated
export function addRow(sheet, row) {
  if (!sheet.sections.some((s) => s.id === row.section)) throw new Error(`no section ${row.section}`);
  const keys = row.keys || [];
  let old = keys.length ? sheet.rows.find((r) => (r.keys || []).some((k) => keys.includes(k))) : null;
  if (!old && norm(row.en)) old = sheet.rows.find((r) => norm(r.en) === norm(row.en));
  if (old) {
    for (const k of keys) if (!(old.keys || (old.keys = [])).includes(k)) old.keys.push(k);
    for (const s of String(row.source || "").split("; ").filter(Boolean)) if (!String(old.source || "").split("; ").includes(s)) old.source = old.source ? `${old.source}; ${s}` : s;
    if (!old.kutchi && row.kutchi) { old.kutchi = row.kutchi; old.who = row.who; }
    if (OPEN.has(old.status) && !OPEN.has(row.status)) Object.assign(old, pick(row, ["status", "date", "clip", "note"]));
    return { row: old, added: false };
  }
  const r = { ...row, id: row.id || nextId(sheet, row.section) };
  sheet.rows.push(r);
  return { row: r, added: true };
}
const pick = (o, ks) => Object.fromEntries(ks.filter((k) => o[k] != null).map((k) => [k, o[k]]));

// the source's own rules (a check, so they hold whoever edits it)
export function validate(sheet) {
  const errs = [], ids = new Set(), secs = new Set(sheet.sections.map((s) => s.id));
  if (!/^\d{4}-\d\d-\d\d$/.test(sheet.updated || "")) errs.push("updated: a date, YYYY-MM-DD");
  for (const r of sheet.rows) {
    const w = `${r.id || "(no id)"}:`;
    if (!r.id || ids.has(r.id)) errs.push(`${w} missing or repeated id`);
    ids.add(r.id);
    if (!secs.has(r.section)) errs.push(`${w} unknown section ${r.section}`);
    else if (!r.id.startsWith(`${r.section}-`)) errs.push(`${w} id does not start with its section ${r.section}`);
    if (!r.en) errs.push(`${w} no English`);
    if (!STATUSES.includes(r.status)) errs.push(`${w} status "${r.status}" is not one of ${STATUSES.join(", ")}`);
    if (!r.source) errs.push(`${w} no source`);
    if (r.kutchi && !r.who) errs.push(`${w} Kutchi with no "who" (only the family's words go in the Kutchi column, never a guess)`);
    if (r.status === "recorded" && !r.clip) errs.push(`${w} recorded with no clip id`);
    if (!OPEN.has(r.status) && !r.date) errs.push(`${w} ${r.status} with no date`);
  }
  return errs;
}

/* ---------------- what each row shows ---------------- */
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const dayMon = (d) => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(d || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]}` : d || ""; };
const longDate = (d) => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(d || ""); return m ? `${+m[3]} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][+m[2] - 1]} ${m[1]}` : d; };
export function statusText(r) {
  const note = r.note ? `: ${r.note}` : "";
  const clips = Array.isArray(r.clip) ? r.clip : r.clip ? [r.clip] : [];
  switch (r.status) {
    case "to record": return (r.kutchi ? "Kutchi known: just record" : "Needs Mum's Kutchi") + note;
    case "to confirm": return `To confirm${note}`;
    case "answered": return `Answered ${dayMon(r.date)}${note}`;
    case "recorded": return `Recorded ${dayMon(r.date)} (clip ${clips[0]}${clips.length > 1 ? ` +${clips.length - 1}` : ""})${note}`;
    case "confirmed": return `Spelling confirmed ${dayMon(r.date)}${note}`;
    case "closed": return `Closed ${dayMon(r.date)}${note || ": the game no longer needs it"}`;
    default: return r.status;
  }
}
const kutchiText = (r) => (r.kutchi ? `${r.kutchi}${r.who && !/^mum\b/i.test(r.who) ? ` (${r.who})` : ""}` : "");
const rank = (r) => (r.status === "to record" ? (r.kutchi ? 1 : 0) : r.status === "to confirm" ? 2 : 3);
// what's left first (needs Kutchi, then just record, then to confirm), then what is done, each in id order
export const ordered = (rows) => [...rows].sort((x, y) => rank(x) - rank(y) || rowNum(x.id) - rowNum(y.id));
export const COLUMNS = ["ID", "Ask Mum (English)", "What it is for", "Status", "Kutchi (Mum's answer)", "Source"];
const cells = (r) => [r.id, r.en, r.for || "", statusText(r), kutchiText(r), r.source];
export function counts(sheet) {
  return sheet.sections.map((s) => {
    const rows = sheet.rows.filter((r) => r.section === s.id);
    return { ...s, total: rows.length, open: rows.filter((r) => OPEN.has(r.status)).length, needKutchi: rows.filter((r) => r.status === "to record" && !r.kutchi).length };
  });
}
const groups = (sheet) => { const g = []; for (const s of sheet.sections) { if (!g.length || g.at(-1).name !== s.group) g.push({ name: s.group, sections: [] }); g.at(-1).sections.push(s); } return g; };
const INTRO = (sheet) => [
  `**The one central recording sheet** (Zafar, 14 Nov): every question for Mum and everything still to record, in one place. Updated ${longDate(sheet.updated)}.`,
  `**Grammar first**, a table for each kind of question, **then each game**, a table each. In every table the rows still to do come first (needs Mum's Kutchi, then Kutchi known: just record, then to confirm); the rows that are done stay below them, in grey in the Word copy, so nothing is ever lost.`,
  `**At the sitting:** say the row's ID before each line (it lines the recording up with this sheet); say each line the way you would at home; if the family just uses the English word, say so. **English only:** the Kutchi column holds only what Mum (or the family) has said; nothing here is made up.`,
  `*Made from \`${SOURCE}\` (one row per question; only ever added to) by \`node build/tools/lang/recording-sheet.mjs\`; \`node build/tools/ops/recordings.mjs\` adds what the language engine needs. Never edit this file or the Word copy by hand: ask for the sheet and it is pulled from that source.*`,
];

/* ---------------- markdown ---------------- */
const mdCell = (s) => String(s == null ? "" : s).replace(/\|/g, "/").replace(/\s*\n\s*/g, " ").trim();
export function renderMd(sheet) {
  const L = ["# Nani jo Ghar: the recording sheet", "", ...INTRO(sheet).flatMap((p) => [p, ""])];
  const c = counts(sheet);
  L.push("## Contents", "", "| Section | Still to do | Of which need Mum's Kutchi | Done (kept) |", "|---|---|---|---|");
  for (const s of c) L.push(`| ${s.id} · ${mdCell(s.title)} | ${s.open} | ${s.needKutchi} | ${s.total - s.open} |`);
  L.push(`| **All** | **${c.reduce((n, s) => n + s.open, 0)}** | **${c.reduce((n, s) => n + s.needKutchi, 0)}** | **${c.reduce((n, s) => n + s.total - s.open, 0)}** |`, "");
  for (const g of groups(sheet)) {
    L.push(`## ${g.name}`, "");
    for (const s of g.sections) {
      const rows = ordered(sheet.rows.filter((r) => r.section === s.id));
      const open = rows.filter((r) => OPEN.has(r.status)).length;
      L.push(`### ${s.id} · ${s.title}`, "", `${s.about ? `${s.about} ` : ""}${open} to do, ${rows.length - open} done.`, "");
      if (!rows.length) { L.push("*Nothing yet.*", ""); continue; }
      L.push(`| ${COLUMNS.join(" | ")} |`, `|${COLUMNS.map(() => "---").join("|")}|`);
      for (const r of rows) L.push(`| ${cells(r).map(mdCell).join(" | ")} |`);
      L.push("");
    }
  }
  return L.join("\n");
}

/* ---------------- Word (a minimal .docx written by hand: no dependency, the same bytes every time) ---------------- */
const x = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const run = (t, { b = false, i = false, color = "", sz = 0 } = {}) => {
  const rp = `${b ? "<w:b/>" : ""}${i ? "<w:i/>" : ""}${color ? `<w:color w:val="${color}"/>` : ""}${sz ? `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>` : ""}`;
  return `<w:r>${rp ? `<w:rPr>${rp}</w:rPr>` : ""}<w:t xml:space="preserve">${x(t)}</w:t></w:r>`;
};
// **bold**, *italic* and `code` in a line of the intro, as runs
const runs = (text, o = {}) => String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/).filter(Boolean)
  .map((p) => (/^\*\*/.test(p) ? runs(p.slice(2, -2), { ...o, b: true }) : /^\*/.test(p) ? runs(p.slice(1, -1), { ...o, i: true }) : /^`/.test(p) ? run(p.slice(1, -1), o) : run(p, o))).join("");
const para = (inner, style = "", extra = "") => `<w:p>${style || extra ? `<w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ""}${extra}</w:pPr>` : ""}${inner}</w:p>`;
const WIDTHS = [1250, 4300, 3050, 2400, 2550, 1848]; // twentieths of a point; A4 landscape less 0.5-inch margins = 15398
const tcell = (text, w, { head = false, done = false } = {}) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${head ? '<w:shd w:val="clear" w:color="auto" w:fill="DCE6F0"/>' : done ? '<w:shd w:val="clear" w:color="auto" w:fill="F3F3F3"/>' : ""}</w:tcPr>${para(run(text, { b: head, color: done ? "8A8A8A" : "", sz: 17 }), "", '<w:spacing w:before="0" w:after="0"/>')}</w:tc>`;
const trow = (vals, o = {}) => `<w:tr>${o.head ? '<w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>' : "<w:trPr><w:cantSplit/></w:trPr>"}${vals.map((v, i) => tcell(v, WIDTHS[i] || 1500, o)).join("")}</w:tr>`;
const table = (head, rows, widths = WIDTHS) => `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="${widths.reduce((a, b) => a + b, 0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${trow(head, { head: true })}${rows.join("")}</w:tbl>`;
export function documentXml(sheet) {
  const B = [];
  B.push(para(run("Nani jo Ghar: the recording sheet"), "Title"));
  for (const p of INTRO(sheet)) B.push(para(runs(p)));
  B.push(para(run("Contents"), "Heading1"));
  const c = counts(sheet);
  const CW = [7000, 2800, 3000, 2598];
  const crow = (v, o = {}) => `<w:tr>${v.map((t, i) => tcell(t, CW[i], o)).join("")}</w:tr>`;
  B.push(table(["Section", "Still to do", "Of which need Mum's Kutchi", "Done (kept)"].slice(0, 4), [...c.map((s) => crow([`${s.id} · ${s.title}`, s.open, s.needKutchi, s.total - s.open])), crow(["All", c.reduce((n, s) => n + s.open, 0), c.reduce((n, s) => n + s.needKutchi, 0), c.reduce((n, s) => n + s.total - s.open, 0)], { head: true })], CW));
  for (const g of groups(sheet)) {
    B.push(para(run(g.name), "Heading1", '<w:pageBreakBefore/>'));
    for (const s of g.sections) {
      const rows = ordered(sheet.rows.filter((r) => r.section === s.id));
      const open = rows.filter((r) => OPEN.has(r.status)).length;
      B.push(para(run(`${s.id} · ${s.title}`), "Heading2"));
      B.push(para(run(`${s.about ? `${s.about} ` : ""}${open} to do, ${rows.length - open} done.`, { i: true })));
      if (!rows.length) { B.push(para(run("Nothing yet.", { i: true }))); continue; }
      B.push(table(COLUMNS, rows.map((r) => trow(cells(r), { done: !OPEN.has(r.status) }))));
    }
  }
  const sect = '<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr>';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${B.join("")}${sect}</w:body></w:document>`;
}
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="en-GB"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="160"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3864"/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3864"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="60"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="2E5496"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/></w:tblBorders><w:tblCellMar><w:top w:w="30" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="30" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
const core = (sheet) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Nani jo Ghar: the recording sheet</dc:title><dc:creator>Nani jo Ghar</dc:creator><dcterms:modified xsi:type="dcterms:W3CDTF">${sheet.updated}T00:00:00Z</dcterms:modified></cp:coreProperties>`;

// a zip with fixed dates and a fixed order, so the same sheet always gives the same bytes
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
export function zip(files) {
  const local = [], central = [];
  let off = 0;
  for (const [name, text] of files) {
    const data = Buffer.from(text, "utf8"), comp = deflateRawSync(data, { level: 9 }), nm = Buffer.from(name, "utf8"), crc = crc32(data);
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8); h.writeUInt16LE(0, 10); h.writeUInt16LE(0x21, 12);
    h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(nm.length, 26); h.writeUInt16LE(0, 28);
    local.push(h, nm, comp);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10); c.writeUInt16LE(0, 12); c.writeUInt16LE(0x21, 14);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(nm.length, 28);
    c.writeUInt32LE(off, 42);
    central.push(c, nm);
    off += 30 + nm.length + comp.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...local, cd, end]);
}
export const renderDocx = (sheet) => zip([["[Content_Types].xml", CONTENT_TYPES], ["_rels/.rels", RELS], ["docProps/core.xml", core(sheet)], ["word/document.xml", documentXml(sheet)], ["word/_rels/document.xml.rels", DOC_RELS], ["word/styles.xml", STYLES]]);

/* ---------------- write or check both files ---------------- */
export function outputs(sheet) { return [[MD, Buffer.from(renderMd(sheet), "utf8")], [DOCX, renderDocx(sheet)]]; }
export function stale(sheet, root = ROOT) { return outputs(sheet).filter(([p, buf]) => !existsSync(join(root, p)) || !readFileSync(join(root, p)).equals(buf)).map(([p]) => p); }
export function writeOutputs(sheet, root = ROOT) { for (const [p, buf] of outputs(sheet)) writeFileSync(join(root, p), buf); }
export const summary = (sheet) => { const c = counts(sheet); return `${sheet.rows.length} rows in ${c.length} sections: ${c.reduce((n, s) => n + s.open, 0)} to do (${c.reduce((n, s) => n + s.needKutchi, 0)} need Mum's Kutchi), ${c.reduce((n, s) => n + s.total - s.open, 0)} done`; };

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = args();
  help(`node build/tools/lang/recording-sheet.mjs [--check] [--counts]
  Makes ${MD} and ${DOCX} (Word: tables, grammar first, then each game) from ${SOURCE}, the one central recording sheet
  (Zafar, 14 Nov). The same source always gives the same two files. Checks the source first (unique ids, known sections and
  statuses, a source on every row, a "who" beside any Kutchi). Rows are added by node build/tools/ops/recordings.mjs (the engine's
  needs) or by hand (one JSON line each; the next id in the section); a row is never deleted or renumbered.
  --check   write nothing; exit 1 if the source breaks a rule or either file differs from what the source gives
  --counts  print each section's counts`, a);
  const sheet = loadSheet();
  const errs = validate(sheet);
  if (errs.length) die(`${SOURCE}: ${errs.length} problem(s):\n  ${errs.slice(0, 20).join("\n  ")}`, 1);
  if (a.has("counts")) for (const s of counts(sheet)) console.log(`${s.id.padEnd(10)} ${String(s.open).padStart(4)} to do ${String(s.total - s.open).padStart(4)} done  ${s.title}`);
  if (a.has("check")) {
    const st = stale(sheet);
    if (st.length) die(`${st.join(" and ")} out of date with ${SOURCE}: run node build/tools/lang/recording-sheet.mjs (${summary(sheet)})`, 1);
    console.log(`recording sheet is current: ${summary(sheet)}`);
  } else {
    writeOutputs(sheet);
    console.log(`Wrote ${MD} and ${DOCX}: ${summary(sheet)}`);
  }
}
