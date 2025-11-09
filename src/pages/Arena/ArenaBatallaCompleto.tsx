// src/pages/Arena/ArenaBatalla.tsx
import { useEffect, useState } from "react";
import { PageTitle } from "../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { inicializarPartida } from "./logic/batallaUtils";
import "./Styles/arena.css"

export default function ArenaBatalla() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<any | null>(null);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<any | null>(null);

  // === Inicialización ===
  useEffect(() => {
    const seleccionadas = JSON.parse(
      localStorage.getItem("cartasSeleccionadas") || "[]"
    );
    const cartasBase = JSON.parse(localStorage.getItem("cartas") || "[]");

    if (seleccionadas.length < 10) {
      alert("Necesitas 10 cartas para entrar a la arena");
      navigate("/arena");
      return;
    }

    const cartasJugador = seleccionadas
      .map((id: number) => cartasBase.find((c: any) => c.id === id))
      .filter(Boolean)
      .map((c: any) => ({ ...c, hp: c.defense }));

    const estadoInicial = inicializarPartida(cartasJugador);
    setEstado(estadoInicial);
  }, []);

  // === Colocar carta ===
  const colocarCartaEnCampo = (slotIndex: number) => {
    if (!estado || !cartaSeleccionada) return;
    if (estado.jugador.campo[slotIndex]) {
      alert("Ese slot ya está ocupado.");
      return;
    }

    const nuevaMano = [...estado.jugador.mano];
    const idx = nuevaMano.findIndex((c: any) => c.uid === cartaSeleccionada.uid);
    if (idx === -1) return;

    nuevaMano.splice(idx, 1);
    const nuevoCampo = [...estado.jugador.campo];
    nuevoCampo[slotIndex] = { ...cartaSeleccionada, turnoColocada: estado.ronda };

    setEstado({
      ...estado,
      jugador: { ...estado.jugador, mano: nuevaMano, campo: nuevoCampo },
      log: [
        ...estado.log,
        `Colocaste ${cartaSeleccionada.name} en el slot ${slotIndex + 1}.`,
      ],
    });
    setCartaSeleccionada(null);
  };

  // === Retirar carta ===
  const retirarCartaDelCampo = (slotIndex: number) => {
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

    setEstado({
      ...estado,
      jugador: { ...estado.jugador, mano: nuevaMano, campo: nuevoCampo },
      log: [
        ...estado.log,
        `Retiraste ${carta.name} del slot ${slotIndex + 1}.`,
      ],
    });

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
        logCpu.push(`La CPU colocó ${cartaCpu.name} frente a tu ${cartaJugador.name}.`);
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

  // === Resolver combate ===
  const resolverCombate = () => {
    if (!estado) return;
    let nuevoEstado = { ...estado };
    let logTurno: string[] = [];

    // --- Ataques jugador ---
    for (let i = 0; i < 4; i++) {
      const atacante = nuevoEstado.jugador.campo[i];
      if (!atacante) continue;
      const defensor = nuevoEstado.cpu.campo[i];
      if (defensor) {
        defensor.hp -= atacante.attack;
        logTurno.push(`${atacante.name} atacó a ${defensor.name} causando ${atacante.attack} de daño.`);
        if (defensor.hp <= 0) {
          nuevoEstado.cpu.campo[i] = null;
          logTurno.push(`${defensor.name} fue destruido.`);
        }
      } else {
        nuevoEstado.cpu.vida -= atacante.attack;
        logTurno.push(`${atacante.name} atacó directamente causando ${atacante.attack} de daño.`);
      }
    }

    // --- Ataques CPU ---
    for (let i = 0; i < 4; i++) {
      const atacante = nuevoEstado.cpu.campo[i];
      if (!atacante) continue;
      const defensor = nuevoEstado.jugador.campo[i];
      if (defensor) {
        defensor.hp -= atacante.attack;
        logTurno.push(`La CPU atacó con ${atacante.name} a ${defensor.name} causando ${atacante.attack} de daño.`);
        if (defensor.hp <= 0) {
          nuevoEstado.jugador.campo[i] = null;
          logTurno.push(`${defensor.name} fue destruido.`);
        }
      } else {
        nuevoEstado.jugador.vida -= atacante.attack;
        logTurno.push(`La CPU atacó directamente causando ${atacante.attack} de daño.`);
      }
    }

    // --- CPU coloca cartas ---
    const { cpu, logCpu } = turnoCPU(nuevoEstado);
    nuevoEstado.cpu = cpu;
    logTurno.push(...logCpu);

    // --- Robo de cartas ---
    robarCarta(nuevoEstado.jugador, logTurno, "El jugador");
    robarCarta(nuevoEstado.cpu, logTurno, "La CPU");

    // --- Fin por vida ---
    if (nuevoEstado.jugador.vida <= 0 || nuevoEstado.cpu.vida <= 0) {
      const ganador =
        nuevoEstado.jugador.vida > 0 ? "¡Ganaste la batalla!" : "Perdiste la batalla...";
      logTurno.push(ganador);
      alert(ganador);
      return setEstado({ ...nuevoEstado, log: [...nuevoEstado.log, ...logTurno] });
    }

    // --- Fin por agotamiento ---
    if (ambosSinCartas(nuevoEstado)) {
      const resultado =
        nuevoEstado.jugador.vida > nuevoEstado.cpu.vida
          ? "¡Ganaste por resistencia!"
          : nuevoEstado.cpu.vida > nuevoEstado.jugador.vida
          ? "La CPU ganó por resistencia."
          : "¡Empate! Ambos sin cartas.";
      logTurno.push(resultado);
      alert(resultado);
    }

    nuevoEstado.ronda++;
    nuevoEstado.log = [...nuevoEstado.log, ...logTurno];
    setEstado(nuevoEstado);
  };

  if (!estado) return <p>Cargando batalla...</p>;

  // === Componente principal ===
  return (
    <div>
      
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/arenaback.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100vh",
          }}
        >
          

          
          {/* === CPU === */}
          {/* === CPU === */}
          <div style={{ textAlign: "center" }}>
          <h3>CPU</h3>
          <p>Vida: {estado.cpu.vida}</p>

          {/* 🂠 Mano CPU + baraja a la derecha */}
          <div
              style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              }}
          >
              {/* Mano CPU */}
              <div style={{ display: "flex", gap: "8px" }}>
              {estado.cpu.mano.map((_: any, index: number) => (
                  <img
                  key={index}
                  src="/cartabaraja.png"
                  alt="carta oculta"
                  style={{
                      width: "70px",
                      height: "100px",
                      opacity: 0.85,
                      borderRadius: "6px",
                  }}
                  />
              ))}
              </div>

              {/* Baraja CPU */}
              <div style={{ textAlign: "center" }}>
              <img
                  src="/cartabaraja.png"
                  alt="baraja CPU"
                  style={{ width: "70px", height: "100px" }}
              />
              <p style={{ marginTop: "4px" }}>{estado.cpu.baraja.length}/10</p>
              </div>
          </div>

          {/* 🔹 Campo CPU debajo */}
          <div
              style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "1rem",
              }}
          >
              {estado.cpu.campo.map((carta: any, i: number) =>
              carta ? (
                  <div
                  key={i}
                  style={{
                      width: "100px",
                      height: "140px",
                      border: "2px solid #E6C200",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                  }}
                  >
                  <img
                      src={carta.image}
                      alt={carta.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                      style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      background: "rgba(0,0,0,0.7)",
                      fontSize: "0.7rem",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "2px 5px",
                      }}
                  >
                      <span>ATK {carta.attack}</span>
                      <span>DEF {carta.hp}</span>
                  </div>
                  </div>
              ) : (
                  <div
                  key={i}
                  style={{
                      width: "100px",
                      height: "140px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px dashed #888",
                      borderRadius: "8px",
                  }}
                  />
              )
              )}
          </div>
          </div>

          <div>
          <button onClick={resolverCombate} className="turno-btn">
            Resolver Turno
          </button>

          </div>

          {/* === Jugador === */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            {/* Campo jugador */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              {estado.jugador.campo.map((carta: any, i: number) => {
                const esNueva = carta?.turnoColocada === estado.ronda;
                const bordeColor = carta
                  ? esNueva
                    ? "#E6C200"
                    : "#444"
                  : cartaSeleccionada
                  ? "#00FFFF"
                  : "#888";
                return (
                  <div
                    key={i}
                    onClick={() =>
                      carta ? retirarCartaDelCampo(i) : colocarCartaEnCampo(i)
                    }
                    style={{
                      width: "100px",
                      height: "140px",
                      border: `2px solid ${bordeColor}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      overflow: "hidden",
                      background: carta
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.05)",
                      position: "relative",
                    }}
                  >
                    {carta && (
                      <>
                        <img
                          src={carta.image}
                          alt={carta.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            background: "rgba(0,0,0,0.7)",
                            fontSize: "0.7rem",
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "2px 5px",
                          }}
                        >
                          <span>ATK {carta.attack}</span>
                          <span>DEF {carta.hp}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mano jugador + baraja a la derecha */}
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {/* Mano */}
              <div style={{ display: "flex", gap: "8px" }}>
                {estado.jugador.mano.map((carta: any) => (
                  <div
                    key={carta.uid}
                    onClick={() =>
                      setCartaSeleccionada(
                        cartaSeleccionada?.uid === carta.uid ? null : carta
                      )
                    }
                    style={{
                      width: "90px",
                      height: "125px",
                      border:
                        cartaSeleccionada?.uid === carta.uid
                          ? "3px solid #00FFFF"
                          : "2px solid #E6C200",
                      borderRadius: "8px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={carta.image}
                      alt={carta.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        background: "rgba(0,0,0,0.7)",
                        fontSize: "0.7rem",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "2px 5px",
                      }}
                    >
                      <span>ATK {carta.attack}</span>
                      <span>DEF {carta.defense}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Baraja jugador a la derecha */}
              <div style={{ textAlign: "center" }}>
                <img
                  src="/cartabaraja.png"
                  alt="baraja jugador"
                  style={{ width: "70px", height: "100px" }}
                />
                <p style={{ marginTop: "4px" }}>{estado.jugador.baraja.length}/10</p>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h3>Tú</h3>
              <p>Vida: {estado.jugador.vida}</p>

            </div>
          </div>
        </div>
      </div>

    </div>
    
  );
}
