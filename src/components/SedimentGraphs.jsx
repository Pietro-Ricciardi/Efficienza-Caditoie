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
  LabelList
} from 'recharts';
import Widget from '../Widget';
import {
  meyerPeterMuller,
  einsteinBedload,
  rouseProfile
} from '../lib/sediment';

export default function SedimentGraphs({ params, sedimentData }) {
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

  return (
    <>
      <Widget id="bedloadCurve" title="Curva del bed-load">
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
      <Widget id="concentrationProfile" title="Profilo di concentrazione">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={concentrationData}>
            <XAxis dataKey="z" tickFormatter={(v) => v.toFixed(2)} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="c" stroke="#ff7300" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Widget>
      <Widget id="totalLoad" title="Carico totale">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={totalLoadData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc658">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Widget>
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
  }).isRequired
};
