/*
 * The clinic as a mode plug-in (step 3, R5; target-model § 6; docs/architecture/building-games.md). The one game
 * host (js/shared/host.js) runs the clinic's five stages and its healing games as mini-games, and the shell
 * (js/shared/mode.js; clinic.html, lab.html) starts them for a lab, one patient and a clinic morning:
 *
 *   clinic.html                                   a clinic morning: one host round per patient, then "close the clinic"
 *   clinic.html?stage=pharmacy&level=2            one stage alone (a lab round: the end screen, pocket money)
 *   clinic.html?stage=heal&game=ear&level=1       one healing game, mounted by the pipeline's heal stage
 *   clinic.html?patient=1&level=2                 one patient through all five stages
 *   lab.html?mode=clinic&game=ear&level=1         the same through the shared lab page
 *
 * The stages keep drawing into the clinic's one screen (js/clinic/screen.js: the doctor's box, the card, the
 * tray, the play area), built once per page and kept between stages (data-njg-keep); every stage is
 * screen: "own". What a stage judges goes to ctx.mark (the first try of each tested row, E14), every bulb and
 * peek to ctx.hint, the words to the end screen; the host scores the round once (Score.finish: badges, the best,
 * the one purse, word evidence) and shows the one end screen. The clinic's own save namespace keeps only its
 * session and stage levels (no coins: decision 20, the one purse).
 *
 * A round's stages share one patient (a plan from js/clinic/pipeline.js), made when the round's first stage
 * starts, from the step's params: {round, seed, levels?, variant?, game?, morning?}.
 */

/** The clinic's classic scripts, in load order (lab.html loads them through `needs`; clinic.html has them as tags). */
export const CLASSIC = [
  "js/shared/frame.js",
  "js/shared/stage.js",
  "js/shared/bulb.js",
  "js/shared/tally.js",
  "js/shared/focus.js",
  "js/clinic/lang.js",
  "js/clinic/body.js",
  "js/clinic/kit.js",
  "js/clinic/figure.js",
  "js/clinic/screen.js",
  "js/clinic/pipeline.js",
  "js/clinic/heal/registry.js",
  "js/clinic/heal/host.js",
  "js/clinic/heal/scene.js",
  "js/clinic/stages/common.js",
  "js/clinic/stages/waiting.js",
  "js/clinic/stages/diagnosis.js",
  "js/clinic/stages/pharmacy.js",
  "js/clinic/stages/heal.js",
  "js/clinic/stages/sendoff.js",
  "js/clinic/run.js",
];
export const STYLES = ["css/shared/tokens.css", "css/shared/frame.css", "css/shared/tally.css", "css/shared/focus.css", "css/clinic.css"];
/** The healing games in the pipeline, and the three parked ones (tummy, hic, hair: as they are, lab only). */
export const HEAL = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];
export const PARKED = ["tummy", "hic", "hair"];
const HEAL_GESTURES = { cut: ["tap"], knee: ["tap"], ear: ["tap", "drag"], tooth: ["tap", "drag"], taste: ["tap"], fever: ["tap"], boing: ["tap"], eye: ["tap"], foot: ["tap", "drag"], tummy: ["tap", "drag"], hic: ["tap"], hair: ["tap", "drag"] };
const LABEL = { cut: "The scrape", knee: "The knee", ear: "The ear", tooth: "The tooth", taste: "Sore tongue (drinks)", fever: "Fever", boing: "The jab (boing)", eye: "The eye", foot: "The foot", tummy: "Tummy ache", hic: "Hiccups", hair: "Itchy hair" };
const STAGES = ["waiting", "diagnosis", "pharmacy", "heal", "sendoff"];
const STAGE_LABEL = { waiting: "Waiting room", diagnosis: "Diagnosis", pharmacy: "Pharmacy (the belt)", heal: "Heal (the patient's game)", sendoff: "Send-off" };
const STAGE_LEVELS = { waiting: [1, 2, 3, 4, 5] };

const G = () => globalThis;
const stamp = (u) => (typeof G().njgV === "function" ? G().njgV(u) : u);

/** The site root relative to the page ("" from a root page, "../" from lab/). */
function rootFrom(baseURI) {
  try {
    const root = new URL("../../", import.meta.url);
    const page = new URL("./", baseURI);
    if (page.origin !== root.origin || !page.pathname.startsWith(root.pathname)) return root.href;
    return "../".repeat(page.pathname.slice(root.pathname.length).split("/").filter(Boolean).length);
  } catch (e) {
    return "";
  }
}

/* ---------------- the page's one clinic screen, kept between stages ---------------- */

