import ApiService from "./apiServices";

const votarService = {
    emitirVoto: async (voto) => {
        try {
            let data = {
                voto: voto, // El voto debe contener la información del candidato
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
    }
}

export default votarService;