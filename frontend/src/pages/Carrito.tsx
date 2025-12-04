import { useState, useEffect } from 'react';
import { PageTitle } from '../components/PageTitle';
import { PaymentForm } from './Carrito/PaymentForm';
import './Carrito.css'
import { CartItem } from './Carrito/CartItem';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

// Actualizamos la interfaz para incluir 'cards' (opcional, solo para paquetes)
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'card' | 'pack';
  cards?: any[]; // <--- ¡ESTO FALTABA!
}

export function Carrito({selectedCards, setSelectedCards}:
  {selectedCards: Set<number>; setSelectedCards: (cards: Set<number>) => void}) {

  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [cardsRes, packsRes] = await Promise.all([
          fetch('http://localhost:3001/api/cards'),
          fetch('http://localhost:3001/api/packs') // Este endpoint ya trae las cartas dentro
        ]);

        const cardsData = await cardsRes.json();
        const packsData = await packsRes.json();

        // Unimos todo identificando el tipo
        const allProducts = [
          ...cardsData.map((c: any) => ({ ...c, type: 'card' })),
          ...packsData.map((p: any) => ({ ...p, type: 'pack' }))
        ];

        // Filtramos los seleccionados
        const selectedProducts = allProducts
          .filter((p: any) => selectedCards.has(p.id))
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            type: p.type,
            quantity: 1,
            // --- CORRECCIÓN CRÍTICA AQUÍ ---
            // Si el producto tiene la propiedad 'cards' (es un paquete), ¡la guardamos!
            cards: p.cards || [] 
          }));

        setCart(selectedProducts);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (selectedCards.size > 0) {
      fetchProducts();
    } else {
      setCart([]);
      setIsLoadingProducts(false);
    }
  }, [selectedCards]);

  // --- Lógica del Carrito (Sin cambios) ---
  const handleIncrease = (id: number) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const handleDecrease = (id: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  const handleRemove = (id: number) => {
    const newCart = cart.filter((p) => p.id !== id);
    setCart(newCart);
    const newSelected = new Set(selectedCards);
    newSelected.delete(id);
    setSelectedCards(newSelected);
    localStorage.setItem('selectedCards', JSON.stringify(Array.from(newSelected)));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar la compra.");
      navigate("/login");
      return;
    }

    const purchasedPacks = cart.filter(p => p.type === 'pack');
    const purchasedSingles = cart.filter(p => p.type === 'card');

    try {
      const response = await fetch('http://localhost:3001/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cart 
        })
      });

      if (!response.ok) throw new Error("Error en el pago");

      // Guardamos la compra en local con TODOS los datos (incluyendo las cartas dentro de los paquetes)
      localStorage.setItem(
        "lastPurchase",
        JSON.stringify({ packs: purchasedPacks, singles: purchasedSingles })
      );

      setCart([]);
      setSelectedCards(new Set());
      localStorage.removeItem("selectedCards");

      navigate("/Carrito/PagoAnimacion", { 
        state: { packs: purchasedPacks, singles: purchasedSingles } 
      });

    } catch (error) {
      console.error(error);
      alert("Hubo un problema procesando tu compra.");
    }
  };


  if (isLoadingProducts) {
    return <div style={{color:'white', textAlign:'center', marginTop: '50px'}}>Cargando carrito...</div>;
  }

  return (
    <div>
      <PageTitle title='Carrito'/>

      <div className='panel-carrito'>
        <div className='carrito'>
          {cart.length === 0 
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
        
        {cart.length > 0 && (
           <PaymentForm onPay={handlePay}/>
        )}
      </div>
    </div>
  )
}