import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { useAuth } from "../../context/AuthContext";
import "./Styles/seleccionCartas.css";

// Interfaz que coincide con la DB
interface CartaColeccion {
  id: number;
  name: string;
  image: string;
  attack: number;
  defense: number;
  cantidad: number;
}

export default function SeleccionCartas() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cartasJugador, setCartasJugador] = useState<CartaColeccion[]>([]);
  // Nuevo estado para guardar TODAS las cartas (para la CPU)
  const [todasLasCartas, setTodasLasCartas] = useState<CartaColeccion[]>([]);
  
  const [seleccionadas, setSeleccionadas] = useState<{ [id: number]: number }>({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // === 1. CARGAR COLECCIÓN Y TODAS LAS CARTAS ===
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Cargar colección del usuario
        const resColeccion = await fetch(`http://localhost:3001/api/users/${user.id}/collection`);
        if (resColeccion.ok) {
          const data = await resColeccion.json();
          const cartasFormateadas = data.map((item: any) => ({
            ...item.card,
            cantidad: item.quantity
          }));
          setCartasJugador(cartasFormateadas);
        }

        // 2. Cargar TODAS las cartas de la base de datos (para la CPU)
        // Asumiendo que existe este endpoint. Si no, ajusta la URL.
        const resTodas = await fetch(`http://localhost:3001/api/cards`);
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

  // === 2. LÓGICA DE SELECCIÓN ===
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

  // === 3. INICIAR BATALLA ===
  const iniciarBatalla = () => {
    const total = Object.values(seleccionadas).reduce((sum, val) => sum + val, 0);

    // Validación opcional (descomentar si quieres obligar a tener 10)
    /* if (total < 10) {
       alert("Selecciona 10 cartas para iniciar.");
       return;
    } */

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
    localStorage.setItem("cartasCPU", JSON.stringify(mazoCPU)); // <--- NUEVO

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
          
          <div className="conteiner-iniciar">
            <p style={{ color: "#E6C200" }}>
              Cartas seleccionadas: {totalSeleccionadas} / 10
            </p>
            <div style={{display:'flex', gap:'10px'}}>
                <button
                onClick={iniciarBatalla}
                disabled={totalSeleccionadas !== 10}
                style={{
                    backgroundColor: totalSeleccionadas === 10 ? "#E6C200" : "#777",
                    color: "black",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: totalSeleccionadas === 10 ? "pointer" : "not-allowed",
                }}
                >
                Iniciar Batalla
                </button>
                <button className="como-jugar-btn" onClick={() => setMostrarModal(true)}>
                ¿Cómo jugar?
                </button>
            </div>
          </div>

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

          {cartasJugador.length === 0 ? (
             <p style={{ color: "#aaa", textAlign:'center' }}>No tienes cartas.</p>
          ) : (
            <div className="grid-cartas">
              {cartasJugador.map((carta) => {
                const cantidadSeleccionada = seleccionadas[carta.id] || 0;
                const agotada = cantidadSeleccionada >= carta.cantidad;

                return (
                  <div
                    key={carta.id}
                    onClick={() => handleSeleccion(carta.id, carta.cantidad)}
                    style={{
                      border: cantidadSeleccionada > 0 ? "3px solid #E6C200" : "1px solid #ccc",
                      borderRadius: "8px",
                      cursor: (agotada || totalSeleccionadas >= 10) ? "default" : "pointer",
                      textAlign: "center",
                      background: "#111",
                      position: "relative",
                      opacity: agotada ? 0.6 : 1
                    }}
                  >
                    {cantidadSeleccionada > 0 && (
                        <div style={{position: 'absolute', top: '5px', right: '5px', background: '#E6C200', color: 'black', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {cantidadSeleccionada}
                        </div>
                    )}
                    <img src={carta.image} alt={carta.name} className="imagen-carta" style={{width:'100%', display:'block'}} />
                    <div className="contenido-carta" style={{padding:'8px'}}>
                      <strong>{carta.name}</strong>
                      <p>ATK: {carta.attack} | DEF: {carta.defense}</p>
                      <p style={{color:'#E6C200'}}>Disponibles: {carta.cantidad - cantidadSeleccionada}</p>
                      {cantidadSeleccionada > 0 && (
                          <button onClick={(e) => handleRestar(e, carta.id)} style={{marginTop: '5px', background: '#d32f2f', color: 'white', border: 'none', width: '100%', cursor: 'pointer'}}>
                            Quitar
                          </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}