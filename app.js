const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: '.variables.env' });

// Create express app
const app = express();

// env variables
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT_NO = process.env.PORT;

// global variables
global.GLOBAL_FORECAST_6_DAY_DATA = null;

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
        console.log("simple today's weather: ", weatherData); //todo remove
        res.json(weatherData);
        
    } catch (err) {
        console.error(`Error fetching weather data: ${err}`);
        res.status(500).json({ error: `Error fetching weather data: ${err}` });
    }
});

/* Endpoint to retrieve 6-days forecast weather data */
app.get('/api/forecastWeather', async (req, res) => {
    try {
        // Function to fetch forecasted weather data and populate global variable
        GLOBAL_FORECAST_6_DAY_DATA = await getForecastWeatherData(req.query.city, req.query.countryCode);
        res.status(200).json({ message: 'Forecast weather data updated successfully' });
        
    } catch (error) {
        console.log(error);
    }
});

/* Endpoint to retrieve 6-days forecast for min/max temperature */
app.get('/api/forecast6DayMinMaxTemperatures', async (req, res) => {
    try {
        // Filter global variable forecastData to retrieve minimum and maximum temperature each day for 6 days
        const minMaxTempForecast = filterMinMaxTemp();
        res.json(minMaxTempForecast);
        
    } catch (error) {
        console.log(error);
    }
});

/* Endpoint to retrieve wind data over the day */
app.get('/api/forecastWindDatapoint', async (req, res) => {
    try {
        // Filter global variable forecastData to retrieve minimum and maximum temperature each day for 6 days
        const windForecast = filterWindForecast();
        res.json(windForecast);
        
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

/* Function to fetch 6-day forecast weather data using OpenWeatherMap API */
const getForecastWeatherData = async (city_name, country_code) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name},${country_code}&exclude=hourly,daily&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        // Retrieve forecasted weather data
        const response = await axios.get(url);
        return response.data;
    }
    catch(error) {
        throw error;
    }
};

// Function to filter through each 3-hour forecasted data and extract min/max temperatures per day
const filterMinMaxTemp = () => {
    // Initialize an object to store min/max temperatures per day
    let tempData = {};

    if(GLOBAL_FORECAST_6_DAY_DATA) {
        // Iterate through the list of weather data
        GLOBAL_FORECAST_6_DAY_DATA.list.forEach((item) => {

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
    }

    // Convert tempData object to an array with numerical indices before returning
    const tempDataArray = Object.keys(tempData).map((key) => ({
        ...tempData[key],
    }));

    return tempDataArray;
};

// Function to filter through each 3-hour forecasted wind data for today 
const filterWindForecast = () => {
    let tempData = {};

    // Calculate current date
    const todayDate = new Date().toISOString().slice(0, 10);
    if(GLOBAL_FORECAST_6_DAY_DATA) {
        // Filter data for entries that match today's date
        tempData = GLOBAL_FORECAST_6_DAY_DATA.list.filter(item => item.dt_txt.includes(todayDate));
    }

    // Format response
    const windDataToday = tempData.map(item => ({
        time: item.dt_txt.split(' ')[1],
        wind: item.wind
    }));

    return windDataToday;
};