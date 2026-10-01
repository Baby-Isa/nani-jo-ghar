/*
 * The story log (target-model § 3.6; docs/game-design/modes/story-by-the-fire.md § 2): small facts of what
 * happened, append-only, in the save's `story` namespace as `days: [{date, arc, entries: [...]}]`, next to the
 * arc progress (`story.arcs`, js/core/unlocks.js) and first launch's own flag. Story by the Fire and the
 * bookshelf read it. Fire and forget: it never throws and never blocks play.
 *
 *   const L = createLog({ save })
 *   L.log({ arc, chapter, errand, type, who, what, count, colour, place })   -> the entry (with ts), or null
 *   L.days() -> [{date, arc, entries}]
 * A day is one date and one arc. Retention: the current and the previous arc only (older days are dropped;
 * word progress keeps what was learnt).
 */
export const TYPES = ["made", "found", "placed", "counted", "saw", "said", "chose", "round"];

export function createLog({ save, now = () => new Date() } = {}) {
  const L = {
    log(e = {}) {
      try {
        if (!save || !e.type) return null;
        const t = now();
        const entry = Object.assign({}, e, { ts: t.toISOString() });
        const date = entry.ts.slice(0, 10);
        const arc = e.arc || null;
        save.update("story", (s) => {
          const days = Array.isArray(s.days) ? s.days.slice() : [];
          let day = days.find((d) => d.date === date && d.arc === arc);
          if (!day) days.push((day = { date, arc, entries: [] }));
          day.entries = day.entries.concat([entry]);
          // keep the current and the previous arc only
          const arcs = [];
          for (let i = days.length - 1; i >= 0 && arcs.length < 2; i--) if (!arcs.includes(days[i].arc)) arcs.push(days[i].arc);
          s.days = days.filter((d) => arcs.includes(d.arc));
          return s;
        });
        return entry;
      } catch (err) {
        return null;
      }
    },
    days: () => ((save && save.get("story").days) || []).slice(),
  };
  return L;
}

export default createLog;
