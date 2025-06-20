import React from 'react';
import Formula from './Formula';

export default function Help() {
  return (
    <div className="p-4 space-y-2">
      <h1>Aiuto</h1>
      <p>
        Questa applicazione permette di calcolare l'efficienza idraulica delle
        caditoie stradali e visualizzarla tramite diversi grafici.
      </p>
      <h2>Come utilizzare l'interfaccia</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Usa gli slider nella pagina <strong>Parametri</strong> per impostare i
          valori di input.
        </li>
        <li>
          Passa alla pagina <strong>Simulazione</strong> per vedere i grafici.
        </li>
        <li>Ogni grafico è contenuto in un widget che puoi:</li>
        <ul className="list-disc pl-6">
          <li>ridimensionare trascinando l'angolo in basso a destra;</li>
          <li>trascinare per modificare l'ordine dei grafici;</li>
          <li>
            minimizzare o espandere con il pulsante '➖'/'➕' nella barra del
            widget.
          </li>
        </ul>
        <li>
          Nella sidebar puoi attivare o disattivare i singoli grafici dalla
          sezione
          <strong> Aspetto</strong>.
        </li>
        <li>
          Le voci della sezione <strong>Azioni</strong> permettono di esportare
          i dati o salvare/caricare i parametri.
        </li>
        <li>
          Usa il pulsante nella parte alta destra della sidebar per aprirla o
          chiuderla.
        </li>
        <li>
          Per utilizzare i dati meteo di OpenWeatherMap registra un account su 
          <a href="https://openweathermap.org">openweathermap.org</a> e genera
          la tua API key; l'attivazione potrebbe richiedere circa un'ora.
        </li>
      </ul>
      <h2>Parametri</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Q</strong> – Portata totale del deflusso (l/s).
        </li>
        <li>
          <strong>Q1</strong> – Porzione di Q che raggiunge direttamente la
          caditoia (l/s).
        </li>
        <li>
          <strong>v</strong> – Velocità del flusso all'ingresso (m/s).
        </li>
        <li>
          <strong>v0</strong> – Velocità di riferimento per il calcolo di R1
          (m/s).
        </li>
        <li>
          <strong>j</strong> – Pendenza longitudinale della strada.
        </li>
        <li>
          <strong>L</strong> – Lunghezza della griglia di caduta (m).
        </li>
        <li>
          <strong>E0</strong> – Efficienza geometrica della caditoia.
        </li>
        <li>
          <strong>d50</strong> – Granulometria media (m).
        </li>
        <li>
          <strong>rhoS</strong> – Densità dei sedimenti (kg/m³).
        </li>
        <li>
          <strong>h</strong> – Profondità idraulica (m).
        </li>
      </ul>
      <h2>Formule utilizzate</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Formula>{'\\(R_1 = 1 - 0.3\,(v - v_0)\\)'}</Formula> → efficienza
          legata alla velocità del flusso.
        </li>
        <li>
          <Formula>
            {
              '\\(R_2 = \\frac{1}{1 + \\frac{0.083\\, v^{1.8}}{j\\, L^{2/3}}}\\)'
            }
          </Formula>
          → efficienza influenzata da pendenza e lunghezza della griglia.
        </li>
        <li>
          <Formula>{'\\(Q_1^* = Q_1\\, R_1\\)'}</Formula> → portata intercettata
          dal tratto a monte.
        </li>
        <li>
          <Formula>{'\\(Q_2 = Q - Q_1\\)'}</Formula> → portata che non raggiunge
          direttamente la caditoia.
        </li>
        <li>
          <Formula>{'\\(Q_2^* = Q_2\\, R_2\\)'}</Formula> → porzione
          intercettata di Q2.
        </li>
        <li>
          <Formula>{'\\(E = \\frac{Q_1^* + Q_2^*}{Q}\\)'}</Formula> → efficienza
          idraulica totale.
        </li>
        <li>
          <Formula>
            {'\\(E_{\\text{formula}} = R_1\\, E_0 + R_2\\,(1 - E_0)\\)'}
          </Formula>
          → stima alternativa basata su E0.
        </li>
        <li>
          <Formula>
            {'\\(\\theta = \\frac{\\tau}{(\\rho_s - \\rho)\\, g\\, d}\\)'}
          </Formula>
          → parametro di Shields.
        </li>
        <li>
          <Formula>{'\\(\\tau_c = \\theta_c(\\rho_s - \\rho) g d\\)'}</Formula>{' '}
          → tensione di inizio moto.
        </li>
        <li>
          <Formula>
            {'\\(q_s^{MPM} = 8\\,\\sqrt{g(s-1)d^3}(\\theta-\\theta_c)^{3/2}\\)'}
          </Formula>
          → bed-load Meyer‑Peter & Müller.
        </li>
        <li>
          <Formula>
            {'\\(q_s^{E} = 0.4\\,\\sqrt{g(s-1)d^3}(\\theta-\\theta_c)^{5/2}\\)'}
          </Formula>
          → bed-load Einstein.
        </li>
        <li>
          <Formula>{'\\(P = \\frac{w_s}{\\kappa u_*}\\)'}</Formula> → esponente
          di Rouse.
        </li>
        <li>
          <Formula>
            {
              '\\(C(z) = C_a \\left[\frac{h - z}{z} \\cdot \frac{z_a}{h - z_a}\\right]^P\\)'
            }
          </Formula>
          → profilo di concentrazione.
        </li>
        <li>
          <Formula>
            {
              '\\(Q_s = 0.5 (0.05\\,\\theta^{2.5} + 0.016\\theta^{2.1})\\,\\sqrt{g (s - 1) d^3}\\)'
            }
          </Formula>
          → carico totale.
        </li>
      </ul>
      <p>
        La pagina <strong>Risultati</strong> e i grafici mostrano i valori
        calcolati con queste formule.
      </p>
      <p>Per ulteriori dettagli consulta il file README.md.</p>
    </div>
  );
}
