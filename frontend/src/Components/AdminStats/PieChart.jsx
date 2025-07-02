import React from "react";
import classes from "./PieChart.module.css";
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieChartComponent({ data }) {
    const chartData = data.map((item, index) => ({
        id: index,
        label: item.texto,
        value: item.votosFavor,
        color: item.color,
    }));

    return (
        <div className={classes.cardPanel}>
            <PieChart
                series={[
                    {
                        data: chartData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter: (value) => `${value}%`,
                    },
                ]}
                width={250}
                height={200}
            />
        </div>
    );
}