import React, { useState, useEffect, useRef, useMemo } from "react";
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
import logo from "./logo.svg";
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
import Widget from "./Widget";
import Help from "./Help";
import Toast from "./Toast";

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

  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  };

  const handleChange = (key, event) => {
    const value = parseFloat(event.target.value);
    const newParams = { ...params, [key]: value };
    const warnings = validaParametri(newParams);
    setParams(newParams);
    if (warnings.length) {
      warnings.forEach(addToast);
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
  const resultsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
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


  const R1 = useMemo(() => calcR1(params.v, params.v0), [params]);
  const R2 = useMemo(() => calcR2(params.v, params.j, params.L), [params]);
  const Q1_star = useMemo(() => params.Q1 * R1, [params, R1]);
  const Q2 = params.Q - params.Q1;
  const Q2_star = useMemo(() => Q2 * R2, [params, R2]);
  const E = useMemo(() => calcTotalEfficiency(params), [params]);
  const E_formula = useMemo(
    () => R1 * params.E0 + R2 * (1 - params.E0),
    [params, R1, R2]
  );

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
    results: true,
  });
  const [widgetOrder, setWidgetOrder] = useState([
    'results',
    'radar',
    'bar',
    'pie',
    'line',
    'evolution',
  ]);
  const [dragging, setDragging] = useState(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const toggleChart = (chart) =>
    setVisibleCharts((c) => ({ ...c, [chart]: !c[chart] }));

  const handleDragStart = (id) => setDragging(id);
  const handleDrop = (id) => {
    if (dragging === null || dragging === id) return;
    const newOrder = [...widgetOrder];
    const from = newOrder.indexOf(dragging);
    const to = newOrder.indexOf(id);
    if (from !== -1 && to !== -1) {
      newOrder.splice(from, 1);
      newOrder.splice(to, 0, dragging);
      setWidgetOrder(newOrder);
    }
    setDragging(null);
  };

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
    const { data, error } = caricaParametri('savedParams');
    if (data) {
      setParams(data);
    } else if (error) {
      addToast(error.message);
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
        .catch(() => addToast('File JSON non valido'));
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

  const [actionsOpen, setActionsOpen] = useState(false);

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
                <Cell key={`c-${index}`} fill={index ? "#8884d8" : "#82ca9d"} />
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
  };

  return (
    <>
      <div
        className={`container flex min-h-screen bg-gray-100 ${
          isDarkMode ? "dark-mode" : ""
        }`}
      >
        <header className="top-bar flex items-center justify-start bg-white shadow fixed w-full z-50 p-2 space-x-2">
        <img src={logo} alt="Logo" className="w-6 h-6" />
        <span className="font-semibold">Efficienza Caditoie</span>
        <span>- Pietro Ricciardi -</span>
        <a
          href="https://github.com/Pietro-Ricciardi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.56 7.56 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/pietro-ricciardi/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.708-.52-1.248-1.341-1.248-.822 0-1.358.54-1.358 1.248 0 .694.521 1.248 1.327 1.248h.014zM13.458 13.394v-3.997c0-2.137-1.143-3.129-2.666-3.129-1.23 0-1.788.692-2.098 1.184v.025h-.014a5.19 5.19 0 01.014-.025V6.169h-2.4c.03.653 0 7.225 0 7.225h2.4v-4.035c0-.216.015-.432.079-.586.174-.432.571-.879 1.237-.879.872 0 1.222.663 1.222 1.637v3.863h2.401z" />
          </svg>
        </a>
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="mr-4">
          Licenza MIT
        </a>
        <button className="theme-toggle text-2xl cursor-pointer" onClick={toggleDarkMode}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>
      {!sidebarOpen && (
        <button
          className="sidebar-toggle fixed-toggle"
          onClick={toggleSidebar}
        >
          ❯
        </button>
      )}
      <aside
        className={`leftPane bg-white shadow-md p-4 ${
          sidebarOpen ? "" : "collapsed"
        }`}
        style={{ flexBasis: sidebarOpen ? (isMobile ? "100%" : "200px") : "0" }}
      >
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? "❮" : "❯"}
          </button>
        </div>
        <nav className="menu-vertical flex flex-col space-y-2 mt-2">
          <button
            className="px-4 py-2 text-left hover:bg-gray-100 w-full"
            onClick={() =>
              setActivePage(activePage === 'parameters' ? 'graphs' : 'parameters')
            }
          >
            {activePage === 'parameters' ? 'Simulazione' : 'Parametri'}
          </button>

          <button
            className="px-4 py-2 text-left hover:bg-gray-100 w-full"
            onClick={() => setActivePage('help')}
          >
            Help
          </button>

          <div className="graphs-menu">
            <button
              className="px-4 py-2 text-left hover:bg-gray-100 w-full flex justify-between"
              onClick={() => setAppearanceOpen((o) => !o)}
            >
              Aspetto <span>{appearanceOpen ? '▲' : '▼'}</span>
            </button>
            {appearanceOpen && (
              <div className="submenu ml-4 mt-1 space-y-1">
                <button
                  className="submenu-item w-full text-left flex items-center"
                  onClick={() => toggleChart('radar')}
                >
                  <span className="w-4">{visibleCharts.radar ? '✓' : ''}</span>
                  Grafico radar
                </button>
                <button
                  className="submenu-item w-full text-left flex items-center"
                  onClick={() => toggleChart('bar')}
                >
                  <span className="w-4">{visibleCharts.bar ? '✓' : ''}</span>
                  Grafico a barre
                </button>
                <button
                  className="submenu-item w-full text-left flex items-center"
                  onClick={() => toggleChart('pie')}
                >
                  <span className="w-4">{visibleCharts.pie ? '✓' : ''}</span>
                  Grafico a torta
                </button>
                <button
                  className="submenu-item w-full text-left flex items-center"
                  onClick={() => toggleChart('line')}
                >
                  <span className="w-4">{visibleCharts.line ? '✓' : ''}</span>
                  Grafico a linee
                </button>
                <button
                  className="submenu-item w-full text-left flex items-center"
                  onClick={() => toggleChart('evolution')}
                >
                  <span className="w-4">{visibleCharts.evolution ? '✓' : ''}</span>
                  Grafico evolutivo
                </button>
              </div>
            )}
          </div>

          <div className="actions-menu">
            <button
              className="px-4 py-2 text-left hover:bg-gray-100 w-full flex justify-between"
              onClick={() => setActionsOpen((o) => !o)}
            >
              Azioni <span>{actionsOpen ? '▲' : '▼'}</span>
            </button>
            {actionsOpen && (
              <div className="submenu ml-4 mt-1 space-y-1 export-buttons">
                <button onClick={downloadCSV}>
                  Esporta CSV
                </button>
                <button onClick={downloadExcel}>
                  Esporta Excel
                </button>
                <button onClick={salvaParametriStorage}>
                  Salva parametri
                </button>
                <button onClick={caricaParametriStorage}>
                  Carica parametri
                </button>
                <button onClick={esportaJSON}>
                  Esporta JSON
                </button>
                <input
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={importaJSON}
                />
                <button onClick={() => fileInputRef.current.click()}>
                  Importa JSON
                </button>
                <button onClick={() => downloadImage(radarRef, 'radar.png')}>
                  Salva radar
                </button>
                <button onClick={() => downloadImage(barRef, 'barre.png')}>
                  Salva barre
                </button>
                <button onClick={() => downloadImage(pieRef, 'torta.png')}>
                  Salva torta
                </button>
                <button onClick={() => downloadImage(lineRef, 'linee.png')}>
                  Salva linee
                </button>
                <button onClick={() => downloadImage(evolutionRef, 'evoluzione.png')}>
                  Salva evolutivo
                </button>
              </div>
            )}
          </div>
        </nav>

      </aside>
      <div className="rightPane flex-1 p-6 overflow-auto grid gap-4">
        {activePage === 'parameters' && (
          <>
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
                    <span className="info-wrapper">
                      <span className="info-icon" onClick={() => toggleInfo(key)}>i</span>
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
            })}

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
        )}
        {activePage === 'graphs' && (
          <>
            {widgetOrder.map((w) => (visibleCharts[w] ? widgetMap[w] : null))}
          </>
        )}
        {activePage === 'help' && <Help />}

      </div>
      </div>
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </>
  );
}
