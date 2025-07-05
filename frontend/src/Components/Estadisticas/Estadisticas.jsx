import React from "react";
import styles from "./Estadisticas.module.css";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"];

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

  const votacionData = [
    { name: "Votaron", value: info.votaron },
    { name: "No votaron", value: noVotaron },
  ];

  const observadosData = [
    { name: "Votos Observados", value: info.votosObservados },
    { name: "Votos Normales", value: info.votaron - info.votosObservados },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Participación</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={votacionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {votacionData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Distribución por Lista</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={info.votosPorLista}>
            <XAxis dataKey="lista" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="votos" fill="#36A2EB" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`${styles.card} ${styles.fullWidth}`}>
        <h2 className={styles.title}>Votos Observados</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={observadosData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {observadosData.map((_, index) => (
                <Cell key={`cell-obs-${index}`} fill={COLORS[index + 2]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Estadisticas;
