import React from "react";
import classes from "./Consulta.module.css";

export default function ConsultaCard({ descripcion, color, isSelected, onClick }) {
    return (
        <div
        className={`${classes.card} ${isSelected ? classes.seleccionado : ""}`}
        style={{ backgroundColor: color }}
        onClick={onClick}
        >
        <p className="title is-1 has-text-white">{descripcion}</p>
        </div>
    );
}
