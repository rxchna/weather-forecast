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
    const [location, setLocation] = useState<LocationOption | null>(null);

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
        setLocation(searchData);
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
                        longitude: location.longitude,
                        countryCode: location.countryCode
                    }
                })
            }
        } catch (error) {
            console.error(error);
            return { options: [] };
        }
    };

    // Custom styles for AsyncPaginate
    const customStyles = {
        control: (provided: any, state: { isFocused: boolean }) => ({
            ...provided,
            borderRadius: '1em',
            backgroundColor: '#1E1E1E',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            padding: '0.5em 1.1em',
            width: '100%',
            outline: 'none',
        }),
        input: (provided: any) => ({
            ...provided,
            color: 'white',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#757575',
        }),
        option: (provided: any, state: { isFocused: boolean }) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#333' : '#1E1E1E',
            color: 'white',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#757575',
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#1E1E1E',
            borderRadius: '1em',
            padding: '1em',
            border: 'none',
            boxShadow: 'none',
        }),
        menuList: (provided: any) => ({
            ...provided,
            padding: 0,
            border: 'none',
        }),
    }

    // Render nothing until mounted on the client
    if (!isClient) return null;

    return (
        <AsyncPaginate
            placeholder="eg. Toronto, CA"
            debounceTimeout={1500} // debounce after every 1.5s
            value={location}
            onChange={handleOnChange}
            loadOptions={loadLocations}
            styles={customStyles}
        />
    );
};

export default SearchBarComponent;