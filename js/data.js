/* Loads the built content JSON (from build/build_content.py), the
 * hand-written errand config (data/errands.json), and every scene layout
 * (data/scenes/<id>.json). Scenes own slot positions; errands only say
 * which word goes in which slot pool - see Build Brief v3 section 3. */
(function (global) {
  const SCENE_IDS = ["kitchen", "bazaar"];

  const NjgData = {
    content: null,
    errands: null,
    scenes: {},
    wordsById: {},
    audioManifest: {},

    async load() {
      const [content, errands, audioManifest, ...scenes] = await Promise.all([
        fetch(njgV("data/content.json")).then((r) => r.json()),
        fetch(njgV("data/errands.json")).then((r) => r.json()),
        fetch(njgV("data/audio-manifest.json")).then((r) => r.json()),
        ...SCENE_IDS.map((id) => fetch(njgV(`data/scenes/${id}.json`)).then((r) => r.json())),
      ]);
      this.content = content;
      this.errands = errands;
      this.audioManifest = audioManifest;
      content.words.forEach((w) => (this.wordsById[w.id] = w));
      scenes.forEach((s) => (this.scenes[s.id] = s));
      return this;
    },

    /** True if assets/audio/<kind>/<id>.mp3 exists, per the build-time
     * manifest (build/build_audio_manifest.py) - never probed at runtime,
     * since a HEAD 404 logs a console error even when JS catches it. */
    hasAudio(kind, id) {
      return (this.audioManifest[kind] || []).includes(id);
    },

    word(id) {
      return this.wordsById[id];
    },

    sentence(id) {
      return this.content.sentences.find((s) => s.id === id);
    },

    carrier(wordId) {
      return this.content.carriers[wordId];
    },

    errand(id) {
      return this.errands.errands.find((e) => e.id === id);
    },

    scene(id) {
      return this.scenes[id];
    },
  };

  global.NjgData = NjgData;
})(window);
