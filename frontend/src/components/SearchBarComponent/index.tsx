import React, { useEffect, useState } from 'react';
import { AsyncPaginate } from "react-select-async-paginate";
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

const SearchBarComponent = () => {
    const [location, setLocation] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Method to call endpoint to retrieve city names based on prefixes
    const getCityData = async (searchPrefix: any) => {
        try {
            // Call endpoint to retrieve city names
            const response = await axios.get(API_BASE_URL + '/api/searchCity', {
                params: {
                    cityPrefix: searchPrefix
                }
            });
            return response.data;

        } catch (error) {
            console.log(`Error fetching city data: ${error}`);
            throw error;
        }
    }

    const handleOnChange = (searchData: any) => {
        console.log("here");
        if(!searchData) return;
        setLocation(searchData);
    };

    const loadLocations = async (inputValue: any) => {
        try {
            const locations = await getCityData(inputValue);

            return {
                options: locations.map((location: any) => {
                    return {
                        value: location.id,
                        label: `${location.city}, ${location.country}`
                    }
                })
            }
        } catch (error) {
            console.error(error);
            return { options: [] };
        }
    };

    // Render nothing until mounted on the client
    if (!isClient) return null;

    return (
        <AsyncPaginate
            placeholder="eg. Toronto, CA"
            debounceTimeout={1500} // debounce after every 1.5s
            value={location}
            onChange={handleOnChange}
            loadOptions={loadLocations}
        />
    );
};

export default SearchBarComponent;