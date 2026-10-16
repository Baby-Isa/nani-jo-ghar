"""Reads a pack's run spec (build/tools/art/specs/<pack>.run.yaml) and its art plan: expands the run order into
lines, resolves dependencies, parses the plan's PEOPLE table, and validates it all. Used by artblock.py and artjudge.py.
A one-off line may say `prompt: X` to paste another line's code box (s08: a branch's poses reuse the base prompts)."""
import os
import re

import yaml

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


def load(path):
    return yaml.safe_load(open(path))


def plan_text(spec):
    return open(os.path.join(REPO, spec["plan"])).read()


def plan_people(spec):
    """The art plan's PEOPLE table: prefix -> {name, keep, legs} (the slot texts), and the limb table: set -> who."""
    txt = plan_text(spec)
    people, limbs = {}, {}
    for m in re.finditer(r"^\| (\w+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$", txt, re.M):
        if m.group(1) in ("girl", "boy", "oldman", "oldwoman", "man", "woman"):
            people[m.group(1)] = {"name": m.group(2).strip(), "keep": m.group(3).strip(), "legs": m.group(4).strip()}
    for m in re.finditer(r"^\| (child|adult) \| ([^|]+) \|$", txt, re.M):
        limbs[m.group(1)] = m.group(2).strip()
    return people, limbs


def plan_prompt_ids(spec):
    """The IDs that have a prompt in the plan (a '#### ID. title' heading with a code box under it)."""
    return set(plan_prompt_boxes(spec))


def plan_prompt_boxes(spec):
    """ID -> the text of its code box (the words pasted into ChatGPT)."""
    txt = plan_text(spec)
    out = {}
    for m in re.finditer(r"^#### (\w+)\.[^\n]*\n(?:[^\n]*\n){0,3}?```[^\n]*\n(.*?)^```", txt, re.M | re.S):
        out[m.group(1)] = m.group(2)
    return out


# The slots the PEOPLE table fills (the clinic and s07 packs); any other {SLOT} in a code box is filled from the line's own
# `slots:` map (s08: one DP prompt serves every view and pose, the line says VIEW and POSE).
PEOPLE_SLOTS = {"NAME", "KEEP", "LEGS", "LIMB_WHO"}


def box_slots(box):
    return {s for s in re.findall(r"\{([A-Z_]+)\}", box)} - PEOPLE_SLOTS


def sub(s, **kw):
    for k, v in kw.items():
        s = s.replace("<%s>" % k, v)
    return s


def _attach(a, kw):
    """One attachment string -> {'kind': ref|kept|edit-kept|edit-ref, 'name': ..., 'optional': bool}."""
    a = sub(a, **kw)
    opt = a.endswith("?")
    a = a.rstrip("?")
    edit = a.startswith("edit:")
    a = a.replace("edit:", "").strip()
    if a.startswith("kept:"):
        return {"kind": "edit-kept" if edit else "kept", "name": a[5:], "optional": opt}
    return {"kind": "edit-ref" if edit else "ref", "name": a, "optional": opt}


def expand(spec):
    """The run order as a list of line dicts, in order: id, part, who (person prefix or None), set, sheet, tid (the
    prompt ID in the plan), attach, save, check, note, deps (line IDs it waits for), edit_of."""
    people = spec["people"]
    out = []

    def add(line):
        line["deps"] = [a["name"] for a in line["attach"] if a["kind"] in ("kept", "edit-kept") and not a["optional"]]
        line["optional_deps"] = [a["name"] for a in line["attach"] if a["kind"] in ("kept", "edit-kept") and a["optional"]]
        line["edit_of"] = next((a["name"] for a in line["attach"] if a["kind"] == "edit-kept"), None)
        out.append(line)

    for part in spec["parts"]:
        for it in part["items"]:
            for lid in it.get("lines", []):
                t = spec["lines"][lid]
                add({"id": lid, "part": part["id"], "who": t.get("person"), "set": None, "sheet": None, "tid": t.get("prompt", lid),
                     "attach": [_attach(a, {}) for a in t["attach"]], "save": t["save"], "check": t["check"], "note": t.get("note", ""),
                     "slots": dict(t.get("slots") or {})})
            for tid in it.get("ids", []):
                if "who" in it:
                    p = it["who"]
                    sheet = people[p]["sheet"]
                    t = spec["templates"][tid]
                    kw = {"p": p, "sheet": sheet}
                    add({"id": "%s-%s" % (p, tid), "part": part["id"], "who": p, "set": people[p]["set"], "sheet": sheet, "tid": tid,
                         "attach": [_attach(a, kw) for a in t["attach"]], "save": sub(t["save"], **kw), "check": t["check"],
                         "note": sub(t.get("note", ""), **kw)})
                else:
                    s = it["set"]
                    sheet = spec["limb_sets"][s]
                    t = spec["limb_templates"][tid]
                    kw = {"set": s, "sheet": sheet}
                    add({"id": "%s-%s" % (s, tid), "part": part["id"], "who": None, "set": s, "sheet": sheet, "tid": tid,
                         "attach": [_attach(a, kw) for a in t["attach"]], "save": sub(t["save"], **kw), "check": t["check"], "note": ""})
    return out


def dependants(lines, ids):
    """Every line that (directly or not) waits for any of `ids`."""
    got, grew = set(ids), True
    while grew:
        grew = False
        for l in lines:
            if l["id"] not in got and any(d in got for d in l["deps"] + l["optional_deps"]):
                got.add(l["id"])
                grew = True
    return got - set(ids)


def validate(spec):
    """A list of problems (empty = fine)."""
    bad = []
    lines = expand(spec)
    ids = {l["id"] for l in lines}
    people, limbs = plan_people(spec)
    boxes = plan_prompt_boxes(spec)
    prompts = set(boxes)
    saves = {}
    for p in spec["people"]:
        if p not in people:
            bad.append("person %s is not in the plan's PEOPLE table" % p)
    for s in spec["limb_sets"]:
        if s not in limbs:
            bad.append("limb set %s is not in the plan's limb table" % s)
    for l in lines:
        if l["save"] in saves:
            bad.append("%s and %s both save as %s" % (l["id"], saves[l["save"]], l["save"]))
        saves[l["save"]] = l["id"]
        if l["tid"] not in prompts:
            bad.append("%s: the plan has no prompt %s (a '#### %s.' heading with a code box)" % (l["id"], l["tid"], l["tid"]))
        else:
            want, got = box_slots(boxes[l["tid"]]), set(l.get("slots") or {})
            if want - got:
                bad.append("%s: prompt %s needs the slot(s) %s on the line" % (l["id"], l["tid"], ", ".join(sorted(want - got))))
            if got - want:
                bad.append("%s: slot(s) %s are not in prompt %s" % (l["id"], ", ".join(sorted(got - want)), l["tid"]))
            for k, v in (l.get("slots") or {}).items():
                if not str(v).strip() or "\n" in str(v):
                    bad.append("%s: slot %s is empty or spans lines" % (l["id"], k))
        if l["check"] not in spec["checks"]:
            bad.append("%s: no check %s" % (l["id"], l["check"]))
        for a in l["attach"]:
            if a["kind"] in ("ref", "edit-ref") and a["name"] not in spec["refs"]:
                bad.append("%s: reference %s is not in refs" % (l["id"], a["name"]))
            if a["kind"] in ("kept", "edit-kept") and a["name"] not in ids and not a["optional"]:
                bad.append("%s: waits for %s, which is not in the run" % (l["id"], a["name"]))
    return bad
