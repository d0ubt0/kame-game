import { turnoCPU } from "./cpuLogic";
import { robarCarta, ambosSinCartas } from "./helpers";


export function resolverCombate(estado: any): any {
  let nuevoEstado = { ...estado };
  let logTurno: string[] = [];

  // --- Ataques del jugador ---
  for (let i = 0; i < 4; i++) {
    const atacante = nuevoEstado.jugador.campo[i];
    if (!atacante || atacante.isEmpty) continue;

    const defensor = nuevoEstado.cpu.campo[i];
    if (defensor && !defensor.isEmpty) {
      defensor.hp -= atacante.attack;
      defensor.hp = Math.max(defensor.hp, 0);
      logTurno.push(
        `${atacante.name} atacó a ${defensor.name} causando ${atacante.attack} de daño.`
      );
      if (defensor.hp <= 0) {
        nuevoEstado.cpu.campo[i] = { isEmpty: true };
        logTurno.push(`${defensor.name} fue destruido.`);
      }
    } else {
      nuevoEstado.cpu.vida -= atacante.attack;
      logTurno.push(
        `${atacante.name} atacó directamente causando ${atacante.attack} de daño.`
      );
    }
  }

  // --- Ataques de la CPU ---
  for (let i = 0; i < 4; i++) {
    const atacante = nuevoEstado.cpu.campo[i];
    if (!atacante || atacante.isEmpty) continue;

    const defensor = nuevoEstado.jugador.campo[i];
    if (defensor && !defensor.isEmpty) {
      defensor.hp -= atacante.attack;
      defensor.hp = Math.max(defensor.hp, 0);
      logTurno.push(
        `La CPU atacó con ${atacante.name} causando ${atacante.attack} de daño a ${defensor.name}.`
      );
      if (defensor.hp <= 0) {
        nuevoEstado.jugador.campo[i] = { isEmpty: true };
        logTurno.push(`${defensor.name} fue destruido.`);
      }
    } else {
      nuevoEstado.jugador.vida -= atacante.attack;
      logTurno.push(`La CPU atacó directamente causando ${atacante.attack} de daño.`);
    }
  }

  // --- CPU coloca nuevas cartas ---
  const { cpu, logCpu } = turnoCPU(nuevoEstado);
  nuevoEstado.cpu = cpu;
  logTurno.push(...logCpu);

  // --- Robar cartas ---
  robarCarta(nuevoEstado.jugador, logTurno, "El jugador");
  robarCarta(nuevoEstado.cpu, logTurno, "La CPU");

  // --- Verificar victoria ---
  if (nuevoEstado.jugador.vida <= 0 || nuevoEstado.cpu.vida <= 0) {
    const ganador =
      nuevoEstado.jugador.vida > 0
        ? "¡Ganaste la batalla!"
        : "Perdiste la batalla...";
    logTurno.push(ganador);
    alert(ganador);
    nuevoEstado.log = [...nuevoEstado.log, ...logTurno];
    return nuevoEstado;
  }

  // --- Verificar agotamiento ---
  if (ambosSinCartas(nuevoEstado)) {
    const resultado =
      nuevoEstado.jugador.vida > nuevoEstado.cpu.vida
        ? "¡Ganaste por resistencia!"
        : nuevoEstado.cpu.vida > nuevoEstado.jugador.vida
        ? "La CPU ganó por resistencia."
        : "¡Empate!";
    logTurno.push(resultado);
    alert(resultado);
  }

  nuevoEstado.ronda++;
  nuevoEstado.log = [...nuevoEstado.log, ...logTurno];
  return nuevoEstado;
}
