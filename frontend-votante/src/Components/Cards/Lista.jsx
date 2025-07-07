import React from "react";
import classes from "./Lista.module.css";

export default function ListaCard({ lista, partidoColor, isSelected, onClick }) {
    const getTextClass = (hexcolor) => {
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "has-text-black" : "has-text-white";
    };
    console.log("current_list: ", lista)

    const textClass = getTextClass(partidoColor);

    return (
        <div className="column is-4">
            <div
                className={`card ${isSelected ? classes.seleccionado : ""}`}
                style={{
                    backgroundColor: partidoColor,
                    borderRadius: "12px",
                    cursor: "pointer"
                }}
                onClick={() => onClick(lista.id_papeleta, lista)}
            >
                <div className={`card-content ${textClass}`}>
                    <p className={`title is-4 mb-2 ${textClass}`}>
                        Lista {lista.nro}
                    </p>
                    <p className={`subtitle is-6 ${textClass}`}>
                        {lista.nombre_candidato} {lista.apellido_candidato}
                    </p>
                </div>
            </div>
        </div>
    );
}
