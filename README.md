# Efficienza Caditoie

Questo è un progetto React che consente di calcolare e visualizzare l'efficienza idraulica delle caditoie stradali.
Un file Excel di esempio è disponibile nella cartella `excel`.

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
- Modalità chiaro/scuro con pulsante di attivazione.
- Layout responsive con possibilità di ridimensionare i pannelli.

## Avvio locale

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Avvia il progetto:
   ```bash
   npm run dev
   ```

3. Apri il browser su `http://localhost:5173`

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
