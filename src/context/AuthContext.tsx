import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // aca se carga la informacion del localstorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const savedUser = localStorage.getItem("user");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // logica de inicio de sesion
  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setIsAuthenticated(true);
      setUser(email);
      localStorage.setItem("user", email);
      return true;
    }
    return false;
  };

  // registro de sesion
  const register = (email: string, password: string): boolean => {
    const exists = users.some((u) => u.email === email);
    if (exists) return false;

    const updatedUsers = [...users, { email, password }];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    return true;
  };

  // cerrar la sesion del localstorage
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
