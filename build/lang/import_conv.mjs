// Layer 4b: Conversations (data/conversations/lines.json) and the first-launch story (data/story/first-launch.json).
// Their lines are fixed lines or Cook-shaped frames; each becomes a phrase entry or a meaning, with the family
// recording named in the line kept for the clip index.
import { readJSON, RANK } from "./lib.mjs";
import { importLine, importWords, mumOkWords } from "./import_cook.mjs";

const FRAMES = {
  "make-x": { meaning: { fn: "CanYouMake", who: "p2", thing: "$x" }, sample: ["cook-chai"] },
  "want-x": { meaning: { fn: "Need", who: "p1", thing: "$x" }, sample: ["cook-chai"] },
  "x-kida": { meaning: { fn: "Where", thing: "$x" }, sample: ["cook-chai"] },
  "howareyou-child": { meaning: { fn: "HowAreYou", who: "p2" }, sample: [null] },
  "howareyou-elder": { meaning: { fn: "HowAreYou", who: "p2" }, ctx: { addressee: { elder: true } }, sample: [null] },
  fine: { meaning: { fn: "ImFine" }, sample: [null] },
};

export function importConversations(S) {
  const rank = RANK.conversation;
  const okWords = mumOkWords();
  const stat = { lines: 0, nouns: 0, story: 0 };
  const c = readJSON("data/conversations/lines.json");
  // the nouns the conversations offer (Cook's ids are already loaded; the others are family words with their own)
  const words = {};
  for (const [id, n] of Object.entries(c.nouns || {})) if (!S.find(id)) words[id] = { kutchi: n.k, english: n.en, src: n.src };
  stat.nouns = importWords(S, words, { file: "data/conversations/lines.json nouns", okWords, rank });
  for (const [key, v] of Object.entries(c.lines || {})) {
    const ln = { k: v.k || null, en: v.en, src: `${v.src || ""} [${v.status}]`, draft: v.status === "decided" || v.status === "placeholder" ? true : undefined, record: !v.k };
    const r = importLine(S, "conversation", key, ln, { frames: FRAMES, src: "data/conversations/lines.json", okWords, rank });
    if (v.audio) r.audio = v.audio;
    if (v.whole) r.whole = v.whole;
    stat.lines++;
  }
  const story = readJSON("data/story/first-launch.json");
  for (const [key, v] of Object.entries(story.lines || {})) {
    if (v.sound) continue;
    const ln = { k: v.kutchi || null, en: v.en, src: v.note || "", draft: !v.clip || /heard by Whisper/.test(v.note || "") ? true : undefined, record: !v.kutchi };
    const r = importLine(S, "story", key, ln, { frames: {}, src: "data/story/first-launch.json", okWords, rank });
    if (v.clip) r.clip = v.clip;
    stat.story++;
  }
  return stat;
}
