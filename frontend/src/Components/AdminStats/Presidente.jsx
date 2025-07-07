import React from 'react';
import classes from './Presidente.module.css';

export default function Presidente() {
    const backgroundColor = "#118ab2";
    const textColor = getContrastYIQ(backgroundColor);
    const whiteTextClass = textColor === 'white' ? 'has-text-white' : '';

    return (
        <div className={classes.presidentePanel} style={{ backgroundColor }}>
            <p className={`title is-3 mb-5 ${whiteTextClass}`}>Fórmula ganadora</p>
            <p className={`title is-4 mb-2 ${whiteTextClass}`}>Nombre del Presidente</p>
            <p className={`subtitle is-5 ${whiteTextClass}`}>Nombre del Vicepresidente</p>
            <p className={`subtitle is-6 mt-auto mb-2 ${whiteTextClass}`}>
                Nombre del partido.
            </p>
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