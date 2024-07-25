import React from "react";
import { Line } from 'react-chartjs-2';
import { WindGraphProps } from '@/types/windData';
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
    const windSpeeds = windData.slice();

    // Generate x-axis labels from 0 to 23
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const windGraphData = {
        labels: hours,
        datasets: [
            {
                label: 'Speed (m/s)',
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
                    display: false
                }
            },
            x: {
                display: false
            }
        }
    }

    return <Line options={options} data={windGraphData} />;
};

export default WindGraph;