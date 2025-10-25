import { Link } from 'react-router-dom';
import { CardStoreItem } from '../components/Store/CardStoreItem';
import { PageTitle } from '../components/PageTitle';
import { useState } from 'react';
import type { Carta } from '../types/yugioh';
import './Inicio.css';

export type StoreCardType = Pick<Carta, 'id' | 'name' | 'price' | 'image'>;

const placeholderCards = [
  {
    id: 12,
    name: "Dragón Escarlata de las Montanas",
    price: 3200,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 13,
    name: "Caballero de la Aurora",
    price: 2100,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 295,
    name: "Hechicera del Viento",
    price: 1700,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 1,
    name: "Lobo de Sombras",
    price: 1900,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 90,
    name: "Mecha-Titán ZX9",
    price: 2800,
    image: "/YugiOhCardPlaceholder.jpg"
  }
];



export function Inicio() {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set()); // Funciona con el ID
  const [cardsStore, ] = useState<StoreCardType[]>(placeholderCards);

  const updateSelectedCards = (id : number) => {
    const previousSelectedCards = new Set(selectedCards);

    if (previousSelectedCards.has(id)) {
      previousSelectedCards.delete(id);
    } else {
      previousSelectedCards.add(id);
    }

    setSelectedCards(previousSelectedCards);
  }


  return (
    <>
      <PageTitle title='Yugi Oh Store'/>
      <div className='StoreContainer'>
        <section className='CardsStoreContainer'>

        {cardsStore.map(value => {
          const isSelected = selectedCards.has(value.id) ? true : false;
          return <CardStoreItem key={value.id} id={value.id} isSelected={isSelected} name={value.name} image={value.image} price={value.price} addStoreItemFunction={updateSelectedCards}/>
        })}
        </section>
      </div>
      
      <Link to="/Admin">Ir al panel de administración</Link>
    </>
  )
}

