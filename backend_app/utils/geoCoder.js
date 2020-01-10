const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",

  // Optional depending on the providers
  httpAdapter: "https", // Default
  apiKey: "YW5xhVt1NiBN4wBPJMMueG0hCWXni88A", // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
