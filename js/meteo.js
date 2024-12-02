const API_KEY = "f3bf512aa5b148078b9171858241303";
const API_URL = "http://api.weatherapi.com/v1/forecast.json";

const cityInput = document.getElementById("cityInput");
const addCityButton = document.getElementById("addCityButton");
const cityListContainer = document.getElementById("cityList");
const message = document.getElementById("message");

const locationName = document.getElementById("locationName");
const regionCountry = document.getElementById("regionCountry");
const lastUpdate = document.getElementById("lastUpdate");
const conditionIcon = document.getElementById("conditionIcon");
const temperature = document.getElementById("temperature");
const maxTemp = document.getElementById("maxTemp");
const minTemp = document.getElementById("minTemp");
const windSpeed = document.getElementById("windSpeed");
const precipitation = document.getElementById("precipitation");
const snow = document.getElementById("snow");
const toggleCityListButton = document.getElementById("toggleCityList");

//Va chercher le body pour mettre une image d'arrière plan
const body = document.getElementById("body");

let cachedCities = []; // Stocke les villes ajoutées
let map = null;

document.addEventListener("DOMContentLoaded", () => {
  const storedCities = JSON.parse(localStorage.getItem("cachedCities")) || [];
  
  if (storedCities.length === 0) {
    // Si aucune ville n'est stockée, ajouter Chicoutimi par défaut
    const defaultCity = "Chicoutimi";
    cachedCities.push(defaultCity);
    localStorage.setItem("cachedCities", JSON.stringify(cachedCities));
    fetchWeather(defaultCity); // Charge les données météo pour Chicoutimi
  } else {
    // Sinon, affiche la première ville du cache
    cachedCities.push(...storedCities);
    fetchWeather(storedCities[0]);
  }

  renderCityList();
});


addCityButton.addEventListener("click", async () => {
  const cityNameInput = cityInput.value.trim();

  if (!cityNameInput) return; // Empêche l'ajout si le champ est vide

  try {
      // Récupérer les données météo pour valider la ville
      const response = await fetch(`${API_URL}?key=${API_KEY}&q=${cityNameInput}&aqi=no`);
      if (!response.ok) throw new Error("Ville introuvable");

      const data = await response.json();
      const cityName = data.location.name; // Récupérer le nom exact de la ville

      if (!cachedCities.includes(cityName)) {
          cachedCities.push(cityName);
          localStorage.setItem("cachedCities", JSON.stringify(cachedCities));
          renderCityList(); // Rafraîchir la liste des villes
      }

      fetchWeather(cityName); // Affiche la météo de la ville
  } catch (error) {
      message.textContent = "Erreur : " + error.message;
  }

  cityInput.value = ""; // Réinitialiser le champ d'entrée
});



// Affiche les villes stockées dans le cache
function renderCityList() {
  cityListContainer.innerHTML = ""; // Efface la liste avant de la recharger

  cachedCities.forEach((city) => {
    const cityItem = document.createElement("li");
    cityItem.className = "city-item";

    const cityNameSpan = document.createElement("span");
    cityNameSpan.textContent = city;
    cityNameSpan.className = "city-name";
    cityNameSpan.addEventListener("click", () => fetchWeather(city)); // Clique pour afficher la météo

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.className = "remove-city-button";
    removeButton.addEventListener("click", () => removeCity(city));

    cityItem.appendChild(cityNameSpan);
    cityItem.appendChild(removeButton);

    cityListContainer.appendChild(cityItem);
  });
}

// Supprime une ville du cache et met à jour la liste
function removeCity(city) {
  cachedCities = cachedCities.filter((cachedCity) => cachedCity !== city);
  localStorage.setItem("cachedCities", JSON.stringify(cachedCities)); // Met à jour le stockage local
  renderCityList();
}

