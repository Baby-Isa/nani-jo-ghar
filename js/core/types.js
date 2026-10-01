/*
 * The core's contracts, written once as JSDoc types (target-model § 9.3). No code: a session reads the exact
 * shapes here. (PlayContext lives in context.js, next to the code that makes it.)
 */

/**
 * A word's progress record (save namespace `words`; js/core/progress.js).
 * @typedef {Object} WordRecord
 * @property {number} understand_stage   1-5
 * @property {number} produce_stage      1-5
 * @property {number} u_streak           correct recalls at this stage so far
 * @property {number} u_misses           misses in a row
 * @property {number} p_streak
 * @property {number} p_misses
 * @property {number} seen
 * @property {number} right
 * @property {number} miss
 * @property {number} spoken
 * @property {number} spokenOk
 * @property {number|null} last          ms since 1970
 * @property {boolean} [core]            had evidence from the core itself (not only imported)
 * @property {{cook: {seen: number, right: number, miss: number, streakMiss: number}}} [src]
 */

/**
 * What a mode reports at the end of a round (the framework's tally fills it; js/core/score.js finish()).
 * @typedef {Object} Round
 * @property {string} mode               "cook", "clinic"
 * @property {string} game               the mini-game or dish ("chai", "pharmacy")
 * @property {number} level
 * @property {number} [timeMs]           first action to Done
 * @property {number} right              tested rows right
 * @property {number} total              tested rows
 * @property {boolean[]} [marks]         gold/grey ticks in order
 * @property {number} hints              light bulbs and card peeks used
 * @property {{word: string, ok: boolean, cue?: "kutchi"|"picture"|"text", firstTry?: boolean}[]} [rows]
 * @property {{word: string, ok: boolean, via?: "speech"|"pill"|"parent"}[]} [spoken]
 * @property {number} [tasks]            volume for pocket money (defaults to total)
 * @property {import("./context.js").PlayContext} [play]
 */

/**
 * A Lang result (js/core/lang/index.js; engine-design § 6.1).
 * @typedef {Object} LangResult
 * @property {boolean} ok                false when a rule or word is missing (the text then has English placeholders)
 * @property {string} text
 * @property {string} en                 the grown-ups' English gloss (for the "?" pop-up only)
 * @property {{t: string, lang: "k"|"e"|null, w?: string}[]} segments
 * @property {{t: string, lex: string|null, seg: number, lang: string, status: "confirmed"|"draft"|"placeholder"}[]} tokens
 * @property {{text: string, segments: Object[], head?: boolean, no?: boolean, ids: string[]}[]} rows
 * @property {ClipItem[]} clipPlan
 * @property {Object[]} drafts
 * @property {{kind: "rule"|"lexeme"|"form"|"feature"|"audio", id?: string, lex?: string, what?: string}[]} gaps
 * @property {{segs: Object[], en: string}} line   today's Cook line object, while Cook's callers move (step 4d)
 */

/**
 * One piece of a clip plan (js/core/voice.js).
 * @typedef {Object} ClipItem
 * @property {string} [file]
 * @property {string} text
 * @property {"family-ok"|"family-unchecked"|"tts"|"device"|"missing"} source   only family-ok plays in the store app
 * @property {[number, number]} tokens   the segments it covers (read-along)
 */

/**
 * The one purse (save namespace `wallet`; js/core/wallet.js).
 * @typedef {Object} WalletState
 * @property {number} coins
 * @property {string[]} owned
 * @property {number} earned
 * @property {number} spent
 * @property {Object<string, number>} from   the old purses' totals already merged (cook, clinic)
 * @property {{at: string, n: number, why: string}[]} log   the last 40 changes
 */

export {};
