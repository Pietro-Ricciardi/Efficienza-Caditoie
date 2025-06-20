import {
  shieldsParameter,
  criticalShearStress,
  meyerPeterMuller,
  einsteinBedload,
  rouseExponent,
  rouseProfile,
  totalLoadEHVR
} from '../lib/sediment';

describe('sediment transport utilities', () => {
  test('shields parameter and critical shear stress', () => {
    const theta = shieldsParameter(10, 2650, 1000, 0.002);
    const tauC = criticalShearStress(0.047, 2650, 1000, 0.002);
    expect(theta).toBeCloseTo(0.3089, 3);
    expect(tauC).toBeCloseTo(1.5215, 3);
  });

  test('bedload formulas', () => {
    expect(meyerPeterMuller(0.04, 0.047, 0.002, 2.65)).toBe(0);
    expect(einsteinBedload(0.04, 0.047, 0.002, 2.65)).toBe(0);
    const mpm = meyerPeterMuller(0.1, 0.047, 0.002, 2.65);
    const einstein = einsteinBedload(0.1, 0.047, 0.002, 2.65);
    expect(mpm).toBeCloseTo(3.51e-5, 7);
    expect(einstein).toBeCloseTo(9.31e-8, 10);
  });

  test('rouse exponent and profile', () => {
    const p = rouseExponent(0.02, 0.1);
    expect(p).toBeCloseTo(0.5, 2);
    const profile = rouseProfile([0.1, 0.5, 0.9], 1, 0.01, 0.05, p);
    expect(profile[0]).toBeCloseTo(0.00688, 5);
    expect(profile[1]).toBeCloseTo(0.00229, 5);
    expect(profile[2]).toBeCloseTo(0.00076, 5);
  });

  test('total load model', () => {
    const total = totalLoadEHVR(0.1, 0.002, 2.65);
    expect(total).toBeCloseTo(5.13e-8, 11);
  });
});
