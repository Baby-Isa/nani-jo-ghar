#!/usr/bin/env python3
"""Build Brief v4 section 7: every sentence whose Kutchi is blank, used by
any errand, with its English and where it's used. Never invents Kutchi -
this report exists so the family knows exactly what's still needed."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    with open(os.path.join(ROOT, p)) as f:
        return json.load(f)


def main():
    content = load("data/content.json")
    errands = load("data/errands.json")["errands"]

    sentences_by_id = {s["id"]: s for s in content["sentences"]}
    used_ids = set()
    usage = {}

    def use(sid, where):
        used_ids.add(sid)
        usage.setdefault(sid, []).append(where)

    # fixed lines used by every errand, regardless of content
    for fixed in ["snt-01", "snt-02", "snt-03", "snt-06", "snt-07", "snt-08",
                  "snt-10", "snt-11", "snt-13", "snt-14"]:
        use(fixed, "every errand (fixed shell/bazaar line)")

    for e in errands:
        eid = e["id"]
        if e.get("intro_beat"):
            use(e["intro_beat"]["line_id"], f"{eid}: intro beat")
        if e.get("outro_beat"):
            use(e["outro_beat"]["line_id"], f"{eid}: outro beat")
        for wid in e["kitchen"]["pre_exposure"]:
            use(wid, f"{eid}: kitchen pre-exposure (word)")
        for it in e["kitchen"]["items"]:
            use(it["word_id"], f"{eid}: shopping list (word)")

    words_by_id = {w["id"]: w for w in content["words"]}

    lines = []
    lines.append("# Lines needing the family\n")
    lines.append("Every sentence or word used by an errand whose Kutchi is blank or "
                  "still a draft, with its English and where it's used. Per project rule, "
                  "nothing here is invented - draft lines are marked `*` in-game until "
                  "confirmed.\n")

    lines.append("## Sentences with NO Kutchi yet (English-only in game, never spoken)\n")
    missing = [(sid, sentences_by_id[sid]) for sid in used_ids
               if sid in sentences_by_id and not sentences_by_id[sid].get("kutchi")]
    if missing:
        lines.append("| id | English | Used |")
        lines.append("| --- | --- | --- |")
        for sid, s in sorted(missing):
            where = "; ".join(usage.get(sid, []))
            lines.append(f"| {sid} | {s['english']} | {where} |")
    else:
        lines.append("None.")
    lines.append("")

    lines.append("## Sentences still DRAFT (spoken, but marked `*` until confirmed)\n")
    draft = [(sid, sentences_by_id[sid]) for sid in used_ids
             if sid in sentences_by_id and sentences_by_id[sid].get("kutchi", {}) and sentences_by_id[sid]["kutchi"].get("is_draft")]
    if draft:
        lines.append("| id | English | Draft Kutchi | Used |")
        lines.append("| --- | --- | --- | --- |")
        for sid, s in sorted(draft):
            where = "; ".join(usage.get(sid, []))
            lines.append(f"| {sid} | {s['english']} | {s['kutchi']['text']} | {where} |")
    else:
        lines.append("None.")
    lines.append("")

    lines.append("## Words still DRAFT (spoken, but marked `*` until confirmed)\n")
    word_draft = [(wid, words_by_id[wid]) for wid in used_ids
                  if wid in words_by_id and words_by_id[wid].get("kutchi", {}) and words_by_id[wid]["kutchi"].get("is_draft")]
    if word_draft:
        lines.append("| id | English | Draft Kutchi | Used |")
        lines.append("| --- | --- | --- | --- |")
        for wid, w in sorted(word_draft):
            where = "; ".join(usage.get(wid, []))
            lines.append(f"| {wid} | {w['english']} | {w['kutchi']['text']} | {where} |")
    else:
        lines.append("None.")
    lines.append("")

    out_dir = os.path.join(ROOT, "build", "reports")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "lines-needing-family.md")
    with open(out_path, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {out_path}: {len(missing)} missing, {len(draft)} draft sentences, {len(word_draft)} draft words")


if __name__ == "__main__":
    main()
