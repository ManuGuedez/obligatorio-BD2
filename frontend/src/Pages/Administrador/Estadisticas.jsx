import React, {useEffect} from 'react';
import classes from './Estadisticas.module.css'; 
import MapaUruguay from '../../Components/AdminStats/VotosPorDepartamento';
import Presidente from '../../Components/AdminStats/Presidente';
import Tables from '../../Components/AdminStats/Tables';
import Consulta from '../../Components/AdminStats/Consulta';
import PieChartComponent from '../../Components/AdminStats/PieChart';

function Estadisticas() {
    return (
        <div className={classes.pageContainer}>
            <p className="title h1 has-text-link ">Estadísticas</p>
            <div className={classes.pageContent}>
                <PieChartComponent 
                    data={[
                        { votosFavor: 300, votosTotal: 1000, color: '#ef476f', texto: 'Partido 1' },
                        { votosFavor: 200, votosTotal: 1000, color: '#ffd166', texto: 'Partido 2' },
                        { votosFavor: 500, votosTotal: 1000, color: '#06d6a0', texto: 'Partido 3' },
                        { votosFavor: 400, votosTotal: 1000, color: '#118ab2', texto: 'Partido 4' },
                        { votosFavor: 100, votosTotal: 1000, color: '#073b4c', texto: 'Partido 5' }
                    ]}
                    title="Distribución de Votos por Partido"
                />
                <Consulta votosFavor={300} votosTotal={1000} color="#ef476f" texto="Votos por Sí" descripcion="Plebiscito Artículo 11"/>
                <Consulta votosFavor={200} votosTotal={1000} color="#023047" texto="Votos por No" descripcion="Referéndum Ley 11.111"/>
                <Presidente className={classes.presidentePanel}/>
                <MapaUruguay className={classes.mapaPanel}/>
                <Tables reportsArray={[
                    [
                        { lista: 'Lista 1', partido: 'Partido A', votos: 300, porcentaje: '30%' },
                        { lista: 'Lista 2', partido: 'Partido B', votos: 200, porcentaje: '20%' },
                    ],
                    [
                        { partido: 'Partido A', votos: 300, porcentaje: '30%' },
                        { partido: 'Partido B', votos: 200, porcentaje: '20%' },
                    ],
                    [
                        { partido: 'Partido A', candidato: 'Candidato 1', votos: 150, porcentaje: '15%' },
                        { partido: 'Partido B', candidato: 'Candidato 2', votos: 100, porcentaje: '10%' },
                        { partido: 'Partido C', candidato: 'Candidato 3', votos: 50, porcentaje: '5%' },
                        { partido: 'Partido D', candidato: 'Candidato 4', votos: 200, porcentaje: '20%' },
                        { partido: 'Partido E', candidato: 'Candidato 5', votos: 250, porcentaje: '25%' },
                        { partido: 'Partido F', candidato: 'Candidato 6', votos: 100, porcentaje: '10%' },
                        { partido: 'Partido G', candidato: 'Candidato 7', votos: 50, porcentaje: '5%' },
                        { partido: 'Partido H', candidato: 'Candidato 8', votos: 50, porcentaje: '5%' },
                    ]
                ]}/>
            </div>
        </div>
    );
}
export default Estadisticas;
