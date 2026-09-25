// Converts the combined Questions for Mum markdown into a Word document.
// Usage: node build/build_mum_questions_docx.js <in.md> <out.docx>  (needs the npm "docx" package)
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, LevelFormat, AlignmentType, PageBreak,
  Footer, PageNumber, TableLayoutType,
} = require('docx');

const [src, out] = process.argv.slice(2);
const lines = fs.readFileSync(src, 'utf8').split('\n');

const FONT = 'Calibri';
const ACCENT = '8A4B2A';
const HEAD_FILL = 'F3E6DA';
const TABLE_W = 9638; // A4 with 2 cm margins
const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFA999' };
const borders = { top: border, bottom: border, left: border, right: border };

// Inline **bold**, *italic*, ***both***.
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const t = m[0];
    if (t.startsWith('***')) out.push(new TextRun({ text: t.slice(3, -3), bold: true, italics: true, ...base }));
    else if (t.startsWith('**')) out.push(new TextRun({ text: t.slice(2, -2), bold: true, ...base }));
    else out.push(new TextRun({ text: t.slice(1, -1), italics: true, ...base }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), ...base }));
  return out;
}

function cells(row) {
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

function widthsFor(header) {
  const n = header.length;
  const h = header.map(x => x.toLowerCase());
  if (n === 3 && h[0] === 'id' && h[1] === 'say') return [700, 5900, 3038];
  if (n === 3) return [3600, 3600, 2438];
  if (n === 4) return [850, 3900, 2900, 1988];
  if (n === 5) return [700, 2500, 2338, 2400, 1700];
  const w = Math.floor(TABLE_W / n);
  return header.map((_, i) => (i === n - 1 ? TABLE_W - w * (n - 1) : w));
}

function table(rows) {
  const header = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  const widths = widthsFor(header);
  const mk = (vals, isHead) => new TableRow({
    tableHeader: isHead,
    cantSplit: true,
    children: widths.map((w, i) => new TableCell({
      width: { size: w, type: WidthType.DXA },
      borders,
      shading: isHead ? { type: ShadingType.CLEAR, color: 'auto', fill: HEAD_FILL } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ spacing: { after: 0 }, children: runs(vals[i] || '', isHead ? { bold: true, size: 20 } : { size: 21 }) })],
    })),
  });
  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    columnWidths: widths,
    layout: TableLayoutType.FIXED,
    rows: [mk(header, true), ...body.map(r => mk(r, false))],
  });
}

// An empty box for Zafar to type notes into.
function notesBox() {
  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    columnWidths: [TABLE_W],
    rows: [new TableRow({
      height: { value: 1100, rule: 'atLeast' },
      children: [new TableCell({
        width: { size: TABLE_W, type: WidthType.DXA },
        borders,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: 'Answer notes', color: '8C7B6E', size: 18, italics: true })] }),
          new Paragraph({ spacing: { after: 0 }, children: [] }),
        ],
      })],
    })],
  });
}

const children = [];
let i = 0;
let firstH1 = true;
while (i < lines.length) {
  const line = lines[i];
  const t = line.trim();
  if (!t) { i++; continue; }
  if (t.startsWith('|')) {
    const rows = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++]);
    children.push(table(rows));
    children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    continue;
  }
  if (t === '---') {
    children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFA999', space: 1 } }, spacing: { after: 200 }, children: [] }));
    i++; continue;
  }
  if (t === 'Answer notes:') { children.push(notesBox()); children.push(new Paragraph({ spacing: { after: 120 }, children: [] })); i++; continue; }
  let m;
  if ((m = t.match(/^(#{1,3}) (.*)$/))) {
    const level = m[1].length;
    const text = m[2];
    if (level === 1) {
      if (firstH1) {
        children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: runs(text) }));
        firstH1 = false;
      } else {
        children.push(new Paragraph({ children: [new PageBreak()] }));
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(text) }));
      }
    } else if (level === 2) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(text) }));
    } else {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: runs(text) }));
    }
    i++; continue;
  }
  if ((m = t.match(/^- (.*)$/))) {
    children.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: runs(m[1]) }));
    i++; continue;
  }
  if ((m = t.match(/^(\d+)\. (.*)$/))) {
    children.push(new Paragraph({ indent: { left: 567, hanging: 340 }, children: [new TextRun({ text: `${m[1]}.\t` }), ...runs(m[2])] , tabStops: [{ type: 'left', position: 567 }] }));
    i++; continue;
  }
  children.push(new Paragraph({ children: runs(t) }));
  i++;
}

const doc = new Document({
  creator: 'Zafar',
  title: 'Nani jo Ghar — Questions for Mum',
  styles: {
    default: {
      document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { after: 120, line: 276 } } },
      title: { run: { font: FONT, size: 40, bold: true, color: ACCENT }, paragraph: { spacing: { after: 200 } } },
      heading1: { run: { font: FONT, size: 32, bold: true, color: ACCENT }, paragraph: { spacing: { before: 120, after: 200 } } },
      heading2: { run: { font: FONT, size: 28, bold: true, color: ACCENT }, paragraph: { spacing: { before: 360, after: 160 } } },
      heading3: { run: { font: FONT, size: 24, bold: true, color: '3B2A20' }, paragraph: { spacing: { before: 240, after: 100 } } },
    },
  },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 283 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Questions for Mum · page ', PageNumber.CURRENT], size: 18, color: '8C7B6E' })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('wrote', out); });