const session = { screen: null, holder: null, loading: null, round: null, rounds: 0, morning: null };

function hookShared(Clinic) {
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  if (Kit.__hooked) return;
  Kit.__hooked = true;
  // the shared bulb and tally behind the Kit's names (R3a), and the scene box from the shared stage
  if (G().Bulb && G().Bulb.KitBulb) Kit.Bulb = G().Bulb.KitBulb(Kit);
  if (G().Tally && G().Tally.KitTally) Kit.Tally = G().Tally.KitTally(Kit);
  if (G().Stage && S.useStage) S.useStage(G().Stage);
}

async function ensureScreen(el, ctx) {
  const Clinic = G().Clinic;
  if (!Clinic || !Clinic.Run || !Clinic.Screen) throw new Error("clinic: the clinic's scripts aren't loaded (the game's needs)");
  if (session.screen && session.holder && session.holder.isConnected && el.contains(session.holder)) return session.screen;
  if (!session.loading) {
    session.loading = (async () => {
      const Kit = Clinic.Kit;
      if (Kit.root == null || Kit.root === "") Kit.root = rootFrom(el.ownerDocument.baseURI);
      hookShared(Clinic);
      // every healing game that exists (clinic.html loads them itself; lab.html through here)
      await Promise.all(HEAL.concat(PARKED).map((id) => (Clinic.Heal.has(id) ? true : loadScript(el.ownerDocument, `${Kit.root}js/clinic/heal/games/${id}.js`))));
      await Clinic.Run.load();
      // the clinic's words go through the core's language seam: its Lang over the clinic's source (js/clinic/lang.js)
      const CL = G().ClinicLang;
      if (CL && !CL.seam) {
        try {
          const { createLang } = await import("#core/lang/index.js");
          CL.use(createLang({ cook: CL.source }));
        } catch (e) {
          /* a page without the core's import map: the same build in js/clinic/lang.js */
        }
      }
    })();
  }
  await session.loading;
  session.loading = null;
  const doc = el.ownerDocument;
  doc.body.classList.add("clinic");
  const holder = doc.createElement("div");
  holder.className = "cl-holder";
  holder.dataset.njgKeep = "";
  el.appendChild(holder);
  const screen = Clinic.Screen.build(holder, { level: ctx.level });
  if (G().Frame && G().Frame.mount) G().Frame.mount({ app: screen.app, side: screen.side, play: screen.main });
  session.holder = holder;
  session.screen = screen;
  return screen;
}

function loadScript(doc, src) {
  return new Promise((res) => {
    const s = doc.createElement("script");
    s.src = stamp(src);
    s.onload = () => res(true);
    s.onerror = () => res(false);
    doc.body.appendChild(s);
  });
}

/* ---------------- a round's patient ---------------- */

const levelsAll = (L) => ({ waiting: L, diagnosis: L, pharmacy: L, heal: L, sendoff: L });

/** The patient of this round: made by the round's first stage, shared by the rest (params.round). */
function roundFor(ctx, screen) {
  const Clinic = G().Clinic;
  const R = Clinic.Run;
  const P = G().ClinicPipeline;
  const p = ctx.params || {};
  const token = p.round != null ? p.round : `${ctx.game}:${Math.random()}`;
  if (session.round && session.round.token === token) return session.round;
  const seed = p.seed != null ? p.seed : Math.floor(ctx.rng() * 1e9) + 1;
  const rng = P.rng(seed);
  const L = ctx.level || 1;
  let plan;
  if (p.morning != null && session.morning) plan = session.morning.patients[p.morning];
  else {
    const games = R.games();
    const heal = p.game || (HEAL.concat(PARKED).includes(ctx.game) ? ctx.game : null);
    const ailment = heal ? P.ailmentsFor(R.data, 3, [heal]).find((a) => (R.data.ailments[a].from || 1) <= L) || P.ailmentsFor(R.data, 3, [heal])[0] : null;
    plan = P.patient(R.data, { rng, levels: p.levels || levelsAll(L), variants: p.variant ? { [p.stage || ctx.game]: p.variant } : {}, ailment, games, speak: R.opts.speak });
  }
  const env = R.env(screen, plan, { rng, onboard: p.onboard !== false && R.opts.onboard });
  screen.resetHints();
  screen.trayWrap.classList.add("hidden");
  session.round = { token, plan, env, healWords: [], results: {} };
  if (G().__clinic) G().__clinic.plan = plan;
  return session.round;
}

/* ---------------- the mini-games ---------------- */

