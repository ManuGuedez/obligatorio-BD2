import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeMiembroMesa.css";
import PersonaModal from "../Components/PersonaModal";
import ConfirmarCierreModal from "../Components/Modals/ConfirmarCierreMesa/ConfirmarCierreModal.jsx";

function MiembroMesa() {
  const [serie, setSerie] = useState("");
  const [numero, setNumero] = useState("");
  const [persona, setPersona] = useState(null);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [circuitoAbierto, setCircuitoAbierto] = useState(false);
  const navigate = useNavigate();

  // Abrir circuito
  const handleAbrirCircuito = () => {
    setCircuitoAbierto(true);
    alert("Circuito abierto");
  };

  // Función que simula búsqueda solo si circuito abierto
  const handleSearch = () => {
    if (!circuitoAbierto) {
      alert("Debes abrir el circuito antes de buscar personas.");
      return;
    }
    console.log("Búsqueda con Serie:", serie, "y Número:", numero);
    if (numero === "1234" && serie === "abc") {
      setPersona({ nombre: "Juan Pérez", ci: "1234" });
      setIsPersonaOpen(true);
    } else {
      alert("Persona no encontrada.");
    }
  };

  // Confirmar cierre circuito
  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setCircuitoAbierto(false);
    setPersona(null);
    console.log("Circuito cerrado");
    navigate("/Estadisticas");
  };

  return (
    <div className="miembro-mesa">
      <div className="miembro-mesa-wrapper">
        <h1>Miembro de Mesa</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="Credencial serie"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
            className="login-input"
            disabled={!circuitoAbierto}  // deshabilita si circuito cerrado
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Credencial número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="login-input"
            disabled={!circuitoAbierto}
          />
        </div>

        <button
          onClick={handleSearch}
          className="login-button"
          disabled={!circuitoAbierto}
        >
          Buscar Persona
        </button>

        {!circuitoAbierto ? (
          <button onClick={handleAbrirCircuito} className="login-button" style={{marginTop:"10px"}}>
            Abrir circuito
          </button>
        ) : (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="login-button"
            style={{ marginTop: "10px", backgroundColor: "#660000" }}
          >
            Cerrar circuito
          </button>
        )}

        {/* Modales */}
        {isPersonaOpen && persona && (
          <PersonaModal
            persona={persona}
            onClose={() => setIsPersonaOpen(false)}
          />
        )}

        {isConfirmOpen && (
          <ConfirmarCierreModal
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default MiembroMesa;
