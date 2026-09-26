/*
 * Audio: a family recording file if one exists (played through Phaser's
 * sound manager, which handles mobile unlock on the first tap - see Build
 * Brief v3 section 2.4), else Web Speech read by a LOCAL (on-device) Hindi
 * or Gujarati voice reading the romanised spelling.
 *
 * This is explicitly a placeholder: "Until a real recording exists, a word
 * falls back to text-to-speech reading the romanised spelling in the
 * nearest available voice... Clearly worse, clearly temporary." No Kutchi
 * TTS exists from any vendor - this is a Hindi/Gujarati voice
 * mispronouncing Kutchi, not a Kutchi voice.
 *
 * "Nothing leaves the device" (project rule): only voices whose
 * SpeechSynthesisVoice.localService is true are used.
 *
 * File convention: assets/audio/<kind>/<id>.mp3, so family recordings drop
 * in as file swaps with no code change.
 */
(function (global) {
  let voicesCache = null;
  let voicesPromise = null;

  function loadVoices() {
    if (voicesPromise) return voicesPromise;
    voicesPromise = new Promise((resolve) => {
      if (!("speechSynthesis" in window)) return resolve([]);
      const existing = speechSynthesis.getVoices();
      if (existing && existing.length) return resolve(existing);
      const onVoices = () => {
        const v = speechSynthesis.getVoices();
        if (v && v.length) {
          speechSynthesis.removeEventListener("voiceschanged", onVoices);
          resolve(v);
        }
      };
      speechSynthesis.addEventListener("voiceschanged", onVoices);
      setTimeout(() => resolve(speechSynthesis.getVoices() || []), 800);
    });
    return voicesPromise;
  }

  async function pickLocalVoice() {
    if (voicesCache) return voicesCache;
    const voices = await loadVoices();
    const local = voices.filter((v) => v.localService);
    const byPrefix = (prefix) => local.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
    voicesCache = byPrefix("hi") || byPrefix("gu") || local[0] || null;
    return voicesCache;
  }

  async function speakText(text) {
    if (!text || !("speechSynthesis" in window)) return false;
    const voice = await pickLocalVoice();
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        resolve(ok);
      };
      const timeoutMs = Math.max(1500, Math.min(6000, (text.length || 10) * 120));
      setTimeout(() => finish(false), timeoutMs);
      try {
        const utter = new SpeechSynthesisUtterance(text);
        if (voice) {
          utter.voice = voice;
          utter.lang = voice.lang;
        } else {
          utter.lang = "hi-IN";
        }
        utter.rate = 0.85;
        utter.onend = () => finish(true);
        utter.onerror = () => finish(false);
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      } catch (e) {
        finish(false);
      }
    });
  }

  function audioKey(kind, id) {
    return `${kind}-${id}`;
  }

  const NjgAudio = {
    /** The list of {key, url} every scene should preload in this.load.audio
     * calls. Missing files simply fail to load (Phaser skips them without
     * crashing the loader) and speak() falls back to speech synthesis. */
    manifest(ids) {
      return ids.map(({ kind, id }) => ({
        key: audioKey(kind, id),
        url: njgV(`assets/audio/${kind}/${id}.mp3`),
      }));
    },

    /**
     * Speak a word/carrier/sentence line in a given Phaser scene. Resolves
     * once playback actually finishes (the `complete` event), not when it
     * merely starts - see Build Brief v3 section 1, "lines talking over
     * each other". A timeout safety net (clip length + 1s) covers browsers
     * that silently drop playback.
     */
    speak(scene, kind, id, fallbackText) {
      const key = audioKey(kind, id);
      if (scene && scene.cache && scene.cache.audio.exists(key)) {
        return new Promise((resolve) => {
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            resolve(true);
          };
          const sound = scene.sound.add(key);
          sound.once("complete", finish);
          const durationMs = (sound.duration || 3) * 1000 + 1000;
          scene.time.delayedCall(durationMs, finish);
          sound.play();
        });
      }
      return speakText(fallbackText);
    },

    speakRaw: speakText,
  };

  global.NjgAudio = NjgAudio;
})(window);
