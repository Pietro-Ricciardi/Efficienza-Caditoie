import React from 'react';
import PropTypes from 'prop-types';

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
  isMobile,
  activePage,
  setActivePage,
  appearanceOpen,
  setAppearanceOpen,
  visibleCharts,
  toggleChart,
  actionsOpen,
  setActionsOpen,
  templatesOpen,
  setTemplatesOpen,
  downloadCSV,
  downloadExcel,
  downloadTemplateCSV,
  downloadTemplateExcel,
  downloadTemplateJSON,
  salvaParametriStorage,
  caricaParametriStorage,
  esportaJSON,
  fileInputRef,
  importaJSON,
  downloadImage,
  radarRef,
  barRef,
  pieRef,
  lineRef,
  evolutionRef,
}) {
  return (
    <aside
      className={`leftPane bg-white shadow-md p-4 ${sidebarOpen ? '' : 'collapsed'}`}
      style={{ flexBasis: sidebarOpen ? (isMobile ? '100%' : '200px') : '0' }}
    >
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? '❮' : '❯'}
        </button>
      </div>
      <nav className="menu-vertical flex flex-col space-y-2 mt-2">
        <button
          className="px-4 py-2 text-left hover:bg-gray-100 w-full"
          onClick={() => setActivePage(activePage === 'parameters' ? 'graphs' : 'parameters')}
        >
          {activePage === 'parameters' ? 'Simulazione' : 'Parametri'}
        </button>

        <button
          className="px-4 py-2 text-left hover:bg-gray-100 w-full"
          onClick={() => setActivePage('help')}
        >
          Help
        </button>

        <button
          className="px-4 py-2 text-left hover:bg-gray-100 w-full"
          onClick={() => setActivePage('normativa')}
        >
          Normativa
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
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('radar')}>
                <span className="w-4">{visibleCharts.radar ? '✓' : ''}</span>
                Grafico radar
              </button>
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('bar')}>
                <span className="w-4">{visibleCharts.bar ? '✓' : ''}</span>
                Grafico a barre
              </button>
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('pie')}>
                <span className="w-4">{visibleCharts.pie ? '✓' : ''}</span>
                Grafico a torta
              </button>
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('hydro')}>
                <span className="w-4">{visibleCharts.hydro ? '✓' : ''}</span>
                Bilancio idrologico
              </button>
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('line')}>
                <span className="w-4">{visibleCharts.line ? '✓' : ''}</span>
                Grafico a linee
              </button>
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('evolution')}>
                <span className="w-4">{visibleCharts.evolution ? '✓' : ''}</span>
                Grafico evolutivo
              </button>
              <button className="submenu-item w-full text-left flex items-center" onClick={() => toggleChart('evolutionTable')}>
                <span className="w-4">{visibleCharts.evolutionTable ? '✓' : ''}</span>
                Tabella evolutiva
              </button>
              <button
                className="submenu-item w-full text-left flex items-center"
                onClick={() => {
                  toggleChart('sediments');
                  toggleChart('accumulation');
                }}
              >
                <span className="w-4">{visibleCharts.sediments ? '✓' : ''}</span>
                Sedimenti e bilancio
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
              <button onClick={downloadCSV}>Esporta CSV</button>
              <button onClick={downloadExcel}>Esporta Excel</button>
              <button onClick={salvaParametriStorage}>Salva parametri</button>
              <button onClick={caricaParametriStorage}>Carica parametri</button>
              <button onClick={esportaJSON}>Esporta JSON</button>
              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={importaJSON}
              />
              <button onClick={() => fileInputRef.current.click()}>Importa JSON</button>
              <button onClick={() => downloadImage(radarRef, 'radar.png')}>Salva radar</button>
              <button onClick={() => downloadImage(barRef, 'barre.png')}>Salva barre</button>
              <button onClick={() => downloadImage(pieRef, 'torta.png')}>Salva torta</button>
              <button onClick={() => downloadImage(lineRef, 'linee.png')}>Salva linee</button>
              <button onClick={() => downloadImage(evolutionRef, 'evoluzione.png')}>Salva evolutivo</button>
            </div>
          )}
        </div>

        <div className="templates-menu">
          <button
            className="px-4 py-2 text-left hover:bg-gray-100 w-full flex justify-between"
            onClick={() => setTemplatesOpen((o) => !o)}
          >
            Modelli <span>{templatesOpen ? '▲' : '▼'}</span>
          </button>
          {templatesOpen && (
            <div className="submenu ml-4 mt-1 space-y-1 export-buttons">
              <button onClick={downloadTemplateCSV}>Template CSV</button>
              <button onClick={downloadTemplateExcel}>Template Excel</button>
              <button onClick={downloadTemplateJSON}>Template JSON</button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  activePage: PropTypes.string.isRequired,
  setActivePage: PropTypes.func.isRequired,
  appearanceOpen: PropTypes.bool.isRequired,
  setAppearanceOpen: PropTypes.func.isRequired,
  visibleCharts: PropTypes.object.isRequired,
  toggleChart: PropTypes.func.isRequired,
  actionsOpen: PropTypes.bool.isRequired,
  setActionsOpen: PropTypes.func.isRequired,
  templatesOpen: PropTypes.bool.isRequired,
  setTemplatesOpen: PropTypes.func.isRequired,
  downloadCSV: PropTypes.func.isRequired,
  downloadExcel: PropTypes.func.isRequired,
  downloadTemplateCSV: PropTypes.func.isRequired,
  downloadTemplateExcel: PropTypes.func.isRequired,
  downloadTemplateJSON: PropTypes.func.isRequired,
  salvaParametriStorage: PropTypes.func.isRequired,
  caricaParametriStorage: PropTypes.func.isRequired,
  esportaJSON: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  importaJSON: PropTypes.func.isRequired,
  downloadImage: PropTypes.func.isRequired,
  radarRef: PropTypes.object.isRequired,
  barRef: PropTypes.object.isRequired,
  pieRef: PropTypes.object.isRequired,
  lineRef: PropTypes.object.isRequired,
  evolutionRef: PropTypes.object.isRequired,
};
