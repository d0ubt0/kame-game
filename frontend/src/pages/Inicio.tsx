import { Link } from 'react-router-dom';
import { CardStoreItem } from '../components/Store/CardStoreItem';
import { PageTitle } from '../components/PageTitle';
import { useState, useEffect, useRef } from 'react'; // Agrega useRef
import { Filtro } from "../components/Filtro";
import type { CartaConCantidad } from "../types/Carta";
import './Inicio.css';

// Definimos la forma de los datos que vienen de la API
export interface StoreCardType {
  id: number;
  name: string;
  price: number;
  image: string;
  attack?: number;
  defense?: number;
  cantidad?: number;
}

export function Inicio({selectedCards, setSelectedCards}: {
  selectedCards: Set<number>;
  setSelectedCards: (cards: Set<number>) => void;
}) {
  const [cardsStore, setCardsStore] = useState<StoreCardType[]>([]);
  const [packsStore, setPacksStore] = useState<StoreCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartasFiltradas, setCartasFiltradas] = useState<StoreCardType[]>([]);
  
  // Estados para controlar filtros
  const [busquedaTexto, setBusquedaTexto] = useState("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("");
  
  // Ref para guardar la versión anterior de cartasFiltradas
  const cartasFiltradasRef = useRef<StoreCardType[]>([]);

  const handleFiltrado = (filtradas: CartaConCantidad[]) => {
    // Guardamos las cartas filtradas
    const nuevasFiltradas = filtradas as StoreCardType[];
    
    // Si el array filtrado es diferente al anterior, actualizamos
    if (JSON.stringify(nuevasFiltradas) !== JSON.stringify(cartasFiltradasRef.current)) {
      setCartasFiltradas(nuevasFiltradas);
      cartasFiltradasRef.current = nuevasFiltradas;
    }
  };

  // Función para extraer filtros del DOM (sin modificar Filtro.tsx)
  const actualizarFiltrosDesdeDOM = () => {
    // Buscar el input de búsqueda en el DOM
    const inputBusqueda = document.querySelector('input[type="text"][placeholder*="Buscar"]') as HTMLInputElement;
    const selectOrden = document.querySelector('select#sort') as HTMLSelectElement;
    
    if (inputBusqueda) {
      setBusquedaTexto(inputBusqueda.value);
    }
    if (selectOrden) {
      setOrdenSeleccionado(selectOrden.value);
    }
  };

  // Usar un effect para verificar filtros periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      actualizarFiltrosDesdeDOM();
    }, 300); // Verificar cada 300ms
    
    return () => clearInterval(interval);
  }, []);

  // Determinar si hay filtros activos
  const hayFiltroActivo = busquedaTexto.trim() !== "" || ordenSeleccionado !== "";
  
  // Determinar qué cartas mostrar
  const cartasAMostrar = hayFiltroActivo ? cartasFiltradas : cardsStore;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Petición de Cartas
        const cardsResponse = await fetch('http://localhost:3001/api/cards');
        const cardsData = await cardsResponse.json();
        setCardsStore(cardsData);
        // Inicializar cartasFiltradas con todas las cartas
        setCartasFiltradas(cardsData);
        cartasFiltradasRef.current = cardsData;

        // Petición de Paquetes
        const packsResponse = await fetch('http://localhost:3001/api/packs');
        if (packsResponse.ok) {
           const packsData = await packsResponse.json();
           setPacksStore(packsData);
        }
        
      } catch (error) {
        console.error("Error conectando con el backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSelectedCards = (idInput: number | string) => {
    const id = Number(idInput);
    const newSelectedCards = new Set(selectedCards);

    if (newSelectedCards.has(id)) {
      newSelectedCards.delete(id);
    } else {
      newSelectedCards.add(id);
    }

    localStorage.setItem('selectedCards', JSON.stringify(Array.from(newSelectedCards)));
    setSelectedCards(newSelectedCards);
  }

  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>Invoncando cartas...</div>;
  }

  return (
    <>
      <img src="/yugioh-home.webp" alt="" />
      <PageTitle title='Yugi Oh Store'/>
      <div className='StoreContainer'>
        
        <h2 className="section-title">Cartas</h2>
        <Filtro
          cartas={cardsStore as CartaConCantidad[]}
          onFiltrado={handleFiltrado}
          opcionesOrden={["name", "attack", "defense"]}
        />
        
        <section className='CardsStoreContainer'>
          {cartasAMostrar.length > 0 ? (
            cartasAMostrar.map(value => {
              const isSelected = selectedCards.has(value.id);
              return (
                <CardStoreItem 
                  key={value.id} 
                  id={value.id} 
                  isSelected={isSelected} 
                  name={value.name} 
                  image={value.image} 
                  price={value.price} 
                  addStoreItemFunction={updateSelectedCards}
                />
              );
            })
          ) : (
            // Solo muestra este mensaje si HAY filtro activo pero NO hay resultados
            hayFiltroActivo ? (
              <p style={{color: '#aaa'}}>No se encontraron cartas que coincidan con la búsqueda.</p>
            ) : (
              <p style={{color: '#aaa'}}>No se encontraron cartas en la base de datos.</p>
            )
          )}
        </section>

        <h2 className="section-title">Paquetes</h2>
        <section className='CardsStoreContainer'>
          {packsStore.length > 0 ? (
            packsStore.map(value => {
              const isSelected = selectedCards.has(value.id);
              return (
                <CardStoreItem 
                  key={value.id} 
                  id={value.id} 
                  isSelected={isSelected} 
                  name={value.name} 
                  image={value.image} 
                  price={value.price} 
                  addStoreItemFunction={updateSelectedCards}
                />
              );
            })
          ) : (
            <p style={{color: '#aaa'}}>No hay paquetes disponibles.</p>
          )}
        </section>
      </div>
      
      <Link className='CartButton' to='/Carrito'>
        <svg width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16.5" cy="18.5" r="1.5"/>
          <circle cx="9.5" cy="18.5" r="1.5"/>
          <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z"/>
        </svg>
      </Link>
    </>
  )
}