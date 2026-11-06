#!/usr/bin/env python3
"""The redo list from a colour scan (Zafar, 6 Nov: every existing picture under the stricter rules, and redo runs for all that
fail; ART-45). Reads the JSON that `artcolour.py --json` writes (one or more files: the four scan jobs), re-applies the
current palette and sky rule to each picture's stored colours (--rescore: a re-tune needs no new scan; the light and shadow
verdicts are kept as scanned, the sky's saturation is re-measured from its pixels), keeps the shipped pictures (named or
built by a page) and writes the redo list as YAML and CSV, with counts by area.

  python3 build/tools/art/artcolour.py assets/clinic --batch-by auto --quiet --json /tmp/scan/clinic.json   # (four jobs)
  python3 build/tools/art/artredo.py /tmp/scan/*.json --rescore --yaml docs/design-language/art-plans/redo-strict-2026-11-06.yaml \\
      --csv docs/design-language/art-plans/redo-strict-2026-11-06.csv --keep-from OLD.yaml

fix:  hue-pull   the generator's sky blue on a toothbrush or plaster picture: recolour.py pulls it to Olympic Blue (no run)
      recolour   a run that keeps the drawing and moves its colours into one combination (its strip attached)
      redraw     a new picture: wrong light, most of its colour off one combination, or a sky (the sky block)
      re-cut     erase a baked shadow (artcut.py), redrawn if a re-cut cannot
block: which redo block takes it (clinic, cook, sky, hue-pull, day: when day is next touched, none: an icon or proto no game
      plays). --keep-from copies the wood and batches_to_eye sections of an earlier list (those rules did not change)."""
import argparse
import csv
import fnmatch
import glob
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import artcolour as A  # noqa: E402

AREAS = [("cook-backgrounds", ["assets/cook/bg/*", "assets/cook/worktop-*", "assets/cook/tiles-*"]),
         ("cook-items", ["assets/cook/*"]), ("clinic", ["assets/clinic/*"]),
         ("shared", ["assets/shared/*", "assets/shell/*", "assets/ui/*"]), ("other-modes", ["assets/*"])]
HUE_PULL = ["*toothbrush*", "*brushing*", "*plaster*"]  # recolour.py's list: the sky blue on these, pulled in post
NO_REDO = ["assets/items/*", "assets/cook/items/icon-*", "*-proto/*", "assets/*/proto/*", "assets/cook/proto/*"]  # icons and protos: not at all (Fable)


def area_of(rel):
    return next(a for a, gs in AREAS if any(fnmatch.fnmatch(rel, g) for g in gs))


def matches(rel, globs):
    return any(fnmatch.fnmatch(rel, g) for g in globs)


def sky_blue(m):
    """The generator's bright sky blue: a blue whose nearest book colour is Olympic, Pale King's or Salvia Blue, over ΔE 8."""
    return m["nearest"] in ("Olympic Blue", "Pale King's Blue", "Salvia Blue", "Cerulian Blue", "Antwarp Blue") and m["de"] >= 8


def rescore(r, R):
    rel = os.path.relpath(os.path.abspath(r["file"]), A.REPO)
    cols = [dict(c, lab=np.array(c["lab"], float)) for c in r.get("colours", [])]
    pf = A.palette_fit(cols, R, r["file"])
    fail = [f for f in r["fail"] if not f.startswith(("palette", "sky"))]
    exc = []
    if pf["mode"] == "sky":
        full = A.analyse(os.path.join(A.REPO, rel), R)
        fail += [f for f in full["fail"] if f.startswith("sky")]
    elif pf["allowed"]:
        pass
    elif pf["off"]:
        exc.append("palette exception")
    elif not pf["fit"]:
        fail.append("palette (natural)" if pf["mode"] == "natural" else "palette")
    return dict(r, fail=fail, exception=exc, palette=pf)


def fix_of(rel, r):
    pf, fl = r["palette"], r["fail"]
    light = any(f.startswith("light") for f in fl)
    shadow = any(f.startswith("baked shadow") for f in fl)
    pal = [f for f in fl if f.startswith("palette")]
    sky = any(f.startswith("sky") for f in fl)
    if sky:
        return "redraw", "sky"
    off = [m for m in pf.get("main", []) if not m.get("in_combo") and not m.get("accent")]
    if (pal or r["exception"]) and matches(rel, HUE_PULL) and all(sky_blue(m) for m in (off or pf.get("off", []))) and not light:
        return ("re-cut" if shadow else "hue-pull"), "hue-pull"
    block = "none" if matches(rel, NO_REDO) else {"clinic": "clinic", "cook-items": "cook", "cook-backgrounds": "cook"}.get(area_of(rel), "day")
    if light or (pal and sum(m["share"] for m in off) > 0.5):
        return "redraw", block
    if shadow and not pal:
        return "re-cut", block
    return "recolour", block


