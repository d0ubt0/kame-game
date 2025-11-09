import { Link } from 'react-router-dom';
import './Coleccion.css';
import { CardCollectionItem } from '../components/Collection/CardCollectionItem';
import { PageTitle } from '../components/PageTitle';
import { placeholderCards } from '../db/db.js';
import type { Carta } from '../db/yugioh.js';

interface CartaColeccion{
  cartaId: number,
  cantidad: number
}

export function Coleccion() {
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
  
  return (
    <>
    <PageTitle title='Collection'/>
    <div className='CollectionContainer'>
      
      <div className='CardsContainer'>
        {
          cartasColeccion.map((value, index) =>{
            return <CardCollectionItem key={index} name={value.name} description={value.description} attack={value.attack} defense={value.defense} image={value.image}/>
          })
        }
      </div>
      <Link to="/" className='ShopButton'>Conseguir mas Cartas</Link>
    </div>
    </>
  );
}