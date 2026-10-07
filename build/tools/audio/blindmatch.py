"""Does a blind transcript say the target and nothing else? (S02-D2, decision 69)

The transcribers were never told the target; this is where their words are compared with it.
Any script (Gujarati, Devanagari, Gurmukhi, Urdu, Korean, Thai, Greek ...) is brought to Latin
letters, then to a loose phonetic key (Kutchi spellings vary: matar / mutter / mata).

check(transcript, target) -> (strength 0..1, [reasons it fails]); it passes when there are no reasons.
Reasons: nothing heard, a question id or number, laughter or a sound tag, a word that is not in the
target (filler like okay/yes/so, English, another Kutchi word), the target said twice, too long.
"""
import re
import unicodedata

from rapidfuzz.distance import Levenshtein
from unidecode import unidecode

try:
    from indic_transliteration import sanscript
except ImportError:  # pragma: no cover
    sanscript = None

STRONG = 0.7       # a transcript at or above this matches the target
WORD_OK = 0.6      # each transcribed word must be at least this close to some part of the target
COVER = 0.6        # each target word must be heard at least this closely
# Final-vowel classes: Kutchi marks gender and number on the ending (hakro/hakri, ambo/amba, chokro/chokri).
ENDING = {"a": "a", "e": "i", "i": "i", "o": "u", "u": "u", "w": "u"}
INDIC = [("gujarati", 0x0A80, 0x0AFF), ("devanagari", 0x0900, 0x097F), ("gurmukhi", 0x0A00, 0x0A7F),
         ("bengali", 0x0980, 0x09FF), ("oriya", 0x0B00, 0x0B7F), ("tamil", 0x0B80, 0x0BFF),
         ("telugu", 0x0C00, 0x0C7F), ("kannada", 0x0C80, 0x0CFF), ("malayalam", 0x0D00, 0x0D7F)]
# Scripts written without most vowels (Urdu, Arabic, Sindhi, Persian, Hebrew): compared by consonants.
ABJAD = [(0x0590, 0x05FF), (0x0600, 0x06FF), (0x0750, 0x077F), (0xFB50, 0xFDFF), (0xFE70, 0xFEFF)]
FILLER = {"ok", "okay", "yes", "yeah", "ya", "yep", "so", "hmm", "hm", "mm", "mhm", "um", "uh", "er", "erm",
          "ah", "oh", "right", "and", "the", "a", "i", "you", "it", "is", "that", "this", "no", "thank", "thanks",
          "bye", "good", "well", "like", "god", "bless", "question", "section", "number"}


def to_latin(t):
    out, buf, script = [], [], None

    def flush():
        if buf:
            s = "".join(buf)
            lat = sanscript.transliterate(s, script, "iast") if sanscript else s
            # The inherent vowel is not said at a word's end (मटर is matar, not matara).
            base = next(a for n, a, b in INDIC if n == script)
            parts = re.split(r"(\s+)", s)
            lparts = re.split(r"(\s+)", lat)
            if len(parts) == len(lparts):
                lparts = [lw[:-1] if pw and base + 0x15 <= ord(pw[-1]) <= base + 0x39 and lw.endswith("a") else lw
                          for pw, lw in zip(parts, lparts)]
                lat = "".join(lparts)
            out.append(lat)
            buf.clear()
    for ch in t or "":
        sc = next((n for n, a, b in INDIC if a <= ord(ch) <= b), None)
        if sc and sanscript:
            if script != sc:
                flush()
                script = sc
            buf.append(ch)
        else:
            flush()
            script = None
            out.append(ch)
    flush()
    s = unidecode("".join(out))
    return unicodedata.normalize("NFKC", s)


def phon(w):
    """Loose phonetic key for one word."""
    w = w.lower()
    w = re.sub(r"[^a-z]", "", w)
    w = w.replace("ph", "f").replace("ch", "C").replace("sh", "s").replace("ck", "k")
    w = re.sub(r"([bcdfgjklmnpqrstvwxzC])h", r"\1", w)   # kh, gh, th, dh, bh -> k, g, t, d, b
    w = re.sub(r"([aeiou])h$", r"\1", w)                  # nah, haah -> na, ha
    w = w.replace("v", "w").replace("z", "j").replace("q", "k").replace("x", "ks").replace("y", "i")
    w = w.replace("c", "k").replace("C", "c")
    w = w.replace("ee", "i").replace("oo", "u").replace("ou", "u").replace("aa", "a")
    return re.sub(r"(.)\1+", r"\1", w)