/** A tested row's word id for word progress (the item it asks for, where there is one). */
const wordOf = (row) => (row && row.row && (row.row.item || row.row.word)) || (row && (row.item || row.wordId)) || null;

function stageGame(id, { stage, heal = null, gestures, levels = [1, 2, 3], label }) {
  return {
    id,
    gestures,
    levels,
    screen: "own",
    needs: { scripts: CLASSIC, styles: STYLES },
    label,
    mount(el, ctx) {
      let stopped = false;
      return {
        async start() {
          const Clinic = G().Clinic;
          const screen = await ensureScreen(el, ctx);
          if (stopped) return;
          const R = Clinic.Run;
          const S = Clinic.Stages;
          const P = G().ClinicPipeline;
          const round = roundFor(ctx, screen);
          const { plan, env } = round;
          // the bulb is for language (the hints badge, E25); a look at a closed card is for reading (its own eye
          // badge, D12, decision 27)
          screen.onHint = () => ctx.hint(1);
          screen.onLook = () => ctx.look(1);
          screen.card.closedSeen = false;
          ctx.test.state(stage);
          const name = stage;
          const sp = plan.stages[name];
          if (name === "heal" && heal && sp.game !== heal) sp.game = heal;
          const res = await R.stage(screen, name, plan, env);
          S.current = null; // the stage is over: nothing is expected of the child until the next one says so
          if (stopped) return;
          round.results[name] = res;
          // the first try of every tested row (E14); the healing game's own right/total as rows of its own
          (res.rows || []).forEach((r) => r.tested && ctx.mark(`${name}:${r.id}`, !!r.ok, { word: wordOf(r) }));
          const hl = res.heal;
          if (hl && hl.total) for (let k = 0; k < hl.total; k++) ctx.mark(`heal:${k}`, k < hl.right);
          if (hl && hl.words) round.healWords = hl.words;
          // the end screen's words: the patient's own review after the send-off; a stage alone, its own words
          const last = ctx.params.last || ctx.params.round == null;
          const words = ctx.params.patient && name === "sendoff" ? P.words(R.data, plan, round.healWords) : ctx.params.patient ? [] : (res.words || []).concat(hl && hl.words ? hl.words : []);
          if (G().__clinic) G().__clinic.stageResult = res;
          if (last) env.fig.destroy();
          // the round had a closed card: the end screen shows the eye badge (D12)
          if (screen.card.closedSeen) ctx.lookable();
          ctx.done({
            words: words.map((w) => ({ id: w.id, kutchi: w.kutchi || null, english: w.english || "", placeholder: !w.kutchi || !!w.placeholder, right: w.right })),
            steps: hl && hl.steps ? hl.steps : undefined, // D14: the heal game's steps, for "what went wrong"
          });
        },
        expect() {
          const S = G().Clinic && G().Clinic.Stages;
          return S ? S.expect() : null;
        },
        destroy() {
          stopped = true;
          const S = G().Clinic && G().Clinic.Stages;
          if (S && S.endOnboard) S.endOnboard();
        },
      };
    },
  };
}

const games = {};
STAGES.forEach((s) => (games[s] = stageGame(s, { stage: s, gestures: s === "heal" ? ["tap", "drag"] : ["tap"], levels: STAGE_LEVELS[s] || [1, 2, 3], label: STAGE_LABEL[s] })));
HEAL.concat(PARKED).forEach((g) => (games[g] = stageGame(g, { stage: "heal", heal: g, gestures: HEAL_GESTURES[g], label: LABEL[g] })));

/* ---------------- the mode ---------------- */

let roundNo = 0;
/** One patient's five stages, sharing one plan (the round token). */
export function patientStages({ seed, level, levels, morning = null, variant = null } = {}) {
  const round = `p${++roundNo}`;
  const base = { round, seed, patient: true };
  if (levels) base.levels = levels;
  if (morning != null) base.morning = morning;
  return STAGES.map((s, i) => ({ game: s, level: (levels && levels[s]) || level || undefined, params: Object.assign({}, base, i === STAGES.length - 1 ? { last: true } : {}, variant && variant[s] ? { variant: variant[s], stage: s } : {}) }));
}

