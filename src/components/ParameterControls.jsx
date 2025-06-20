import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Widget from '../Widget';

const paramInfo = {
  Q: 'Portata totale del deflusso (l/s).',
  Q1: 'Porzione di Q che raggiunge direttamente la caditoia (l/s).',
  v: "Velocità del flusso all'ingresso (m/s).",
  v0: 'Velocità di riferimento per il calcolo di R1 (m/s).',
  j: 'Pendenza longitudinale della strada.',
  L: 'Lunghezza della griglia di caduta (m).',
  E0: 'Efficienza geometrica della caditoia.'
};

export default function ParameterControls({
  params,
  infoParam,
  toggleInfo,
  handleChange,
  rangeVar,
  setRangeVar,
  rangeMin,
  setRangeMin,
  rangeMax,
  setRangeMax,
  dataSource,
  setDataSource,
  city,
  setCity,
  apiKey,
  setApiKey,
  apiVerified,
  verifyKey,
  rain
}) {
  const [showKey, setShowKey] = useState(false);

  const renderSlider = (key) => {
    const value = params[key];
    const min = 0;
    const max =
      key === 'E0'
        ? 1
        : key === 'v' || key === 'v0'
          ? 10
          : key === 'j'
            ? 0.2
            : key === 'L'
              ? 5
              : 1000;
    const step =
      key === 'E0' || key === 'L'
        ? 0.01
        : key === 'v' || key === 'v0'
          ? 0.01
          : key === 'j'
            ? 0.001
            : 0.1;
    return (
      <div key={key} className="slider-container">
        <label className="slider-label">
          {key}: {value.toFixed(2)}
          <span className="info-wrapper">
            <span className="info-icon" onClick={() => toggleInfo(key)}>
              i
            </span>
            {infoParam === key && (
              <div className="info-popup">{paramInfo[key]}</div>
            )}
          </span>
        </label>
        <div className="slider-wrapper">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(key, e)}
          />
          <input
            type="number"
            className="slider-input"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(key, e)}
          />
        </div>
      </div>
    );
  };
  return (
    <>
      <Widget id="owm" title="Fonte dati">
        <div className="data-source">
          <label>
            <input
              type="radio"
              value="manual"
              checked={dataSource === 'manual'}
              onChange={() => setDataSource('manual')}
            />
            Manuale
          </label>
          <label>
            <input
              type="radio"
              value="openweather"
              checked={dataSource === 'openweather'}
              onChange={() => setDataSource('openweather')}
            />
            OpenWeatherMap
          </label>
        </div>
        {dataSource === 'openweather' && (
          <>
            <div className="api-key-input">
              <div className="password-wrapper">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="API Key"
                />
                <span
                  className="eye-icon"
                  onMouseDown={() => setShowKey(true)}
                  onMouseUp={() => setShowKey(false)}
                  onMouseLeave={() => setShowKey(false)}
                >
                  &#128065;
                </span>
              </div>
              {!apiVerified && <button onClick={verifyKey}>Verifica</button>}
            </div>
            {apiVerified && (
              <div className="weather-input">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Città"
                />
                <span>
                  Pioggia: {rain != null ? `${rain.toFixed(2)} mm/h` : 'n/d'}
                </span>
              </div>
            )}
          </>
        )}
      </Widget>
      <Widget id="portata" title="Portata">
        {renderSlider('Q')}
        {renderSlider('Q1')}
      </Widget>

      {['v', 'v0'].map((k) => renderSlider(k))}

      <Widget id="pendenza" title="Pendenza">
        {renderSlider('j')}
      </Widget>

      <Widget id="geometrie" title="Geometrie">
        {renderSlider('L')}
        {renderSlider('E0')}
      </Widget>

      <div className="range-selector">
        <label>
          Variabile:
          <select
            value={rangeVar}
            onChange={(e) => setRangeVar(e.target.value)}
          >
            <option value="v">v</option>
            <option value="Q">Q</option>
          </select>
        </label>
        <label>
          Min:
          <input
            type="number"
            value={rangeMin}
            onChange={(e) => setRangeMin(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Max:
          <input
            type="number"
            value={rangeMax}
            onChange={(e) => setRangeMax(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </>
  );
}

ParameterControls.propTypes = {
  params: PropTypes.object.isRequired,
  infoParam: PropTypes.string,
  toggleInfo: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  rangeVar: PropTypes.string.isRequired,
  setRangeVar: PropTypes.func.isRequired,
  rangeMin: PropTypes.number.isRequired,
  setRangeMin: PropTypes.func.isRequired,
  rangeMax: PropTypes.number.isRequired,
  setRangeMax: PropTypes.func.isRequired,
  dataSource: PropTypes.string.isRequired,
  setDataSource: PropTypes.func.isRequired,
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  apiKey: PropTypes.string.isRequired,
  setApiKey: PropTypes.func.isRequired,
  apiVerified: PropTypes.bool.isRequired,
  verifyKey: PropTypes.func.isRequired,
  rain: PropTypes.number
};
