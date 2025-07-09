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
                value: item.votosFavor * 100 / item.votosTotal,
                color: item.color || "#cccccc",
            }));
            setChartData(dataTransformada);
        } catch (error) {
            console.error("Error cargando resultados del gráfico:", error);
        }
    };

    fetchData();
}, []);


    return (
        <div className={classes.cardPanel}>
            <div>
                <PieChart
                    series={[
                        {
                            data: chartData,
                            highlightScope: { fade: "global", highlight: "item" },
                            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                            valueFormatter: ({ value }) => `${value}%`,
                        },
                    ]}
                    width={200}
                    height={200}
                    hideLegend={true}
                />
            </div>
            <div style={{ maxHeight: 200, overflowY: "auto", width: 120}}>
                {chartData.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: 5}}>
                        <div
                            style={{
                            width: 14,
                            height: 14,
                            borderRadius: 100,
                            backgroundColor: item.color,
                            marginRight: 8,
                            border: "1px solid #ccc"
                            }}
                        />
                        <span style={{ fontSize: "1rem", color: "#333"}}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}