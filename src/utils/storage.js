export function salvaParametri(key, params) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(params));
}

export function caricaParametri(key) {
  if (!key) return null;
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function esportaParametri(params) {
  const blob = new Blob([JSON.stringify(params, null, 2)], {
    type: 'application/json',
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
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Errore lettura file'));
    reader.readAsText(file);
  });
}
