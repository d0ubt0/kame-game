import type { Carta, Paquete } from "../types/yugioh";

export const placeholderCards: Carta[] = [
  {
    id: 1,
    name: "Dragón Escarlata",
    description: "Una criatura legendaria que surca los cielos dejando fuego a su paso. Su mirada puede derretir el acero.",
    attack: 3200,
    defense: 2500,
    price: 2500,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 2,
    name: "Caballero de la Aurora",
    description: "Un valiente guerrero que protege el reino con su espada de luz sagrada.",
    attack: 2100,
    defense: 1800,
    price: 3500,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 3,
    name: "Hechicera del Viento",
    description: "Controla los vientos del norte para confundir y dispersar a sus enemigos.",
    attack: 1700,
    defense: 1400,
     price: 4500,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 4,
    name: "Lobo de Sombras",
    description: "Un depredador nocturno que caza en silencio bajo la luz de la luna.",
    attack: 1900,
    defense: 1200,
     price: 5500,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 5,
    name: "Mecha-Titán ZX9",
    description: "Una máquina de guerra avanzada diseñada para dominar el campo de batalla con precisión robótica.",
    attack: 2800,
    defense: 3000,
    price: 6500,
    image: "/YugiOhCardPlaceholder.jpg"
  }
];

export const placeholderPacks: Paquete[] = [
  { id: 201, name: "Sobre Leyendas del Dragón Blanco", price: 8500, image: "/packPlaceholder.png", cards: ['1','2','3'] },
  { id: 202, name: "Paquete Caos del Infinito", price: 7200, image: "/packPlaceholder.png", cards: ['1','3','4'] },
  { id: 203, name: "Caja Fusión del Destino", price: 12000, image: "/packPlaceholder.png", cards: ['1','3','5'] },
  { id: 204, name: "Mega Pack del Duelista", price: 9500, image: "/packPlaceholder.png", cards: ['1','2','3'] }
];