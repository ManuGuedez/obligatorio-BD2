import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export default function useSocketTotem(onHabilitado) {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    // Escucha el evento que emite el backend
    socket.on("votante_habilitado", (data) => {
      // Llama al callback pasado por parámetro
      onHabilitado && onHabilitado(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [onHabilitado]);
}
