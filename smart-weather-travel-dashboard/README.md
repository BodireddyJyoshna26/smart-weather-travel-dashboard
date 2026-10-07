# Smart Weather & Travel Dashboard

Module 3 take-home project for **Advanced JavaScript (ES6+) & Git/GitHub**.

## Features

- Public weather API integration using **Open-Meteo**
- Search weather by city
- Current temperature and weather condition
- Humidity, wind, sunrise and sunset
- Dynamic weather icons based on WMO weather codes
- 5-day forecast
- Weather-based smart travel suggestions
- Packing recommendations
- Invalid city / input error handling
- Optional browser geolocation
- Responsive UI for desktop, tablet and mobile
- Modern ES6+ JavaScript with `async/await`, `fetch`, template literals, destructuring-style data handling and array methods

## Project structure

```text
smart-weather-travel-dashboard/
├── index.html
├── style.css
├── app.js
└── README.md
```

## How to run in VS Code

### Option 1 — Live Server

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The dashboard will open in your browser.

### Option 2 — Simple local server

If Python is installed:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## API used

- Open-Meteo Forecast API
- Open-Meteo Geocoding API
- No API key is required.

## GitHub commands

```bash
git init
git add .
git commit -m "feat: build smart weather travel dashboard"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Suggested project report points

### Objective
Build a responsive weather dashboard that consumes a public API and uses asynchronous JavaScript to display live weather and travel guidance.

### Technologies
- HTML5
- CSS3
- JavaScript ES6+
- Fetch API
- Open-Meteo API
- Git & GitHub

### AI-assisted activity
AI can be used to assist with API integration, debugging, error analysis, Git commit messages and project documentation.

### Expected outcome
A functional weather dashboard that demonstrates asynchronous programming, API integration, responsive UI design and Git/GitHub workflow.
