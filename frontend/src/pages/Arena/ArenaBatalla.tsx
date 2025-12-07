import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { inicializarPartida } from "./logic/batallaUtils";
import { useAnimacionCombate } from "./logic/useAnimacionCombate";
import "./Styles/arena.css";

// Clave para localStorage
const LOCAL_STORAGE_KEY = "estadoPartidaGuardada";

export default function ArenaBatalla() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<any | null>(null);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<any | null>(null);
  const { animaciones, activarAnimacion } = useAnimacionCombate();
  const [turnoActual, setTurnoActual] = useState<"jugador" | "cpu">("jugador");
  const [bloqueado, setBloqueado] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<string | null>(null);
  const [mostrarRendirse, setMostrarRendirse] = useState(false);

  // === Función para guardar el estado en localStorage ===
  const guardarEstado = (estadoActual: any, turno: string, cartaSel: any) => {
    const datosAGuardar = {
      estado: estadoActual,
      turnoActual: turno,
      cartaSeleccionada: cartaSel,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosAGuardar));
  };

  // === Función para cargar el estado guardado ===
  const cargarEstadoGuardado = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return null;
    
    try {
      const datos = JSON.parse(saved);
      // Verificar que los datos no sean demasiado viejos (ej. más de 1 hora)
      const fechaGuardado = new Date(datos.timestamp);
      const ahora = new Date();
      const horasDiferencia = (ahora.getTime() - fechaGuardado.getTime()) / (1000 * 60 * 60);
      
      if (horasDiferencia > 1) {
        console.log("Partida guardada muy antigua, descartando...");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return null;
      }
      
      return datos;
    } catch (error) {
      console.error("Error cargando partida guardada:", error);
      return null;
    }
  };

  // === Inicialización con carga de partida guardada ===
  useEffect(() => {
    // Primero intentar cargar partida guardada
    const partidaGuardada = cargarEstadoGuardado();
    
    if (partidaGuardada) {
      if (window.confirm("¿Quieres continuar la partida anterior?")) {
        // Cargar partida guardada
        setEstado(partidaGuardada.estado);
        setTurnoActual(partidaGuardada.turnoActual);
        setCartaSeleccionada(partidaGuardada.cartaSeleccionada);
        console.log("Partida cargada desde guardado");
        return;
      } else {
        // Usuario quiere empezar nueva partida, eliminar guardado
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    
    // Si no hay partida guardada o usuario quiere nueva, cargar desde cartas
    const seleccionadas = JSON.parse(
      localStorage.getItem("cartasSeleccionadas") || 
      localStorage.getItem("cartasPlayer") || "[]"
    );

    const cpuSeleccionadas = JSON.parse(
      localStorage.getItem("cartasCPU") || "[]"
    );

    if (seleccionadas.length < 10) {
      alert("Necesitas 10 cartas para entrar a la arena");
      navigate("/arena");
      return;
    }

    // Si la CPU no tiene cartas (ej. acceso directo por URL), podrías redirigir o dejar que inicializarPartida genere randoms
    if (cpuSeleccionadas.length < 10) {
       console.warn("La CPU no tiene cartas guardadas, se generarán aleatorias.");
    }

    // Llamamos a inicializar pasando AMBOS mazos
    const estadoInicial = inicializarPartida(seleccionadas, cpuSeleccionadas);
    setEstado(estadoInicial);
  }, []);

  // === Guardar automáticamente cuando cambia el estado, turno o carta seleccionada ===
  useEffect(() => {
    if (estado && !resultadoFinal) { // Solo guardar si hay estado y no hay resultado final
      guardarEstado(estado, turnoActual, cartaSeleccionada);
    }
  }, [estado, turnoActual, cartaSeleccionada, resultadoFinal]);

  // === Colocar carta ===
  const colocarCartaEnCampo = (slotIndex: number) => {
    if (turnoActual === "cpu") return;
    if (!estado || !cartaSeleccionada) return;
    if (estado.jugador.campo[slotIndex]) {
      alert("Ese slot ya está ocupado.");
      return;
    }

    const nuevaMano = [...estado.jugador.mano];
    const idx = nuevaMano.findIndex(
      (c: any) => c.uid === cartaSeleccionada.uid
    );
    if (idx === -1) return;

    nuevaMano.splice(idx, 1);
    const nuevoCampo = [...estado.jugador.campo];
    nuevoCampo[slotIndex] = {
      ...cartaSeleccionada,
      turnoColocada: estado.ronda,
    };

    const nuevoEstado = {
      ...estado,
      jugador: { ...estado.jugador, mano: nuevaMano, campo: nuevoCampo },
      log: [
        ...estado.log,
        `Colocaste ${cartaSeleccionada.name} en el slot ${slotIndex + 1}.`,
      ],
    };
    
    setEstado(nuevoEstado);
    setCartaSeleccionada(null);
  };

  // === Retirar carta ===
  const retirarCartaDelCampo = (slotIndex: number) => {
    if (turnoActual === "cpu") return;
    if (!estado) return;
    const carta = estado.jugador.campo[slotIndex];
    if (!carta) return;

    if (carta.turnoColocada !== estado.ronda) {
      alert("Solo puedes mover cartas colocadas en esta ronda.");
      return;
    }

    const nuevaMano = [...estado.jugador.mano, carta];
    const nuevoCampo = [...estado.jugador.campo];
    nuevoCampo[slotIndex] = null;

    const nuevoEstado = {
      ...estado,
      jugador: { ...estado.jugador, mano: nuevaMano, campo: nuevoCampo },
      log: [
        ...estado.log,
        `Retiraste ${carta.name} del slot ${slotIndex + 1}.`,
      ],
    };
    
    setEstado(nuevoEstado);
    if (cartaSeleccionada?.uid === carta.uid) setCartaSeleccionada(null);
  };

  // === Función para robar carta ===
  const robarCarta = (jugador: any, log: string[], nombre: string) => {
    if (jugador.baraja.length > 0) {
      const cartaRobada = jugador.baraja.shift();
      jugador.mano.push(cartaRobada);
      log.push(`${nombre} robó una carta (${cartaRobada.name}).`);
    } else {
      log.push(`${nombre} no tiene más cartas en su baraja.`);
    }
  };

  // === CPU coloca cartas ===
  const turnoCPU = (nuevoEstado: any) => {
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

    return { cpu, logCpu };
  };

  // === Ambos sin cartas ===
  const ambosSinCartas = (estado: any) => {
    const sinJugador =
      estado.jugador.baraja.length === 0 &&
      estado.jugador.mano.length === 0 &&
      estado.jugador.campo.every((c: any) => !c);

    const sinCpu =
      estado.cpu.baraja.length === 0 &&
      estado.cpu.mano.length === 0 &&
      estado.cpu.campo.every((c: any) => !c);

    return sinJugador && sinCpu;
  };

  // === Resolver combate secuencial ===
  const resolverCombate = async () => {
    if (!estado || bloqueado) return;
    setBloqueado(true);
    let nuevoEstado = { ...estado };
    let logTurno: string[] = [];

    const esperar = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const atacar = async (
      atacanteCampo: any[],
      defensorCampo: any[],
      atacanteTag: string,
      defensorTag: string,
      logPrefix: string
    ) => {
      for (let i = 0; i < 4; i++) {
        const atacante = atacanteCampo[i];
        const defensor = defensorCampo[i];
        if (!atacante) continue;

        activarAnimacion(`${atacanteTag}-${i}`, "ataque");
        await esperar(400);

        if (defensor) {
          activarAnimacion(`${defensorTag}-${i}`, "daño");
          defensor.hp -= atacante.attack;
          logTurno.push(
            `${logPrefix} atacó con ${atacante.name} a ${defensor.name} causando ${atacante.attack} de daño.`
          );
          if (defensor.hp <= 0) {
            activarAnimacion(`${defensorTag}-${i}`, "muerte");
            defensorCampo[i] = null;
            logTurno.push(`${defensor.name} fue destruido.`);
          }
        } else {
          if (defensorTag === "cpu") {
            nuevoEstado.cpu.vida -= atacante.attack;
            logTurno.push(
              `${logPrefix} atacó directamente causando ${atacante.attack} de daño.`
            );
            activarAnimacion("cpu-perfil", "perfil-daño");
          } else {
            nuevoEstado.jugador.vida -= atacante.attack;
            logTurno.push(
              `${logPrefix} atacó directamente causando ${atacante.attack} de daño.`
            );
            activarAnimacion("jugador-perfil", "perfil-daño");
          }
        }

        setEstado({ ...nuevoEstado });
        await esperar(900);
      }
    };

    if (turnoActual === "jugador") {
      await atacar(nuevoEstado.jugador.campo, nuevoEstado.cpu.campo, "jugador", "cpu", "El jugador");
      await atacar(nuevoEstado.cpu.campo, nuevoEstado.jugador.campo, "cpu", "jugador", "La CPU");
    } else {
      await atacar(nuevoEstado.cpu.campo, nuevoEstado.jugador.campo, "cpu", "jugador", "La CPU");
      await atacar(nuevoEstado.jugador.campo, nuevoEstado.cpu.campo, "jugador", "cpu", "El jugador");
    }

    const { cpu, logCpu } = turnoCPU(nuevoEstado);
    nuevoEstado.cpu = cpu;
    logTurno.push(...logCpu);

    robarCarta(nuevoEstado.jugador, logTurno, "El jugador");
    robarCarta(nuevoEstado.cpu, logTurno, "La CPU");

    if (nuevoEstado.jugador.vida <= 0 || nuevoEstado.cpu.vida <= 0) {
      const ganador = nuevoEstado.jugador.vida > 0
          ? "¡Ganaste la batalla!"
          : "Perdiste la batalla...";
      logTurno.push(ganador);
      setResultadoFinal(ganador);
      
      // Eliminar partida guardada cuando termina
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      setEstado({ ...nuevoEstado, log: [...nuevoEstado.log, ...logTurno] });
      setBloqueado(false);
      return;
    }

    if (ambosSinCartas(nuevoEstado)) {
      const resultado =
        nuevoEstado.jugador.vida > nuevoEstado.cpu.vida
          ? "¡Ganaste por resistencia!"
          : nuevoEstado.cpu.vida > nuevoEstado.jugador.vida
          ? "La CPU ganó por resistencia."
          : "¡Empate! Ambos sin cartas.";
      logTurno.push(resultado);
      setResultadoFinal(resultado);
      
      // Eliminar partida guardada cuando termina
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    const siguienteTurno = turnoActual === "jugador" ? "cpu" : "jugador";
    setTurnoActual(siguienteTurno);

    nuevoEstado.ronda++;
    nuevoEstado.log = [...nuevoEstado.log, ...logTurno];
    setEstado(nuevoEstado);

    setBloqueado(false);
  };

  // Botón para borrar partida guardada manualmente
  const limpiarPartidaGuardada = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar la partida guardada?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      alert("Partida guardada eliminada. La próxima vez empezarás de nuevo.");
    }
  };

  if (!estado) return <p>Cargando batalla...</p>;

  return (
    <div className="arena-container">
      <div className="arena-overlay" />
      <div className="arena-content">
        {/* Botón para eliminar partida guardada */}
        <button 
          onClick={limpiarPartidaGuardada}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(255, 50, 50, 0.8)",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
            zIndex: 1000
          }}
          title="Eliminar partida guardada"
        >
          🗑️
        </button>

        <div className="cpu-section">
          <div className={`perfil-container ${turnoActual === "cpu" ? "turno-activo" : "turno-inactivo"}`}>
            <img
              src="/cpu.png"
              alt="CPU"
              className={`perfil-imagen ${animaciones["cpu-perfil"] || ""}`}
            />
            <div>
              <h3>
                CPU {turnoActual === "cpu" && <span className="espada">⚔️</span>}
              </h3>
              <p>Vida: {estado.cpu.vida}</p>
            </div>
          </div>

          <div className="campo">
            {estado.cpu.campo.map((carta: any, i: number) =>
              carta ? (
                <div key={i} className={`slot ${animaciones[`cpu-${i}`] || ""}`}>
                  <img src={carta.image} alt={carta.name} />
                  <div className="slot-info">
                    <span>ATK {carta.attack}</span>
                    <span>DEF {carta.hp}</span>
                  </div>
                </div>
              ) : (
                <div key={i} className="slot" />
              )
            )}
          </div>
        </div>

        {/* === Jugador === */}
        <div className={`player-section ${turnoActual === "cpu" ? "cpu-turno" : ""}`}>
          <div className="campo">
            {estado.jugador.campo.map((carta: any, i: number) => {
              const esNueva = carta?.turnoColocada === estado.ronda;
              const bordeColor = carta
                ? esNueva ? "#E6C200" : "#444"
                : cartaSeleccionada && turnoActual === "jugador" ? "#00FFFF" : "#888";

              return (
                <div
                  key={i}
                  onClick={() => carta ? retirarCartaDelCampo(i) : colocarCartaEnCampo(i)}
                  className={`slot ${animaciones[`jugador-${i}`] || ""}`}
                  style={{ border: `2px solid ${bordeColor}`, position: "relative" }}
                >
                  {carta ? (
                    <>
                      <img src={carta.image} alt={carta.name} />
                      <div className="slot-info">
                        <span>ATK {carta.attack}</span>
                        <span>DEF {carta.hp}</span>
                      </div>
                    </>
                  ) : (
                    cartaSeleccionada && turnoActual === "jugador" && (
                      <div className="slot-hint"><span>Colocar aquí</span></div>
                    )
                  )}
                </div>
              );
            })}
          </div>

          <div className="mano-container">
            <div className="mano">
              {estado.jugador.mano.map((carta: any) => (
                <div
                  key={carta.uid}
                  onClick={() => setCartaSeleccionada(cartaSeleccionada?.uid === carta.uid ? null : carta)}
                  className={`carta ${cartaSeleccionada?.uid === carta.uid ? "carta-seleccionada" : ""}`}
                >
                  <img src={carta.image} alt={carta.name} />
                  <div className="carta-info">
                    <span>ATK {carta.attack}</span>
                    <span>DEF {carta.defense}</span>
                  </div>
                </div>
              ))}
              <div className="baraja">
                <img src="/cartabaraja.png" alt="baraja jugador" />
                <p>{estado.jugador.baraja.length}/10</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className={`perfil-container ${turnoActual === "jugador" ? "turno-activo" : "turno-inactivo"}`}>
            <img src="/player.png" alt="Jugador" className={`perfil-imagen ${animaciones["jugador-perfil"] || ""}`} />
            <div>
              <h3>Tú {turnoActual === "jugador" && (<span className="espada">⚔️</span>)}</h3>
              <p>Vida: {estado.jugador.vida}</p>
            </div>
            <div>
              <button onClick={resolverCombate} className="turno-btn" disabled={bloqueado}>
                {bloqueado ? "Resolviendo..." : turnoActual === "jugador" ? "Atacar" : "Defender"}
              </button>
              <button onClick={() => setMostrarRendirse(true)} className="rendirse-btn" disabled={bloqueado}>
                Rendirse
              </button>
            </div>
          </div>
        </div>

        {resultadoFinal && (
          <div className="resultado-overlay">
            <div className="resultado-card">
              <h2>{resultadoFinal}</h2>
              <div className="resultado-botones">
                <button
                  className="btn-volver"
                  onClick={() => {
                    // Nueva partida - eliminar guardado anterior
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    
                    const seleccionadas = JSON.parse(
                        localStorage.getItem("cartasSeleccionadas") || 
                        localStorage.getItem("cartasPlayer") || "[]"
                    );
                    const cpuSeleccionadas = JSON.parse(localStorage.getItem("cartasCPU") || "[]");
                    
                    const estadoInicial = inicializarPartida(seleccionadas, cpuSeleccionadas);
                    setEstado(estadoInicial);
                    setResultadoFinal(null);
                    setTurnoActual("jugador");
                    setCartaSeleccionada(null);
                    setBloqueado(false);
                  }}
                >
                  Volver a jugar
                </button>
                <button className="btn-salir" onClick={() => {
                  // Eliminar guardado al salir
                  localStorage.removeItem(LOCAL_STORAGE_KEY);
                  navigate("/arena");
                }}>
                  Salir
                </button>
              </div>
            </div>
          </div>
        )}
        {mostrarRendirse && (
          <div className="resultado-overlay">
            <div className="resultado-card">
              <h2>¿Seguro que deseas rendirte?</h2>
              <p style={{ marginBottom: "1rem", fontSize: "1rem", color: "#ccc" }}>
                Perderás automáticamente la partida.
              </p>
              <div className="resultado-botones">
                <button
                  className="btn-salir"
                  onClick={() => {
                    setResultadoFinal("Te has rendido. La CPU gana la batalla.");
                    setMostrarRendirse(false);
                    setBloqueado(true);
                    // Eliminar guardado al rendirse
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                  }}
                >
                  Sí, rendirme
                </button>
                <button className="btn-volver" onClick={() => setMostrarRendirse(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}