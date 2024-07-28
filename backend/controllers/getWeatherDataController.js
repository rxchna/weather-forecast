const axios = require('axios');
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

module.exports = async (req, res) => {
    try {
        // Function to fetch weather data
        const weatherData = await getWeatherData(req.query.latitude, req.query.longitude);
        res.json(weatherData);
        
    } catch (err) {
        console.error(`Error fetching weather data: ${err}`);
        res.status(500).json({ error: `Error fetching weather data: ${err}` });
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