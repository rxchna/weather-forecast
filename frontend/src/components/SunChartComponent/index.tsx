import React from "react";
import { Doughnut } from "react-chartjs-2";
import styles from '../../app/page.module.css';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

export interface SunDataEntryProps {
    sunrise: number;
    sunset: number;
    current_time: string;
}

// Function to calculate current position of the sun relative to sunrise and sunset
const getCurrentPosition = (current_time: string, sunrise: number, sunset: number) => { 
    let sunrise_to_current_range = 0;
    let current_to_sunset_range = 0;

    // Get the Unix timestamp for the current date and time
    const currentUnixTimeStamp = Math.floor((new Date(current_time)).getTime() / 1000);

    console.log("Current time stamp: ", currentUnixTimeStamp);
    console.log("Sunrise: ", sunrise);
    console.log("Sunset: ", sunset);

    // If current_time <= sunrise, range is [ 0, sunset ]
    if (currentUnixTimeStamp <= sunrise) {
        sunrise_to_current_range = 0;
        current_to_sunset_range = sunset;
    }
    // If current_time >= sunset, range is [ sunset, 0 ]
    else if (currentUnixTimeStamp >= sunset) {
        sunrise_to_current_range = sunset;
        current_to_sunset_range = 0;
    }
    else {
        // Calculate ranges for current time relative to sunrise + current time relative to sunset
        sunrise_to_current_range = currentUnixTimeStamp - sunrise;
        current_to_sunset_range = sunset - currentUnixTimeStamp;
    }

    return { sunrise_to_current_range, current_to_sunset_range };
}

// Function to convert unixTimeStamp to AM/PM
const convertTimeAMPM = (unixTimeStamp: number) => {
    const date = new Date(unixTimeStamp * 1000); // Convert Unix timestamp to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

const SunChart: React.FC<SunDataEntryProps> = ({ sunrise, sunset, current_time }) => {

    const sunriseTime = convertTimeAMPM(sunrise);
    const sunsetTime = convertTimeAMPM(sunset);
    const { sunrise_to_current_range, current_to_sunset_range } = getCurrentPosition(current_time, sunrise, sunset);
    
    const sunchartData: ChartData<'doughnut'> = {
        datasets: [
            {
                data: [sunrise_to_current_range, current_to_sunset_range],
                borderColor: ['#FFC62E', '#ffffff55'],
                backgroundColor: ['#FFC62E', '#ffffff55'],
                circumference: 180,
                rotation: 270,
            }
        ]
    };

    const options: ChartOptions<'doughnut'> = {
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        cutout: '95%',
    };

    return (
        <div className={styles.sun_doughnut_container}>
            <Doughnut data={sunchartData} options={options} className={styles.sun_doughnut} />
            <hr/>
            <div className={styles.doughnut_sunrise_sunset_data}>
                <div className={styles.sun_desc_container}>
                    <WbTwilightIcon className={styles.sunrise_set_icon} />
                    <div className={styles.sun_time_title}>Sunrise</div>
                    <div>{sunriseTime}</div>
                </div>
                <div className={styles.sun_desc_container}>
                    <WbTwilightIcon className={styles.sunrise_set_icon} />
                    <div className={styles.sun_time_title}>Sunset</div>
                    <div>{sunsetTime}</div>
                </div>
            </div>
        </div>
    );
};

export default SunChart;

