#!/usr/bin/env node
// The town prototypes' leak bot: not built yet (proto-town, 2 Nov 2026; build/reports/proto-town-2026-11-02.md).
// The config (build/tools/review/leak-configs/town-proto.json) is marked knownFail so the checks report it rather than pass it.
console.log("town-proto: no leak bot yet (prototype). Known risks: 'tap till it stops' wins serve's count and pay's price from L2; English place placeholders win the map's L1-L2.");
process.exit(1);
