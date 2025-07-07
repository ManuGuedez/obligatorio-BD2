import React, { useState } from "react";
import styles from "./NuevaLista.module.css";
import ApiService from "../../../services/apiServices";

function NuevaLista({ onClose }) {
  const [formData, setFormData] = useState({
    id_partido: "",
    descripcion: "",
    nro_lista: "",
    id_candidato_apoyado: "",
    id_departamento: ""
  });

  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { id_partido, descripcion, nro_lista, id_candidato_apoyado, id_departamento } = formData;

    if (!id_partido || !descripcion || !nro_lista || !id_candidato_apoyado || !id_departamento) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const payload = {
      id_partido: parseInt(id_partido),
      descripcion: descripcion.trim(),
      nro_lista: parseInt(nro_lista),
      id_candidato_apoyado: parseInt(id_candidato_apoyado),
      id_departamento: parseInt(id_departamento)
    };

    try {
      const response = await ApiService.post("/lista", payload, "application/json", token);
      if (response.code === 200) {
        setSuccess(true);
      } else {
        alert("Error al crear la lista: " + (response.data?.error || "desconocido"));
      }
    } catch (error) {
      console.error("Error en la creación:", error);
      alert("Hubo un problema al crear la lista.");
    }
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modalBox}>
        <h2 className={styles.titulo}>Nueva Lista</h2>
        <input
          type="number"
          name="id_partido"
          placeholder="ID Partido"
          value={formData.id_partido}
          onChange={handleChange}
          disabled={success}
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={success}
        />
        <input
          type="number"
          name="nro_lista"
          placeholder="Número de lista"
          value={formData.nro_lista}
          onChange={handleChange}
          disabled={success}
        />
        <input
          type="number"
          name="id_candidato_apoyado"
          placeholder="ID Candidato Apoyado"
          value={formData.id_candidato_apoyado}
          onChange={handleChange}
          disabled={success}
        />
        <input
          type="number"
          name="id_departamento"
          placeholder="ID Departamento"
          value={formData.id_departamento}
          onChange={handleChange}
          disabled={success}
        />

        {success && (
          <div className={styles.successBox}>Lista creada con éxito</div>
        )}

        {!success && (
          <div className={styles.actions}>
            <button className={styles.botonCancelar} onClick={onClose}>Cancelar</button>
            <button className={styles.botonCrear} onClick={handleSubmit}>Crear</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NuevaLista;
