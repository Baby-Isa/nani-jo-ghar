#!/usr/bin/env node
// Art-asset data check (checks-to-build 16; art rules D8, D15, D22, D29): no decoding, headers only.
//   bg       every background (assets/**/bg/, assets/backgrounds/, assets/clinic/rooms/) is exactly 1600x900
//   cutout   every cut-out (items*, props, room-items folders) is WebP with an alpha channel
//   ref      every assets/ path named in js/ or data/ exists (a retired or moved file still referenced)
// Today's findings are build/tools/art/artcheck-known.json (art debt for the next runs): a finding not in it fails.
//   node build/tools/art/artcheck.mjs [--write-known] [--all]
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, openSync, readSync, closeSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const KNOWN = join(ROOT, "build/tools/art/artcheck-known.json");

// {w, h, alpha} from the first bytes of a PNG, JPEG or WebP; null when unknown
export function imageInfo(buf) {
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) return { type: "png", w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), alpha: [4, 6].includes(buf[25]) };
  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const c = buf.toString("ascii", 12, 16);
    if (c === "VP8X") return { type: "webp", w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3), alpha: !!(buf[20] & 0x10) };
    if (c === "VP8L") { const b = buf.readUInt32LE(21); return { type: "webp", w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1, alpha: !!((b >> 28) & 1) }; }
    if (c === "VP8 ") return { type: "webp", w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff, alpha: false };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { type: "jpg", w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5), alpha: false };
      i += 2 + len;
    }
  }
  return null;
}
const head = (p, n = 65536) => { const fd = openSync(p, "r"); const b = Buffer.alloc(n); const k = readSync(fd, b, 0, n, 0); closeSync(fd); return b.subarray(0, k); };
const walk = (dir, ok, out = []) => {
  if (!existsSync(join(ROOT, dir))) return out;
  for (const f of readdirSync(join(ROOT, dir))) { const p = `${dir}/${f}`; if (statSync(join(ROOT, p)).isDirectory()) { if (!/^(rough|sheets|src|sources|old)$/.test(f)) walk(p, ok, out); } else if (ok(p)) out.push(p); }
  return out;
};
const IMG = /\.(png|webp|jpe?g)$/i;
export const isBg = (p) => /\/bg\/|^assets\/backgrounds\/|^assets\/clinic\/rooms\//.test(p) && !/@2x|thumb/.test(p);
export const isCutout = (p) => /\/(items[\w-]*|props|room-items)\//.test(p);
export function findings() {
  const out = [];
  for (const p of walk("assets", (x) => IMG.test(x))) {
    const i = imageInfo(head(join(ROOT, p)));
    if (!i) continue;
    if (isBg(p) && (i.w !== 1600 || i.h !== 900)) out.push({ check: "bg", key: `bg|${p}`, text: `${p}: ${i.w}x${i.h}, not 1600x900` });
    if (isCutout(p) && (i.type !== "webp" || !i.alpha)) out.push({ check: "cutout", key: `cutout|${p}`, text: `${p}: ${i.type}${i.alpha ? "" : " without alpha"}, not WebP with alpha` });
  }
  const refs = new Set();
  for (const f of [...walk("js", (x) => x.endsWith(".js") && !x.includes("/vendor/")), ...walk("data", (x) => x.endsWith(".json") && !/candidates|audio-manifest|asset-list/.test(x))]) {
    for (const m of readFileSync(join(ROOT, f), "utf8").matchAll(/["'`](assets\/[^"'`\s$*{}]+\.(?:png|webp|jpe?g|svg))["'`]/gi)) refs.add(`${f} -> ${m[1]}`);
  }
  for (const r of refs) { const p = r.split(" -> ")[1]; if (!existsSync(join(ROOT, p))) out.push({ check: "ref", key: `ref|${r}`, text: `${r.replace(" -> ", " names ")}, which does not exist` }); }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2), found = findings();
  if (argv.includes("--write-known")) { writeFileSync(KNOWN, JSON.stringify(found.map((f) => f.key).sort(), null, 1) + "\n"); console.log(`artcheck: ${found.length} known findings written`); process.exit(0); }
  const known = new Set(existsSync(KNOWN) ? JSON.parse(readFileSync(KNOWN, "utf8")) : []);
  const fresh = found.filter((f) => !known.has(f.key));
  const by = {}; for (const f of found) by[f.check] = (by[f.check] || 0) + 1;
  for (const f of (argv.includes("--all") ? found : fresh).slice(0, 60)) console.log(`${known.has(f.key) ? "known" : "NEW"} ${f.check} ${f.text}`);
  console.log(`artcheck: ${found.length} findings (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}), ${found.length - fresh.length} known, ${fresh.length} new`);
  process.exit(fresh.length ? 1 : 0);
}
