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

export function inicializarPartida(cartasJugador: any[]): EstadoBatalla {
  const barajaJugador: CartaEnJuego[] = cartasJugador.map((c: any) => ({
    id: c.id,
    name: c.name,
    attack: c.attack,
    defense: c.defense,
    hp: c.defense,
    image: c.image,
    uid: makeUid(), 
  }));

  const barajaCpu = generarBarajaCpu(cartasJugador.length);

  return {
    jugador: {
      nombre: "Tú",
      vida: 8000,
      baraja: barajaJugador,
      mano: barajaJugador.splice(0, 5),
      campo: [null, null, null, null],
    },
    cpu: {
      nombre: "CPU",
      vida: 8000,
      baraja: barajaCpu,
      mano: barajaCpu.splice(0, 5),
      campo: [null, null, null, null],
    },
    turno: "jugador",
    ronda: 1,
    log: ["Comienza la partida."],
  };
}

