#!/usr/bin/env python3
"""Generate the ChatGPT / Claude-in-Chrome paste block from a pack's run spec and art plan (art-pipeline.md
"Art tools"). A new pack's block is generated, never hand-written.

  python3 build/tools/art/artblock.py --check                       # validate the spec against the plan (no output)
  python3 build/tools/art/artblock.py                               # write docs/design-language/art-plans/<pack>-chrome-block.txt
  python3 build/tools/art/artblock.py --stdout                      # print it instead
  python3 build/tools/art/artblock.py --redo docs/design-language/art-plans/clinic-heal-redo-list.yaml
                                                                    # a redo block: only those lines (+ the edits that follow them)
  python3 build/tools/art/artblock.py --sync-doc                    # copy the runner loop into art-pipeline.md between its markers

Inputs: build/tools/art/specs/<pack>.run.yaml (people, templates, run order, checks, runner knobs), the plan's PEOPLE
table and prompt headings (a line whose prompt is missing from the plan is refused), and templates/block.txt +
templates/runner-loop.txt (the generic text). Prints a one-line summary; the block is a file, never a dump."""
import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import artspec as S  # noqa: E402

REPO = S.REPO
HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = os.path.join(HERE, "specs", "clinic-heal-v3.run.yaml")
DOC = os.path.join(REPO, "docs/design-language/art-pipeline.md")


def tpl(name):
    return open(os.path.join(HERE, "templates", name)).read().rstrip("\n")


def fill(text, vals):
    for k, v in vals.items():
        text = text.replace("{{%s}}" % k, str(v))
    left = re.findall(r"\{\{(\w+)\}\}", text)
    if left:
        raise SystemExit("unfilled placeholder(s): %s" % ", ".join(sorted(set(left))))
    return text


def att_str(a):
    n = a["name"]
    s = ("kept:" + n) if a["kind"] in ("kept", "edit-kept") else n
    if a["kind"] in ("edit-kept", "edit-ref"):
        s = "edit: " + s
    return s + (" (leave it out if it was skipped)" if a["optional"] else "")


def check_str(l):
    note = l.get("note", "")
    if not note:
        return l["check"]
    if note.startswith("compare"):
        return "%s (%s)" % (l["check"], note)
    return "%s + %s" % (l["check"], note)


def line_str(l):
    return "%s | %s | %s | %s" % (l["id"], ", ".join(att_str(a) for a in l["attach"]), l["save"], check_str(l))


def compress(ids):
    """['W1','W2','W3','W4','E1','M1'] -> 'W1 to W4, then E1, M1' (runs of 3+ in a letter prefix become 'to')."""
    out, i = [], 0
    while i < len(ids):
        m = re.match(r"([A-Z]+)(\d+)$", ids[i])
        j = i
        if m:
            while j + 1 < len(ids):
                n = re.match(r"([A-Z]+)(\d+)$", ids[j + 1])
                if n and n.group(1) == m.group(1) and int(n.group(2)) == int(re.match(r"([A-Z]+)(\d+)$", ids[j]).group(2)) + 1:
                    j += 1
                else:
                    break
        if j - i >= 2:
            out.append("%s to %s" % (ids[i], ids[j]))
            i = j + 1
        else:
            out.append(ids[i])
            i += 1
    # 'then' before the first head close-up (the first id that isn't a W)
    for k, s in enumerate(out):
        if k and not s.startswith("W") and out[k - 1].startswith("W"):
            out[k] = "then " + s
            break
    return ", ".join(out)


def part_text(part, lines, spec, only=None):
    """The run-order text of one part. Compact parts print the per-person templates once, then each person's items."""
    mine = [l for l in lines if l["part"] == part["id"] and (only is None or l["id"] in only)]
    if not mine:
        return None
    head = "PART %s: %s (%d)" % (part["id"], part["title"], len(mine))
    out = [head + (("\n" + part["intro"]) if part.get("intro") and only is None else "")]
    if part.get("compact") and only is None:
        out = [head, part["intro"]]
        seen = []
        for l in mine:
            if l["who"] and l["tid"] not in seen:
                seen.append(l["tid"])
                t = spec["templates"][l["tid"]]
                kw = {"p": "<p>", "sheet": "<sheet>"}
                fake = {"id": "<p>-" + l["tid"], "attach": [S._attach(a, kw) for a in t["attach"]], "save": S.sub(t["save"], **kw),
                        "check": t["check"], "note": S.sub(t.get("note", ""), **kw)}
                out.append(" " + line_str(fake))
        out.append("People, in this order:")
        for it in part["items"]:
            if "who" in it:
                n = sum(1 for l in mine if l["who"] == it["who"])
                sheet = spec["people"][it["who"]]["sheet"]
                extra = (" (%s)" % it["note"]) if it.get("note") else ""
                out.append(" %s (sheet %s): %s (%d)%s" % (it["who"], sheet, compress(it["ids"]), n, extra))
        limbs = [l for l in mine if not l["who"]]
        if limbs:
            out.append("Then the adult limbs. Limb set: %s; sheet %s:" % (limbs[0]["set"], limbs[0]["sheet"]))
            out += [" " + line_str(l) for l in limbs]
        out.append("If a person's sheet was skipped in part A, skip all of that person's lines (and the adult limbs if %s was skipped), and log it." % spec["limb_sets"]["adult"])
        out.append("Part %s done: post the part %s summary and carry on." % (part["id"], part["id"]))
        return "\n".join(out)
    out += [line_str(l) for l in mine]
    out.append(("Part %s done: post the part %s summary (see AT THE END) and carry on." % (part["id"], part["id"])) if part is not spec["parts"][-1] else "Part %s done." % part["id"])
    return "\n".join(out)


