import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  Legend
} from 'recharts';
import Widget from './Widget';
import {
  meyerPeterMuller,
  einsteinBedload,
  rouseProfile,
  totalLoadEHVR
} from '../lib/sediment';

export default function SedimentGraphs({
  params,
  sedimentData,
  hydroData,
  minimized,
  toggleMinimized
}) {
  const isMinimized = (id) => minimized?.some((w) => w.id === id);
  const bedloadData = useMemo(() => {
    const thetaC = 0.047;
    const s = params.rhoS / 1000;
    const thetaMax = Math.max(sedimentData.theta * 1.5, thetaC + 0.05);
    const data = [];
    for (let i = 0; i <= 20; i++) {
      const theta = thetaC + (i / 20) * (thetaMax - thetaC);
      data.push({
        theta,
        mpm: meyerPeterMuller(theta, thetaC, params.d50, s),
        einstein: einsteinBedload(theta, thetaC, params.d50, s)
      });
    }
    return data;
  }, [params, sedimentData.theta]);

  const concentrationData = useMemo(() => {
    const h = params.h;
    const za = 0.05 * h;
    const ca = 0.01;
    const zVals = Array.from(
      { length: 20 },
      (_, i) => za + (i / 19) * (h - za)
    );
    const cVals = rouseProfile(zVals, h, ca, za, sedimentData.rouseP);
    return zVals.map((z, idx) => ({ z, c: cVals[idx] }));
  }, [params.h, sedimentData.rouseP]);

  const totalLoadData = [{ name: 'Q_s', value: sedimentData.totalLoad }];

  const impactData = useMemo(() => {
    const dEff = hydroData?.[0]?.dEff ?? params.d50;
    const thetaC = 0.047;
    const s = params.rhoS / 1000;
    const baseMPM = meyerPeterMuller(sedimentData.theta, thetaC, params.d50, s);
    const baseEinstein = einsteinBedload(
      sedimentData.theta,
      thetaC,
      params.d50,
      s
    );
    const baseTotal = totalLoadEHVR(sedimentData.theta, params.d50, s);

    const effMPM = meyerPeterMuller(sedimentData.theta, thetaC, dEff, s);
    const effEinstein = einsteinBedload(sedimentData.theta, thetaC, dEff, s);
    const effTotal = totalLoadEHVR(sedimentData.theta, dEff, s);
    return [
      { name: 'MPM', base: baseMPM, eff: effMPM },
      { name: 'Einstein', base: baseEinstein, eff: effEinstein },
      { name: 'Totale', base: baseTotal, eff: effTotal }
    ];
  }, [hydroData, params.d50, params.rhoS, sedimentData.theta]);

  return (
    <>
      {!isMinimized('bedloadCurve') && (
        <Widget
          id="bedloadCurve"
          title="Curva del bed-load"
          onCollapseToggle={toggleMinimized}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bedloadData}>
              <XAxis dataKey="theta" tickFormatter={(v) => v.toFixed(2)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mpm" stroke="#8884d8" name="MPM" />
              <Line
                type="monotone"
                dataKey="einstein"
                stroke="#82ca9d"
                name="Einstein"
              />
            </LineChart>
          </ResponsiveContainer>
        </Widget>
      )}
      {!isMinimized('concentrationProfile') && (
        <Widget
          id="concentrationProfile"
          title="Profilo di concentrazione"
          onCollapseToggle={toggleMinimized}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={concentrationData}>
              <XAxis dataKey="z" tickFormatter={(v) => v.toFixed(2)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="c" stroke="#ff7300" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Widget>
      )}
      {!isMinimized('totalLoad') && (
        <Widget
          id="totalLoad"
          title="Carico totale"
          onCollapseToggle={toggleMinimized}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={totalLoadData}
              margin={{ top: 20, right: 20, left: 40 }}
            >
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, 'dataMax']}
                tickFormatter={(v) => v.toExponential(0)}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc658">
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => v.toExponential(2)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Widget>
      )}
      {!isMinimized('impact') && (
        <Widget
          id="impact"
          title="Impatto bilancio-sedimenti"
          onCollapseToggle={toggleMinimized}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={impactData}
              margin={{ top: 20, right: 20, left: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => v.toExponential(1)} />
              <Tooltip />
              <Legend />
              <Bar dataKey="base" fill="#8884d8" name="d50">
                <LabelList
                  dataKey="base"
                  position="top"
                  formatter={(v) => v.toExponential(2)}
                />
              </Bar>
              <Bar dataKey="eff" fill="#82ca9d" name="D_eff">
                <LabelList
                  dataKey="eff"
                  position="top"
                  formatter={(v) => v.toExponential(2)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Widget>
      )}
    </>
  );
}

SedimentGraphs.propTypes = {
  params: PropTypes.shape({
    d50: PropTypes.number.isRequired,
    rhoS: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired
  }).isRequired,
  sedimentData: PropTypes.shape({
    theta: PropTypes.number.isRequired,
    rouseP: PropTypes.number.isRequired,
    totalLoad: PropTypes.number.isRequired
  }).isRequired,
  hydroData: PropTypes.array,
  minimized: PropTypes.array,
  toggleMinimized: PropTypes.func
};
