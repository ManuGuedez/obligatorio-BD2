import React, {useState, useEffect} from 'react';
import classes from './Estadisticas.module.css'; 
import MapaUruguay from '../../Components/AdminStats/VotosPorDepartamento';
import Presidente from '../../Components/AdminStats/Presidente';
import Tables from '../../Components/AdminStats/Tables';
import Consulta from '../../Components/AdminStats/Consulta';
import PieChartComponent from '../../Components/AdminStats/PieChart';
import adminService from '../../services/adminServices';

function Estadisticas() {
    return (
        <div className={classes.pageContainer}>
            <p className="title h1 has-text-link ">Estadísticas</p>
            <div className={classes.pageContent}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <PieChartComponent />
                    <Tables />
                </div>
                <MapaUruguay className={classes.mapaPanel}/>
            </div>
        </div>
    );
}

export default Estadisticas;
