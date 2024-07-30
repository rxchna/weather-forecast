const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: '.variables.env' });

// Create express app
const app = express();

// env variables
const PORT_NO = process.env.PORT;

app.listen(PORT_NO, () => {
    console.log(`App listening on port ${PORT_NO}`);
});

// Use CORS middleware to allow requests from front-end
app.use(cors());

// Controllers
const coordinatesController = require("./controllers/coordinatesController");
const getWeatherDataController = require("./controllers/getWeatherDataController");
const getForecastWeatherDataController = require("./controllers/getForecastedWeatherDataController");
const getWindForecastData = require("./controllers/getWindForecastDataController");
const searchCityController = require("./controllers/searchCityController");

// Endpoints
app.get('/api/locationLatLonCoordinates', coordinatesController);
app.get('/api/weather', getWeatherDataController);
app.get('/api/forecastWeather', getForecastWeatherDataController);
app.get('/api/forecastWindDatapoint', getWindForecastData);
app.get('/api/searchCity', searchCityController);