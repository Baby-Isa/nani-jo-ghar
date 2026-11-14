# s20-lang-khapeti: every kitchen order line, before and after (decision 27)

Script-made (the order frames each kitchen game said through Cook.Lang.speak, and the Need lines it built, in cook.html's Station lab at L1-L4, seeds 1 and 2; before: the branch base e98a39981, after: this branch). The recipe runs (recipe:daal, maani, samosa, mishkaki) say the same lines as their stations. The pantry's orders are "Muke {x} de" / "bring me these" (no khape): unchanged. The chaat row "mirchi na" (a "no" row, no khape) is unchanged on purpose.

## Proof

A thing whose gender Mum has not confirmed (sekelo, naan, makai; chaat, garlic, mishkaki and mustard seeds, marked ⚠ in grammar-notes §64) keeps her plain khape, and its gender is a gap for her list (non-negotiable 2; the orchestrator, 14 Nov). The lines below are the dump's output (scratchpad orderdump.mjs; the after runs are this branch's code) and the two chai L4 contract runs' sound logs.

| Game | Level | Before | After (the engine) |
|---|---|---|---|
| chai | L1,L2,L3,L4 | Muke chai khape | Muke chai khapeti |
| chai | L2,L3,L4 | Muke aadu waari chai khape | Muke aadu waari chai khapeti |
| chai | L4 | Muke elchi waari chai khape | Muke elchi waari chai khapeti |
| maani | L1 | Muke ba bajr ji maani khape | Muke ba bajr ji maani khapanti |
| maani | L1 | Muke hakri maani khape | Muke hakri maani khapeti |
| maani | L1,L2,L3,L4 | Muke maani khape | Muke maani khapeti |
| maani | L2 | Muke hakri nindhi bajr ji maani khape | Muke hakri nindhi bajr ji maani khapeti |
| maani | L3 | Muke ba nindhi bajr ji maani khape | Muke ba nindhi bajr ji maani khapanti |
| maani | L3,L4 | Muke hakri wadhi maani khape | Muke hakri wadhi maani khapeti |
| maani | L4 | Muke ba nindhi maani khape | Muke ba nindhi maani khapanti |
| sekelo (grill) | L1,L2,L3,L4 | Muke sekelo khape | Muke sekelo khape |
| daar | L1,L2,L3,L4 | Muke daar khape | Muke daar khapeti |
| chop | L1,L3,L4 | Muke ba dungri khape | Muke ba dungri khapanti |
| chop | L2,L3,L4 | Muke hakro tameto khape | Muke hakro tameto khapeto |
| chop | L2,L3 | Muke trae dungri khape | Muke trae dungri khapanti |
| chop | L3 | Muke ba lasan khape | Muke ba lasan khape |
| chop | L3,L4 | Muke trae mirchi khape | Muke trae mirchi khapanti |
| chop | L4 | Muke ba mirchi khape | Muke ba mirchi khapanti |
| chop | L4 | Muke hakri dungri khape | Muke hakri dungri khapeti |
| chop | L4 | Muke trae lasan khape | Muke trae lasan khape |
| samosa | L1,L3 | Muke ba samosa khape | Muke ba samosa khapanta |
| samosa | L2,L4 | Muke trae samosa khape | Muke trae samosa khapanta |
| eggs | L1,L2,L3,L4 | Muke hakro bafelo indo khape | Muke hakro bafelo indo khapeto |
| eggs | L1,L2,L3,L4 | Muke indo khape | Muke indo khapeto |
| eggs | L2,L4 | Muke ba bafelo inda khape | Muke ba bafelo inda khapanta |
| eggs | L2,L4 | Muke ba tarela inda khape | Muke ba tarela inda khapanta |
| eggs | L3,L4 | Muke hakro tarelo indo khape | Muke hakro tarelo indo khapeto |
| baking | L1,L2,L3,L4 | Muke naan khape | Muke naan khape |
| corn | L1,L2,L3,L4 | Muke hakro makai khape | Muke hakro makai khape |
| corn | L3,L4 | Muke ba makai khape | Muke ba makai khape |
| roll-tawa | L1,L2,L3,L4 | Muke ba maani khape | Muke ba maani khapanti |
| roll-tawa | L1,L2,L3,L4 | Muke trae maani khape | Muke trae maani khapanti |
| chaat | L1,L2,L3,L4 | Muke chaat khape | Muke chaat khape |
| chaat | L2,L3,L4 | mirchi na | mirchi na |
| chaat | L4 | mirchi na | sev na |
| daal (recipe) | L1,L2,L3,L4 | Muke daar khape | Muke daar khapeti |
| maani (recipe) | L1 | Muke ba bajr ji maani khape | Muke ba bajr ji maani khapanti |
| maani (recipe) | L1 | Muke hakri maani khape | Muke hakri maani khapeti |
| maani (recipe) | L1,L2,L3,L4 | Muke maani khape | Muke maani khapeti |
| maani (recipe) | L2 | Muke hakri nindhi bajr ji maani khape | Muke hakri nindhi bajr ji maani khapeti |
| maani (recipe) | L3 | Muke ba nindhi bajr ji maani khape | Muke ba nindhi bajr ji maani khapanti |
| maani (recipe) | L3,L4 | Muke hakri wadhi maani khape | Muke hakri wadhi maani khapeti |
| maani (recipe) | L4 | Muke ba nindhi maani khape | Muke ba nindhi maani khapanti |
| samosa (recipe) | L1,L3 | Muke ba samosa khape | Muke ba samosa khapanta |
| samosa (recipe) | L2,L4 | Muke trae samosa khape | Muke trae samosa khapanta |
| mishkaki (recipe) | L1,L2,L3,L4 | Muke sekelo khape | Muke sekelo khape |

Chai L4's second pour of a full glass (Zafar, 14 Nov; from the sound log of `cook:chai-tray@L4` at 1280x665, runs `s20-lang-khapeti-chaiL4-base` and `s20-lang-khapeti-chaiL4`):

| Game | Level | Before | After (the engine) |
|---|---|---|---|
| chai, second pour of a full glass | L4 | Iloka je glass me wij. | Akho burichad. (draft: Zafar's spelling, to confirm by Mum; no clip yet) |
| chai, first pour | L1-L4 | Iloka je glass me wij. | Iloka je glass me wij. (unchanged) |
