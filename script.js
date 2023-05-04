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
        .then((coords) => console.log(coords))
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
            // console.log([latitude, longitude]);
            const coordinates = [latitude, longitude];
            // console.log(coordinates);
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
