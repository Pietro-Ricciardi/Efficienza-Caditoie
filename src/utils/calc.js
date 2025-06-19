export function calcR1(v, v0) {
  return 1 - 0.3 * (v - v0);
}

export function calcR2(v, j, L) {
  return 1 / (1 + (0.083 * Math.pow(v, 1.8)) / (j * Math.pow(L, 2 / 3)));
}

export function calcTotalEfficiency(params) {
  const R1 = calcR1(params.v, params.v0);
  const R2 = calcR2(params.v, params.j, params.L);
  const Q1_star = params.Q1 * R1;
  const Q2 = params.Q - params.Q1;
  const Q2_star = Q2 * R2;
  return (Q1_star + Q2_star) / params.Q;
}

export function generateEfficiencySeries(params, variable, min, max, steps = 10) {
  const results = [];
  const count = Math.max(2, steps);
  const delta = (max - min) / (count - 1);
  for (let i = 0; i < count; i++) {
    const value = min + delta * i;
    const newParams = { ...params, [variable]: value };
    results.push({ [variable]: value, efficiency: calcTotalEfficiency(newParams) });
  }
  return results;
}
