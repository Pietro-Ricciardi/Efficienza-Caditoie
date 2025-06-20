import React from 'react';

export default function Help() {
  return (
    <div className="p-4 space-y-2">
      <h1>Aiuto</h1>
      <p>
        Questa applicazione permette di calcolare l'efficienza idraulica delle caditoie
        stradali e visualizzarla tramite diversi grafici.
      </p>
      <h2>Come utilizzare l'interfaccia</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Usa gli slider nella pagina <strong>Parametri</strong> per impostare i valori di input.
        </li>
        <li>
          Passa alla pagina <strong>Simulazione</strong> per vedere i grafici.
        </li>
        <li>Ogni grafico è contenuto in un widget che puoi:</li>
        <ul className="list-disc pl-6">
          <li>ridimensionare trascinando l'angolo in basso a destra;</li>
          <li>trascinare per modificare l'ordine dei grafici;</li>
          <li>minimizzare o espandere con il pulsante '➖'/'➕' nella barra del widget.</li>
        </ul>
        <li>
          Nella sidebar puoi attivare o disattivare i singoli grafici dalla sezione
          <strong> Aspetto</strong>.
        </li>
        <li>
          Le voci della sezione <strong>Azioni</strong> permettono di esportare i dati o
          salvare/caricare i parametri.
        </li>
        <li>
          Usa il pulsante nella parte alta destra della sidebar per aprirla o chiuderla.
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
        <li>R1 = 1 - 0.3 (v - v0) → efficienza legata alla velocità del flusso.</li>
        <li>
          R2 = 1 / (1 + (0.083 × v¹¸) / (j × L²⁄³)) → efficienza influenzata
          da pendenza e lunghezza della griglia.
        </li>
        <li>Q1* = Q1 × R1 → portata intercettata dal tratto a monte.</li>
        <li>Q2 = Q - Q1 → portata che non raggiunge direttamente la caditoia.</li>
        <li>Q2* = Q2 × R2 → porzione intercettata di Q2.</li>
        <li>E = (Q1* + Q2*) / Q → efficienza idraulica totale.</li>
        <li>E formula = R1 × E0 + R2 × (1 - E0) → stima alternativa basata su E0.</li>
        <li>θ = τ / ((ρ_s - ρ) g d) → parametro di Shields.</li>
        <li>τ_c = θ_c (ρ_s - ρ) g d → tensione di inizio moto.</li>
        <li>q_s^MPM = 8 √[g (s - 1) d³] (θ - θ_c)<sup>3/2</sup> → bed-load Meyer‑Peter & Müller.</li>
        <li>q_s^E = 0.4 √[g (s - 1) d³] (θ - θ_c)<sup>5/2</sup> → bed-load Einstein.</li>
        <li>P = w_s / (κ u_*) → esponente di Rouse.</li>
        <li>C(z) = C_a [(h - z)/z · z_a/(h - z_a)]^P → profilo di concentrazione.</li>
        <li>Q_s = 0.5 (0.05 θ^{2.5} + 0.016 θ^{2.1}) √[g (s - 1) d³] → carico totale.</li>
      </ul>
      <p>
        La pagina <strong>Risultati</strong> e i grafici mostrano i valori
        calcolati con queste formule.
      </p>
      <p>Per ulteriori dettagli consulta il file README.md.</p>
    </div>
  );
}
