// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react"; // 👈 Asegúrate de importar useEffect
import { Inicio } from "./pages/Inicio";
import { Coleccion } from "./pages/Coleccion";
import { Admin } from "./pages/Admin/AdminDashboard";
import { Carrito } from "./pages/Carrito";
import { Navbar } from "./components/Navbar";
import ManageSingles from "./pages/Admin/AdminCartas";
import ManagePaquetes from "./pages/Admin/AdminPaquetes";
import ManageUsers from "./pages/Admin/adminUsuario";
import Login from "./pages/Login/login";
import AdminRoute from "./components/Admin/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Registro from "./pages/Registro/registro";
import { Footer } from "./components/Footer";
import SeleccionCartas from "./pages/Arena/SeleccionCartas";
import { initLocalData } from "./db/initLocalData";
import ArenaBatalla from "./pages/Arena/ArenaBatalla";

function App() {
  // ✅ 1. Ejecutar inicialización una sola vez
  useEffect(() => {
    initLocalData(); // carga cartas y paquetes desde db.ts si no existen
  }, []);

  // ✅ 2. Estado compartido de cartas seleccionadas
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

  // ✅ 3. Ocultar Navbar y Footer en login y registro
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/registro" ||
    location.pathname.toLowerCase().startsWith("/arena/batalla");


  return (
    <AuthProvider>
      <div className="main">
        {!hideNavbar && <Navbar />}

        <Routes>
          {/* ---------------------- Página pública ---------------------- */}
          <Route
            path="/"
            element={
              <Inicio
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
              />
            }
          />

          {/* ---------------------- Rutas protegidas ---------------------- */}
          <Route
            path="/Coleccion"
            element={
              <ProtectedRoute>
                <Coleccion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Carrito"
            element={
              <ProtectedRoute>
                <Carrito
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Arena"
            element={
              <ProtectedRoute>
                <SeleccionCartas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Arena/Batalla"
            element={
              <ProtectedRoute>
                <ArenaBatalla />
              </ProtectedRoute>
            }
          />

          {/* --------------------- Área de Admin --------------------- */}
          <Route
            path="/Admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/Admin/Cartas"
            element={
              <AdminRoute>
                <ManageSingles />
              </AdminRoute>
            }
          />
          <Route
            path="/Admin/Paquetes"
            element={
              <AdminRoute>
                <ManagePaquetes />
              </AdminRoute>
            }
          />
          <Route
            path="/Admin/Usuarios"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />

          {/* ---------------------- Autenticación ---------------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* ---------------------- 404 ---------------------- */}
          <Route path="*" element={<h1>404: Página no encontrada</h1>} />
        </Routes>

        {!hideNavbar && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
