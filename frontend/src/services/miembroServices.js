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

    habilitarVotante: async (token, ciCiudadano) => {
        try {

            console.log("Habilitando votante con CI:", ciCiudadano);
            const response = await ApiService.post("/habilitar_votante", { ci_ciudadano: ciCiudadano },"application/json", token);
            console.log("Votante habilitado:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error habilitando votante:", error);
            throw error;
        }
    },

}

export default miembroService;