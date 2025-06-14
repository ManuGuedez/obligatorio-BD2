import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
    // Estado para almacenar el nombre de usuario (en este caso CI) y password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Función que se llama cuando se envía el formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === "1111") {
            navigate("/HomeMiembroMesa"); // Redirige al home de miembros de mesa
        } else if (username === "2222") {
            navigate("/HomeAdministrador"); // Redirige al home de administrador
        } else {
            alert("Usuario o clave incorrectos.");
        }
    }

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Usuario (cédula)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Clave"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login-button" type="submit">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;
