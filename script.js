var searchBox = document.querySelector(".search-box");
var input = searchBox.querySelector(".city");
let latitudeCoordinate = 2;
let longitudeCoordinate = 3;
let CityKey = 1;

input.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    var userLocation = event.target.value;
    try {
      GeocodingAPICall(userLocation)
      .then((coords) => WeatherAPICall(coords))
    } catch (error) {
      console.error(error);
    }
    event.preventDefault();
  }
});

async function GeocodingAPICall(locationSearch) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationSearch}&count=2&language=en&format=json`);
  const jsonData = await response.json();
  let cityCoordinates = [jsonData["results"][0].latitude, jsonData["results"][0].longitude];
  console.log(cityCoordinates)
  return cityCoordinates;
}

function WeatherAPICall(arrayCoordinates) {
  const responseData = {};
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${arrayCoordinates[0]}&longitude=${arrayCoordinates[1]}&daily=apparent_temperature_max,apparent_temperature_min&forecast_days=1&timezone=auto`
  )
    .then((response) => response.json())
    .then((response) => {
      responseData.temperatureMax = response.daily.apparent_temperature_max;
      responseData.temperatureMin = response.daily.apparent_temperature_min;
      responseData.precipitationHours = response.daily.precipitation_hours;
      document.getElementById('temperatureMax').innerHTML = responseData.temperatureMax;
      document.getElementById('temperatureMin').innerHTML = responseData.temperatureMin;
    })
    .catch((error) => console.error(error));
}