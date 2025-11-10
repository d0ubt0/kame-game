import { Link } from 'react-router-dom';
import './Coleccion.css';
import { CardCollectionItem } from '../components/Collection/CardCollectionItem';
import { PageTitle } from '../components/PageTitle';
import { placeholderCards } from '../db/db.js';
import type { Carta } from '../db/yugioh.js';
import { useState } from 'react';

interface CartaColeccion{
  cartaId: number,
  cantidad: number
}

export function Coleccion() {
  const [sortBy, setSortBy] = useState<string>(''); 
  const userStorage = localStorage.getItem('user');

  let cartasColeccion: (Carta & { cantidad: number })[] = [];

  if (userStorage) {
  const user = JSON.parse(userStorage);
  const userColeccion: CartaColeccion[] = user.coleccion || [];

  // Buscar cada carta por su ID en placeholderCards y agregar su cantidad
  cartasColeccion = userColeccion
    .map((cartaUser) => {
      console.log(' CARTA', cartaUser);
      const carta = placeholderCards.find((c) =>{console.log(c.id, cartaUser.cartaId) ;return c.id == cartaUser.cartaId;});
      
      if (carta) {
        return { ...carta, cantidad: cartaUser.cantidad };
      }
      return null; // Si no se encuentra la carta, se ignora
    })
    .filter((carta): carta is Carta & { cantidad: number } => carta !== null);
}

  if (sortBy === 'attack') {
    cartasColeccion.sort((a, b) => (b.attack ?? 0) - (a.attack ?? 0));
  } else if (sortBy === 'defense') {
    cartasColeccion.sort((a, b) => (b.defense ?? 0) - (a.defense ?? 0));
  } else if (sortBy === 'name') {
    cartasColeccion.sort((a, b) => a.name.localeCompare(b.name));
  } else if(sortBy === 'cantidad'){
    cartasColeccion.sort((a, b) => (b.cantidad ?? 0) - (a.cantidad ?? 0));
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
        {
          cartasColeccion.map((value, index) =>{
            return <CardCollectionItem key={index} name={value.name} description={value.description} attack={value.attack} defense={value.defense} image={value.image} cantidad={value.cantidad}/>
          })
        }
      </div>
      <Link to="/" className='ShopButton'>Conseguir mas Cartas</Link>
    </div>
    </>
  );
}