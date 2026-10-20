// The SH-60 filmstrip's mark (s08 w6E): a strip that films the wait for Nani's help shows the moment the help is logged, so the judge
// sees the frame where the line and the glow begin and how long the frames before it were still. The first frame at or after the
// logged moment gets a red frame burned into its edge (a tool mark, the same on every strip); the other frames are untouched.
// Pure: the probe (evidence-probe.mjs) hands it the strip's frames, their times and the help moments it saw while filming.
import { decodePng, encodePng } from "../../tools/review/lib/png.mjs";

// the moments that are Nani's help being given: the shared stepper's and the station's own log entry ("help", Lifecycle), the
// players' own hint moments
export const HELP_MOMENT = /^(life:help|rec:hint-glow|rec:hint-nani-says|rec:idle-hint)$/;
export const isHelpMoment = (name) => HELP_MOMENT.test(String(name || ""));
export const MARK_RGB = [220, 30, 30];
const EDGE = 6; // px of the red frame

// bufs: PNG buffers; times: ms of each frame from the strip's start; moments: [{name, ms}] (ms from the strip's start).
// Returns {bufs, marks: [{name, ms, frame}]}: marks only for a moment inside the strip (not after its last frame's time + one gap)
export function markStrip(bufs, times, moments) {
  const out = bufs.slice(), marks = [];
  const gap = times.length > 1 ? times[times.length - 1] - times[times.length - 2] : 0;
  for (const m of moments || []) {
    const k = times.findIndex((t) => t >= m.ms);
    if (k < 0 || m.ms < -50 || m.ms > times[times.length - 1] + gap * 0) continue;
    if (marks.some((x) => x.frame === k)) continue; // one mark per frame
    marks.push({ name: m.name, ms: Math.round(m.ms), frame: k });
    const img = decodePng(out[k]);
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
      if (x >= EDGE && x < img.w - EDGE && y >= EDGE && y < img.h - EDGE) continue;
      const o = (y * img.w + x) * 4;
      img.data[o] = MARK_RGB[0]; img.data[o + 1] = MARK_RGB[1]; img.data[o + 2] = MARK_RGB[2]; img.data[o + 3] = 255;
    }
    out[k] = encodePng(img);
  }
  return { bufs: out, marks };
}
