import "./CardStoreItem.css";

interface ICardStoreItem {
  id: number, 
  name: string,
  image: string,
  price: number,
  isSelected: boolean,
  addStoreItemFunction: (id: number) => void  
}

export function CardStoreItem({id,name, image, price, isSelected, addStoreItemFunction}: ICardStoreItem) {
  const textButton = isSelected ? 'Agregado' : 'Anadir al carrito' 
  const classButton = isSelected ? 'Selected' : 'NoSelected'  

  return <article className="CardStoreItemContainer">
    <img src={image} alt={name} />
    <h2 className="CardStoreItemName">{name}</h2>
    <span>Price: {price}</span>
    <button className={classButton} type='button' onClick={() => addStoreItemFunction(id)}>{textButton}</button>
  </article>
}
