import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import AuthService from "../../services/authService";

function Login() {
  // Mensaje de error en la tarjeta
  const [err_msg, setErrorMsg] = useState("");
  const [isHidden, setHidden] = useState(true);

  //para poder ver la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Estado para almacenar el nombre de usuario (en este caso CI) y password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función que se llama cuando se envía el formulario

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!formData.username || !formData.password) {
      setErrorMsg("Los campos no pueden estar vacíos.");
      setHidden(false);
      return;
    }

    setErrorMsg("");
    setHidden(true);

    try {
      const user = await AuthService.login(
        formData.username,
        formData.password
      );

      console.log("Respuesta del servidor:", user);

      if (user.code === 200) {
        console.log("Respuesta del servidor:", user);
        console.log("datos guardados", user.data.user_data);
        
        // Redirigir según el rol
        if (user.data.role_description === "admin") {
            console.log("Redirigiendo a HomeAdministrador");
          navigate("/HomeAdministrador");
        } else if (user.data.role_description === "miembroMesa") {
          navigate("/HomeMiembroMesa");
        } else {
          setErrorMsg("Rol no válido. Contacta al administrador.");
          setHidden(false);
        }
      }
    } catch (error) {
      setErrorMsg("Ocurrió un error durante el inicio de sesión.");
      setHidden(false);
      console.error("Login error:", error);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.loginWrapper}>
        <div>
          <img
            src="../../../public/Escudo20Uruguay_19.png"
            alt="Logo"
            className={classes.logo}
          />
        </div>
        <h2 className={classes.loginTitle}>Inicio de Sesión</h2>
        <p>
          Inicia sesión con tu usuario de la <b>corte electoral</b>.
        </p>

        <form onSubmit={handleSubmit} className={classes.loginForm}>
          <div className={classes.inputGroup}>
            <p className={classes.inputLabel}>Nombre de usuario</p>
            <input
              className={classes.loginInput}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Ingrese su nombre de usuario"
            />
          </div>
          <div className={classes.inputGroup}>
            <p className={classes.inputLabel}>Contraseña</p>
            <input
              className={classes.loginInput}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className={classes.showPassword}>
              <input
                type="checkbox"
                id="show-password"
                name="password"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />
              <label htmlFor="show-password">Mostrar contraseña</label>
            </div>
          </div>
          <button className={classes.loginButton} type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
