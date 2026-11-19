/*
 * The one door to the language engine and the voice player. Everything the child hears or reads in Kutchi is asked
 * for here as a meaning and comes back as a line; nothing else in the game imports the engine or types a Kutchi word.
 * A line the engine cannot build comes back with its English placeholder (shown grey italic) and is logged as a gap.
 *
 *   const say = await createSay({ voice?, player?, path?, child?, wait? })
 *       wait(ms): the round's clock (the stage's, which stands still while the round is held), for the pause between words
 *       voice: data/kit.json `voice`; in a page with sound, the family's clips play through the Web Audio player with it
 *   say.line(meaning, { register?, voice?, elder?, row? }) -> Line
 *       Line: { ok, text, en, pieces: [{ t, kind: "k"|"e"|null, word?, guess? }], plan, gaps, key, meaning }
 *       guess: the word's form is a guess (a defaulted gender), so no recording of a longer stretch may say it
 *       row: true gives the line as a card's row: lower case, no final mark, its English without notes in brackets
 *   say.word(id, cell?) -> Line (one word)        say.entry(id) -> { kutchi, english, gender, status } | null
 *   say.speak(line, { queue?, ifIdle?, onPiece?, onHeard? }) -> Promise<{ done }>     never holds up a tap
 *       onPiece: a piece is next; onHeard: a piece is really heard (its clip started, or the device voice began)
 *   say.stop()      say.busy()      say.gaps() -> every gap met so far      say.path
 *   say.hold(on)    the voice pauses where it is (the round held behind the turn card) and goes on from there
 *   say.warm(meaning)   a line's clips fetched and decoded now, for a line said later
 *   norm(text)   a recording's text as it is matched (for the checks, which read the recordings list themselves)
 */
import { loadEngine } from "../core/lang/index.js";
import { createVoice, deviceSpeak } from "../core/voice.js";
import { voicePath } from "../core/voice-clips.js";

export { norm } from "../core/voice-clips.js";
import { webAudioPlayer } from "../core/voice-player.js";

/**
 * A card's English: as a card's words are written, with no final mark and lower case ("No milk." is "no milk"), but a name or
 * "I" keeps its capital (capitals: the lexicon's proper nouns' English), and without its grown-ups' notes in brackets
 * ("whole, full (aako cup: a whole cup)" is "whole, full").
 */
const plain = (en) => String(en || "").replace(/\s*\(.*?\)/g, "").trim();
const shortWith = (capitals) => (en) => {
  const t = plain(en).replace(/[.!?]+$/, "").trim();
  const first = (t.match(/^[A-Za-z]+/) || [""])[0];
  return capitals.has(first) ? t : t.charAt(0).toLowerCase() + t.slice(1);
};

export async function createSay({ voice: settings = null, player = null, path = null, child = {}, load = null, wait = undefined } = {}) {
  const engine = await loadEngine({ path, load });
  const capitals = new Set(["I", ...((engine.data && engine.data.lexicon && engine.data.lexicon.entries) || []).filter((e) => e.pos === "PN").map((e) => plain(e.gloss))]);
  const short = shortWith(capitals);
  const englishOf = (entry) => short(entry.gloss);
  const thePath = path || voicePath();
  const sound = typeof globalThis.AudioContext !== "undefined" || typeof globalThis.webkitAudioContext !== "undefined";
  const P = player || (settings && sound ? webAudioPlayer({ settings, synth: (text, o) => deviceSpeak(text, { ...o, times: settings.device }) }) : null);
  const voice = createVoice({ player: P, path: thePath, gapMs: (settings && settings.wordGapMs) || 0, wait });
  const met = new Map(); // gap key -> gap

  const note = (gaps) => gaps.forEach((g) => met.has(g.key || g.what) || met.set(g.key || g.what, g));

  function contextOf({ register = null, voice: whose = null, elder = null } = {}) {
    const ctx = { path: thePath, child: { gender: child.gender || null } };
    if (register) ctx.register = register;
    if (whose) ctx.voice = whose;
    if (elder != null) ctx.addressee = { elder: !!elder };
    return ctx;
  }

  /** The engine's result as a line. A Kutchi word with no recording is read by the device while testing, never in a store build. */
  function lineOf(result, meaning, { row = false } = {}) {
    const lex = (id) => engine.linearizer.lexOf(id);
    let pieces = result.segments.map((s) => ({ t: s.t, kind: s.lang, ...(s.w ? { word: s.w } : {}), ...(s.gap ? { gap: true } : {}) }));
    let text = result.text;
    if (row) {
      const words = result.tokens.filter((tk) => !tk.punct && !tk.mark);
      pieces = [];
      words.forEach((tk, i) => {
        if (i) pieces.push({ t: " ", kind: null });
        pieces.push({ t: tk.t, kind: tk.lang, ...(tk.lex ? { word: tk.lex } : {}), ...(tk.gap ? { gap: true } : {}) });
      });
      text = pieces.map((p) => p.t).join("");
    }
    // each word piece, in order, marked where its form is a guess
    const guessed = result.tokens.filter((tk) => !tk.punct).map((tk) => !!tk.defaulted);
    let w = 0;
    pieces = pieces.map((p) => (p.kind && guessed[w++] ? { ...p, guess: true } : p));
    const plan = result.clipPlan.map((c) => {
      if (c.file || c.lang === "e") return c;
      const tk = result.tokens[c.tokens[0]];
      const entry = tk && tk.lex ? lex(tk.lex) : null;
      return thePath === "test" ? { ...c, source: "device", text: (entry && entry.say) || c.text } : c;
    });
    note(result.gaps);
    // every clip of a line is fetched and decoded as soon as the line is built, long before it is said
    if (P && P.load) plan.forEach((c) => c.file && (c.source === "family-ok" || thePath === "test") && P.load(c.file));
    // (a line as a card's row is a card's English, as a word on its own is)
    return { ok: result.ok, text, en: row ? short(result.en) : result.en, pieces, plan, gaps: result.gaps, key: result.key || null, meaning };
  }

  return {
    path: thePath,
    line(meaning, opts = {}) {
      return lineOf(engine.say(meaning, contextOf(opts)), meaning, opts);
    },
    word(id, cell = null, opts = {}) {
      const line = lineOf(engine.word(id, cell, contextOf(opts)), { word: id, cell });
      const e = engine.linearizer.lexOf(id);
      // the piece carries the engine's own id for the word, whichever of its names was asked for
      return { ...line, en: e ? englishOf(e) : "", pieces: line.pieces.map((p) => (p.word && e ? { ...p, word: e.id } : p)) };
    },
    entry(id) {
      const e = engine.linearizer.lexOf(id);
      if (!e) return null;
      return { id: e.id, kutchi: engine.word(id).text, english: englishOf(e), gender: e.gender || null, status: e.status };
    },
    speak(line, { queue = true, ifIdle = false, onPiece = null, onHeard = null } = {}) {
      return voice.say({ clipPlan: line.plan }, { queue, ifIdle, onWord: onPiece ? (tokens, item) => onPiece(item) : undefined, onStart: onHeard ? (tokens, item) => onHeard(item) : undefined });
    },
    stop: () => voice.stop(),
    hold: (on) => P && P.hold && P.hold(on),
    warm(meaning, opts = {}) {
      if (meaning) lineOf(engine.say(meaning, contextOf(opts)), meaning, opts);
    },
    busy: () => voice.busy(),
    gaps: () => [...met.values()],
  };
}
