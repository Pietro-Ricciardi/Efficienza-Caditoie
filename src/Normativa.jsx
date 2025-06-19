import React from 'react';

export default function Normativa() {
  return (
    <div className="p-4 space-y-2">
      <h1>Normativa</h1>
      <h2>Norme Europee (EN)</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <a
            href="https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:13174,6121&cs=14A3B4B8D8B878E09F04DE95464A9D30A"
            target="_blank"
            rel="noopener noreferrer"
          >
            EN 1433: Drainage channels for vehicular and pedestrian areas — Design and testing
          </a>
          : definisce requisiti, classificazione e metodi di prova per canalette e griglie in aree carrabili e pedonali.
        </li>
        <li>
          <a
            href="https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:8384,6121&cs=124E0E4B0A5E654F3E1289B7F1E1B84B"
            target="_blank"
            rel="noopener noreferrer"
          >
            EN 124: Gully tops and manhole tops for vehicular and pedestrian areas — Classification, performance requirements and test methods
          </a>
          : riguarda le caditoie a bocca di lupo installate a filo strada o marciapiede, con classi di carico fino a F900.
        </li>
      </ul>
      <h2>Norme Internazionali (ISO)</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <a
            href="https://www.iso.org/standard/75090.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            ISO 22282-1: Test method for drainage channel gratings — Part 1: Determination of hydraulic characteristics
          </a>
          : specifica il metodo per misurare portata e rendimento idraulico delle griglie.
        </li>
        <li>
          <a
            href="https://www.iso.org/standard/75091.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            ISO 22282-2: Test method for drainage channel gratings — Part 2: Determination of mechanical characteristics
          </a>
          : definizioni dei carichi di prova e criteri di resistenza meccanica.
        </li>
      </ul>
      <h2>Norme Italiane (UNI)</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <a
            href="https://store.uni.com/catalogo/index.php/uni-en-1433-2008?inv=3958346"
            target="_blank"
            rel="noopener noreferrer"
          >
            UNI EN 1433:2008
          </a>
          : recepimento italiano della EN 1433.
        </li>
        <li>
          <a
            href="https://store.uni.com/catalogo/index.php/uni-11583-2015?inv=4847692"
            target="_blank"
            rel="noopener noreferrer"
          >
            UNI 11583:2015
          </a>
          : manufatti di pozzetti stradali e caditoie di raccolta per reti di drenaggio, specifiche per materiali compositi.
        </li>
        <li>
          <a
            href="https://store.uni.com/catalogo/index.php/uni-11307-2010?inv=2302458"
            target="_blank"
            rel="noopener noreferrer"
          >
            UNI 11307:2010
          </a>
          : dimensionamento idraulico delle caditoie per la raccolta delle acque meteoriche.
        </li>
      </ul>
      <h2>Portali di acquisto e consultazione</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <a href="https://www.uni.com" target="_blank" rel="noopener noreferrer">UNI (Ente Italiano di Normazione)</a>
          : ricerca per numero norma ed acquisto di PDF o copie cartacee.
        </li>
        <li>
          <a href="https://www.cen.eu" target="_blank" rel="noopener noreferrer">CEN (Comitato Europeo di Normazione)</a>
          : catalogo norme EN.
        </li>
        <li>
          <a href="https://www.iso.org" target="_blank" rel="noopener noreferrer">ISO (International Organization for Standardization)</a>
          : catalogo norme ISO.
        </li>
      </ul>
    </div>
  );
}
