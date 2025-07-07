import React, { createContext, useContext, useState, useEffect } from "react";

const FlujoContext = createContext();

const flujo = [
    { tipo: "inicio" },
    { tipo: "municipal" },
    { tipo: "resumen" },
    { tipo: "confirmacion" },
];


export function FlujoProvider({ children }) {
    const [etapaActual, setEtapaActual] = useState(0);
    const [respuestas, setRespuestas] = useState([]);

    const etapa = flujo[etapaActual];

    // cambiar
    const guardarVoto = (tipo, opcion) => {
        setRespuestas(//(prev) => [
      //  ...prev.filter((r) => r.tipo !== tipo),
        { tipo, opcion }
        );
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