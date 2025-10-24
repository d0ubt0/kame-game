import { Link } from 'react-router-dom';
import './Coleccion.css';
import { CardCollectionItem } from '../components/Collection/CardCollectionItem';

const placeholderCards = [
  {
    name: "Dragón Escarlata",
    description: "Una criatura legendaria que surca los cielos dejando fuego a su paso. Su mirada puede derretir el acero.",
    attack: 3200,
    defense: 2500,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    name: "Caballero de la Aurora",
    description: "Un valiente guerrero que protege el reino con su espada de luz sagrada.",
    attack: 2100,
    defense: 1800,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    name: "Hechicera del Viento",
    description: "Controla los vientos del norte para confundir y dispersar a sus enemigos.",
    attack: 1700,
    defense: 1400,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    name: "Lobo de Sombras",
    description: "Un depredador nocturno que caza en silencio bajo la luz de la luna.",
    attack: 1900,
    defense: 1200,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    name: "Mecha-Titán ZX9",
    description: "Una máquina de guerra avanzada diseñada para dominar el campo de batalla con precisión robótica.",
    attack: 2800,
    defense: 3000,
    image: "/YugiOhCardPlaceholder.jpg"
  }
];


export function Coleccion() {
  return (
    <div className='CollectionContainer'>
      <h1>Mi Colección</h1>
      
      <div className='CardsContainer'>
        {
          placeholderCards.map((value, index) =>{
            return <CardCollectionItem key={index} name={value.name} description={value.description} attack={value.attack} defense={value.defense} image={value.image}/>
          })
        }
      </div>
      <Link to="/" className='ShopButton'>Conseguir mas Cartas</Link>
    </div>
  );
}