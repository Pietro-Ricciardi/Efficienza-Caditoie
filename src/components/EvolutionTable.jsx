import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/EvolutionTable.css';

const EvolutionTable = forwardRef(function EvolutionTable(
  { evolutionData, rangeVar },
  ref
) {
  const header = rangeVar === 'v' ? 'v (m/s)' : 'Q (l/s)';

  return (
    <table className="evolution-table" ref={ref}>
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
});

EvolutionTable.propTypes = {
  evolutionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  rangeVar: PropTypes.string.isRequired
};

export default EvolutionTable;
