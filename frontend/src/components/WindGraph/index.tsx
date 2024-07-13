// import React from "react";
import { Line } from 'react-chartjs-2';
import { WindEntry, WindGraphProps } from '@/types/windData';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title,
    Tooltip,
    Legend
);

const WindGraph: React.FC<WindGraphProps> = ({ windData }) => {
    // const times = windData.map(entry => {
    //     // Format time
    //     const hour = parseInt(entry.time.split(':')[0], 10);
    //     return hour;
    // });
    const times = windData.map(entry => {
        // Format time
        const timeParts = entry.time.split(':'); // Split by ":" to get hours, minutes, and seconds
        const formattedTime = `${timeParts[0]}:${timeParts[1]}`;
        return formattedTime;
    });
    const windSpeeds = windData.map((entry:any) => entry.wind.speed);

    const windGraphData = {
        labels: times,
        datasets : [
            {
                label: '',
                data: windSpeeds,
                borderColor: '#A3DCEB',
                backgroundColor: 'rgba(42, 206, 251, 0.1)',
                borderWidth: 2,
                fill: true
            }
        ]
    }

    const options = {
        plugins: {
            legend: {
                display: false // Hide legend
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Speed (m/s)'
                }
            },
            x: {
                title: {
                    display: true
                }
            }
        }
    }

    return <Line options={options} data={windGraphData} />;
};

export default WindGraph;