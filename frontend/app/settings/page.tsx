"use client";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { api } from "@/lib/api";

interface UserInfo {
  id: number;
  username: string;
  current_generation: number;
}

export default function SettingsPage() {
  useRequireAuth();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState<{ generation: number; kanji: number } | null>(null);

  useEffect(() => {
    api.get<UserInfo>("/auth/me").then(setUser).catch(() => {});
  }, []);

  async function handleReset() {
    setResetting(true);
    try {
      const res = await api.post<{ current_generation: number; kanji_reset: number }>(
        "/study/reset",
        {}
      );
      setResetDone({ generation: res.current_generation, kanji: res.kanji_reset });
      setUser((u) => u ? { ...u, current_generation: res.current_generation } : u);
      setShowConfirm(false);
    } finally {
      setResetting(false);
    }
  }

  return (
    <main className="flex flex-col gap-8 px-4 py-10 max-w-lg mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
        >
          Configuración
        </h1>
        {user && (
          <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            @{user.username} · Ciclo {user.current_generation}
          </p>
        )}
      </div>

      {/* Reset card */}
      <div
        className="rounded-xl px-6 py-6 flex flex-col gap-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>
            Reiniciar progreso
          </h2>
          <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Resetea el mastery y las repeticiones de todos tus kanji a cero. Empezás
            un nuevo ciclo de estudio desde el principio.
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-faint)" }}>
            Tu historial de intentos no se borra — quedará registrado como ciclo{" "}
            {user?.current_generation ?? "…"} en las estadísticas.
          </p>
        </div>

        {resetDone ? (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{ background: "var(--color-correct-bg)", color: "var(--color-correct)" }}
          >
            ✓ Progreso reiniciado. {resetDone.kanji} kanji reseteados.
            Ahora estás en el ciclo {resetDone.generation}.
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="self-start text-sm px-4 py-2 rounded-md font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--color-wrong-bg)",
              color: "var(--color-wrong)",
              border: "1px solid var(--color-wrong)",
            }}
          >
            Reiniciar progreso
          </button>
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: "rgba(43,38,34,0.4)" }}
        >
          <div
            className="w-full max-w-sm rounded-xl px-6 py-8 flex flex-col gap-5"
            style={{
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <div className="flex flex-col gap-1.5">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
              >
                ¿Reiniciar progreso?
              </h3>
              <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                El mastery y las repeticiones de todos tus kanji volverán a cero.
                Esta acción no se puede deshacer.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-ink-faint)" }}>
                Tu historial de intentos se conserva intacto.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={resetting}
                className="flex-1 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-70 disabled:opacity-40"
                style={{
                  background: "var(--color-washi-dark)",
                  color: "var(--color-ink)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--color-wrong)", color: "#fff" }}
              >
                {resetting ? "Reiniciando…" : "Sí, reiniciar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
