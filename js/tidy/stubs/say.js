/*
 * STUB. Same-API stand-in for the foundation's `say` speaking moment (the
 * closed set, the listen, the pill fallback, the parent's tick; D.4). It
 * CALLS the real recogniser, js/shared/speech.js (never a copy):
 *
 *   Tidy.Say.moment({ask, choices, answer, timeoutMs, parent})
 *     -> Promise<{choice, by: "voice" | "pill" | "parent"}>
 *
 * The mic listens for one of `choices` (3-8 word ids) with
 * Speech.listen({choices, timeoutMs}); a null, or a confidence under the
 * data threshold (mechanics.tell.confidence), shows the pills, never a
 * miss. Pills are audio only (a speaker each: tap to hear it and pick it),
 * so a non-reader can't match the letters. In Grandparent mode a parent
 * can tick "did they say it?" instead. Nothing ever blocks: the pills are
 * always there when the mic can't be used (no microphone, no family
 * recordings for these words yet, or the lab's "voice off").
 */
(function (global) {
  const Tidy = (global.Tidy = global.Tidy || {});
  const $ = (s) => document.querySelector(s);
  const Say = (Tidy.Say = { voiceOff: false, loaded: {} });

  /** The family's recordings of these words become the recogniser's templates (once each). */
  Say.load = async function (choices) {
    const S = global.Speech;
    if (!S) return;
    await Promise.all(
      choices.map((id) => {
        if (Say.loaded[id] || !global.Cook.hasAudio(id)) return null;
        Say.loaded[id] = true;
        return S.loadTemplates(id, [`assets/audio/word/${id}.mp3`]).catch(() => null);
      })
    );
  };
  Say.canListen = (choices) =>
    !Say.voiceOff && !!global.Speech && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && global.Speech.hasTemplates(choices);
  Say.listen = async function (choices, timeoutMs) {
    try {
      await Say.load(choices);
      if (!Say.canListen(choices)) return null;
      return await global.Speech.listen({ choices, timeoutMs });
    } catch (e) {
      return null;
    }
  };

  Say.moment = function ({ ask, choices, answer, timeoutMs = 4000, parent = false, threshold }) {
    const box = $("#speak");
    const pills = $(".sp-pills", box);
    const state = $(".sp-state", box);
    const mic = $(".sp-mic", box);
    const par = $(".sp-parent", box);
    const min = threshold != null ? threshold : ((Tidy.Mech && Tidy.Mech.knobs("tell", 1)) || {}).confidence || 0.5;
    $(".sp-ask", box).innerHTML = ask ? Tidy.html(ask, { reveal: true }) : "";
    mic.innerHTML = Tidy.ICON.mic;
    pills.innerHTML = "";
    state.textContent = "";
    box.classList.remove("hidden");
    return new Promise((resolve) => {
      const finish = (choice, by) => {
        box.classList.add("hidden");
        Tidy.expect({ what: "said", choice, by });
        mic.onclick = null;
        resolve({ choice, by });
      };
      let picked = null;
      const showPills = (why) => {
        state.textContent = why || "Tap the one you'd say";
        pills.innerHTML = "";
        const order = Tidy.Rules.util.shuffle(Math.random, choices);
        order.forEach((id) => {
          const b = document.createElement("button");
          b.type = "button";
          b.innerHTML = Tidy.ICON.speaker;
          b.dataset.choice = id;
          b.setAttribute("aria-label", "Hear this one");
          b.onclick = () => {
            picked = id;
            pills.querySelectorAll("button[data-choice]").forEach((x) => x.classList.toggle("picked", x === b));
            Tidy.speakWord(id);
            go.classList.remove("hidden");
          };
          pills.appendChild(b);
        });
        const go = document.createElement("button");
        go.type = "button";
        go.className = "go hidden";
        go.textContent = "That one";
        go.onclick = () => picked && finish(picked, "pill");
        pills.appendChild(go);
        Tidy.expect({ what: "speak", answer, choices: order });
      };
      par.classList.toggle("hidden", !parent);
      $(".yes", par).onclick = () => finish(answer, "parent");
      $(".no", par).onclick = () => showPills("Tap the one they meant");
      const usable = !Say.voiceOff && !!global.Speech && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      mic.classList.toggle("hidden", !usable);
      if (!usable) return showPills();
      state.textContent = "Tap the mic and say it";
      Tidy.expect({ what: "speak", answer, choices, mic: true });
      // the pills are one tap away at any time: never blocked on the mic
      const later = document.createElement("button");
      later.type = "button";
      later.className = "btn";
      later.textContent = "Tap instead";
      later.onclick = () => showPills();
      pills.appendChild(later);
      mic.onclick = async () => {
        mic.classList.add("listening");
        state.textContent = "Listening…";
        const r = await Say.listen(choices, timeoutMs);
        mic.classList.remove("listening");
        if (r && r.choice && r.confidence >= min) return finish(r.choice, "voice");
        showPills(r ? "Nearly! Tap the one you said" : "Which one?");
      };
    });
  };
})(window);
