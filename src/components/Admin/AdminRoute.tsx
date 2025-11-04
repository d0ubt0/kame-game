// src/components/AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protege las rutas de administración.
 * Solo permite el acceso a usuarios autenticados con rol "admin".
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  // Si no ha iniciado sesión, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no es admin, redirigir al inicio
  if (user?.role !== "admin") {
    alert("⚠️ No tienes permisos para acceder a esta sección.");
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderiza el contenido
  return <>{children}</>;
};

export default AdminRoute;
