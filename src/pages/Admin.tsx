// src/pages/PaginaAdmin.tsx

import { Link } from 'react-router-dom';

export function Admin() {
  return (
    <div>
      <h2>Panel de Administración</h2>
      <p>Aquí es donde gestionarás todo el contenido.</p>
      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}