import { calcR1, calcR2, calcTotalEfficiency, generateEfficiencySeries } from '../utils/calc';

describe('calculation helpers', () => {
  test('default parameter set', () => {
    const params = { Q: 100, Q1: 60, v: 1.5, v0: 1.0, j: 0.01, L: 0.5 };
    const r1 = calcR1(params.v, params.v0);
    const r2 = calcR2(params.v, params.j, params.L);
    const e = calcTotalEfficiency({ ...params, E0: 0.7 });
    expect(r1).toBeCloseTo(0.85, 2);
    expect(r2).toBeCloseTo(0.0353, 3);
    expect(e).toBeCloseTo(0.5241, 3);
  });

  test('second parameter set', () => {
    const params = { Q: 150, Q1: 30, v: 2, v0: 1, j: 0.02, L: 0.7 };
    const r1 = calcR1(params.v, params.v0);
    const r2 = calcR2(params.v, params.j, params.L);
    const e = calcTotalEfficiency({ ...params, E0: 0.7 });
    expect(r1).toBeCloseTo(0.7, 2);
    expect(r2).toBeCloseTo(0.0517, 3);
    expect(e).toBeCloseTo(0.1814, 3);
  });

  test('generate series for varying v', () => {
    const params = { Q: 100, Q1: 60, v: 1.5, v0: 1.0, j: 0.01, L: 0.5, E0: 0.7 };
    const series = generateEfficiencySeries(params, 'v', 1, 2, 3);
    expect(series).toHaveLength(3);
    expect(series[0].v).toBeCloseTo(1);
    expect(series[2].v).toBeCloseTo(2);
    expect(series[1].efficiency).toBeCloseTo(
      calcTotalEfficiency({ ...params, v: series[1].v }),
      5
    );
  });

  test('generate series for varying Q', () => {
    const params = { Q: 100, Q1: 60, v: 1.5, v0: 1.0, j: 0.01, L: 0.5, E0: 0.7 };
    const series = generateEfficiencySeries(params, 'Q', 50, 150, 5);
    expect(series).toHaveLength(5);
    expect(series[0].Q).toBeCloseTo(50);
    expect(series[4].Q).toBeCloseTo(150);
  });
});
