import { Link } from 'react-router-dom';

export function Carrito() {
  return (
    <div>
      <h2>Carrito</h2>
      <p>Aquí es donde se realizan compras.</p>
      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}