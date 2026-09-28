# Overnight queue (Zafar-approved jobs waiting to start)

The orchestrator's check-ins launch these as earlier jobs finish: at most 2 at once, never two on the same files. Mark each item **launched (session id)** when started and **done** when merged.

1. **The maani station v2** (docs/design/cook-design-system-v1.md §11). Scene files; starts after chai v2 finishes (shared hob code).
2. **The order model for cards and pop-ups** (§12). Sidebar and pop-up files (css/cook-side-v2.css, sidebar JS, the request pop-up, js/shared/fit.js); every station's order data is mapped to person → items → parts. It must not touch station scene code. It can run alongside maani.
