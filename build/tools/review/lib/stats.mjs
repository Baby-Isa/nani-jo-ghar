// The lower end of a 99% Wilson interval for a share won in n rounds. A leak bot's estimate is judged over the contract limit
// only when even its lower end is over (LNG-02: taste L1 read 10.3% in 8000 rounds against exact odds of 8.3%; noise, not a leak).
export function wilsonLow(p, n, z = 2.576) {
  if (!n) return 0;
  const d = 1 + (z * z) / n;
  return (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
}
export const clearlyOver = (p, n, limit) => p >= limit && wilsonLow(p, n) >= limit;
