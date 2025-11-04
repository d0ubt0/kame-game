import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { PaymentForm } from './Carrito/PaymentForm';
import './Carrito.css'
import { placeholderCards, placeholderPacks } from '../db/db';
import { CartItem } from './Carrito/CartItem';

// Tipo base de producto (usa los datos de tu db)
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export function Carrito({selectedCards, setSelectedCards}:
  {selectedCards: Set<number>; setSelectedCards: (cards: Set<number>) => void}) {

  /*const [cart, setCart] = useState<Product[]>([
    {
      id: 1,
      name: "Signed Japanese Blue-Eyes White Dragon",
      price: 14000,
      image: "/cards/blue-eyes.jpg",
      quantity: 1,
    },
  ]); 
  
  const handleIncrease = (id: number) =>
    setCart(cart.map(p => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));

  const handleDecrease = (id: number) =>
    setCart(cart.map(p => (p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)));

  const handleRemove = (id: number) =>
    setCart(cart.filter(p => p.id !== id)); */


  const products = Array.from(selectedCards);

  const allProducts = [...placeholderCards, ...placeholderPacks];
  //const productsInCart = allProducts.filter(p => selectedCards.has(p.id));

  // Estado del carrito con cantidad
  const [cart, setCart] = useState<Product[]>([]);

   // Cada vez que cambian los seleccionados, actualizamos el carrito
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

  // Calcular total
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

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
              <h3>Total:</h3>
              <p>${total.toLocaleString()}</p>
            </div>

          </>)}
          
        </div>
        <div className='panel-formulario'>
          <PaymentForm />
        </div>
        
      </div>

      {/*
     
      <Link to="/">Volver al Inicio</Link>*/}
    </div>
  );
  
}