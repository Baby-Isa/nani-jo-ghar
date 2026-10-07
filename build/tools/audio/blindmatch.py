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

STRONG = 0.62      # a transcript at or above this matches the target
WORD_OK = 0.5      # each transcribed word must be at least this close to some part of the target
INDIC = [("gujarati", 0x0A80, 0x0AFF), ("devanagari", 0x0900, 0x097F), ("gurmukhi", 0x0A00, 0x0A7F),
         ("bengali", 0x0980, 0x09FF)]
FILLER = {"ok", "okay", "yes", "yeah", "ya", "yep", "so", "hmm", "hm", "mm", "mhm", "um", "uh", "er", "erm",
          "ah", "oh", "right", "and", "the", "a", "i", "you", "it", "is", "that", "this", "no", "thank", "thanks",
          "bye", "good", "well", "like", "god", "bless", "question", "section", "number"}


def to_latin(t):
    out, buf, script = [], [], None

    def flush():
        if buf:
            s = "".join(buf)
            out.append(sanscript.transliterate(s, script, "iast") if sanscript else s)
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
    w = w.replace("v", "w").replace("z", "j").replace("q", "k").replace("x", "ks").replace("y", "i")
    w = w.replace("c", "k").replace("C", "c")
    w = w.replace("ee", "i").replace("oo", "u").replace("ou", "u").replace("aa", "a")
    return re.sub(r"(.)\1+", r"\1", w)


def skel(w):
    return re.sub(r"[aeiouh]", "", w)


def sim(a, b):
    if not a or not b:
        return 0.0
    full = Levenshtein.normalized_similarity(a, b)
    sa, sb = skel(a), skel(b)
    sk = 0.9 * Levenshtein.normalized_similarity(sa, sb) if min(len(sa), len(sb)) >= 3 else 0.0
    return max(full, sk)


def target_forms(target):
    """Spoken forms of a manifest line: 'a / b' alternatives, the line itself."""
    forms = [p.strip() for p in re.split(r"\s*/\s*", target or "") if p.strip()]
    return forms or [target or ""]


def words(t):
    return [w for w in re.split(r"[^A-Za-z0-9']+", t) if w]


def check(transcript, target):
    """(strength, reasons). Strength is the best match to any spoken form of the target."""
    raw = (transcript or "").strip()
    reasons = []
    if not raw or raw.startswith("[error"):
        return 0.0, ["nothing heard"]
    if re.search(r"[\[\(\*].*?(laugh|giggle|chuckle|music|noise|cough|sigh|inaudible|applause).*?[\]\)\*]|"
                 r"\b(ha ?ha|haha|hehe)\b", raw, re.I):
        reasons.append("laughter or a sound tag")
    lat = to_latin(raw)
    lat = re.sub(r"[\[\(].*?[\]\)]", " ", lat)
    ws = words(lat)
    if any(re.fullmatch(r"[A-Za-z]{1,2}\d+[a-z]?|\d+", w) for w in ws) or \
            re.search(r"\b[A-Za-z]\s?-\s?\d+", lat):
        reasons.append("a question id or number")
    best, best_reasons = 0.0, None
    for form in target_forms(target):
        tw = [phon(w) for w in words(to_latin(form))]
        tw = [w for w in tw if w]
        tj = "".join(tw)
        xw = [phon(w) for w in ws]
        xw = [w for w in xw if w]
        xj = "".join(xw)
        if not xj or not tj:
            continue
        r = []
        strength = sim(xj, tj)
        # Every transcribed word must belong to the target: close to a target word, or to a stretch of
        # the joined target (transcribers split and join Kutchi words differently).
        for w, orig in zip(xw, [w for w in ws if phon(w)]):
            close = max([sim(w, t) for t in tw] + [_sub_sim(w, tj)])
            if close < WORD_OK or (orig.lower() in FILLER and w not in tw and close < 0.8):
                r.append(f"extra word '{orig}'")
        # The target twice, or much more than the target.
        if len(xj) > 1.55 * len(tj) + 2:
            rep = sum(1 for w in xw if max(sim(w, t) for t in tw) >= 0.7)
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
