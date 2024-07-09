const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: '.variables.env' });

// Create express app
const app = express();

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT_NO = process.env.PORT;

app.listen(PORT_NO, () => {
    console.log(`App listening on port ${PORT_NO}`);
});

// Use CORS middleware to allow requests from front-end
app.use(cors());

/* Endpoint to fetch weather data */
app.get('/api/weather', async (req, res) => {
    try {
        // Function to fetch weather data
        const weatherData = await getWeatherData(req.query.city, req.query.countryCode);
        res.json(weatherData);
        
    } catch (err) {
        console.error(`Error fetching weather data: ${err}`);
        res.status(500).json({ error: `Error fetching weather data: ${err}` });
    }
});

/* Endpoint to retrieve 5-days forecast weather data */
app.get('/api/forecastweather', async (req, res) => {
    try {
        
        // Function to fetch forecasted weather data
        const forecastedWeatherData = await getForecastWeatherData(req.query.city, req.query.countryCode);
        res.json(forecastedWeatherData);
        
    } catch (error) {
        console.log(error);
    }
});

/* Function to fetch weather data for provided city using OpenWeatherMap API */
const getWeatherData = async (city_name, country_code) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name},${country_code}&appid=${WEATHER_API_KEY}&units=metric`; // units=metric: convert temperature to Celcius
    
    try {
        // Retrieve weather data
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

/* Function to fetch 5-day forecast weather data using OpenWeatherMap API */
const getForecastWeatherData = async (city_name, country_code) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name},${country_code}&exclude=hourly,daily&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        // Retrieve forecasted weather data
        const response = await axios.get(url);

        // Return forecast for each day at noon
        let noonForecast = getForecastAtNoon(response.data);

        return noonForecast;
    }
    catch(error) {
        throw error;
    }
};

// Function to filter response to get weather forecast for each day at noon only
const getForecastAtNoon = async (data) => {
    // Filter through response to return only data at dt_txt "12:00:00"
    return data.list.filter(forecast => forecast.dt_txt.endsWith("12:00:00"));
}