def loose(w):
    return re.sub(r"[ou]", "a", w).replace("e", "i")


def skel(w):
    return re.sub(r"[aeiouh]", "", w)


def sim(a, b, skeleton=True):
    """Similarity of two phonetic keys; for single words the consonant skeleton counts too (transcribers
    spell Kutchi vowels every way: matar / mutter), never for phrases (too loose)."""
    if not a or not b:
        return 0.0
    full = Levenshtein.normalized_similarity(a, b)
    # Short vowels blur (cup / kap / kop, matar / mutter): a, o, u and e, i compared as two vowels.
    full = max(full, 0.95 * Levenshtein.normalized_similarity(loose(a), loose(b)))
    if not skeleton:
        return full
    sa, sb = skel(a), skel(b)
    sk = 0.9 * Levenshtein.normalized_similarity(sa, sb) if min(len(sa), len(sb)) >= 3 else 0.0
    return max(full, sk)


def target_forms(target):
    """Spoken forms of a manifest line: 'a / b' alternatives, the line itself."""
    forms = [p.strip() for p in re.split(r"\s*/\s*", target or "") if p.strip()]
    return forms or [target or ""]


def words(t):
    return [w for w in re.split(r"[^A-Za-z0-9']+", t) if w]


def is_abjad(raw):
    letters = [c for c in raw if c.isalpha()]
    ab = sum(1 for c in letters if any(a <= ord(c) <= b for a, b in ABJAD))
    return bool(letters) and ab >= 0.5 * len(letters)


def askel(w):
    """Consonant key for vowel-less scripts: also drops w and y, which they use as vowel letters."""
    return re.sub(r"[aeiouhwy]", "", w)


def merge_split(xw, tw, key, simf):
    """Join neighbouring transcript words when together they match a target word better
    (transcribers split Kutchi words: 'am li' for amli, 'saath hai' for sathe)."""
    out = []
    for w in xw:
        if out:
            a = max(simf(key(out[-1]), key(t)) for t in tw)
            b = max(simf(key(w), key(t)) for t in tw)
            j = max(simf(key(out[-1] + w), key(t)) for t in tw)
            if j >= WORD_OK and j > max(a, b):
                out[-1] = out[-1] + w
                continue
        out.append(w)
    return out


