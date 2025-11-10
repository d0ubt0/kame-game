import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    alert("⚠️ No tienes permisos para acceder a esta sección.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
