"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerRequest, setToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
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
      setToken(token);
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
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-5xl leading-none select-none"
            style={{ fontFamily: "var(--font-jp)", color: "var(--color-torii)" }}
          >
            字
          </span>
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
            <p className="text-xs rounded-md px-3 py-2" style={{ background: "var(--color-wrong-bg)", color: "var(--color-wrong)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md py-2.5 text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-50 mt-1"
            style={{ background: "var(--color-torii)", color: "#fff" }}
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: "var(--color-ink-faint)" }}>
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
