/**
 * Lógica de colocación de cartas de la CPU.
 * Intenta siempre colocar una carta frente al jugador si hay espacio.
 */
export function turnoCPU(nuevoEstado: any) {
  const logCpu: string[] = [];
  const cpu = { ...nuevoEstado.cpu };

  for (let i = 0; i < 4; i++) {
    const cartaJugador = nuevoEstado.jugador.campo[i];
    const slotVacio = !cpu.campo[i];
    const tieneCarta = cpu.mano.length > 0;

    if (cartaJugador && slotVacio && tieneCarta) {
      const cartaCpu = cpu.mano.shift();
      cpu.campo[i] = { ...cartaCpu, turnoColocada: nuevoEstado.ronda };
      logCpu.push(
        `La CPU colocó ${cartaCpu.name} frente a tu ${cartaJugador.name}.`
      );
    }
  }

  // Si aún hay espacios vacíos y cartas disponibles, coloca aleatoriamente
  for (let i = 0; i < 4 && cpu.mano.length > 0; i++) {
    if (!cpu.campo[i]) {
      const cartaCpu = cpu.mano.shift();
      cpu.campo[i] = { ...cartaCpu, turnoColocada: nuevoEstado.ronda };
      logCpu.push(`La CPU colocó ${cartaCpu.name} en un slot libre.`);
    }
  }

  return { cpu, logCpu };
}
