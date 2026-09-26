/*
 * Stage 2, diagnosis: "Where does it hurt?" (docs/modes/clinic-design.md P3,
 * Q3, Q5). The patient on the examination bench, symmetrical, hands in lap.
 *   D1  (the first sessions; taught): 3 parts pulse; tap one; the doctor asks
 *       [Does it hurt here?]; the patient says haa / nar; on haa the swirl,
 *       [My knee], and the Found it button lights.
 *   D1b (level 2): the same, graded: Found it on haa, Next on nar.
 *   D2  the patient says [My knee hurts] ([My left knee] at level 3); tap it.
 *   D3  (level 2+): the doctor calls a tool and a part; tap the tool, then the
 *       part; the find shows only at the sore one.
 * Then the doctor names the ailment and says the prescription (P1's seam).
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;
  const PL = () => global.ClinicPipeline;

  const FINDS = { hand: "👀", torch: "✨", stethoscope: "〰️", thermometer: "🔥" };

  S.diagnosis = {
    async run(env, plan) {
      const { screen, data } = env;
      const res = S.result("diagnosis");
      const stage = S.room(screen, "exam");
      stage.dataset.variant = plan.variant;
      const layer = h("div", "cl-patient-layer", stage);
      const fig = env.fig;
      layer.appendChild(fig.el);
      fig.pose("sit");
      fig.react("idle", 0);
      fig.swirl(plan.part, plan.side, false);
      Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;
      const top = h("div", "cl-fx", stage);
      const at = (part, side) => fig.hotspot(part, side, stage);
      const tapPart = (e, active) => fig.partAt(e.clientX, e.clientY, { active: active || data.parts[plan.level] || data.parts[3] });
      const partW = (p) => ({ english: data.part_words[p] || p });

      if (plan.variant === "D1" || plan.variant === "D1b") await d1(env, plan, res, { stage, top, fig, at });
      else if (plan.variant === "D2") await d2(env, plan, res, { stage, fig, tapPart, partW });
      else await d3(env, plan, res, { stage, top, fig, at, tapPart });

      // the doctor names the ailment and says the prescription (the seam into the pharmacy)
      S.current = null;
      fig.swirl(plan.part, plan.side, true);
      await S.say(plan.name, "doctor");
      const btn = await S.button(screen, { kutchi: "[To the counter]", english: "To the counter" });
      void btn;
      res.words.push({ kutchi: null, english: data.part_words[plan.part] || plan.part });
      void h;
      return res;
    },
  };

  async function d1(env, plan, res, { stage, top, fig, at }) {
    const { screen, data } = env;
    const graded = plan.variant === "D1b";
    const row = plan.rows[0];
    await S.request(screen, { title: "", rows: plan.card });
    const dots = plan.probes.map((p) => {
      const side = p === plan.part ? plan.side : data.sided.includes(p) ? (env.rng() < 0.5 ? "left" : "right") : null;
      const d = h("button", "cl-probe", top);
      d.type = "button";
      d.dataset.part = p;
      const place = () => {
        const q = at(p, side);
        d.style.left = `${q.x}px`;
        d.style.top = `${q.y}px`;
      };
      place();
      return { el: d, part: p, side, place, done: false };
    });
    const onResize = () => dots.forEach((d) => d.place());
    global.addEventListener("resize", onResize);
    let busy = false;
    let finish;
    const done = new Promise((r) => (finish = r));
    const acts = [];
    let lastAnswer = null;
    let current = null;
    const act = (which) => {
      if (!current || busy) return;
      acts.push(PL().judgeProbe(plan, current.part, which));
      if (which === "found") {
        if (graded) res.judge(row, acts.every(Boolean));
        dots.forEach((x) => x.el.remove());
        finish();
      } else {
        current.el.classList.add("done");
        current = null;
        armButtons(false);
      }
    };
    const found = screen.go(S.line(env, "found"), () => act("found"));
    found.dataset.act = "found";
    const next = graded ? screen.go(S.line(env, "next"), () => act("next"), "alt") : null;
    if (next) next.dataset.act = "next";
    const armButtons = (on) => {
      found.disabled = !on;
      found.classList.toggle("throb", on && !graded);
      if (next) next.disabled = !on;
    };
    armButtons(false);
    S.setExpect("diagnosis", () => {
      if (current && !found.disabled) {
        const a2 = lastAnswer === "haa" ? "found" : "next";
        return { stage: "diagnosis", kind: "act", act: a2, target: `.cl-go[data-act="${a2}"]`, wrong: `.cl-go[data-act="${a2 === "found" ? "next" : "found"}"]` };
      }
      if (busy) return { stage: "diagnosis", kind: "wait" };
      const d = dots.find((x) => x.part === plan.part);
      return { stage: "diagnosis", kind: "tap", target: `.cl-probe[data-part="${d.part}"]`, wrong: `.cl-probe:not([data-part="${d.part}"]):not(.done)` };
    });
    dots.forEach((d) => {
      d.el.addEventListener("click", async () => {
        if (busy) return;
        busy = true;
        current = d;
        armButtons(false);
        dots.forEach((x) => x.el.classList.remove("sel"));
        d.el.classList.add("sel");
        S.signal("clinic-probe");
        await S.say(S.line(env, "here"), "doctor");
        const yes = d.part === plan.part;
        lastAnswer = yes ? "haa" : "nar";
        fig.react("idle", 0);
        await S.say(S.line(env, lastAnswer), "patient");
        if (yes) {
          if (global.Sfx && global.Sfx.bing) try { global.Sfx.bing(); } catch (e) { /* no sound */ }
          fig.swirl(plan.part, plan.side, true);
          await S.say({ kutchi: `[My ${data.part_words[plan.part]}]`, english: `My ${data.part_words[plan.part]}` }, "patient");
        }
        busy = false;
        if (graded || yes) armButtons(true);
      });
    });
    if (env.first) S.onboard(env, "diagnosis", [{ spotlight: () => dots.find((x) => x.part === plan.part).el, ghost: { gesture: "tap" }, wait: "clinic-probe" }]);
    await done;
    global.removeEventListener("resize", onResize);
    screen.card.tick("probe");
    screen.clearActions();
  }

  async function d2(env, plan, res, { stage, fig, tapPart, partW }) {
    const { screen, data } = env;
    const row = plan.rows[0];
    await S.request(screen, { title: "", rows: plan.card });
    await Kit.wait(Kit.fast ? 50 : 1200);
    await S.say(row.patientSays, "patient");
    let busy = false;
    let finish;
    const done = new Promise((r) => (finish = r));
    let corrected = false;
    S.setExpect("diagnosis", () => {
      if (busy) return { stage: "diagnosis", kind: "wait" };
      const q = fig.hotspot(row.answer.part, row.answer.side || plan.side, null);
      const r = stage.getBoundingClientRect();
      return { stage: "diagnosis", kind: "point", x: Math.round(r.left + q.x), y: Math.round(r.top + q.y), part: row.answer.part, side: row.answer.side };
    });
    stage.addEventListener("click", async (e) => {
      if (busy) return;
      const tap = tapPart(e);
      if (!tap) return;
      busy = true;
      const ok = PL().judgePart(row, tap);
      res.judge(row, ok);
      res.log.push({ type: ok ? "right" : "wrong", rowId: row.id, detail: `${tap.side || ""} ${tap.part}` });
      if (ok) {
        fig.swirl(plan.part, plan.side, true);
        fig.react("relief");
        S.signal("clinic-part");
        await S.say(S.line(env, "thatsit"), "doctor");
        screen.card.tick("where");
        finish();
      } else {
        fig.react("giggle");
        if (plan.level <= 1 && !corrected) {
          corrected = true;
          await Kit.wait(500);
          await S.say(row.patientSays, "patient");
        }
        busy = false;
      }
    });
    void partW;
    await done;
  }

  async function d3(env, plan, res, { stage, top, fig, at, tapPart }) {
    const { screen, data } = env;
    const tools = data.stages.diagnosis.tools;
    await S.request(screen, { title: "", rows: plan.card });
    await S.say(S.line(env, "unwell"), "patient");
    const kit = h("div", "cl-kit", stage);
    let tool = null;
    const btns = {};
    Object.keys(tools).forEach((t) => {
      const b = h("button", "cl-kit-tool", kit);
      b.type = "button";
      b.dataset.tool = t;
      Kit.icon(tools[t].item, b);
      b.addEventListener("click", () => {
        tool = t;
        Object.values(btns).forEach((x) => x.classList.toggle("sel", x === b));
      });
      btns[t] = b;
    });
    let i = 0;
    let busy = false;
    let finish;
    const done = new Promise((r) => (finish = r));
    screen.card.now(plan.calls[0].id);
    S.setExpect("diagnosis", () => {
      const c = plan.calls[i];
      if (!c || busy) return { stage: "diagnosis", kind: "wait" };
      if (tool !== c.tool) return { stage: "diagnosis", kind: "tap", target: `.cl-kit-tool[data-tool="${c.tool}"]` };
      const q = fig.hotspot(c.part, c.side || (c.sore ? plan.side : "left"), null);
      const r = stage.getBoundingClientRect();
      return { stage: "diagnosis", kind: "point", x: Math.round(r.left + q.x), y: Math.round(r.top + q.y), part: c.part };
    });
    const allParts = data.parts[3];
    stage.addEventListener("click", async (e) => {
      if (busy || e.target.closest(".cl-kit")) return;
      const c = plan.calls[i];
      if (!c || !tool) return;
      const tap = tapPart(e, allParts);
      if (!tap) return;
      busy = true;
      const row = plan.rows[i];
      const ok = PL().judgeCheck(row, tool, tap);
      res.judge(row, ok);
      res.log.push({ type: ok ? "right" : "wrong", rowId: row.id, detail: `${tool} ${tap.side || ""} ${tap.part}` });
      // the find shows only at the sore part, whatever was used
      const sore = tap.part === plan.part && (!plan.side || !tap.side || tap.side === plan.side);
      const q = at(tap.part, tap.side);
      const f = h("div", `cl-find${sore ? " sore" : ""}`, top, sore ? FINDS[tool] || "!" : "·");
      f.style.left = `${q.x}px`;
      f.style.top = `${q.y}px`;
      setTimeout(() => f.remove(), 1400);
      if (sore) {
        fig.react("ouch");
        fig.swirl(plan.part, plan.side, true);
      } else fig.react(tool === "hand" ? "giggle" : "idle");
      await Kit.wait(Kit.fast ? 60 : 700);
      if (ok) {
        screen.card.tick(c.id);
        i++;
        tool = null;
        Object.values(btns).forEach((x) => x.classList.remove("sel"));
        if (i >= plan.calls.length) finish();
        else screen.card.now(plan.calls[i].id);
      }
      busy = false;
    });
    await done;
    kit.remove();
  }
})(typeof self !== "undefined" ? self : this);
