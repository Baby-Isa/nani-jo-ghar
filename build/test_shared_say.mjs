// Node tests for js/shared/say.js: the state machine, and the full moment
// on a tiny fake DOM with a fake recogniser: recognised first time, one
// miss then the retry, two misses then the pills, the timer, a rejected
// act, a refused mic, Grandparent mode's ✓, enrolment and the parent log.
// Run: node --test build/test_shared_say.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Say = require("../js/shared/say.js");

/* ---------------- a fake DOM, just enough for say.js ---------------- */
class El {
  constructor(tag, doc) {
    this.tagName = tag.toUpperCase();
    this.ownerDocument = doc;
    this.children = [];
    this.parent = null;
    this.attrs = {};
    this.className = "";
    this.textContent = "";
    this.innerHTML = "";
    this.hidden = false;
    this.handlers = {};
    const self = this;
    this.classList = {
      has: (c) => self.className.split(/\s+/).includes(c),
      add: (c) => !self.classList.has(c) && (self.className = (self.className + " " + c).trim()),
      remove: (c) => (self.className = self.className.split(/\s+/).filter((x) => x && x !== c).join(" ")),
      toggle: (c, on) => (on ? self.classList.add(c) : self.classList.remove(c)),
      contains: (c) => self.classList.has(c),
    };
  }
  set id(v) {
    this.attrs.id = v;
  }
  get id() {
    return this.attrs.id;
  }
  setAttribute(k, v) {
    this.attrs[k] = String(v);
  }
  getAttribute(k) {
    return this.attrs[k];
  }
  appendChild(c) {
    c.parent = this;
    this.children.push(c);
    return c;
  }
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this);
    this.parent = null;
  }
  addEventListener(ev, fn) {
    (this.handlers[ev] = this.handlers[ev] || []).push(fn);
  }
  click() {
    (this.handlers.click || []).forEach((f) => f({ target: this }));
  }
  *walk() {
    yield this;
    for (const c of this.children) yield* c.walk();
  }
  find(pred) {
    for (const e of this.walk()) if (pred(e)) return e;
    return null;
  }
}
function makeDoc() {
  const doc = {};
  doc.createElement = (t) => new El(t, doc);
  doc.head = new El("head", doc);
  doc.body = new El("body", doc);
  doc.getElementById = (id) => doc.head.find((e) => e.id === id) || doc.body.find((e) => e.id === id);
  return doc;
}
const q = {
  box: (doc) => doc.body.find((e) => e.classList.has("njg-say")),
  mic: (doc) => doc.body.find((e) => e.classList.has("mic")),
  pill: (doc, id) => doc.body.find((e) => e.getAttribute("data-choice") === id),
  parent: (doc, k) => doc.body.find((e) => e.getAttribute("data-parent") === k),
};
const tick = () => new Promise((r) => setTimeout(r, 0));

/* ---------------- a fake recogniser ---------------- */
function fakeSpeech(script, status = "ok") {
  const S = {
    calls: 0,
    log: [],
    confirmed: [],
    status: () => status,
    hasTemplates: () => true,
    cancel() {},
    listen() {
      const r = script[S.calls++];
      S.last = { result: { margin: r ? 0.8 : 0.05 } };
      return Promise.resolve(r === undefined ? null : r);
    },
    confirm(choice, by) {
      S.confirmed.push([choice, by]);
      return true;
    },
    logMoment(e) {
      S.log.push(e);
    },
  };
  return S;
}
const CH = ["cook-chai", "cook-dudh", "cook-khun"];

test("machine: recognised, missed, retried, pills, parent", () => {
  let M = Say.machine({ retries: 1 });
  M.start({ micOk: true });
  assert.equal(M.state.pillsLive, false);
  M.pill("x");
  assert.equal(M.state.phase, "ready", "faint pills can't be tapped before the fallback");
  M.micTap();
  M.heard(null);
  assert.equal(M.state.hint, true);
  assert.equal(M.state.pillsLive, false, "one miss: say it again");
  M.micTap();
  M.heard({ choice: "a", confidence: 0.2 });
  assert.equal(M.state.pillsLive, true, "second miss (low confidence): pills live");
  M.pill("a");
  assert.deepEqual([M.state.outcome.via, M.state.outcome.fallback, M.state.outcome.retried], ["pill", true, true]);

  M = Say.machine();
  M.start({ micOk: false });
  assert.equal(M.state.micShown, false);
  assert.equal(M.state.pillsLive, true);

  M = Say.machine({ expected: "b" });
  M.start({ micOk: true });
  M.parentOk();
  assert.deepEqual([M.state.outcome.choice, M.state.outcome.via], ["b", "parent"]);

  M = Say.machine();
  M.start({ micOk: true });
  M.parentOk();
  assert.equal(M.state.pillsLive, true, "no expected word: the parent taps which");
  M.pill("c");
  assert.equal(M.state.outcome.via, "parent");

  M = Say.machine();
  M.start({ micOk: true });
  M.micTap();
  M.heard({ choice: "a", confidence: 0.9 });
  M.rejected();
  assert.equal(M.state.misses, 1, "a rejected act is a miss");
  M.micTap();
  M.heard({ choice: "b", confidence: 0.9 });
  M.accepted();
  assert.deepEqual([M.state.outcome.choice, M.state.outcome.via, M.state.outcome.tries], ["b", "voice", 2]);
});

