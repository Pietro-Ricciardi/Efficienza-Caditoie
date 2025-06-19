import React from 'react';
import PropTypes from 'prop-types';

export default function EvolutionTable({ evolutionData, rangeVar }) {
  const header = rangeVar === 'Q' ? 'Q (l/s)' : 'v (m/s)';

  return (
    <table>
      <thead>
        <tr>
          <th>{header}</th>
          <th>Efficienza</th>
        </tr>
      </thead>
      <tbody>
        {evolutionData.map((row, idx) => (
          <tr key={idx}>
            <td>{row[rangeVar].toFixed(2)}</td>
            <td>{row.efficiency.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

EvolutionTable.propTypes = {
  evolutionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  rangeVar: PropTypes.string.isRequired
};
