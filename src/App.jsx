import React, { useState, useEffect } from "react";
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

} from "recharts";
import "./App.css";
import { calcR1, calcR2, calcTotalEfficiency } from "./utils/calc";

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

  const [leftWidth, setLeftWidth] = useState(30);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((d) => !d);

  const startResize = () => setIsResizing(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e) => {
      if (!isResizing) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 80) setLeftWidth(newWidth);
    };
    const stopResize = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stopResize);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, isMobile]);

  const R1 = calcR1(params.v, params.v0);
  const R2 = calcR2(params.v, params.j, params.L);
  const Q1_star = params.Q1 * R1;
  const Q2 = params.Q - params.Q1;
  const Q2_star = Q2 * R2;
  const E = calcTotalEfficiency(params);
  const E_formula = R1 * params.E0 + R2 * (1 - params.E0);

  const data = [
    { subject: "R1", A: R1 },
    { subject: "R2", A: R2 },
    { subject: "Eff. Totale", A: E },
    { subject: "Formula Comb.", A: E_formula },
  ];

  const barData = [
    { name: "R1", value: R1 },
    { name: "R2", value: R2 },
  ];

  const pieData = [
    { name: "Q1*", value: Q1_star },
    { name: "Q2*", value: Q2_star },
  ];

  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setLineData((d) => [
        ...d.slice(-9),
        { time: new Date().toLocaleTimeString().split(" ")[0], value: E },
      ]);
    }, 1000);
    return () => clearInterval(id);
  }, [E]);

  return (
    <div className={`container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="leftPane" style={{ flexBasis: isMobile ? "100%" : `${leftWidth}%` }}>
        <h1>Efficienza Caditoie</h1>
        <br />
        <div className="theme-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️" : "🌙"}
        </div>
        <br />
        {Object.entries(params).map(([key, value]) => (
          <div key={key} className="slider-container">
            <label className="slider-label">
              {key}: {value.toFixed(2)}
            </label>
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
      {!isMobile && <div className="resizer" onMouseDown={startResize} />}
      {isMobile && <div className="divider" />}
      <div className="rightPane">
        <div className="chart-box">
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
        </div>

        <div className="chart-box">
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
        </div>

        <div className="chart-box">
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
        </div>

        <div className="chart-box">
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
                  <Cell key={`c-${index}`} fill={index ? "#8884d8" : "#82ca9d"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
