import { useEffect, useState } from "react";
import type { CartaConCantidad } from "../types/Carta";
import "./Filtro.css";

interface FiltroProps {
  cartas: CartaConCantidad[];
  onFiltrado: (filtradas: CartaConCantidad[]) => void;
  // Opciones personalizadas
  opcionesOrden?: string[]; // Array con las opciones a mostrar
}

export function Filtro({ 
  cartas, 
  onFiltrado,
  opcionesOrden = ["", "name", "cantidad", "attack", "defense"] // Valores por defecto
}: FiltroProps) {
  const [sortBy, setSortBy] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    let resultado = cartas.filter((c) =>
      (c.name ?? "").toLowerCase().includes(busqueda.toLowerCase())
    );

    if (sortBy === "attack") {
      resultado.sort((a, b) => (b.attack ?? 0) - (a.attack ?? 0));
    } else if (sortBy === "defense") {
      resultado.sort((a, b) => (b.defense ?? 0) - (a.defense ?? 0));
    } else if (sortBy === "name") {
      resultado.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    } else if (sortBy === "cantidad") {
      resultado.sort((a, b) => (b.cantidad ?? 0) - (a.cantidad ?? 0));
    }

    onFiltrado(resultado);
  }, [cartas, sortBy, busqueda, onFiltrado]);

  // Mapeo de valores a etiquetas
  const getLabel = (value: string) => {
    const labels: Record<string, string> = {
      "": "Ninguno",
      "name": "Nombre",
      "cantidad": "Cantidad",
      "attack": "Ataque",
      "defense": "Defensa"
    };
    return labels[value] || value;
  };

  return (
    <div className="FiltroContainer">
      <label htmlFor="sort">Ordenar por:</label>

      <select
        id="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        {opcionesOrden.map((valor) => (
          <option key={valor} value={valor}>
            {getLabel(valor)}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
}