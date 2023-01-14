export function clamp(a, x, b) {
  return Math.min(Math.max(x, a), b);
}

export function generateTimeAndReturn(die): TimeAndReturn {

  // generate two random numbers (the percentile ranks of the x and t distributions respectively)

  const r1: number = Math.random();
  const r2: number = Math.random();

  let x: number = 0;

  // Calculate x via rounding down to the nearest percentile marker from r1

  for (let [key, value] of die.entries()) {
      if (r1 >= key) {
          x = Math.max(x, value);
      }
  }

  // Calculate t via inverse CDF of N~(3 + log_2(x+1), 2^2) at r2 (approximated by the 1.35 * logit(r2))

  let mu: number = 3 + Math.log2(x+1);
  let sigma: number = 2;

  let t: number = 12 * Math.max(0.5, mu + sigma * clamp(-2, Math.log(r2/(1-r2)) * 1.35, 2));

  return {
    time: t,
    return: x
  };
}