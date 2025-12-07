import { type JSX } from "react";
import { useAuth } from "../context/AuthContext";
import InfoPanel from "./InfoPanel";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth(); // <--- Obtener loading

  // Mostrar loading mientras se verifica
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
          <p>Cargando...</p>
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

  if (!isAuthenticated) {
    return <InfoPanel />;
  }

  return children;
}