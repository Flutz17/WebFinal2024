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
const forecastDate = document.getElementById("forecastDate");
const maxTemp = document.getElementById("maxTemp");
const minTemp = document.getElementById("minTemp");
const windSpeed = document.getElementById("windSpeed");
const precipitation = document.getElementById("precipitation");
const snow = document.getElementById("snow");
const toggleCityListButton = document.getElementById("toggleCityList");

let cachedCities = []; // Stocke les villes ajoutées

// Initialise les villes à partir du cache local
document.addEventListener("DOMContentLoaded", () => {
  const storedCities = JSON.parse(localStorage.getItem("cachedCities")) || [];
  cachedCities.push(...storedCities);
  renderCityList();
});

// Ajoute une ville à la liste
addCityButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    if (!cachedCities.includes(cityName)) {
      cachedCities.push(cityName);
      localStorage.setItem("cachedCities", JSON.stringify(cachedCities));
      renderCityList();
      fetchWeather(cityName); // Affiche directement les données météo de la nouvelle ville
    } else {
      message.textContent = "La ville est déjà dans votre liste.";
    }
  }
  cityInput.value = ""; // Réinitialise le champ d'entrée
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
    const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=no`);
    if (!response.ok) {
      throw new Error("Ville introuvable");
    }
    const data = await response.json();
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

  forecastDate.textContent = `Prévisions : ${data.forecast.forecastday[0].date}`;
  maxTemp.textContent = `Max : ${data.forecast.forecastday[0].day.maxtemp_c}°C`;
  minTemp.textContent = `Min : ${data.forecast.forecastday[0].day.mintemp_c}°C`;
  windSpeed.textContent = `Vent max : ${data.forecast.forecastday[0].day.maxwind_kph} kph`;
  precipitation.textContent = `Précipitations : ${data.forecast.forecastday[0].day.totalprecip_mm} mm`;
  snow.textContent = `Neige : ${data.forecast.forecastday[0].day.totalsnow_cm} cm`;
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

