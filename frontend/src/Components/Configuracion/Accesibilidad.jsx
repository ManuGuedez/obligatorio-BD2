import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const AccesibilidadContext = createContext();

export const useAccesibilidad = () => {
  const context = useContext(AccesibilidadContext);
  if (!context) {
    throw new Error('useAccesibilidad debe ser usado dentro de AccesibilidadProvider');
  }
  return context;
};

export const AccesibilidadProvider = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [letraGrande, setLetraGrande] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);

  // Cargar configuraciones del localStorage al iniciar
  useEffect(() => {
    const savedModoOscuro = localStorage.getItem('modoOscuro') === 'true';
    const savedLetraGrande = localStorage.getItem('letraGrande') === 'true';
    const savedAltoContraste = localStorage.getItem('altoContraste') === 'true';

    setModoOscuro(savedModoOscuro);
    setLetraGrande(savedLetraGrande);
    setAltoContraste(savedAltoContraste);
  }, []);

  // Aplicar clases al body cuando cambien las configuraciones
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Aplicar clases
    body.classList.toggle("modo-oscuro", modoOscuro);
    body.classList.toggle("letra-grande", letraGrande);
    body.classList.toggle("alto-contraste", altoContraste);
    
    html.classList.toggle("modo-oscuro", modoOscuro);
    html.classList.toggle("letra-grande", letraGrande);
    html.classList.toggle("alto-contraste", altoContraste);

    // Guardar en localStorage
    localStorage.setItem('modoOscuro', modoOscuro.toString());
    localStorage.setItem('letraGrande', letraGrande.toString());
    localStorage.setItem('altoContraste', altoContraste.toString());
  }, [modoOscuro, letraGrande, altoContraste]);

  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);
  const toggleLetraGrande = () => setLetraGrande(!letraGrande);
  const toggleAltoContraste = () => setAltoContraste(!altoContraste);

  const value = {
    modoOscuro,
    letraGrande,
    altoContraste,
    toggleModoOscuro,
    toggleLetraGrande,
    toggleAltoContraste
  };

  return (
    <AccesibilidadContext.Provider value={value}>
      {children}
    </AccesibilidadContext.Provider>
  );
};

