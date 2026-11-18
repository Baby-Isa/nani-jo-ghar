/*
 * The one door to the language engine and the voice player. Everything the child hears or reads in Kutchi is asked
 * for here as a meaning and comes back as a line; nothing else in the game imports the engine or types a Kutchi word.
 * A line the engine cannot build comes back with its English placeholder (shown grey italic) and is logged as a gap.
 *
 *   const say = await createSay({ voice?, player?, path?, phrases?, child? })
 *       voice: data/kit.json `voice`; in a page with sound, the family's clips play through the Web Audio player with it
 *   say.line(meaning, { register?, voice?, elder?, row? }) -> Line
 *       Line: { ok, text, en, pieces: [{ t, kind: "k"|"e"|null, word? }], plan, gaps, key, meaning }
 *       row: true gives the line as a card's row: lower case, no final mark
 *   say.word(id, cell?) -> Line (one word)        say.entry(id) -> { kutchi, english, gender, status } | null
 *   say.speak(line, { queue?, ifIdle?, key?, ttl?, onPiece?, onHeard? }) -> Promise<{ done }>     never holds up a tap
 *       onPiece: a piece is next; onHeard: a piece is really heard (its clip started, or the device voice began)
 *   say.stop()      say.busy()      say.gaps() -> every gap met so far      say.path
 *   say.hold(on)    the voice pauses where it is (the round held behind the turn card) and goes on from there
 *   say.warm(meaning)   a line's clips fetched and decoded now, for a line said later
 */
import { loadEngine } from "../core/lang/index.js";
import { createVoice, voicePath, deviceSpeak } from "../core/voice.js";
import { webAudioPlayer } from "../core/voice-player.js";

/** A word's English for a card: the gloss without its note in brackets. */
const englishOf = (entry) => String(entry.gloss || "").replace(/\s*\(.*?\)/g, "").trim();

const CHANNEL = "round"; // one queue for every line of a round: one voice at a time

export async function createSay({ voice: settings = null, player = null, path = null, phrases = null, child = {}, load = null } = {}) {
  const engine = await loadEngine({ path, phrases, load });
  const thePath = path || voicePath();
  const sound = typeof globalThis.AudioContext !== "undefined" || typeof globalThis.webkitAudioContext !== "undefined";
  const P = player || (settings && sound ? webAudioPlayer({ settings, synth: (text, o) => deviceSpeak(text, o) }) : null);
  const voice = createVoice({ index: null, player: P, path: thePath, phrases });
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
    const plan = result.clipPlan.map((c) => {
      if (c.file || c.lang === "e") return c;
      const tk = result.tokens[c.tokens[0]];
      const entry = tk && tk.lex ? lex(tk.lex) : null;
      return thePath === "test" ? { ...c, source: "device", text: (entry && entry.say) || c.text } : c;
    });
    note(result.gaps);
    // every clip of a line is fetched and decoded as soon as the line is built, long before it is said
    if (P && P.load) plan.forEach((c) => c.file && (c.source === "family-ok" || thePath === "test") && P.load(c.file));
    return { ok: result.ok, text, en: result.en, pieces, plan, gaps: result.gaps, key: result.key || null, meaning };
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
    speak(line, { queue = true, ifIdle = false, key = null, ttl = null, onPiece = null, onHeard = null } = {}) {
      return voice.say({ clipPlan: line.plan }, { channel: CHANNEL, queue, ifIdle, key, ttl, onWord: onPiece ? (tokens, item) => onPiece(item) : undefined, onStart: onHeard ? (tokens, item) => onHeard(item) : undefined });
    },
    stop: () => voice.stop(CHANNEL),
    hold: (on) => P && P.hold && P.hold(on),
    warm(meaning, opts = {}) {
      if (meaning) lineOf(engine.say(meaning, contextOf(opts)), meaning, opts);
    },
    busy: () => voice.busy(CHANNEL),
    gaps: () => [...met.values()],
  };
}