test("moment: recognised first time; the character hears and acts; enrolled and logged", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([{ choice: "cook-dudh", confidence: 0.9 }]);
  const seen = [];
  const ch = { listen: () => seen.push("listen"), heard: (c) => seen.push("heard:" + c), act: (c, v) => seen.push(`act:${c}:${v}`), done: () => seen.push("done") };
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, character: ch, mode: "cook", pillsAfterMs: 0 });
  assert.ok(q.box(doc), "panel shown");
  assert.equal(q.mic(doc).hidden, false);
  q.mic(doc).click();
  assert.ok(q.box(doc).classList.has("listening"));
  assert.equal(Say.isListening(), true);
  const out = await p;
  assert.deepEqual([out.choice, out.via, out.tries, out.enrolled], ["cook-dudh", "voice", 1, true]);
  assert.deepEqual(seen, ["listen", "heard:cook-dudh", "act:cook-dudh:voice", "done"]);
  assert.deepEqual(S.confirmed, [["cook-dudh", "game"]]);
  assert.equal(S.log[0].via, "voice");
  assert.equal(S.log[0].mode, "cook");
  assert.equal(q.box(doc), null, "panel removed");
  assert.equal(Say.isListening(), false);
});

test("moment: one miss gets a 'say it again', the retry lands", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([null, { choice: "cook-chai", confidence: 0.7 }]);
  const misses = [];
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, character: { miss: (n) => misses.push(n) }, pillsAfterMs: 0 });
  q.mic(doc).click();
  await tick();
  assert.deepEqual(misses, [1]);
  assert.ok(q.box(doc).classList.has("hint"));
  assert.ok(!q.box(doc).classList.has("live"));
  q.mic(doc).click();
  const out = await p;
  assert.deepEqual([out.choice, out.via, out.retried], ["cook-chai", "voice", true]);
});

test("moment: two misses and the pills go live; a pill finishes it and the character acts", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([null, null]);
  const acts = [];
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, character: { act: (c, v) => acts.push(`${c}:${v}`) }, pillsAfterMs: 0 });
  q.mic(doc).click();
  await tick();
  q.pill(doc, "cook-khun").click();
  await tick();
  assert.ok(q.box(doc), "still open: pills not live after one miss");
  q.mic(doc).click();
  await tick();
  assert.ok(q.box(doc).classList.has("live"));
  q.pill(doc, "cook-khun").click();
  const out = await p;
  assert.deepEqual([out.choice, out.via, out.fallback], ["cook-khun", "pill", true]);
  assert.deepEqual(acts, ["cook-khun:pill"]);
  assert.deepEqual(S.confirmed, [], "a pill tap never enrols");
});

test("moment: the timer makes the pills live without any listening", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([]);
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, pillsAfterMs: 5 });
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(q.box(doc).classList.has("live"));
  q.pill(doc, "cook-chai").click();
  assert.equal((await p).via, "pill");
  assert.equal(S.calls, 0);
});

test("moment: the mode rejects a wrong act; it counts as a miss", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([{ choice: "cook-chai", confidence: 0.9 }, { choice: "cook-dudh", confidence: 0.9 }]);
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, accept: (c) => c === "cook-dudh", pillsAfterMs: 0 });
  q.mic(doc).click();
  await tick();
  await tick();
  assert.ok(q.box(doc), "still open after the wrong act");
  q.mic(doc).click();
  const out = await p;
  assert.deepEqual([out.choice, out.via, out.tries], ["cook-dudh", "voice", 2]);
});

test("moment: a refused mic hides the button and the pills are live from the start", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([], "refused");
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, pillsAfterMs: 0 });
  assert.equal(q.mic(doc).hidden, true);
  assert.ok(q.box(doc).classList.has("live"));
  q.pill(doc, "cook-dudh").click();
  assert.equal((await p).via, "pill");
  // no recogniser at all: the same
  const doc2 = makeDoc();
  const p2 = Say.moment({ choices: CH, container: doc2.body, speech: null, pillsAfterMs: 0 });
  assert.equal(q.mic(doc2).hidden, true);
  q.pill(doc2, "cook-chai").click();
  assert.equal((await p2).choice, "cook-chai");
});

test("moment: Grandparent mode's ✓ confirms the expected word and enrols the take", async () => {
  const doc = makeDoc();
  const S = fakeSpeech([null]);
  const p = Say.moment({ choices: CH, container: doc.body, speech: S, grandparent: true, expected: "cook-khun", pillsAfterMs: 0 });
  q.mic(doc).click();
  await tick();
  q.parent(doc, "ok").click();
  const out = await p;
  assert.deepEqual([out.choice, out.via, out.enrolled], ["cook-khun", "parent", true]);
  assert.deepEqual(S.confirmed, [["cook-khun", "parent"]]);
  // without an expected word the parent's ✓ arms the pills
  const doc2 = makeDoc();
  const p2 = Say.moment({ choices: CH, container: doc2.body, speech: fakeSpeech([]), grandparent: true, pillsAfterMs: 0 });
  q.parent(doc2, "ok").click();
  q.pill(doc2, "cook-dudh").click();
  assert.deepEqual([(await p2).choice, (await p2).via], ["cook-dudh", "parent"]);
});

test("tell: the Who did it / Find it names work; cancel resolves as a skip", async () => {
  const doc = makeDoc();
  const heard = [];
  const p = Say.tell({ choices: CH, container: doc.body, speech: fakeSpeech([{ choice: "cook-chai", confidence: 1 }]), actor: { act: (c) => heard.push(c) }, onHeard: (o) => heard.push(o.via), pillsAfterMs: 0 });
  q.mic(doc).click();
  await p;
  assert.deepEqual(heard, ["cook-chai", "voice"]);
  const doc2 = makeDoc();
  const p2 = Say.moment({ choices: CH, container: doc2.body, speech: fakeSpeech([]), pillsAfterMs: 0 });
  p2.cancel();
  assert.equal((await p2).via, "skip");
});
