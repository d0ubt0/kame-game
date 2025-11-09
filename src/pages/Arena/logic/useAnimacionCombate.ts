import { useState } from "react";

export function useAnimacionCombate() {
  const [animaciones, setAnimaciones] = useState<{ [key: string]: string }>({});

  const activarAnimacion = (key: string, tipo: string, duracion = 800) => {
    setAnimaciones((prev) => ({ ...prev, [key]: tipo }));
    setTimeout(() => {
      setAnimaciones((prev) => {
        const nuevo = { ...prev };
        delete nuevo[key];
        return nuevo;
      });
    }, duracion);
  };

  return { animaciones, activarAnimacion };
}
