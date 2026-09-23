#!/usr/bin/env python3
"""
Nani jo Ghar - content pipeline: spreadsheet to JSON.

Reads the content master spreadsheet (the single source of truth, edited by
Zafar's mother and aunt) and writes the Word/Sentence content JSON the app
loads. Per project rule 4 (never author Kutchi), this script never invents
a Kutchi string: it uses kutchi_confirmed if present, otherwise
kutchi_draft flagged as a draft, otherwise leaves the field out entirely
(the app falls back to English-only for that line rather than showing
invented text).

Adding a scene later means adding rows to the spreadsheet and re-running
this script - no code changes here.
"""
import json
import openpyxl

XLSX = "/root/.claude/uploads/c3f105c0-81df-59cd-8106-67c359e5b821/8273f413-Nani_jo_Ghar_-_Content_Master.xlsx"
OUT = "/home/claude/game/data/content.json"

wb = openpyxl.load_workbook(XLSX, data_only=True)

def kutchi_of(row_dict):
    """confirmed if present, else draft flagged, else None (no invented text)."""
    confirmed = row_dict.get("kutchi_confirmed")
    draft = row_dict.get("kutchi_draft")
    if confirmed:
        return {"text": confirmed, "is_draft": False, "source": row_dict.get("draft_source")}
    if draft:
        return {"text": draft, "is_draft": True, "source": row_dict.get("draft_source")}
    return None

def sheet_rows(sheet_name):
    ws = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    header = None
    for row in rows:
        if row and row[0] == "id":
            header = row
            continue
        if header is None or row is None or row[0] is None:
            continue
        yield dict(zip(header, row))

# --- Words: fruit, vegetable, spice, number (bazaar scene only, per this build) ---
words = []
for r in sheet_rows("Scene — Bazaar"):
    wid = r["id"]
    if not (wid.startswith("fru-") or wid.startswith("veg-") or wid.startswith("spi-") or wid.startswith("num-")):
        continue
    k = kutchi_of(r)
    category = r.get("group")
    entry = {
        "id": wid,
        "english": r.get("english"),
        "category": category,
        "kutchi": k,
    }
    if wid.startswith(("fru-", "veg-", "spi-")):
        entry["image"] = f"items/{category}/{wid}.png"
    words.append(entry)

# --- Sentences: fixed frames (greeting, "I need {word}", "how many", etc.) ---
sentences = []
for r in sheet_rows("Sentences (Bazaar)"):
    k = kutchi_of(r)
    sentences.append({
        "id": r["id"],
        "function": r.get("function"),
        "english": r.get("english"),
        "kutchi": k,
        "slot": r.get("slot"),
    })

# --- Carrier sentences: one whole-sentence recording per bazaar item ---
carriers = {}
for r in sheet_rows("Carrier sentences"):
    wid = r.get("word_id")
    if not wid:
        continue
    singular = r.get("kutchi (auto, singular)")
    plural = r.get("kutchi (auto, 2x example)")
    carriers[wid] = {
        "english": r.get("english"),
        "kutchi_singular": singular,
        "kutchi_plural_example": plural,
        "is_draft": True,  # every carrier here is built from draft/confirmed words, never authored fresh
    }

content = {
    "words": words,
    "sentences": sentences,
    "carriers": carriers,
}

import os
os.makedirs("/home/claude/game/data", exist_ok=True)
with open(OUT, "w") as f:
    json.dump(content, f, indent=2, ensure_ascii=False)

n_draft = sum(1 for w in words if w["kutchi"] and w["kutchi"]["is_draft"])
n_confirmed = sum(1 for w in words if w["kutchi"] and not w["kutchi"]["is_draft"])
n_missing = sum(1 for w in words if not w["kutchi"])
print(f"{len(words)} words: {n_confirmed} confirmed, {n_draft} draft, {n_missing} missing Kutchi")
print(f"{len(sentences)} fixed sentences, {len(carriers)} carrier sentences")
print(f"Written to {OUT}")
