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

const placeholderPacks = [
  { id: 201, name: "Sobre Leyendas del Dragón Blanco", price: 8500, image: "/packPlaceholder.png" },
  { id: 202, name: "Paquete Caos del Infinito", price: 7200, image: "/packPlaceholder.png" },
  { id: 203, name: "Caja Fusión del Destino", price: 12000, image: "/packPlaceholder.png" },
  { id: 204, name: "Mega Pack del Duelista", price: 9500, image: "/packPlaceholder.png" }
];


export function Inicio() {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set()); // Funciona con el ID
  const [packsStore] = useState<StoreCardType[]>(placeholderPacks);
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
      <img src="/yugioh-home.webp" alt="" />
      <PageTitle title='Yugi Oh Store'/>
      <div className='StoreContainer'>
        
        <h2 className="section-title">Cartas</h2>
        <section className='CardsStoreContainer'>
          {cardsStore.map(value => {
            const isSelected = selectedCards.has(value.id) ? true : false;
            return <CardStoreItem key={value.id} id={value.id} isSelected={isSelected} name={value.name} image={value.image} price={value.price} addStoreItemFunction={updateSelectedCards}/>
          })}
        </section>

        <h2 className="section-title">Paquetes</h2>
        <section className='CardsStoreContainer'>
          {packsStore.map(value => {
            const isSelected = selectedCards.has(value.id) ? true : false;
            return <CardStoreItem key={value.id} id={value.id} isSelected={isSelected} name={value.name} image={value.image} price={value.price} addStoreItemFunction={updateSelectedCards}/>
          })}
        </section>
      </div>
      <Link className='CartButton'to='/Carrito'>
        <svg width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16.5" cy="18.5" r="1.5"/>
          <circle cx="9.5" cy="18.5" r="1.5"/>
          <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z"/>
        </svg>
      </Link>
    </>
  )
}

