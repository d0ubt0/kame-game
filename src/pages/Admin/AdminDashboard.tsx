// src/pages/PaginaAdmin.tsx
import { PageTitle } from '../../components/PageTitle';
import { Link } from 'react-router-dom';
import "./AdminDashboard.css"

export function Admin() {
  return (
    <div className='admin'>
      <PageTitle title="Panel de Administración" />
      <div>
        <Link to="/Admin/Cartas">Gestionar Cartas</Link>
        <br />
        <Link to="/Admin/Paquetes">Gestionar Paquetes</Link>
        <br />
        <Link to="/Admin/Usuarios">Gestionar Usuarios</Link>
      </div>

      
      
      
    </div>
  );
}