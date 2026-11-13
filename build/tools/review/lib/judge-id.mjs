/**
 * Does a verdict file's "judge:" line name the builder as the judge? (13 Nov: independent judges wrote "judge subagent, not the builder
 * s19-night-b", and the plain name test refused them: a "not <builder>" or "not the builder <builder>" disclaimer does not count.)
 */
export function judgedByBuilder(judge, builder) {
  const b = String(builder).toLowerCase();
  const j = String(judge || "").toLowerCase().replace(new RegExp(`\\bnot\\s+(?:the\\s+builder\\s+)?(?:\\(?)${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g"), "");
  return j.includes(b);
}
