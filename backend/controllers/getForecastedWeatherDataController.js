const axios = require('axios');
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

module.exports = async (req, res) => {
    try {
        // Function to fetch forecasted weather data
        const response = await getForecastWeatherData(req.query.city, req.query.countryCode);
        res.json(response);
        
    } catch (error) {
        console.log(error);
    }
}

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