import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../Widget';
import {
  linearAccumulation,
  saturatingAccumulation,
  getZoneDefaults
} from '../utils/accumulation';

export default function DryAccumulation({ days, setDays, zone, setZone }) {
  const defaults = getZoneDefaults(zone);
  const linear = linearAccumulation(days, defaults.k);
  const saturating = saturatingAccumulation(days, defaults.k, defaults.Lmax);

  return (
    <Widget id="dry" title="Accumulo secco">
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
        <p>Carico lineare: {linear.toFixed(2)} kg/ha</p>
        <p>Carico con saturazione: {saturating.toFixed(2)} kg/ha</p>
      </div>
    </Widget>
  );
}

DryAccumulation.propTypes = {
  days: PropTypes.number.isRequired,
  setDays: PropTypes.func.isRequired,
  zone: PropTypes.string.isRequired,
  setZone: PropTypes.func.isRequired
};
