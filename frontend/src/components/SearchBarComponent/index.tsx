import React, { useEffect, useState } from 'react';
import { AsyncPaginate } from "react-select-async-paginate";
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import styles from "../../../public/assets/styles/page.module.css";

interface LocationOption {
    value: string;
    label: string;
    latitude: number;
    longitude: number;
}

const SearchBarComponent: React.FC<{ updateLocation: (location: any) => void }> = ({ updateLocation }) => {
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
    };

    // Handler: Location value is selected 
    const handleOnChange = (searchData: any) => {
        if(!searchData) return;
        updateLocation(searchData);
    };

    // Function to get available locations wrt to search string
    const loadLocations = async (inputValue: any) => {
        try {
            const locations = await getCityData(inputValue);

            return {
                options: locations.map((location: any) => {
                    console.log(location);
                    return {
                        value: location.id,
                        label: `${location.city}, ${location.country}`,
                        latitude: location.latitude,
                        longitude: location.longitude
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
        <div className={styles.search_bar_component}>
            <AsyncPaginate
                className={styles.async_paginate}
                placeholder="eg. Toronto, CA"
                debounceTimeout={1500} // debounce after every 1.5s
                value={location}
                onChange={handleOnChange}
                loadOptions={loadLocations}
            />
        </div>
    );
};

export default SearchBarComponent;