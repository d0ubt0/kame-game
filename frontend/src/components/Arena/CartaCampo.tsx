import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockCartas = [
  { id: 1, nombre: "Maldición del Dragón", atk: 2000, img: "/cards/dragon.jpg" },
  { id: 2, nombre: "Bestia Cristal Águila", atk: 1800, img: "/cards/eagle.jpg" },
];

export default function SeleccionCartas() {
  const navigate = useNavigate();
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  const handleSeleccion = (id: number) => {
    if (seleccionadas.includes(id)) {
      setSeleccionadas(seleccionadas.filter((cartaId) => cartaId !== id));
    } else if (seleccionadas.length < 10) {
      setSeleccionadas([...seleccionadas, id]);
    } else {
      alert("⚠️ Solo puedes seleccionar 10 cartas.");
    }
  };

  const iniciarBatalla = () => {
    if (seleccionadas.length < 10) {
      alert("Selecciona 10 cartas para iniciar la batalla.");
      return;
    }
    localStorage.setItem("cartasSeleccionadas", JSON.stringify(seleccionadas));
    navigate("/arena/batalla");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#E6C200" }}>Selecciona tus 10 cartas</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {mockCartas.map((carta) => (
          <div
            key={carta.id}
            onClick={() => handleSeleccion(carta.id)}
            style={{
              border: seleccionadas.includes(carta.id)
                ? "3px solid #E6C200"
                : "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              overflow: "hidden",
              textAlign: "center",
              background: "#111",
            }}
          >
            <img
              src={carta.img}
              alt={carta.nombre}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ color: "#fff", padding: "8px" }}>
              <strong>{carta.nombre}</strong>
              <p>ATK: {carta.atk}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <p style={{ color: "#E6C200" }}>
          Cartas seleccionadas: {seleccionadas.length} / 10
        </p>
        <button
          onClick={iniciarBatalla}
          disabled={seleccionadas.length !== 10}
          style={{
            backgroundColor:
              seleccionadas.length === 10 ? "#E6C200" : "#777",
            color: "black",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: seleccionadas.length === 10 ? "pointer" : "not-allowed",
          }}
        >
          Iniciar Batalla
        </button>
      </div>
    </div>
  );
}
