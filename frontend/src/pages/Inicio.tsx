import { Link } from 'react-router-dom';
import { CardStoreItem } from '../components/Store/CardStoreItem';
import { PageTitle } from '../components/PageTitle';
import { useState, useEffect } from 'react'; // Agregamos useEffect
import './Inicio.css';

// Definimos la forma de los datos que vienen de la API
export interface StoreCardType {
  id: number;
  name: string;
  price: number;
  image: string;
}

export function Inicio({selectedCards, setSelectedCards}: {
  selectedCards: Set<number>;
  setSelectedCards: (cards: Set<number>) => void;
}) {
  // 1. Iniciamos los estados vacíos (se llenarán cuando el backend responda)
  const [cardsStore, setCardsStore] = useState<StoreCardType[]>([]);
  const [packsStore, setPacksStore] = useState<StoreCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Usamos useEffect para llamar a la API al cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Petición de Cartas
        const cardsResponse = await fetch('http://localhost:3001/api/cards');
        const cardsData = await cardsResponse.json();
        setCardsStore(cardsData);

        // Petición de Paquetes (Si no tienes este endpoint aún, puedes comentar esto)
        const packsResponse = await fetch('http://localhost:3001/api/packs');
        if (packsResponse.ok) {
           const packsData = await packsResponse.json();
           setPacksStore(packsData);
        }
        
      } catch (error) {
        console.error("Error conectando con el backend:", error);
      } finally {
        setIsLoading(false); // Quitamos el estado de carga
      }
    };

    fetchData();
  }, []);

  const updateSelectedCards = (idInput: number | string) => {
    // 1. Forzamos que el ID sea siempre un número
    const id = Number(idInput);
    
    // 2. Creamos una copia del Set actual
    const newSelectedCards = new Set(selectedCards);

    // 3. Verificamos: ¿Ya existe este número en el Set?
    if (newSelectedCards.has(id)) {
      console.log(`Quitando ID: ${id}`); // Debug para ver si entra aquí
      newSelectedCards.delete(id);
    } else {
      console.log(`Agregando ID: ${id}`);
      newSelectedCards.add(id);
    }

    // 4. Guardamos y actualizamos estado
    localStorage.setItem('selectedCards', JSON.stringify(Array.from(newSelectedCards)));
    setSelectedCards(newSelectedCards);
  }

  // 3. Renderizado
  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>Invoncando cartas...</div>;
  }

  return (
    <>
      <img src="/yugioh-home.webp" alt="" />
      <PageTitle title='Yugi Oh Store'/>
      <div className='StoreContainer'>
        
        <h2 className="section-title">Cartas</h2>
        <section className='CardsStoreContainer'>
          {cardsStore.length > 0 ? (
            cardsStore.map(value => {
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
            <p style={{color: '#aaa'}}>No se encontraron cartas en la base de datos.</p>
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