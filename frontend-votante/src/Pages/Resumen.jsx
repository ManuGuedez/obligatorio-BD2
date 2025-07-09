import React, { useEffect, useState } from "react";
import { useFlujo } from "../Context/FlujoContext";
import { useNavigate } from "react-router-dom";
import votarService from "../Services/votarService";

export default function Resumen() {
  const { respuestas } = useFlujo();
  const navigate = useNavigate();
  console.log("Resumen renderizado", respuestas);
  const [respuesta, setRespuesta] = useState([]);

  // const renderOpcion = (tipo, opcion) => {
  //   console.log("renderOpcion recibido:", tipo);
  //   tipo = respuestas.tipo.tipo
  //   opcion = respuestas.tipo.opcion

  //   console.log("Es un objeto válido", opcion);
  //   if (opcion) {

  //     return (
  //       <div>
  //         <p>
  //           <strong>Lista:</strong> {opcion.nro}
  //         </p>
  //         <p>
  //           <strong>Candidato:</strong> {opcion.candidato}
  //         </p>
  //         <p>
  //           <strong>Partido:</strong> {opcion.partido}
  //         </p>
  //       </div>
  //     );

  //     if ("descripcion" in opcion && "respuesta" in opcion) {
  //       console.log("Es una consulta");
  //       const traduccion =
  //         {
  //           votoLista: "Sí",
  //           votoBlanco: "Voto en Blanco",
  //           votoAnulado: "Voto Anulado",
  //         }[opcion.respuesta] || opcion.respuesta;

  //       return (
  //         <div>
  //           <p>{traduccion}</p>
  //         </div>
  //       );
  //     }
  //   }

  //   console.log("No se pudo interpretar la opción", opcion);
  //   return (
  //     <p>
  //       <strong>Respuesta:</strong> {String(opcion)}
  //     </p>
  //   );
  // };

  // useEffect(() => {
  //   let id_estado = 1;
  //   let es_observado = localStorage.getItem("es_observado");
  //   let nro_circuito = localStorage.getItem("nro_circuito");
  //   let id_papeleta = localStorage.getItem("id_papeleta");
  //   let current_respuesta = [
  //     { id_estado, es_observado, nro_circuito, id_papeleta },
  //   ];
  //   setRespuesta(current_respuesta);
  // }, []);

  const renderOpcion = (tipo, opcion) => {
    if (!opcion)
      return (
        <p>
          <strong>Respuesta:</strong> No definida
        </p>
      );

    if ("respuesta" in opcion) {
      const traduccion =
        {
          votoLista: "Sí",
          votoBlanco: "Voto en Blanco",
          votoAnulado: "Voto Anulado",
        }[opcion.respuesta] || opcion.respuesta;

      return <p>{traduccion}</p>;
    }

    return (
      <div>
        <p>
          <strong>Lista:</strong> {opcion.nro}
        </p>
        <p>
          <strong>Candidato:</strong> {opcion.candidato}
        </p>
        <p>
          <strong>Partido:</strong> {opcion.partido}
        </p>
      </div>
    );
  };

  useEffect(() => {
    const es_observado = parseInt(localStorage.getItem("es_observado") || "0");
    const nro_circuito = parseInt(localStorage.getItem("nro_circuito"));

    const votos = respuestas.map((r) => {
      let id_estado = 1;
      if (r.opcion.respuesta === "votoBlanco") id_estado = 2;
      else if (r.opcion.respuesta === "votoAnulado") id_estado = 3;

      return {
        id_estado,
        es_observado,
        nro_circuito,
        id_papeleta: r.opcion.id_papeleta,
      };
    });

    setRespuesta(votos);
  }, [respuestas]);

  const hayVotoAnulado = false;

  const handleSiguienteClick = async () => {
    console.log("Confirmando votación...");
    console.log(respuesta);
    await votarService.emitirVoto(respuesta);
    // await votarService.emitirVoto(respuestas);
    navigate("/confirmacion");
  };
  console.log("putas respuestas: ", respuestas);
  
  return (
    <div className="section">
      <h1 className="title is-2">Resumen de tu voto</h1>
      <div className="box">
        {hayVotoAnulado ? (
          <div className="has-text-danger">
            <p className="title is-3">Voto Anulado</p>
          </div>
        ) : (
          respuestas.map((r, index) => (
            <div key={`${r.tipo}-${index}`} className="mb-5">
              <h2 className="title is-4 has-text-link">
                {formatearTitulo(r.tipo)}
              </h2>
              {renderOpcion(r.tipo, r.opcion)}
              <hr />
            </div>
          ))
        )}
      </div>
      <button
        className="button is-success is-large is-fullwidth"
        onClick={handleSiguienteClick}
      >
        Confirmar votación
      </button>
    </div>
  );
}

function formatearTitulo(tipo) {
  if (tipo?.startsWith("articulo")) {
    return "Plebiscito Artículo " + tipo.replace("articulo", "");
  }
  if (tipo?.startsWith("ley")) {
    return "Referéndum Ley " + tipo.replace("ley", "");
  }
  if (tipo === "presidencial") return "Votación Presidencial";
  if (tipo === "municipal") return "Votación Municipal";
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}
