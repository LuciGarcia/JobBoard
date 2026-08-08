import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { getCurrentUser } from "../api/authApi";

// 1. Definimos qué datos y funciones va a proveer el contexto
interface AuthContextType {
  user: User | null; // null = no hay nadie logueado
  loading: boolean; // true mientras verifica si hay sesión activa
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// 2. Creamos el contexto con un valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. El Provider es el componente que "envuelve" la app y provee los datos
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verificamos si hay un token guardado y lo validamos
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Pedimos al backend quién es el usuario dueño de ese token
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch {
          // Si el token es inválido o expiró, lo eliminamos
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []); // El [] significa "ejecutar solo una vez, al montar el componente"

  const login = async (token: string) => {
    localStorage.setItem("token", token); // Guardamos el token
    const currentUser = await getCurrentUser(); // Pedimos los datos del usuario
    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook personalizado para usar el contexto fácilmente desde cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
