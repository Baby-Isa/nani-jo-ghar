# MAA-23 (open) · Cook: maani

**Issue:** Big and small taught by a word moment (Zafar, 9 Nov, maani: "Then when the level arrives where we introduce big and small, we use that as the word focus, and we show the Marnie being rolled small, and then there'll be then you put a kind of dashed smaller line and a dashed small circle and a dashed big circle, and it shows the Marnie being rolled small and the Marnie being rolled big, and there'll be the words nindo and waddo, like the catchy words for big and small. And maybe the words would be small Marnie, big Marnie. I don't know whether you have to specify that, or figure it out. But yeah, and then after you've seen that, then the dash lines come on all the games, and you've kind of been shown it. So that would be the right time to do that.")

**Check:** auto: maani at L1, L2, L3 and L4 as a new player: no ring before the lesson's level, the lesson once at it (its lines from the engine only), the rings on after it, in every round of the games his answer names

**Source:** docs/feedback/kitchen-mocks-2026-11-09.md P4

**Status now:** to fix: check (built: s19-clean-c, s19-clean-c2, a maani rolled to each ring becomes its word card, said by the engine; no frame lands on it; to judge) (answered: build/reports/s19-waiting-on-zafar-audit.md) · cause: no lesson for big and small; two rings from L2 (data/stations/maani-line.json:36-40) while the big/small orders come at L4 (data/cook.json:1394); fix: the shared word moment (js/shared/word-moment.js) at the level big and small arrive: a maani rolled small to a small dashed ring, then big to a big one, each said by the language engine ("small maani", "big maani": nindhi / wadhi, the she-forms, maani being a she-word, data/lang/lexicon.json a.big; Mum's nindhi clip; wadhi recorded only inside phrases: a gap reported if the engine needs it alone, never invented); then the rings on (his "and then after you've seen that, then the dash lines come on all the games, and you've kind of been shown it": every maani round after, or every game with a size guide: asked, decision 2); the level, and no rings before it, his call (decision 2)

## Probes

- MAA-23-p1-L1-1280x665: cook:maani-line#speed1 L1 @ 1280x665 [p-fresh], at every line:cook: reached 9x (line:cook 17.6s, line:cook 25.5s, line:cook 36.4s, line:cook 40.8s, line:cook 52.1s, line:cook 56.7s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L1-740x320: cook:maani-line#speed1 L1 @ 740x320 [p-fresh], at every line:cook: reached 10x (line:cook 19.7s, line:cook 35.3s, line:cook 47.4s, line:cook 51.8s, line:cook 53.9s, line:cook 63.9s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L2-1280x665: cook:maani-line@L2#speed1 L2 @ 1280x665 [p-fresh], at every line:cook: reached 15x (line:cook 17.9s, line:cook 28.0s, line:cook 32.3s, line:cook 36.0s, line:cook 39.4s, line:cook 48.5s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L2-740x320: cook:maani-line@L2#speed1 L2 @ 740x320 [p-fresh], at every line:cook: reached 16x (line:cook 18.7s, line:cook 27.8s, line:cook 32.2s, line:cook 35.8s, line:cook 41.3s, line:cook 57.3s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L3-1280x665: cook:maani-line@L3#speed1 L3 @ 1280x665 [p-fresh], at every line:cook: reached 15x (line:cook 18.9s, line:cook 27.8s, line:cook 30.6s, line:cook 34.3s, line:cook 46.1s, line:cook 49.9s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L3-740x320: cook:maani-line@L3#speed1 L3 @ 740x320 [p-fresh], at every line:cook: reached 15x (line:cook 19.1s, line:cook 29.5s, line:cook 34.2s, line:cook 38.0s, line:cook 56.2s, line:cook 60.7s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L4-1280x665: cook:maani-line@L4#speed1 L4 @ 1280x665 [p-fresh], at every line:cook: reached 16x (line:cook 19.1s, line:cook 32.4s, line:cook 36.3s, line:cook 39.7s, line:cook 55.5s, line:cook 59.5s) · maani: big and small taught by a word moment before they are asked
- MAA-23-p1-L4-740x320: cook:maani-line@L4#speed1 L4 @ 740x320 [p-fresh], at every line:cook: reached 16x (line:cook 18.4s, line:cook 25.9s, line:cook 29.6s, line:cook 33.3s, line:cook 47.4s, line:cook 51.1s) · maani: big and small taught by a word moment before they are asked

## Panels (`build/screenshots/evidence/r16pb-cook/MAA-23.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-2.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-3.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-4.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-5.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-6.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-7.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-8.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-9.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-10.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-11.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-12.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-13.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-14.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-15.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-16.png`, `build/screenshots/evidence/r16pb-cook/MAA-23-17.png`)

- **A**: cook:maani-line#speed1 L1 1280x665 [p-fresh] · crop:#game at every line:cook (9)
- **B**: cook:maani-line#speed1 L1 740x320 [p-fresh] · crop:#game at every line:cook (10)
- **C**: cook:maani-line@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at every line:cook (15)
- **D**: cook:maani-line@L2#speed1 L2 740x320 [p-fresh] · crop:#game at every line:cook (16)
- **E**: cook:maani-line@L3#speed1 L3 1280x665 [p-fresh] · crop:#game at every line:cook (15)
- **F**: cook:maani-line@L3#speed1 L3 740x320 [p-fresh] · crop:#game at every line:cook (15)
- **G**: cook:maani-line@L4#speed1 L4 1280x665 [p-fresh] · crop:#game at every line:cook (16)
- **H**: cook:maani-line@L4#speed1 L4 740x320 [p-fresh] · crop:#game at every line:cook (16)

