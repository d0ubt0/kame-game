import { placeholderCards, placeholderPacks, placeholderUsers } from "../db/db";

export function initLocalData(force = false) {
  try {
    // === CARTAS ===
    const cards = localStorage.getItem("cartas");
    const parsedCards = cards ? JSON.parse(cards) : [];
    if (force || !Array.isArray(parsedCards) || parsedCards.length === 0) {
      localStorage.setItem("cartas", JSON.stringify(placeholderCards));
      console.log(`✅ ${force ? "Reiniciadas" : "Cargadas"} ${placeholderCards.length} cartas`);
    }

    // === PAQUETES ===
    const packs = localStorage.getItem("paquetes");
    const parsedPacks = packs ? JSON.parse(packs) : [];
    if (force || !Array.isArray(parsedPacks) || parsedPacks.length === 0) {
      localStorage.setItem("paquetes", JSON.stringify(placeholderPacks));
      console.log(`✅ ${force ? "Reiniciados" : "Cargados"} ${placeholderPacks.length} paquetes`);
    }

    // === USUARIOS ===
    const users = localStorage.getItem("users");
    const parsedUsers = users ? JSON.parse(users) : [];
    if (force || !Array.isArray(parsedUsers) || parsedUsers.length === 0) {
      localStorage.setItem("users", JSON.stringify(placeholderUsers));
      console.log(`✅ ${force ? "Reiniciados" : "Cargados"} ${placeholderUsers.length} usuarios`);
    }
  } catch (error) {
    console.error("❌ Error al inicializar datos locales:", error);
  }
}
