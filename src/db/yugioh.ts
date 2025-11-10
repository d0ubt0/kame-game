export interface Carta {
  id: number; 
  name: string;
  image: string; 
  description: string; 
  attack: number; 
  defense: number; 
  price: number;
}

export type CartaFormData = Omit<Carta, 'id'>;

export interface Paquete {
  id: number; 
  name: string;
  image: string; 
  price: number;
  cards: string[]; 
}

export type PaqueteFormData = Omit<Paquete, 'id'>;
export interface ColeccionItem {
  cartaId: number;
  cantidad: number;
}
export interface Usuario {
  id: number;
  username: string;
  email: string;
  password?: string; 
  role: 'admin' | 'cliente';
  coleccion?: ColeccionItem[];
}

export type UsuarioFormData = Omit<Usuario, 'id'>;

// Database

export interface CartaEnJuego {
  id: number;
  name: string;
  attack: number;
  defense: number;
  hp: number; 
  image: string;
  slot?: number; 
}

export interface Jugador {
  nombre: string;
  vida: number; // empieza en 8000
  baraja: CartaEnJuego[];
  mano: CartaEnJuego[];
  campo: (CartaEnJuego | null)[];
}

export interface EstadoBatalla {
  jugador: Jugador;
  cpu: Jugador;
  turno: "jugador" | "cpu";
  ronda: number;
  log: string[];
}
