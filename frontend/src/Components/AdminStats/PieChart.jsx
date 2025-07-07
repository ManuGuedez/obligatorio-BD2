import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import classes from "./PieChart.module.css";
import adminService from "../../services/adminServices";

export default function PieChartComponent() {
    const [chartData, setChartData] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const resultados = await adminService.getResultadosPorPartidoConColor(token);
            console.log("Resultados obtenidos:", resultados);

            const dataTransformada = resultados.map((item, index) => ({
                id: index,
                label: item.texto,
                value: item.votosFavor,
                color: item.color || "#cccccc",
            }));

            console.log("Datos transformados para el gráfico:", dataTransformada);
            setChartData(dataTransformada);
        } catch (error) {
            console.error("Error cargando resultados del gráfico:", error);
        }
    };

    fetchData();
}, []);


    return (
        <div className={classes.cardPanel}>
            <PieChart
                series={[
                    {
                        data: chartData,
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                        valueFormatter: (value) => `${value}%`,
                    },
                ]}
                width={250}
                height={200}
            />
        </div>
    );
}