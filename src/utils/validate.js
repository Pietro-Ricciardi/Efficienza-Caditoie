export function validaParametri(params) {
  const warnings = [];
  if (params.Q <= 0 || params.Q > 1000) {
    warnings.push('Q deve essere compreso tra 0 e 1000');
  }
  if (params.Q1 < 0 || params.Q1 > params.Q) {
    warnings.push('Q1 deve essere compreso tra 0 e Q');
  }
  if (params.v <= 0 || params.v > 10) {
    warnings.push('v deve essere compreso tra 0 e 10');
  }
  if (params.v0 < 0 || params.v0 > 10) {
    warnings.push('v0 deve essere compreso tra 0 e 10');
  }
  if (params.j < 0 || params.j > 0.2) {
    warnings.push('j deve essere compreso tra 0 e 0.2');
  }
  if (params.L <= 0 || params.L > 5) {
    warnings.push('L deve essere compreso tra 0 e 5');
  }
  if (params.E0 < 0 || params.E0 > 1) {
    warnings.push('E0 deve essere compreso tra 0 e 1');
  }
  return warnings;
}