def q(s):
    return json.dumps(s, ensure_ascii=False)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], epilog=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("scans", nargs="+", help="artcolour.py --json files")
    ap.add_argument("--rescore", action="store_true", help="re-apply the current palette and sky rule to the stored colours")
    ap.add_argument("--yaml")
    ap.add_argument("--csv")
    ap.add_argument("--keep-from", help="copy the wood and batches_to_eye sections of this earlier YAML list")
    a = ap.parse_args(argv)
    R = A.rules()
    res = []
    for f in a.scans:
        for p in sorted(glob.glob(f)):
            res += json.load(open(p))["results"]
    rows, exc, counts = [], [], {}
    for r in res:
        if r.get("ref") not in ("named", "built") or r.get("context"):
            continue
        rel = os.path.relpath(os.path.abspath(r["file"]), A.REPO)
        if a.rescore:
            r = rescore(r, R)
        ar = area_of(rel)
        c = counts.setdefault(ar, {"shipped": 0, "PASS": 0, "FLAG": 0, "EXCEPTION": 0, "FAIL": 0})
        lv = A.level(r)
        c["shipped"] += 1
        c[lv] += 1
        pf = r.get("palette") or {}
        if r.get("exception"):
            exc.append((rel, ar, r))
        if not r["fail"]:
            continue
        fix, block = fix_of(rel, r)
        rows.append({"area": ar, "file": rel, "broken": sorted({f.split(":")[0].split(" ")[0] for f in r["fail"]}), "fix": fix, "block": block,
                     "combination": pf.get("combo"), "combination_colours": pf.get("colours", []), "mode": pf.get("mode", "item"),
                     "off_combination": ["%s %s %.0f%%" % (m["hex"], m["words"], m["share"] * 100) for m in pf.get("main", []) if not m.get("in_combo") and not m.get("accent")],
                     "light": next((f for f in r["fail"] if f.startswith("light")), ""), "shadow": next((f for f in r["fail"] if f.startswith("baked")), ""),
                     "sky": next((f for f in r["fail"] if f.startswith("sky")), "")})
    tot = {k: sum(c[k] for c in counts.values()) for k in ("shipped", "PASS", "FLAG", "EXCEPTION", "FAIL")}
    print("shipped %(shipped)d: %(PASS)d pass, %(FLAG)d flag, %(EXCEPTION)d exception, %(FAIL)d fail" % tot)
    for ar, c in counts.items():
        fx = {}
        for x in rows:
            if x["area"] == ar:
                fx[x["fix"]] = fx.get(x["fix"], 0) + 1
        print("  %-17s %4d shipped, %4d pass, %3d flag, %2d exception, %3d fail; %s" % (ar, c["shipped"], c["PASS"], c["FLAG"], c["EXCEPTION"], c["FAIL"], ", ".join("%s %d" % kv for kv in sorted(fx.items()))))
    by_block = {}
    for x in rows:
        by_block[x["block"]] = by_block.get(x["block"], 0) + 1
    print("  by block: " + ", ".join("%s %d" % kv for kv in sorted(by_block.items())))
    if a.yaml:
        P = R["palette"]
        L = ["# The strict redo list, re-cut after Fable's view (6 Nov): every shipped picture that still breaks a rule once the measure",
             "# was re-tuned (tones of one material merged, neutrals up to chroma 14, one in-book accent, natural things by natural bands,",
             "# people by eye, skies by the sky rule). Made by build/tools/art/artredo.py from an artcolour.py scan of assets/ (shipped by",
             "# reference). fix: hue-pull (recolour.py, no run), recolour, redraw, re-cut. block: the redo block that takes it (clinic,",
             "# cook, sky, hue-pull; day: when day is next touched; none: an icon or proto no game plays).",
             "# Report: build/reports/art-review-strict-2026-11-06.md ('After Fable's view: re-tuned'). Thresholds: build/tools/art/data/look-rules.json.",
             "date: 2026-11-06",
             "rules: {combo_de: %s, main_share: %s, neutral_chroma: %s, hue_merge: %s, accent_share: %s, exception_de: %s}" % (P["combo_de"], P["main_share"], P["neutral_chroma"], P["hue_merge"], P["accent_share"], P["exception_de"]),
             "redo:"]
        for ar in [x[0] for x in AREAS]:
            mine = [x for x in rows if x["area"] == ar]
            if not mine:
                continue
            L.append("  %s:  # %d" % (ar, len(mine)))
            for x in sorted(mine, key=lambda x: x["file"]):
                L.append("    - file: %s" % q(x["file"]))
                for k in ("broken", "fix", "block", "mode", "combination", "combination_colours", "off_combination", "light", "shadow", "sky"):
                    if x[k] not in ("", [], None) and not (k == "mode" and x[k] == "item"):
                        L.append("      %s: %s" % (k, q(x[k]) if not isinstance(x[k], int) else x[k]))
        L.append("exceptions:  # Zafar decides: keep (palette.allow in look-rules.json) or recolour; %d" % len(exc))
        for rel, ar, r in sorted(exc):
            L.append("  - file: %s" % q(rel))
            L.append("    area: %s" % ar)
            L.append("    colours: %s" % q(["%s %s %.0f%% (nearest Wada %s, ΔE %.0f)" % (m["hex"], m["words"], m["share"] * 100, m["nearest"], m["de"]) for m in r["palette"]["off"]]))
        if a.keep_from:
            old = open(a.keep_from).read()
            i = old.find("\nwood:")
            if i >= 0:
                L.append(old[i + 1:].rstrip("\n"))
        open(a.yaml, "w").write("\n".join(L) + "\n")
        print("wrote %s" % a.yaml)
    if a.csv:
        with open(a.csv, "w", newline="") as fh:
            w = csv.writer(fh)
            w.writerow(["area", "file", "broken", "fix", "block", "mode", "combination", "combination_colours", "off_combination", "light", "shadow", "sky"])
            for x in sorted(rows, key=lambda x: (x["area"], x["file"])):
                w.writerow([x["area"], x["file"], ";".join(x["broken"]), x["fix"], x["block"], x["mode"], x["combination"] or "", "; ".join(x["combination_colours"]),
                            "; ".join(x["off_combination"]), x["light"], x["shadow"], x["sky"]])
        print("wrote %s" % a.csv)
    return 0


if __name__ == "__main__":
    sys.exit(main())
