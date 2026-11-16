// MAA-28's page hook (run16 fix-chai): injected by build/tools/review/maa28.mjs through run.mjs's NJG_INIT. It films the side
// panel's item cards (#mission .oc-it14) every 80 ms and reports through console.error, which the sandbox keeps as the page's errors:
//   "MAA-28 FAIL card <key>: ..."  an item card's word or picture changed (the row: "a person's item cards never change")
//   "MAA-28 FAIL slot <who>#<n>: ..."  from the serve on (else the well done), a place in a person's row shows another card than it
//                                  showed then (the bajr card slid out and 'ba nindhi maani' took its place: what Fable saw)
//   "MAA-28 FAIL open <who>: ..."  1.5 s after the well done a person's row still shows item cards: its slots can still re-sort and
//                                  show another card than the one played (the row's taken fix, decision 38: the card folds as chai's)
//   "MAA-28 seen ..."              the well done came and was judged (no line: the check never reached it)
(() => {
  if (window.__maa28) return;
  window.__maa28 = true;
  // (the sandbox keeps 200 characters of a console line: long lines go in pieces)
  const say = (s) => { try { for (let i = 0; i < s.length; i += 190) console.error((i ? "MAA-28 ... " : "") + s.slice(i, i + 190)); } catch (e) { /* none */ } };
  // a picture is told by what it shows, not its address (the kit swaps a file's URL for a data URL of the same picture): the mean
  // colour of its opaque pixels (dark millet maani against pale wheat), null while it loads
  const cv = document.createElement("canvas");
  cv.width = cv.height = 16;
  const memo = new Map();
  const colour = (im) => {
    const src = im.currentSrc || im.src || "";
    if (memo.has(src)) return memo.get(src);
    if (!im.complete || !im.naturalWidth) return null;
    let out = null;
    try {
      const g = cv.getContext("2d", { willReadFrequently: true });
      g.clearRect(0, 0, 16, 16);
      g.drawImage(im, 0, 0, 16, 16);
      const d = g.getImageData(0, 0, 16, 16).data;
      let r = 0, gg = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; }
      out = n ? [r / n, gg / n, b / n].map(Math.round) : [0, 0, 0];
    } catch (e) { out = null; }
    if (out) memo.set(src, out);
    return out;
  };
  const sig = (el) => {
    const w = el.querySelector(".wc14-k, .wc-k");
    const im = el.querySelector(".wc14-pic img");
    return { word: ((w && w.textContent) || "").replace(/\s+/g, " ").trim(), pic: im ? colour(im) : null };
  };
  const same = (a, b) => a.word === b.word && (!a.pic || !b.pic || a.pic.every((v, i) => Math.abs(v - b.pic[i]) <= 24));
  const txt = (s) => `${s.word} | ${s.pic ? "rgb(" + s.pic.join(",") + ")" : "loading"}`;
  // shown: inside #mission's box and its own row's box by at least half its width, drawn (no zero opacity on the way up)
  const shown = (el, clip) => {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    const row = el.closest(".oc-row14") || el.parentElement;
    const rr = row.getBoundingClientRect();
    const l = Math.max(r.left, rr.left, clip.left), rt = Math.min(r.right, rr.right, clip.right);
    const t = Math.max(r.top, rr.top, clip.top), b = Math.min(r.bottom, rr.bottom, clip.bottom);
    if (rt - l < r.width * 0.5 || b - t < r.height * 0.5) return false;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false;
    }
    return true;
  };
  const seenSig = new Map();
  const failed = new Set();
  let praiseAt = 0, judged = false, samples = 0, base = null, atPraise = null, baseAt = 0, baseWhy = "", last = {};
  // the serve: the kitchen glides down to the service view (js/cook/serve.js, Lifecycle "serve-view" serving), the review's faces
  // and their Shabash come next (Fable's "well done" frame, sidebyside's praise moment, is that Shabash)
  const served = () => {
    const L = window.Lifecycle && window.Lifecycle.log;
    return Array.isArray(L) && L.some((x) => x && x.what === "serve-view" && x.step === "serving");
  };
  const fail = (k, s) => { if (failed.has(k)) return; failed.add(k); say(s); };
  const sample = () => {
    const m = document.querySelector("#mission");
    if (!m) return;
    const clip = m.getBoundingClientRect();
    samples++;
    const open = {};
    m.querySelectorAll(".oc-card").forEach((c, ci) => {
      const who = c.dataset.who || "card" + ci;
      c.querySelectorAll(".oc-it14").forEach((el) => {
        if (!el.dataset.key) return;
        const k = who + "/" + el.dataset.key;
        const s = sig(el);
        if (!/\S/.test(s.word)) return; // (a card waiting to be said: no word yet)
        const was = seenSig.get(k);
        if (was == null || (!was.pic && s.pic && was.word === s.word)) seenSig.set(k, s);
        else if (!same(was, s)) fail("card " + k, `MAA-28 FAIL card ${k}: was "${txt(was)}", now "${txt(s)}" (${innerWidth}x${innerHeight})`);
        if (shown(el, clip)) (open[who] = open[who] || []).push({ k, s: txt(s), x: el.getBoundingClientRect().left });
      });
    });
    Object.values(open).forEach((l) => l.sort((a, b) => a.x - b.x));
    if (!base && served()) { base = last; baseAt = Date.now(); baseWhy = "the serve"; }
    last = open;
    // from the serve (else the well done) on, each place in a person's row shows the card it showed then, or nothing (folded away):
    // never another, until 6 s after the well done
    if (base && (!praiseAt || Date.now() - praiseAt < 6000)) {
      Object.entries(open).forEach(([who, list]) => list.forEach((c, i) => {
        const b = (base[who] || [])[i];
        if (!b || b.k !== c.k) fail("slot " + who + i, `MAA-28 FAIL slot ${who}#${i + 1}: at ${baseWhy} "${b ? b.s : "(no card)"}", ${Date.now() - baseAt} ms later "${c.s}"${praiseAt ? ` (${Date.now() - praiseAt} ms after the well done)` : ""} (${innerWidth}x${innerHeight})`);
      }));
    }
    if (praiseAt && !judged && Date.now() - praiseAt > 1500) {
      judged = true;
      Object.entries(open).forEach(([who, list]) => fail("open " + who, `MAA-28 FAIL open ${who}: 1.5 s after the well done the row still shows ${list.length} card(s): ${list.map((c) => c.s).join(" ; ")} (${innerWidth}x${innerHeight})`));
      const rows = (o) => Object.entries(o || {}).map(([w, l]) => `${w}[${l.map((c) => c.k.split("/")[1]).join(",")}]`).join(" ") || "none";
      say(`MAA-28 seen well done at ${innerWidth}x${innerHeight}: ${samples} samples, ${seenSig.size} cards, ${failed.size} fail(s)`);
      say(`MAA-28 rows at ${baseWhy}: ${rows(base)}`.slice(0, 190));
      say(`MAA-28 rows at the well done: ${rows(atPraise)}`.slice(0, 190));
    }
  };
  setInterval(sample, 80);
  // the well done: Cook.UI.guidePraise (js/cook/ui.js, SH-252), called by every kitchen game's serve
  const wrap = setInterval(() => {
    const UI = window.Cook && window.Cook.UI;
    if (!UI || typeof UI.guidePraise !== "function" || UI.guidePraise.__maa28) return;
    const f = UI.guidePraise;
    UI.guidePraise = function () {
      if (!praiseAt) { sample(); atPraise = last; if (!base) { base = last; baseAt = Date.now(); baseWhy = "the well done"; } praiseAt = Date.now(); }
      return f.apply(this, arguments);
    };
    UI.guidePraise.__maa28 = true;
  }, 50);
  setTimeout(() => clearInterval(wrap), 600000);
})();
