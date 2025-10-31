// src/pages/PaginaAdmin.tsx
import { PageTitle } from '../../components/PageTitle';
import { Link } from 'react-router-dom';

export function Admin() {
  return (
    <div>
      <PageTitle title="Panel de Administración" />
      <p>Aquí es donde gestionarás todo el contenido.</p>
      <div>
        <Link to="/Admin/Cartas">Gestionar Cartas</Link>
        <br />
        <Link to="/Admin/Paquetes">Gestionar Paquetes</Link>
        <br />
        <Link to="/Admin/Usuarios">Gestionar Usuarios</Link>
      </div>

      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}