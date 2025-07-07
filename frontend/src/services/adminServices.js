import ApiService from "./apiServices";

const adminService = {
    getEstablecimientos: async (token) => {
        try {
            const response = await ApiService.get("/establecimientos", token);
            console.log("Establecimientos fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching establecimientos:", error);
            throw error;
        }
    },

    crearCircuito: async (token, numero, accesible, establecimiento) => {
        try {
            console.log("Creando circuito:", numero, accesible, establecimiento);
            const response = await ApiService.post("/circuitos", { nro: numero, es_accesible: accesible, id_establecimiento: establecimiento },"application/json", token);
            console.log("Circuito creado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando circuito:", error);
            throw error;
        }
    },

    getCircuitos: async (token) => {
        try {
            const response = await ApiService.get("/circuitos", token);
            console.log("Circuitos fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching circuitos:", error);
            throw error;
        }
    },

    getCircuitoById: async (token, id) => {
        try {
            const response = await ApiService.get(`/circuitos/${id}`, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching circuito by ID:", error);
            throw error;
        }
    },

    updateCircuito: async (token, nro, accesible, establecimientoId) => {
        try {
            const data = {
            es_accesible: accesible === "true" || accesible === true, // por si viene como string
            id_establecimiento: establecimientoId,
            };

            const response = await ApiService.patch(`circuitos/${nro}`, data, token);
            console.log("Circuito actualizado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error actualizando circuito:", error);
            throw error;
        }
    },

    bulkAddCircuitos: async (token, file) => {
        const formData = new FormData();
        formData.append("file", file);

        return await ApiService.uploadFile("circuitos/bulk", formData, token);
    },

    getCiudadanoByCi: async (token, ci) => {
        try {
            const response = await ApiService.get(`/ciudadano/get-by-ci/${ci}`, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching ciudadano by CI:", error);
            throw error;
        }
    },

    updateCiudadano: async (token, ci, nombre, apellido, serie, numero, circuito) => {
        try {
            const data = {
                ...(nombre !== undefined && { nombre }),
                ...(apellido !== undefined && { apellido }),
                ...(serie !== undefined && { serie_credencial: serie }),
                ...(numero !== undefined && { nro_credencial: numero }),
                ...(circuito !== undefined && { nro_circuito: circuito }),
            };

            const response = await ApiService.patch(`ciudadano/${ci}`, data, token);

            // Si ApiService.patch lanza en caso de error, no necesitás chequear .ok
            console.log("Ciudadano actualizado:", response);
            return response;
        } catch (error) {
            console.error("Error actualizando ciudadano:", error);
            throw error;
        }
    },

    crearCiudadano: async (token, ci, nombre, apellido, serie, numero, circuito) => {
        try {
            console.log("Creando ciudadano:", ci, nombre, apellido, serie, numero, circuito);
            const response = await ApiService.post("/ciudadano", { ci: ci, nombre: nombre, apellido: apellido, serie_credencial: serie, nro_credencial: numero, nro_circuito: circuito },"application/json", token);
            console.log("Ciudadano creado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando ciudadano:", error);
            throw error;
        }
    },

    crearCandidato: async (token, ci) => {
        try {
            console.log("Creando candidato:", ci);
            const response = await ApiService.post("/candidatos", { ci_ciudadano: ci },"application/json", token);
            console.log("Candidato creado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando candidato:", error);
            throw error;
        }
    },

    getResultadosPorLista: async (token, circuito = null) => {
        try {
            console.log("Fetching resultados por lista con circuito:", circuito);
            const url = circuito
                ? `resultados/listas?nro_circuito=${circuito}`
                : `resultados/listas`;
            const response = await ApiService.get(url, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching resultados por lista:", error);
            throw error;
        }
    },

    getResultadosPorPartido: async (token, circuito = null) => {
        try {
            console.log("Fetching resultados por partido con circuito:", circuito);
            const url = circuito
                ? `resultados/partido?nro_circuito=${circuito}`
                : `resultados/partido`;
            const response = await ApiService.get(url, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching resultados por partido:", error);
            throw error;
        }
    },

    getResultadosPorPartidoConColor: async (token, circuito = null) => {
        try {
            console.log("Fetching resultados por partido con color. Circuito:", circuito);
            const url = circuito
                ? `resultados/partido-color?nro_circuito=${circuito}`
                : `resultados/partido-color`;

            const response = await ApiService.get(url, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching resultados por partido con color:", error);
            throw error;
        }
    },


    getResultadosPorCandidato: async (token, circuito = null) => {
        try {
            console.log("Fetching resultados por candidato con circuito:", circuito);
            const url = circuito
                ? `resultados/candidato?nro_circuito=${circuito}`
                : `resultados/candidato`;
            const response = await ApiService.get(url, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching resultados por candidato:", error);
            throw error;
        }
    },

    getComisarias: async (token) => {
        try {
            const response = await ApiService.get("/comisarias", token);
            console.log("Comisarías fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching comisarías:", error);
            throw error;
        }
    },

    getOrganismoPublico: async (token) => {
        try {
            const response = await ApiService.get("/organismo-publico", token);
            console.log("Organismo público fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching organismos:", error);
            throw error;
        }
    },

    crearPolicia: async (token, ci, comisaria, establecimiento) => {
        try {
            console.log("Creando policía:", ci, comisaria, establecimiento);
            const response = await ApiService.post("/police", { ci_ciudadano: ci, id_comisaria: comisaria, id_establecimiento: establecimiento },"application/json", token);
            console.log("Policía creado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando circuito:", error);
            throw error;
        }
    },

    getPoliciaByCi: async (token, ci) => {
        try {
            const response = await ApiService.get(`/police/${ci}`, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching policia by CI:", error);
            throw error;
        }
    },

    updatePolicia: async (token, id, data) => {
        try {
            const response = await ApiService.patch(`police/${id}`, data, token);
            if (response.code !== 200 && response.code !== 204) {
            throw new Error("No se pudo actualizar el policía");
            }
            console.log("Policía actualizado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error actualizando policía:", error);
            throw error;
        }
    },

    crearPartido: async (token, partidoData) => {
        try {
            console.log("Creando partido:", partidoData);
            const response = await ApiService.post(
            "/partido-politico",
            {
                nombre: partidoData.nombre,
                calle: partidoData.calle,
                numero: Number(partidoData.numero),
                telefono: partidoData.telefono,
                codigo_postal: Number(partidoData.codPostal),
                ci_presidente: Number(partidoData.ci_presidente),
                ci_vicepresidente: Number(partidoData.ci_vicepresidente),
                color: partidoData.color,
            },
            "application/json",
            token
            );

            console.log("Partido creado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando partido:", error);
            throw error;
        }
    },

    deleteCiudadano: async (token, ci) => {
        try {
            const response = await ApiService.delete(`ciudadano/${ci}`, token);
            if (response.code !== 200) {
            throw new Error(response.data?.error || "No se pudo eliminar el ciudadano");
            }
            console.log("Ciudadano eliminado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error eliminando ciudadano:", error);
            throw error;
        }
    },

    deleteCircuito: async (token, nro) => {
        try {
            const response = await ApiService.delete(`circuitos/${nro}`, token);
            if (response.code !== 200) {
            throw new Error(response.data?.error || "No se pudo eliminar el circuito");
            }
            console.log("Circuito eliminado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error eliminando circuito:", error);
            throw error;
        }
    },

    getOrganismosPublicos: async (token) => {
        try {
            const response = await ApiService.get("/organismo-publico", token);
            console.log("Organismos fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching organismos:", error);
            throw error;
        }
    },

    getRoles: async (token) => {
        try {
            const response = await ApiService.get("/miembro/roles", token);
            console.log("Roles fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    },

    agregarMiembro: async (token, data) => {
        try {
            const response = await ApiService.post(
            "/miembro",
            {
                id_organismo: data.id_organismo,
                ci: data.ci,
                nro_circuito: data.nro_circuito,
                id_rol: data.id_rol,
            },
            "application/json",
            token
            );

            console.log("Miembro agregado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error agregando miembro:", error);
            throw error;
        }
    },

    getMiembroByCi: async (token, ci) => {
        try {
            const response = await ApiService.get(`/miembro/${ci}`, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching policia by CI:", error);
            throw error;
        }
    },

    updateMiembro: async (token, idMiembro, data) => {
        try {
            const response = await ApiService.patch(
            `miembro/${idMiembro}`,
            data,
            token
            );

            if (response.code !== 200) {
            throw new Error(response.data?.error || "Error al actualizar miembro");
            }

            console.log("Miembro actualizado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error en updateMiembro:", error);
            throw error;
        }
    },

    getZonas: async (token) => {
        try {
            const response = await ApiService.get("/zonas", token);
            console.log("Zonas fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching zonas:", error);
            throw error;
        }
    },
    
    getCiudades: async (token) => {
        try {
            const response = await ApiService.get("/ciudades", token);
            console.log("Ciudades fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching ciudades:", error);
            throw error;
        }
    },

    getDepartamentos: async (token) => {
        try {
            const response = await ApiService.get("/departamentos", token);
            console.log("Departamentos fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching departamentos:", error);
            throw error;
        }
    },

    crearCiudad: async (token, nombre, id_departamento) => {
        try {
            const response = await ApiService.post(
            "/ciudades",
            {nombre, id_departamento},
            "application/json",
            token
            );
            console.log("Ciudad creada:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando establecimiento:", error);

            if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
            }

            throw error;
        }
    },

    crearZona: async (token, nombre, id_ciudad) => {
        try {
            const response = await ApiService.post(
            "/zonas",
            {nombre, id_ciudad},
            "application/json",
            token
            );
            console.log("Zona creada:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando establecimiento:", error);

            if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
            }

            throw error;
        }
    },

    crearEstablecimiento: async (token, data) => {
        try {
            const response = await ApiService.post(
            "/establecimientos",
            data,
            "application/json",
            token
            );
            console.log("Establecimiento creado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando establecimiento:", error);

            if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
            }

            throw error;
        }
    },

    getEstablecimientoByNombre: async (token, nombre) => {
        try {
            const response = await ApiService.get(`/establecimientos/${nombre}`, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching establecimiento by nombre:", error);
            throw error;
        }
    },

    updateEstablecimiento: async (token, id, data) => {
        try {
            const response = await ApiService.patch(
            `/establecimientos/${id}`,
            data,
            token
            );
            if (response.code !== 200) {
            throw new Error(response.data?.error || "No se pudo actualizar el establecimiento");
            }
            console.log("Establecimiento actualizado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error actualizando establecimiento:", error);
            throw error;
        }
    },
}

export default adminService;