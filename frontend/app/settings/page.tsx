"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { api } from "@/lib/api";
import { clearToken } from "@/lib/auth";

interface UserInfo {
  id: number;
  username: string;
  current_generation: number;
}

type Modal = "reset" | "delete" | null;

export default function SettingsPage() {
  useRequireAuth();
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState<{ generation: number; kanji: number } | null>(null);

  useEffect(() => {
    api.get<UserInfo>("/auth/me").then(setUser).catch(() => {});
  }, []);

  async function handleReset() {
    setLoading(true);
    try {
      const res = await api.post<{ current_generation: number; kanji_reset: number }>("/study/reset", {});
      setResetDone({ generation: res.current_generation, kanji: res.kanji_reset });
      setUser((u) => u ? { ...u, current_generation: res.current_generation } : u);
      setModal(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await api.del("/auth/me");
      clearToken();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col gap-8 px-4 py-10 max-w-lg mx-auto w-full">

      {/* Header */}
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
            Resetea el mastery y las repeticiones de todos tus kanji a cero. Empezás un nuevo ciclo desde el principio.
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-faint)" }}>
            Tu historial de intentos no se borra — quedará registrado como ciclo {user?.current_generation ?? "…"} en las estadísticas.
          </p>
        </div>
        {resetDone ? (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{ background: "var(--color-correct-bg)", color: "var(--color-correct)" }}
          >
            ✓ Progreso reiniciado. {resetDone.kanji} kanji reseteados. Ahora estás en el ciclo {resetDone.generation}.
          </div>
        ) : (
          <button
            onClick={() => setModal("reset")}
            className="self-start text-sm px-4 py-2 rounded-md font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--color-wrong-bg)", color: "var(--color-wrong)", border: "1px solid var(--color-wrong)" }}
          >
            Reiniciar progreso
          </button>
        )}
      </div>

      {/* Delete account card */}
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
            Borrar cuenta
          </h2>
          <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Elimina tu cuenta y todos los datos asociados de forma permanente.
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-faint)" }}>
            Esta acción es irreversible. Se borrarán tu progreso, selección e historial completo.
          </p>
        </div>
        <button
          onClick={() => setModal("delete")}
          className="self-start text-sm px-4 py-2 rounded-md font-medium transition-opacity hover:opacity-80"
          style={{ background: "#2B2622", color: "#fff" }}
        >
          Borrar cuenta
        </button>
      </div>

      {/* Modal */}
      {modal && (
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
            {modal === "reset" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}>
                    ¿Reiniciar progreso?
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                    El mastery y las repeticiones de todos tus kanji volverán a cero. Esta acción no se puede deshacer.
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-ink-faint)" }}>
                    Tu historial de intentos se conserva intacto.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)} disabled={loading}
                    className="flex-1 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-70 disabled:opacity-40"
                    style={{ background: "var(--color-washi-dark)", color: "var(--color-ink)", border: "1px solid var(--color-border)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReset} disabled={loading}
                    className="flex-1 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ background: "var(--color-wrong)", color: "#fff" }}
                  >
                    {loading ? "Reiniciando…" : "Sí, reiniciar"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}>
                    ¿Borrar cuenta?
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                    Se eliminarán permanentemente tu cuenta <strong>@{user?.username}</strong>, tu progreso, selección e historial de intentos.
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-ink-faint)" }}>
                    No hay forma de recuperar los datos después.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)} disabled={loading}
                    className="flex-1 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-70 disabled:opacity-40"
                    style={{ background: "var(--color-washi-dark)", color: "var(--color-ink)", border: "1px solid var(--color-border)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete} disabled={loading}
                    className="flex-1 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ background: "#2B2622", color: "#fff" }}
                  >
                    {loading ? "Borrando…" : "Sí, borrar todo"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
