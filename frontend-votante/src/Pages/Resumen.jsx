import React from "react";
import { useFlujo } from "../Context/FlujoContext";

export default function Resumen() {
    const { respuestas } = useFlujo();
    console.log("Resumen renderizado", respuestas);

const renderOpcion = (tipo, opcion) => {
    console.log("renderOpcion recibido:", { tipo, opcion });

    if (typeof opcion === "object" && opcion !== null) {
        console.log("Es un objeto válido");

        if ("nro" in opcion && "candidato" in opcion) {
            console.log("Es una lista");
            return (
                <div>
                    <p><strong>Lista:</strong> {opcion.nro}</p>
                    <p><strong>Candidato:</strong> {opcion.candidato}</p>
                    <p><strong>Partido:</strong> {opcion.partido}</p>
                </div>
            );
        }

        if ("descripcion" in opcion && "respuesta" in opcion) {
            console.log("Es una consulta");
            const traduccion = {
                votoLista: "Sí",
                votoBlanco: "Voto en Blanco",
                votoAnulado: "Voto Anulado"
            }[opcion.respuesta] || opcion.respuesta;

            return (
                <div>
                    <p><strong>Pregunta:</strong> {opcion.descripcion}</p>
                    <p><strong>Respuesta:</strong> {traduccion}</p>
                </div>
            );
        }
    }

    console.log("No se pudo interpretar la opción", opcion);
    return <p><strong>Respuesta:</strong> {String(opcion)}</p>;
};



    return (
        <div className="section">
        <h1 className="title is-2">Resumen de tu voto</h1>
        <div className="box">
            {respuestas.map((r, index) => (
                <div key={`${r.tipo}-${index}`} className="mb-5">
                <h2 className="title is-4 has-text-link">
                {formatearTitulo(r.tipo)}
                </h2>
                {renderOpcion(r.tipo, r.opcion)}
                <hr />
            </div>
            ))}
        </div>
        <button className="button is-success is-large is-fullwidth">
            Confirmar votación
        </button>
        </div>
    );
    }

    function formatearTitulo(tipo)  {
    if (tipo.startsWith("articulo")) {
        return "Plebiscito Artículo " + tipo.replace("articulo", "");
    }
    if (tipo.startsWith("ley")) {
        return "Referéndum Ley " + tipo.replace("ley", "");
    }
    if (tipo === "presidencial") return "Votación Presidencial";
    if (tipo === "municipal") return "Votación Municipal";
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}
