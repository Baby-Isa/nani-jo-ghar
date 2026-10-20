// S08 wave 6D (requests from wave 6A): contract-22 skips count lines and a pop-up's read-out of two people asking for the same thing,
// contract-26 exempts a tap through the pop-up and to-record placeholder words, contract-35 skips a peeking card.
// node --test build/sandbox/contract-w6d.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const clip = () => 0.6;
const LEX = new Set(["muke", "bhar", "chai", "khape", "dhania", "white", "socks"]);
const NUMS = new Set(["ek", "ba", "trae"]);
const run = (r, lexicon = LEX) => analyse(r, { root: ROOT, retired: [], clip, lexicon, numbers: NUMS });
const of = (out, c) => out.filter((b) => b.check === c);
const page = (flow, timeline, size = "1366x768") => ({ flow, size, t0: timeline[0].t, states: [{ name: "01-start", at: 0, shot: "01-start.png" }], timeline });
const C = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const stage = (t, key) => C(t, "stage", { key });
const life = (t, what, step = "", o = {}) => C(t, "life", { what, reason: step, at: t, ...o });
const line = (id, t, text, o = {}) => ({ type: "line", id, who: "cook", text, t, ...o });
const lineEnd = (id, t) => ({ type: "line-end", id, t });
const T = 1e6;
const ST = "cook:station1:chai";
const sorted = (tl) => tl.sort((a, b) => a.t - b.t);

test("contract-22: a count line said twice is a tally of taps, not a repeat; a plain line said twice still is one", () => {
  const mk = (role) => sorted([stage(T, ST), life(T, "stage-start", "cook:station"),
    line(1, T + 8000, "Bhar!", { role }), lineEnd(1, T + 8600), line(2, T + 9500, "Bhar!", { role }), lineEnd(2, T + 10100)]);
  assert.equal(of(run(page("cook:samosa", mk(null))), "contract-22").length, 1, "red: a plain line said twice");
  assert.equal(of(run(page("cook:samosa", mk("count"))), "contract-22").length, 0, "green: count lines are skipped");
});

test("contract-22: the request pop-up reads each person's order in their own words: the same line twice inside it is no repeat", () => {
  const tl = sorted([stage(T, ST), life(T, "stage-start", "cook:station"), C(T + 7000, "popup", { open: true }),
    line(1, T + 8000, "Muke chai khape."), lineEnd(1, T + 8600), line(2, T + 9500, "Muke chai khape."), lineEnd(2, T + 10100), C(T + 10600, "popup", { open: false })]);
  assert.equal(of(run(page("cook:chai-tray", tl)), "contract-22").length, 0);
  const outside = tl.filter((e) => e.k !== "popup");
  assert.equal(of(run(page("cook:chai-tray", outside)), "contract-22").length, 1, "red: the same two lines with no pop-up open");
});

test("contract-26: a tap through the pop-up ends the read-out on purpose; a to-record placeholder word on screen is never spoken", () => {
  const base = [stage(T, ST), C(T + 50, "popup", { open: true }), line(1, T + 100, "Muke bhar."), lineEnd(1, T + 1500), C(T + 2000, "popup", { open: false })];
  assert.equal(of(run(page("cook:chai-tray", sorted(base.slice()))), "contract-26").length, 1, "red: nothing said, nothing exempt");
  const tapped = sorted([...base, C(T + 120, "input", { x: 400, y: 300, on: "div", popup: true, side: false, next: false })]);
  assert.equal(of(run(page("mode:find", tapped)), "contract-26").length, 0, "green: tapped through");
  const ph = sorted([...base, C(T + 90, "texts", { list: [{ t: "Muke bhar", rec: true, en: false, grown: false, sel: "span" }] })]);
  assert.equal(of(run(page("mode:dress", ph)), "contract-26").length, 0, "green: the words are on screen as to-record placeholders");
});

test("contract-26 (w6L): the order said again as a tapped-through pop-up folds is the fold's saying, not the opening; an untapped pop-up still judges it", () => {
  // Find it, run ev-20261020-030207-6zl: the tap logged 10 ms before the pop-up (its event is a beat late), the first line cut by it, the same order said 3 ms before the fold, its clips cut
  const mk = (tap) => sorted([stage(T, ST), C(T + 50, "popup", { open: true }), line(1, T + 100, "Muke bhar."),
    ...(tap ? [C(T + 30, "input", { x: 400, y: 300, on: "div", popup: true, side: false, next: false })] : []),
    lineEnd(1, T + 600), line(2, T + 800, "Muke bhar."), lineEnd(2, T + 1300), C(T + 803, "popup", { open: false })]);
  assert.equal(of(run(page("mode:find", mk(true))), "contract-26").length, 0, "green: the saying at the fold after a tap through");
  assert.ok(of(run(page("mode:find", mk(false))), "contract-26").length >= 1, "red: nobody tapped, so the opening is judged whole");
});

test("contract-26 (w6L): a silent line that is mostly to-record placeholder words is a to-record line; a silent line of Kutchi words is still not heard", () => {
  const lex = new Set([...LEX, "nana", "dupatta"]);
  const rec = (t) => ({ t, rec: true, en: false, grown: false, sel: "span.ph" });
  const mk = (text, texts) => sorted([stage(T, ST), C(T + 50, "popup", { open: true }), C(T + 60, "texts", { list: texts }), line(1, T + 100, text), lineEnd(1, T + 160), C(T + 2000, "popup", { open: false })]);
  // Dress up, run ev-20261020-030207-6zl: "For Nana: blue dupatta." (For, blue, dupatta in grey italic; Nana a name)
  const dress = mk("For Nana: blue dupatta.", [rec("For"), { t: "Nana", rec: false, en: false, grown: false, sel: "span.wp-text" }, rec("blue"), rec("dupatta")]);
  assert.equal(of(run(page("mode:dress", dress), lex), "contract-26").length, 0, "green: three of four words are placeholders");
  const kutchi = mk("Muke chai khape.", []);
  assert.equal(of(run(page("cook:chai-tray", kutchi), lex), "contract-26").length, 1, "red: a Kutchi line that made no sound");
});

test("contract-35: a card at rest is judged, a peeking card (every word, contract-27) is not", () => {
  const rows = (t) => C(t, "rows", { list: [{ id: "r1", key: "k", text: "Muke dhania", done: false, en: false, no: false }] });
  const mk = (peek) => sorted([stage(T, ST), life(T, "stage-start", "cook:station"), C(T + 500, "side", { n: 1, rows: 1, done: 0, closed: 1, peek, dots: 0, words: [] }), rows(T + 600),
    C(T + 1000, "input", { x: 400, y: 300, on: "canvas", next: false, btn: null, popup: false, side: false, play: true })]);
  assert.ok(of(run(page("cook:chai-tray@L3", mk(0))), "contract-35").length >= 1, "red: every card closed at the first tap at L3");
  assert.equal(of(run(page("cook:chai-tray@L3", mk(1))), "contract-35").length, 0, "green: the card was peeking");
});
