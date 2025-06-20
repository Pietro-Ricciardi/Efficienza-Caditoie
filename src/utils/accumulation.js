export function linearAccumulation(days, k, L0 = 0) {
  return L0 + k * days;
}

export function saturatingAccumulation(days, k, Lmax) {
  return Lmax * (1 - Math.exp(-k * days));
}

export const zoneDefaults = {
  residenziale: { k: 0.35, Lmax: 4 },
  commerciale: { k: 0.75, Lmax: 7.5 },
  industriale: { k: 1.5, Lmax: 15 }
};

export function getZoneDefaults(zone, defaults = zoneDefaults) {
  return defaults[zone] || defaults.residenziale;
}
