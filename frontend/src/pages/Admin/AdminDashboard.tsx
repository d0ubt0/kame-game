import { PageTitle } from "../../components/PageTitle";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

export function Admin() {
  return (
    <div>
        <PageTitle title="Panel de Administración" />
    <div className="admin-container">

      <div className="admin-overlay" />

      <div className="admin-content">

        <div className="admin-links">
          <Link to="/Admin/Cartas" className="admin-btn">
            Gestionar Cartas
          </Link>
          <Link to="/Admin/Paquetes" className="admin-btn">
            Gestionar Paquetes
          </Link>
          <Link to="/Admin/Usuarios" className="admin-btn">
            Gestionar Usuarios
          </Link>
        </div>
      </div>
    </div>
    </div>

  );
}
