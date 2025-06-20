# Efficienza Caditoie

Questo è un progetto React che consente di calcolare e visualizzare l'efficienza idraulica delle caditoie stradali.
Un file Excel di esempio è disponibile nella cartella `excel`.
Nella directory `public/templates` sono presenti i modelli **CSV**, **Excel** e **JSON** da compilare per caricare i parametri nell'applicazione.

Per una guida rapida all'interfaccia è disponibile il file [HELP.md](HELP.md) o la sezione **Help** dell'applicazione. È presente inoltre un menu **Normativa** con i collegamenti alle principali norme UNI, EN e ISO di settore.

## Funzionalità

- Inserimento dei parametri tramite **slider interattivi**:
  - Portata totale (Q)
  - Portata intercettata (Q1)
  - Velocità del flusso (v)
  - Velocità di riferimento (v0)
  - Pendenza longitudinale (j)
  - Lunghezza della griglia (L)
  - Efficienza geometrica (E0)
  - Granulometria media (d50)
  - Densità dei sedimenti (rhoS)
  - Profondità idraulica (h)
  - Parametri di accumulo secco per zona (k e Lmax)

    | Ambiente urbano | k tipico (kg/ha/giorno) | Lmax (kg/ha) |
    | --------------- | ----------------------- | ------------ |
    | Residenziale    | 0.2 – 0.5               | 3 – 5        |
    | Commerciale     | 0.5 – 1.0               | 5 – 10       |
    | Industriale     | 1.0 – 2.0               | 10 – 20      |

- Calcolo automatico di:
  - Efficienza R1
  - Efficienza R2
- Efficienza Totale
- Efficienza da formula combinata
- Parametri di trasporto solido (Shields, bed-load, profilo di Rouse, carico totale)

- Visualizzazione su **grafico radar** dinamico.
- Grafico evolutivo per Q o v su intervalli definiti.
- Tabella dell'andamento per Q o v sugli stessi intervalli.
- Grafici sul trasporto solido (curva del bed-load, profilo di concentrazione e
  carico totale).
- Modalità chiaro/scuro con pulsante di attivazione.
- Layout responsive con possibilità di ridimensionare i pannelli.
- Widget grafici minimizzabili, spostabili e ridimensionabili.
- Esportazione dei dati e dei grafici in **CSV**, **Excel** e come immagini.
- Salvataggio e caricamento dei parametri in locale o tramite file JSON.
- Download dei modelli **CSV**, **Excel** e **JSON** per l'import dei parametri.
- Configurazione centralizzata dei limiti degli slider per una manutenzione più semplice.
- Opzionalmente è possibile scegliere "OpenWeatherMap" come origine dei dati e
  caricare automaticamente l'intensità di pioggia per una città, con
  aggiornamento dei grafici in tempo reale. Verrà richiesto di inserire la
  propria **API key** di OpenWeatherMap; il campo è nascosto e la chiave può
  essere mostrata temporaneamente tenendo premuta l'icona a forma di occhio.
  Solo dopo la verifica della chiave sarà possibile specificare la città.
- La registrazione e la generazione della chiave avvengono sul sito
  [openweathermap.org](https://openweathermap.org). L'attivazione della chiave
  può richiedere circa un'ora dalla sua creazione.

## Avvio locale

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Avvia il progetto:
   ```bash
   npm run dev
   ```

3. (Opzionale) Verifica lo stile del codice:
   ```bash
   npm run lint
   ```

4. (Opzionale) Applica la formattazione:
   ```bash
   npm run format
   ```

5. Apri il browser su `http://localhost:5173`

6. (Opzionale) Esegui i test:
   ```bash
   npm test
   ```

7. (Opzionale) Visualizza l'anteprima della build:
   ```bash
   npm run preview
   ```

## Deploy (consigliato: Vercel)

1. Inizializza il repository Git:
   ```bash
   git init
   git add .
   git commit -m "Inizializzazione progetto"
   ```

2. Crea un repository su [GitHub](https://github.com) e collegalo:
   ```bash
   git remote add origin https://github.com/tuo-username/efficienza-caditoie.git
   git push -u origin main
   ```

3. Accedi a [vercel.com](https://vercel.com), collega il repository e avvia il deploy automatico.

## Build produzione

```bash
npm run build
```

---

© 2025 Pietro Ricciardi – Licenza MIT
