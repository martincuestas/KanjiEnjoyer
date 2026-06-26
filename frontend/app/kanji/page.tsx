"use client";
import { useEffect, useState, useCallback } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { api } from "@/lib/api";

interface Kanji {
  id: number;
  character: string;
  meanings: string[];
  onyomi: string | null;
  kunyomi: string | null;
  romaji: string | null;
  jlpt_level: string;
}

export default function KanjiPage() {
  useRequireAuth();

  const [kanji, setKanji] = useState<Kanji[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const [all, sel] = await Promise.all([
        api.get<Kanji[]>("/kanji"),
        api.get<number[]>("/kanji/selection"),
      ]);
      setKanji(all);
      setSelected(new Set(sel));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function toggle(id: number) {
    setSaved(false);
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSaved(false);
    setSelected(new Set(kanji.map((k) => k.id)));
  }

  function clearAll() {
    setSaved(false);
    setSelected(new Set());
  }

  async function save() {
    setSaving(true);
    try {
      await api.put("/kanji/selection", { kanji_ids: [...selected] });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span style={{ color: "var(--color-ink-faint)" }}>Cargando…</span>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-8 px-4 py-10 max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
        >
          Kanji N5
        </h1>
        <p style={{ color: "var(--color-ink-muted)" }} className="text-sm">
          Seleccioná los kanji que querés estudiar. Podés cambiar tu selección en cualquier momento.
        </p>
      </div>

      {/* Controls */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-lg px-5 py-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: "var(--color-torii)" }}
          >
            {selected.size}
          </span>
          <span className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            / {kanji.length} seleccionados
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={selectAll}
            className="text-xs px-3 py-1.5 rounded-md transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-ink-muted)",
              border: "1px solid var(--color-border)",
              background: "var(--color-washi)",
            }}
          >
            Todos
          </button>
          <button
            onClick={clearAll}
            className="text-xs px-3 py-1.5 rounded-md transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-ink-muted)",
              border: "1px solid var(--color-border)",
              background: "var(--color-washi)",
            }}
          >
            Ninguno
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="text-sm px-5 py-2 rounded-md font-medium transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ background: "var(--color-torii)", color: "#fff" }}
          >
            {saving ? "Guardando…" : saved ? "¡Guardado!" : "Guardar"}
          </button>
        </div>
      </div>

      {/* Kanji grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {kanji.map((k) => {
          const isSelected = selected.has(k.id);
          return (
            <button
              key={k.id}
              onClick={() => toggle(k.id)}
              className="flex flex-col items-center gap-2 rounded-lg px-3 py-4 transition-all duration-150 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: isSelected ? "#FDF0EC" : "var(--color-surface)",
                border: isSelected
                  ? "2px solid var(--color-torii)"
                  : "1px solid var(--color-border-light)",
                boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
              }}
            >
              <span
                className="text-4xl leading-none select-none"
                style={{
                  fontFamily: "var(--font-jp)",
                  color: isSelected ? "var(--color-torii)" : "var(--color-ink)",
                }}
              >
                {k.character}
              </span>
              <span
                className="text-xs text-center leading-snug line-clamp-2"
                style={{ color: isSelected ? "var(--color-torii-dark)" : "var(--color-ink-muted)" }}
              >
                {k.meanings.slice(0, 2).join(", ")}
              </span>
              {isSelected && (
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-torii)" }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating save hint */}
      {selected.size === 0 && (
        <p className="text-center text-sm" style={{ color: "var(--color-ink-faint)" }}>
          Seleccioná al menos un kanji para poder estudiar.
        </p>
      )}
    </main>
  );
}
