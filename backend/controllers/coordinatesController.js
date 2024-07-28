const axios = require('axios');
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

module.exports = async (req, res) => {
    try {
        const coordinates = await getLocationCoordinates(req.query.city, req.query.countryCode);
        res.json(coordinates);
    } catch (err) {
        console.error(`Error fetching location coordinates: ${err}`);
        res.status(500).json({ error: `Error fetching location coordinates: ${err}` });
    }
}

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