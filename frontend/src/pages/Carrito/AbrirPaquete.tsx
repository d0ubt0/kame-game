import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeholderPacks, placeholderCards } from "../../db/db";
import "./AbrirPaquete.css";

export function AbrirPaquete() {
  const location = useLocation();
  const navigate = useNavigate();
  const purchasedPacks = location.state?.packs || [];
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [cardsToShow, setCardsToShow] = useState<any[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);
  const expandedPacks = purchasedPacks.flatMap((pack: any) =>
    Array(pack.quantity || 1).fill(pack)
  );

  useEffect(() => {
    if (expandedPacks.length === 0) return;
    setOpened(false);

    const timer = setTimeout(() => {
      const currentPack = expandedPacks[currentPackIndex];
      const packInfo = placeholderPacks.find((p) => p.id === currentPack.id);

      if (packInfo) {
        const packCards = packInfo.cards
          .map((cardId) => placeholderCards.find((c) => c.id === Number(cardId)))
          .filter(Boolean);

        setCardsToShow(packCards);
        setAllCards((prev) => [...prev, ...packCards]);
        setOpened(true);
      }
    }, 2500); // animación de apertura (2.5s)

    return () => clearTimeout(timer);
  }, [currentPackIndex]);

  const handleNextPack = () => {
    if (currentPackIndex < expandedPacks.length - 1) {
      setCurrentPackIndex(currentPackIndex + 1);
    } else {
      setOpened(true);
      setCardsToShow(allCards);
    }
  };

  const handleGoToCollection = () => {
    navigate("/coleccion");
  };

  if (expandedPacks.length === 0) {
    return <p>No hay paquetes para abrir 😅</p>;
  }

  const currentPack = expandedPacks[currentPackIndex];

  return (
    <div className="abrirpaquete-container">
      {!opened ? (
        <div className="paquete-cerrado">
          <div className="sobre"></div>
          <p>Abriendo paquete {currentPack.name}...</p>
        </div>
      ) : (
        <div className="cartas-reveladas">
          <h2>🎉 {currentPackIndex < expandedPacks.length - 1 ? "Cartas obtenidas" : "¡Todas tus cartas!"}</h2>

          <div className="cartas-grid">
            {cardsToShow.map((card) => (
              <div key={card.id} className="carta-item">
                <img src={card.image} alt={card.name} />
                <p>{card.name}</p>
              </div>
            ))}
          </div>

          {currentPackIndex < expandedPacks.length - 1 ? (
            <button className="coleccion-btn" onClick={handleNextPack}>
              Abrir siguiente paquete
            </button>
          ) : (
            <button className="coleccion-btn" onClick={handleGoToCollection}>
              Ir a mi colección
            </button>
          )}
        </div>
      )}
    </div>
  );
}
