  const toCelsius = (k) => (k - 273.15).toFixed(1);

  // Helper to create rain animation elements
  function createRainAnim(parent) {
    const rainDiv = document.createElement("div");
    rainDiv.className = "rain-anim";
    // Add 18 random raindrops
    for (let i = 0; i < 10000; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = Math.random() * 98 + "%";
      drop.style.animationDelay = (Math.random() * 1.2) + "s";
      drop.style.height = (12 + Math.random() * 12) + "px";
      rainDiv.appendChild(drop);
    }
    parent.appendChild(rainDiv);
  }

  async function getData() {
    const input = document.getElementById("cityInput");
    const city = input.value.trim() || "mumbai"; // default to Mumbai
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.apiKey}`;
    const container = document.getElementById("weatherContainer");
    container.innerHTML = "<h2>Loading Weather...</h2>";

    try {
      const resData = await fetch(api);
      if (!resData.ok) throw new Error("City not found");
      const data = await resData.json();

      container.innerHTML = ""; // Clear previous

      const card = document.createElement("div");
      card.className = "weather-card";

      // Rain animation for light rain or rain
      const weatherMain = data.weather[0].main.toLowerCase();
      const weatherDesc = data.weather[0].description.toLowerCase();
      if (weatherMain.includes("rain") || weatherDesc.includes("rain")) {
        createRainAnim(card);
      }

      const cityTitle = document.createElement("h2");
      cityTitle.textContent = `${data.name}, ${data.sys.country}`;
      cityTitle.style.width = "100%";
      cityTitle.style.margin = "0";
      card.appendChild(cityTitle);

      const icon = document.createElement("img");
      icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      icon.alt = data.weather[0].description;
      card.appendChild(icon);

      const desc = document.createElement("div");
      desc.className = "weather-desc";
      desc.textContent = data.weather[0].description;
      card.appendChild(desc);

      // Weather details box
      const detailsBox = document.createElement("div");
      detailsBox.className = "weather-details-box";

      const temp = document.createElement("p");
      temp.textContent = `Temperature: ${toCelsius(data.main.temp)}°C`;
      detailsBox.appendChild(temp);

      const feels = document.createElement("p");
      feels.textContent = `Feels like: ${toCelsius(data.main.feels_like)}°C`;
      detailsBox.appendChild(feels);

      const humid = document.createElement("p");
      humid.textContent = `Humidity: ${data.main.humidity}%`;
      detailsBox.appendChild(humid);

      const wind = document.createElement("p");
      wind.textContent = `Wind: ${data.wind.speed} m/s`;
      detailsBox.appendChild(wind);

      card.appendChild(detailsBox);

      container.appendChild(card);
    } catch (error) {
      container.innerHTML = `<h2>Error: ${error.message}</h2>`;
    }
  }

  // Dark/Light mode toggle
  const toggleBtn = document.getElementById('toggleModeBtn');
  function setMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('weatherAppDarkMode', isDark ? '1' : '0');
  }
  toggleBtn.onclick = function() {
    setMode(!document.body.classList.contains('dark-mode'));
  };
  // On load, set mode from localStorage
  window.addEventListener('DOMContentLoaded', () => {
    setMode(localStorage.getItem('weatherAppDarkMode') === '1');
  });

  // Default load for Mumbai
  window.onload = getData;