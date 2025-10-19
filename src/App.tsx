// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { Admin } from './pages/Admin';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <div className='main'>
      {/* Aquí podrías poner un componente <Navbar> o <Header> 
        que quieras que se muestre en TODAS las páginas.*/
        <Navbar />
      }
      
      {/* El componente <Routes> actúa como un 'switch' */}
      <Routes>
        {/* Define cada ruta. 
          path="/" es la URL raíz (tu página de inicio).
          element={} es el componente que se debe renderizar.
        */}
        <Route path="/" element={<Inicio />} />
        
        {/* Esta es la ruta para tu panel de admin */}
        <Route path="/admin" element={<Admin />} />

        {/* Aquí podrías añadir una ruta "catch-all" para páginas no encontradas */}
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;