# Overnight queue (Zafar-approved jobs waiting to start)

The orchestrator's check-ins launch these as earlier jobs finish: at most 2 at once, never two on the same files. Mark each item **launched (session id)** when started and **done** when merged.

1. **The maani station v2** (docs/design/cook-design-system-v1.md §11). Scene files; starts after chai v2 finishes (shared hob code).
2. **[launched 28 Sept 23:58]** **The order model for cards and pop-ups** (§12), built as SHARED components (`js/shared/order-card.js` + `css/shared/order-card.css`, see §12's last bullet), with Cook as the first user. Sidebar and pop-up files (css/cook-side-v2.css, sidebar JS, the request pop-up, js/shared/fit.js); every station's order data is mapped to person → items → parts. It must not touch station scene code. It can run alongside maani, but only once the end-pop-up session (session_012nfk1BJbef8sGfejXYT8jm, running the fixes Zafar pasted) has pushed, since both touch the sidebar.
3. **Adopt the shared order card + Nani guide box in the clinic and Find it** (after item 2 is merged). The parked modes adopt them when they're rebuilt.
