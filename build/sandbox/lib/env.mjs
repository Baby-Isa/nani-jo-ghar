// The sandbox's environment: a static server for the repo, Chromium, and a page set up the same way every time
// (local fonts, no network, seeded Math.random, the click-listener recorder). Nothing here touches game code.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, createReadStream } from "node:fs";
import { join, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { CLICK_HOOK } from "../../lint/layout.mjs";
import { PHASER_HOOK } from "../../lint/phaser.mjs";
import { SOUND_HOOK, SoundLog } from "./sound.mjs";
import { installTouch } from "./touch.mjs";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const PORT = +(process.env.COOK_TEST_PORT || 8812);
export const BASE = `http://127.0.0.1:${PORT}`;
export const FONTS_DIR = join(ROOT, "build", "sandbox", "fonts");
// touch: phones and tablets are emulated with touch (hasTouch, isMobile) and the players' canvas gestures go in as real touch events
export const SIZES = {
  "844x390": { width: 844, height: 390, label: "phone landscape (iPhone 12-14)", touch: true },
  "800x360": { width: 800, height: 360, label: "small Android landscape", touch: true },
  "1366x768": { width: 1366, height: 768, label: "laptop" },
  "1440x900": { width: 1440, height: 900, label: "16:10 laptop" },
  "1280x800": { width: 1280, height: 800, label: "16:10 laptop (small)" },
  "1024x768": { width: 1024, height: 768, label: "tablet landscape 4:3 (iPad)", touch: true },
  "1180x820": { width: 1180, height: 820, label: "tablet landscape (iPad Air 10.9)", touch: true },
  "1366x1024": { width: 1366, height: 1024, label: "tablet landscape (iPad Pro 12.9)", touch: true },
  "390x844": { width: 390, height: 844, label: "phone upright (the rotate card)", touch: true, upright: true },
};
// the five sizes the baseline was first made at, then the tablets; the upright phone is only for the rotate-card flow
export const ALL_SIZES = ["844x390", "800x360", "1366x768", "1440x900", "1280x800", "1024x768", "1180x820", "1366x1024"];
export const QUICK_SIZE = "1366x768";
// the sizes that bound the others: the tightest phone, a 4:3 tablet and a 16:10 laptop (the gate's reduced set for deeper paths)
export const CORE_SIZES = ["800x360", "1024x768", "1440x900"];

const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch (e) { pw = require(join(execSync("npm root -g").toString().trim(), "playwright")); }
export { pw };

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".m4a": "audio/mp4", ".ttf": "font/ttf", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".txt": "text/plain", ".map": "application/json", ".gif": "image/gif", ".webm": "video/webm", ".mp4": "video/mp4" };

// the repo at /, the fonts at /__fonts/, and (for the contact sheets) a run folder at /__run/
export function startServer(extraRoots = {}) {
  const roots = { "/__fonts/": FONTS_DIR, ...extraRoots };
  const srv = createServer((req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, BASE).pathname);
      let base = ROOT;
      for (const [prefix, dir] of Object.entries(roots)) if (p.startsWith(prefix)) { base = dir; p = "/" + p.slice(prefix.length); break; }
      let f = normalize(join(base, p));
      if (!f.startsWith(base)) { res.writeHead(403); return res.end(); }
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
      if (!existsSync(f)) { res.writeHead(404); return res.end("not found"); }
      res.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
      createReadStream(f).pipe(res);
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  return new Promise((resolve, reject) => {
    srv.once("error", reject);
    srv.listen(PORT, "127.0.0.1", () => resolve(srv));
  });
}

export async function launch({ webgl = false } = {}) {
  const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  return pw.chromium.launch({
    executablePath: exe,
    args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required", ...(webgl ? [] : ["--disable-webgl"])],
  });
}

// a seeded Math.random, so the same page shows the same random content on every run
const SEED_SCRIPT = (seed) => `(() => { let a = ${seed >>> 0}; Math.random = function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();`;

const fontsCss = () => readFileSync(join(FONTS_DIR, "fonts.css"), "utf8").replaceAll("__FONTS__", `${BASE}/__fonts`);

// A fresh context + page: the size, no network beyond the local server, the real fonts from build/sandbox/fonts.
export async function newPage(browser, sizeKey, { seed = 1, touch } = {}) {
  const size = SIZES[sizeKey];
  const useTouch = touch === undefined ? !!size.touch : touch;
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1, serviceWorkers: "block", ...(useTouch ? { hasTouch: true, isMobile: true } : {}) });
  await ctx.route(/^https?:\/\//, (route) => {
    const u = route.request().url();
    if (u.startsWith(BASE)) return route.fallback();
    if (u.includes("fonts.googleapis.com")) return route.fulfill({ status: 200, contentType: "text/css", body: fontsCss() });
    return route.abort();
  });
  await ctx.addInitScript(SEED_SCRIPT(seed));
  await ctx.addInitScript(CLICK_HOOK);
  await ctx.addInitScript(PHASER_HOOK);
  await ctx.addInitScript(SOUND_HOOK);
  const sound = new SoundLog();
  await ctx.exposeFunction("__njgLog", (e) => { sound.push(e); });
  const page = await ctx.newPage();
  if (useTouch) await installTouch(page, ctx);
  const errors = [];
  page.on("pageerror", (e) => { if (!/ResizeObserver loop/.test(String(e.message || e))) errors.push(`${new URL(page.url()).pathname}: ${e.message || e}`); }); // the ResizeObserver notice is the browser's, not a bug
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(`${new URL(page.url()).pathname}: console: ${m.text().slice(0, 200)}`); });
  page.on("dialog", (d) => d.accept().catch(() => {}));
  return { ctx, page, errors, size, sound, touch: useTouch };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
