/*
 * The core's view of where it runs: a browser page (GitHub Pages, the store app) or Node (tests, bots).
 * Pure helpers only; nothing here draws or plays.
 *
 *   isBrowser                      true in a page
 *   loadJSON(path, {base})         a data file: fetch + njgV() in a page, the file system in Node
 *   query(name)                    a URL parameter in a page (null in Node)
 *   devFlags()                     the set of ?dev= switches ("voice", ...); window.NJG_DEV adds more
 *   build()                        "store" in the store app (window.NJG_BUILD, written by the packager), else "test"
 */
export const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

const g = globalThis;

/** A URL with the cache-busting stamp (js/version.js's njgV), or as it is when there is none. */
export const stamp = (url) => (typeof g.njgV === "function" ? g.njgV(url) : url);

/** A data file as an object. In a page: fetch(base + path) with the stamp. In Node: read it from the repo. */
export async function loadJSON(path, { base = "" } = {}) {
  if (isBrowser || typeof g.process === "undefined") {
    const r = await g.fetch(stamp(base + path));
    if (!r.ok) throw new Error(`could not load ${path}: ${r.status}`);
    return r.json();
  }
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const root = fileURLToPath(new URL("../../", import.meta.url));
  return JSON.parse(await readFile(root + path, "utf8"));
}

/** A URL parameter of the page, or null (Node, or not set). */
export function query(name) {
  try {
    return new URLSearchParams(g.location && g.location.search).get(name);
  } catch (e) {
    return null;
  }
}

/** The developer switches: ?dev=voice,lang (comma separated), plus window.NJG_DEV (a string or a list). */
export function devFlags() {
  const out = new Set();
  const add = (v) => String(v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((s) => out.add(s));
  add(query("dev"));
  [].concat(g.NJG_DEV || []).forEach(add);
  return out;
}

/** "store" in the packaged store app (build/package.mjs writes window.NJG_BUILD = "store"), else "test" (GitHub Pages, labs, Node). */
export const build = () => (g.NJG_BUILD === "store" ? "store" : "test");
