#!/usr/bin/env node
/**
 * Decisions put to Zafar, and his answers, written back onto the fix list (Zafar, 9 Nov: "the fact that you didn't record my
 * decisions against the fixed list rows is just ridiculous. Fix it in the tool so you can't forget it next time ... you get my
 * feedback, you list some issues, some of them you're not sure how to proceed with, so you ask me. Surely my answer should then go
 * back against that fixed list row").
 *
 * One file per decision list: docs/decisions/<date>-<name>.md, with three sections:
 *   ## Asked      the numbered list as sent: "3. <the question> [rows: SH-220, CHAI-76] [then: to fix: code]"
 *   ## Answer     his words, verbatim (pasted, never summarised)
 *   ## Outcome    one line per number: "3: yes" / "3: no, <why>" / "3: changed: <what he wants>" / "3: open"
 *
 *   node build/tools/ops/decisions.mjs --apply docs/decisions/<file>.md   writes each answered item onto its rows: the row's
 *        "waiting on Zafar" label becomes the item's [then: <label>] (default "to fix: code"; "no" leaves "to fix: check"), and the
 *        status starts "decided (Zafar, <date>, <file> #n): <outcome>"
 *   node build/tools/ops/decisions.mjs --check     (checks.mjs runs it) fails if any row named by an answered item still says
 *        "waiting on Zafar", or if a file has an Answer but no Outcome for some number
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const DIR = join(ROOT, "docs", "decisions");
const FIX = join(ROOT, "docs", "process", "regressions.md");
const LABELS = ["to fix: code", "to fix: check", "waiting on art", "waiting on Mum", "before app store", "parked"];

/** Parse one decisions file into {date, items: [{n, text, rows, then, outcome}], answered, missing}. */
export function parse(text, name = "") {
  const sec = (h) => { const m = text.match(new RegExp(`^## ${h}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m")); return m ? m[1] : null; };
  const asked = sec("Asked") || "", answer = sec("Answer"), outcome = sec("Outcome") || "";
  const items = [];
  for (const m of asked.matchAll(/^\s*(\d+)\.\s+(.*)$/gm)) {
    const line = m[2];
    const rows = ((line.match(/\[rows?:\s*([^\]]+)\]/) || [])[1] || "").split(/[,\s]+/).filter((x) => /^[A-Z]+-\d+$/.test(x));
    const then = ((line.match(/\[then:\s*([^\]]+)\]/) || [])[1] || "").trim();
    items.push({ n: +m[1], text: line.replace(/\[(rows?|then):[^\]]*\]/g, "").trim(), rows, then, outcome: null });
  }
  for (const m of outcome.matchAll(/^\s*(\d+):\s*(.+)$/gm)) { const it = items.find((i) => i.n === +m[1]); if (it) it.outcome = m[2].trim(); }
  const date = (name.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  const answered = answer != null && answer.trim().length > 0;
  return { date, items, answered, missing: answered ? items.filter((i) => !i.outcome).map((i) => i.n) : [] };
}

const statusOf = (line) => line.split(" | ")[2] || "";
/** The rows still waiting on Zafar although an answered item names them. */
export function stale(files, fix) {
  const out = [];
  for (const [name, text] of files) {
    const d = parse(text, name);
    if (!d.answered) continue;
    for (const n of d.missing) out.push(`${name} #${n}: answered but no Outcome line`);
    for (const it of d.items) {
      if (!it.outcome || /^open\b/i.test(it.outcome)) continue;
      for (const id of it.rows) {
        const line = fix.split("\n").find((l) => l.startsWith(`| ${id} |`));
        if (!line) { out.push(`${name} #${it.n}: row ${id} not on the fix list`); continue; }
        if (/^\*\*waiting on Zafar\*\*/.test(statusOf(line))) out.push(`${name} #${it.n}: ${id} still says "waiting on Zafar" (run decisions.mjs --apply ${name})`);
      }
    }
  }
  return out;
}

/** Write each answered item onto its rows. Returns the new fix list text and what changed. */
export function apply(text, name, fix) {
  const d = parse(text, name), done = [];
  const lines = fix.split("\n");
  for (const it of d.items) {
    if (!it.outcome || /^open\b/i.test(it.outcome)) continue;
    const label = LABELS.includes(it.then) ? it.then : /^no\b/i.test(it.outcome) ? "to fix: check" : "to fix: code";
    for (const id of it.rows) {
      const i = lines.findIndex((l) => l.startsWith(`| ${id} |`));
      if (i < 0) continue;
      const c = lines[i].split(" | ");
      const rest = c[2].replace(/^\*\*[^*]+\*\*\s*(·\s*)?/, "");
      if (c[2].includes(`${name} #${it.n}`)) continue;
      let s = `**${label}** · decided (Zafar, ${d.date}, docs/decisions/${name} #${it.n}): ${it.outcome}${rest ? " · " + rest : ""}`;
      if (s.length > 1200) s = s.slice(0, 1196) + " ...";
      c[2] = s; lines[i] = c.join(" | "); done.push(`${id} -> ${label}`);
    }
  }
  return { fix: lines.join("\n"), done };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => [f, readFileSync(join(DIR, f), "utf8")]) : [];
  const fix = readFileSync(FIX, "utf8");
  if (a[0] === "--apply") {
    const name = basename(a[1]);
    const r = apply(readFileSync(join(DIR, name), "utf8"), name, fix);
    writeFileSync(FIX, r.fix);
    console.log(`decisions: ${r.done.length} rows written from ${name}${r.done.length ? ": " + r.done.join(", ") : ""}`);
  } else {
    const bad = stale(files, fix);
    console.log(bad.length ? `decisions: ${bad.length} answered but not on the fix list\n` + bad.map((b) => "  " + b).join("\n") : `decisions: ${files.length} files, every answer on its rows`);
    process.exit(bad.length ? 1 : 0);
  }
}
