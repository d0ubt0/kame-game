import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img src="../public/logo-p.png" alt="Logo" className="icono-logo"/>
          <span>Yu-Gi-Oh Store</span>
        </Link>
      </div>

      <button 
        className={`menuToggle ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navLinks ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/Admin" onClick={closeMenu}>
            <img src="../public/admin.png" alt="Administrador" className="icono-admin" />
            <span>Admin</span>
          </Link>
        </li>
        <li>
          <Link to="/Arena" onClick={closeMenu}>
            <img src="../public/arena.png" alt="Arena de Batalla" className="icono-arena"/>
            <span>Arena de Batalla</span>
          </Link>
        </li>
        <li>
          <Link to="/Coleccion" onClick={closeMenu}>
            <img src="../public/carta.png" alt="Mi Colección" className="icono-coleccion"/>
            <span>Mi Colección</span>
          </Link>
        </li>
        <li>
          <Link to="/Carrito" onClick={closeMenu}>
            <img src="../public/carrito.png" alt="Carrito" className="icono-carrito"/>
            <span>Carrito</span>
          </Link>
        </li>
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
          <Link to="/login" className="authButton" onClick={closeMenu}>
            <img src="../public/login.png" alt="Iniciar Sesion" className="icono-login"/>
            <span>Iniciar Sesión</span>
          </Link>
        )}
      </div>
    </nav>
  );
}