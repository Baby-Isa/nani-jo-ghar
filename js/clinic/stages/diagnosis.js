/*
 * Stage 2, diagnosis: "Where does it hurt?" (docs/archive/clinic/clinic-design-v1.md P3,
 * Q3, Q5; clinic v2: docs/game-design/modes/clinic.md D). The patient
 * faces us, sitting on the bed's edge with legs dangling (CB2b), or standing
 * by the wall for the check-up (CB3b); a stand-in doctor to the right, turned 3/4.
 *   D1  level 1 (taught): 3 parts pulse; tap one; the doctor asks
 *       [Does it hurt here?]; the patient says haa / na (G9); on haa the swirl,
 *       [My knee], and the Found it button lights.
 *       Level 2 (was D1b, folded in): graded: Found it on haa, Next on na.
 *   D2  the patient says [My knee hurts] ([My left knee] at level 3); tap it.
 *   D3  the doctor calls a tool and a part; tap the tool, then the part; the
 *       find shows only at the sore one. Level 1 shows only the right tool plus
 *       one; each tool's first time comes with its cue (look in = the torch...).
 * Then the doctor names the ailment and says the prescription (P1's seam).
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;
  const PL = () => global.ClinicPipeline;

  const FACE = ["eye", "ear", "nose", "mouth", "tooth", "throat"];
  const BIG = 1.3; // the art's size over its room size in the diagnosis (D1: "maybe make her bigger")
  const FINDS = { hand: "👀", torch: "✨", stethoscope: "〰️", thermometer: "🔥" };

  S.diagnosis = {
    async run(env, plan) {
      const { screen, data } = env;
      const res = S.result("diagnosis");
      S.env = env;
      // A2 (5 Oct): the patient's real art (heal-art.json, the front-on W1: the plan's diagnosis shot) when it's cut.
      // The art has sitting poses only, so with it the check-up (D3) is on the bed's edge too, not by the wall
      const artSpec = await S.artFor(env.fig && env.fig.kind);
      // S02-E (W11, D3, CLN-93): her standing picture (heal-art.json patients[kind].stand: palms to us, so the hands,
      // arms, knees and feet can all be tapped) once it's cut; the art without it stays sitting on the bed's edge
      const standArt = plan.pose === "stand" && artSpec && artSpec.stand && artSpec.stand.front ? Object.assign({}, artSpec.stand, { heads: artSpec.stand.heads || artSpec.heads }) : null;
      const standing = plan.pose === "stand" && (!artSpec || !!standArt);
      const stage = S.room(screen, standing ? "stand" : "exam");
      stage.dataset.variant = plan.variant;
      const box = stage.scene;
      const cfg = stage.sceneCfg || {};
      const layer = h("div", "cl-patient-layer", box || stage);
      // S03 (CLN-94, review flaw 5): on a phone (a short screen) the standing patient is drawn bigger (scenes-v2.json
      // stand.phone), her feet nearer the bottom, so her hands, arms and knees are easy to tap
      const phone = standing && cfg.phone && (global.innerHeight || 999) < 480;
      const figCfg = phone ? Object.assign({}, cfg.fig, cfg.phone.fig) : cfg.fig;
      const docCfg = phone && cfg.doctor ? Object.assign({}, cfg.doctor, cfg.phone.doctor) : cfg.doctor;
      if (box && cfg.fig) {
        // the figure's box on the bed's edge (or the floor), in shares of the picture
        layer.classList.add("v2");
        S.place(layer, { x: figCfg.x, y: figCfg.bottom, h: figCfg.h, w: figCfg.h * (620 / 900) / 1.5, z: 3 });
        if (docCfg) {
          const docEl = S.place(Kit.doctorFigure(box, "cl-doc-stand"), { x: docCfg.x, y: docCfg.y, h: docCfg.h, z: 2 });
          // UX 16 (the staging hook): the doctor is turned three-quarter to the patient while they talk;
          // on the child's turn (the card is up, a moment later) he turns to the player
          S.pose(docEl, "talk", { facing: "left" });
          Kit.Voice.speakers.doctor = () => docEl;
          setTimeout(() => docEl.isConnected && S.pose(docEl, "front"), Kit.fast ? 50 : 1200);
        }
      }
      const fig = env.fig;
      layer.appendChild(fig.el);
      fig.pose(standing ? "stand" : "sit");
      // D1, CLN-93 (6 Oct): a bigger patient so her parts are easy to tap (her seat stays on the bed's edge)
      const art = !!(artSpec && box && cfg.fig && fig.useArt && fig.useArt(standArt || artSpec, { view: "front", figH: standArt ? figCfg.h : cfg.fig.h / BIG }));
      if (art) fig.tapAnchors = true;
      // sitting: the knees on the bed's edge whatever the patient's size (a child's feet dangle higher); the art
      // sits by its measured seat line (the backs of the thighs on the mattress), as in the heal games
      const seat = () => {
        if (!box || standing || cfg.seat == null) return;
        layer.style.top = `${cfg.fig.bottom * 100}%`;
        const q = fig.hotspot(art ? "seat" : "knee", "left", box);
        const H = box.clientHeight || 1;
        if (q && isFinite(q.y)) layer.style.top = `${(cfg.fig.bottom + (cfg.seat * H - q.y) / H) * 100}%`;
      };
      seat();
      if (box) box.addEventListener("scenefit", seat);
      fig.react("idle", 0);
      fig.swirl(plan.part, plan.side, false);
      // T30 / CLN-86: her bubbles from her face (the art's mouth), his from him
      Kit.Voice.speakers.patient = () => (art && fig.anchorEl ? fig.anchorEl("head") : fig.el.querySelector(".fig-head") || fig.el);
      // T22: the doctor is on screen, so he talks in bubbles; the card's headline says the job, the box stays empty
      screen.setNani(null);
      const top = h("div", "cl-fx", stage);
      const at = (part, side) => fig.hotspot(part, side, stage);
      // the face parts answer only in the close-up: the magnifier toggles it (the head frames the face)
      const zoom = { on: false, busy: false, el: null };
      const levelParts = data.parts[plan.level] || data.parts[3];
      // D11 (6 Oct): in the check-up (D3) the torch zooms to the face by itself; the magnifier is D2's only
      if (plan.variant === "D2" && levelParts.some((p) => FACE.includes(p))) {
        zoom.el = h("button", "cl-mag", stage, "🔍");
        zoom.el.type = "button";
        zoom.el.setAttribute("aria-label", "Look closer at the face");
        zoom.el.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (zoom.busy) return;
          zoom.busy = true;
          zoom.on = !zoom.on;
          zoom.el.classList.toggle("on", zoom.on);
          await fig.focus(zoom.on ? "head" : null, null, zoom.on ? 2.4 : 1, Kit.fast ? 60 : 350);
          zoom.busy = false;
        });
      }
      zoom.need = (part) => (zoom.el && FACE.includes(part) !== zoom.on ? { kind: "tap", target: ".cl-mag" } : null);
      /** D3: the torch looks at the face, the other tools at the body: the zoom follows the tool by itself. */
      zoom.to = async (on) => {
        if (zoom.on === on) return;
        while (zoom.busy) await Kit.wait(40);
        zoom.busy = true;
        zoom.on = on;
        await fig.focus(on ? "head" : null, null, on ? 2.4 : 1, Kit.fast ? 60 : 700);
        zoom.busy = false;
      };
      env.zoom = zoom;
      // two parts on one spot (her closed mouth is also the tooth): the one being asked for wins (D11), else the sore one
      const tapPart = (e, active, prefer) => (e.target.closest && e.target.closest(".cl-mag, .cl-kit") ? null : fig.partAt(e.clientX, e.clientY, { active: active || levelParts, closeup: zoom.on, prefer: prefer || plan.part }));
      const partW = (p) => PL().partWord(data, p);

      if (plan.variant === "D1" || plan.variant === "D1b") await d1(env, plan, res, { stage, top, fig, at });
      else if (plan.variant === "D2") await d2(env, plan, res, { stage, fig, tapPart, partW });
      else await d3(env, plan, res, { stage, top, fig, at, tapPart });

      // the doctor names the ailment and says the prescription (the seam into the pharmacy)
      S.current = null;
      if (zoom.on) await fig.focus(null, null, 1, Kit.fast ? 60 : 350);
      if (zoom.el) zoom.el.remove();
      // decision 52 (D2, CLN-83): the outcome is clear, so no "To the counter" click: the doctor names it and it moves on
      fig.react("ouch", 0);
      await S.say(plan.name, "doctor");
      await Kit.wait(Kit.fast ? 60 : 900);
      // S02-F (C open item): the end screen comes up over this room, and a stage played alone hands its patient
      // back (fig.destroy) first: a still copy of her stays in her place, so the room behind is never empty
      const still = fig.el.cloneNode(true);
      still.classList.add("cl-fig-still");
      still.style.pointerEvents = "none";
      still.setAttribute("aria-hidden", "true");
      layer.insertBefore(still, fig.el);
      res.words.push(PL().partWord(data, plan.part));
      void h;
      return res;
    },
  };

  async function d1(env, plan, res, { stage, top, fig, at }) {
    const { screen, data } = env;
    // T24 (decision 55): the card's headline is the job, [Ask where it hurts]; the doctor's [Does it hurt here?] and her
    // Ha / Na are bubbles at their faces. D1 is taught at every level (decision 52: no Found it, no Next)
    // S04-F1 (decision 53, CLN-84): the request first, in the shared pop-up, read out; then the sidebar card, quiet
    await S.requestPopup(screen, { reason: "clinic:diagnosis", title: S.line(env, "ask-where"), rows: [] });
    await S.request(screen, { title: S.line(env, "ask-where"), rows: [], read: false });
    let dots = plan.probes.map((p) => {
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
    // on a small screen two decoys can land on top of each other (or of the sore one): keep the sore
    // part, drop any decoy closer than a dot's width to one already kept (the row judges only the sore part)
    {
      const size = (dots[0] && dots[0].el.offsetWidth) || 40;
      const kept = [];
      dots.slice().sort((a, b) => (b.part === plan.part) - (a.part === plan.part)).forEach((d) => {
        const x = parseFloat(d.el.style.left);
        const y = parseFloat(d.el.style.top);
        if (d.part !== plan.part && kept.some((k) => Math.hypot(k.x - x, k.y - y) < size * 1.1)) d.el.remove();
        else kept.push({ d, x, y });
      });
      dots = dots.filter((d) => d.el.isConnected);
    }
    const onResize = () => dots.forEach((d) => d.place());
    global.addEventListener("resize", onResize);
    // the art's picture may still be loading when the dots are first placed: place them again once it's drawn
    whenDrawn(fig).then(onResize);
    let busy = false;
    let finish;
    const done = new Promise((r) => (finish = r));
    S.setExpect("diagnosis", () => {
      if (busy) return { stage: "diagnosis", kind: "wait" };
      const d = dots.find((x) => x.part === plan.part);
      return { stage: "diagnosis", kind: "tap", target: `.cl-probe[data-part="${d.part}"]`, wrong: `.cl-probe:not([data-part="${d.part}"]):not(.tried)` };
    });
    dots.forEach((d) => {
      d.el.addEventListener("click", async () => {
        if (busy || d.el.classList.contains("tried")) return;
        busy = true;
        // D4 (CLN-93): the dot being asked about is lit (the one highlight), never green before her answer
        dots.forEach((x) => x.el.classList.remove("asking"));
        d.el.classList.add("asking");
        S.signal("clinic-probe");
        await S.say(S.line(env, "here"), "doctor");
        const yes = d.part === plan.part;
        fig.react(yes ? "ouch" : "idle", 0);
        // the patient's answer: the data's line for yes / no (haa / na, G9), in her bubble
        await S.say(S.line(env, (data.answer_lines || {})[yes ? "yes" : "no"] || (yes ? "yes" : "no")), "patient");
        d.el.classList.remove("asking");
        if (!yes) {
          // D4: a tried dot goes grey (and can't be asked again); the others keep pulsing
          d.el.classList.add("tried");
          d.el.disabled = true;
          busy = false;
          return;
        }
        // D3 (CLN-93): on yes the doctor names the part in his bubble, and it moves on by itself (decision 52)
        if (global.Sfx && global.Sfx.bing) try { global.Sfx.bing(); } catch (e) { /* no sound */ }
        d.el.classList.add("found");
        dots.forEach((x) => x !== d && x.el.remove());
        await S.say(PL().partWord(data, plan.part), "doctor");
        await Kit.wait(Kit.fast ? 40 : 500);
        d.el.remove();
        finish();
      });
    });
    if (env.first) S.onboard(env, "diagnosis", [{ spotlight: () => dots.find((x) => x.part === plan.part).el, ghost: { gesture: "tap" }, wait: "clinic-probe" }]);
    await done;
    global.removeEventListener("resize", onResize);
    screen.clearActions();
  }

  /** Resolves once the figure's art picture is decoded and laid out (at once without art). */
  function whenDrawn(fig) {
    const img = fig.art && fig.art.base;
    if (!img) return Promise.resolve();
    const ready = img.complete && img.naturalWidth ? Promise.resolve() : new Promise((r) => img.addEventListener("load", r, { once: true }));
    return ready.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  }

  async function d2(env, plan, res, { stage, fig, tapPart, partW }) {
    const { screen } = env;
    const row = plan.rows[0];
    // T25: the card's headline [Find where it hurts]; her [My {part} hurts] in her bubble; his [That's it]; it moves on
    await S.requestPopup(screen, { reason: "clinic:diagnosis", title: S.line(env, "find-where"), rows: [] }); // S04-F1
    await S.request(screen, { title: S.line(env, "find-where"), rows: [], read: false });
    S.say(row.patientSays, "patient"); // input is live at once (13i): a tap during the line goes ahead
    let busy = false;
    let finish;
    const done = new Promise((r) => (finish = r));
    let corrected = false;
    S.setExpect("diagnosis", () => {
      if (busy || env.zoom.busy) return { stage: "diagnosis", kind: "wait" };
      const z = env.zoom.need(row.answer.part);
      if (z) return Object.assign({ stage: "diagnosis" }, z);
      const q = fig.hotspot(row.answer.part, row.answer.side || plan.side, stage);
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
        fig.react("relief");
        S.signal("clinic-part");
        await S.say(S.line(env, "thatsit"), "doctor");
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

  /**
   * D3, the check-up (T26, decision on D3, CLN-94): her [I don't feel well] in her bubble; the card like sekelo: the
   * headline [Check her over], one block per tool ([Use your hand], [Use the torch]) with the parts to look at under
   * it, ticking as each is done; one highlight (the row now). Picking the torch zooms to her face by itself, any
   * other tool zooms back out, so the eye and the ear answer at the first tap.
   */
  async function d3(env, plan, res, { stage, top, fig, at, tapPart }) {
    const { screen, data } = env;
    const tools = data.stages.diagnosis.tools;
    S.say(S.line(env, "unwell-short"), "patient");
    // the card: each call's row is "[the part]" under its tool's block (rows sharing a seq are one block)
    const order = [];
    plan.calls.forEach((c) => !order.includes(c.tool) && order.push(c.tool));
    const calls = order.flatMap((t) => plan.calls.filter((c) => c.tool === t));
    const partRow = (c) => Object.assign(PL().partWord(data, c.part, c.side || null), { id: c.id, seq: `tool-${c.tool}` });
    const heads = {};
    order.forEach((t) => (heads[`tool-${t}`] = S.line(env, `use-${t}`)));
    blockCard(screen.card, heads);
    // S04-F1 (decision 53, CLN-84): the whole check-up card in the shared pop-up first (the same tool blocks), read out
    await S.requestPopup(screen, { reason: "clinic:diagnosis", title: S.line(env, "check-over"), rows: calls.map(partRow), prep: (c) => blockCard(c, heads) });
    await S.request(screen, { title: S.line(env, "check-over"), rows: calls.map(partRow), read: false });
    const kit = h("div", "cl-kit", stage);
    let tool = null;
    const btns = {};
    (plan.tools || Object.keys(tools)).forEach((t) => {
      const b = h("button", "cl-kit-tool", kit);
      b.type = "button";
      b.dataset.tool = t;
      Kit.icon(tools[t].item, b);
      b.addEventListener("click", () => {
        tool = t;
        Object.values(btns).forEach((x) => x.classList.toggle("sel", x === b));
        S.signal("clinic-tool");
        env.zoom.to(t === "torch");
      });
      btns[t] = b;
    });
    // each tool's first time (v2 D3): the doctor says what it's for, and the ghost finger shows it
    const cueSeen = (t) => {
      try {
        return !!(global.UIStore && global.UIStore.get("clinic-cue", t));
      } catch (e) {
        return false;
      }
    };
    const cue = async (c) => {
      if (!env.onboard || cueSeen(c.tool) || !tools[c.tool].cue) return;
      try {
        if (global.UIStore) global.UIStore.set("clinic-cue", c.tool, true);
      } catch (e) {
        /* no storage */
      }
      btns[c.tool].classList.add("cue");
      await S.say(S.line(env, `cue-tool-${c.tool}`), "doctor");
      S.onboard(env, `diagnosis-tool-${c.tool}`, [{ spotlight: btns[c.tool], ghost: { gesture: "tap" }, wait: "clinic-tool" }]);
    };
    let i = 0;
    let busy = false;
    let finish;
    const done = new Promise((r) => (finish = r));
    screen.card.now(calls[0].id);
    let cueing = true;
    cue(calls[0]).then(() => (cueing = false));
    S.setExpect("diagnosis", () => {
      const c = calls[i];
      if (!c || busy || cueing || env.zoom.busy) return { stage: "diagnosis", kind: "wait" };
      if (tool !== c.tool) return { stage: "diagnosis", kind: "tap", target: `.cl-kit-tool[data-tool="${c.tool}"]` };
      const q = fig.hotspot(c.part, c.side || (c.sore ? plan.side : "left"), stage);
      const r = stage.getBoundingClientRect();
      return { stage: "diagnosis", kind: "point", x: Math.round(r.left + q.x), y: Math.round(r.top + q.y), part: c.part };
    });
    const allParts = data.parts[plan.level] || data.parts[3];
    stage.addEventListener("click", async (e) => {
      if (busy || env.zoom.busy || e.target.closest(".cl-kit")) return;
      const c = calls[i];
      if (!c || !tool) return;
      const tap = tapPart(e, allParts, c.part);
      if (!tap) return;
      busy = true;
      const row = plan.rows.find((r) => r.id === c.id);
      const ok = PL().judgeCheck(row, tool, tap);
      res.judge(row, ok);
      res.log.push({ type: ok ? "right" : "wrong", rowId: row.id, detail: `${tool} ${tap.side || ""} ${tap.part}` });
      // the find shows only at the sore part, whatever was used: her sore face (no swirl, no icon)
      const sore = tap.part === plan.part && (!plan.side || !tap.side || tap.side === plan.side);
      const q = at(tap.part, tap.side);
      const f = h("div", `cl-find${sore ? " sore" : ""}`, top);
      f.style.left = `${q.x}px`;
      f.style.top = `${q.y}px`;
      setTimeout(() => f.remove(), 900);
      if (sore) fig.react("ouch", 0);
      else fig.react(tool === "hand" ? "giggle" : "idle");
      await Kit.wait(Kit.fast ? 60 : 700);
      if (ok) {
        screen.card.tick(c.id);
        i++;
        if (i >= calls.length) finish();
        else {
          // the next row: a new tool's block means picking that tool (the old one is put down)
          if (calls[i].tool !== tool) {
            tool = null;
            Object.values(btns).forEach((x) => x.classList.remove("sel"));
          }
          Object.values(btns).forEach((x) => x.classList.remove("cue"));
          screen.card.now(calls[i].id);
          cueing = true;
          await cue(calls[i]);
          cueing = false;
        }
      }
      busy = false;
    });
    await done;
    blockCard(screen.card, null);
    kit.remove();
  }

  /**
   * The sekelo-style block card (T26) on the clinic's card: Kit.Card draws a `seq` group with no head of its own, so
   * for the check-up the group's head is set to the tool's line as the shared order card draws it (OrderCard: an item
   * with a label and its parts). heads = {seq: word} | null to stop. The card's own method is wrapped for this card
   * only (Kit.Card is Session A's: a group head there would replace this; reported).
   */
  function blockCard(card, heads) {
    if (!heads) {
      delete card.render;
      card.render();
      return;
    }
    card.render = function () {
      const OC = global.OrderCard;
      const orig = OC && OC.card;
      if (!orig) return Kit.Card.prototype.render.call(this);
      const rows = this.rows;
      OC.card = (data, opts) => {
        data.items = data.items.map((it) => {
          const key = it.key != null ? it.key : it.parts && it.parts[0] && it.parts[0].key;
          const r = rows.find((x) => x.id === key);
          const head = r && heads[r.seq];
          if (!head) return it;
          // a single-part block was drawn as a plain row: it gets its head back, the part under it
          const parts = it.label === null || it.parts.length ? it.parts : [{ label: it.label, done: it.done, key: it.key, miss: it.miss }];
          return Object.assign({}, it, { label: Kit.rowHtml(head), parts, ordered: false, key: undefined, done: parts.every((p) => p.done) });
        });
        // S03 (CLN-94): one tool's block is drawn "direct" by the order card (its parts straight under the headline,
        // its own head dropped), so the tool's line becomes the headline: "[Use your hand]" over "arm", "hand"
        if (data.items.length === 1 && data.items[0].label && data.headline) {
          const r = rows.find((x) => x.seq && heads[x.seq]);
          const head = r && heads[r.seq];
          if (head) data = Object.assign({}, data, { headline: { html: Kit.rowHtml(head), key: "__head", rec: !head.kutchi || head.placeholder === true } });
        }
        return orig(data, opts);
      };
      try {
        return Kit.Card.prototype.render.call(this);
      } finally {
        OC.card = orig;
      }
    };
  }
})(typeof self !== "undefined" ? self : this);
