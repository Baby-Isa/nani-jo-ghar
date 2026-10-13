# S05-S2: the shared layer, round 2

Branch `ccr-a7370759-t0lee7`, commits `ad8e921`, `8808501`, `da84a28`. Game code changed: `js/shared`, `css/shared` only.

## What changed
- **order-card.js/.css:** a closed card's peek is the small bulb with no counter (decisions 57, 89). `look: "eye"` keeps the eye for a written closed card. The bulb floats at the end of the headline's last line, so it no longer reserves a column. The face's tap area stays inside its own 48 px box. `OrderCard.closeBig`.
- **request-popup.js:** `Lifecycle.request({level})` closes every big card from level 3, even through a host's redraws. The shared talk pauses a speaker's idle loops while it talks.
- **results.js:** a mode's own Again action carries `.rs-again` too (CLN-111). **say.js:** `isPlaceholder(id)` and `captionRec` tag a pill or caption still to record (grey italic, `data-rec`), so D's after-the-fact tagging can go.
- **Specs** (`evidence.json`): SH-16 follows decision 89. New row and probe SH-72. SH-17 also films the pantry strip.

## Proof
- `checks.mjs` passed: unit 288/0, words 0, specs 0 new, load 21/21. `check_onboard` OK. `test_shared_ui` 8/0.
- Quick run `s05s2-quick` (8 flows at 1366): 0 contract breaks, 0 new findings, 6 fixed. The full `--touched` list (every flow) is over the limit, so it is left to `/review`.
- No approved shot manifest exists, so all 187 shots are new. I looked at the contact sheets.

| Row | Red | Green | Verdict |
|---|---|---|---|
| SH-16 | 231456-sqr | 231852-ucc, 235914-hcx | built, sheet to judge |
| SH-72 (new) | 231456-sqr | 233511-asw, 235914-hcx | built |
| SH-09 | 233511-asw | 235914-hcx | built |
| PAN-01 | 2145 | 232200-lho, 235914-hcx | built |
| SH-36, SH-48, SH-64 | 2108 (probe) | 232200-lho | built |
| SH-01 | want driver | 233511-asw + harness | built, sheet to judge |
| SH-17 | 000945-9jy (strip) | pop-ups pass | open: C |
| SH-58, SH-19, SH-51 | 233511-asw / 232200-lho | — | open: C |
| SH-41 | — | Cook 8017 ms | open: D (clinic, 402 ms) |
| ART-18 | 000712-3ky | clinic passes | open: T/C (breathing measured, talk ≈0.8 px) |
| SEK-03 | 233511-asw | — | open: T (cards closed from L3 hide the groups) |
| SH-44 | 233511-asw | — | open: needs a call |
| CLN-111 | 002523-6a3 | 002601-sne (.rs-again) | open: T/D (button count, morning probe) |
| Say tags (D's request) | scratch page: no tag | tagged | done: `isPlaceholder`, `captionRec` |

Run ids are `ev-20261012-…` or `ev-20261013-…`.

## Requests
- **C:** in `speakAlong`, also light the strip's `.ra` spans while `mission.stripMode` (SH-17). Glow the ✓ when it is the only thing left whatever `opts.glow` is, and count the five plays per station (SH-58). The jar total is missing at 844×390 (SH-51). Optional: pass `level` to `Lifecycle.request`.
- **T:** ART-18 should trace only while Nani speaks, at speed 1. SEK-03 should probe during a peek or the bulb. The want driver never gets *fudino ji chutney* (SH-01).
- **Zafar (SH-44):** should the steps open by themselves when one went wrong, or show on the review page?

## QA checklist results
```
QA: cook:chai-tray@L3/L4, cook:fetch, cook:daar, lab:cook/order, clinic:waiting@L3, clinic:pharmacy@L3, clinic:heal-eye@L3 · reviewer: orchestrator (/review) · commit: da84a28
Auto: layout lint ✅ · check_onboard ✅ · test_shared_ui ✅ · contract ✅ (0 breaks)
Screens (flaws first): clinic closed card @ 844x390: its own "…" column narrows the headline to 4 lines (D) · pharmacy L3: the guide's "Bring me thermometer" is a to-record placeholder · chai-tray L3: ✅ (closed cards, two-line headlines, bulb after the last word)
Checklist: TXT ✅ (SH-09, SH-01) · LAY ✅ · CMP ⚠ SH-44, SEK-03 · INT ⚠ SH-58 · others ⬜ for /review
Regressions rechecked: 22 rows by probe (table above); the 139 rows of regress.mjs are left to /review
```

## Round 3 (13 Oct, Zafar's screenshot of sekelo L2)
- **SH-73** (new): a group's pills stack one per line when they don't fit side by side at their own size, measured from each word's one-line width. The skewer's stick stands upright, tip at the bottom; no pill word breaks. Red `085403-rhj` (4–5 lines a pill at 800×360, 844×390), green `090620-0xp` (1 line, no clip). L2 draws no mixed skewer in the lab, so the probe plays L3 with `want: mixed`. Built.
- **SH-53**: one highlight in one colour. The card's next piece and the read-along share `--njg-focus` (the focal glow's amber ring); the grey `next` fill and the beige alternate tint on rows and groups are gone, all from `css/shared` (not Cook). Red/green on the peeked sekelo card (grey + beige, then one amber ring); contract-8 passes but reads the stage only (T: add the card). Sheet to judge. **Clash:** SEK-03 asked for alternate groups tinted; rules F9 ("next in grey") and design system 12 (tinted rows) need the newest word recorded.
- **SH-44**: the steps list fits the card with no inner scroll (in the flow, two columns above four steps, shrinks as a whole if still too tall). Red `092112-xxb`, green `092229-zi0`. Opening by itself and the wrong steps' colour wait on Zafar.
- Risk: stacked skewers make an open sekelo card tall; with two mixed skewers `#mission` still fits 800×360 without a scroll (L4's up to four skewers are closed cards).
- **SH-44, decision 93** (later on 13 Oct): the steps are page 3 after the word review, shown by themselves (no tick-badge overlay). Right steps are gold, wrong ones red, with Kutchi over English, and what was done shows beside a wrong step. More than four steps go in two columns; nothing scrolls inside the card; with no steps there is no page. Red `092646-4xt`, green `100310-c68` at 1366×768. 390×844 shows only the turn-your-phone card. **C2 must land** a one-line change in `js/cook/flow.js` (Cook's test expectation presses Next again while another page follows) before `/review`; without it Cook's player waits for the last buttons on the steps page. Also C2/D2: pass steps only for §6a's "yes" games (Cook passes them everywhere today).
