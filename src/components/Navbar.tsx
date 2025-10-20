import { Link } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {

  return (
    <nav className={"navbar"}>
      <ul className={"navLinks"}>
        <div className={"logo"}>
            <Link to="/">Yu-Gi-Oh Store</Link>
        </div>

 
        <li><Link to="/Coleccion">Mi Colección</Link></li>
        <li><Link to="/Arena">Arena de Batalla</Link></li>
        <li><Link to="/Admin">Admin</Link></li>
        <li><Link to="/Carrito">Carrito</Link></li>
      </ul>

      <div className={"authActions"}>
        <Link to="/login" className={"authButton"}>Iniciar Sesión</Link>
      </div>
    </nav>
  );
}