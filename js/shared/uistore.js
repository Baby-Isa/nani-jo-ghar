/*
 * Per-profile storage for the shared UI (docs/shared-api.md s8.1):
 * personal best times (js/shared/results.js) and which stations' onboarding
 * a child has already seen (js/shared/onboard.js).
 *
 * STORAGE ADAPTER. Phase B ("one app, one save"): when js/shared/save.js is
 * loaded (every game page loads it), everything lives in the one save, in
 * the current player's "ui" namespace (Save.get("ui")); the old fallback key
 * below was migrated into it. Without Save (Node, the old fruit-bowl errand):
 *   - with a profile attached (js/progress.js), everything lives on profile.shared_ui
 *     ({bests: {...}, onboarded: {...}, seen: {...}}) and is saved through
 *     the same onChange the word stages use: nothing new to migrate;
 *   - with no profile (the labs, a page opened on its own), it falls back
 *     to ONE localStorage key, "njg-shared-ui-fallback-v1", marked as a
 *     fallback. Phase B's shell always attaches a profile, so real play
 *     never writes it.
 * A mode or test can plug in anything else with UIStore.use(backend), where
 * backend = {read() -> object, write(object)}.
 *
 *   UIStore.get(section, key)          value or undefined
 *   UIStore.set(section, key, value)
 *   UIStore.clear(section?)            forget a section (or everything): "play the onboarding again"
 *   UIStore.use(backend | null)        null = back to the automatic backend
 *   UIStore.memory(initial?)           an in-memory backend (tests, "don't save" guests)
 *   UIStore.profileId()                the attached profile's id, or null
 *
 * Plain <script>: window.UIStore (and Shared.uistore); Node: require().
 */
(function (root, factory) {
  const UIStore = factory(root);
  if (typeof module === "object" && module.exports) module.exports = UIStore;
  else {
    root.UIStore = UIStore;
    (root.Shared = root.Shared || {}).uistore = UIStore;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const FALLBACK_KEY = "njg-shared-ui-fallback-v1";
  const UIStore = {};
  let custom = null;

  UIStore.memory = function (initial) {
    let data = JSON.parse(JSON.stringify(initial || {}));
    return { read: () => data, write: (d) => (data = d), kind: "memory" };
  };

  const profile = () => {
    const P = root && root.Progress;
    return P && P._profile ? P : null;
  };
  // the attached profile (js/progress.js): saved by the shell's onChange
  const profileBackend = {
    kind: "profile",
    read() {
      const p = profile()._profile;
      return (p.shared_ui = p.shared_ui || {});
    },
    write(d) {
      const P = profile();
      P._profile.shared_ui = d;
      if (typeof P._persist === "function") P._persist();
    },
  };
  // FALLBACK ONLY: no profile attached (labs). One key, whole object.
  let mem = null;
  const fallbackBackend = {
    kind: "fallback",
    read() {
      if (mem) return mem;
      try {
        mem = JSON.parse(root.localStorage.getItem(FALLBACK_KEY) || "{}") || {};
      } catch (e) {
        mem = {};
      }
      return mem;
    },
    write(d) {
      mem = d;
      try {
        root.localStorage.setItem(FALLBACK_KEY, JSON.stringify(d));
      } catch (e) { /* private mode: memory only */ }
    },
  };
  // Phase B: the one save (js/shared/save.js), the current player's "ui" namespace
  const saveBackend = {
    kind: "save",
    read() {
      try {
        return root.Save.get("ui");
      } catch (e) {
        return {};
      }
    },
    write(d) {
      try {
        root.Save.set("ui", d);
      } catch (e) { /* the save keeps itself in memory when storage is blocked */ }
    },
  };
  const hasSave = () => !!(root && root.Save && typeof root.Save.get === "function");
  const backend = () => custom || (hasSave() ? saveBackend : profile() ? profileBackend : fallbackBackend);

  UIStore.use = (b) => {
    custom = b || null;
    return UIStore;
  };
  UIStore.kind = () => backend().kind || "custom";
  UIStore.profileId = () => (custom ? null : hasSave() ? root.Save.currentId() : profile() ? profile()._profile.id || null : null);
  UIStore.get = function (section, key) {
    const d = backend().read() || {};
    return d[section] ? d[section][key] : undefined;
  };
  UIStore.set = function (section, key, value) {
    const b = backend();
    const d = b.read() || {};
    d[section] = d[section] || {};
    d[section][key] = value;
    b.write(d);
    return value;
  };
  UIStore.clear = function (section) {
    const b = backend();
    const d = b.read() || {};
    if (section) delete d[section];
    else Object.keys(d).forEach((k) => delete d[k]);
    b.write(d);
  };
  UIStore.FALLBACK_KEY = FALLBACK_KEY;
  return UIStore;
});
