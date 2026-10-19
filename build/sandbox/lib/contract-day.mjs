// The day's frame (Sprint 9, s09-frame: day.html's morning door, evening book and window ride): its contract checks, numbered
// from 45, judged from what was heard (the sound log's lines, lib/sound.mjs: day.html says every line through window.Day.say,
// whose speaker reads "day:<stage>:<who>") and what was on screen (the probe's texts sample, lib/contract-hook.mjs: a text
// under [data-door-en] carries `door`: {stage: the page was on its door, under: it sits right under a Kutchi line}).
//   contract-45 door-turn     the door's lines are said in turn: each of Nani's lines starts only once the one before it has
//                             ended (never two at once, never one cut by the next)
//   contract-46 door-english  written English shows for the child only under Nani's door lines (rule 5's door exception,
//                             Zafar, 19 Oct): English tagged as a door line's is a break off the door or not under a Kutchi line
export const DAY_CHECKS = {
  "contract-45": { item: "door-turn", title: "the door's lines in turn", how: "The sound log's lines said at the door (speaker day:door:nani: day.html's Day.say on the door stage), in the order they started: each must start no earlier than 40 ms before the line before it ended (its line-end), and the one before must have ended at all (a line that never ends while the next starts is two at once). A line starting while the one before it is still being said is a break: Nani's lines come one at a time, in turn (the door, Zafar, 19 Oct)." },
  "contract-46": { item: "door-english", title: "English written only under the door's lines", how: "Every texts sample's text tagged as a door line's English (lib/contract-hook.mjs: inside [data-door-en]) must be on the door (window.Day.stage 'door') and sit right under a Kutchi line (its element follows a .day-k that is not a to-record placeholder); either missing is a break. Every other English a child could read is contract-16's (no written English for the child): the door's English is the one exception (non-negotiable 5, Zafar, 19 Oct)." },
};

const TURN_SLACK = 40; // ms: a line-end logged a frame after the next line's start is still in turn

export function check45(tl, add) {
  const lines = [];
  const byId = new Map();
  for (const e of tl) {
    if (e.type === "line" && /^day:door:nani\b/.test(String(e.who || ""))) {
      const l = { id: e.id, t0: e.t, t1: null, text: e.text };
      lines.push(l);
      byId.set(e.id, l);
    } else if (e.type === "line-end" && byId.has(e.id)) byId.get(e.id).t1 = e.t;
  }
  lines.sort((a, b) => a.t0 - b.t0);
  for (let i = 1; i < lines.length; i++) {
    const a = lines[i - 1];
    const b = lines[i];
    if (a.t1 == null) add("contract-45", b.t0, `"${b.text}" started while "${a.text}" was still being said (it never ended)`);
    else if (b.t0 < a.t1 - TURN_SLACK) add("contract-45", b.t0, `"${b.text}" started ${Math.round(a.t1 - b.t0)} ms before "${a.text}" ended: the door's lines come in turn`);
  }
}

export function check46(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "texts") continue;
    for (const x of e.list || []) {
      if (!x.door) continue;
      const why = !x.door.stage ? "shown off the door" : !x.door.under ? "not under a Kutchi line" : null;
      if (!why || seen.has(x.t + why)) continue;
      seen.add(x.t + why);
      add("contract-46", e.t, `"${x.t}" (${x.sel}): door English ${why}`);
    }
  }
}
