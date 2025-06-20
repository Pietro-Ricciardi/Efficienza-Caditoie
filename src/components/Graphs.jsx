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
  LabelList,
} from 'recharts';
import Widget from '../Widget';
import EvolutionTable from './EvolutionTable';

export default function Graphs({
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
  evolutionData,
  rangeVar,
  visibleCharts,
  widgetOrder,
  handleDragStart,
  handleDrop,
  radarRef,
  barRef,
  pieRef,
  lineRef,
  evolutionRef,
  resultsRef,
}) {
  const widgetMap = {
    results: (
      <Widget
        id="results"
        title="Risultati"
        ref={resultsRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        <div className="formula-list">
          <p>R1 = 1 - 0.3 (v - v0) = {R1.toFixed(2)}</p>
          <p>
            R2 = 1 / (1 + (0.083 * v<sup>1.8</sup>) / (j * L<sup>2/3</sup>)) =
            {R2.toFixed(2)}
          </p>
          <p>Q1* = Q1 × R1 = {Q1_star.toFixed(2)}</p>
          <p>Q2 = Q - Q1 = {Q2.toFixed(2)}</p>
          <p>Q2* = Q2 × R2 = {Q2_star.toFixed(2)}</p>
          <p>E = (Q1* + Q2*) / Q = {E.toFixed(2)}</p>
          <p>E formula = R1 × E0 + R2 × (1 - E0) = {E_formula.toFixed(2)}</p>
        </div>
      </Widget>
    ),
    radar: (
      <Widget
        id="radar"
        title="Confronto efficienze"
        ref={radarRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
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
    bar: (
      <Widget
        id="bar"
        title="R1 e R2"
        ref={barRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d">
              <LabelList dataKey="value" position="top" formatter={(v) => v.toFixed(2)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Widget>
    ),
    pie: (
      <Widget
        id="pie"
        title="Portate intercettate"
        ref={pieRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
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
    line: (
      <Widget
        id="line"
        title="Andamento efficienza"
        ref={lineRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="label" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8">
              <LabelList dataKey="value" position="top" formatter={(v) => v.toFixed(2)} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Widget>
    ),
    evolution: (
      <Widget
        id="evolution"
        title={`Grafico evolutivo (${rangeVar})`}
        ref={evolutionRef}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolutionData}>
            <XAxis dataKey={rangeVar} />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="efficiency" stroke="#ff7300">
              <LabelList dataKey="efficiency" position="top" formatter={(v) => v.toFixed(2)} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Widget>
    ),
    evolutionTable: (
      <Widget
        id="evolutionTable"
        title={`Tabella evolutiva (${rangeVar})`}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        <EvolutionTable evolutionData={evolutionData} rangeVar={rangeVar} />
      </Widget>
    ),
  };

  return <>{widgetOrder.map((w) => (visibleCharts[w] ? widgetMap[w] : null))}</>;
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
  evolutionData: PropTypes.array.isRequired,
  rangeVar: PropTypes.string.isRequired,
  visibleCharts: PropTypes.object.isRequired,
  widgetOrder: PropTypes.array.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  radarRef: PropTypes.object,
  barRef: PropTypes.object,
  pieRef: PropTypes.object,
  lineRef: PropTypes.object,
  evolutionRef: PropTypes.object,
  resultsRef: PropTypes.object,
};
