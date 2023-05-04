var searchBox = document.querySelector(".search-box");
var input = searchBox.querySelector(".city");
let latitudeCoordinate = 2;
let longitudeCoordinate = 3;
let CityKey = 1;

input.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    var userLocation = event.target.value;
    try {
      searchLocation(userLocation)
        .then((coords) => APICall(coords))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
    event.preventDefault();
  }
});

function searchLocation(searchLocation) {
  return new Promise((resolve, reject) => {
    Papa.parse("worldcities.csv", {
      download: true,
      header: true,
      delimiter: ",",
      complete: function (results) {
        for (let i = 0; i < results.data.length; i++) {
          const StringifiedData = JSON.stringify(results.data[i]);
          const values = StringifiedData.split(",");
          const city = values[CityKey].replace(/["{}]/g, "").split(":");
          if (city[1] === searchLocation) {
            latitude = values[latitudeCoordinate]
              .replace(/["{}]/g, "")
              .split(":")[CityKey];
            longitude = values[longitudeCoordinate]
              .replace(/["{}]/g, "")
              .split(":")[CityKey];
            const coordinates = [latitude, longitude];
            resolve(coordinates);
            break;
          }
        }
        reject("Location is unknown!");
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function APICall(arrayCoordinates) {
  const responseData = {};
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${arrayCoordinates[0]}&longitude=${arrayCoordinates[1]}&daily=apparent_temperature_max,apparent_temperature_min,precipitation_hours&forecast_days=1&timezone=auto`
  )
    .then((response) => response.json())
    .then((response) => {
      responseData.temperatureMax = response.daily.apparent_temperature_max;
      responseData.temperatureMin = response.daily.apparent_temperature_min;
      responseData.precipitationHours = response.daily.precipitation_hours;
      document.getElementById('temperatureMax').innerHTML = responseData.temperatureMax;
      document.getElementById('temperatureMin').innerHTML = responseData.temperatureMin;
      document.getElementById('precipitationHours').innerHTML = responseData.precipitationHours;
    })
    .catch((error) => console.error(error));
}
