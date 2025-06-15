import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import escudo from "../../Img/escudo.png";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "1111") {
      navigate("/HomeMiembroMesa");
    } else if (username === "2222") {
      navigate("/HomeAdministrador");
    } else {
      alert("Usuario o clave incorrectos.");
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.loginWrapper}>
        <img src={escudo} className={classes.escudo} />

        <h2 className={classes.loginTitle}>Inicio de Sesión</h2>
        <p className={classes.loginSubtitle}>
          Inicia sesión con tu usuario de la <strong>corte electoral</strong>.
        </p>

        <form onSubmit={handleSubmit} className={classes.loginForm}>
          <div className={classes.inputGroup}>
            <label className={classes.inputLabel}>Nombre de usuario</label>
            <input
              className={classes.loginInput}
              type="text"
              placeholder="Ingrese su nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={classes.inputGroup}>
            <label className={classes.inputLabel}>Contraseña</label>
            <input
              className={classes.loginInput}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className={classes.checkboxContainer}>
              <input
                type="checkbox"
                id="mostrar"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="mostrar">Mostrar contraseña</label>
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
