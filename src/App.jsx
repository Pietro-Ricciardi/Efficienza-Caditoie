import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import Help from "./Help";
import Normativa from "./Normativa";
import Toast from "./Toast";
import ParameterControls from "./components/ParameterControls";
import Graphs from "./components/Graphs";
import Sidebar from "./components/Sidebar";
import { fetchRain, verifyApiKey } from "./utils/weather";
import {
  shieldsParameter,
  criticalShearStress,
  meyerPeterMuller,
  einsteinBedload,
  rouseExponent,
  totalLoadEHVR,
} from "./lib/sediment";

function exportFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function App() {
  const [params, setParams] = useState({
    Q: 100,
    Q1: 60,
    v: 1.5,
    v0: 1.0,
    j: 0.01,
    L: 0.5,
    E0: 0.7,
    d50: 0.002,
    rhoS: 2650,
    h: 1.0,
  });

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const handleChange = useCallback(
    (key, event) => {
      const value = parseFloat(event.target.value);
      setParams((prev) => {
        const newParams = { ...prev, [key]: value };
        const warnings = validaParametri(newParams);
        if (warnings.length) {
          warnings.forEach(addToast);
        }
        return newParams;
      });
    },
    [addToast]
  );

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [activePage, setActivePage] = useState('graphs');
  const [infoParam, setInfoParam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [rangeVar, setRangeVar] = useState("v");
  const [rangeMin, setRangeMin] = useState(0.5);
  const [rangeMax, setRangeMax] = useState(3);
  const [dataSource, setDataSource] = useState('manual');
  const [city, setCity] = useState('');
  const [rain, setRain] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiVerified, setApiVerified] = useState(false);

  const radarRef = useRef(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const evolutionRef = useRef(null);
  const resultsRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const verifyKey = useCallback(() => {
    verifyApiKey(apiKey)
      .then(() => {
        setApiVerified(true);
        addToast('API key valida');
      })
      .catch(() => {
        setApiVerified(false);
        addToast('API key non valida');
      });
  }, [apiKey, addToast]);


  const toggleInfo = (key) =>
    setInfoParam((current) => (current === key ? null : key));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dataSource === 'openweather' && apiVerified && city) {
      fetchRain(city, apiKey)
        .then((r) => {
          setRain(r);
          setParams((p) => ({ ...p, Q: r, Q1: r * 0.6 }));
        })
        .catch(() => addToast('Errore caricamento dati meteo'));
    }
  }, [dataSource, apiVerified, city, apiKey, addToast]);


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

  const evolutionData = useMemo(
    () => generateEfficiencySeries(params, rangeVar, rangeMin, rangeMax, 5),
    [params, rangeVar, rangeMin, rangeMax]
  );

  const [lineData, setLineData] = useState([]);
  const [sedimentData, setSedimentData] = useState({
    tau: 0,
    theta: 0,
    tauC: 0,
    bedloadMPM: 0,
    bedloadEinstein: 0,
    totalLoad: 0,
    rouseP: 0,
  });
  const [visibleCharts, setVisibleCharts] = useState({
    radar: true,
    bar: true,
    pie: true,
    line: true,
    evolution: true,
    evolutionTable: true,
    results: true,
    sediments: true,
  });
  const [widgetOrder, setWidgetOrder] = useState([
    'results',
    'radar',
    'bar',
    'pie',
    'line',
    'evolution',
    'evolutionTable',
    'sediments',
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
    const rho = 1000; // densità dell'acqua [kg/m^3]
    const g = 9.81;
    const tau = rho * g * params.h * params.j;
    const theta = shieldsParameter(tau, params.rhoS, rho, params.d50);
    const thetaC = 0.047;
    const tauC = criticalShearStress(thetaC, params.rhoS, rho, params.d50);
    const s = params.rhoS / rho;
    const bedloadMPM = meyerPeterMuller(theta, thetaC, params.d50, s);
    const bedloadEinstein = einsteinBedload(theta, thetaC, params.d50, s);
    const totalLoad = totalLoadEHVR(theta, params.d50, s);
    const uStar = Math.sqrt(tau / rho);
    const ws = Math.sqrt(((params.rhoS - rho) / rho) * g * params.d50);
    const rouseP = rouseExponent(ws, uStar);
    setSedimentData({
      tau,
      theta,
      tauC,
      bedloadMPM,
      bedloadEinstein,
      totalLoad,
      rouseP,
    });
  }, [params]);

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
    exportFile(blob, "efficienze.csv");
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
    exportFile(blob, "efficienze.xls");
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

  const downloadImage = useCallback((ref, name) => {
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
  }, []);

  const [actionsOpen, setActionsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  const downloadFile = (path, name) => {
    const link = document.createElement('a');
    link.href = path;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplateCSV = () =>
    downloadFile('/templates/parametri_template.csv', 'parametri_template.csv');
  const downloadTemplateExcel = () =>
    downloadFile('/templates/parametri_template.xls', 'parametri_template.xls');
  const downloadTemplateJSON = () =>
    downloadFile('/templates/parametri_template.json', 'parametri_template.json');


  return (
    <>
      <div className="container flex min-h-screen bg-gray-100">
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
      </header>
      {!sidebarOpen && (
        <button className="sidebar-toggle fixed-toggle" onClick={toggleSidebar}>
          ❯
        </button>
      )}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        activePage={activePage}
        setActivePage={setActivePage}
        appearanceOpen={appearanceOpen}
        setAppearanceOpen={setAppearanceOpen}
        visibleCharts={visibleCharts}
        toggleChart={toggleChart}
        actionsOpen={actionsOpen}
        setActionsOpen={setActionsOpen}
        templatesOpen={templatesOpen}
        setTemplatesOpen={setTemplatesOpen}
        downloadCSV={downloadCSV}
        downloadExcel={downloadExcel}
        downloadTemplateCSV={downloadTemplateCSV}
        downloadTemplateExcel={downloadTemplateExcel}
        downloadTemplateJSON={downloadTemplateJSON}
        salvaParametriStorage={salvaParametriStorage}
        caricaParametriStorage={caricaParametriStorage}
        esportaJSON={esportaJSON}
        fileInputRef={fileInputRef}
        importaJSON={importaJSON}
        downloadImage={downloadImage}
        radarRef={radarRef}
        barRef={barRef}
        pieRef={pieRef}
        lineRef={lineRef}
        evolutionRef={evolutionRef}
      />
      <div className="rightPane flex-1 p-6 overflow-auto grid gap-4">
        {activePage === 'parameters' && (
          <ParameterControls
            params={params}
            infoParam={infoParam}
            toggleInfo={toggleInfo}
            handleChange={handleChange}
            rangeVar={rangeVar}
            setRangeVar={setRangeVar}
            rangeMin={rangeMin}
            setRangeMin={setRangeMin}
            rangeMax={rangeMax}
            setRangeMax={setRangeMax}
            dataSource={dataSource}
            setDataSource={setDataSource}
            city={city}
            setCity={setCity}
            apiKey={apiKey}
            setApiKey={setApiKey}
            apiVerified={apiVerified}
            verifyKey={verifyKey}
            rain={rain}
          />
        )}
        {activePage === 'graphs' && (
          <Graphs
            R1={R1}
            R2={R2}
            Q1_star={Q1_star}
            Q2={Q2}
            Q2_star={Q2_star}
            E={E}
            E_formula={E_formula}
            data={data}
            barData={barData}
            pieData={pieData}
            lineData={lineData}
            sedimentData={sedimentData}
            params={params}
            evolutionData={evolutionData}
            rangeVar={rangeVar}
            visibleCharts={visibleCharts}
            widgetOrder={widgetOrder}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            radarRef={radarRef}
            barRef={barRef}
            pieRef={pieRef}
            lineRef={lineRef}
            evolutionRef={evolutionRef}
            resultsRef={resultsRef}
          />
        )}
        {activePage === 'help' && <Help />}
        {activePage === 'normativa' && <Normativa />}

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
