import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { useAuth } from "../../context/AuthContext";
import "./Styles/seleccionCartas.css";
import { Filtro } from "../../components/Filtro";
import type { CartaConCantidad } from "../../types/Carta";
import { useCallback } from "react";

// Interfaz que coincide con la DB
interface CartaColeccion {
  id: number;
  name: string;
  image: string;
  attack: number;
  defense: number;
  cantidad: number;
}

// Clave para localStorage
const LOCAL_STORAGE_KEY = "cartasSeleccionadasTemporales";

export default function SeleccionCartas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  //filtro
  const [cartasFiltradas, setCartasFiltradas] = useState<CartaColeccion[]>([]);
  const [busquedaActiva, setBusquedaActiva] = useState(false);

  const [cartasJugador, setCartasJugador] = useState<CartaColeccion[]>([]);
  // Nuevo estado para guardar TODAS las cartas (para la CPU)
  const [todasLasCartas, setTodasLasCartas] = useState<CartaColeccion[]>([]);
  
  // Cargar seleccionadas desde localStorage al inicio
  const [seleccionadas, setSeleccionadas] = useState<{ [id: number]: number }>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleFiltrado = useCallback((filtradas: CartaConCantidad[]) => {
    setBusquedaActiva(true);
    setCartasFiltradas(filtradas.map(c => ({ ...c })));
  }, []);

  // === 1. GUARDAR EN LOCALSTORAGE CADA QUE CAMBIE "seleccionadas" ===
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seleccionadas));
  }, [seleccionadas]);

  // === 2. CARGAR COLECCIÓN Y TODAS LAS CARTAS ===
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Cargar colección del usuario
        const resColeccion = await fetch(`http://localhost:3001/api/users/${user.id}/collection`, { headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: "include"});
        if (resColeccion.ok) {
          const data = await resColeccion.json();
          const cartasFormateadas = data.map((item: any) => ({
            ...item.card,
            cantidad: item.quantity
          }));
          setCartasJugador(cartasFormateadas);
          
          // Limpiar seleccionadas de cartas que el usuario ya no tiene
          const nuevosSeleccionadas = { ...seleccionadas };
          let huboCambios = false;
          
          Object.keys(nuevosSeleccionadas).forEach(idStr => {
            const id = Number(idStr);
            const cartaExistente = cartasFormateadas.find((c: CartaColeccion) => c.id === id);
            const cantidadSeleccionada = nuevosSeleccionadas[id];
            
            if (!cartaExistente || cantidadSeleccionada > cartaExistente.cantidad) {
              delete nuevosSeleccionadas[id];
              huboCambios = true;
            }
          });
          
          if (huboCambios) {
            setSeleccionadas(nuevosSeleccionadas);
          }
        }

        // 2. Cargar TODAS las cartas de la base de datos (para la CPU)
        // Asumiendo que existe este endpoint. Si no, ajusta la URL.
        const resTodas = await fetch(`http://localhost:3001/api/cards`, {headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() }, credentials: "include"});
        if (resTodas.ok) {
          const dataTodas = await resTodas.json();
          // Aseguramos que tengan la estructura correcta
          setTodasLasCartas(dataTodas.map((c: any) => ({ ...c, cantidad: 1 })));
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // === 3. LÓGICA DE SELECCIÓN ===
  const handleSeleccion = (id: number, maxCantidad: number) => {
    const totalSeleccionadas = Object.values(seleccionadas).reduce((sum, val) => sum + val, 0);
    const actuales = seleccionadas[id] || 0;

    if (totalSeleccionadas >= 10 && actuales === 0) {
      alert("⚠️ Solo puedes seleccionar 10 cartas en total.");
      return;
    }
    if (actuales >= maxCantidad) {
      alert("⚠️ Ya usaste todas las copias disponibles.");
      return;
    }

    setSeleccionadas((prev) => ({ ...prev, [id]: actuales + 1 }));
  };

  const handleRestar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const actuales = seleccionadas[id] || 0;
    if (actuales > 0) {
      setSeleccionadas((prev) => {
        const nuevo = { ...prev, [id]: actuales - 1 };
        if (nuevo[id] === 0) delete nuevo[id];
        return nuevo;
      });
    }
  };

  // Botón para limpiar toda la selección
  const handleLimpiarSeleccion = () => {
    if (window.confirm("¿Estás seguro de que quieres limpiar todas las cartas seleccionadas?")) {
      setSeleccionadas({});
    }
  };

  // === 4. INICIAR BATALLA ===
  const iniciarBatalla = () => {
    // --- A. PREPARAR MAZO DEL JUGADOR ---
    const mazoJugador: CartaColeccion[] = [];
    Object.entries(seleccionadas).forEach(([idStr, cantidad]) => {
      const id = Number(idStr);
      const cartaInfo = cartasJugador.find(c => c.id === id);
      if (cartaInfo) {
        for (let i = 0; i < cantidad; i++) {
          mazoJugador.push(cartaInfo);
        }
      }
    });

    // --- B. PREPARAR MAZO DE LA CPU (ALEATORIO) ---
    const mazoCPU: CartaColeccion[] = [];
    if (todasLasCartas.length > 0) {
        // Creamos una copia para desordenar
        const cartasDisponibles = [...todasLasCartas];
        
        // Algoritmo simple para mezclar (Fisher-Yates o sort random)
        cartasDisponibles.sort(() => 0.5 - Math.random());

        // Tomamos las primeras 10
        for (let i = 0; i < 10; i++) {
            // Usamos módulo por si hay menos de 10 cartas en la DB (para no romper)
            const carta = cartasDisponibles[i % cartasDisponibles.length];
            mazoCPU.push(carta);
        }
    } else {
        console.warn("No se pudieron cargar las cartas de la CPU.");
    }

    // --- C. GUARDAR EN LOCAL STORAGE ---
    localStorage.setItem("cartasSeleccionadas", JSON.stringify(mazoJugador));
    localStorage.setItem("cartasCPU", JSON.stringify(mazoCPU));

    // Limpiar la selección temporal después de iniciar batalla
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    console.log("Mazo Jugador:", mazoJugador);
    console.log("Mazo CPU:", mazoCPU);

    navigate("/arena/batalla");
  };

  if (isLoading) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Cargando datos...</div>;

  const totalSeleccionadas = Object.values(seleccionadas).reduce((sum, val) => sum + val, 0);

  return (
    <div>
      <PageTitle title="Arena de Batalla" />
      <div className="conteiner">
        <div className="conteiner-cartas">
          <h2 className="titulo">Selecciona tus 10 cartas</h2>

          {/* ======== 🔍 FILTRO ======== */}
          <Filtro
            cartas={cartasJugador as CartaConCantidad[]}
            onFiltrado={handleFiltrado}
          />

          {/* ======== CONTROLES SUPERIORES ======== */}
          <div className="conteiner-iniciar">
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p style={{ color: "#E6C200", margin: 0 }}>
                Cartas seleccionadas: <strong>{totalSeleccionadas} / 10</strong>
              </p>
              
              {totalSeleccionadas > 0 && (
                <button
                  onClick={handleLimpiarSeleccion}
                  style={{
                    backgroundColor: "#d32f2f",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Limpiar todo
                </button>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={iniciarBatalla}
                disabled={totalSeleccionadas !== 10}
                style={{
                  backgroundColor: totalSeleccionadas === 10 ? "#E6C200" : "#777",
                  color: "black",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: totalSeleccionadas === 10 ? "pointer" : "not-allowed",
                  border: "none",
                  fontWeight: "bold"
                }}
              >
                Iniciar Batalla
              </button>

              <button
                className="como-jugar-btn"
                onClick={() => setMostrarModal(true)}
              >
                ¿Cómo jugar?
              </button>
            </div>
          </div>

          {/* Modal de instrucciones */}
          {mostrarModal && (
            <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>⚔️ Cómo Jugar</h2>
                <ul>
                  <li>Selecciona 10 cartas de tu colección.</li>
                  <li>Robas cartas cada turno.</li>
                  <li>Coloca cartas en el tablero.</li>
                  <li>Defiendes cuando es turno rival.</li>
                  <li>Las cartas atacan frente a ellas.</li>
                  <li>Vida en 0 = destruida.</li>
                  <li>Jugador o CPU sin vida pierde.</li>
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

          {/* ======== LISTA DE CARTAS ======== */}
          {cartasJugador.length === 0 ? (
            <p style={{ color: "#aaa", textAlign: "center" }}>
              No tienes cartas.
            </p>
          ) : (
            <div className="grid-cartas">
              {(busquedaActiva ? cartasFiltradas : cartasJugador).map((carta) => {
                const cantidadSeleccionada = seleccionadas[carta.id] || 0;
                const agotada = cantidadSeleccionada >= carta.cantidad;

                return (
                  <div
                    key={carta.id}
                    onClick={() => handleSeleccion(carta.id, carta.cantidad)}
                    style={{
                      border: cantidadSeleccionada > 0 ? "3px solid #E6C200" : "1px solid #ccc",
                      borderRadius: "8px",
                      cursor: agotada || totalSeleccionadas >= 10 ? "default" : "pointer",
                      textAlign: "center",
                      background: "#111",
                      position: "relative",
                      opacity: agotada ? 0.6 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {cantidadSeleccionada > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "#E6C200",
                          color: "black",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "14px",
                          zIndex: 10
                        }}
                      >
                        {cantidadSeleccionada}
                      </div>
                    )}

                    <img
                      src={carta.image}
                      alt={carta.name}
                      className="imagen-carta"
                      style={{ width: "100%", display: "block" }}
                    />

                    <div
                      className="contenido-carta"
                      style={{ padding: "8px" }}
                    >
                      <strong>{carta.name}</strong>
                      <p>ATK: {carta.attack} | DEF: {carta.defense}</p>
                      <p style={{ color: "#E6C200", fontSize: "14px" }}>
                        Disponibles: {carta.cantidad - cantidadSeleccionada}
                      </p>

                      {cantidadSeleccionada > 0 && (
                        <button
                          onClick={(e) => handleRestar(e, carta.id)}
                          style={{
                            marginTop: "5px",
                            background: "#d32f2f",
                            color: "white",
                            border: "none",
                            width: "100%",
                            cursor: "pointer",
                            padding: "5px",
                            borderRadius: "4px"
                          }}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Nota sobre persistencia */}
          {totalSeleccionadas > 0 && (
            <p style={{
              color: "#4CAF50", 
              textAlign: "center", 
              fontSize: "12px", 
              marginTop: "20px",
              fontStyle: "italic"
            }}>
              💾 Tu selección se guarda automáticamente. Puedes recargar la página sin perderlas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}