import React, {useEffect} from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import classes from './Estadisticas.module.css'; 
import MapaUruguay from './VotosPorDepartamento';
import { fontSize } from '@mui/system';

function Estadisticas() {
    const plebiscitoSí = 500;
    const votosPlebiscito = 700;

    const papeleta = {
        color: "#ffd166",
        text: "Plebiscito",
        descripcion: "Sí por la reforma constitucional",
    };
    
    const getTotal = () => { 
        if (!votosPlebiscito) return 0;
        if (plebiscitoSí > votosPlebiscito) {
            return alert("El número de votos del plebiscito no puede ser menor que el número de votos a favor del plebiscito");
        }
        return (plebiscitoSí) * 100 / votosPlebiscito;
    };

    useEffect(() => {
        const total = getTotal();
        if (total) {
            console.log(`El porcentaje de votos a favor del plebiscito es: ${total}%`);
        }
    }, [plebiscitoSí, votosPlebiscito]);

    return (
        <div className={classes.pageContainer}>
            <p className="title h1 has-text-link ">Estadísticas</p>
            <div className={classes.pageContent}>
                <div className={`${classes.cardPanel}`}>
                    <PieChart
                        series={[
                            {
                            data: [
                                { id: 0, value: 10, label: 'Partido 1', color: '#ef476f' },
                                { id: 1, value: 15, label: 'Partido 2', color: '#ffd166' },
                                { id: 2, value: 20, label: 'Partido 3', color: '#06d6a0' },
                                { id: 3, value: 25, label: 'Partido 4', color: '#118ab2' },
                                { id: 4, value: 30, label: 'Partido 5', color: '#073b4c' },
                            ],
                            highlightScope: { fade: 'global', highlight: 'item'},
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter: (value) => `${value}%`,
                            }
                        ]}
                        width={250}
                        height={200}
                    />
                </div>
                <div className={classes.consultaPanel} style={{ backgroundColor: papeleta.color }}>
                    <p className="title is-1 mt-3" style={{fontSize: '60px'}}>{getTotal().toFixed(2)}%</p>
                    <p className="title is-4 mt-5">{papeleta.text}</p>
                    <p className="subtitle is-6 mt-3">{papeleta.descripcion}</p>
                </div>
                <MapaUruguay className={classes.mapaPanel}/>
            </div>
        </div>
    );
}
export default Estadisticas;
