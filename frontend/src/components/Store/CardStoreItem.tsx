import { useState } from "react";
import "./CardStoreItem.css";
import { Toast } from './Toast';

interface ICardStoreItem {
  id: number, 
  name: string,
  image: string,
  price: number,
  isSelected: boolean,
  addStoreItemFunction: (id: number) => void  
}

export function CardStoreItem({
  id,
  name,
  image,
  price,
  isSelected,
  addStoreItemFunction
}: ICardStoreItem) {
  const [showToast, setShowToast] = useState(false);
  const textButton = isSelected ? 'Agregado' : 'Añadir al carrito';
  const classButton = isSelected ? 'Selected' : 'NoSelected';

  const handleAddToCart = () => {
    if (!isSelected) {
      addStoreItemFunction(id);
      setShowToast(true);
    }
  };

  return (
    <>
      <article className="CardStoreItemContainer">
        <img src={image} alt={name} />
        <h2 className="CardStoreItemName">{name}</h2>
        <span className="CardStoreItemPrice">Price: {price}</span>
        <button
          className={classButton}
          type="button"
          onClick={handleAddToCart}
        >
          {textButton}
        </button>
      </article>

      {showToast && (
        <Toast
          message={`${name} añadida al carrito!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}