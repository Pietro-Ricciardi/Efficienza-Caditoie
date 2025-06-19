import React from "react";
import "./App.css";

export default function Help() {
  return (
    <div className="help-page">
      <h1>Aiuto</h1>
      <p>
        Questa applicazione calcola l'efficienza idraulica delle caditoie
        stradali. Nella pagina principale puoi impostare i parametri tramite gli
        slider e visualizzare i risultati sotto forma di formule e grafici.
      </p>
      <h2>Come si usa</h2>
      <ul>
        <li>Regola i valori di ingresso spostando gli slider.</li>
        <li>
          Osserva come cambiano i risultati e i grafici in tempo reale nella
          pagina del calcolatore.
        </li>
        <li>
          Utilizza i pulsanti di esportazione per scaricare dati e grafici o per
          salvare e caricare i parametri.
        </li>
        <li>Puoi attivare la modalità chiaro/scuro con l'icona in alto a destra.</li>
        <li>Su desktop è possibile ridimensionare i pannelli trascinando la barra centrale.</li>
      </ul>
      <h2>Valori in ingresso</h2>
      <ul>
        <li>
          <strong>Q</strong> - Portata totale del deflusso (l/s).
        </li>
        <li>
          <strong>Q1</strong> - Porzione di Q che raggiunge direttamente la
          caditoia (l/s).
        </li>
        <li>
          <strong>v</strong> - Velocità del flusso all'ingresso (m/s).
        </li>
        <li>
          <strong>v0</strong> - Velocità di riferimento per il calcolo di R1
          (m/s).
        </li>
        <li>
          <strong>j</strong> - Pendenza longitudinale della strada.
        </li>
        <li>
          <strong>L</strong> - Lunghezza della griglia di caduta (m).
        </li>
        <li>
          <strong>E0</strong> - Efficienza geometrica della caditoia.
        </li>
      </ul>
      <h2>Valori in uscita</h2>
      <ul>
        <li>
          <strong>R1</strong> e <strong>R2</strong> - Efficienze parziali
          dovute rispettivamente alla velocità del flusso e ai parametri
          geometrici.
        </li>
        <li>
          <strong>E</strong> - Efficienza totale calcolata combinando R1 e R2.
        </li>
        <li>
          <strong>Formula combinata</strong> - Alternativa basata su E0.
        </li>
      </ul>
      <h2>Grafici</h2>
      <p>
        Il grafico radar confronta le diverse efficienze, il grafico a barre
        mostra R1 e R2 mentre il grafico a torta evidenzia le portate
        intercettate dalla caditoia. 
        È disponibile anche un grafico evolutivo che mostra l'andamento di Q o v su intervalli definiti.
      </p>
    </div>
  );
}
