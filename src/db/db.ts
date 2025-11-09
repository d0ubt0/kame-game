import type { Carta, Paquete, Usuario } from "./yugioh";

export const placeholderCards: Carta[] = [
  {
    id: 1,
    name: "Dragón Escarlata",
    description: "Una criatura legendaria que surca los cielos dejando fuego a su paso. Su mirada puede derretir el acero.",
    attack: 3200,
    defense: 2500,
    price: 2500,
    image: "https://th.bing.com/th/id/OIP.S0YjO1-ltrg6XD6cVtVPAAHaK3?w=202&h=296&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
  },
  {
    id: 2,
    name: "Caballero de la Aurora",
    description: "Un valiente guerrero que protege el reino con su espada de luz sagrada.",
    attack: 2100,
    defense: 1800,
    price: 3500,
    image: "https://th.bing.com/th/id/OIP.pi27Uw_gkqKbDxvDTqpW1wHaK3?w=131&h=192&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
  },
  {
    id: 3,
    name: "Hechicera del Viento",
    description: "Controla los vientos del norte para confundir y dispersar a sus enemigos.",
    attack: 1700,
    defense: 1400,
     price: 4500,
    image: "https://th.bing.com/th/id/OIP.hjVFxzw7SfdKwHw1vSIm-AAAAA?w=115&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
  },
  {
    id: 4,
    name: "Lobo de Sombras",
    description: "Un depredador nocturno que caza en silencio bajo la luz de la luna.",
    attack: 1900,
    defense: 1200,
     price: 5500,
    image: "https://th.bing.com/th/id/OIP.VrfJC7IOAMRD3iscq8OYoQHaK5?w=128&h=189&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
  },
  {
    id: 5,
    name: "Mecha-Titán ZX9",
    description: "Una máquina de guerra avanzada diseñada para dominar el campo de batalla con precisión robótica.",
    attack: 2800,
    defense: 3000,
    price: 6500,
    image: "/YugiOhCardPlaceholder.jpg"
  },
  {
    id: 6,
    name: "Dragón Serpiente de la Noche",
    description: "Un dragón creado a partir del alma de un caballero malvado",
    attack: 2350,
    defense: 2400,
    price: 6000,
    image: "https://tse3.mm.bing.net/th/id/OIP.zPhama75YMFVnZDQv_VOkQAAAA?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 7,
    name: "Caballero Pingüino",
    description: "Cuando esta carta es mandada de tu Deck al Cementerio por el efecto de una carta controlada por tu adversario, une las cartas en tu Cementerio con tu Deck, barájalas y forma un nuevo Deck.",
    attack: 900,
    defense: 800,
    price: 5000,
    image: "https://th.bing.com/th/id/OIP.hR-c2ewZ_Ev8h8SAcTbM4QAAAA?w=202&h=295&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
  },
  {
    id: 8,
    name: "Nuzzler Male",
    description: "Monstruo equipado con 700 ATK",
    attack: 700,
    defense: 100,
    price: 1000,
    image: "https://i.ebayimg.com/images/g/UvEAAOSwnWth4b9b/s-l1600.png"
  },
  {
    id: 9,
    name: "Reina Pájaro",
    description: "Este monstruo ataca a sus enemigos usando su enorme pico.",
    attack: 1200,
    defense: 2000,
    price: 35000,
    image: "https://preview.redd.it/reina-p%C3%A1jaro-cartas-de-yugioh-en-espa%C3%B1ol-v0-tf7yei2prura1.jpg?width=320&crop=smart&auto=webp&s=64efed81e415a339475876d8a4ff4479b0eb3c51"
  },
  {
    id: 10,
    name: "Guardián de la Sala del Trono",
    description: "Un robot guardia construido para proteger salas del trono, está armado con misiles rastreadores.",
    attack: 1650,
    defense: 1600,
    price: 4500,
    image: "https://tse2.mm.bing.net/th/id/OIP.iGr2A8gFKNXQcxQGOdLLoAHaKy?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 11,
    name: "Bruja Oscura",
    description: "Una criatura popular en la mitología que realiza ataques fatales con una lanza afilada.",
    attack: 1800,
    defense: 1700,
    price: 4500,
    image: "https://tse1.mm.bing.net/th/id/OIP.ts0EdcxHsuS2RDcmBA703wHaK8?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 12,
    name: "Kappa Psíquico",
    description: "Un anfibio con miríada de poderes para escudarlo de los ataques enemigos.",
    attack: 400,
    defense: 1000,
    price: 2000,
    image: "https://tse1.mm.bing.net/th/id/OIP.Qhgc0q2RSoL-5ctwbLa4xwHaKr?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 13,
    name: "Espadachín Místico LV4",
    description: "El mejor espadachín del reino y encima mistico",
    attack: 1900,
    defense: 1600,
    price: 5000,
    image: "https://cdn.cardsrealm.com/images/cartas/dr3-dark-revelation-volume-3/en/med/mystic-swordsman-lv4-en012.png?8074?&width=250"
  }
];

export const placeholderPacks: Paquete[] = [
  { id: 201, name: "Sobre Leyendas del Dragón Blanco", price: 8500, image: "https://www.yugioh-card.com/lat-am/wp-content/uploads/2022/12/LOB_25th_550.png", cards: ['1','2','3'] },
  { id: 202, name: "Paquete Caos del Infinito", price: 7200, image: "https://www.yugioh-card.com/lat-am/wp-content/uploads/2022/12/IOC_25th_550.png", cards: ['1','3','4'] },
  { id: 203, name: "Caja Fusión del Destino", price: 12000, image: "https://www.yugioh-card.com/lat-am/wp-content/uploads/2024/02/BLTR_Foil_550x550.png", cards: ['1','3','5'] },
  { id: 204, name: "Mega Pack del Duelista", price: 9500, image: "https://www.yugioh-card.com/lat-am/wp-content/uploads/2021/07/BODE_550.png", cards: ['1','2','3'] }
];


export const placeholderUsers: Usuario[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@admin.com",
    password: "admin123",
    role: "admin",
    coleccion: [] // admin no necesita cartas
  },
  {
    id: 2,
    username: "duelista",
    email: "duelista@correo.com",
    password: "12345",
    role: "cliente",
    coleccion: [
      { cartaId: 1, cantidad: 2 },
      { cartaId: 3, cantidad: 1 },
      { cartaId: 4, cantidad: 4 },
      { cartaId: 6, cantidad: 1 },
      { cartaId: 7, cantidad: 1 },
      { cartaId: 8, cantidad: 1 },
      { cartaId: 9, cantidad: 1 },
      { cartaId: 10, cantidad: 1 },
      { cartaId: 11, cantidad: 1 },
      { cartaId: 2, cantidad: 1 },
    ]
  }
];