# UX 9a: the end-of-round screen redrawn (28 Sept)

`js/shared/results.js` + `css/shared/results.css` draw all three badges as
inline SVG with CSS animation (reduced-motion respected): a stopwatch outline
with the time inside it (gold + buzzing on a new best, dim gold within ~25%,
grey otherwise); a chunky tick that fills as a green/red gauge, gold + shimmer
when every row is right; a light bulb that dims, loses its glow and cracks as
hints climb (0 bright, 1 faint + a crack, 2 very dim + cracks, 3+ off). Page 2
groups right words (green glow) right, wrong ones (red glow) left. Same API,
so every caller is unchanged; Cook now passes real per-word right/wrong from
its existing missed-word tracking, the clinic doesn't track that yet so its
words default to right.

Verified: `build/test_shared_ui.mjs` (8/8), `build/test_shared-ui-browser.mjs`
(all sizes, reduced motion), a Cook grill round, no page errors. Screenshots:
`build/reports/results-9a/`.
