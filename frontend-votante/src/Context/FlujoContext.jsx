import React, { createContext, useContext, useState, useEffect } from "react";

const FlujoContext = createContext();

const flujo = [
    { tipo: "inicio" },
    { tipo: "municipal" },
    {
        tipo: "consulta", // consulta 
        id: "articulo11", // id_papeleta
        descripcion: "Plebiscito Artículo 11", // descripcion de papeleta 
        color: "#000000"  //descripcion de color
    },
    {
        tipo: "consulta",
        id: "ley17000",
        descripcion: "Referéndum Ley 17.000",
        color: "#10b981"
    },
    {
        tipo: "consulta",
        id: "articulo20",
        descripcion: "Plebiscito Artículo 20",
        color: "#3b82f6"
    },
    { tipo: "resumen" },
    { tipo: "confirmacion" },
];


export function FlujoProvider({ children }) {
    const [etapaActual, setEtapaActual] = useState(0);
    const [respuestas, setRespuestas] = useState([]);

    const etapa = flujo[etapaActual];

    // cambiar
    const guardarVoto = (id_papeleta) => {
        let nro_circuito = localStorage.getItem("nro_circuito");
        let es_observado = localStorage.getItem("es_observado");

        // no guardar voto en blanco del plebicito / referendum cuando votas 

        const clave = etapa.id || etapa.tipo;
        //console.log("id_estado", id_estado)
        console.log("id_papeleta", id_papeleta)
        setRespuestas((prev) => [
        ...prev.filter((r) => r.id !== id_papeleta),
        { id_estado: 1, id_papeleta }
        ]);
    };

    const reset = () => {
        setEtapaActual(0);
        setRespuestas([]);
        localStorage.removeItem("etapaActual");
        localStorage.removeItem("ci_ciudadano");
    };

    useEffect(() => {
        const saved = localStorage.getItem("etapaActual");
        if (saved !== null) {
            setEtapaActual(parseInt(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("etapaActual", etapaActual);
        console.log("Etapa actual guardada:", etapaActual);
    }, [etapaActual]);

    const limpiarRespuestas = () => {
        setRespuestas([]);
    };

    const siguiente = () => {
        let nextStep = null;
        if (etapaActual + 1 < flujo.length) {
            nextStep = flujo[etapaActual + 1];
        }
        setEtapaActual((prev) => {
            if (prev + 1 < flujo.length) {
                nextStep = flujo[prev + 1];
                return prev + 1;
            }
            return prev;
        });
        return nextStep;
    };


    const anterior = () => {
        let prevStep = flujo[0];
        setEtapaActual((prev) => {
            if (prev > 0) {
                prevStep = flujo[prev - 1];
                return prev - 1;
            }
            return prev;
        });

        return prevStep;
    };

    return (
        <FlujoContext.Provider
        value={{
            etapa,
            etapaActual,
            flujo,
            guardarVoto,
            siguiente,
            anterior,
            reset,
            respuestas,
            limpiarRespuestas
        }}
        >
        {children}
        </FlujoContext.Provider>
    );
    }

    export function useFlujo() {
    return useContext(FlujoContext);
}