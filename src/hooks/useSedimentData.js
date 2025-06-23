import { useEffect, useState } from 'react';
import {
  shieldsParameter,
  criticalShearStress,
  meyerPeterMuller,
  einsteinBedload,
  rouseExponent,
  totalLoadEHVR
} from '../lib';

const initial = {
  tau: 0,
  theta: 0,
  tauC: 0,
  bedloadMPM: 0,
  bedloadEinstein: 0,
  totalLoad: 0,
  rouseP: 0
};

export default function useSedimentData(params) {
  const [sedimentData, setSedimentData] = useState(initial);

  useEffect(() => {
    const rho = 1000;
    const g = 9.81;
    const tau = rho * g * params.h * params.j;
    const theta = shieldsParameter(tau, params.rhoS, rho, params.d50);
    const thetaC = 0.047;
    const tauC = criticalShearStress(thetaC, params.rhoS, rho, params.d50);
    const s = params.rhoS / rho;
    const bedloadMPM = meyerPeterMuller(theta, thetaC, params.d50, s);
    const bedloadEinstein = einsteinBedload(theta, thetaC, params.d50, s);
    const totalLoad = totalLoadEHVR(theta, params.d50, s);
    const uStar = Math.sqrt(tau / rho);
    const ws = Math.sqrt(((params.rhoS - rho) / rho) * g * params.d50);
    const rouseP = rouseExponent(ws, uStar);
    setSedimentData({
      tau,
      theta,
      tauC,
      bedloadMPM,
      bedloadEinstein,
      totalLoad,
      rouseP
    });
  }, [params]);

  return sedimentData;
}
