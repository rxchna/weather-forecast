const axios = require('axios');
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

module.exports = async (req, res) => {
    try {
        // Filter global variable forecastData to retrieve minimum and maximum temperature each day for 6 days
        const windForecast = await getDailyWindData(req.query.latitude, req.query.longitude);
        res.json(windForecast);
        
    } catch (error) {
        console.log(error);
    }
}


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