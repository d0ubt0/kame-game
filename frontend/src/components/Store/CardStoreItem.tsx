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

  // CAMBIO 1: Mejoramos el texto para que el usuario sepa que puede quitarla
  const textButton = isSelected ? 'Quitar del carrito' : 'Añadir al carrito';
  const classButton = isSelected ? 'Selected' : 'NoSelected';

  const handleAddToCart = () => {
    // CAMBIO 2: ¡Quitamos el if (!isSelected)!
    // Ahora la función se ejecuta SIEMPRE.
    // Tu lógica en Inicio.tsx se encargará de agregar o quitar según corresponda.
    addStoreItemFunction(id);

    // Opcional: Solo mostramos el Toast de "Añadido" cuando NO estaba seleccionado
    if (!isSelected) {
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