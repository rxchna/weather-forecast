"use client";
import Image from "next/image";
import React from 'react';
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_BASE_URL } from "@/config/serverApiConfig";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import WindGraph from '../components/WindGraph/index';

export default function Home() {

    const [city, setCity] = useState("Waterloo");
    const [countryCode, setCountryCode] = useState("CA");
    const [weatherData, setWeatherData] = useState<any>(null);
    const [forecastTemperatureData, setForecastTemperatureData] = useState<any[]>([]);
    const [forecastWindData, setForecastWindData] = useState<any[]>([]);

    const weatherIconSize4x = "4x";
    const weatherIconSize2x = "2x";

    // Get current weather data
    const getWeatherData = async () => {
        // Call route in backend, send variables
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/weather', {
                    params: {
                        city: city,
                        countryCode: countryCode
                    }
                });
                setWeatherData(response.data);
                console.log("Today's weather data: ", response.data);
            }
            else {
                console.log("City or country code is empty.");
            }
        } catch (error) {
            console.log(`Error fetching weather data: ${error}`);
            throw error;
        }
    };

    // Get forecasted weather data
    const getForecastWeatherData = async () => {
        // Call route in backend, send variables
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/forecastWeather', {
                    params: {
                        city: city,
                        countryCode: countryCode
                    }
                });
                
                console.log(response.data.message);
            }
            else {
                console.log("City or country code is empty.");
            }
        } catch (error) {
            console.log(`Error fetching forecast weather data: ${error}`);
            throw error;
        }
    };

    // Get forecasted temperature data
    const getForecastTemperatureData = async () => {
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/forecast6DayMinMaxTemperatures');
                setForecastTemperatureData(response.data);
                console.log("Temperature response rachna : ", response.data);
            }
            else {
                console.log("City or country code is empty.");
            }
        } catch (error) {
            console.log(`Error fetching forecast temperature data: ${error}`);
            throw error;
        }
    };

    // Get forecasted temperature data
    const getForecastWindData = async () => {
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/forecastWindDatapoint');
                setForecastWindData(response.data);
                console.log("Wind response: ", response.data); // getting response now need to display those values on graph
            }
            else {
                console.log("City or country code is empty.");
            }
        } catch (error) {
            console.log(`Error fetching forecast wind data: ${error}`);
            throw error;
        }
    };

    // Function to update place from search bar
    const updatePlace = (e: any) => {
        if(e.target.value) {
            // Break search data into city name and country code
            let parts = e.target.value.split(", ");
            setCity(parts[0]);
            setCountryCode(parts[1]);
        }
    };

    // Function to convert temperature to 1dp and add Celcius symbol
    const formatTemperature = (temp: any) => {
        return `${temp.toFixed(1)}\u00B0C`;
    };

    // Function to display forecast temperature as max string
    const formatForecastMaxTemp = (maxTemp: any) => {
        return `${maxTemp.toFixed(1)}\u00B0/`;
    };
    // Function to display forecast temperature as min string
    const formatForecastMinTemp = (minTemp: any) => {
        return `${Math.floor(minTemp)}\u00B0`;
    };
    // Function to format date on forecast section
    const formatForecastDate = (dateTimeString: any) => {
        const date = new Date(dateTimeString);
    
        // Get month and day
        const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        const day = date.getDate();

        // Get day of the week
        const dayOfWeek = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);

        // Format the output
        const formattedDate = `${month} ${day < 10 ? '0' + day : day}`;
        const formattedDayOfWeek = dayOfWeek;

        return {
            formattedDate,
            formattedDayOfWeek
        };
    }

    useEffect(() => {
        getWeatherData();
        getForecastWeatherData().then( () => {
            getForecastTemperatureData();
            getForecastWindData();
        });
    }, []);

    // Function to retrieve weather icon using OpenWeather icons
    const WeatherIcon = ({ iconCode, iconSize }) => {
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}${iconSize ? `@${iconSize}` : ''}.png`;
        return <img src={iconUrl} alt="Weather icon" />;
    };

    // Function to display custom icon
    const customIcon = (iconCode) => {
        let iconComponent = null;

        // Display different icons on different iconCode
        switch(iconCode) {
            case "01d":
                iconComponent = <WbSunnyIcon />
                break;
            
            case "01n":
                iconComponent = <DarkModeIcon />
                break;

            case "02d":
            case "02n":
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                iconComponent = <CloudQueueIcon />
                break;

            case "09d":
            case "09n":
            case "10d":
            case "10n":
            case "50d":
            case "50n":
                iconComponent = <WaterDropIcon />
                break;

            case "11d":
            case "11n":
                iconComponent = <ThunderstormIcon />
                break;

            case "13d":
            case "13n":
                iconComponent = <AcUnitIcon />
                break;

            default:
                break;
        };
        return iconComponent;
    };

    // Function to return capitalized string
    const capitalizeString = (desc) => {
        return desc.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    };

    // Get formatted current time
    const currentTime = new Date().toLocaleTimeString([], {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(' at', '');

    return (
        <div className={styles.body_div}>
            <div className={styles.body_header}>
                <h1>
                    <LocationOnIcon className={styles.location_icon} />
                    {weatherData && <div className={styles.location_name}>{weatherData.name}, {weatherData.sys.country}</div>}
                </h1>
                <div className={styles.search_bar}>
                    <input type="search" placeholder="eg. Toronto, CA" onChange={(e) => updatePlace(e)}/>
                    <button onClick={() => {
                        getWeatherData();
                        getForecastWeatherData().then( () => {
                            getForecastTemperatureData();
                            getForecastWindData();
                        });
                    }}><SearchIcon className={styles.search_icon}/></button>
                </div>
            </div>
            <div className={styles.main_weather_data}>
                <div className={styles.current_location}>
                    <div className={styles.weather_icon}>
                        {weatherData?.weather[0]?.icon && (
                            <WeatherIcon iconCode={weatherData.weather[0].icon} iconSize={weatherIconSize4x} />
                        )}
                    </div>
                    <h1 className={styles.temperature_style}>
                        {weatherData?.main?.temp && (
                            formatTemperature(weatherData.main.temp)
                        )}
                    </h1>
                    <div className={styles.weather_custom_icon}>
                        {weatherData?.weather[0]?.icon && (
                            customIcon(weatherData.weather[0].icon)
                        )}
                    </div>
                    <div className={styles.weather_desc}>
                        {weatherData?.weather[0]?.description && (
                            capitalizeString(weatherData.weather[0].description)
                        )}
                    </div>
                    <hr />
                    <CalendarMonthOutlinedIcon />
                    <div>{currentTime}</div>
                    <DeviceThermostatSharpIcon />
                    <div>Feels Like {weatherData?.main?.feels_like && (
                        formatTemperature(weatherData.main.feels_like)
                    )}</div>
                </div>
                <div className={styles.meteorological_data_points}>
                    <div className={styles.data_points_header}>Today's Highlight</div>
                    <div className={styles.wind_data_point}>
                        {/* Wind Graph */}
                        {/* todo: check if winddata is not null */}
                        <div>Wind Status</div>
                        <h1>
                            {weatherData?.wind?.speed && (
                                weatherData.wind.speed
                            )}
                            <span className={styles.wind_unit}> m/s</span>
                        </h1>
                        <div className={styles.wind_graph}>
                            <WindGraph windData={forecastWindData} />
                        </div>
                    </div>
                    <div className={styles.uv_index_datapoint}>UV Index</div>
                    <div className={styles.sunrise_sunset_data_point}>Sunrise & Sunset</div>
                    <div className={styles.humidity_data_point}>Humidity</div>
                    <div className={styles.visibility_data_point}>Visibility</div>
                    <div className={styles.pressure_data_point}>Pressure</div>
                </div>
                <div className={styles.secondary_header}>6-days Forecast</div>
                <div className={styles.secondary_header}>Some map location</div>
                <div className={styles.forecast_six_days}>
                    {/* Iterate over each entry */}
                    {forecastTemperatureData.map((forecast, index) => (
                        <React.Fragment key={index}>
                            <div className={styles.forecast_icon}>
                                {forecast?.icon && (
                                    <WeatherIcon iconCode={forecast.icon} iconSize={weatherIconSize2x} />
                                )}
                            </div>
                            <div className={styles.forecast_temp}>
                                <span className={styles.forecast_max_temp}>
                                    {forecast?.maxTemp && (
                                        formatForecastMaxTemp(forecast.maxTemp)
                                    )}
                                </span>
                                <span className={styles.forecast_min_temp}>
                                    &nbsp;
                                    {forecast?.minTemp && (
                                        formatForecastMinTemp(forecast.minTemp)
                                    )}
                                </span>
                            </div>
                            <div className={styles.forecast_day}>
                                {forecast?.date && (
                                    formatForecastDate(forecast.date).formattedDate
                                )}
                            </div>
                            <div className={styles.forecast_day}>
                                {forecast?.date && (
                                    formatForecastDate(forecast.date).formattedDayOfWeek
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className={styles.map_section}>
                    Map Location
                    {/* <h3>Weather Dashboard</h3>
                    {weatherData && (
                        <pre>{JSON.stringify(weatherData, null, 2)}</pre>
                    )} */}
                </div>
            </div>
        </div>
    );
}
