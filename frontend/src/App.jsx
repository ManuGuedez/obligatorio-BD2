import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import HomeMiembroMesa from "./Components/HomeMiembroMesa";
import HomeAdministrador from "./Components/HomeAdministrador";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/LoginMiembro" />} />

            <Route path="/LoginMiembro" element={<Login />} />
            <Route path="/HomeMiembroMesa" element={<HomeMiembroMesa />} />
            <Route path="/HomeAdministrador" element={<HomeAdministrador />} />
        </Routes>
    )
}

export default App;
