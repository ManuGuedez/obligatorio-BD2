import { useEffect } from "react";
import { io } from "socket.io-client";

    const SOCKET_URL = "http://localhost:5000/mesa"; // puerto donde corre el backend

export default function useSocket({ onVotanteHabilitado, onVotoEmitido }) {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("votante_habilitado", (data) => {
      if (onVotanteHabilitado) onVotanteHabilitado(data);
    });

    socket.on("voto_emitido", (data) => {
      if (onVotoEmitido) onVotoEmitido(data);
    });

    return () => socket.disconnect();
  }, [onVotanteHabilitado, onVotoEmitido]);
}