def load_redo(path, spec, lines, plan_ids):
    """The redo list: which lines, with why. Returns (selected line dicts renamed to -v2, notes, blocked, extra checks)."""
    import yaml
    r = yaml.safe_load(open(path))
    by_id = {l["id"]: l for l in lines}
    ids, why, blocked, checks = [], {}, [], dict(r.get("checks", {}))
    for it in r.get("redo", []):
        if it["id"] not in by_id:
            raise SystemExit("redo list: %s is not a line of the run" % it["id"])
        ids.append(it["id"])
        why[it["id"]] = it["why"]
    follow = sorted(S.dependants(lines, ids) & {l["id"] for l in lines if l["edit_of"] in set(ids) or (l["edit_of"] and l["edit_of"] in S.dependants(lines, ids))}, key=lambda i: [l["id"] for l in lines].index(i))
    sel = [by_id[i] for i in ids + follow]
    for i in follow:
        why[i] = "follows the redo of %s (an edit of it)" % by_id[i]["edit_of"]
    new = []
    for it in r.get("new", []):
        tid = it["tid"]
        if tid not in plan_ids or (it["template"]["check"] not in spec["checks"] and it["template"]["check"] not in checks):
            blocked.append("%s (%s): needs a prompt '#### %s.' in the plan and a check %s before it can run" % (it["id"], it["title"], tid, it["template"]["check"]))
            continue
        t = it["template"]
        new.append({"id": it["id"], "part": "R", "who": it.get("person"), "set": None, "sheet": None, "tid": tid,
                    "attach": [S._attach(a, {}) for a in t["attach"]], "save": t["save"], "check": t["check"], "note": it["title"]})
        why[it["id"]] = "new: " + it["title"]
    sel = sel + new
    redone = {l["id"] for l in sel}
    out = []
    for l in sel:
        l = dict(l)
        if l["id"] in why and not l["id"] in {n["id"] for n in new}:
            l["save"] = re.sub(r"-v(\d+)\.png$", lambda m: "-v%d.png" % (int(m.group(1)) + 1), l["save"])
        l["note"] = ("REDO: " + why[l["id"]]) if not l.get("note") or l["id"] not in {n["id"] for n in new} else l["note"] + " (REDO: new)"
        out.append(l)
    return out, blocked, checks, redone


