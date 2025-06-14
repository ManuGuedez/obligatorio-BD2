import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import HomeMiembroMesa from "./Pages/HomeMiembroMesa";
import HomeAdministrador from "./Pages/HomeAdministrador";
import Estadisticas from "./Components/Estadisticas";

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

            
