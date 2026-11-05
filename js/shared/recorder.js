/*
 * The play recorder (Zafar, 5 Nov night: "is there a mode you can turn on that records what happens so you get a log to look
 * over?"): labs.html's "Record a play" switch (the save's shell flag recordPlay, set at each launch). Off, this file does nothing. On, a game page
 * keeps a timeline in memory: every Lifecycle note (lights, lessons, steps, the reveal lesson's choice), errors, and a compact
 * snapshot of the screen every 250 ms when it changes (Nani's line, what the game waits for, the order list's cards and scroll,
 * the dotted words and blurred pictures and whether each is in view, the lit box). A small "Save log" button in the bottom-left
 * corner saves it as a JSON file (the phone's share sheet where there is one), for the grown-up to send. Never in a store build.
 * Plain <script>: window.NjgRecorder.
 */
(function (root) {
  "use strict";
  // (the grown-up's switch is a flag on the player's save, set by labs.html at each launch: Save.flag("recordPlay"))
  // (the save is the core's module, ready a moment after this script: looked for every 200 ms for up to 15 s)
  const flagOn = () => {
    try {
      return root.Save && typeof root.Save.flag === "function" ? root.Save.flag("recordPlay") === true : null;
    } catch (e) {
      return false;
    }
  };
  if (root.NJG_BUILD === "store") return;
  const tWait = Date.now();
  const look = setInterval(() => {
    const f = flagOn();
    if (f === null && Date.now() - tWait < 15000) return;
    clearInterval(look);
    if (f) begin();
  }, 200);

  function begin() {
  const t0 = Date.now();
  const log = [];
  const MAX = 8000;
  const push = (k, d) => {
    log.push(Object.assign({ t: Date.now() - t0, k }, d));
    if (log.length > MAX) log.splice(0, log.length - MAX);
  };
  push("start", { url: root.location.href, ua: root.navigator.userAgent, w: root.innerWidth, h: root.innerHeight, dpr: root.devicePixelRatio });
  root.addEventListener("error", (e) => push("error", { msg: String(e.message || e), at: `${e.filename || ""}:${e.lineno || ""}` }));
  root.addEventListener("unhandledrejection", (e) => push("error", { msg: String((e.reason && (e.reason.stack || e.reason.message)) || e.reason) }));
  root.addEventListener("resize", () => push("resize", { w: root.innerWidth, h: root.innerHeight }));

  // every Lifecycle note (wrapped once it exists)
  let wrapped = false;
  const wrap = () => {
    const L = root.Lifecycle;
    if (wrapped || !L || typeof L.note !== "function") return;
    const orig = L.note;
    L.note = function (what, info) {
      try {
        push("note", { what: String(what), info: info && typeof info === "object" ? JSON.parse(JSON.stringify(info)) : info });
      } catch (e) {
        /* only a log */
      }
      return orig.apply(this, arguments);
    };
    wrapped = true;
  };

  const r4 = (q) => (q ? [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)] : null);
  const inList = (el, list) => {
    if (!el || !list) return false;
    const a = el.getBoundingClientRect();
    const m = list.getBoundingClientRect();
    return a.width > 1 && a.height > 1 && a.top >= m.top - 1 && a.bottom <= m.bottom + 1;
  };
  const snap = () => {
    const d = root.document;
    const list = d.querySelector("#mission");
    const guide = d.querySelector("#guide");
    const C = root.Cook;
    const cards = list ? [...list.querySelectorAll(".oc-card")].map((c) => `${c.dataset.who || "?"}${c.classList.contains("folded") ? "(f)" : ""}`).join(",") : "";
    const hidden = (sel) =>
      [...d.querySelectorAll(sel)].map((x) => {
        const card = x.closest(".oc-card");
        const vis = !!x.offsetParent && root.getComputedStyle(x).visibility !== "hidden";
        return `${card && card.dataset.who ? card.dataset.who : "?"}${card && card.classList.contains("folded") ? "(f)" : ""}:${vis ? "v" : "-"}${inList(x, list) ? "in" : "out"}${x.classList.contains("ob-dots-now") ? "*" : ""}`;
      });
    const lit = d.querySelector(".njg-onboard .ob-box");
    return {
      guide: guide ? guide.textContent.trim().slice(0, 60) : "",
      exp: C && C.expect ? JSON.stringify(C.expect).slice(0, 90) : "",
      lvl: C && C.save ? C.save.level || "" : "",
      np: !!(root.Onboard && root.Onboard.newPlayer && root.Onboard.newPlayer()),
      cards,
      st: list ? Math.round(list.scrollTop) : null,
      rows: list ? [...list.querySelectorAll(".oc-row14")].map((r) => Math.round(r.scrollLeft)).join(",") : "",
      dots: hidden("#mission .wc14-hide-en .wc14-en-dots, #mission .wc14-hide-k .wc14-k-dots, #mission .wc14-k .dots").join(" "),
      eyes: hidden("#mission .wc14-hide-pic .wc14-eye").join(" "),
      lit: lit && lit.style.display !== "none" ? [lit.getAttribute("x"), lit.getAttribute("y"), lit.getAttribute("width"), lit.getAttribute("height")].map((v) => Math.round(+v || 0)) : null,
      pop: !!d.querySelector(".wc14-pop, .njg-rq-card"),
    };
  };
  let last = "";
  setInterval(() => {
    wrap();
    try {
      const s = snap();
      const k = JSON.stringify(s);
      if (k !== last) {
        last = k;
        push("snap", s);
      }
    } catch (e) {
      /* only a log */
    }
  }, 250);

  // the "Save log" button (bottom-left; its taps never reach the game)
  const save = async () => {
    const name = `njg-log-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const text = JSON.stringify({ saved: new Date().toISOString(), entries: log }, null, 0);
    const blob = new Blob([text], { type: "application/json" });
    try {
      const file = new root.File([blob], name, { type: "application/json" });
      if (root.navigator.canShare && root.navigator.canShare({ files: [file] })) return void (await root.navigator.share({ files: [file], title: name }));
    } catch (e) {
      /* the share sheet refused: download instead */
    }
    const a = root.document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    root.document.body.appendChild(a);
    a.click();
    setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 1000);
  };
  const addButton = () => {
    const d = root.document;
    if (!d.body || d.getElementById("njg-rec")) return;
    const b = d.createElement("button");
    b.id = "njg-rec";
    b.type = "button";
    b.textContent = "● Save log";
    b.setAttribute("style", "position:fixed;left:6px;bottom:6px;z-index:2147483000;font:600 12px system-ui,sans-serif;padding:6px 10px;border-radius:14px;border:1px solid #b33;background:#fff;color:#b33;opacity:.85");
    const stop = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"].forEach((t) => b.addEventListener(t, stop, true));
    b.addEventListener("click", (e) => {
      stop(e);
      push("saved", {});
      save();
    }, true);
    d.body.appendChild(b);
  };
  if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", addButton);
  else addButton();
  root.NjgRecorder = { log, save, snap };
  }
})(typeof window !== "undefined" ? window : this);
