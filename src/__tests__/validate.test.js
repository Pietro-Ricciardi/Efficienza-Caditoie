import { validaParametri } from '../utils/validate';

describe('validaParametri', () => {
  test('returns no warnings for valid parameters', () => {
    const params = { Q: 100, Q1: 60, v: 1.5, v0: 1.0, j: 0.01, L: 0.5, E0: 0.7 };
    const res = validaParametri(params);
    expect(res).toHaveLength(0);
  });

  test('warns when Q1 exceeds Q', () => {
    const params = { Q: 50, Q1: 60, v: 1, v0: 1, j: 0.01, L: 0.5, E0: 0.5 };
    const res = validaParametri(params);
    expect(res.length).toBeGreaterThan(0);
  });
});
