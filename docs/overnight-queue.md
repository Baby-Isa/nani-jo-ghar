# Overnight queue (Zafar-approved jobs waiting to start)

The orchestrator's check-ins launch these as earlier jobs finish: at most 2 at once, never two on the same files. Mark each item **launched (session id)** when started and **done** when merged.

1. **The maani station v2** (docs/design/cook-design-system-v1.md §11). Scene files; starts after chai v2 finishes (shared hob code).
2. **[launched 28 Sept 23:58]** **The order model for cards and pop-ups** (§12), built as SHARED components (`js/shared/order-card.js` + `css/shared/order-card.css`, see §12's last bullet), with Cook as the first user. Sidebar and pop-up files (css/cook-side-v2.css, sidebar JS, the request pop-up, js/shared/fit.js); every station's order data is mapped to person → items → parts. It must not touch station scene code. It can run alongside maani, but only once the end-pop-up session (session_012nfk1BJbef8sGfejXYT8jm, running the fixes Zafar pasted) has pushed, since both touch the sidebar.
3. ~~Clinic + Find it adopt the shared order card~~: **cancelled by Zafar (29 Sept)**. The clinic waits until he's played it and settled its mechanics; Find it is left for now.
4. **The daar station v2 + the shared kitchen kit** (§13). Scene files; runs after maani v2 is merged (shared hob, heat and pour code). The order-card parts (Nani's chop card, the phase-fold rule) go into the shared order card if it has landed; otherwise add them there once item 2 is merged.
5. **The chaat station v2** (§14 + §14a). Chaat scene files only; it doesn't share the hob, so it can run alongside maani/daar (max 2 at once). Its card needs from the shared order card (item 2): ordered-job sequence line, a 'don't' row style, and a start-folded mode that costs a hint to open. Add them there if item 2 has landed, otherwise coordinate after it.
6. **Sekelo v2** (§15). Its own scene and grill; no hob. Can start now.
7. **Samosa v2** (§15). Fill and fold have no hob; the fry uses the kitchen kit, so it runs after maani v2 has established the shared kit files, or only imports them.

## Rules for the overnight run (Zafar, 29 Sept ~01:00 UK: everything done by 07:00 UK = 06:00 UTC)
- At most 4 build sessions at once (the usage limit). The hob and kitchen-kit files have one owner at a time; the others import only, and make small additive edits if they must, after `git pull --rebase`.
- **Every session reports progress** by appending one timestamped line to `docs/overnight-log.md` and pushing the branch at least every 20–30 minutes, so the orchestrator never has to interrupt anyone.
- Each session ends with its report in `build/reports/<name>.md`, the VISUAL-QA matrix, bump_version and ONE push to main.
