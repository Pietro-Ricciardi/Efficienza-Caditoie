const rainCache = new Map();
const TEN_MINUTES = 10 * 60 * 1000;

export async function fetchRain(city, apiKey) {
  const key = `${city}-${apiKey}`;
  const cached = rainCache.get(key);
  if (cached && Date.now() - cached.time < TEN_MINUTES) {
    return cached.value;
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error('Errore di rete durante la richiesta OpenWeatherMap');
  }

  if (res.status === 404) {
    throw new Error('Località non trovata');
  }
  if (!res.ok) {
    throw new Error('Errore richiesta OpenWeatherMap');
  }

  const data = await res.json();
  // valore pioggia in mm/h, preferisci 1h se disponibile, altrimenti 3h
  const rain = data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0;
  rainCache.set(key, { value: rain, time: Date.now() });
  return rain;
}

export async function verifyApiKey(apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Rome&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Chiave API non valida');
  }
  return true;
}
