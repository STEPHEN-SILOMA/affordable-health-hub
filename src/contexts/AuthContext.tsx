import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getCurrentUser, login as authLogin, signup as authSignup, logout as authLogout } from "@/lib/mock-auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  signup: (data: Omit<User, "id" | "memberSince">, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const u = authLogin(email, password);
    setUser(u);
  };

  const signup = (data: Omit<User, "id" | "memberSince">, password: string) => {
    const u = authSignup(data, password);
    setUser(u);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
