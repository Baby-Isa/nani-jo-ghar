/*
 * The engine core in one call, for a page that moves onto it (R4 Cook, R5 the clinic):
 *
 *   import { loadCore } from "#core/index.js";
 *   const core = await loadCore({ base: "", cook: window.Cook });
 *   core.save  core.progress  core.score  core.wallet  core.voice  core.lang  core.settings  core.unlocks  core.log
 *   core.play  (this page's play context, from its URL)
 *
 * Each part is also importable on its own (#core/save.js, #core/wallet.js ...). The core never calls a mode.
 */
import { Save } from "./save.js";
import { loadJSON } from "./env.js";
import { createProgress } from "./progress.js";
import { createWallet } from "./wallet.js";
import { createScore } from "./score.js";
import { createVoice, clipIndex } from "./voice.js";
import { createLang } from "./lang/index.js";
import { createSettings } from "./settings.js";
import { createUnlocks, Entitlements } from "./unlocks.js";
import { fromQuery } from "./context.js";
import { createLog } from "./log.js";

/**
 * CK-48 (s12-w3b): data/family-audio.json (330 KB) once per page. The first loader leaves its promise on
 * globalThis.njgFamilyAudio and every other one (the clinic's js/clinic/lang.js) takes it from there; the core hands the
 * list on as core.data.familyAudio (Cook's language engine).
 */
export function familyAudio(load) {
  const g = globalThis;
  if (!g.njgFamilyAudio) g.njgFamilyAudio = Promise.resolve(load("data/family-audio.json", [])).catch(() => []);
  return g.njgFamilyAudio;
}

export async function loadCore({ base = "", save = Save, cook = null, player = null } = {}) {
  const load = (p, fallback) => loadJSON(p, { base }).catch(() => fallback);
  const [economy, progressData, unlockRules, audioList, tts] = await Promise.all([
    load("data/economy.json", {}),
    load("data/progress.json", null),
    load("data/unlocks.json", {}),
    familyAudio(load),
    load("data/cook-tts.json", { lines: {} }),
  ]);
  save.progressData = progressData || undefined;
  save.init();
  const progress = createProgress({ save, data: progressData || undefined });
  const wallet = createWallet({ save, economy });
  const index = clipIndex(audioList, { tts: (tts && tts.lines) || {} });
  const voice = createVoice({ index, player });
  const log = createLog({ save });
  return {
    log,
    save,
    progress,
    wallet,
    score: createScore({ save, wallet, progress, log }),
    voice,
    lang: createLang({ cook, index, voice }),
    settings: createSettings({ save }),
    unlocks: createUnlocks({ save, rules: unlockRules }),
    entitlements: Entitlements,
    play: fromQuery(),
    data: { economy, progress: progressData, unlocks: unlockRules, familyAudio: audioList || [] },
  };
}

export default loadCore;