def build(spec, redo_path=None):
    lines = S.expand(spec)
    people, limbs = S.plan_people(spec)
    plan_ids = S.plan_prompt_ids(spec)
    r = spec["runner"]
    repo, branch = spec["repo"], spec.get("plan_branch") or spec["raw_branch"]
    raw = "https://raw.githubusercontent.com/%s/%s/" % (repo, spec["raw_branch"])
    blocked, extra_checks = [], {}
    if redo_path:
        sel, blocked, extra_checks, _ = load_redo(redo_path, spec, lines, plan_ids)
        run_text = "REDO LIST (%d). Each line ends with REDO: what was wrong last time; judge for that first, then the whole check.\n" % len(sel)
        run_text += "\n".join(line_str(l) for l in sel)
        run_text += "\nA kept image that is not in this list is the one already in the repo; one that is in this list is the new one from this run (it waits for it)."
        if blocked:
            run_text += "\nNOT IN THIS RUN (no prompt yet; skip): " + "; ".join(blocked)
        count, used = len(sel), sel
    else:
        run_text = "\n\n".join(t for t in (part_text(p, lines, spec) for p in spec["parts"]) if t)
        count, used = len(lines), lines
    used_refs = {a["name"] for l in used for a in l["attach"] if a["kind"] in ("ref", "edit-ref")}
    w = max(len(k) for k in spec["refs"])
    refs = "\n".join(" %s RAW + %s" % (k.ljust(w + 1), v) for k, v in spec["refs"].items() if k in used_refs)
    check_ids = sorted({l["check"] for l in used}, key=lambda c: list(spec["checks"]).index(c) if c in spec["checks"] else 999)
    allc = dict(spec["checks"])
    allc.update({k: v for k, v in extra_checks.items()})
    checks = "\n".join("%s: %s" % (c, allc[c]["text"]) for c in check_ids if c in allc)
    real = spec.get("real_people")
    approvals = ("- Zafar approves only characters based on real people: Nani, Big Ma and the doctor (and any real family member). None is in this run.\n"
                 "- Everything else is yours to judge with the checks below. Don't stop to ask Zafar about any of it. If a prompt ever shows Nani, Big Ma, the doctor or another real person, skip it, log \"needs Zafar: likeness\" and carry on."
                 if not real else
                 "- Zafar approves characters based on real people. After each such image, post it and wait for his ok in this chat before using it; keep the other windows generating meanwhile.")
    vals = {
        "VERB": "redoing" if redo_path else "making", "COUNT": count, "PACK": spec["pack"], "DEST": spec["dest"],
        "WATCH": "Nobody needs to watch: none of these people is based on a real person, so you judge every image yourself (see APPROVALS)." if not real else "Zafar approves the likenesses (see APPROVALS).",
        "PAGE_URL": "https://github.com/%s/blob/%s/%s" % (repo, branch, spec["plan"]), "RAW": raw, "REFS": refs,
        "KEPT_NOTE": (", from this run if it is in the run order below, otherwise the one already in the repo at RAW + %s/<X's save-as name>" % spec["dest"]) if redo_path
        else ", already committed by you to RAW + %s/<X's save-as name>" % spec["dest"],
        "UPLOAD_URL": "https://github.com/%s/upload/main/%s" % (repo, spec["dest"]),
        "FOLDER_URL": "https://github.com/%s/tree/main/%s" % (repo, spec["dest"]),
        "LOOP": fill(tpl("runner-loop.txt"), {"WINDOWS": r["windows"], "GAP": r["send_gap_seconds"], "STALL": r["stall_minutes"], "HARD": r["hard_minutes"], "BATCH": r["commit_batch"], "FLUSH": r["flush_minutes"]}),
        "FIRST_PASS": ("FIRST-PASS NUMBERS (optional)\nIf your workspace has python and a clone of https://github.com/%s, run `python3 build/tools/art/artjudge.py --dir <the folder of your saved images> --only <ID>` on each kept image before your own look: a FAIL line is a redo, a FLAG line names what to look at hardest. It never replaces looking.\n\n" % repo),
        "APPROVALS": approvals, "WINDOWS": r["windows"], "GAP": r["send_gap_seconds"], "REDOS": r["redos"],
        "RUN_ORDER": run_text, "CHECKS": checks, "PASSFAIL": "\n".join("- " + x for x in spec["passfail"]),
    }
    return fill(tpl("block.txt"), vals) + "\n", blocked, count


def sync_doc():
    loop = fill(tpl("runner-loop.txt"), {"WINDOWS": "N", "GAP": "G", "STALL": "X", "HARD": "Y", "BATCH": "B", "FLUSH": "F"})
    txt = open(DOC).read()
    a, b = "<!-- runner-loop:start -->", "<!-- runner-loop:end -->"
    if a not in txt:
        raise SystemExit("art-pipeline.md has no runner-loop markers")
    i, j = txt.index(a) + len(a), txt.index(b)
    new = txt[:i] + "\n```\n" + loop + "\n```\n" + txt[j:]
    open(DOC, "w").write(new)
    print("art-pipeline.md: runner loop synced (%d lines)" % loop.count("\n"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], epilog=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--spec", default=SPEC)
    ap.add_argument("--out", help="output file (default: docs/design-language/art-plans/<pack>-chrome-block.txt, or -redo-block.txt)")
    ap.add_argument("--stdout", action="store_true")
    ap.add_argument("--redo", help="a redo list (YAML): build a block for just those lines")
    ap.add_argument("--check", action="store_true", help="validate the spec against the plan and the repo; write nothing")
    ap.add_argument("--sync-doc", action="store_true")
    a = ap.parse_args()
    if a.sync_doc:
        return sync_doc()
    spec = S.load(a.spec)
    bad = S.validate(spec)
    for k, v in spec["refs"].items():
        if not os.path.exists(os.path.join(REPO, v)):
            bad.append("reference %s: %s is not in the repo" % (k, v))
    if bad:
        print("%d problem(s) in the spec:" % len(bad))
        for b in bad:
            print("  - " + b)
        return 1
    if a.check:
        print("spec ok: %d lines, %d checks, %d references, every prompt is in the plan" % (len(S.expand(spec)), len(spec["checks"]), len(spec["refs"])))
        return 0
    text, blocked, count = build(spec, a.redo)
    if a.stdout:
        print(text)
        return 0
    out = a.out or os.path.join(REPO, "docs/design-language/art-plans", "%s-%s.txt" % (spec["pack"].replace("clinic-heal-v3", "clinic-heal"), "redo-block" if a.redo else "chrome-block"))
    open(out, "w").write(text)
    print("wrote %s: %d lines, %d chars%s" % (os.path.relpath(out, REPO), count, len(text), ("; NOT READY: %d" % len(blocked)) if blocked else ""))
    for b in blocked:
        print("  not ready: " + b)
    return 0


if __name__ == "__main__":
    sys.exit(main())