// Récupère les données météo d'une ville
async function fetchWeather(city) {
  try {
    message.textContent = "Chargement...";
    const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=no&days=5`);
    if (!response.ok) {
      throw new Error("Ville introuvable");
    }
    const data = await response.json();
    console.log(data);
    displayWeather(data);
    message.textContent = "";
  } catch (error) {
    console.error(error);
    message.textContent = "Erreur : " + error.message;
  }
}

// Affiche les données météo sur l'interface
function displayWeather(data) {
  locationName.textContent = data.location.name;
  regionCountry.textContent = `${data.location.region}, ${data.location.country}`;
  lastUpdate.textContent = `Dernière mise à jour : ${data.current.last_updated}`;
  conditionIcon.src = `https:${data.current.condition.icon}`;
  temperature.textContent = `${data.current.temp_c}°C`;

  maxTemp.textContent = `${data.forecast.forecastday[0].day.maxtemp_c}°C`;
  minTemp.textContent = `${data.forecast.forecastday[0].day.mintemp_c}°C`;
  windSpeed.textContent = `${data.forecast.forecastday[0].day.maxwind_kph} kph`;
  precipitation.textContent = `${data.forecast.forecastday[0].day.totalprecip_mm} mm`;
  snow.textContent = `${data.forecast.forecastday[0].day.totalsnow_cm} cm`;

  document.getElementById("lever").textContent = data.forecast.forecastday[0].astro.sunrise;
  document.getElementById("coucher").textContent = data.forecast.forecastday[0].astro.sunset;

  if (map) {
    map.remove(); // Supprime la carte existante si elle est déjà initialisée pour régler le problème de la présentation
  }

  const mapContainer = document.getElementById("map");
  mapContainer.innerHTML = "";

  map = L.map('map').setView([data.location.lat, data.location.lon], 15);

  // Ajouter un fond de carte (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Ajouter un marqueur avec la météo
  L.marker([data.location.lat, data.location.lon])
  .addTo(map)
  .bindPopup(`
    <div class="weather-popup">
      <h3>${data.location.name}</h3>
      <p><img src="https:${data.current.condition.icon}"></p>
      <p><strong>Température :</strong> ${data.current.temp_c}°C</p>
    </div>
  `)
  .openPopup();

  changeBackground(data.current.condition.code);
  changeFiveDays(data);
}

function changeBackground(weatherCode) {
  switch(weatherCode){
    case 1000:
      {
        body.style.backgroundImage = "url('img/Sunny.jpg')";
        break;
      }
    case 1003:
    case 1006:
    case 1009:
    case 1135:
      {
        body.style.backgroundImage = "url('img/Cloudy.jpg')";
        break;
      }
    case 1030:
    case 1063:
    case 1150:
    case 1153:
    case 1180:
    case 1183:
    case 1186:
    case 1189:
    case 1192:
    case 1195:
    case 1240:
    case 1243:
    case 1246:
      {
        body.style.backgroundImage = "url('img/Rainy.jpg')";
        break;
      }
    case 1066:
    case 1069:
    case 1072:
    case 1114:
    case 1117:
    case 1147:
    case 1168:
    case 1171:
    case 1198:
    case 1201:
    case 1204:
    case 1207:
    case 1210:
    case 1213:
    case 1216:
    case 1219:
    case 1222:
    case 1225:
    case 1237:
    case 1249:
    case 1252:
    case 1255:
    case 1261:
    case 1264:
      {
        body.style.backgroundImage = "url('img/Snowy.jpg')";
        break;
      }
    case 1087:
    case 1273:
    case 1276:
    case 1279:
    case 1282:
      {
        body.style.backgroundImage = "url('img/Stormy.jpg')";
        break;
      }
    default:
      {
        body.style.backgroundImage = "url('img/Sunny.jpg')";
        break;
      }
  }
}

function changeFiveDays(data)
{
  //Hour 1
  document.getElementById("hour1text").textContent = "00h";
  document.getElementById("h1Icon").src = `https:${data.forecast.forecastday[0].hour[0].condition.icon}`;
  document.getElementById("h1Temp").textContent = data.forecast.forecastday[0].hour[0].temp_c + " C";

  //Hour 2
  document.getElementById("hour2text").textContent = "07h";
  document.getElementById("h2Icon").src = `https:${data.forecast.forecastday[0].hour[7].condition.icon}`;
  document.getElementById("h2Temp").textContent = data.forecast.forecastday[0].hour[7].temp_c + " C";

  //Hour 3
  document.getElementById("hour3text").textContent = "12h";
  document.getElementById("h3Icon").src = `https:${data.forecast.forecastday[0].hour[12].condition.icon}`;
  document.getElementById("h3Temp").textContent = data.forecast.forecastday[0].hour[12].temp_c + " C";

  //Hour 4
  document.getElementById("hour4text").textContent = "16h";
  document.getElementById("h4Icon").src = `https:${data.forecast.forecastday[0].hour[16].condition.icon}`;
  document.getElementById("h4Temp").textContent = data.forecast.forecastday[0].hour[16].temp_c + " C";

  //Hour 5
  document.getElementById("hour5text").textContent = "21h";
  document.getElementById("h5Icon").src = `https:${data.forecast.forecastday[0].hour[21].condition.icon}`;
  document.getElementById("h5Temp").textContent = data.forecast.forecastday[0].hour[21].temp_c + " C";

  //Day 1
  document.getElementById("d1Date").textContent = `${data.forecast.forecastday[1].date}`;
  document.getElementById("d1Icon").src = `https:${data.forecast.forecastday[1].hour[12].condition.icon}`;
  //Day 2
  document.getElementById("d2Date").textContent = `${data.forecast.forecastday[2].date}`;
  document.getElementById("d2Icon").src = `https:${data.forecast.forecastday[2].hour[12].condition.icon}`;
}

// Gère l'affichage de la liste déroulante
toggleCityListButton.addEventListener("click", () => {
  const cityList = document.getElementById("cityList");
  const isVisible = cityList.style.maxHeight && cityList.style.maxHeight !== "0px";

  if (isVisible) {
    cityList.style.maxHeight = "0";
  } else {
    cityList.style.maxHeight = `${cityList.scrollHeight}px`;
  }
});

function formatCityName(city) {
  if (!city) return ""; // Gérer les cas où la ville est vide ou undefined
  city = city.trim();   // Supprimer les espaces superflus
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
}
