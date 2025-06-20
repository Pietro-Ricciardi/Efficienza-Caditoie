// Utility functions for sediment transport calculations

const GRAVITY = 9.81; // m/s^2
const KAPPA = 0.4; // von Karman constant

/**
 * Calcola il parametro di Shields.
 * @param {number} tau - Sforzo di taglio sul fondo [Pa].
 * @param {number} rhoS - Densità dei sedimenti [kg/m^3].
 * @param {number} rho - Densità del fluido [kg/m^3].
 * @param {number} d - Diametro medio dei sedimenti [m].
 * @returns {number} Parametro di Shields.
 */
export function shieldsParameter(tau, rhoS, rho, d) {
  return tau / ((rhoS - rho) * GRAVITY * d);
}

/**
 * Calcola la tensione di inizio moto a partire dal parametro critico.
 * @param {number} thetaC - Parametro di Shields critico.
 * @param {number} rhoS - Densità dei sedimenti [kg/m^3].
 * @param {number} rho - Densità del fluido [kg/m^3].
 * @param {number} d - Diametro medio dei sedimenti [m].
 * @returns {number} Tensione di inizio moto [Pa].
 */
export function criticalShearStress(thetaC, rhoS, rho, d) {
  return thetaC * (rhoS - rho) * GRAVITY * d;
}

/**
 * Formula di Meyer-Peter & Müller per il bed-load.
 * @param {number} tauStar - Parametro di Shields.
 * @param {number} tauStarC - Valore critico del parametro di Shields.
 * @param {number} d - Diametro medio dei sedimenti [m].
 * @param {number} s - Rapporto di densità rhoS/rho.
 * @returns {number} Portata solida per unità di larghezza [m^2/s].
 */
export function meyerPeterMuller(tauStar, tauStarC, d, s) {
  if (tauStar <= tauStarC) return 0;
  const factor = Math.sqrt(GRAVITY * (s - 1) * Math.pow(d, 3));
  return 8 * factor * Math.pow(tauStar - tauStarC, 1.5);
}

/**
 * Metodo di Einstein per il bed-load (approccio semplificato).
 * @param {number} tauStar - Parametro di Shields.
 * @param {number} tauStarC - Valore critico del parametro di Shields.
 * @param {number} d - Diametro medio dei sedimenti [m].
 * @param {number} s - Rapporto di densità rhoS/rho.
 * @returns {number} Portata solida per unità di larghezza [m^2/s].
 */
export function einsteinBedload(tauStar, tauStarC, d, s) {
  if (tauStar <= tauStarC) return 0;
  const factor = Math.sqrt(GRAVITY * (s - 1) * Math.pow(d, 3));
  const phi = 0.4 * Math.pow(tauStar - tauStarC, 2.5);
  return phi * factor;
}

/**
 * Restituisce l'esponente di Rouse P.
 * @param {number} ws - Velocità di caduta delle particelle [m/s].
 * @param {number} uStar - Velocità di attrito [m/s].
 * @returns {number} Esponente di Rouse.
 */
export function rouseExponent(ws, uStar) {
  return ws / (KAPPA * uStar);
}

/**
 * Profilo di concentrazione secondo l'equazione di Rouse.
 * @param {number[]} z - Array di quote [m] dal fondo.
 * @param {number} h - Profondità totale [m].
 * @param {number} ca - Concentrazione a quota za.
 * @param {number} za - Quota di riferimento [m].
 * @param {number} p - Esponente di Rouse.
 * @returns {number[]} Concentrazioni C(z).
 */
export function rouseProfile(z, h, ca, za, p) {
  return z.map((zi) => {
    const term = ((h - zi) / zi) * (za / (h - za));
    return ca * Math.pow(term, p);
  });
}

/**
 * Modello unificato Engelund-Hansen / Van Rijn per il carico totale.
 * @param {number} tauStar - Parametro di Shields.
 * @param {number} d - Diametro medio dei sedimenti [m].
 * @param {number} s - Rapporto di densità rhoS/rho.
 * @returns {number} Carico totale per unità di larghezza [m^2/s].
 */
export function totalLoadEHVR(tauStar, d, s) {
  const factor = Math.sqrt(GRAVITY * (s - 1) * Math.pow(d, 3));
  const engelund = 0.05 * Math.pow(tauStar, 2.5) * factor;
  const vanRijn = 0.016 * Math.pow(tauStar, 2.1) * factor;
  return 0.5 * (engelund + vanRijn);
}

export default {
  shieldsParameter,
  criticalShearStress,
  meyerPeterMuller,
  einsteinBedload,
  rouseExponent,
  rouseProfile,
  totalLoadEHVR
};
