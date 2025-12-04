export interface CartaEnJuego {
  id: number;
  name: string;
  attack: number;
  defense: number;
  hp: number;
  image: string;
  uid: string;      
}


export interface Jugador {
  nombre: string;
  vida: number;
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

const makeUid = () => Math.random().toString(36).slice(2) + Date.now();

export function generarBarajaCpu(cantidad: number): CartaEnJuego[] {
  const cartasBase = JSON.parse(localStorage.getItem("cartas") || "[]");
  const aleatorias = [...cartasBase].sort(() => 0.5 - Math.random()).slice(0, cantidad);

  return aleatorias.map((c: any) => ({
    id: c.id,
    name: c.name,
    attack: c.attack,
    defense: c.defense,
    hp: c.defense,
    image: c.image,
    uid: makeUid(), 
  }));
}


// Función auxiliar para formatear cartas crudas a formato de batalla
const prepararMazo = (cartas: any[]): CartaEnJuego[] => {
  return cartas.map((c: any) => ({
    id: c.id,
    name: c.name,
    attack: c.attack,
    defense: c.defense,
    hp: c.defense, // El HP inicial es la defensa
    image: c.image,
    uid: makeUid(), // Generamos ID único para la batalla
  }));
};
export function inicializarPartida(cartasJugador: any[], cartasCpuExternas?: any[]): EstadoBatalla {
  
  // Preparamos mazo del Jugador
  const barajaJugador = prepararMazo(cartasJugador);
  
  // Preparamos mazo de la CPU (si vienen de fuera, las usamos; si no, generamos random)
  let barajaCpu: CartaEnJuego[] = [];
  
  if (cartasCpuExternas && cartasCpuExternas.length > 0) {
    barajaCpu = prepararMazo(cartasCpuExternas);
  } else {
    // Fallback: Generar aleatorias si no hay nada en localStorage
    barajaCpu = generarBarajaCpu(10); 
  }

  const manoJugador = barajaJugador.splice(0, 5);
  const manoCpu = barajaCpu.splice(0, 5);

  return {
    jugador: {
      nombre: "Jugador",
      vida: 8000,
      baraja: barajaJugador,
      mano: manoJugador,
      campo: [null, null, null, null],
    },
    cpu: {
      nombre: "CPU",
      vida: 8000,
      baraja: barajaCpu,
      mano: manoCpu,
      campo: [null, null, null, null],
    },
    turno: "jugador",
    ronda: 1,
    log: ["¡La batalla ha comenzado!"],
  };
}
