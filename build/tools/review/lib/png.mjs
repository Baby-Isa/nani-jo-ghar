// Minimal PNG reader/writer with no dependencies (zlib only): 8-bit grey/RGB/RGBA/palette, non-interlaced (what Playwright writes).
import { inflateSync, deflateSync, crc32 } from "node:zlib";

export function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let p = 8, w = 0, h = 0, depth = 8, ctype = 6, interlace = 0, plte = null;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("latin1", p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; ctype = d[9]; interlace = d[12]; }
    else if (type === "PLTE") plte = d;
    else if (type === "IDAT") idat.push(d);
    else if (type === "IEND") break;
    p += 12 + len;
  }
  if (depth !== 8 || interlace) throw new Error(`unsupported PNG (depth ${depth}, interlace ${interlace})`);
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype];
  const raw = inflateSync(Buffer.concat(idat)), stride = w * ch, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[dst + x - ch] : 0, b = y ? out[dst - stride + x] : 0, c = x >= ch && y ? out[dst - stride + x - ch] : 0;
      let v = raw[src + x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[dst + x] = v & 255;
    }
  }
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    let r, g, b, a = 255;
    if (ctype === 6) { r = out[i * 4]; g = out[i * 4 + 1]; b = out[i * 4 + 2]; a = out[i * 4 + 3]; }
    else if (ctype === 2) { r = out[i * 3]; g = out[i * 3 + 1]; b = out[i * 3 + 2]; }
    else if (ctype === 0) r = g = b = out[i];
    else if (ctype === 4) { r = g = b = out[i * 2]; a = out[i * 2 + 1]; }
    else { const k = out[i] * 3; r = plte[k]; g = plte[k + 1]; b = plte[k + 2]; }
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
  }
  return { w, h, data: rgba };
}

export function encodePng({ w, h, data }) {
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; data.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  const chunk = (type, d) => {
    const b = Buffer.alloc(12 + d.length);
    b.writeUInt32BE(d.length, 0); b.write(type, 4, "latin1"); d.copy(b, 8);
    b.writeUInt32BE(crc32(b.subarray(4, 8 + d.length)) >>> 0, 8 + d.length);
    return b;
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

// area-average resize into a new RGBA image
export function resize(img, tw, th) {
  const out = Buffer.alloc(tw * th * 4);
  for (let ty = 0; ty < th; ty++) {
    const y0 = Math.floor((ty * img.h) / th), y1 = Math.max(y0 + 1, Math.floor(((ty + 1) * img.h) / th));
    for (let tx = 0; tx < tw; tx++) {
      const x0 = Math.floor((tx * img.w) / tw), x1 = Math.max(x0 + 1, Math.floor(((tx + 1) * img.w) / tw));
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * img.w + x) * 4; r += img.data[i]; g += img.data[i + 1]; b += img.data[i + 2]; n++; }
      const o = (ty * tw + tx) * 4; out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; out[o + 3] = 255;
    }
  }
  return { w: tw, h: th, data: out };
}
export const luma = (d, i) => (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000;

// 3x5 digit and letter bitmap font for sheet labels (digits, a few letters)
const FONT = { "0": "111101101101111", "1": "010110010010111", "2": "111001111100111", "3": "111001111001111", "4": "101101111001001", "5": "111100111001111", "6": "111100111101111", "7": "111001001001001", "8": "111101111101111", "9": "111101111001111", "#": "101111101111101", "N": "111101101101101", "E": "111100111100111", "W": "101101111111101", "O": "010101101101010", "L": "100100100100111", "D": "110101101101110", "-": "000000111000000" };
export function drawText(img, text, x, y, scale, rgb) {
  let cx = x;
  for (const ch of String(text)) {
    const g = FONT[ch];
    if (g) for (let i = 0; i < 15; i++) if (g[i] === "1") for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      const px = cx + (i % 3) * scale + dx, py = y + Math.floor(i / 3) * scale + dy;
      if (px >= 0 && py >= 0 && px < img.w && py < img.h) { const o = (py * img.w + px) * 4; img.data[o] = rgb[0]; img.data[o + 1] = rgb[1]; img.data[o + 2] = rgb[2]; img.data[o + 3] = 255; }
    }
    cx += 4 * scale;
  }
}
export function blank(w, h, rgb = [255, 255, 255]) {
  const data = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) { data[i * 4] = rgb[0]; data[i * 4 + 1] = rgb[1]; data[i * 4 + 2] = rgb[2]; data[i * 4 + 3] = 255; }
  return { w, h, data };
}
export function blit(dst, src, x0, y0) {
  for (let y = 0; y < src.h; y++) { const dy = y0 + y; if (dy < 0 || dy >= dst.h) continue; for (let x = 0; x < src.w; x++) { const dx = x0 + x; if (dx < 0 || dx >= dst.w) continue; src.data.copy(dst.data, (dy * dst.w + dx) * 4, (y * src.w + x) * 4, (y * src.w + x) * 4 + 4); } }
}
