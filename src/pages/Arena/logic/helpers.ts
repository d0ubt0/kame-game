/** Roba una carta del tope de la baraja (si hay). */
export function robarCarta(jugador: any, log: string[], nombre: string) {
  if (jugador.baraja.length > 0) {
    const cartaRobada = jugador.baraja.shift();
    jugador.mano.push(cartaRobada);
    log.push(`${nombre} robó una carta (${cartaRobada.name}).`);
  } else {
    log.push(`${nombre} no tiene más cartas en su baraja.`);
  }
}

/** Determina si ambos jugadores ya no tienen cartas disponibles. */
export function ambosSinCartas(estado: any) {
  const sinJugador =
    estado.jugador.baraja.length === 0 &&
    estado.jugador.mano.length === 0 &&
    estado.jugador.campo.every((c: any) => !c);

  const sinCpu =
    estado.cpu.baraja.length === 0 &&
    estado.cpu.mano.length === 0 &&
    estado.cpu.campo.every((c: any) => !c);

  return sinJugador && sinCpu;
}
