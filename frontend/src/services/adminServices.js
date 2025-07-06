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
                ? `/resultados-listas?nro_circuito=${circuito}`
                : `/resultados-listas`;
            const response = await ApiService.get(url, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching resultados por lista:", error);
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

}

export default adminService;