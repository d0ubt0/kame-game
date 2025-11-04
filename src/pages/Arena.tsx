import { Link } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';


export function Arena() {
  return (
    <div>
      <PageTitle title='Arena de Batalla'/>
      
      <p>Aquí es donde se realiza las batallas.</p>
      
      
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}