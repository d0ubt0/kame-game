import { Link } from 'react-router-dom';
import './Coleccion.css';
import { CardCollectionItem } from '../components/Collection/CardCollectionItem';
import { PageTitle } from '../components/PageTitle';
import type { Carta } from '../db/yugioh.js';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Recomendado usar el contexto

// Definimos la estructura extendida para uso interno en el componente
// Es una Carta normal + la propiedad "cantidad"
type CartaConCantidad = Carta & { cantidad: number };

export function Coleccion() {
  const [sortBy, setSortBy] = useState<string>(''); 
  const [cartasColeccion, setCartasColeccion] = useState<CartaConCantidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Usamos el hook useAuth para obtener el usuario actual de forma segura
  const { user } = useAuth(); 

  useEffect(() => {
    // Si no hay usuario logueado, no podemos cargar colección
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        // Llamamos al nuevo endpoint del backend
        const response = await fetch(`http://localhost:3001/api/users/collection`,{headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: 'include'});
        
        if (response.ok) {
          const data = await response.json();
          
          // TRANSFORMACIÓN DE DATOS:
          // El backend devuelve: { quantity: 2, card: { id: 1, name: "Dragon..." } }
          // Nosotros queremos: { id: 1, name: "Dragon...", cantidad: 2 }
          const cartasFormateadas = data.map((item: any) => ({
            ...item.card,      // Copiamos todas las propiedades de la carta (name, image, atk...)
            cantidad: item.quantity // Agregamos la cantidad
          }));

          setCartasColeccion(cartasFormateadas);
        }
      } catch (error) {
        console.error("Error cargando colección:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [user]); // Se ejecuta cuando el usuario cambia (ej: al loguearse)

  // === LÓGICA DE ORDENAMIENTO ===
  // Creamos una copia para no mutar el estado original directamente
  const sortedCards = [...cartasColeccion];

  if (sortBy === 'attack') {
    sortedCards.sort((a, b) => (b.attack ?? 0) - (a.attack ?? 0));
  } else if (sortBy === 'defense') {
    sortedCards.sort((a, b) => (b.defense ?? 0) - (a.defense ?? 0));
  } else if (sortBy === 'name') {
    sortedCards.sort((a, b) => a.name.localeCompare(b.name));
  } else if(sortBy === 'cantidad'){
    sortedCards.sort((a, b) => (b.cantidad ?? 0) - (a.cantidad ?? 0));
  }
  
  // === RENDERIZADO ===
  if (isLoading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando tu mazo...</div>;
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

        <div className='SortContainer'>
            <label htmlFor='sort'>Ordenar por: </label>
            <select
              id='sort'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value=''>Ninguno</option>
              <option value='name'>Nombre</option>
              <option value='cantidad'>Cantidad</option>
              <option value='attack'>Ataque</option>
              <option value='defense'>Defensa</option>
            </select>
        </div>

        <div className='CardsContainer'>
          {sortedCards.length > 0 ? (
            sortedCards.map((value) => (
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
              No tienes cartas aún. ¡Ve a la tienda!
            </p>
          )}
        </div>
      </div>
    </>
  );
}