// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/yugioh";

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  users: Usuario[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN: Usuario = {
  id: 1,
  username: "admin",
  email: "admin@admin.com",
  password: "admin123", // 👈 contraseña por defecto
  role: "admin",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [users, setUsers] = useState<Usuario[]>([]);

  // === Cargar usuarios desde localStorage ===
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem("users");
      const savedUser = localStorage.getItem("user");

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers)) {
          // Si no hay admin en el array, agregarlo
          const hasAdmin = parsedUsers.some(
            (u: Usuario) => u.role === "admin"
          );
          const updatedUsers = hasAdmin
            ? parsedUsers
            : [...parsedUsers, DEFAULT_ADMIN];

          setUsers(updatedUsers);
          localStorage.setItem("users", JSON.stringify(updatedUsers));
        }
      } else {
        // No había usuarios en localStorage → crear lista con el admin por defecto
        setUsers([DEFAULT_ADMIN]);
        localStorage.setItem("users", JSON.stringify([DEFAULT_ADMIN]));
      }

      // Cargar usuario autenticado (si hay uno guardado)
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("❌ Error al cargar usuarios desde localStorage:", error);
      setUsers([DEFAULT_ADMIN]);
      localStorage.setItem("users", JSON.stringify([DEFAULT_ADMIN]));
    }
  }, []);

  // === Iniciar sesión ===
  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setIsAuthenticated(true);
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // === Registrar nuevo usuario ===
  const register = (email: string, password: string): boolean => {
    const exists = users.some((u) => u.email === email);
    if (exists) return false;

    const username = email.split("@")[0];

    const newUser: Usuario = {
      id: Date.now(),
      username,
      email,
      password,
      role: "cliente", // 👈 todos los nuevos son clientes
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    return true;
  };

  // === Cerrar sesión ===
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, users, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
