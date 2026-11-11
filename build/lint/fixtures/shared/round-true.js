// A test game that asks the shared light for a round light (the option is gone: every light is one rounded rectangle, Zafar 10 Nov),
// and one that asks for a variant the shared light does not name for it. The shared-pieces lint must go red on both lines.
export function light(Onboard, pan) {
  Onboard.light(pan, { look: "glow", pad: 2, round: true, pass: true });
  return Onboard.light(pan, { variant: "swipe" });
}