export default {
  id: "clinic",
  data: [],
  games,
  /**
   * lab: one stage or one healing game alone (its own patient), or one patient (params.patient);
   * story / free: one patient of the morning (params.morning = its index; the page makes the morning first).
   */
  plan(entry) {
    const p = entry.params || {};
    const seed = entry.seed != null ? entry.seed : p.seed != null ? p.seed : null;
    if (entry.game) return [{ game: entry.game, level: entry.level, params: { round: `s${++roundNo}`, seed, variant: p.variant || null, stage: entry.game, last: true } }];
    if (p.morning != null) return { game: "morning", stages: patientStages({ seed, morning: p.morning, levels: p.levels }) };
    return { game: "patient", stages: patientStages({ seed, level: entry.level || 1 }) };
  },
  lab: () =>
    ["waiting", "diagnosis", "pharmacy", "sendoff"]
      .map((s) => ({ game: s, label: `Clinic: ${STAGE_LABEL[s]}`, note: "One stage alone, with its own patient." }))
      .concat(HEAL.map((g) => ({ game: g, label: `Clinic heal: ${LABEL[g]}`, note: "One healing game, mounted by the pipeline's heal stage." })))
      .concat(PARKED.map((g) => ({ game: g, label: `Clinic heal (parked): ${LABEL[g]}`, note: "Parked: as it is, lab only." })))
      .concat([{ game: null, label: "Clinic: one patient", note: "One patient through all five stages, then the one end screen.", levels: [1, 2, 3] }]),
  free: { endless: true },
  actions: ["again", "next", "home"],
  states: () => STAGES.map((s) => `clinic/${s}`).concat(["results"]),
  session,
};

/* ---------------- a clinic morning (the page's loop: one host round per patient) ---------------- */

/**
 * A morning: the session's patients, one host round each (the one end screen after each, H34), then
 * "close the clinic". The stage levels go up after the morning (ClinicPipeline.levelUp) in the clinic's own
 * save namespace (UIStore "clinic"/"state": session and levels only; the coins are the one purse's).
 *   playMorning({mode, host, core, session?, seed?, noSave?, endActions?}) -> {morning, outs, state}
 */
export async function playMorning({ mode, host, core, session: sess = null, seed = null, noSave = false, endActions = null, onRound = null } = {}) {
  const Clinic = G().Clinic;
  const R = Clinic.Run;
  const P = G().ClinicPipeline;
  if (!R.data) await R.load();
  const st = R.state();
  const n0 = sess || st.session;
  const rng = P.rng(seed || Math.floor(Math.random() * 1e9));
  const m = P.morning(R.data, { session: n0, levels: st.levels, rng, games: R.games(), speak: R.opts.speak });
  R.morningPlan = session.morning = m;
  const outs = [];
  for (let i = 0; i < m.patients.length; i++) {
    const plan = m.patients[i];
    const stages = patientStages({ seed: Math.floor(rng() * 1e9) + 1, morning: i, levels: plan.levels });
    const acts = i < m.patients.length - 1 ? ["again", "next"] : ["again", "next"];
    const actions = endActions ? endActions(Object.fromEntries(acts.map((a) => [a, true]))) : acts.map((a, k) => ({ id: a, label: a, primary: k === acts.length - 1 }));
    // the light bulb stays hidden through the first-ever patient (UI that appears when first needed, UX s8)
    if (i === 0 && G().Onboard && session.screen) {
      if (m.entry.first) G().Onboard.await(session.screen.bulb.btn, "clinic/bulb");
      else G().Onboard.fadeIn(session.screen.bulb.btn, "clinic/bulb");
    }
    const res = await host.run({ mode, plan: { game: plan.ailment, stages }, play: { play: "free", place: "clinic" }, level: plan.level, actions });
    if (res.left) return { morning: m, outs, left: true };
    const out = { plan, results: session.round ? session.round.results : {}, right: res.round.right, total: res.round.total, coins: res.finish && res.finish.pay ? res.finish.pay.coins : 0 };
    if (onRound) onRound(res, out);
    if (res.out && res.out.action === "again") {
      i--; // the same patient again (H34)
      continue;
    }
    outs.push(out);
    st.album = Array.from(new Set((st.album || []).concat([`${plan.kind}:${plan.ailment}`])));
  }
  // level up per stage (a stage whose tested rows were all right this morning)
  const perStage = outs.map((x) => {
    const r = {};
    Object.entries(x.results).forEach(([s, v]) => (r[s] = s === "heal" ? [{ ok: !v.heal || !v.heal.total || v.heal.right === v.heal.total, tested: !!(v.heal && v.heal.total) }] : v.rows));
    return r;
  });
  delete st.coins; // the one purse (decision 20)
  if (!noSave) {
    st.levels = m.entry.levels && n0 <= 2 ? Object.assign({}, st.levels) : P.levelUp(st.levels, perStage);
    st.session = n0 + 1;
    R.save(st);
  }
  if (session.screen) await R.close(session.screen, outs, { coins: core && core.wallet ? core.wallet.coins() : 0 });
  return { morning: m, outs, state: st };
}
