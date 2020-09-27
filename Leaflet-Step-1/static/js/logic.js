// Set variables for the map to be centred around Lewellen, Nebraska for best visual of earthquake locations
var usCentre = [41.330692, -102.145487];
var mapZoomLevel = 5;

// Create the createMap function
var myMap = L.map("map", {
  center: usCentre,
  zoom: mapZoomLevel,
});

// Create the tile layer that will be the background of our map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);

// Define a markerSize function that will give each earthquake location a different radius based on its magnitude
function markerSize(magnitude) {
  return magnitude * 15500;
}

// Function to select colour for each marker based on earthquake depth
function depthColor(depth) {
  if (depth < 10) color = "#99FF33";
  else if (depth < 30) color = "#CCFF66";
  else if (depth < 50) color = "#FFCC33";
  else if (depth < 70) color = "#FF9900";
  else if (depth < 90) color = "#FF6600";
  else color = "#FF0000";
  return color;
}

// Load in geojson data
var url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab data with d3
d3.json(url, (response) => {
  console.log(response);

  var earthquakeMarkers = [];

  var earthquakes = response.features;

  // Each earthquake
  console.log(earthquakes);

  // // Coordinates of each earthquake
  // console.log(earthquakes[0].geometry.coordinates);

  // // Longitude
  // console.log(earthquakes[0].geometry.coordinates[0]);

  // // Latitude
  // console.log(earthquakes[0].geometry.coordinates[1]);

  // // Depth
  // console.log(earthquakes[0].geometry.coordinates[2]);

  // Loop through each feature and create one marker for each earthquake object
  earthquakes.forEach((earthquake) => {
    var longitude = earthquake.geometry.coordinates[0];
    var latitude = earthquake.geometry.coordinates[1];
    var depth = earthquake.geometry.coordinates[2];
    var magnitude = earthquake.properties.mag;

    // console.log(latitude);
    // console.log(longitude);
    // console.log(depth);
    // console.log(magnitude);

    var marker = L.circle([latitude, longitude], {
      fillOpacity: 0.75,
      color: "black",
      weight: 1,
      fillColor: depthColor(depth),
      radius: markerSize(magnitude),
    })
      .bindPopup(
        "<h2>" +
          earthquake.properties.place +
          "</h2><h3>Magnitude: " +
          magnitude +
          "<h3>Depth: " +
          depth
      )
      .addTo(myMap);
  });

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML +=
      '<i style="background: #99FF33"></i><span> -10 to 10</span><br>';
    div.innerHTML +=
      '<i style="background: #CCFF66"></i><span>10 to 30</span><br>';
    div.innerHTML +=
      '<i style="background: #FFCC33"></i><span>30 to 50</span><br>';
    div.innerHTML +=
      '<i style="background: #FF9900"></i><span>50 to 70</span><br>';
    div.innerHTML +=
      '<i style="background: #FF6600"></i><span>70 to 90</span><br>';
    div.innerHTML += '<i style="background: #FF0000"></i><span>90 +</span><br>';

    return div;
  };

  legend.addTo(myMap);
});
