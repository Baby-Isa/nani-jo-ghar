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
    lid = l["id"] if l["tid"] == l["id"] else "%s (prompt %s)" % (l["id"], l["tid"])
    s = "%s | %s | %s | %s" % (lid, ", ".join(att_str(a) for a in l["attach"]), l["save"], check_str(l))
    slots = l.get("slots") or {}
    if slots:
        s += " | slots: " + "; ".join("{%s} = %s" % (k, v) for k, v in slots.items())
    return s


# How kept images leave ChatGPT. "github": the runner commits them itself (the default). "download": they stay in their chats
# and are downloaded for Zafar at the end from ChatGPT's Library page with Chrome's normal download, logged as "title -> save
# as" since the files cannot be renamed (s07, 15-16 Oct: ChatGPT serves images as in-page blob: URLs, the page-JavaScript
# route to GitHub was refused by Claude's safety classifier, and the Library page was the way the last 21 came down).
# A spec may set `approvals:` to replace the APPROVALS lines (s08: his ok on the first picture of each person gates the rest).
def delivery_texts(mode, spec):
    dest = spec["dest"]
    if mode == "github":
        return {
            "OPENING": "putting each one straight into the GitHub repo yourself. Work entirely inside Chrome: never download a file, never open a file picker or the Downloads folder, never ask Zafar to drag, attach or upload anything.",
            "PLACES": "The upload page: https://github.com/%s/upload/main/%s\nThe folder (to check and to resume): https://github.com/%s/tree/main/%s" % (spec["repo"], dest, spec["repo"], dest),
            "MOVING": tpl("moving-github.txt").replace("{{PACK}}", spec["pack"]),
            "SAFETY_COMMIT": "Commit only the images this run makes (and the log file at the end), only to the folder above. Attach to ChatGPT only the files each prompt's line names.",
            "STEP6": "Save the kept image (move 2 a and b) and queue it for the next batch commit.",
            "LOG_HEAD": "One line per kept image, used in its batch commit's description:\n <ID> | <time> | save as <the save-as name> | PASS or FAIL (<which points failed>) | redos: 0/1/2 | <notes>",
            "LOG_ALSO": "every \"NOT SAVED\" image, ",
            "RESUMING": "open the folder page: every committed file is a kept image (its commit's description holds its log line). Carry on from the first prompt in the run order whose save-as file isn't there.",
            "AT_END": "After each part, post a short list: passed, failed (and why), skipped or stalled (and why), not saved. Flush the SAVE queue before you post it. At the very end, also commit the whole log as %s/art-run-log.txt: on the folder page use \"Add file\" > \"Create new file\", paste the log, commit directly to main." % dest,
            "NOTES": "One line per prompt with its state: WAITING (a dependency isn't kept yet) · READY · GENERATING (tab, time sent) · KEPT (saved in your workspace, not yet committed) · COMMITTED · SKIPPED or STALLED (why). Two queues: READY (redos at the front, then run order) and SAVE (kept, not yet committed).",
            "DONE": "COMMITTED or SKIPPED",
            "PASS_SAVE": "Refill the freed slot at once (step 3). If the prompt you start needs this very picture, fetch and save it first (move 2, steps a and b only, into your workspace under its save-as name) and attach that local copy, never waiting for the GitHub commit; otherwise send first, then fetch and save it while the new prompt generates, and add it to SAVE.",
            "CHORE_NAMES": "committing to GitHub, fetching references, posting the log",
            "CHORES": "(a) commit SAVE (all queued files in one upload) when {{BATCH}} files are queued, or the oldest has waited {{FLUSH}} minutes, or a part has just ended; (b) fetch the references the next READY prompts need; (c) post the progress line and log.",
        }
    if mode == "download":
        return {
            "OPENING": "keeping each kept image in its own ChatGPT chat until the end, when you download them to Zafar's PC from ChatGPT's Library page with Chrome's normal download. Never move an image out of ChatGPT any other way: no page JavaScript, no GitHub uploads, no file pickers (last time that route was refused by your safety classifier and nothing landed). Zafar pushes the downloaded folder and your log to the repo himself.",
            "PLACES": "Nothing is committed to GitHub in this run: the kept images stay in their chats and are downloaded at the end (see AT THE END) from ChatGPT's Library page: https://chatgpt.com/library",
            "MOVING": tpl("moving-download.txt"),
            "SAFETY_COMMIT": "Commit nothing and upload nothing to GitHub. Attach to ChatGPT only the files each prompt's line names.",
            "STEP6": "Log the kept image: its save-as name, its chat's link (the address bar of that chat) and its chat's title (the name ChatGPT gave the chat: the Library page and the downloaded file carry it). It stays in that chat; never download it mid-run.",
            "LOG_HEAD": "One line per kept image:\n <ID> | <time> | save as <the save-as name> | PASS or FAIL (<which points failed>) | redos: 0/1/2 | chat: <that chat's link> | title: <that chat's title> | <notes>",
            "LOG_ALSO": "",
            "RESUMING": "read the log posted in this chat: every line with a chat link is a kept image. Carry on from the first prompt in the run order that has no such line.",
            "AT_END": "After each part, post a short list: passed, failed (and why), skipped or stalled (and why), each kept image with its chat link and title. At the very end, or as soon as Zafar says \"stop\" or \"download\" in this chat, post the whole log as one block, then download the kept images for Zafar, in the run order, one at a time: open https://chatgpt.com/library, find the kept image (by its chat's title and its thumbnail; the newest kept try of that chat), open it and download it with ChatGPT's own download button, which is Chrome's normal download into the Downloads folder. The file keeps the name ChatGPT gives it; you cannot rename it, so log each download at once, in order, as \"DOWNLOADED <n>: <ChatGPT's title, as the file is named> -> <save as>\". When every kept image is down, post the whole log once more with that numbered title -> save-as list at its end: Zafar renames from it and pushes the folder and the log to the repo himself. Never page JavaScript, never a GitHub upload, never a file picker. If a download is refused, say so, log it, and post the ordered list of chat links, titles and save-as names instead; Zafar downloads from it.",
            "NOTES": "One line per prompt with its state: WAITING (a dependency isn't kept yet) · READY · GENERATING (tab, time sent) · KEPT (judged, logged with its chat link) · SKIPPED or STALLED (why). One queue: READY (redos at the front, then run order).",
            "DONE": "KEPT or SKIPPED",
            "PASS_SAVE": "Refill the freed slot at once (step 3). A prompt that needs this very picture attaches it in its fresh chat from ChatGPT's own library (the \"+\" button, then \"Add from library\": the kept image is there under its chat), never by download and re-upload.",
            "CHORE_NAMES": "fetching references, posting the log",
            "CHORES": "(a) fetch the references the next READY prompts need; (b) post the progress line and log.",
        }
    raise SystemExit("delivery must be github or download, not %r" % mode)


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
                fake = {"id": "<p>-" + l["tid"], "tid": "<p>-" + l["tid"], "attach": [S._attach(a, kw) for a in t["attach"]], "save": S.sub(t["save"], **kw),
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
    if part.get("stop") and only is None:
        out.append(part["stop"])  # a gate: the part's own closing words (s08: wait for Zafar's pick), never "carry on"
    else:
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
    dv = delivery_texts(spec.get("delivery", "github"), spec)
    loop = fill(tpl("runner-loop.txt"), {"WINDOWS": r["windows"], "GAP": r["send_gap_seconds"], "STALL": r["stall_minutes"], "HARD": r["hard_minutes"],
                                         "NOTES": dv["NOTES"], "DONE": dv["DONE"], "PASS_SAVE": dv["PASS_SAVE"], "CHORES": dv["CHORES"], "CHORE_NAMES": dv["CHORE_NAMES"], "BATCH": r["commit_batch"], "FLUSH": r["flush_minutes"]})
    approvals = spec.get("approvals") or (
                 "- Zafar approves only characters based on real people: Nani, Big Ma and the doctor (and any real family member). None is in this run.\n"
                 "- Everything else is yours to judge with the checks below. Don't stop to ask Zafar about any of it. If a prompt ever shows Nani, Big Ma, the doctor or another real person, skip it, log \"needs Zafar: likeness\" and carry on."
                 if not real else
                 "- Zafar approves characters based on real people. After each such image, post it and wait for his ok in this chat before using it; keep the other windows generating meanwhile.")
    vals = {
        "VERB": "redoing" if redo_path else "making", "COUNT": count, "PACK": spec["pack"], "DEST": spec["dest"],
        "WATCH": "Nobody needs to watch: none of these people is based on a real person, so you judge every image yourself (see APPROVALS)." if not real else "Zafar approves the likenesses (see APPROVALS).",
        "PAGE_URL": "https://github.com/%s/blob/%s/%s" % (repo, branch, spec["plan"]), "RAW": raw, "REFS": refs,
        "PEOPLE_TABLE": ", and its PEOPLE table" if spec.get("people") else "",
        "SLOT_RULE": ("The only change allowed is filling the {NAME}, {KEEP}, {LEGS} and {LIMB_WHO} slots from the PEOPLE table"
                      if spec.get("people") else "The only change allowed is filling a code box's {SLOTS}")
        + (" and, where a line ends with \"slots:\", putting each slot's words from that line into the code box's matching {SLOT}, word for word (a code box with a {SLOT} is never sent unfilled)."
           if any(l.get("slots") for l in used) else "."),
        "KEPT_NOTE": (", from this run if it is in the run order below, otherwise the one already in the repo at RAW + %s/<X's save-as name>" % spec["dest"]) if redo_path
        else (", already committed by you to RAW + %s/<X's save-as name>" % spec["dest"]) if spec.get("delivery", "github") == "github"
        else ", still in its ChatGPT chat (attach it from ChatGPT's library, see below)",
        "LOOP": loop,
        "FIRST_PASS": "" if spec.get("delivery") == "download" else ("FIRST-PASS NUMBERS (optional)\nIf your workspace has python and a clone of https://github.com/%s, run `python3 build/tools/art/artjudge.py --dir <the folder of your saved images> --only <ID>` on each kept image before your own look: a FAIL line is a redo, a FLAG line names what to look at hardest. It never replaces looking.\n\n" % repo),
        "APPROVALS": approvals, "WINDOWS": r["windows"], "GAP": r["send_gap_seconds"], "REDOS": r["redos"],
        "RUN_ORDER": run_text, "CHECKS": checks, "PASSFAIL": "\n".join("- " + x for x in spec["passfail"]),
    }
    vals.update({k: v for k, v in dv.items() if k in ("OPENING", "PLACES", "MOVING", "SAFETY_COMMIT", "STEP6", "LOG_HEAD", "LOG_ALSO", "RESUMING", "AT_END")})
    return fill(tpl("block.txt"), vals) + "\n", blocked, count


def sync_doc():
    dv = delivery_texts("github", {"dest": "<dest>", "repo": "<repo>", "pack": "<pack>"})
    loop = fill(tpl("runner-loop.txt"), {"WINDOWS": "N", "GAP": "G", "STALL": "X", "HARD": "Y", "NOTES": dv["NOTES"], "DONE": dv["DONE"],
                                         "PASS_SAVE": dv["PASS_SAVE"], "CHORES": dv["CHORES"], "CHORE_NAMES": dv["CHORE_NAMES"], "BATCH": "B", "FLUSH": "F"})
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
