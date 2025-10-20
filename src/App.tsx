// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { Coleccion } from './pages/Coleccion';
import { Arena } from './pages/Arena';
import { Admin } from './pages/Admin';
import { Carrito } from './pages/Carrito';
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
        
        {/* ruta para panel mi collección*/}
        <Route path="/Coleccion" element={<Coleccion />} />

        {/* ruta para panel Arena de Batallas*/}
        <Route path="/Arena" element={<Arena />} />
        
        {/* ruta para panel de admin */}
        <Route path="/admin" element={<Admin />} />

        {/*ruta para panel de admin */}
        <Route path="/Carrito" element={<Carrito />} />

        {/* Aquí podrías añadir una ruta "catch-all" para páginas no encontradas */}
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;