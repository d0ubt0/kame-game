import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PagoAnimacion.css';

export function PagoAnimacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedPurchase = JSON.parse(localStorage.getItem("lastPurchase") || "{}");

  const purchasedPacks = location.state?.packs || savedPurchase.packs || [];
  const purchasedSingles = location.state?.singles || savedPurchase.singles || [];  

  const [status, setStatus] = useState<'procesando' | 'exitoso'>('procesando');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('exitoso');

      if (!localStorage.getItem('lastPurchase')) {
        const purchaseData = {
          packs: purchasedPacks,
          singles: purchasedSingles,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('lastPurchase', JSON.stringify(purchaseData));
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  const handleViewPurchases = () => {
    navigate('/Carrito/MisCompras', {
      state: { packs: purchasedPacks, singles: purchasedSingles },
    });
  };

  return (
    <div className="pago-container">
      {status === 'procesando' ? (
        <div className="pago-procesando">
          <div className="spinner"></div>
          <p>Procesando pago...</p>
        </div>
      ) : (
        <div className="pago-exitoso">
          <h2>✅ ¡Pago exitoso!</h2>
          <button onClick={handleViewPurchases}>Ver mis compras</button>
        </div>
      )}
    </div>
  );
}
