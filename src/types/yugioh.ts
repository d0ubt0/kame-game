// src/types/yugioh.ts

// 1. Definimos la interfaz principal de una Carta Individual
// Actualizada con los nuevos campos
export interface Carta {
  id: number; // O string. Sigue siendo necesario para el CRUD.
  name: string;
  image: string; // Nueva: Será una URL a la imagen
  description: string; // Nueva
  attack: number; // Nueva
  defense: number; // Nueva
  price: number;
}

// 2. Definimos el tipo para los datos del formulario (todo menos el 'id')
export type CartaFormData = Omit<Carta, 'id'>;

export interface Paquete {
  id: number; // O string. Sigue siendo necesario para el CRUD.
  name: string;
  image: string; // Nueva: Será una URL a la imagen
  price: number;
  cards: string[]; // Nueva: Lista de cartas incluidas en el paquete
}

// 2. Definimos el tipo para los datos del formulario (todo menos el 'id')
export type PaqueteFormData = Omit<Paquete, 'id'>;