// src/pages/PaginaAdmin.tsx
import { PageTitle } from '../../components/PageTitle';
import { Link } from 'react-router-dom';

export function AdminCard() {
  return (
    <div>
      <PageTitle title="Panel de Administración-Gestión de Cartas" />
      <p>Aquí es donde gestionarás todas las cartas.</p>
     
      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}