import React, { useState, useEffect, useRef } from "react";
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
  Legend,

} from "recharts";
import "./App.css";
import { validaParametri } from "./utils/validate";
import {
  calcR1,
  calcR2,
  calcTotalEfficiency,
  generateEfficiencySeries,
} from "./utils/calc";
import {
  salvaParametri,
  caricaParametri,
  esportaParametri,
  importaParametri,
} from "./utils/storage";
import Help from "./Help";
import Widget from "./Widget";

const paramInfo = {
  Q: "Portata totale del deflusso (l/s).",
  Q1: "Porzione di Q che raggiunge direttamente la caditoia (l/s).",
  v: "Velocità del flusso all'ingresso (m/s).",
  v0: "Velocità di riferimento per il calcolo di R1 (m/s).",
  j: "Pendenza longitudinale della strada.",
  L: "Lunghezza della griglia di caduta (m).",
  E0: "Efficienza geometrica della caditoia.",
};

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
    const newParams = { ...params, [key]: value };
    const warnings = validaParametri(newParams);
    setParams(newParams);
    if (warnings.length) {
      alert(warnings.join("\n"));
    }
  };

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [activePage, setActivePage] = useState('graphs');
  const [infoParam, setInfoParam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [rangeVar, setRangeVar] = useState("v");
  const [rangeMin, setRangeMin] = useState(0.5);
  const [rangeMax, setRangeMax] = useState(3);
  const [evolutionData, setEvolutionData] = useState([]);

  const radarRef = useRef(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const evolutionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((d) => !d);

  const toggleSidebar = () => setSidebarOpen((s) => !s);


  const toggleInfo = (key) =>
    setInfoParam((current) => (current === key ? null : key));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
  const [visibleCharts, setVisibleCharts] = useState({
    radar: true,
    bar: true,
    pie: true,
    line: true,
    evolution: true,
  });

  const toggleChart = (chart) =>
    setVisibleCharts((c) => ({ ...c, [chart]: !c[chart] }));

  useEffect(() => {
    setLineData([
      { label: "R1", value: R1 },
      { label: "R2", value: R2 },
      { label: "E", value: E },
      { label: "E_formula", value: E_formula },
    ]);
  }, [E, R1, R2, E_formula]);

  useEffect(() => {
    setEvolutionData(
      generateEfficiencySeries(params, rangeVar, rangeMin, rangeMax, 5)
    );
  }, [params, rangeVar, rangeMin, rangeMax]);

  const downloadCSV = () => {
    const rows = [
      ["Parametro", "Valore"],
      ["R1", R1.toFixed(4)],
      ["R2", R2.toFixed(4)],
      ["E", E.toFixed(4)],
      ["E_formula", E_formula.toFixed(4)],
    ];
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "efficienze.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const rows = [
      ["Parametro", "Valore"],
      ["R1", R1.toFixed(4)],
      ["R2", R2.toFixed(4)],
      ["E", E.toFixed(4)],
      ["E_formula", E_formula.toFixed(4)],
    ];
    const csvContent = "sep=,\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "efficienze.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const salvaParametriStorage = () => {
    salvaParametri('savedParams', params);
  };

  const caricaParametriStorage = () => {
    const loaded = caricaParametri('savedParams');
    if (loaded) {
      setParams(loaded);
    }
  };

  const esportaJSON = () => {
    esportaParametri(params);
  };

  const importaJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      importaParametri(file)
        .then((p) => setParams(p))
        .catch(() => alert('File JSON non valido'));
    }
  };

  const downloadImage = (ref, name) => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth;
    canvas.height = svg.clientHeight;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = name;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  };

  const menuItems =
    activePage === 'graphs'
      ? [
          { key: 'parameters', label: 'Parametri' },
          { key: 'graphs', label: 'Grafici' },
          { key: 'help', label: 'Help' },
        ]
      : [
          { key: 'graphs', label: 'Grafici' },
          { key: 'parameters', label: 'Parametri' },
          { key: 'help', label: 'Help' },
        ];

  return (
    <div
      className={`container flex min-h-screen bg-gray-100 ${
        isDarkMode ? "dark-mode" : ""
      }`}
    >
      <header className="top-bar flex items-center justify-center bg-white shadow fixed w-full z-50">
        Efficienza Caditoie - Pietro Ricciardi -{' '}
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer">
          Licenza MIT
        </a>
      </header>
      <button
        className="sidebar-toggle bg-blue-600 text-white px-2 py-1 rounded fixed top-12 left-2 z-50"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "❮" : "❯"}
      </button>
      <aside
        className={`leftPane bg-white shadow-md p-4 ${
          sidebarOpen ? "" : "collapsed"
        }`}
        style={{ flexBasis: sidebarOpen ? (isMobile ? "100%" : "200px") : "0" }}
      >
        <nav className="menu-vertical flex flex-col space-y-2">
          {menuItems.map((item) =>
            item.key === "graphs" ? (
              <div key="graphs" className="graphs-menu">
                <button
                  className="px-4 py-2 text-left hover:bg-gray-100 w-full"
                  onClick={() => setActivePage('graphs')}
                >
                  {item.label}
                </button>
                <div className="submenu ml-4 mt-1 space-y-1">
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleCharts.radar}
                      onChange={() => toggleChart('radar')}
                    />
                    Grafico radar
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleCharts.bar}
                      onChange={() => toggleChart('bar')}
                    />
                    Grafico a barre
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleCharts.pie}
                      onChange={() => toggleChart('pie')}
                    />
                    Grafico a torta
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleCharts.line}
                      onChange={() => toggleChart('line')}
                    />
                    Grafico a linee
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleCharts.evolution}
                      onChange={() => toggleChart('evolution')}
                    />
                    Grafico evolutivo
                  </label>
                </div>
              </div>
            ) : (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className="px-4 py-2 text-left hover:bg-gray-100 w-full"
              >
                {item.label}
              </button>
            )
          )}
        </nav>
        <div className="theme-toggle text-2xl cursor-pointer text-center my-4" onClick={toggleDarkMode}>
          {isDarkMode ? '☀️' : '🌙'}
        </div>

        <div className="export-buttons flex flex-wrap gap-2 mt-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={downloadCSV}>Esporta CSV</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={downloadExcel}>Esporta Excel</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={salvaParametriStorage}>Salva parametri</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={caricaParametriStorage}>Carica parametri</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={esportaJSON}>Esporta JSON</button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={importaJSON}
          />
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => fileInputRef.current.click()}>Importa JSON</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => downloadImage(radarRef, 'radar.png')}>Salva radar</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => downloadImage(barRef, 'barre.png')}>Salva barre</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => downloadImage(pieRef, 'torta.png')}>Salva torta</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => downloadImage(lineRef, 'linee.png')}>Salva linee</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => downloadImage(evolutionRef, 'evoluzione.png')}>Salva evolutivo</button>
        </div>
      </aside>
      <div className="rightPane flex-1 p-6 overflow-auto grid gap-4">
        {activePage === 'help' && <Help />}
        {activePage === 'parameters' && (
          <>
            <h1>Efficienza Caditoie</h1>
            {Object.entries(params).map(([key, value]) => {
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
                    <span className="info-icon" onClick={() => toggleInfo(key)}>i</span>
                    {infoParam === key && (
                      <div className="info-popup">{paramInfo[key]}</div>
                    )}
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
            })}
          </>
        )}
        {activePage === 'graphs' && (
          <>
            <div className="range-selector">
              <label>
                Variabile:
                <select value={rangeVar} onChange={(e) => setRangeVar(e.target.value)}>
                  <option value="v">v</option>
                  <option value="Q">Q</option>
                </select>
              </label>
              <label>
                Min:
                <input type="number" value={rangeMin} onChange={(e) => setRangeMin(parseFloat(e.target.value))} />
              </label>
              <label>
                Max:
                <input type="number" value={rangeMax} onChange={(e) => setRangeMax(parseFloat(e.target.value))} />
              </label>
            </div>
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

            {visibleCharts.radar && (
            <Widget title="Confronto efficienze" ref={radarRef}>
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
            )}

            {visibleCharts.bar && (
            <Widget title="R1 e R2" ref={barRef}>
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
            )}

            {visibleCharts.pie && (
            <Widget title="Portate intercettate" ref={pieRef}>
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
            </Widget>
            )}

            {visibleCharts.line && (
            <Widget title="Andamento efficienza" ref={lineRef}>
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
            )}

            {visibleCharts.evolution && (
            <Widget title={`Grafico evolutivo (${rangeVar})`} ref={evolutionRef}>
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
            )}
          </>
        )}

      </div>
    </div>
  );
}
