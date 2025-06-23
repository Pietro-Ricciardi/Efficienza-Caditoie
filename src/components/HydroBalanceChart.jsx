import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Widget from './Widget';

const HydroBalanceChart = forwardRef(function HydroBalanceChart(
  { data, collapsed, onCollapseToggle },
  ref
) {
  return (
    <Widget
      id="hydroBalance"
      title="Bilancio idrologico"
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggle}
      ref={ref}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ET0" stroke="#8884d8" />
          <Line type="monotone" dataKey="P" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Peff" stroke="#ff7300" />
          <Line type="monotone" dataKey="fh" stroke="#ff0000" />
          <Line type="monotone" dataKey="dEff" stroke="#aa8800" />
        </LineChart>
      </ResponsiveContainer>
    </Widget>
  );
});

HydroBalanceChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  collapsed: PropTypes.bool,
  onCollapseToggle: PropTypes.func
};

export default HydroBalanceChart;
