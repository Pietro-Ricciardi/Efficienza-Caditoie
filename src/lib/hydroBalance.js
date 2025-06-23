// Funzioni di bilancio idrologico
// Documentazione in italiano delle formule

/**
 * Calcola l'evapotraspirazione di riferimento ET0
 * utilizzando la formula di Hargreaves.
 * radiation deve essere in MJ/m^2/giorno
 * tmin e tmax in °C.
 */
export function computeET0(radiation, tmin, tmax) {
  const tmean = (tmin + tmax) / 2;
  // 0.0023 (Tmean + 17.8) (Tmax - Tmin)^0.5 Ra
  return 0.0023 * (tmean + 17.8) * Math.sqrt(Math.max(tmax - tmin, 0)) * radiation;
}

/**
 * Stima la pioggia efficace sottraendo ET0 e infiltrazione
 * secondo il modello SCS-CN.
 * precip è la pioggia giornaliera [mm].
 * cnParams include il Curve Number (0-100).
 */
export function computeEffectiveRain(precip, et0, cnParams) {
  const CN = cnParams?.CN ?? 75;
  const S = 25400 / CN - 254; // [mm]
  const Ia = 0.2 * S; // infiltrazione iniziale
  if (precip <= Ia) return 0;
  const Pe = ((precip - Ia) ** 2) / (precip - Ia + S);
  return Math.max(Pe - et0, 0);
}

/**
 * Calcola un fattore di umidità fh in funzione di
 * radiazione solare ed ET0 (modello empirico).
 */
export function computeMoistureFactor(radiation, et0) {
  const ratio = radiation / (radiation + et0 + 1e-6);
  return ratio;
}

/**
 * Aggiorna la granulometria effettiva
 * D_eff = D_nominal * (1 + alpha * fh)
 */
export function computeDEffective(D_nominal, alpha, fh) {
  return D_nominal * (1 + alpha * fh);
}
