# one profile through first launch, a Cook round, a clinic round and a reload (build/core/save-reload.mjs)

- **after first launch and its two Cook rounds**: `{"module":"js/core/save.js (schema 2)","player":"Player 1","players":1,"firstDone":true,"character":4,"cookCoins":0,"cookWords":0,"words":4,"wallet":14,"clinic":null,"story":1}`
- **after a clinic round**: `{"module":"js/core/save.js (schema 2)","player":"Player 1","players":1,"firstDone":true,"character":4,"cookCoins":0,"cookWords":0,"words":4,"wallet":14,"clinic":{"session":2,"levels":{"waiting":1,"diagnosis":1,"pharmacy":1,"heal":1,"sendoff":1},"album":["kid:knee"]},"story":1}`
- **the house, reloaded**: `{"module":"js/core/save.js (schema 2)","player":"Player 1","players":1,"firstDone":true,"character":4,"cookCoins":0,"cookWords":0,"words":4,"wallet":14,"clinic":{"session":2,"levels":{"waiting":1,"diagnosis":1,"pharmacy":1,"heal":1,"sendoff":1},"album":["kid:knee"]},"story":1}`
- **page errors**: `["/first.html: Transition was aborted because of invalid state. ViewTransition opt-in disabled","/cook.html: Transition was aborted because of invalid state. ViewTransition opt-in disabled"]`

nothing lost
