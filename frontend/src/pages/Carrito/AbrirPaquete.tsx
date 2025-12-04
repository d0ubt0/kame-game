import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AbrirPaquete.css";

export function AbrirPaquete() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Recuperar los paquetes. Si no vienen en el state, intentar recuperarlos (o array vacío)
  const purchasedPacks = location.state?.packs || [];
  
  // 2. Usamos useMemo para evitar que esta lista se regenere y reinicie la animación
  const expandedPacks = useMemo(() => {
    return purchasedPacks.flatMap((pack: any) =>
      Array(pack.quantity || 1).fill(pack)
    );
  }, [purchasedPacks]);

  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [cardsToShow, setCardsToShow] = useState<any[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]); // Para mostrar al final

  useEffect(() => {
    if (expandedPacks.length === 0) return;
    
    // Reiniciamos estado para el siguiente sobre
    setOpened(false); 
    
    const currentPack = expandedPacks[currentPackIndex];
    console.log("📦 Abriendo paquete:", currentPack.name, "Cartas adentro:", currentPack.cards);

    const timer = setTimeout(() => {
      // 3. SEGURIDAD TOTAL: Abrimos siempre, tengan o no cartas
      const packCards = currentPack.cards || [];
      
      setCardsToShow(packCards);
      setAllCards(prev => [...prev, ...packCards]);
      
      // ¡Esto desbloquea la pantalla!
      setOpened(true); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentPackIndex, expandedPacks]);

  const handleNextPack = () => {
    if (currentPackIndex < expandedPacks.length - 1) {
      setCurrentPackIndex(prev => prev + 1);
    } else {
      // Al final, mostramos el resumen de todo lo obtenido
      setOpened(true);
      setCardsToShow(allCards); 
    }
  };

  const handleGoToCollection = () => {
    navigate("/coleccion");
  };

  if (expandedPacks.length === 0) {
    return (
      <div className="abrirpaquete-container">
        <p style={{color: 'white', fontSize: '1.2rem'}}>No hay paquetes para abrir 😅</p>
        <button className="coleccion-btn" onClick={() => navigate('/Carrito/MisCompras')}>Volver</button>
      </div>
    );
  }

  const currentPack = expandedPacks[currentPackIndex];

  return (
    <div className="abrirpaquete-container">
      {!opened ? (
        // --- ESTADO CERRADO ---
        <div className="paquete-cerrado">
          <div className="sobre"></div> {/* Asegúrate de que tu CSS para .sobre tenga animación */}
          <p>Abriendo paquete {currentPack.name}...</p>
        </div>
      ) : (
        // --- ESTADO ABIERTO ---
        <div className="cartas-reveladas">
          <h2>🎉 {currentPackIndex < expandedPacks.length - 1 ? "Cartas obtenidas" : "¡Resumen Total!"}</h2>

          {cardsToShow.length === 0 ? (
             <p style={{color: '#aaa'}}>Este paquete venía vacío (Error de datos)</p>
          ) : (
            <div className="cartas-grid">
              {cardsToShow.map((card, index) => (
                <div key={`${card.id}-${index}`} className="carta-item">
                  <img src={card.image} alt={card.name} />
                  <p>{card.name}</p>
                </div>
              ))}
            </div>
          )}

          {currentPackIndex < expandedPacks.length - 1 ? (
            <button className="coleccion-btn" onClick={handleNextPack}>
              Abrir siguiente paquete ➡️
            </button>
          ) : (
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
               {/* Mostrar botón solo si es el resumen final */}
               <button className="coleccion-btn" onClick={handleGoToCollection}>
                Ir a mi colección 📚
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}