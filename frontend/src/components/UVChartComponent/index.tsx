import React from "react";
import { Doughnut } from "react-chartjs-2";
import styles from '../../app/page.module.css';
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

export interface UVEntryProps {
    uvi: number;
}

const UVChart: React.FC<UVEntryProps> = ({ uvi }) => {
    const UVChartData: ChartData<'doughnut'> = {
        datasets: [
            {
                data: [uvi, 12 - uvi], // Max value for uvi is 12
                borderColor: ['#229CFF', 'rgba(42, 206, 251, 0.1)'],
                backgroundColor: ['#229CFF', 'rgba(42, 206, 251, 0.1)'],
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
        cutout: '80%',
    };

    return (
        <div className={styles.doughnut_container}>
            <Doughnut data={UVChartData} options={options} className={styles.uvi_doughnut} />
            <div className={styles.doughnut_scale}>
                {[0, 2, 4, 6, 8, 10, 12].map((value, index) => {
                    const angle = ((index) / 6) * 180 - 179; // Position evenly around half-doughnut
                    const radius = 100;
                    const translateX = Math.cos(angle * (Math.PI / 180)) * radius;
                    const translateY = Math.sin(angle * (Math.PI / 180)) * radius;

                    return (
                        <div key={value} style={{
                            position: 'absolute',
                            left: '50%',
                            top: '100%',
                            transform: `translate(-50%, -50%) translate(${translateX}px, ${translateY}px)`,
                            fontSize: '0.8em',
                            color: '#ccc',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            width: 'auto',
                        }}>
                            {value}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UVChart;
