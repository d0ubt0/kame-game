import { useNavigate } from "react-router-dom";
import "./InfoPanel.css";

export default function InfoPanel() {
  const navigate = useNavigate();

  return (
    <div className="info-panel">
      <div className="info-content">
        <h2>Acceso restringido</h2>
        <p>Para acceder a esta sección necesitas iniciar sesión.</p>
        <button onClick={() => navigate("/login")}>Iniciar sesión</button>
      </div>
    </div>
  );
}
