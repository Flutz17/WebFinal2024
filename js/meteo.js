const API_KEY = "f3bf512aa5b148078b9171858241303";
const API_URL = "http://api.weatherapi.com/v1/forecast.json";

const cityInput = document.getElementById("cityInput");
const addCityButton = document.getElementById("addCityButton");
const cityList = document.getElementById("cityList");
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

addCityButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    fetchWeather(cityName);
  }
});

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
