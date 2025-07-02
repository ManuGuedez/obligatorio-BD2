import React, {useEffect} from 'react';
import classes from './Consulta.module.css';

export default function Consulta({votosFavor, votosTotal, color, texto, descripcion}) {
    const textColor = getContrastYIQ(color);
    const whiteTextClass = textColor === 'white' ? 'has-text-white' : '';

    const getTotal = () => { 
        if (!votosTotal) return 0;
        if (votosFavor > votosTotal) {
            return alert("Error en la cuenta de votos");
        }
        return (votosFavor) * 100 / votosTotal;
    };

    useEffect(() => {
        getTotal();
    }, [votosFavor, votosTotal]);

    return (
        <div className={classes.consultaPanel} style={{ backgroundColor: color }}>
            <p className={`title is-1 mt-3 ${whiteTextClass}`} style={{fontSize: '60px'}}>{getTotal().toFixed(2)}%</p>
            <p className={`title is-4 ${whiteTextClass}`}>{texto}</p>
            <p className={`subtitle is-6 mt-6 ${whiteTextClass}`}>{descripcion}</p>
        </div>
    );

    function getContrastYIQ(hexcolor) {
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'black' : 'white';
    }
}