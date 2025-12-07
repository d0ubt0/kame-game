import type { Carta } from "../db/yugioh";

export type CartaConCantidad = Carta & {
  cantidad: number;
};
