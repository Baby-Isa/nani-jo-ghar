# Nani expression prompts (manual fallback)

The `GEMINI_API_KEY` in this environment has **no available quota** for any
image-generation model (`gemini-3.1-flash-image`, `gemini-2.5-flash-image`
both return `429 RESOURCE_EXHAUSTED` with `limit: 0` on the free tier — this
is a billing/plan issue, not a missing key or a network block). `OPENAI_API_KEY`
is not set either, so there is no fallback API to use automatically.

Per section 6 of the build brief, here are the 5 prompts to paste manually.

For each one: open Gemini, attach `assets/characters/nani/nani-neutral.png`,
paste the prompt, and save the result with the filename shown.

| Save as | Prompt |
|---|---|
| `eyes-closed.png` | Edit this illustration: close her eyes gently, as in a natural relaxed blink. Change nothing else: same face, glasses, headscarf, clothes, colours, lighting, line style and framing. |
| `eyes-half.png` | Edit this illustration: her eyes half closed, mid-blink. Change nothing else: same face, glasses, headscarf, clothes, colours, lighting, line style and framing. |
| `mouth-half.png` | Edit this illustration: her mouth slightly open as if mid-word, lips parted a little, teeth barely visible. Change nothing else: same eyes, face, glasses, headscarf, clothes, colours, lighting, line style and framing. |
| `mouth-open.png` | Edit this illustration: her mouth open as if saying 'aah' while talking warmly. Change nothing else: same eyes, face, glasses, headscarf, clothes, colours, lighting, line style and framing. |
| `smile.png` | Edit this illustration: a big warm proud smile, eyes slightly crinkled with happiness. Change nothing else: same face shape, glasses, headscarf, clothes, colours, lighting, line style and framing. |

Drop the 5 files into the chat (or into `build/expr_work/manual/`) and the
rest of the pipeline (`build/expressions.py`, section 3.3 onwards — align,
mask, QA, composite, review artefacts) will run on them exactly as it would
on API output. The registration/masking/QA code doesn't care how the raw
edit was produced.
