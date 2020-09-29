// Declare global variables for markers to be added to layers
var earthquakeMarker;
var techtonicplates;

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


// Map Setup

// Create the tile layer(s) that will be the chosen background of our map
var streets = L.tileLayer(
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
)

var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY,
  }
);

var darkmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY,
  }
);

var satellite = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "satellite-streets-v11",
    accessToken: API_KEY,
  }
);

// Add all the earthquakeMarkers to a new layer group.
// Now we can handle them as one group instead of referencing each individually
var earthquakeLayer = L.layerGroup(earthquakeMarker);

// // Add all the techtonic plate shapes to a new layer group.
// // Now we can handle them as one group instead of referencing each individually
var plateLayer = L.layerGroup(techtonicplates);

// Set variables for the map to be centred around Lewellen, Nebraska for best visual of earthquake locations
var usCentre = [41.330692, -102.145487];
var mapZoomLevel = 5;

// Create map object and set default layers
var myMap = L.map("map", {
  center: usCentre,
  zoom: mapZoomLevel,
  layers: [streets, earthquakeLayer, plateLayer],
});

streets.addTo(myMap);

// Create a baseMaps object to hold base map options - only one can be shown at a time
var baseMaps = {
  "Street Map": streets,
  "Light Map": lightmap,
  "Dark Map": darkmap,
  "Satellite Map": satellite,
};

// Create an overlayMaps object to hold other layers
var overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Techtonic Plates": plateLayer,
};


// Pass our map layers into our layer control
// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control
  .layers(baseMaps, overlayMaps, {
    collapsed: false,
  })
  .addTo(myMap);




// Load in geojson data for earthquakes
var url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab data with d3
d3.json(url, (response) => {
  // console.log(response);

  var earthquakes = response.features;

  // Each earthquake
  // console.log(earthquakes);

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

    var earthquakeMarker = L.circle([latitude, longitude], {
      fillOpacity: 0.75,
      color: "black",
      weight: 1,
      fillColor: depthColor(depth),
      radius: markerSize(magnitude),
    })
      .bindPopup(
        "<h3>" +
          earthquake.properties.place +
          "</h3><hr><h4>Magnitude: " +
          magnitude +
          "<h4>Depth: " +
          depth
      )
      .addTo(earthquakeLayer);
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

// Add in techtonic plates
// Link to json file for techtonic plates
var link = "Leaflet-Step-2/static/data/PB2002_plates.json";

// Grabbing our JSON data..
d3.json(link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  techtonicplates = L.geoJson(data, {
    style: function (feature) {
      return {
        color: "#FF8C00",
        weight: 2.5,
        fillOpacity: 0,
      };
    },
  }).addTo(plateLayer);
});
