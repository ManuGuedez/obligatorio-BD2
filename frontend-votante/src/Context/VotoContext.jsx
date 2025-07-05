import React, { createContext, useContext, useState } from "react";

const VotoContext = createContext();

export function VotoProvider({ children }) {
    const [respuestas, setRespuestas] = useState([]);

    const guardarVoto = (consultaId, descripcion, eleccion) => {
        setRespuestas((prev) => [
        ...prev.filter((r) => r.consultaId !== consultaId),
        { consultaId, descripcion, eleccion }
        ]);
    };

    return (
        <VotoContext.Provider value={{ respuestas, guardarVoto }}>
        {children}
        </VotoContext.Provider>
    );
}

export function useVoto() {
    return useContext(VotoContext);
}
