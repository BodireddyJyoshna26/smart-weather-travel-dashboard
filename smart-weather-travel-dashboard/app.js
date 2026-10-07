const API_BASE = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";

const els = {
  searchForm: document.querySelector("#searchForm"),
  cityInput: document.querySelector("#cityInput"),
  errorMessage: document.querySelector("#errorMessage"),
  locateBtn: document.querySelector("#locateBtn"),
  loading: document.querySelector("#loading"),
  dashboard: document.querySelector("#dashboard"),
  welcome: document.querySelector("#welcome"),
  cityName: document.querySelector("#cityName"),
  dateText: document.querySelector("#dateText"),
  weatherIcon: document.querySelector("#weatherIcon"),
  temperature: document.querySelector("#temperature"),
  weatherDescription: document.querySelector("#weatherDescription"),
  feelsLike: document.querySelector("#feelsLike"),
  humidity: document.querySelector("#humidity"),
  wind: document.querySelector("#wind"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  travelTitle: document.querySelector("#travelTitle"),
  travelIcon: document.querySelector("#travelIcon"),
  travelText: document.querySelector("#travelText"),
  packingList: document.querySelector("#packingList"),
  forecastGrid: document.querySelector("#forecastGrid")
};

const WEATHER_CODES = {
  0: { text: "Clear sky", icon: "☀️" },
  1: { text: "Mainly clear", icon: "🌤️" },
  2: { text: "Partly cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁️" },
  45: { text: "Fog", icon: "🌫️" },
  48: { text: "Depositing rime fog", icon: "🌫️" },
  51: { text: "Light drizzle", icon: "🌦️" },
  53: { text: "Moderate drizzle", icon: "🌦️" },
  55: { text: "Dense drizzle", icon: "🌧️" },
  56: { text: "Light freezing drizzle", icon: "🌧️" },
  57: { text: "Dense freezing drizzle", icon: "🌧️" },
  61: { text: "Slight rain", icon: "🌦️" },
  63: { text: "Moderate rain", icon: "🌧️" },
  65: { text: "Heavy rain", icon: "🌧️" },
  66: { text: "Light freezing rain", icon: "🌧️" },
  67: { text: "Heavy freezing rain", icon: "🌧️" },
  71: { text: "Slight snow", icon: "🌨️" },
  73: { text: "Moderate snow", icon: "❄️" },
  75: { text: "Heavy snow", icon: "❄️" },
  77: { text: "Snow grains", icon: "🌨️" },
  80: { text: "Slight rain showers", icon: "🌦️" },
  81: { text: "Moderate rain showers", icon: "🌧️" },
  82: { text: "Violent rain showers", icon: "⛈️" },
  85: { text: "Slight snow showers", icon: "🌨️" },
  86: { text: "Heavy snow showers", icon: "❄️" },
  95: { text: "Thunderstorm", icon: "⛈️" },
  96: { text: "Thunderstorm with hail", icon: "⛈️" },
  99: { text: "Thunderstorm with heavy hail", icon: "⛈️" }
};

const getWeatherInfo = (code) =>
  WEATHER_CODES[code] || { text: "Unknown conditions", icon: "🌍" };

const formatTime = (isoString) =>
  new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" })
    .format(new Date(isoString));

const formatDate = (dateString) =>
  new Intl.DateTimeFormat([], { weekday: "long", month: "short", day: "numeric" })
    .format(new Date(`${dateString}T12:00:00`));

function setLoading(isLoading) {
  els.loading.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    els.dashboard.classList.add("hidden");
    els.welcome.classList.add("hidden");
  }
}

function showError(message) {
  els.errorMessage.textContent = message;
  els.dashboard.classList.add("hidden");
  els.loading.classList.add("hidden");
  els.welcome.classList.remove("hidden");
}

function clearError() {
  els.errorMessage.textContent = "";
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

async function getCoordinates(city) {
  const params = new URLSearchParams({
    name: city.trim(),
    count: "1",
    language: "en",
    format: "json"
  });

  const data = await fetchJson(`${GEOCODING_API}?${params}`);

  if (!data.results?.length) {
    throw new Error(`Could not find "${city}". Try a valid city name.`);
  }

  const place = data.results[0];
  return {
    latitude: place.latitude,
    longitude: place.longitude,
    name: place.name,
    country: place.country
  };
}

async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "5"
  });

  return fetchJson(`${API_BASE}?${params}`);
}

