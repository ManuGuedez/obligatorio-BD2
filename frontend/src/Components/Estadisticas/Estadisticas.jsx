import React from "react";
import styles from "./Estadisticas.module.css";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const Estadisticas = ({ data }) => {
  const ejemplo = {
    totalVotantes: 100,
    votaron: 72,
    votosPorLista: [
      { lista: "Lista 1", votos: 25 },
      { lista: "Lista 2", votos: 30 },
      { lista: "Lista 3", votos: 17 },
    ],
    votosObservados: 5
  };

  const info = data || ejemplo;
  const noVotaron = info.totalVotantes - info.votaron;

  const chartData = {
    participacion: [
      { name: "Votaron", value: info.votaron, color: "#36A2EB" },
      { name: "No votaron", value: noVotaron, color: "#FF6384" },
    ],
    observados: [
      { name: "Votos Observados", value: info.votosObservados, color: "#FFCE56" },
      { name: "Votos Normales", value: info.votaron - info.votosObservados, color: "#4CAF50" },
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
            <BarChart data={info.votosPorLista}>
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
            <h3 className={styles.valor}>30.00%</h3>
            <p className={styles.subtitulo}>Votos por Sí</p>
            <p className={styles.detalle}>(Reforma Artículo 11)</p>
          </div>
          <div className={styles.cardNo}>
            <h3 className={styles.valor}>20.00%</h3>
            <p className={styles.subtitulo}>Votos por No</p>
            <p className={styles.detalle}>(Referéndum Ley 17.111)</p>
          </div>
          <div className={styles.cardFormula}>
            <h3 className={styles.subtitulo}>Fórmula ganadora</h3>
            <p className={styles.valor}>Nombre del Presidente</p>
            <p className={styles.detalle}>Nombre del Vicepresidente</p>
            <p className={styles.detalleSecundario}>Nombre del partido</p>
          </div>
        </div>



      </div>
    </div>
  );
};

export default Estadisticas;
