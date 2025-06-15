import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import HomeMiembroMesa from "./Pages/MiembroMesa/HomeMiembroMesa";
import HomeAdministrador from "./Pages/Administrador/HomeAdministrador";
import Estadisticas from "./Components/Estadisticas/Estadisticas";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/HomeMiembroMesa" element={<HomeMiembroMesa />} />
            <Route path="/HomeAdministrador" element={<HomeAdministrador />} />
           <Route path="/Estadisticas" element={<Estadisticas />} />
        </Routes>
    )
}

export default App;

            
