var searchBox = document.querySelector(".search-box");
var input = searchBox.querySelector(".city");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    var userLocation = event.target.value;
    searchLocation(userLocation);
    event.preventDefault();
  }
});

function searchLocation(searchLocation) {
  Papa.parse("worldcities.csv", {
    download: true,
    header: true,
    delimiter: ",",
    complete: function (results) {
      for (let i = 0; i < results.data.length; i++) {
        const StringifiedData = JSON.stringify(results.data[i])
        const values = StringifiedData.split(",")
        const city = values[1].replace(/["{}]/g, "").split(":");
        if (city[1].toLowerCase() === searchLocation.toLowerCase()) {
            latitude = values[2].replace(/["{}]/g, "").split(":")[1];
            longitude = values[3].replace(/["{}]/g, "").split(":")[1];
            console.log([latitude, longitude]);
            return;
      }
    }},
    error: function (error) {
      console.error(error);
    }
  });
}