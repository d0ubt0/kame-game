import "./CardCollectionItem.css";

interface ICardCollectionItem {
  name: string;
  description: string;
  attack: number;
  defense: number;
  image: string;
  cantidad: number; 
}

export function CardCollectionItem({
  name,
  description,
  attack,
  defense,
  image,
  cantidad
}: ICardCollectionItem) {
  return (
    <article className="CardCollectionItemContainer">
      <img src={image} alt={name} />
      <span className="QuantityText">{cantidad}</span>
      <h2 className="CardCollectionItemName">{name}</h2>
      <p className="CardCollectionItemDescription">{description}</p>
      <div className="CardCollectionItemAttributes">
        <span>ATK: {attack}</span>
        <span>DEF: {defense}</span>
      </div>
    </article>
  );
}
