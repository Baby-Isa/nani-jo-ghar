/*
 * The site root as a path relative to the page ("" on a root page, "../" from lab/), so URLs the adapters build
 * stay relative and njgV() stamps them (rule B7: full URLs are left unstamped).
 */
const ROOT = new URL("../../", import.meta.url);

export function rootFrom(baseURI = typeof document !== "undefined" ? document.baseURI : ROOT.href) {
  const page = new URL("./", baseURI);
  if (page.origin !== ROOT.origin || !page.pathname.startsWith(ROOT.pathname)) return ROOT.href;
  const depth = page.pathname.slice(ROOT.pathname.length).split("/").filter(Boolean).length;
  return "../".repeat(depth);
}

export const stamp = (u) => (typeof globalThis.njgV === "function" ? globalThis.njgV(u) : u);
