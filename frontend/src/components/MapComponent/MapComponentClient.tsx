import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from '../../app/page.module.css';

interface MapComponentClientProps {
    lat: number;
    lon: number;
    temperature: string;
    location: string;
    iconCode: string;
}

// Function to display custom icon
const customAmChartsAnimatedIcon = (iconCode: string) => {
    let iconUrl = `/assets/amcharts_icons/`;

    // Display different icons on different iconCode (animated icons source: https://www.amcharts.com/free-animated-svg-weather-icons/)
    switch(iconCode) {
        case "01d":
            return `${iconUrl}sunny.svg`; 
        
        case "01n":
            return `${iconUrl}clear_night.svg`;

        case "02d":
        case "03d":
        case "04d":
            return `${iconUrl}cloudy-day-1.svg`;

        case "02n":
        case "03n":
        case "04n":
            return `${iconUrl}cloudy-night.svg`;
        
        case "50d":
        case "50n":
            return `${iconUrl}cloudy.svg`;

        case "09d":
        case "09n":
        case "10n":
            return `${iconUrl}shower_rain.svg`;

        case "10d":
            return `${iconUrl}day_rain.svg`;

        case "11d":
        case "11n":
            return `${iconUrl}thunder.svg`;

        case "13d":
        case "13n":
            return `${iconUrl}snow.svg`;

        default:
            return `${iconUrl}sunny.svg`;
    };
};

// Function to create a custom marker with temperature
const createCustomMarker = (temperature: string, location: string, iconUrl: string) => {
    // Create an HTML element to embed weather icon, location and temperature
    const markerDiv = L.divIcon({
        className: `${styles.custom_marker}`,
        html: `
            <div class="${styles.custom_marker_div}">
                <div>${location}</div>
                <img src="${iconUrl}" alt="Weather icon"/>
                <div>${temperature}</div>
            </div>`,
        iconSize: [100, 60]
    });

    return markerDiv;
};

const MapComponentClient: React.FC<MapComponentClientProps> = ({ lat, lon, temperature, location, iconCode }) => {

    const iconUrl = customAmChartsAnimatedIcon(iconCode);
    const customMarker = createCustomMarker(temperature, location, iconUrl);

    return (
        <MapContainer 
            center={[lat, lon]} 
            zoom={14}
            className={styles.map_container}
            key={`${lat}-${lon}`}>
            <TileLayer
                // url={`https://tiles-eu.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png`}
                url={`https://api.mapbox.com/styles/v1/rxchna/clys5l1tn002001p97u3k6642/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnhjaG5hIiwiYSI6ImNseXM1M2J6ODBkdDAyanE3bzl0b28yZG8ifQ.S6O5secIVW2DLcZkHrol9w`}
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[lat, lon]} icon={customMarker}>
                <Popup>
                    <strong>Temperature:</strong> {temperature}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponentClient;
