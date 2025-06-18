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
