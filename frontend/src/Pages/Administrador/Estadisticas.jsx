import React, { useState, useEffect } from 'react';
import classes from './Estadisticas.module.css';
import PieChartComponent from '../../Components/AdminStats/PieChart';
import miembroService from '../../services/miembroServices';

function Estadisticas() {
  const [stats, setStats] = useState({ total: 0, votados: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Traer todos los ciudadanos del circuito y contar quiénes votaron
    miembroService.getCiudadanos(token)
      .then(ciudadanos => {
        const total = ciudadanos.length;
        const votados = ciudadanos.filter(c => c.voto_realizado).length;
        setStats({ total, votados });
      })
      .catch(err => {
        console.error('Error cargando estadísticas:', err);
        setStats({ total: 0, votados: 0 });
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <p className={classes.loading}>Cargando estadísticas...</p>;
  }

  const { total, votados } = stats;
  const noVotaron = total - votados;

  return (
    <div className={classes.pageContainer}>
      <p className="title h1 has-text-link">Estadísticas</p>
      <div className={classes.pageContent}>
        <PieChartComponent
          data={[
            { votosFavor: votados, votosTotal: total, color: '#06d6a0', texto: 'Votaron' },
            { votosFavor: noVotaron, votosTotal: total, color: '#ef476f', texto: 'Sin votar' },
          ]}
          title="Estado de votación del circuito"
        />

        <div className={classes.resumen}>
          <p><strong>Total de electores:</strong> {total}</p>
          <p><strong>Ya votaron:</strong> {votados}</p>
          <p><strong>Aún no votan:</strong> {noVotaron}</p>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
