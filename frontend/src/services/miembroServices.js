import ApiService from "./apiServices";

const miembroService = {
    getCiudadanoByCi: async (token, ci) => {
        try {
            const response = await ApiService.get(`/ciudadano/get-by-ci/${ci}`, token);
            return response.data;
        } catch (error) {
            console.error("Error fetching ciudadano by CI:", error);
            throw error;
        }
    },

    getCiudadanos: async (token) => {
        try {
            const response = await ApiService.get("/ciudadano", token);
            console.log("Ciudadanos fetched successfully: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching ciudadanos:", error);
            throw error;
        }
    },

    habilitarVotante: async (token, ciCiudadano, esObservado, nroCircuito) => {
        try {
            console.log("Habilitando votante con CI:", ciCiudadano);          
            const response = await ApiService.post("/habilitar_votante", { ci_ciudadano: ciCiudadano, es_observado: esObservado, nro_circuito: nroCircuito },"application/json", token);
            console.log("Votante habilitado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error habilitando votante:", error);
            throw error;
        }
    },

    getCiudadanoByCC: async (token, cc) => {
        try {
            const response = await ApiService.get(
                `/ciudadano/get-by-cc/${cc}`,
                token
            );
            return response.data;
        } catch (error) {
            // Si el backend responde 404, interpretamos como “no existe”
            if (error.response && error.response.status === 404) {
                return null;
            }
            console.error("Error fetching ciudadano by CC:", error);
            throw error;
        }
    },

    abrirCircuito: async (token, nroCircuito) => {
        try {
            const res = await ApiService.post(`/circuitos/${nroCircuito}/abrir`, {}, "application/json", token);
            return res.data;
        } catch (err) {
            console.error("Error abriendo circuito:", err);
            throw err;
        }
    },

    cerrarCircuito: async (token, nroCircuito) => {
        try {
            const res = await ApiService.post(`/circuitos/${nroCircuito}/cerrar`, {}, "application/json", token);
            return res.data;
        } catch (err) {
            console.error("Error cerrando circuito:", err);
            throw err;
        }
    },



}

export default miembroService;