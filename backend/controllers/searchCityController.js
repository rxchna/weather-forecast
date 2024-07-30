const axios = require('axios');
const GEO_API_KEY = process.env.GEO_API_KEY;

module.exports = async (req, res) => {
    try {
        const locationsData = await getCity(req.query.cityPrefix);
        res.json(locationsData);
        
    } catch (error) {
        console.log(error);
    }
}


/* Function to cities based on provided string prefixes */
const getCity = async (cityPrefix) => {
    const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=en&sort=-population&types=CITY"; // sort results by decreasing population

    const options = {
        method: 'GET',
        url: `${GEO_API_URL}&namePrefix=${cityPrefix}`,
        headers: {
            'x-rapidapi-key': GEO_API_KEY,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const locationsResponse = response.data.data || [];

        // Remove duplicates, i.e. if city and country combination is the same
        const locationsData = Array.from(
            new Map(locationsResponse.map((location) => [`${location.city}${location.country}`, location])).values()
        );

        return locationsData;
    }
    catch (error) {
        throw error;
    }
};