import { linearAccumulation, saturatingAccumulation, getZoneDefaults } from '../utils/accumulation';

describe('dry accumulation utilities', () => {
  test('linear accumulation', () => {
    expect(linearAccumulation(5, 0.4)).toBeCloseTo(2);
  });

  test('saturating accumulation', () => {
    const val = saturatingAccumulation(5, 0.5, 10);
    expect(val).toBeCloseTo(10 * (1 - Math.exp(-2.5)), 5);
  });

  test('zone defaults', () => {
    const { k, Lmax } = getZoneDefaults('industriale');
    expect(k).toBeCloseTo(1.5);
    expect(Lmax).toBeCloseTo(15);
  });
});
