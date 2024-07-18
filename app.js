const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: '.variables.env' });

// Create express app
const app = express();

// env variables
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT_NO = process.env.PORT;

app.listen(PORT_NO, () => {
    console.log(`App listening on port ${PORT_NO}`);
});

// Use CORS middleware to allow requests from front-end
app.use(cors());

app.get('/api/locationLatLonCoordinates', async (req, res) => {
    try {
        const coordinates = await getLocationCoordinates(req.query.city, req.query.countryCode);
        res.json(coordinates);
    } catch (err) {
        console.error(`Error fetching location coordinates: ${err}`);
        res.status(500).json({ error: `Error fetching location coordinates: ${err}` });
    }
});

/* Endpoint to fetch weather data */
app.get('/api/weather', async (req, res) => {
    try {
        // Function to fetch weather data
        const weatherData = await getWeatherData(req.query.latitude, req.query.longitude);
        res.json(weatherData);
        
    } catch (err) {
        console.error(`Error fetching weather data: ${err}`);
        res.status(500).json({ error: `Error fetching weather data: ${err}` });
    }
});

/* Endpoint to retrieve 6-days forecast weather data */
app.get('/api/forecastWeather', async (req, res) => {
    // Feature: use lat/lon coordinates for retrieving forecase data
    try {
        // Function to fetch forecasted weather data
        const response = await getForecastWeatherData(req.query.city, req.query.countryCode);
        res.json(response);
        
    } catch (error) {
        console.log(error);
    }
});

/* Endpoint to retrieve wind data over the day */
app.get('/api/forecastWindDatapoint', async (req, res) => {
    try {
        // Filter global variable forecastData to retrieve minimum and maximum temperature each day for 6 days
        const windForecast = await getDailyWindData(req.query.latitude, req.query.longitude);
        res.json(windForecast);
        
    } catch (error) {
        console.log(error);
    }
});

/* Function to fetch latitude and longitude coordinates from city_name and country_code */
const getLocationCoordinates = async (city_name, country_code) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${country_code}&limit=1&appid=${WEATHER_API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

/* Function to fetch weather data for provided city using OpenWeatherMap API */
const getWeatherData = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily,minutely&appid=${WEATHER_API_KEY}&units=metric`
    try {
        // Retrieve weather data
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

/* Function to fetch 6-day forecast weather data using OpenWeatherMap API */
const getForecastWeatherData = async (city_name, country_code) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name},${country_code}&exclude=hourly,daily&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        // Retrieve forecasted weather data
        const response = await axios.get(url);
        const filteredMinMaxTempForecast = filterMinMaxTemp(response.data);
        return filteredMinMaxTempForecast;
    }
    catch(error) {
        throw error;
    }
};

/* Function to fetch daily wind data */
const getDailyWindData = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=daily,minutely&appid=${WEATHER_API_KEY}&units=metric`
    try {
        const response = await axios.get(url);

        // Return daily forecasted wind data for thr first 24 hours
        const forecastWindData = response.data.hourly.slice(0, 24).map(hour => hour.wind_speed);

        return forecastWindData;
    }
    catch (error) {
        throw error;
    }
};

// Function to filter through each 3-hour forecasted data and extract min/max temperatures per day
const filterMinMaxTemp = (response) => {
    // Initialize an object to store min/max temperatures per day
    let tempData = {};

    // Iterate through the list of weather data
    response.list.forEach((item) => {

        // Extract date from dt_txt
        const date = item.dt_txt.split(' ')[0];

        // Initialize min/max temperatures for the day if not already set
        if (!tempData[date]) {
            tempData[date] = {
                date: date,
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                icon: item.weather[0].icon
            };
        } else {
            // Update min/max temperatures for the day if necessary
            if (item.main.temp_min < tempData[date].minTemp) {
                tempData[date].minTemp = item.main.temp_min;
            }
            if (item.main.temp_max > tempData[date].maxTemp) {
                tempData[date].maxTemp = item.main.temp_max;
            }
        }

        // Initialize weather icon for each day with 12:00:00 data
        if (item.dt_txt.endsWith("12:00:00")) {
            tempData[date].icon = item.weather[0].icon;
        }
    });

    // Convert tempData object to an array with numerical indices before returning
    const tempDataArray = Object.keys(tempData).map((key) => ({
        ...tempData[key],
    }));

    return tempDataArray;
};