/*
 * One purse for the whole game (target-model § 3.5; decisions 2, 10, 20; rule E29), in the save's `wallet`
 * namespace. Coins only ever go up, except when the child buys something: no wages, no fines, no daily cost.
 *
 *   payFor(round, economy) -> { coins, volume, quality, difficulty, parts }   pure: what a round earns
 *   const W = createWallet({ save, economy });   // economy = data/economy.json
 *   W.coins()  W.owned()  W.has(id)  W.price(id)  W.canBuy(id)
 *   W.earn(n, why)        add coins (n > 0 only)
 *   W.pay(round)          payFor + earn, returns payFor's answer
 *   W.buy(id)             spend the price and own it; false when it can't be afforded or is owned
 *   W.state()             the stored object
 *
 * The old purses (Cook's `cook.coins`, the clinic's `ui.clinic.state.coins`) are merged in by the save's
 * schema-2 migration and again whenever the wallet is read, so a page still on old code that adds coins
 * to its own purse never loses them (only the increase since the last merge is added; an old purse going
 * down, e.g. Cook's old shop, never takes coins away from this one). Upgrades owned in Cook's save join too.
 *
 * The pay formula, all numbers in data/economy.json (`pay`):
 *   coins = round( perTask x volume x quality x difficulty ), at least `minCoins`
 *   volume     = tasks done in the round (orders' rows, a patient's stages ...)
 *   quality    = base + accuracy x w.accuracy + hintScore x w.hints + timeScore x w.time + speaking x w.speaking
 *                (accuracy = right / total; hintScore and timeScore from the badge tiers; speaking = right
 *                spoken replies / spoken prompts, only ever a bonus)
 *   difficulty = levels[level] x modes[mode]
 * The child never sees the sum, only coins arriving (decision 2).
 */

export const WALLET_NS = "wallet";

/** The old purses, as [source, read(save) -> {coins, owned?}] (schema 1 shapes). */
export const LEGACY_PURSES = {
  cook: (get) => {
    const c = get("cook") || {};
    return { coins: typeof c.coins === "number" ? c.coins : 0, owned: Array.isArray(c.owned) ? c.owned : [] };
  },
  clinic: (get) => {
    const u = get("ui") || {};
    const st = (u.clinic && u.clinic.state) || {};
    return { coins: typeof st.coins === "number" ? st.coins : 0, owned: [] };
  },
};

export const blankWallet = () => ({ coins: 0, owned: [], earned: 0, spent: 0, from: {}, log: [] });

const LOG_MAX = 40;
const logIt = (w, entry) => {
  w.log = (w.log || []).concat([entry]).slice(-LOG_MAX);
};

/**
 * Fold the old purses into a wallet (a new object). `legacy` = {source: {coins, owned}}. Only an increase
 * since the last merge is added; a decrease just moves the mark (never takes coins away).
 */
export function mergeLegacy(wallet, legacy, now = new Date().toISOString()) {
  const w = Object.assign(blankWallet(), JSON.parse(JSON.stringify(wallet || {})));
  Object.entries(legacy || {}).forEach(([src, p]) => {
    if (!p) return;
    const cur = Math.max(0, Math.floor(p.coins || 0));
    const had = w.from[src];
    const add = had == null ? cur : Math.max(0, cur - had);
    if (add > 0) {
      w.coins += add;
      w.earned += add;
      logIt(w, { at: now, n: add, why: `merged:${src}` });
    }
    w.from[src] = cur;
    (p.owned || []).forEach((id) => !w.owned.includes(id) && w.owned.push(id));
  });
  return w;
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** What a round earns. round = {tasks, right, total, hints, timeTier, spoken: {ok, total}, level, mode}. */
export function payFor(round, economy) {
  const P = (economy && economy.pay) || {};
  const w = P.weights || {};
  const r = round || {};
  const volume = Math.max(1, Math.floor(r.tasks || r.total || 1));
  const accuracy = r.total ? clamp((r.right || 0) / r.total, 0, 1) : 1;
  const hs = P.hintScore || [1, 0.5, 0];
  const hintScore = hs[Math.min(hs.length - 1, Math.max(0, r.hints || 0))];
  const timeScore = (P.timeScore || {})[r.timeTier || "none"] != null ? P.timeScore[r.timeTier || "none"] : 0.5;
  const sp = r.spoken || {};
  const speaking = sp.total ? clamp((sp.ok || 0) / sp.total, 0, 1) : 0;
  const q = (P.base != null ? P.base : 1) + accuracy * (w.accuracy || 0) + hintScore * (w.hints || 0) + timeScore * (w.time || 0) + speaking * (w.speaking || 0);
  const quality = clamp(q, P.qualityMin != null ? P.qualityMin : 0, P.qualityMax != null ? P.qualityMax : Infinity);
  const levels = P.levels || {};
  const lv = String(r.level || 1);
  const levelX = levels[lv] != null ? levels[lv] : levels[String(Math.max(...Object.keys(levels).map(Number).filter((n) => n <= (r.level || 1)), 1))] || 1;
  const modeX = ((P.modes || {})[r.mode] != null ? P.modes[r.mode] : 1);
  const difficulty = levelX * modeX;
  const raw = (P.perTask || 1) * volume * quality * difficulty;
  const coins = Math.max(P.minCoins || 1, Math.round(raw));
  return { coins, volume, quality, difficulty, parts: { accuracy, hintScore, timeScore, speaking, raw } };
}

/** All shop items in the economy, flattened: [{id, mode, price, tier}]. */
export const shopItems = (economy) => ((economy && economy.shop) || []).filter((x) => x && !x.hidden && x.id);

export function createWallet({ save, economy } = {}) {
  const get = (ns) => (save ? save.get(ns) : {});
  let memory = blankWallet(); // no save: one visit only (tests, labs)
  const read = () => {
    const w0 = save ? (save.has && !save.has(WALLET_NS) ? null : save.get(WALLET_NS)) : memory;
    const legacy = {};
    Object.entries(LEGACY_PURSES).forEach(([k, f]) => (legacy[k] = f(get)));
    const w = mergeLegacy(w0 || blankWallet(), legacy);
    if (JSON.stringify(w) !== JSON.stringify(w0)) write(w);
    return w;
  };
  const write = (w) => {
    if (save) save.set(WALLET_NS, w);
    else memory = w;
  };
  const W = {
    economy,
    state: read,
    coins: () => read().coins,
    owned: () => read().owned.slice(),
    has: (id) => read().owned.includes(id),
    price: (id) => (shopItems(economy).find((x) => x.id === id) || {}).price,
    earn(n, why = "") {
      n = Math.floor(n || 0);
      if (!(n > 0)) return W.coins();
      const w = read();
      w.coins += n;
      w.earned += n;
      logIt(w, { at: new Date().toISOString(), n, why });
      write(w);
      return w.coins;
    },
    pay(round) {
      const out = payFor(round, economy);
      W.earn(out.coins, `${(round && round.mode) || "?"}/${(round && round.game) || "-"}/L${(round && round.level) || 1}`);
      return out;
    },
    canBuy(id) {
      const p = W.price(id);
      const w = read();
      return p != null && !w.owned.includes(id) && w.coins >= p;
    },
    buy(id) {
      if (!W.canBuy(id)) return false;
      const w = read();
      const p = W.price(id);
      w.coins -= p;
      w.spent += p;
      w.owned.push(id);
      logIt(w, { at: new Date().toISOString(), n: -p, why: `bought:${id}` });
      write(w);
      return true;
    },
  };
  return W;
}

export default createWallet;
