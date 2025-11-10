import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../db/yugioh";

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  users: Usuario[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          setUsers(parsedUsers);
        } else {
          console.warn("⚠️ Datos de usuarios inválidos. Reiniciando...");
          localStorage.removeItem("users");
          setUsers([]);
        }
      } else {
        setUsers([]);
      }

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("❌ Error al cargar usuarios desde localStorage:", error);
      setUsers([]);
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
      role: "cliente",
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
