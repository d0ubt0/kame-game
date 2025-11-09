import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { useAuth } from "../../context/AuthContext";

export default function SeleccionCartas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartasJugador, setCartasJugador] = useState<any[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<{ [id: number]: number }>({}); // { idCarta: cantidadSeleccionada }

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
    const total = Object.values(seleccionadas).reduce((sum, val) => sum + val, 0);
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
    <div style={{ padding: "2rem" }}>
      <PageTitle title="Arena de Batalla" />
      <h2 style={{ color: "#E6C200" }}>Selecciona tus 10 cartas</h2>

      {cartasJugador.length === 0 ? (
        <p style={{ color: "#aaa" }}>
          No tienes cartas en tu colección todavía 🃏
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {cartasJugador.map((carta) => {
              const cantidadSeleccionada = seleccionadas[carta.id] || 0;
              const totalSeleccionadas = Object.values(seleccionadas).reduce(
                (sum, val) => sum + val,
                0
              );

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
                      totalSeleccionadas < 10 ||
                      cantidadSeleccionada > 0
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
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ color: "#fff", padding: "8px" }}>
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

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p style={{ color: "#E6C200" }}>
              Cartas seleccionadas:{" "}
              {Object.values(seleccionadas).reduce((sum, val) => sum + val, 0)}{" "}
              / 10
            </p>
            <button
              onClick={iniciarBatalla}
              disabled={
                Object.values(seleccionadas).reduce((sum, val) => sum + val, 0) !== 10
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
          </div>
        </>
      )}
    </div>
  );
}
