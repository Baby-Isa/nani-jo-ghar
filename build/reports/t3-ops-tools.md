# T3: ops scripts and project skills (decision 44)

No game code or data changed; nothing published; no art run. Scripts in `build/tools/ops/` (`--help` each; writing needs `--go`, `--out` or `--log`); table in `docs/architecture/testing.md`.

| Script | Saves | Proof |
|---|---|---|
| `brief.mjs <spec>` | typing briefs; adds standing lines and regression rows | 4e brief rebuilt from `specs/4e-clinic-engine.json` (100 rows); identical on re-run |
| `mumround.mjs <folder>` | transcribe → items → cut → loudness → engine → gap counts | 5 Oct dry run: 179 clips, 13 more than 3 LU off −16, engine check 0 errors, 41 s |
| `feedback.mjs <transcript>` | the voice-note report skeleton and draft rows | 41-line sample: 10 points, 3 chatter, 0 unmapped (`samples/`) |
| `publish.mjs` | bump → push → Pages wait → labs shot | Dry run only. Blocks now: `origin/main` has 1,093 commits this branch lacks (art uploads) |
| `checkin.mjs [--log]` | the check-in line | 20 commits by session; T1, T2 reports; art 76 of 115; all 7 sessions found |
| `mumsheet.mjs` | the next Mum sheet | Round 6 sample: 189 lines, about 56 min, 291 for later; Word copy builds |

**Skills** (`.claude/skills/`, 24–35 lines each, citing rule IDs): `/brief`, `/checkin`, `/review`, `/publish`, `/mum-round`, `/feedback`, `/art-run` (calls T2's `artblock`, `artjudge`, `artcut`), `/handover`.

**Gaps:**
- The 4e brief is rebuilt from status and decisions 36, 40, 42, because its text wasn't committed.
- This container can't reach github.io (proxy 403), so the Pages poll and live screenshot are unproven.
- The 5 Oct item lists weren't committed, so cutting can't be replayed. Whisper heard "I1" as "Aai one", so no ids were found in that file.
- `artjudge.py` needs `opencv-python-headless` (not installed here).
- Feedback points and screens are keyword drafts; causes are left blank.
- The Mum sheet keeps the engine's wording ("bring me the head").
