import { Link } from 'react-router-dom';
import './Coleccion.css';
import { CardCollectionItem } from '../components/Collection/CardCollectionItem';
import { PageTitle } from '../components/PageTitle';
import type { Carta } from '../db/yugioh.js';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCallback } from "react";


// IMPORTAR filtro nuevo
import { Filtro } from '../components/Filtro.js';

type CartaConCantidad = Carta & { cantidad: number };

export function Coleccion() {
  const [cartasColeccion, setCartasColeccion] = useState<CartaConCantidad[]>([]);
  const [cartasFiltradas, setCartasFiltradas] = useState<CartaConCantidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  const handleFiltrado = useCallback(
    (filtradas: CartaConCantidad[]) => {
      setCartasFiltradas(filtradas);
    },
    [] // no depende de nada
  );


  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        // Llamamos al nuevo endpoint del backend
        const response = await fetch(`https://incredible-creation.up.railway.app/api/users/collection`,{headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: 'include'});
        
        if (response.ok) {
          const data = await response.json();

          const cartasFormateadas = data.map((item: any) => ({
            ...item.card,
            cantidad: item.quantity
          }));

          setCartasColeccion(cartasFormateadas);
          setCartasFiltradas(cartasFormateadas); // inicial
        }
      } catch (error) {
        console.error("Error cargando colección:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [user]);

  if (isLoading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando tu colección...</div>;
  }

  if (!user) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
        <h2>Debes iniciar sesión para ver tu colección.</h2>
        <Link to="/login" style={{ color: '#E6C200' }}>Ir al Login</Link>
      </div>
    );
  }

  return (
    <>
      <PageTitle title='Collection'/>

      <div className='CollectionContainer'>

        {/* --- SOLO ESTE FILTRO: contiene select + input + lógica --- */}
        <Filtro
          cartas={cartasColeccion}
          onFiltrado={handleFiltrado}
        />

        {/* Ya no hay SortContainer aquí — lo controló Filtro */}

        <div className='CardsContainer'>
          {cartasFiltradas.length > 0 ? (
            cartasFiltradas.map((value) => (
              <CardCollectionItem 
                key={value.id} 
                image={value.image} 
                name={value.name} 
                description={value.description} 
                cantidad={value.cantidad} 
                attack={value.attack} 
                defense={value.defense} 
              />
            ))
          ) : (
            <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>
              No se encontraron cartas con ese filtro.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
