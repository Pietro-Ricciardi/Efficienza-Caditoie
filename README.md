# Efficienza Caditoie

Questo è un progetto React che consente di calcolare e visualizzare l'efficienza idraulica delle caditoie stradali.
Un file Excel di esempio è disponibile nella cartella `excel`.
Nella directory `public/templates` sono presenti i modelli **CSV**, **Excel** e **JSON** da compilare per caricare i parametri nell'applicazione.

Per una guida rapida all'interfaccia è disponibile il file [HELP.md](HELP.md) o la sezione **Help** dell'applicazione.

## Funzionalità

- Inserimento dei parametri tramite **slider interattivi**:

  - Portata totale (Q)
  - Portata intercettata (Q1)
  - Velocità del flusso (v)
  - Velocità di riferimento (v0)
  - Pendenza longitudinale (j)
  - Lunghezza della griglia (L)
  - Efficienza geometrica (E0)

- Calcolo automatico di:
  - Efficienza R1
  - Efficienza R2
- Efficienza Totale
- Efficienza da formula combinata

- Visualizzazione su **grafico radar** dinamico.
- Grafico evolutivo per Q o v su intervalli definiti.
- Tabella dell'andamento per Q o v sugli stessi intervalli.
- Modalità chiaro/scuro con pulsante di attivazione.
- Layout responsive con possibilità di ridimensionare i pannelli.
- Widget grafici minimizzabili, spostabili e ridimensionabili.
- Esportazione dei dati e dei grafici in **CSV**, **Excel** e come immagini.
- Salvataggio e caricamento dei parametri in locale o tramite file JSON.
- Download dei modelli **CSV**, **Excel** e **JSON** per l'import dei parametri.
- Opzionalmente è possibile scegliere "OpenWeatherMap" come origine dei dati e
  caricare automaticamente l'intensità di pioggia per una città, con
  aggiornamento dei grafici in tempo reale.

## Avvio locale

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. (Opzionale) copia `env.example` in `.env.local` e imposta `VITE_OPENWEATHER_KEY`
   con la tua API key di OpenWeatherMap per abilitare i dati meteo.

3. Avvia il progetto:

   ```bash
   npm run dev
   ```

4. (Opzionale) Verifica lo stile del codice:

   ```bash
   npm run lint
   ```

5. (Opzionale) Applica la formattazione:

   ```bash
   npm run format
   ```

6. Apri il browser su `http://localhost:5173`

7. (Opzionale) Esegui i test:

   ```bash
   npm test
   ```

8. (Opzionale) Visualizza l'anteprima della build:
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