def check(transcript, target):
    """(strength, reasons). Strength is the best match to any spoken form of the target."""
    raw = (transcript or "").strip()
    reasons = []
    if not raw or raw.startswith("[error"):
        return 0.0, ["nothing heard"]
    if re.search(r"[\[\(\*].*?(laugh|giggle|chuckle|music|noise|cough|sigh|inaudible|applause).*?[\]\)\*]|"
                 r"\b(ha ?ha|haha|hehe)\b", raw, re.I):
        reasons.append("laughter or a sound tag")
    abjad = is_abjad(raw)
    lat = to_latin(raw)
    lat = re.sub(r"[\[\(].*?[\]\)]", " ", lat)
    ws = words(lat)
    if any(re.fullmatch(r"[A-Za-z]{1,2}\d+[a-z]?|\d+", w) for w in ws) or \
            re.search(r"\b[A-Za-z]\s?-\s?\d+", lat):
        reasons.append("a question id or number")
    if abjad:   # compare consonants only, a little less trusted
        key = askel

        def simf(a, b):
            return 0.9 * Levenshtein.normalized_similarity(a, b) if a and b else 0.0
    else:
        def key(w):
            return w
        simf = sim
    best, best_reasons = 0.0, None
    for form in target_forms(target):
        tw = [phon(w) for w in words(to_latin(form))]
        tw = [w for w in tw if w]
        tj = "".join(tw)
        orig = {}
        xw = []
        for w in ws:
            if phon(w):
                xw.append(phon(w))
                orig[xw[-1]] = w
        if not xw or not tj:
            continue
        xw = merge_split(xw, tw, key, simf)
        xj = "".join(xw)
        kt, kx, ktj, kxj = [key(t) for t in tw], [key(w) for w in xw], key(tj), key(xj)
        r = []
        single = len(tw) == 1
        strength = simf(kxj, ktj) if abjad else sim(xj, tj, skeleton=single)
        # Every transcribed word must belong to the target: close to a target word, or to a stretch of
        # the joined target (transcribers split and join Kutchi words differently).
        for w, k in zip(xw, kx):
            o = orig.get(w, w)
            if not k:  # only vowel letters (Urdu 'yeh', 'aai'): fine only where the target has such a word
                if not any(not x for x in kt):
                    r.append(f"extra word '{o}'")
                continue
            if len(k) <= 2:
                close = 1.0 if k in ktj else max(simf(k, t) for t in kt)
            else:
                close = max([simf(k, t) for t in kt] + [_sub_sim(k, ktj)])
            if close < WORD_OK or (o.lower() in FILLER and w not in tw and close < 0.8):
                r.append(f"extra word '{o}'")
        # Every target word must be heard (a one-letter word like the vocative 'e' may be swallowed).
        for t, k in zip(tw, kt):
            if len(t) < 2 or not k:
                continue
            if len(k) >= 3:
                got = max([simf(w, k) for w in kx] + [_sub_sim(k, kxj)])
            elif abjad:
                got = float(k in kxj)
            else:  # a two-letter word: itself, or its consonant with any vowel (je / ja, me / mi)
                got = float(t in xj or (t[0] not in "aeiou" and re.search(t[0] + "[aeiou]", xj) is not None))
            if got < COVER:
                r.append(f"missing word '{t}'")
        # The ending: the transcript word that matches a target word must not end in another vowel class.
        for t, k in zip(tw, kt):
            if len(t) < 3:
                continue
            if t[-1] not in "aeiou":
                # A consonant-final word heard with a vowel added (garam -> garame) is another form.
                if not abjad:
                    cand = [(sim(w, t), w) for w in xw if len(w) == len(t) + 1]
                    if cand:
                        sc, w = max(cand)
                        if sc >= 0.75 and w[-1] in "aeiou" and w[:-1][-1:] == t[-1] and \
                                Levenshtein.normalized_similarity(loose(w[:-1]), loose(t)) >= 0.75:
                            r.append(f"ending '{w}' for '{t}'")
                continue
            cand = [(simf(kw, k), w) for w, kw in zip(xw, kx) if abs(len(kw) - len(k)) <= 1]
            if not cand:
                continue
            sc, w = max(cand)
            if sc >= 0.6 and w[-1] in ENDING and ENDING[w[-1]] != ENDING[t[-1]]:
                r.append(f"ending '{w}' for '{t}'")
        # The target twice, or much more than the target.
        if len(kxj) > 1.35 * len(ktj) + 1:
            rep = sum(1 for w in kx if max(simf(w, t) for t in kt) >= 0.7)
            r.append("target repeated" if rep > len(tw) else "longer than the target")
        if strength > best or best_reasons is None:
            best, best_reasons = strength, r
    if best_reasons is None:
        return 0.0, reasons + ["nothing heard"]
    return round(best, 3), reasons + best_reasons


def _sub_sim(w, tj):
    """Best similarity of w to any stretch of the joined target of about w's length."""
    n = len(w)
    if n < 3 or n > len(tj):
        return 0.0
    best = 0.0
    for L in (n - 1, n, n + 1):
        if L < 2 or L > len(tj):
            continue
        for i in range(len(tj) - L + 1):
            best = max(best, Levenshtein.normalized_similarity(w, tj[i:i + L]))
    return best


def verdict(transcripts, target):
    """Both blind transcripts must match the target with no reasons against."""
    out = {}
    for m, t in transcripts.items():
        s, r = check(t, target)
        out[m] = {"text": t, "strength": s, "reasons": r}
    ok = all(v["strength"] >= STRONG and not v["reasons"] for v in out.values())
    return ok, out
