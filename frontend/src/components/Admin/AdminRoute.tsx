import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth(); // <--- Obtener loading

  // 1. Si está cargando, mostrar un indicador
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "white",
        backgroundColor: "#1a1a2e"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "50px", 
            height: "50px", 
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p>Cargando sesión...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Solo después de cargar, verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Verificar rol de administrador
  if (user?.role !== "admin") {
    alert("⚠️ No tienes permisos para acceder a esta sección.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;