/*
 * Snap mechanic: Ali's camera, the role reversal (docs/modes/snap-design.md
 * D2 G4, D4). NEW. Ali holds the camera (D9.3); the child directs him.
 *
 * For each of Ali's rows: a picture card of the shot wanted (no text: that
 * many of that fruit, drawn from the orchard's own sprites). The child taps
 * the microphone and says it; Snap.listen() (js/shared/speech.js through
 * js/snap/adapters.js) picks the closest of the closed set:
 *   level 1 (design level 2): the fruit in the orchard (3-6 words); the
 *     count is Ali's, from the card, not tested;
 *   level 2 (design level 3): two listens, the number (hikdo..panj), then the fruit.
 * Ali says what he heard, swings the viewfinder to it and shoots. A wrong
 * hearing makes a funny wrong print ("Arre re, Ali!"), and the child can say
 * it again while there's spare film. His prints go in the tray and are
 * handed in like any other; his mistakes never touch the ear star.
 *
 * Never blocked: a null, or two unsure results, bring up the word pills
 * (speaker + text by word stage) and a grown-up's "Did they say it?" tick;
 * after waitMs with no try, Ali asks "Which one?" once, then the pills. A
 * pill tap moves the round on and credits nothing. Voice star: every said
 * row recognised or ticked, with at least minSaid said rows.
 *
 * Settings (data/snap.json mechanics.ali-camera.levels): timeoutMs,
 * lowConfidence, unsureTries, waitMs, minSaid.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const UI = Cook.UI;
  const Snap = global.Snap;
  const Photo = Snap.Photo;
  const Sim = Snap.Sim;
  const $ = (s) => document.querySelector(s);

  const A = (Snap.AliCamera = {});
  Snap.Mech.define("ali-camera", { run: (round) => A.run(round) });

  /** The picture card: n of the fruit, no words. */
  function drawCard(row) {
    const pic = $("#ali .ali-pic");
    pic.innerHTML = Array.from({ length: row.n }, () => `<img src="${Snap.picture(row.noun)}" alt="">`).join("");
    pic.dataset.n = row.n;
    pic.dataset.kind = row.noun;
  }
  const hideKnown = (id) => Cook.cardHidden(id) && Lang.wordHasVoice(id);

  /**
   * One word from the child: spoken (recognised), a pill, or a grown-up's tick.
   * -> { id, spoken, parent }
   */
  function hearOne(round, choices, target) {
    const k = round.K.ali;
    const mic = $("#ali-mic");
    const pills = $("#ali .ali-pills");
    const judge = $("#ali .ali-judge");
    pills.classList.add("hidden");
    judge.classList.add("hidden");
    pills.innerHTML = "";
    let unsure = 0;
    let asked = false;
    return new Promise((resolve) => {
      let done = false;
      let timer = null;
      const finish = (v) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        mic.onclick = null;
        $("#ali-yes").onclick = $("#ali-again").onclick = null;
        mic.classList.remove("on");
        A.state = null;
        resolve(v);
      };
      const showPills = () => {
        A.state = "pills";
        pills.classList.remove("hidden");
        judge.classList.remove("hidden");
        if (pills.childElementCount) return;
        Cook.shuffle(choices).forEach((id) => {
          const b = document.createElement("div");
          b.className = "ali-pill";
          b.dataset.w = id;
          b.setAttribute("role", "button");
          b.appendChild(UI.pill(Lang.wordLine(id), { hide: hideKnown, noTranslate: true }));
          b.addEventListener("click", (ev) => {
            if (ev.target.closest(".wp-say")) return;
            Cook.sfx.pop();
            finish({ id, spoken: false, parent: false });
          });
          pills.appendChild(b);
        });
      };
      const wait = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (done || !round.alive()) return;
          if (!asked) {
            asked = true;
            Snap.sayLater("ali", Lang.line("snap-which"));
            wait();
          } else showPills();
        }, k.waitMs / Cook.speed);
      };
      A.state = "mic";
      mic.onclick = async () => {
        if (done || mic.classList.contains("on")) return;
        clearTimeout(timer);
        Cook.unlockAudio();
        mic.classList.add("on");
        const res = await Snap.listen({ choices, timeoutMs: k.timeoutMs, target });
        mic.classList.remove("on");
        if (done || !round.alive()) return;
        if (res && res.choice && res.confidence >= k.lowConfidence) return finish({ id: res.choice, spoken: true, parent: false });
        unsure++;
        if (!res || unsure >= k.unsureTries) showPills();
        else wait();
      };
      // the grown-up's judgement: they said the card's word
      $("#ali-yes").onclick = () => finish({ id: target, spoken: true, parent: true });
      $("#ali-again").onclick = () => {
        judge.classList.add("hidden");
        pills.classList.add("hidden");
        unsure = 0;
        wait();
      };
      wait();
    });
  }

  A.run = async function (round) {
    const K = round.K;
    const vf = round.vf;
    const el = $("#ali");
    const aliRows = round.rows.filter((r) => r.ali);
    const nouns = round.lay.kinds;
    const nums = [];
    for (let n = K.counts[0]; n <= K.counts[1]; n++) nums.push(Cook.numId(n));
    const listens = K.listen || ["noun"];
    vf.root.classList.remove("hidden");
    vf.layout();
    el.classList.remove("hidden");
    try {
      await Snap.say("ali", Lang.line("snap-ali"), { ms: 1200 });
      for (const r of aliRows) {
        A.row = r;
        drawCard(r.row);
        el.classList.remove("done");
        let rec = null;
        // film to keep for the rows still to come (Ali's later ones and all the child's own)
        const keep = () => round.rows.filter((x) => (x.ali && x.i > r.i) || !x.ali).length;
        for (let attempt = 0; vf.film > keep(); attempt++) {
          if (!round.alive()) throw new Cook.Abort();
          Snap.sayLater("nani", Lang.line("snap-tellali"));
          let n = r.row.n;
          let spoken = true;
          let parent = false;
          if (listens.includes("number")) {
            const h = await hearOne(round, nums, Cook.numId(r.row.n));
            n = Number(Object.keys(Cook.data.grammar.numbers).find((k) => Cook.data.grammar.numbers[k] === h.id)) || r.row.n;
            spoken = h.spoken;
            parent = h.parent;
          }
          const h = await hearOne(round, nouns, r.row.noun);
          spoken = spoken && h.spoken;
          parent = parent || h.parent;
          if (attempt === 0) rec = { target: r.row.noun, heard: spoken ? h.id : null, parent, spoken };
          // Ali says what he heard, swings the camera to it and shoots
          await Snap.say("ali", Lang.join([Lang.bare(Lang.phrase(listens.includes("number") ? [n, h.id] : [h.id])), Lang.line("here")]), { ms: 900 });
          const f = Sim.aliFrame(round.lay, K, h.id, n);
          if (!f) break;
          vf.setView(f.cx, f.cy, K.vf.zooms.indexOf(f.zoom));
          await Cook.wait(450);
          vf.enable(true);
          const shot = vf.shutter();
          vf.enable(false);
          if (!shot) break;
          round.prints[round.prints.length - 1].by = "ali";
          round.prints[round.prints.length - 1].el.classList.add("by-ali");
          await Cook.wait(500);
          if (Photo.matches(shot.print, r.row, K.photo).ok) break;
          Snap.sayLater("nani", Lang.join([Lang.line("oops")]));
          await Cook.wait(900);
        }
        if (rec && rec.spoken) round.said.push(rec);
        el.classList.add("done");
      }
    } finally {
      el.classList.add("hidden");
      A.row = null;
      A.state = null;
    }
  };
})(window);
