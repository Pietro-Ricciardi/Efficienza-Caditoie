export async function fetchRain(city, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Errore richiesta OpenWeatherMap');
  }
  const data = await res.json();
  // valore pioggia in mm/h, preferisci 1h se disponibile, altrimenti 3h
  const rain = data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0;
  return rain;
}
