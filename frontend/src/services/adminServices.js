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
}

export default adminService;