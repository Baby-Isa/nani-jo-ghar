/*
 * Which recording says a word or a line, with no browser: the text a recording is matched by, the path (store or test)
 * and the rule for choosing one take among several. The language engine plans a line's clips with these
 * (js/core/lang/engine/clips.js); js/core/voice.js plays the plan.
 */
import { build, query } from "./env.js";

/** A recording's text as it is matched: lower case, punctuation gone, one space between words (any script). */
export const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N} ]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

/** "store" (only OK family clips) or "test" (stand-ins allowed). */
export function voicePath() {
  if (build() === "store") return "store";
  return query("voice") === "store" ? "store" : "test";
}

/**
 * The clip to play from the takes of one text or id: entries are {file, speaker, checked}. Returns the entry
 * (with `source`: "family-ok" | "family-unchecked") or null.
 */
export function chooseClip(entries, { path = "store", speaker = null } = {}) {
  const isOk = (e) => e.checked === "ok" || e.checked === "ok-zafar" || e.checked === "ok-auto"; // ok-zafar: picked by Zafar; ok-auto: picked blind by the lead
  const usable = (entries || []).filter((e) => e && e.file && e.speaker && e.checked !== "redo" && (isOk(e) || path === "test"));
  if (!usable.length) return null;
  const tag = (e) => Object.assign({}, e, { source: isOk(e) ? "family-ok" : "family-unchecked" });
  const okOf = (who) => usable.find((e) => e.speaker === who && e.checked === "ok-zafar") || usable.find((e) => e.speaker === who && isOk(e));
  const anyOf = (who) => usable.find((e) => e.speaker === who);
  if (speaker) {
    const own = okOf(speaker) || anyOf(speaker);
    if (own) return tag(own);
  }
  const pick = okOf("mum") || okOf("zafar") || usable.find(isOk) || anyOf("mum") || anyOf("zafar") || usable[0];
  return tag(pick);
}
