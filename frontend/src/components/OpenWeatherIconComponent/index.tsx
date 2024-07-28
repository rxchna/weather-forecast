import React from 'react';
import { WeatherIconProps } from '@/types/weatherIconData';

// Function to retrieve weather icon using OpenWeather icons
const OpenWeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, iconSize }) => {
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}${iconSize ? `@${iconSize}` : ''}.png`;
    return <img src={iconUrl} alt="Weather icon" />;
};

export default OpenWeatherIcon;