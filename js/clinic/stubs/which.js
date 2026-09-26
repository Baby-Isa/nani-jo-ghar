/*
 * STUB (phase 1): the shared "which one?" attribute-and-decoy module
 * (R3.3 `which`; the foundation session owns the real one). Same idea:
 * given what's wanted and a pool, return the choices to show, look-alikes
 * first (from data/clinic.json lookalike_groups), so the answer is never the
 * odd one out. Swap at integration: point Clinic.Which at the shared module.
 */
(function (global) {
  const Clinic = (global.Clinic = global.Clinic || {});
  Clinic.Which = {
    /** want + n-1 decoys from want's look-alike group(s), then the pool; shuffled. */
    choices(want, pool, n, rnd = Math.random) {
      const Cook = global.Cook;
      const groups = ((Cook.data.lookalike_groups || {}).groups || []).filter((g) => g.includes(want));
      const near = [...new Set(groups.flat())].filter((x) => x !== want && pool.includes(x));
      const rest = pool.filter((x) => x !== want && !near.includes(x)).sort(() => rnd() - 0.5);
      return [want].concat(near, rest).slice(0, n).sort(() => rnd() - 0.5);
    },
    /** The two options of the "?" rung: the right one and its nearest look-alike, random order. */
    pair(want, pool, rnd = Math.random) {
      return Clinic.Which.choices(want, pool, 2, rnd);
    },
  };
})(window);
