/*
 * Settings (decision 22 d, e; decision 24): per child, in the save's `settings` namespace, and per device, in
 * the save's root. A value never set reads as its default, so adding a setting later never needs a migration.
 *
 * Per child (createSettings({save}).get(name)):
 *   modelVoice   "boy" | "girl": whose model reply the child hears before speaking (G17: Zafar's for a boy,
 *                Mum's for a girl). Default: from the character's body (first launch), else "boy".
 *   level        null (the game decides, per word and per mode) or 1-4: a grown-up's override
 *   readAlong    true: the words underline as they are said (E4)
 *   sound        true: sound effects and voices on
 * Per device (deviceSetting(name), in the root next to `lang`):
 *   lang         "kutchi" (Save.lang()): the language the game speaks; data/lang/<lang>/ and its voices
 *   scale        "auto": room for a per-screen scale setting (decision 24: layout built to scale; the rule
 *                for how much things grow per screen is set later in data)
 *
 *   const S = createSettings({ save })
 *   S.get(name)  S.all()  S.set(name, value)  S.reset(name)  S.modelSpeaker() -> "zafar" | "mum"
 *   S.device(name)  S.setDevice(name, value)
 */

export const CHILD_DEFAULTS = Object.freeze({ modelVoice: null, level: null, readAlong: true, sound: true });
export const DEVICE_DEFAULTS = Object.freeze({ scale: "auto" });
const VALID = {
  modelVoice: (v) => v === "boy" || v === "girl",
  level: (v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 4),
  readAlong: (v) => typeof v === "boolean",
  sound: (v) => typeof v === "boolean",
  scale: (v) => v === "auto" || (typeof v === "number" && v >= 0.5 && v <= 3),
};
/** G17: the model reply's speaker for each model voice */
export const MODEL_SPEAKER = { boy: "zafar", girl: "mum" };

export function createSettings({ save } = {}) {
  const stored = () => (save ? save.get("settings") : {});
  const fromCharacter = () => {
    const c = save ? save.get("character") : {};
    const body = c && c.choices && c.choices.body;
    return body === "girl" || body === "boy" ? body : "boy";
  };
  const S = {
    get(name) {
      const v = stored()[name];
      if (v !== undefined && (!VALID[name] || VALID[name](v))) return v;
      if (name === "modelVoice") return fromCharacter();
      return CHILD_DEFAULTS[name];
    },
    all: () => Object.fromEntries(Object.keys(CHILD_DEFAULTS).map((k) => [k, S.get(k)])),
    set(name, value) {
      if (!(name in CHILD_DEFAULTS)) throw new Error(`no such setting: ${name}`);
      if (VALID[name] && !VALID[name](value)) throw new Error(`bad value for ${name}`);
      if (save) save.update("settings", (d) => ((d[name] = value), d));
      return value;
    },
    reset(name) {
      if (save) save.update("settings", (d) => (delete d[name], d));
    },
    modelSpeaker: () => MODEL_SPEAKER[S.get("modelVoice")] || "zafar",
    device(name) {
      if (name === "lang") return save ? save.lang() : "kutchi";
      const v = save && save.setting ? save.setting(name) : undefined;
      return v !== undefined && (!VALID[name] || VALID[name](v)) ? v : DEVICE_DEFAULTS[name];
    },
    setDevice(name, value) {
      if (name === "lang") return save.setLang(value);
      if (!(name in DEVICE_DEFAULTS)) throw new Error(`no such device setting: ${name}`);
      if (VALID[name] && !VALID[name](value)) throw new Error(`bad value for ${name}`);
      return save.setSetting(name, value);
    },
  };
  return S;
}

export default createSettings;
