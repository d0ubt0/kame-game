import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // esto redirige al inicio después de cerrar sesión
  };

  return (
    <nav className="navbar">
      <ul className="navLinks">
        <div className="logo">
          <Link to="/">
            <img src="../public/puzzle-millennium.png" alt="Logo" className="icono-logo"/>
            <span>Yu-Gi-Oh Store</span>
          </Link>
        </div>

        <li><Link to="/Admin">
        <img src="../public/admin.png" alt="Administrador" className="icono-admin" />
          <span>Admin</span>
        </Link></li>
        <li><Link to="/Arena">
          <img src="../public/arena.png" alt="Arena de Batalla" className="icono-arena"/>
          <span>Arena de Batalla</span>
        </Link></li>
        <li><Link to="/Coleccion">
          <img src="../public/carta.png" alt="Mi Colección" className="icono-coleccion"/>
          <span>Mi Colección</span>
        </Link></li>
        <li><Link to="/Carrito">
          <img src="../public/carrito.png" alt="Carrito" className="icono-carrito"/>
          <span>Carrito</span>
        </Link></li>
      </ul>

      <div className="authActions">
        {isAuthenticated ? (
          <>
            <span className="userName">Hola, {user?.username}</span>
            <button onClick={handleLogout} className="authButton">
              <img src="../public/logout.png" alt="Cerrar Sesion" className="icono-logout"/>
              <span>Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="authButton">
              <img src="../public/login.png" alt="Iniciar Sesion" className="icono-login"/>
              <span>Iniciar Sesión</span>
            </Link>
        )}
      </div>
    </nav>
  );
}
