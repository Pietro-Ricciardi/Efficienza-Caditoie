export function salvaParametri(key, params) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(params));
}

function parseJsonSafe(text, source) {
  try {
    return { data: JSON.parse(text), error: null };
  } catch (err) {
    return {
      data: null,
      error: new Error(`Errore parsing JSON da ${source}: ${err.message}`)
    };
  }
}

export function caricaParametri(key) {
  if (!key) {
    return { data: null, error: new Error('Chiave non valida') };
  }
  const data = localStorage.getItem(key);
  if (!data) {
    return { data: null, error: new Error(`Nessun dato trovato per ${key}`) };
  }
  return parseJsonSafe(data, 'localStorage');
}

export function esportaParametri(params) {
  const blob = new Blob([JSON.stringify(params, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'parametri.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function importaParametri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const params = JSON.parse(e.target.result);
        resolve(params);
      } catch (err) {
        reject(new Error(`Errore parsing JSON dal file: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Errore lettura file'));
    reader.readAsText(file);
  });
}
