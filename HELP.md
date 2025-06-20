# Aiuto

Questa applicazione permette di calcolare l'efficienza idraulica delle caditoie stradali e visualizzarla tramite diversi grafici.

## Come utilizzare l'interfaccia

- Usa gli slider nella pagina **Parametri** per impostare i valori di input.
- Passa alla pagina **Simulazione** per vedere i grafici.
- Ogni grafico è contenuto in un *widget* che puoi:
  - ridimensionare trascinando l'angolo in basso a destra;
  - trascinare per modificare l'ordine dei grafici;
  - minimizzare o espandere con il pulsante `➖`/`➕` nella barra del widget.
- Nella sidebar puoi attivare o disattivare i singoli grafici dalla sezione **Aspetto**.
- Tra questi è disponibile anche la **tabella evolutiva** dei valori calcolati.
- Le voci della sezione **Azioni** permettono di esportare i dati o salvare/caricare i parametri; sono visualizzate come semplici etichette cliccabili.
- Nella sezione **Modelli** puoi scaricare i file di esempio (CSV, Excel e JSON) da compilare e importare nell'app.
- Usa il pulsante nella parte alta destra della sidebar per aprirla o chiuderla.

## Parametri

- **Q** – Portata totale del deflusso (l/s).
- **Q1** – Porzione di Q che raggiunge direttamente la caditoia (l/s).
- **v** – Velocità del flusso all'ingresso (m/s).
- **v0** – Velocità di riferimento per il calcolo di R1 (m/s).
- **j** – Pendenza longitudinale della strada.
- **L** – Lunghezza della griglia di caduta (m).
- **E0** – Efficienza geometrica della caditoia.
- **d50** – Granulometria media (m).
- **rhoS** – Densità dei sedimenti (kg/m^3).
- **h** – Profondità idraulica (m).

## Formule utilizzate

- R1 = 1 - 0.3 (v - v0) → efficienza legata alla velocità del flusso.
- R2 = 1 / (1 + (0.083 × v¹·⁸) / (j × L²⁄³)) → efficienza influenzata da pendenza e lunghezza della griglia.
- Q1* = Q1 × R1 → portata intercettata dal tratto a monte.
- Q2 = Q - Q1 → portata che non raggiunge direttamente la caditoia.
- Q2* = Q2 × R2 → porzione intercettata di Q2.
- E = (Q1* + Q2*) / Q → efficienza idraulica totale.
- E formula = R1 × E0 + R2 × (1 - E0) → stima alternativa basata su E0.
- θ = τ / ((ρ_s - ρ) g d) → parametro di Shields.
- τ_c = θ_c (ρ_s - ρ) g d → tensione di inizio moto.
- q_s^MPM = 8 √[g (s - 1) d³] (θ - θ_c)^{3/2} → bed-load Meyer‑Peter & Müller.
- q_s^E = 0.4 √[g (s - 1) d³] (θ - θ_c)^{5/2} → bed-load Einstein.
- P = w_s / (κ u_*) → esponente di Rouse.
- C(z) = C_a [(h - z)/z · z_a/(h - z_a)]^P → profilo di concentrazione.
- Q_s = 0.5 (0.05 θ^{2.5} + 0.016 θ^{2.1}) √[g (s - 1) d³] → carico totale.

La pagina **Risultati** e i grafici mostrano i valori calcolati con queste formule.

## Grafici disponibili

- Radar delle efficienze.
- Grafico evolutivo per q o v.
- Tabella con gli stessi valori.
- Curva del bed-load (MPM vs Einstein).
- Profilo di concentrazione secondo Rouse.
- Bar chart del carico totale.

Per ulteriori dettagli consulta il file `README.md`.
