import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../Widget';
import {
  linearAccumulation,
  saturatingAccumulation,
  getZoneDefaults
} from '../utils/accumulation';

export default function DryAccumulation({
  days,
  setDays,
  zone,
  setZone,
  zoneParams,
  minimized,
  toggleMinimized
}) {
  const isMinimized = minimized?.some((w) => w.id === 'dry');
  const defaults = getZoneDefaults(zone, zoneParams);
  const linear = linearAccumulation(days, defaults.k);
  const saturating = saturatingAccumulation(days, defaults.k, defaults.Lmax);
  const linearGm2 = linear * 0.1; // 1 kg/ha = 0.1 g/m²
  const saturatingGm2 = saturating * 0.1;

  return (
    !isMinimized && (
      <Widget
        id="dry"
        title="Accumulo secco"
        onCollapseToggle={toggleMinimized}
      >
        <div className="dry-inputs">
          <label>
            Zona:
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              <option value="residenziale">Residenziale</option>
              <option value="commerciale">Commerciale</option>
              <option value="industriale">Industriale</option>
            </select>
          </label>
          <label>
            Giorni senza pioggia:
            <input
              type="number"
              value={days}
              min={0}
              onChange={(e) => setDays(parseFloat(e.target.value))}
            />
          </label>
        </div>
        <div className="dry-results">
          <p>
            Carico lineare: {linear.toFixed(2)} kg/ha ({linearGm2.toFixed(2)}{' '}
            g/m²)
          </p>
          <p>
            Carico con saturazione: {saturating.toFixed(2)} kg/ha (
            {saturatingGm2.toFixed(2)} g/m²)
          </p>
        </div>
      </Widget>
    )
  );
}

DryAccumulation.propTypes = {
  days: PropTypes.number.isRequired,
  setDays: PropTypes.func.isRequired,
  zone: PropTypes.string.isRequired,
  setZone: PropTypes.func.isRequired,
  zoneParams: PropTypes.object,
  minimized: PropTypes.array,
  toggleMinimized: PropTypes.func
};
