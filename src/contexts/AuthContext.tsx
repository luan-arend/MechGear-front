import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../services/api";

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Configura o token no cabeçalho
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          setToken(storedToken);

          // Busca as informações do usuário
          const response = await api.get("/users/me");
          setUser(response.data);
        } catch (error) {
          console.error("Erro ao inicializar autenticação:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("/login", { username, password });
      const { token: authToken } = response.data;

      if (!authToken) {
        throw new Error("Token não recebido do servidor");
      }

      // Salva o token e configura o cabeçalho
      localStorage.setItem("token", authToken);
      setToken(authToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      // Busca as informações do usuário
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Credenciais inválidas ou erro no servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logout realizado com sucesso");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {!isLoading ? children : <div>Carregando...</div>}
    </AuthContext.Provider>
  );
};
