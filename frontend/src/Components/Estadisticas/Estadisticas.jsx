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
  Legend,
} from "recharts";
import ApiService from "../../services/apiServices";

export default function Estadisticas() {
  const token = localStorage.getItem("token");

  const [estadisticas, setEstadisticas] = useState({
    totalVotantes: 0,
    votaron: 0,
    votosObservados: 0,
    votosAFavorConsulta: [],
    presidente: "-",
    vicepresidente: "-",
    partido: "-",
    votosPorLista: [], // opcional, si querés más adelante
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get(
          "/circuitos/obtener-resultado-final",
          token
        );
        console.log("Estadísticas:", response.data);

        if (response?.data?.message) {
          setEstadisticas(response.data.message);
        } else {
          console.warn("Respuesta no contiene message:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        if (error.response) {
          console.warn("Respuesta de error:", error.response.data);
        }
      }
    };
    fetchData();
  }, [token]);

  const obtenerListasMasVotadas = (listas) => {
    const maxVotos = Math.max(...listas.map((l) => l.votos));
    return listas.filter((l) => l.votos === maxVotos);
  };

  const noVotaron = estadisticas.totalVotantes - estadisticas.votaron;

  const chartData = {
    participacion: [
      { name: "Votaron", value: estadisticas.votaron, color: "#36A2EB" },
      { name: "No votaron", value: noVotaron, color: "#FF6384" },
    ],
    observados: [
      {
        name: "Votos Observados",
        value: estadisticas.votosObservados,
        color: "#FFCE56",
      },
      {
        name: "Votos Normales",
        value: estadisticas.votaron - estadisticas.votosObservados,
        color: "#4CAF50",
      },
    ],
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
              {estadisticas.votosAFavorConsulta?.[0]?.porcentaje?.toFixed(2) ??
                "0.00"}
              %
            </h3>
            <p className={styles.subtitulo}>Votos por Sí</p>
            <p className={styles.detalle}>
              {estadisticas.votosAFavorConsulta?.[0]?.consulta ?? "Consulta"}
            </p>
          </div>

          <div className={styles.cardNo}>
            <h3 className={styles.valor}>
              {estadisticas.votosAFavorConsulta?.[1]?.porcentaje?.toFixed(2) ??
                "0.00"}
              %
            </h3>
            <p className={styles.subtitulo}>Votos por No</p>
            <p className={styles.detalle}>
              {estadisticas.votosAFavorConsulta?.[1]?.consulta ?? "Consulta"}
            </p>
          </div>

          <div className={styles.cardFormula}>
            {estadisticas.votosPorLista.length > 0 && (
              <div >
                <h2 className={styles.title}>Lista más votada</h2>
                {obtenerListasMasVotadas(estadisticas.votosPorLista).map(
                  (l, i) => (
                    <p key={i}>
                      Lista {l.lista} con {l.votos} voto(s)
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
