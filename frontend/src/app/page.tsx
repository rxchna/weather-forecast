"use client";
import React from 'react';
import styles from "../../public/assets/styles/page.module.css";

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
import WaterDropTwoToneIcon from '@mui/icons-material/WaterDropTwoTone';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DeviceThermostatSharpIcon from '@mui/icons-material/DeviceThermostatSharp';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import StormIcon from '@mui/icons-material/Storm';
import WindGraphComponent from '../components/WindGraphComponent/index';
import UVChartComponent from '../components/UVChartComponent/index';
import SunChartComponent from '../components/SunChartComponent/index';
import MapComponent from "@/components/MapComponent";
import OpenWeatherIconComponent from "@/components/OpenWeatherIconComponent";
import { formatTemperature, formatForecastMaxTemp, formatForecastMinTemp, formatForecastDate, formatDewPoint, formatVisbilityKm, formatCurrentTime, capitalizeString } from "@/utils/formatDataUtilityFunctions";
import { addVisibilityInfo, addPressureInfo, addDewPointInfo } from "@/utils/additionalWeatherInformation";

export default function Home() {

    const [city, setCity] = useState("Waterloo");
    const [countryCode, setCountryCode] = useState("CA");
    const [latitudeCoordinate, setLatitudeCoordinate] = useState<number>(0);
    const [longitudeCoordinate, setLongitudeCoordinate] = useState<number>(0);
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState<any>(null);
    const [forecastTemperatureData, setForecastTemperatureData] = useState<any[]>([]);
    const [forecastWindData, setForecastWindData] = useState<any[]>([]);

    const weatherIconSize4x = "4x";
    const weatherIconSize2x = "2x";

    const getLatLonCoordinates = async () => {
        // Call API to fetch location latitude/longitude coordinates
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/locationLatLonCoordinates', {
                    params: {
                        city: city,
                        countryCode: countryCode
                    }
                });

                if(response) {
                    const {lon, lat, name, country} = response.data[0];
                    setLocation(`${name}, ${country}`); // Feature todo: auto suggest from seach bar

                    // Set coordinates state
                    setLongitudeCoordinate(lon);
                    setLatitudeCoordinate(lat);

                    return { lon, lat };
                }
                else {
                    console.log("#rp: No matching city and country found")
                }
            }
        } catch (error) {
            console.log(`Error fetching location coordinates: ${error}`);
            throw error;
        }
    }

    // Get current weather data
    const getWeatherData = async () => {
        // Call route in backend, send variables
        try {
            console.log("latitude/longitude: ", latitudeCoordinate, " ", longitudeCoordinate);
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/weather', {
                    params: {
                        latitude: latitudeCoordinate,
                        longitude: longitudeCoordinate
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
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/forecastWeather', {
                    params: {
                        city: city,
                        countryCode: countryCode
                    }
                });
                setForecastTemperatureData(response.data);
                console.log("Forecast weather data: ", response.data);
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
    const getForecastWindData = async () => {
        try {
            if(city?.length && countryCode?.length) {
                const response = await axios.get(API_BASE_URL + '/api/forecastWindDatapoint', {
                    params: {
                        latitude: latitudeCoordinate,
                        longitude: longitudeCoordinate
                    }
                });
                setForecastWindData(response.data);
                console.log("Wind response: ", response.data);
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

    // Initial render of component
    useEffect(() => {
        getLatLonCoordinates();
    }, []);

    // Runs when latitudeCoordinate or longitudeCoordinate state changes.
    useEffect(() => {
        // Retrieve weather data
        getWeatherData();

        // Retrieve forecast data
        getForecastWeatherData();

        // Retrieve wind daily forecast data
        getForecastWindData();

    }, [latitudeCoordinate, longitudeCoordinate]);

    // Function to display custom icon
    const customIcon = (iconCode: string) => {
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

    return (
        <div className={styles.body_div}>
            <div className={styles.body_header}>
                <h1>
                    <LocationOnIcon className={styles.location_icon} />
                    {location && (
                        <div className={styles.location_name}>
                            {location}
                        </div>
                    )}
                </h1>
                <div className={styles.search_bar}>
                    <input type="search" placeholder="eg. Toronto, CA" onChange={(e) => updatePlace(e)}/>
                    <button onClick={() => {
                        getLatLonCoordinates();
                    }}><SearchIcon className={styles.search_icon}/></button>
                </div>
            </div>
            <div className={styles.main_weather_data}>
                <div className={styles.current_location}>
                    <div className={styles.weather_icon}>
                        {weatherData?.current.weather[0]?.icon && (
                            <OpenWeatherIconComponent iconCode={weatherData.current.weather[0].icon} iconSize={weatherIconSize4x} />
                        )}
                    </div>
                    <h1 className={styles.temperature_style}>
                        {weatherData?.current?.temp && (
                            formatTemperature(weatherData.current.temp)
                        )}
                    </h1>
                    <div className={styles.weather_custom_icon}>
                        {weatherData?.current.weather[0]?.icon && (
                            customIcon(weatherData.current.weather[0].icon)
                        )}
                    </div>
                    <div className={styles.weather_desc}>
                        {weatherData?.current?.weather[0]?.description && (
                            capitalizeString(weatherData.current.weather[0].description)
                        )}
                    </div>
                    <hr />
                    <CalendarMonthOutlinedIcon />
                    <div>{formatCurrentTime}</div>
                    <DeviceThermostatSharpIcon />
                    <div>Feels Like {weatherData?.current?.feels_like && (
                        formatTemperature(weatherData.current.feels_like)
                    )}</div>
                </div>
                <div className={styles.meteorological_data_points}>
                    <div className={styles.data_points_header}>Today's Highlight</div>
                    <div className={styles.wind_data_point}>
                        {/* Wind Graph */}
                        <div>Wind Status</div>
                        <h1>
                            {weatherData?.current?.wind_speed && (
                                weatherData.current.wind_speed
                            )}
                            <span className={styles.datapoint_unit}> m/s</span>
                        </h1>
                        <div className={styles.wind_graph}>
                            {forecastWindData && 
                                <WindGraphComponent windData={forecastWindData} />
                            }
                        </div>
                    </div>
                    <div className={styles.uv_index_datapoint}>
                        {/* UVI Chart */}
                        <div>UV Index</div>
                        <div className={styles.uv_chart}>
                            <UVChartComponent uvi={weatherData?.current?.uvi} />
                        </div>
                        <h1 className={styles.uv_data_value}>
                            {weatherData?.current?.uvi && (
                                weatherData.current.uvi
                            )}
                            <span className={styles.datapoint_unit}> uv</span>
                        </h1>
                    </div>
                    <div className={styles.sunrise_sunset_data_point}>
                        {/* Sunrise-Sunset Chart */}
                        <div>Sunrise & Sunset</div>
                        <div className={styles.sunset_sunrise_chart}>
                            {weatherData?.current?.sunrise && weatherData?.current?.sunset &&
                                <SunChartComponent
                                    sunrise={weatherData?.current?.sunrise} 
                                    sunset={weatherData?.current?.sunset}
                                    current_time={formatCurrentTime}
                                />
                            }
                        </div>
                    </div>
                    {/* Humidity DataPoint */}
                    <div className={styles.humidity_data_point}>
                        <div className={styles.secondary_dp_header}>Humidity</div>
                        <div className={styles.secondary_dp_value}>
                            <span className={styles.large_font}>
                                {weatherData?.current?.humidity && (
                                    weatherData.current.humidity
                                )}
                            </span> %
                        </div>
                        <div className={styles.secondary_dp_icon}>
                            <WaterDropTwoToneIcon />
                        </div>
                        <div className={styles.secondary_dp_add_desc}>
                            {weatherData?.current?.dew_point && (
                                addDewPointInfo(formatDewPoint(weatherData.current.dew_point))
                            )}
                        </div>
                    </div>
                    {/* Visibility DataPoint */}
                    <div className={styles.visibility_data_point}>
                        <div className={styles.secondary_dp_header}>Visibility</div>
                        <div className={styles.secondary_dp_value}>
                            <span className={styles.large_font}>
                                {weatherData?.current?.visibility && (
                                    formatVisbilityKm(weatherData.current.visibility)
                                )}
                            </span> km
                        </div>
                        <div className={styles.secondary_dp_icon}>
                            <VisibilityTwoToneIcon />
                        </div>
                        <div className={styles.secondary_dp_add_desc}>
                            {weatherData?.current?.visibility && (
                                addVisibilityInfo(weatherData.current.visibility)
                            )}
                        </div>
                    </div>
                    {/* Pressure DataPoint */}
                    <div className={styles.pressure_data_point}>
                    <div className={styles.secondary_dp_header}>Pressure</div>
                        <div className={styles.secondary_dp_value}>
                            <span className={styles.large_font}>
                                {weatherData?.current?.pressure && (
                                    weatherData.current.pressure
                                )}
                            </span> hPa
                        </div>
                        <div className={styles.secondary_dp_icon}>
                            <StormIcon />
                        </div>
                        <div className={styles.secondary_dp_add_desc}>
                            {weatherData?.current?.pressure && (
                                addPressureInfo(weatherData.current.pressure)
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.secondary_header}>6-days Forecast</div>
                <div className={styles.secondary_header}>Weather Condition Map</div>
                <div className={styles.forecast_six_days}>
                    {/* Iterate over each entry */}
                    {forecastTemperatureData.map((forecast, index) => (
                        <React.Fragment key={index}>
                            <div className={styles.forecast_icon}>
                                {forecast?.icon && (
                                    <OpenWeatherIconComponent iconCode={forecast.icon} iconSize={weatherIconSize2x} />
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
                    {(weatherData?.current?.temp && latitudeCoordinate != 0 && longitudeCoordinate != 0 && weatherData?.current?.weather[0]?.icon) ? (
                        <MapComponent 
                            lat={latitudeCoordinate} 
                            lon={longitudeCoordinate} 
                            temperature={formatTemperature(weatherData.current.temp)}
                            location={city}
                            iconCode={weatherData.current.weather[0].icon}
                        />
                    ) : ( <p>Loading...</p> )}
                </div>
            </div>
        </div>
    );
}
