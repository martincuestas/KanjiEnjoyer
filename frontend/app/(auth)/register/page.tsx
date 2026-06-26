"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

function CardCorners() {
  const s = "var(--color-torii)";
  return (
    <>
      <svg style={{ position: "absolute", top: 10, left: 10 }} width={18} height={18} viewBox="0 0 18 18">
        <path d="M18,2 L2,2 L2,18" fill="none" stroke={s} strokeWidth="1.5" opacity="0.4" />
      </svg>
      <svg style={{ position: "absolute", top: 10, right: 10 }} width={18} height={18} viewBox="0 0 18 18">
        <path d="M0,2 L16,2 L16,18" fill="none" stroke={s} strokeWidth="1.5" opacity="0.4" />
      </svg>
      <svg style={{ position: "absolute", bottom: 10, left: 10 }} width={18} height={18} viewBox="0 0 18 18">
        <path d="M18,16 L2,16 L2,0" fill="none" stroke={s} strokeWidth="1.5" opacity="0.4" />
      </svg>
      <svg style={{ position: "absolute", bottom: 10, right: 10 }} width={18} height={18} viewBox="0 0 18 18">
        <path d="M0,16 L16,16 L16,0" fill="none" stroke={s} strokeWidth="1.5" opacity="0.4" />
      </svg>
    </>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const token = await registerRequest(username.trim(), password);
      auth.login(token, username.trim());
      router.replace("/kanji");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div
        className="w-full max-w-sm rounded-xl px-8 py-10 flex flex-col gap-6"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <CardCorners />

        {/* Kanji watermark de fondo */}
        <span
          style={{
            position: "absolute",
            bottom: "-18px",
            right: "-12px",
            fontFamily: "var(--font-jp)",
            fontSize: "175px",
            lineHeight: 1,
            color: "var(--color-torii)",
            opacity: 0.04,
            userSelect: "none",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          字
        </span>

        {/* Logo */}
        <div className="flex flex-col items-center gap-1" style={{ position: "relative" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "2px solid var(--color-torii)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.8,
            }}
          >
            <span
              style={{ fontFamily: "var(--font-jp)", fontSize: "20px", color: "var(--color-torii)", lineHeight: 1 }}
            >
              漢
            </span>
          </div>
          <h1
            className="text-xl font-semibold mt-1"
            style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
          >
            Kanji Enjoyer
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-faint)" }}>
            Creá tu cuenta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="3–32 caracteres"
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "var(--color-washi)",
                border: "1px solid var(--color-border)",
                color: "var(--color-ink)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-torii)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "var(--color-washi)",
                border: "1px solid var(--color-border)",
                color: "var(--color-ink)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-torii)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Repetir contraseña
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "var(--color-washi)",
                border: "1px solid var(--color-border)",
                color: "var(--color-ink)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-torii)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>

          {error && (
            <p
              className="text-xs rounded-md px-3 py-2"
              style={{ background: "var(--color-wrong-bg)", color: "var(--color-wrong)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md py-2.5 text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-50 mt-1"
            style={{
              background: "var(--color-torii)",
              color: "#fff",
              boxShadow: "0 2px 10px rgba(58,107,71,0.28)",
            }}
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: "var(--color-ink-faint)", position: "relative" }}>
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--color-torii)" }}
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
