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
        <Link to="/Admin/Productos">Gestionar Productos</Link>
        <br />
      </div>

      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}