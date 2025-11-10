import { useState, useEffect } from 'react';
import { PageTitle } from '../components/PageTitle';
import { PaymentForm } from './Carrito/PaymentForm';
import './Carrito.css'
import { placeholderCards, placeholderPacks } from '../db/db';
import { CartItem } from './Carrito/CartItem';
import { useNavigate } from "react-router-dom";



interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}


export function Carrito({selectedCards, setSelectedCards}:
  {selectedCards: Set<number>; setSelectedCards: (cards: Set<number>) => void}) {

  const navigate = useNavigate();

  const products = Array.from(selectedCards);

  const allProducts = [...placeholderCards, ...placeholderPacks];
 

  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const selectedProducts = allProducts
      .filter((p) => selectedCards.has(p.id))
      .map((p) => ({
        ...p,
        quantity: 1, // cantidad inicial
      }));
    setCart(selectedProducts);
  }, [selectedCards]);

  // Incrementar cantidad
  const handleIncrease = (id: number) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  // Decrementar cantidad (mínimo 1)
  const handleDecrease = (id: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  // Eliminar del carrito
  const handleRemove = (id: number) => {
    const updatedSet = new Set(selectedCards);
    updatedSet.delete(id);
    setSelectedCards(updatedSet);
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handlePayment = () => {
  if (cart.length === 0) {
    alert("🛒 Su carrito está vacío. Será redirigido a la tienda.");
    navigate("/");
    return;
  }

  const userStorage = localStorage.getItem("user");
  let user = userStorage ? JSON.parse(userStorage) : { coleccion: [] };

  const nuevaColeccion = [...user.coleccion];

  const purchasedPacks = cart.filter(item =>
    placeholderPacks.some(pack => pack.id === item.id)
  );
  const purchasedSingles = cart.filter(item =>
    placeholderCards.some(card => card.id === item.id)
  );

  cart.forEach(item => {
    const pack = placeholderPacks.find(p => p.id === item.id);
    if (pack) {
      pack.cards.forEach(cardId => {
        const existente = nuevaColeccion.find((c: any) => c.cartaId === Number(cardId));
        if (existente) {
          existente.cantidad += item.quantity;
        } else {
          nuevaColeccion.push({ cartaId: Number(cardId), cantidad: item.quantity });
        }
      });
    } else {
      const existente = nuevaColeccion.find((c: any) => c.cartaId === item.id);
      if (existente) {
        existente.cantidad += item.quantity;
      } else {
        nuevaColeccion.push({ cartaId: item.id, cantidad: item.quantity });
      }
    }
  });

  // Guardar colección actualizada
  user.coleccion = nuevaColeccion;
  localStorage.setItem("user", JSON.stringify(user));

  //Guardar la última compra
  localStorage.setItem(
    "lastPurchase",
    JSON.stringify({ packs: purchasedPacks, singles: purchasedSingles })
  );

  // Limpiar carrito
  setCart([]);
  setSelectedCards(new Set());
  localStorage.removeItem("selectedCards");

  // Redirigir a la animación
  navigate("/Carrito/PagoAnimacion", { state: { packs: purchasedPacks, singles: purchasedSingles } });
};



  

  return (
    <div>
      <PageTitle title='Carrito'/>

      <div className='panel-carrito'>
        <div className='carrito'>
          {products.length === 0 
          ?(<p>El Carrito está vacio.</p>)
          :(
          <>
            {cart.map(product => (
              <CartItem
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                quantity={product.quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
              ))}
            <div className="carrito-total">
              <h3>Total a pagar:</h3>
              <p>${total.toLocaleString()}</p>
            </div>

          </>)}
          
        </div>
        <div className='panel-formulario'>
          <PaymentForm onPay={handlePayment}/>
        </div>
        
      </div>

    </div>
  );
  
}