import React, { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [params, setParams] = useState({
    Q: 100,
    Q1: 60,
    v: 1.5,
    v0: 1.0,
    j: 0.01,
    L: 0.5,
    E0: 0.7,
  });

  const handleChange = (key, event) => {
    const value = parseFloat(event.target.value);
    setParams({ ...params, [key]: value });
  };

  const R1 = 1 - 0.3 * (params.v - params.v0);
  const R2 = 1 / (1 + (0.083 * Math.pow(params.v, 1.8)) / (params.j * Math.pow(params.L, 2 / 3)));
  const Q1_star = params.Q1 * R1;
  const Q2 = params.Q - params.Q1;
  const Q2_star = Q2 * R2;
  const E = (Q1_star + Q2_star) / params.Q;
  const E_formula = R1 * params.E0 + R2 * (1 - params.E0);

  const data = [
    { subject: "R1", A: R1 },
    { subject: "R2", A: R2 },
    { subject: "Eff. Totale", A: E },
    { subject: "Formula Comb.", A: E_formula },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Efficienza Caditoie</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div>
          {Object.entries(params).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label>{key}: {value}</label>
              <input
                type="range"
                min={key === "E0" ? 0 : 0.01}
                max={key === "E0" ? 1 : key === "v" || key === "v0" ? 5 : 200}
                step={key === "E0" || key === "j" || key === "L" ? 0.01 : 1}
                value={value}
                onChange={(e) => handleChange(key, e)}
              />
            </div>
          ))}
        </div>
        <div style={{ width: 500, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar name="Efficienze" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
