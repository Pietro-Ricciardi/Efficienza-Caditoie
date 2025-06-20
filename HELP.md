# Aiuto

Questa applicazione permette di calcolare l'efficienza idraulica delle caditoie stradali e visualizzarla tramite diversi grafici.

## Come utilizzare l'interfaccia

- Usa gli slider nella pagina **Parametri** per impostare i valori di input.
- Passa alla pagina **Simulazione** per vedere i grafici.
- Ogni grafico è contenuto in un _widget_ che puoi:
  - ridimensionare trascinando l'angolo in basso a destra;
  - trascinare per modificare l'ordine dei grafici;
  - minimizzare o espandere con il pulsante `➖`/`➕` nella barra del widget.
- Nella sidebar puoi attivare o disattivare i singoli grafici dalla sezione **Aspetto**.
- Tra questi è disponibile anche la **tabella evolutiva** dei valori calcolati.
- Le voci della sezione **Azioni** permettono di esportare i dati o salvare/caricare i parametri; sono visualizzate come semplici etichette cliccabili.
- Nella sezione **Modelli** puoi scaricare i file di esempio (CSV, Excel e JSON) da compilare e importare nell'app.
- Usa il pulsante nella parte alta destra della sidebar per aprirla o chiuderla.
- Per utilizzare i dati meteo di OpenWeatherMap registra un account su
  [openweathermap.org](https://openweathermap.org) e genera la tua API key; la
  chiave potrebbe richiedere circa un'ora per diventare attiva.

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
- **k** e **Lmax** – Parametri di accumulo secco per zona, raccolti in un widget largo due colonne.

## Formule utilizzate

- \(R_1 = 1 - 0.3\,(v - v_0)\) → efficienza legata alla velocità del flusso.
- \(R_2 = \frac{1}{1 + \frac{0.083\, v^{1.8}}{j\, L^{2/3}}}\) → efficienza influenzata da pendenza e lunghezza della griglia.
- \(Q_1^\* = Q_1\, R_1\) → portata intercettata dal tratto a monte.
- \(Q_2 = Q - Q_1\) → portata che non raggiunge direttamente la caditoia.
- \(Q_2^\* = Q_2\, R_2\) → porzione intercettata di Q2.
- \(E = \frac{Q_1^\* + Q_2^\*}{Q}\) → efficienza idraulica totale.
- \(E\_{\text{formula}} = R_1\, E_0 + R_2\,(1 - E_0)\) → stima alternativa basata su E0.
- \(\theta = \frac{\tau}{(\rho_s - \rho)\, g\, d}\) → parametro di Shields.
- \(\tau_c = \theta_c(\rho_s - \rho) g d\) → tensione di inizio moto.
- \(q_s^{MPM} = 8\,\sqrt{g(s - 1) d^3}(\theta - \theta_c)^{3/2}\) → bed-load Meyer‑Peter & Müller.
- \(q_s^{E} = 0.4\,\sqrt{g(s - 1) d^3}(\theta - \theta_c)^{5/2}\) → bed-load Einstein.
- \(P = \frac{w*s}{\kappa u*\*}\) → esponente di Rouse.
- \(C(z) = C_a \left[\frac{h - z}{z} \cdot \frac{z_a}{h - z_a}\right]^P\) → profilo di concentrazione.
- \(Q_s = 0.5 (0.05\,\theta^{2.5} + 0.016\theta^{2.1}) \sqrt{g (s - 1) d^3}\) → carico totale.

La pagina **Risultati** e i grafici mostrano i valori calcolati con queste formule.

## Grafici disponibili

- Radar delle efficienze.
- Grafico evolutivo per Q o v.
- Tabella con gli stessi valori.
- Curva del bed-load (MPM vs Einstein).
- Profilo di concentrazione secondo Rouse.
- Bar chart del carico totale.

Per ulteriori dettagli consulta il file `README.md`.
