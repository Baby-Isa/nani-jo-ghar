# Art pipeline smoke test — 2026-09-24

## Result: blocked at setup — stopped before any spend

## Setup checks

1. **`OPENAI_API_KEY` present** — pass (`env | grep -ic openai` → `1`; key value not printed).
2. **`api.openai.com` reachable** — **fail**. The request never reached OpenAI; it was rejected by this
   environment's egress proxy before the API could respond.

   Command run:
   ```
   curl -s -o /dev/null -w "%{http_code}" https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```
   Result: `curl` exit code `56` (recv failure), HTTP status `000` (no response — connection never
   established).

   Proxy status (`curl -sS "$HTTPS_PROXY/__agentproxy/status"`) shows the relay failure explicitly:
   ```json
   "recentRelayFailures": [
     {
       "ts": "2026-09-24T17:16:08.368Z",
       "kind": "connect_rejected",
       "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
       "host": "api.openai.com:443"
     }
   ]
   ```
   The proxy's `noProxy` allowlist (hosts reachable without going through the gateway) does not
   include `api.openai.com`, and the gateway answered the CONNECT for that host with 403 — this is
   an organisation network-policy denial, not a credentials or OpenAI-side problem.

## What this means

This environment's outbound network policy does not currently permit reaching `api.openai.com`.
No image-generation requests were made and no budget was spent — the run stopped at the
connectivity check as instructed.

## Next step

To run this smoke test, the environment's network policy needs `api.openai.com` added to its
egress allowlist (or the run needs to happen in an environment whose policy already allows it).
No code changes to `build/gen_assets.py` were needed or made; this is purely an environment
network-policy gap.