function getTravelAdvice(weather) {
  const temp = weather.current.temperature_2m;
  const code = weather.current.weather_code;
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const stormy = [95, 96, 99];

  if (stormy.includes(code)) {
    return {
      title: "Indoor plans are best",
      icon: "⛈️",
      text: "Thunderstorms are possible. Choose museums, cafés, shopping centres, or other indoor activities and avoid exposed outdoor areas.",
      packing: ["Umbrella", "Light waterproof jacket", "Charged phone"]
    };
  }

  if (rainCodes.includes(code)) {
    return {
      title: "Carry rain protection",
      icon: "☔",
      text: "Rain is expected. Outdoor sightseeing can still work, but keep flexible plans and choose attractions with nearby indoor options.",
      packing: ["Umbrella", "Water-resistant shoes", "Light jacket"]
    };
  }

  if (temp >= 32) {
    return {
      title: "Stay cool & hydrated",
      icon: "🧴",
      text: "It is hot today. Plan outdoor activities for the morning or evening, take breaks in shade, and drink plenty of water.",
      packing: ["Water bottle", "Sunglasses", "Hat / sunscreen"]
    };
  }

  if (temp <= 10) {
    return {
      title: "Pack warm layers",
      icon: "🧥",
      text: "Cool conditions are expected. Outdoor sightseeing is possible with warm clothing and comfortable closed shoes.",
      packing: ["Warm jacket", "Layers", "Comfortable shoes"]
    };
  }

  return {
    title: "Great day to explore",
    icon: "🧳",
    text: "The conditions look comfortable for sightseeing. This is a good day for walking tours, parks, cafés, and outdoor attractions.",
    packing: ["Comfortable shoes", "Sunglasses", "Light day bag"]
  };
}

function renderDashboard(place, weather) {
  const current = weather.current;
  const info = getWeatherInfo(current.weather_code);
  const advice = getTravelAdvice(weather);

  els.cityName.textContent = `${place.name}, ${place.country}`;
  els.dateText.textContent = formatDate(weather.daily.time[0]);
  els.weatherIcon.textContent = info.icon;
  els.temperature.textContent = `${Math.round(current.temperature_2m)}°`;
  els.weatherDescription.textContent = info.text;
  els.feelsLike.textContent = `Feels like ${Math.round(current.apparent_temperature)}°`;
  els.humidity.textContent = `${current.relative_humidity_2m}%`;
  els.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  els.sunrise.textContent = formatTime(weather.daily.sunrise[0]);
  els.sunset.textContent = formatTime(weather.daily.sunset[0]);

  els.travelTitle.textContent = advice.title;
  els.travelIcon.textContent = advice.icon;
  els.travelText.textContent = advice.text;
  els.packingList.innerHTML = advice.packing
    .map((item) => `<li>${item}</li>`)
    .join("");

  els.forecastGrid.innerHTML = weather.daily.time.map((date, index) => {
    const dayInfo = getWeatherInfo(weather.daily.weather_code[index]);
    return `
      <article class="forecast-day">
        <p class="forecast-date">${index === 0 ? "Today" : formatDate(date)}</p>
        <div class="forecast-icon">${dayInfo.icon}</div>
        <div>
          <div class="forecast-temp">${Math.round(weather.daily.temperature_2m_max[index])}°</div>
          <div class="forecast-range">Low ${Math.round(weather.daily.temperature_2m_min[index])}°</div>
        </div>
      </article>
    `;
  }).join("");

  els.welcome.classList.add("hidden");
  els.dashboard.classList.remove("hidden");
}

async function searchCity(city) {
  const cleanCity = city.trim();

  if (cleanCity.length < 2) {
    showError("Please enter at least 2 characters for the city name.");
    return;
  }

  clearError();
  setLoading(true);

  try {
    const place = await getCoordinates(cleanCity);
    const weather = await getWeather(place.latitude, place.longitude);
    renderDashboard(place, weather);
  } catch (error) {
    showError(error.message || "Unable to fetch weather right now. Please try again.");
  } finally {
    els.loading.classList.add("hidden");
  }
}

async function searchByCoordinates(latitude, longitude) {
  clearError();
  setLoading(true);

  try {
    const weather = await getWeather(latitude, longitude);
    const place = {
      name: "Your Location",
      country: "Current Position"
    };
    renderDashboard(place, weather);
  } catch {
    showError("Could not fetch weather for your location. Please search by city instead.");
  } finally {
    els.loading.classList.add("hidden");
  }
}

els.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCity(els.cityInput.value);
});

document.querySelectorAll("[data-city]").forEach((button) => {
  button.addEventListener("click", () => {
    const city = button.dataset.city;
    els.cityInput.value = city;
    searchCity(city);
  });
});

els.locateBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => searchByCoordinates(coords.latitude, coords.longitude),
    () => showError("Location permission was denied. Search for a city instead.")
  );
});

// Initial city for a ready-to-demo experience.
searchCity("Chennai");
