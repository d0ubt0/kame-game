import { Link } from 'react-router-dom';
import './Coleccion.css';
import { CardCollectionItem } from '../components/Collection/CardCollectionItem';
import { PageTitle } from '../components/PageTitle';
import { placeholderCards } from '../db/db.js';

export function Coleccion() {
  return (
    <>
    <PageTitle title='Collection'/>
    <div className='CollectionContainer'>
      
      <div className='CardsContainer'>
        {
          placeholderCards.map((value, index) =>{
            return <CardCollectionItem key={index} name={value.name} description={value.description} attack={value.attack} defense={value.defense} image={value.image}/>
          })
        }
      </div>
      <Link to="/" className='ShopButton'>Conseguir mas Cartas</Link>
    </div>
    </>
  );
}