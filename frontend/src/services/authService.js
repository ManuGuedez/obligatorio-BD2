import ApiService from "./apiServices";

const AuthService = {
    register: async (formData) => {
        const creds = {
            nombre_usuario: formData.username,
            password: formData.password,
            ci: formData.ci,
            nombre: formData.name,
            apellido: formData.lastname,
        };

        const registeredUser = await ApiService.post(
            "/registrar_usuario",
            creds,
            "application/json"
        );

        return registeredUser;
    },

    login: async (username, passwd) => {
        const creds = {
            nombre_usuario: username,
            password: passwd,
        };

        const loggedInUser = await ApiService.post(
            "/login",
            creds,
            "application/json"
        );

        console.log("Respuesta del servidoooooorrr:", loggedInUser);

        if (loggedInUser.code === 200) {
            // Guardar el token y el rol del usuario en localStorage
            localStorage.setItem("token", loggedInUser.data.access_token);
            localStorage.setItem("current_role", JSON.stringify(loggedInUser.data.role_description));
        } else {
            console.error("Error al iniciar sesión:", loggedInUser);
        }

        return loggedInUser;
    }
};

export default AuthService;