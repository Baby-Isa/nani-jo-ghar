# S05-D clinic

**Changed.** Each room logs its stage-start after its clean-up (SH-66). Heal-game steps open and are said one at a time; the pop-up reads goal plus first step (SH-45). Taught scrape: no count, ghost finger forced (CLN-118). L2 send-off face stays neutral (CLN-26). E4 cue is the doctor's; placeholder pills and caption are grey italic and tagged (CLN-117). Doctor's box clears after the pick (CLN-111). Knee: lit dot is `.cl-ring` (CLN-48), and L1 turns step through three heights (CLN-100). Boing's card is one sequence (CLN-113). Fever keeps its temperature row (SH-10). Waiting ticks clear the feet (CLN-90). Pharmacy tray has a front lip (CLN-22) and her face at the top right (CLN-85, part). Clinic bulb: on/off now reach the card, full 8 s, ends with its stage (SH-41). Audit table: `s05d-clinic-audit.md` (CLN-113, CLN-112).

**Proof.** Red run ev-20261012-2209. Greens: 2238 (group 1), 2250 (groups 2–3, index `evidence-ev-20261012-2250-s05d.md`), 2259 (heal), 2314 (tray); SH-41 red 232242-0d8. SH-66's clinic probe went from FAIL to PASS. `checks.mjs`: unit 268/268, 0 word literals, bump ok, load 21/21. check_onboard ok. Quick sandbox, 14 clinic flows (20261012-2317): all ends, 0 findings, **CHECK FAILED** on 2 contract-11 breaks sampled mid heal push-in (T). Touched's 122 rows: contract run and my probes only; the rest is for /review.

| Verdict | Rows |
|---|---|
| Sheet to judge | SH-45, SH-10, CLN-112, -113, -118, -03, -26, -86, -87, -90, -94, -100, -53, -58, -64, -101, -104, -105, -107, -22 |
| Open: T | LNG-02 (noise; exact odds 8.3%), SH-41 (driver ends the stage), CLN-11, -12, -45, -48, -117 |
| Open: S | CLN-111 (no `.rs-again`); Say's placeholder tagging |
| Open: C/art | SH-66 (Cook half), ART-05, CLN-25, -81, -38, -54 (B) |
| Open: Zafar | CLN-120: all-"fix it" L3 is 100% blind; reverted. CLN-85: diagnosis and send-off layout |
