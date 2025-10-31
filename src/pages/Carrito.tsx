// import { Link } from 'react-router-dom';
// import { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { PaymentForm } from './Carrito/PaymentForm';
import './Carrito.css'

export function Carrito() {

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


  return (
    <div>
      <PageTitle title='Carrito'/>

      <div className='panel-carrito'>
        <div className='carrito'>
          {(<p>El Carrito está vacio.</p>)}
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