import { Link } from 'react-router-dom';
import { CardStoreItem } from '../components/Store/CardStoreItem';
import { PageTitle } from '../components/PageTitle';
import { useState } from 'react';
import type { Carta } from '../db/yugioh';
import './Inicio.css';
import { placeholderCards, placeholderPacks } from '../db/db';

export type StoreCardType = Pick<Carta, 'id' | 'name' | 'price' | 'image'>;


export function Inicio({selectedCards, setSelectedCards}: {
  selectedCards: Set<number>;
  setSelectedCards: (cards: Set<number>) => void;
}) {
  const [packsStore, ] = useState<StoreCardType[]>(placeholderPacks);
  const [cardsStore, ] = useState<StoreCardType[]>(placeholderCards);

  const updateSelectedCards = (id : number) => {
    const previousSelectedCards = new Set(selectedCards);

    if (previousSelectedCards.has(id)) {
      previousSelectedCards.delete(id);
    } else {
      previousSelectedCards.add(id);
    }
    localStorage.setItem('selectedCards', JSON.stringify(Array.from(previousSelectedCards)));
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

