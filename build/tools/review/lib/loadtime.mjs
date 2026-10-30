// S14 tools, B6 (SH-168; CHAI-44, Zafar 29 Oct: "the loading on a new level takes extra long ... why is that and can we fix it?"): the load
// time and the bytes to the first play tap, per game, kept in a baseline; a growth of 20% or more fails. The pure part (the page's
// expectation -> is it a play tap; the verdict) lives here, the browser part in build/tools/review/loadtime.mjs.

export const GROWTH = 0.2;          // 20% more bytes or more time than the baseline fails
export const SLACK_MS = 300;        // a machine's own noise: time must also be this much slower than the baseline's
export const SLACK_BYTES = 20000;   // and bytes this many more (a small game's few KB of data are no growth)

// Cook's expectation (njgTest.cook.expectation()) -> true when the game now waits for the child's first PLAY tap: not the greeting's
// answer, the order pop-up, a wait or an intro. e: {kind, selector, intro} or null.
export function isPlayTap(e) {
  if (!e || e.intro) return false;
  if (!e.kind || e.kind === "wait") return false;
  if (e.kind === "click" && /(^|[ ,])(#choices|#intro|\.njg-rq-card|\.njg-rq-veil|#t-start|\.choice)/.test(e.selector || "")) return false;
  return true;
}

/**
 * baseline, now: {ms, bytes, requests}. -> {ok, growth: {ms, bytes}, why}. A game with no baseline is "new" (ok: null: recorded, not judged).
 * Fails when bytes grew by GROWTH or more (and by SLACK_BYTES) or time by GROWTH or more (and by SLACK_MS).
 */
export function judgeLoad(baseline, now, { growth = GROWTH, slackMs = SLACK_MS, slackBytes = SLACK_BYTES } = {}) {
  if (!baseline) return { ok: null, growth: null, why: "no baseline yet (--record writes one)" };
  const g = { ms: baseline.ms ? now.ms / baseline.ms - 1 : 0, bytes: baseline.bytes ? now.bytes / baseline.bytes - 1 : 0 };
  const bad = [];
  if (g.bytes >= growth && now.bytes - baseline.bytes >= slackBytes) bad.push(`${Math.round(g.bytes * 100)}% more bytes (${kb(baseline.bytes)} to ${kb(now.bytes)})`);
  if (g.ms >= growth && now.ms - baseline.ms >= slackMs) bad.push(`${Math.round(g.ms * 100)}% more time (${baseline.ms} to ${now.ms} ms)`);
  return { ok: !bad.length, growth: g, why: bad.length ? bad.join("; ") : "within 20% of the baseline" };
}
export const kb = (n) => `${Math.round(n / 1024)} KB`;
export const keyOf = (game, level, size, net) => `${game}@L${level}@${size}@${net}`;
