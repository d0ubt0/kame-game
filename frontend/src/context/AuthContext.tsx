import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Definimos la forma del usuario que viene de la DB
export interface Usuario {
  id: number;
  username: string;
  email: string;
  role: string;
  // No incluimos password aquí por seguridad
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  // Cambiamos las funciones para que sean asíncronas (Promesas)
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  // 1. Al cargar la página, revisamos si ya había sesión iniciada
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Función LOGIN (Conectada al Backend)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData)); // Guardamos sesión
        return true;
      } else {
        return false; // Credenciales incorrectas
      }
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  // 3. Función REGISTER (Conectada al Backend)
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Opcional: Auto-login después de registrarse
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      } else {
        return false; // Email ya existe
      }
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};