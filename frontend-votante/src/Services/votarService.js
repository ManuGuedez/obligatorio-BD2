import ApiService from "./apiServices";

const votarService = {
    emitirVoto: async (voto) => {
        try {
            let data = {
                votos: voto, // El voto debe contener la información del candidato
                ci_ciudadano: localStorage.getItem("ci_ciudadano"), // El CI del ciudadano que emite el voto
            };

            console.log("Emitiendo voto con los datos:", data);
            const response = await ApiService.post("/emitir_voto", data, "application/json");
            if (response.code === 200) {
                console.log("Voto emitido correctamente:", response.data);
                return response.data;
            } else {
                console.error("Error al emitir el voto:", response.data);
                throw new Error(`Error al emitir el voto: ${response.code}`);
            }
        } catch (error) {
            console.error("Error en emitirVoto:", error);
            throw error;
        }
    },
    getListas: async () => {
        try {
            const response = await ApiService.get("/lista");
            if (response.code == 200) {
                console.log("Listas: ", response.data)
                return response.data
            } else {
                console.log("Error al cargar las listas:", response);
                throw new Error(`Error al cargar las listas: ${response.code}`);
            }
        }
        catch (error) {
            console.error("Error en getListas:", error);
            throw error;
        }
    }
}

export default votarService;