import { Link } from 'react-router-dom';

export function Coleccion() {
  return (
    <div>
      <h2>Mi Colección</h2>
      <p>Aquí esta tu colección.</p>
      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}