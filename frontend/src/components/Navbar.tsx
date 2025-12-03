import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
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
              <button onClick={handleLogoutClick} className="authButton">
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

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="modalOverlay" onClick={cancelLogout}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <img src="../public/logout.png" alt="Logout" className="modalIcon"/>
              <h2>¿Cerrar Sesión?</h2>
            </div>
            <p className="modalText">
              ¿Estás seguro de que deseas abandonar la arena de duelos?
            </p>
            <div className="modalActions">
              <button onClick={cancelLogout} className="modalButtonCancel">
                Cancelar
              </button>
              <button onClick={confirmLogout} className="modalButtonConfirm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}