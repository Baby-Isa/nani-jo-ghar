/* Loads the built content JSON (from build/build_content.py) and the
 * hand-written errand config (data/errands.json, kept separate from the
 * content master spreadsheet). */
(function (global) {
  const NjgData = {
    content: null,
    errands: null,
    wordsById: {},

    async load() {
      const [content, errands] = await Promise.all([
        fetch("data/content.json").then((r) => r.json()),
        fetch("data/errands.json").then((r) => r.json()),
      ]);
      this.content = content;
      this.errands = errands;
      content.words.forEach((w) => (this.wordsById[w.id] = w));
      return this;
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
  };

  global.NjgData = NjgData;
})(window);
