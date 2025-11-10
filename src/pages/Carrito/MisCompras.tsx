import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MisCompras.css';

export function MisCompras() {
  const location = useLocation();
  const navigate = useNavigate();

  const [purchasedPacks, setPurchasedPacks] = useState<any[]>([]);
  const [purchasedSingles, setPurchasedSingles] = useState<any[]>([]);

  useEffect(() => {
    const packsFromState = location.state?.packs;
    const singlesFromState = location.state?.singles;

    if (packsFromState || singlesFromState) {
      setPurchasedPacks(packsFromState || []);
      setPurchasedSingles(singlesFromState || []);
    } else {
      const savedPurchase = localStorage.getItem('lastPurchase');
      if (savedPurchase) {
        try {
          const parsed = JSON.parse(savedPurchase);
          setPurchasedPacks(parsed.packs || []);
          setPurchasedSingles(parsed.singles || []);
        } catch (err) {
          console.error('Error leyendo compras guardadas:', err);
        }
      }
    }

    return () => {
      localStorage.removeItem('lastPurchase');
    };
  }, [location.state]);

  const groupedSingles = Object.values(
    purchasedSingles.reduce((acc: any, card: any) => {
      const key = (card.id !== undefined ? String(card.id) : (card.name || '').toLowerCase().trim());
      const qty = Number(card.quantity ?? card.count ?? 1); // usa quantity si existe, sino count = 1

      if (!acc[key]) {
        acc[key] = { ...card, count: qty };
      } else {
        acc[key].count += qty;
      }
      return acc;
    }, {})
  );

  const handleOpenPacks = () => {
    navigate('/Carrito/AbrirPaquete', { state: { packs: purchasedPacks } });
  };

  const handleGoToCollection = () => {
    navigate('/coleccion');
  };

  return (
    <div className="miscompras-container">
      <h2>🛍️ Tus Compras Recientes</h2>

      {groupedSingles.length > 0 && (
        <div className="compras-section">
          <h3>Cartas Individuales</h3>
          <div className="compras-grid">
            {groupedSingles.map((card: any, index: number) => (
              <div key={card.id ?? index} className="compra-item">
                <img src={card.image} alt={card.name} />
                <p>{card.name}</p>
                {card.count > 1 && <span className="contador">×{card.count}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {purchasedPacks.length > 0 && (
        <div className="compras-section">
          <h3>Paquetes Comprados</h3>
          <div className="compras-grid">
            {purchasedPacks.map((pack: any) => (
              <div key={pack.id} className="compra-item">
                <img src={pack.image} alt={pack.name} />
                <p>{pack.name}</p>
                {pack.quantity > 1 && <span className="contador">×{pack.quantity}</span>}
              </div>
            ))}
          </div>
          <button onClick={handleOpenPacks}>Abrir Paquetes</button>
        </div>
      )}

      {groupedSingles.length === 0 && purchasedPacks.length === 0 && (
        <p className="no-compras">No tienes compras recientes 😅</p>
      )}

      <button className="coleccion-btn" onClick={handleGoToCollection}>
        Ir a mi colección
      </button>
    </div>
  );
}
