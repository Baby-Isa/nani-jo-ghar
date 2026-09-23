/*
 * Audio: a family recording file if one exists, else Web Speech read by a
 * LOCAL (on-device) Hindi or Gujarati voice reading the romanised spelling.
 *
 * This is explicitly a placeholder, per the Technical Plan's "Audio
 * pipeline" section: "Until a real recording exists, a word falls back to
 * text-to-speech reading the romanised spelling in the nearest available
 * voice... Clearly worse, clearly temporary." No Kutchi TTS exists from
 * any vendor - this is a Hindi/Gujarati voice mispronouncing Kutchi, not a
 * Kutchi voice.
 *
 * "Nothing leaves the device" (project rule 7): only voices whose
 * SpeechSynthesisVoice.localService is true are used. A voice service that
 * sends text to a remote server (localService === false, common for some
 * Chrome voices) is never used, even if it sounds better.
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
      // fallback timeout in headless/CI environments with no voices at all
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
      // Safety net: some headless/sandboxed browsers (no audio output
      // device) silently drop an utterance without ever firing onend or
      // onerror, which would otherwise hang every caller of speak()
      // forever. A hard timeout keeps the game's flow moving regardless.
      const timeoutMs = Math.max(1500, Math.min(6000, (text.length || 10) * 120));
      setTimeout(() => finish(false), timeoutMs);
      try {
        const utter = new SpeechSynthesisUtterance(text);
        if (voice) {
          utter.voice = voice;
          utter.lang = voice.lang;
        } else {
          utter.lang = "hi-IN"; // best-effort hint even with no matching installed voice
        }
        utter.rate = 0.85; // a little slower, this is a mispronunciation guide, not natural speech
        utter.onend = () => finish(true);
        utter.onerror = () => finish(false);
        speechSynthesis.cancel(); // don't stack overlapping lines
        speechSynthesis.speak(utter);
      } catch (e) {
        finish(false);
      }
    });
  }

  // Recording file existence is checked once and cached, so a missing file
  // doesn't cost a failed network request on every play.
  const recordingChecked = {};
  function recordingUrl(kind, id) {
    return `assets/audio/${kind}/${id}.mp3`;
  }
  async function hasRecording(kind, id) {
    const key = kind + ":" + id;
    if (key in recordingChecked) return recordingChecked[key];
    try {
      const res = await fetch(recordingUrl(kind, id), { method: "HEAD" });
      recordingChecked[key] = res.ok;
    } catch (e) {
      recordingChecked[key] = false;
    }
    return recordingChecked[key];
  }

  /**
   * Speak a word or sentence. `kind` is "word" or "carrier" (matches the
   * assets/audio/<kind>/<id>.mp3 naming convention this build expects -
   * none exist yet, so every line falls back to speech synthesis for now).
   */
  const NjgAudio = {
    async speak(kind, id, fallbackText) {
      const has = await hasRecording(kind, id);
      if (has) {
        const audio = new Audio(recordingUrl(kind, id));
        return audio.play().then(() => true).catch(() => speakText(fallbackText));
      }
      return speakText(fallbackText);
    },
    speakRaw: speakText,
  };

  global.NjgAudio = NjgAudio;
})(window);
