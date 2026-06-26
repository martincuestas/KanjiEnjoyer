"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken, isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{
        background: "var(--color-washi-light)",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <Link
        href="/"
        className="text-xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
      >
        漢字 Enjoyer
      </Link>

      <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--color-ink-muted)" }}>
        {authed ? (
          <>
            <Link href="/kanji" className="hover:opacity-70 transition-opacity">Kanji</Link>
            <Link href="/study" className="hover:opacity-70 transition-opacity">Estudiar</Link>
            <Link href="/stats" className="hover:opacity-70 transition-opacity">Stats</Link>
            <Link href="/settings" className="hover:opacity-70 transition-opacity">Ajustes</Link>
            <button
              onClick={logout}
              className="hover:opacity-70 transition-opacity"
              style={{ color: "var(--color-ink-faint)" }}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:opacity-70 transition-opacity">Entrar</Link>
            <Link
              href="/register"
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-opacity hover:opacity-85"
              style={{ background: "var(--color-torii)", color: "#fff" }}
            >
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
