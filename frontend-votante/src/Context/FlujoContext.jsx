import React, { createContext, useContext, useState, useEffect } from "react";

const FlujoContext = createContext();

const flujo = [
    { tipo: "presidencial" },
    {
        tipo: "consulta",
        id: "articulo11",
        descripcion: "Plebiscito Artículo 11",
        color: "#000000"
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
    { tipo: "municipal" },
    { tipo: "resumen" }
];


export function FlujoProvider({ children }) {
    const [etapaActual, setEtapaActual] = useState(0);
    const [respuestas, setRespuestas] = useState([]);

    const etapa = flujo[etapaActual];

    const guardarVoto = (opcion) => {
        const clave = etapa.id || etapa.tipo;
        setRespuestas((prev) => [
        ...prev.filter((r) => r.tipo !== clave),
        { tipo: clave, opcion }
        ]);
    };

    const reset = () => {
        setEtapaActual(0);
        setRespuestas([]);
        localStorage.removeItem("etapaActual");
    };

    useEffect(() => {
        const saved = localStorage.getItem("etapaActual");
        if (saved !== null) {
            setEtapaActual(parseInt(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("etapaActual", etapaActual);
    }, [etapaActual]);


    const siguiente = () => {
        if (etapaActual + 1 < flujo.length) {
        setEtapaActual((prev) => prev + 1);
        return flujo[etapaActual + 1];
        }
        return { tipo: "resumen" };
    };

    const anterior = () => {
        if (etapaActual > 0) {
        setEtapaActual((prev) => prev - 1);
        }
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
            respuestas
        }}
        >
        {children}
        </FlujoContext.Provider>
    );
    }

    export function useFlujo() {
    return useContext(FlujoContext);
}