# False breaks

Lights a real run caught that a check failed although they were right; `build/sandbox/shared-checks.test.mjs` judges each again and
it must pass (the bad runs in `../bad-runs/` must still fail).

| Light | Run | The old check said | Why it is right |
|---|---|---|---|
| `light-chaat-swipe-740` | `sbs-chaat-L1-20261111-0355`, chaat's chop at 740x320 | contract-112: "lit while chop4-knife was still moving inside it 188 px" | chop's swipe light (STD-E2-08a) holds the knife's path: the knife moving along it is the move it shows |
