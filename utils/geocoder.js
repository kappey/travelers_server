const NodeGeocoder = require('node-geocoder');
// const {config} = require('../config/sd');

const options = {
  // provider: config.geocoder_provider,
provider: process.env.GEO_PROVIDER,

//   fetch: customFetchImplementation,
  httpAdapter: 'https',
  // apiKey: config.geocoder_api_key,
  apiKey: process.env.GEO_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
