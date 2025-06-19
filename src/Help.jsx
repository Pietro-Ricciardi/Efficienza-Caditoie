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
          <li>minimizzare o espandere con il pulsante '-'/'+' nella barra del widget.</li>
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
      <p>Per ulteriori dettagli consulta il file README.md.</p>
    </div>
  );
}
