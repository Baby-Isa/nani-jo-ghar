/*
 * STUB: a local copy of the shared speaking moment, `say` (design D.3),
 * until js/shared/mechanics/say.js lands. Same shape as every mode's role
 * reversal: a mic button (listening must start from a tap: iOS), the
 * closed set, Nani silent while the mic is open, the pills fallback, the
 * parent's tick. It never blocks and never punishes: a null is a shrug.
 *
 *   Monsoon.Say.prepare(choices)     load the closed set's templates
 *   Monsoon.Say.open({choices, target, timeoutMs, drizzle, onAnswer, onNull})
 *     -> {close(), pill(id)}
 *   onAnswer({said, via: "voice" | "pill" | "parent", ok?})
 *
 * The pills are audio-only word buttons (tap the speaker to hear one, tap
 * "call it" to send it); their text shows only for words at stage 3+.
 * Swap: replace Monsoon.Listen.listen below with the shared call.
 */
(function (global) {
  const M = global.Monsoon;
  const Say = (M.Say = {});
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  Say.prepare = (choices) => M.Listen.prepare(choices);

  Say.open = function (opts) {
    const box = $("#speak");
    const mic = box.querySelector(".mic");
    const status = box.querySelector(".mic-status");
    const pills = box.querySelector(".pills");
    const parent = box.querySelector(".parent-ok");
    let closed = false;
    let listening = false;
    box.classList.remove("hidden");
    pills.classList.add("hidden");
    parent.classList.add("hidden");
    status.textContent = "Tap the mic and say the pot's name";
    mic.disabled = false;
    mic.classList.remove("on");

    const showPills = () => {
      pills.innerHTML = "";
      opts.choices.forEach((id) => {
        const w = M.words[id] || {};
        const text = M.stageOf(id) >= 3 ? (w.kutchi ? `<span class="k">${esc(w.kutchi)}</span>` : `<span class="ph">${esc(w.english)}</span>`) : "";
        const row = document.createElement("div");
        row.className = "pill";
        row.innerHTML = `<button type="button" class="p-hear" aria-label="Hear it">${M.UI.ICON.speaker}</button>${text}<button type="button" class="p-send">call it</button>`;
        row.dataset.w = id;
        row.querySelector(".p-hear").addEventListener("click", () => M.say({ word: id }));
        row.querySelector(".p-send").addEventListener("click", () => ctl.pill(id));
        pills.appendChild(row);
      });
      pills.classList.remove("hidden");
    };

    const onMic = async () => {
      if (closed || listening) return;
      M.clock.unlock && M.clock.unlock();
      listening = true;
      M.listening = true; // Nani is silent while the mic is open
      if (Cook.stopVoice) Cook.stopVoice();
      mic.classList.add("on");
      status.textContent = "Listening…";
      let r = null;
      try {
        r = await M.Listen.listen({ choices: opts.choices, target: opts.target, timeoutMs: opts.timeoutMs, onState: (s) => s === "speaking" && (status.textContent = "…") });
      } catch (e) {
        r = null;
      }
      listening = false;
      M.listening = false;
      mic.classList.remove("on");
      if (closed) return;
      if (r && r.choice) {
        status.textContent = "";
        opts.onAnswer({ said: r.choice, via: "voice", confidence: r.confidence });
      } else {
        // never blocks: the pills, and a parent can tick that it was said
        status.textContent = "Didn't catch that";
        opts.onAnswer({ said: null, via: "voice" });
        opts.onNull && opts.onNull();
        showPills();
        parent.classList.remove("hidden");
      }
    };
    const onParent = () => !closed && opts.onAnswer({ via: "parent", ok: true, said: opts.target });
    mic.onclick = onMic;
    parent.onclick = onParent;

    const ctl = {
      mic: onMic,
      pill(id) {
        if (closed) return;
        opts.onAnswer({ said: id, via: "pill" });
      },
      close() {
        if (closed) return;
        closed = true;
        M.listening = false;
        box.classList.add("hidden");
        mic.onclick = null;
        parent.onclick = null;
        pills.innerHTML = "";
      },
    };
    Say.current = ctl;
    return ctl;
  };
})(window);
