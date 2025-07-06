import React, { useState, useEffect } from "react";
import styles from "./Estadisticas.module.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend
} from "recharts";
import ApiService from "../../services/apiServices";

export default function Estadisticas() {
  
  const [info, setInfo] = useState(null);

  // Fetch estadísticas al montar
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ApiService.get("/estadisticas", token);
        setInfo(response.message);
        console.log("Estadísticas recibidas:", response.message);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    fetchStats();
  }, []);

  // Datos de ejemplo mientras carga
  const data = info ?? {
    totalVotantes: 0,
    votaron: 0,
    votosPorLista: [],
    votosObservados: 0
  };

  const noVotaron = data.totalVotantes - data.votaron;
  const chartData = {
    participacion: [
      { name: "Votaron", value: data.votaron, color: "#36A2EB" },
      { name: "No votaron", value: noVotaron, color: "#FF6384" }
    ],
    observados: [
      { name: "Votos Observados", value: data.votosObservados, color: "#FFCE56" },
      { name: "Votos Normales", value: data.votaron - data.votosObservados, color: "#4CAF50" }
    ]
  };

  const renderPieChart = (data, title) => (
    <div className={styles.cardSmall}>
      <h2 className={styles.title}>{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.finWrapper}>
        <button className={styles.botonFin}>Fin Jornada</button>
      </div>
      <div className={styles.container}>
        {renderPieChart(chartData.participacion, "Participación")}

        <div className={styles.cardSmall}>
          <h2 className={styles.title}>Distribución por Lista</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.votosPorLista}>
              <XAxis dataKey="lista" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="votos" fill="#36A2EB" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.cardSmall}>
          <h2 className={styles.title}>Votos Observados</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData.observados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {chartData.observados.map((entry, index) => (
                  <Cell key={`cell-obs-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.votosOpcionesRow}>
          <div className={styles.cardSi}>
            <h3 className={styles.valor}>
              {data.votosAFavorConsulta?.[0]?.porcentaje.toFixed(2) ?? "0.00"}%
            </h3>
            <p className={styles.subtitulo}>Votos por Sí</p>
            <p className={styles.detalle}>
              {data.votosAFavorConsulta?.[0]?.consulta ?? "Consulta"
            }</p>
          </div>
          <div className={styles.cardNo}>
            <h3 className={styles.valor}>
              {data.votosAFavorConsulta?.[1]?.porcentaje.toFixed(2) ?? "0.00"}%
            </h3>
            <p className={styles.subtitulo}>Votos por No</p>
            <p className={styles.detalle}>
              {data.votosAFavorConsulta?.[1]?.consulta ?? "Consulta"
            }</p>
          </div>
          <div className={styles.cardFormula}>
            <h3 className={styles.subtitulo}>Fórmula ganadora</h3>
            <p className={styles.valor}>{data.message?.presidente ?? "-"}</p>
            <p className={styles.detalle}>{data.message?.vicepresidente ?? "-"}</p>
            <p className={styles.detalleSecundario}>
              {data.message?.partido ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
