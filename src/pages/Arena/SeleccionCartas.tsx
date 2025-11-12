import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { useAuth } from "../../context/AuthContext";
import "./Styles/seleccionCartas.css";

export default function SeleccionCartas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartasJugador, setCartasJugador] = useState<any[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<{ [id: number]: number }>(
    {}
  ); // { idCarta: cantidadSeleccionada }
  const [mostrarModal, setMostrarModal] = useState(false);
  // === Cargar colección del usuario ===
  useEffect(() => {
    if (!user) return;

    const cartasBase = JSON.parse(localStorage.getItem("cartas") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("users") || "[]");
    const usuarioActual = usuarios.find((u: any) => u.id === user.id);

    if (usuarioActual?.coleccion?.length > 0) {
      const cartasCompletas = usuarioActual.coleccion
        .map((c: any) => {
          const cartaBase = cartasBase.find((cb: any) => cb.id === c.cartaId);
          return cartaBase ? { ...cartaBase, cantidad: c.cantidad } : null;
        })
        .filter(Boolean);

      setCartasJugador(cartasCompletas);
    } else {
      setCartasJugador([]);
    }
  }, [user]);

  // === Manejar selección múltiple ===
  const handleSeleccion = (id: number, maxCantidad: number) => {
    const totalSeleccionadas = Object.values(seleccionadas).reduce(
      (sum, val) => sum + val,
      0
    );

    // Si ya está seleccionada, alternar cantidad
    const actuales = seleccionadas[id] || 0;

    // Si ya llegó al máximo permitido de 10 cartas, no permitir más
    if (totalSeleccionadas >= 10 && actuales === 0) {
      alert("⚠️ Solo puedes seleccionar 10 cartas en total.");
      return;
    }

    // Si ya usó todas las copias disponibles, no sumar más
    if (actuales >= maxCantidad) {
      alert("⚠️ Ya usaste todas las copias de esta carta.");
      return;
    }

    // Incrementar o resetear según la acción
    setSeleccionadas((prev) => ({
      ...prev,
      [id]: actuales + 1,
    }));
  };

  // === Iniciar batalla ===
  const iniciarBatalla = () => {
    const total = Object.values(seleccionadas).reduce(
      (sum, val) => sum + val,
      0
    );
    if (total < 10) {
      alert("Selecciona 10 cartas para iniciar la batalla.");
      return;
    }

    const seleccionFinal: number[] = [];
    Object.entries(seleccionadas).forEach(([id, cantidad]) => {
      for (let i = 0; i < cantidad; i++) {
        seleccionFinal.push(Number(id));
      }
    });

    localStorage.setItem("cartasSeleccionadas", JSON.stringify(seleccionFinal));
    navigate("/arena/batalla");
  };

  return (
    <div>
      <PageTitle title="Arena de Batalla" />
      <div className="conteiner">
        <div className="conteiner-cartas">
          <h2 className="titulo">Selecciona tus 10 cartas</h2>
          <div className="conteiner-iniciar">
            <p style={{ color: "#E6C200" }}>
              Cartas seleccionadas:{" "}
              {Object.values(seleccionadas).reduce((sum, val) => sum + val, 0)}{" "}
              / 10
            </p>
            <button
              onClick={iniciarBatalla}
              disabled={
                Object.values(seleccionadas).reduce(
                  (sum, val) => sum + val,
                  0
                ) !== 10
              }
              style={{
                backgroundColor:
                  Object.values(seleccionadas).reduce(
                    (sum, val) => sum + val,
                    0
                  ) === 10
                    ? "#E6C200"
                    : "#777",
                color: "black",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor:
                  Object.values(seleccionadas).reduce(
                    (sum, val) => sum + val,
                    0
                  ) === 10
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              Iniciar Batalla
            </button>
            {/* Botón para abrir el modal */}
            <button
              className="como-jugar-btn"
              onClick={() => setMostrarModal(true)}
            >
              ¿Cómo jugar?
            </button>

            {/* Modal con las reglas */}
            {mostrarModal && (
              <div
                className="modal-overlay"
                onClick={() => setMostrarModal(false)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2>⚔️ Cómo Jugar</h2>
                  <ul>
                    <li>
                      Selecciona 10 cartas de tu colección para formar tu
                      baraja.
                    </li>
                    <li>
                      Al iniciar, tendrás 5 cartas en tu mano y robarás una cada
                      ronda.
                    </li>
                    <li>
                      Cuando sea tu turno podrás colocar cartas en los espacios
                      que tengas vacios en el tablero.
                    </li>
                    <li>
                      Cuando sea turno de tu rival solamente podrás defender
                    </li>
                    <li>
                      Las cartas atacan a las que estén frente a ellas o
                      directamente al rival.
                    </li>
                    <li>Si la vida de una carta llega a 0, es destruida.</li>
                    <li>
                      El jugador o CPU que llegue a 0 puntos de vida pierde.
                    </li>
                  </ul>
                  <button
                    className="cerrar-modal"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
          {cartasJugador.length === 0 ? (
            <p style={{ color: "#aaa" }}>
              No tienes cartas en tu colección todavía 🃏
            </p>
          ) : (
            <>
              <div className="grid-cartas">
                {cartasJugador.map((carta) => {
                  const cantidadSeleccionada = seleccionadas[carta.id] || 0;
                  const totalSeleccionadas = Object.values(
                    seleccionadas
                  ).reduce((sum, val) => sum + val, 0);

                  return (
                    <div
                      key={carta.id}
                      onClick={() => handleSeleccion(carta.id, carta.cantidad)}
                      style={{
                        border:
                          cantidadSeleccionada > 0
                            ? "3px solid #E6C200"
                            : "1px solid #ccc",
                        borderRadius: "8px",
                        cursor:
                          totalSeleccionadas < 10 || cantidadSeleccionada > 0
                            ? "pointer"
                            : "not-allowed",
                        overflow: "hidden",
                        textAlign: "center",
                        background: "#111",
                      }}
                    >
                      <img
                        src={carta.image || carta.img}
                        alt={carta.name || carta.nombre}
                        className="imagen-carta"
                      />
                      <div className="contenido-carta">
                        <strong>{carta.name || carta.nombre}</strong>
                        <p>
                          ATK: {carta.attack || carta.atk} | DEF:{" "}
                          {carta.defense || carta.def}
                        </p>
                        <p>
                          Restantes: {cantidadSeleccionada}/{carta.cantidad}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
