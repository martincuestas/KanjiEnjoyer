"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { clearToken, getToken, setToken } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface AuthCtx {
  username: string | null;
  isAuthed: boolean;
  authLoading: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  username: null,
  isAuthed: false,
  authLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.username) {
          setUsername(data.username);
        } else {
          clearToken();
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  function login(token: string, uname: string) {
    setToken(token);
    setUsername(uname);
  }

  function logout() {
    clearToken();
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ username, isAuthed: username !== null, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
