"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SeigaihaPattern() {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "220px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "linear-gradient(to right, transparent 0%, black 55%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 55%)",
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="seigaiha-hdr"
            x="0"
            y="0"
            width="30"
            height="15"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,15 A15,15,0,0,1,30,15"
              fill="none"
              stroke="#3A6B47"
              strokeWidth="0.9"
            />
            <path
              d="M-15,0 A15,15,0,0,1,15,0"
              fill="none"
              stroke="#3A6B47"
              strokeWidth="0.9"
            />
            <path
              d="M15,0 A15,15,0,0,1,45,0"
              fill="none"
              stroke="#3A6B47"
              strokeWidth="0.9"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha-hdr)" opacity="0.18" />
      </svg>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const { username, isAuthed, authLoading, logout: authLogout } = useAuth();

  function logout() {
    authLogout();
    router.replace("/login");
  }

  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{
        position: "relative",
        background: "var(--color-washi-light)",
        borderBottom: "1px solid var(--color-border-light)",
        overflow: "hidden",
      }}
    >
      <SeigaihaPattern />

      {/* Brand mark */}
      <Link
        href={isAuthed ? "/kanji" : "/"}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "9px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1.5px solid var(--color-torii)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: 0.75,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jp)",
              fontSize: "13px",
              color: "var(--color-torii)",
              lineHeight: 1,
            }}
          >
            漢
          </span>
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
        >
          Kanji Enjoyer
        </span>
      </Link>

      <nav
        className="flex items-center gap-6 text-sm"
        style={{ position: "relative", zIndex: 1, color: "var(--color-ink-muted)" }}
      >
        {authLoading ? null : isAuthed ? (
          <>
            <Link href="/kanji" className="hover:opacity-70 transition-opacity">Kanji</Link>
            <Link href="/study" className="hover:opacity-70 transition-opacity">Estudiar</Link>
            <Link href="/stats" className="hover:opacity-70 transition-opacity">Stats</Link>
            <Link href="/settings" className="hover:opacity-70 transition-opacity">Ajustes</Link>
            <span
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "var(--color-washi)",
                border: "1px solid var(--color-border-light)",
                color: "var(--color-ink-muted)",
              }}
            >
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "var(--color-torii)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {username?.[0]?.toUpperCase()}
              </span>
              {username}
            </span>
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
