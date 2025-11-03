import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al inicio después de cerrar sesión
  };

  return (
    <nav className="navbar">
      <ul className="navLinks">
        <div className="logo">
          <Link to="/">Yu-Gi-Oh Store</Link>
        </div>

        <li><Link to="/Coleccion">Mi Colección</Link></li>
        <li><Link to="/Arena">Arena de Batalla</Link></li>
        <li><Link to="/Admin">Admin</Link></li>
        <li><Link to="/Carrito">Carrito</Link></li>
      </ul>

      <div className="authActions">
        {isAuthenticated ? (
          <>
            <span className="userName">Hola, {user?.split("@")[0]}</span>
            <button onClick={handleLogout} className="authButton logoutButton">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="authButton">Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}
