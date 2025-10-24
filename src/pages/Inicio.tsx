import { Link } from 'react-router-dom';

export function Inicio() {

  return (
    <>
      <h1>
        Kame Game
      </h1>
      <Link to="/Admin">Ir al panel de administración</Link>
    </>
  )
}

