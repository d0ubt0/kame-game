// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { Coleccion } from './pages/Coleccion';
import { Arena } from './pages/Arena';
import { Admin } from './pages/Admin/AdminDashboard';
import { Carrito } from './pages/Carrito';
import { Navbar } from './components/Navbar';
import ManageSingles from './pages/Admin/AdminCartas';
import ManagePaquetes from './pages/Admin/AdminPaquetes';
import ManageUsers from './pages/Admin/adminUsuario';
import { useState } from 'react';
import Login from './pages/Login/login';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Registro from './pages/Registro/registro';

function App() {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/registro";

  return (
    <AuthProvider>
      <div className='main'>
        {!hideNavbar && <Navbar />}

        <Routes>
          {/* ---------------------- Página pública ---------------------- */}
          <Route
            path="/"
            element={<Inicio selectedCards={selectedCards} setSelectedCards={setSelectedCards} />}
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
                <Carrito selectedCards={selectedCards} setSelectedCards={setSelectedCards} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Arena"
            element={
              <ProtectedRoute>
                <Arena />
              </ProtectedRoute>
            }
          />

          {/* --------------------- Área de Admin --------------------- */}
          <Route
            path="/Admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin/Cartas"
            element={
              <ProtectedRoute>
                <ManageSingles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin/Paquetes"
            element={
              <ProtectedRoute>
                <ManagePaquetes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin/Usuarios"
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* ---------------------- Autenticación ---------------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />


          {/* ---------------------- 404 ---------------------- */}
          <Route path="*" element={<h1>404: Página no encontrada</h1>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;