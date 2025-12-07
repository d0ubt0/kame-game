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
  cards?: any[];
}

export function Carrito({selectedCards, setSelectedCards}:
  {selectedCards: Set<number>; setSelectedCards: (cards: Set<number>) => void}) {

  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // -----------------------
  // ⭐ Helper: leer localStorage de forma segura
  const readSavedCart = (): Product[] => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Normalizar: asegurar que cada saved tenga id numérico y quantity numérico
      return parsed.map((s: any) => ({
        id: Number(s.id),
        name: s.name || '',
        price: Number(s.price) || 0,
        image: s.image || '',
        quantity: Number(s.quantity) || 1,
        type: s.type || 'card',
        cards: s.cards || []
      }));
    } catch (e) {
      console.error("Error leyendo cart de localStorage:", e);
      return [];
    }
  };

  // -----------------------
  // ⭐ Al montar, intentamos restaurar carrito desde localStorage inmediatamente
  useEffect(() => {
    const saved = readSavedCart();
    if (saved.length > 0) {
      setCart(saved);
    }
    // No seteamos isLoading aquí; fetchProducts lo hará
  }, []);


  // -----------------------
  // ⭐ Fetch y merge: traemos datos de la API y los fusionamos con savedCart (prioridad savedCart.quantity)
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const [cardsRes, packsRes] = await Promise.all([
          fetch('http://localhost:3001/api/cards', { headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: "include"}),
          fetch('http://localhost:3001/api/packs', { headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: "include"}) // Este endpoint ya trae las cartas dentro
        ]);

        const cardsData = await cardsRes.json();
        const packsData = await packsRes.json();

        // Unimos todo identificando el tipo
        const allProducts = [
          ...cardsData.map((c: any) => ({ ...c, type: 'card' })),
          ...packsData.map((p: any) => ({ ...p, type: 'pack' }))
        ];

        // Leer savedCart (nuevamente) para fusionar
        const savedCart = readSavedCart();

        // 1) Si hay savedCart (persistido), reconstruimos el carrito según savedCart,
        //    pero completamos nombre/price/image/type/cards desde allProducts.
        // 2) Si no hay savedCart, usamos selectedCards como fuente y quantity = 1 (o lo que haya en savedCart).
        let finalCart: Product[] = [];

        if (savedCart.length > 0) {
          finalCart = savedCart.map((s) => {
            const prod = allProducts.find((ap: any) => Number(ap.id) === Number(s.id));
            return {
              id: Number(s.id),
              name: prod ? (prod.name ?? s.name) : s.name,
              price: prod ? (Number(prod.price) || s.price) : s.price,
              image: prod ? (prod.image ?? s.image) : s.image,
              type: prod ? (prod.type ?? s.type) : (s.type || 'card'),
              quantity: Number(s.quantity) || 1,
              cards: prod ? (prod.cards || s.cards || []) : (s.cards || [])
            } as Product;
          });

          // Adicional: si hay productos seleccionados (selectedCards) que no estaban en savedCart,
          // los agregamos con quantity = 1
          allProducts.forEach((ap: any) => {
            const idNum = Number(ap.id);
            if (selectedCards.has(idNum) && !finalCart.find(f => f.id === idNum)) {
              finalCart.push({
                id: idNum,
                name: ap.name,
                price: Number(ap.price) || 0,
                image: ap.image,
                type: ap.type,
                quantity: 1,
                cards: ap.cards || []
              });
            }
          });

        } else {
          // No hay savedCart -> construir desde selectedCards
          finalCart = allProducts
            .filter((p: any) => selectedCards.has(Number(p.id)))
            .map((p: any) => ({
              id: Number(p.id),
              name: p.name,
              price: Number(p.price) || 0,
              image: p.image,
              type: p.type,
              quantity: 1,
              cards: p.cards || []
            }));
        }

        setCart(finalCart);

      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCards]); // cuando cambien las selecciones, actualizamos (pero respetando saved quantities)


  // -----------------------
  // ⭐ Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Error guardando cart en localStorage:", e);
    }
  }, [cart]);

  // -----------------------
  // --- Lógica del Carrito (Sin cambios internos) ---
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

    // Actualizar selectedCards persistido (si usas localStorage para selectedCards)
    localStorage.setItem('selectedCards', JSON.stringify(Array.from(newSelected)));
    // Guardar carrito actualizado
    localStorage.setItem('cart', JSON.stringify(newCart));
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
        credentials: "include",
        headers: { 'Content-Type': 'application/json' ,"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },
        body: JSON.stringify({
          userId: user.id,
          items: cart 
        })
      });

      if (!response.ok) throw new Error("Error en el pago");

      localStorage.setItem(
        "lastPurchase",
        JSON.stringify({ packs: purchasedPacks, singles: purchasedSingles })
      );

      setCart([]);
      setSelectedCards(new Set());
      localStorage.removeItem("selectedCards");
      localStorage.removeItem("cart"); // limpiar carrito tras pagar

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
        
        <div className="panel-formulario">
          {cart.length > 0 && (
          <PaymentForm onPay={handlePay}/>
        )}
        </div>
      </div>
    </div>
  )
}
