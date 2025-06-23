import React from 'react';
import PropTypes from 'prop-types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  LabelList
} from 'recharts';
import Widget from '../Widget';
import EvolutionTable from './EvolutionTable';
import SedimentGraphs from './SedimentGraphs';
import DryAccumulation from './DryAccumulation';
import Formula from '../Formula';
import HydroBalanceChart from './HydroBalanceChart';

function Graphs({
  R1,
  R2,
  Q1_star,
  Q2,
  Q2_star,
  E,
  E_formula,
  data,
  barData,
  pieData,
  lineData,
  sedimentData,
  hydroData,
  params,
  evolutionData,
  rangeVar,
  visibleCharts,
  widgetOrder,
  handleDragStart,
  handleDrop,
  dryDays,
  setDryDays,
  zoneType,
  setZoneType,
  zoneParams,
  minimized,
  toggleMinimized,
  radarRef,
  barRef,
  pieRef,
  lineRef,
  evolutionRef,
  resultsRef
}) {
  const isMinimized = (id) => minimized?.some((w) => w.id === id);
  const widgetMap = {
    results: !isMinimized('results') && (
      <Widget
        id="results"
        title="Risultati"
        ref={resultsRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <div className="formula-list">
          <p>
            <Formula>{`\\(R_1 = 1 - 0.3\,(v - v_0) = ${R1.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(R_2 = \\frac{1}{1 + \\frac{0.083\\, v^{1.8}}{j\\, L^{2/3}}} = ${R2.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(Q_1^* = Q_1\\, R_1 = ${Q1_star.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(Q_2 = Q - Q_1 = ${Q2.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(Q_2^* = Q_2\\, R_2 = ${Q2_star.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(E = \\frac{Q_1^* + Q_2^*}{Q} = ${E.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(E_{\\text{formula}} = R_1\\, E_0 + R_2\\,(1 - E_0) = ${E_formula.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(\\tau = \\rho\\, g\\, h\\, j = ${sedimentData.tau.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(\\theta = \\frac{\\tau}{(\\rho_s - \\rho)\\, g\\, d} = ${sedimentData.theta.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(\\tau_c = \\theta_c(\\rho_s - \\rho) g d = ${sedimentData.tauC.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(q_s^{MPM} = 8\\,\\sqrt{g(s-1)d^3}(\\theta-\\theta_c)^{3/2} = ${sedimentData.bedloadMPM.toExponential(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(q_s^{E} = 0.4\\,\\sqrt{g(s-1)d^3}(\\theta-\\theta_c)^{5/2} = ${sedimentData.bedloadEinstein.toExponential(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(P = \\frac{w_s}{\\kappa u_*} = ${sedimentData.rouseP.toFixed(2)}\\)`}</Formula>
          </p>
          <p>
            <Formula>{`\\(Q_s = 0.5(0.05\\,\\theta^{2.5} + 0.016\\theta^{2.1})\\,\\sqrt{g(s-1)d^3} = ${sedimentData.totalLoad.toExponential(2)}\\)`}</Formula>
          </p>
        </div>
      </Widget>
    ),
    radar: !isMinimized('radar') && (
      <Widget
        id="radar"
        title="Confronto efficienze"
        ref={radarRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            <Radar
              name="Efficienze"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            >
              <LabelList dataKey="A" formatter={(v) => v.toFixed(2)} />
            </Radar>
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Widget>
    ),
    bar: !isMinimized('bar') && (
      <Widget
        id="bar"
        title="R1 e R2"
        ref={barRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d">
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => v.toFixed(2)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Widget>
    ),
    pie: !isMinimized('pie') && (
      <Widget
        id="pie"
        title="Portate intercettate"
        ref={pieRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`c-${index}`} fill={index ? '#8884d8' : '#82ca9d'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Widget>
    ),
    hydro: !isMinimized('hydroBalance') && (
      <HydroBalanceChart
        data={hydroData}
        onCollapseToggle={toggleMinimized}
      />
    ),
    line: !isMinimized('line') && (
      <Widget
        id="line"
        title="Andamento efficienza"
        ref={lineRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="label" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8">
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => v.toFixed(2)}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Widget>
    ),
    evolution: !isMinimized('evolution') && (
      <Widget
        id="evolution"
        title={`Grafico evolutivo (${rangeVar})`}
        ref={evolutionRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolutionData}>
            <XAxis dataKey={rangeVar} />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="efficiency" stroke="#ff7300">
              <LabelList
                dataKey="efficiency"
                position="top"
                formatter={(v) => v.toFixed(2)}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Widget>
    ),
    evolutionTable: !isMinimized('evolutionTable') && (
      <Widget
        id="evolutionTable"
        title={`Tabella evolutiva (${rangeVar})`}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onCollapseToggle={toggleMinimized}
      >
        <EvolutionTable evolutionData={evolutionData} rangeVar={rangeVar} />
      </Widget>
    ),
    sediments: (
      <SedimentGraphs
        params={params}
        sedimentData={sedimentData}
        hydroData={hydroData}
        minimized={minimized}
        toggleMinimized={toggleMinimized}
      />
    ),
    accumulation: (
      <DryAccumulation
        days={dryDays}
        setDays={setDryDays}
        zone={zoneType}
        setZone={setZoneType}
        zoneParams={zoneParams}
        minimized={minimized}
        toggleMinimized={toggleMinimized}
      />
    )
  };

  return (
    <>{widgetOrder.map((w) => (visibleCharts[w] ? widgetMap[w] : null))}</>
  );
}

Graphs.propTypes = {
  R1: PropTypes.number.isRequired,
  R2: PropTypes.number.isRequired,
  Q1_star: PropTypes.number.isRequired,
  Q2: PropTypes.number.isRequired,
  Q2_star: PropTypes.number.isRequired,
  E: PropTypes.number.isRequired,
  E_formula: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  barData: PropTypes.array.isRequired,
  pieData: PropTypes.array.isRequired,
  lineData: PropTypes.array.isRequired,
  sedimentData: PropTypes.object,
  hydroData: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  evolutionData: PropTypes.array.isRequired,
  rangeVar: PropTypes.string.isRequired,
  visibleCharts: PropTypes.object.isRequired,
  widgetOrder: PropTypes.array.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  dryDays: PropTypes.number.isRequired,
  setDryDays: PropTypes.func.isRequired,
  zoneType: PropTypes.string.isRequired,
  setZoneType: PropTypes.func.isRequired,
  zoneParams: PropTypes.object.isRequired,
  minimized: PropTypes.array,
  toggleMinimized: PropTypes.func,
  radarRef: PropTypes.object,
  barRef: PropTypes.object,
  pieRef: PropTypes.object,
  lineRef: PropTypes.object,
  evolutionRef: PropTypes.object,
  resultsRef: PropTypes.object
};

export default React.memo(Graphs);
