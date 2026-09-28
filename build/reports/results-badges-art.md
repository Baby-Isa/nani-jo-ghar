# Results badges: ChatGPT art wired in (28 Sept)

Zafar's 4 sheets found at `sources/art/chatgpt-results-260928/` (merged from
main). Cut with `build/slice_sheet.py --key grey`; bulb-0 and gold tick used
`build/cut_glow.py` instead -- the grey key left a jagged fringe on their
glow. All 13 cells matched the spec order. Resized to ~512px,
`assets/ui/results/*.webp`.

`results.js` + `results.css`: dropped the inline-SVG badges and the circle
behind them. Stopwatch swaps art by tier, time overlaid on its face; tick
layers green/red art via `clip-path`, gold art when all right; bulb swaps
art by hint count; captions use the crown/bulb art. URLs through `njgV()`.
Glow/buzz/shimmer/party lines stay CSS, reduced-motion respected.

Verified: `test_shared_ui.mjs` (8/8), `test_shared-ui-browser.mjs` (all
sizes), no page errors, no broken images. Screenshots:
`build/reports/results-badges/`.
