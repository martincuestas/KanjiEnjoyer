"use client";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { api } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface TypeAccuracy { total: number; correct: number; accuracy: number; }
interface GenerationSummary { generation: number; meaning: TypeAccuracy; usage: TypeAccuracy; }
interface KanjiStatItem {
  kanji_id: number; character: string; meanings: string[];
  mastery_meaning: number; mastery_usage: number;
  reps_meaning: number; reps_usage: number;
}
interface DailyPoint { date: string; total: number; correct: number; }
interface StatsData {
  current_generation: number;
  all_generations: GenerationSummary[];
  kanji_progress: KanjiStatItem[];
  daily_activity: DailyPoint[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function masteryColor(v: number): string {
  if (v >= 0.7) return "var(--color-correct)";
  if (v >= 0.4) return "var(--color-gold)";
  return "var(--color-torii)";
}

function pct(v: number) { return `${Math.round(v * 100)}%`; }

function AccuracyCard({ label, data, chip }: { label: string; data: TypeAccuracy; chip: string }) {
  const isEmpty = data.total === 0;
  return (
    <div
      className="flex-1 min-w-0 rounded-xl px-5 py-5 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--color-ink-muted)" }}>{label}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "var(--color-washi-dark)", color: "var(--color-ink-muted)" }}
        >
          {chip}
        </span>
      </div>
      {isEmpty ? (
        <span className="text-2xl font-bold" style={{ color: "var(--color-ink-faint)" }}>—</span>
      ) : (
        <>
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: masteryColor(data.accuracy) }}
          >
            {pct(data.accuracy)}
          </span>
          <div className="w-full h-1.5 rounded-full" style={{ background: "var(--color-border)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: pct(data.accuracy), background: masteryColor(data.accuracy) }}
            />
          </div>
          <span className="text-xs" style={{ color: "var(--color-ink-faint)" }}>
            {data.correct} / {data.total} correctas
          </span>
        </>
      )}
    </div>
  );
}

// ── Activity chart (SVG, no deps) ──────────────────────────────────────────────

function ActivityChart({ daily }: { daily: DailyPoint[] }) {
  if (daily.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--color-ink-faint)" }}>
        Sin actividad en los últimos 30 días.
      </p>
    );
  }

  const W = 560; const H = 80; const BAR_W = 14; const GAP = 4;
  const maxTotal = Math.max(...daily.map((d) => d.total), 1);

  // Fill last 30 days including gaps
  const allDays: (DailyPoint | null)[] = [];
  const map = new Map(daily.map((d) => [d.date, d]));
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    allDays.push(map.get(key) ?? null);
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ minWidth: 320 }}>
        {allDays.map((day, i) => {
          const x = i * (BAR_W + GAP);
          if (!day) {
            return (
              <rect
                key={i} x={x} y={H - 4} width={BAR_W} height={4}
                rx={2} fill="var(--color-border)"
              />
            );
          }
          const barH = Math.max(4, Math.round((day.total / maxTotal) * H));
          const acc = day.total > 0 ? day.correct / day.total : 0;
          return (
            <g key={i}>
              <rect
                x={x} y={H - barH} width={BAR_W} height={barH}
                rx={2} fill={masteryColor(acc)} opacity={0.85}
              />
              <title>{day.date}: {day.correct}/{day.total} correctas</title>
            </g>
          );
        })}
        <text x={0} y={H + 16} fontSize={9} fill="var(--color-ink-faint)">hace 30 días</text>
        <text x={W - 30} y={H + 16} fontSize={9} fill="var(--color-ink-faint)">hoy</text>
      </svg>
    </div>
  );
}

// ── Kanji progress grid ────────────────────────────────────────────────────────

function KanjiGrid({ items }: { items: KanjiStatItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--color-ink-faint)" }}>
        Todavía no estudiaste ningún kanji.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((k) => (
        <div
          key={k.kanji_id}
          className="flex flex-col gap-2.5 rounded-lg px-3 py-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-start justify-between gap-1">
            <span
              className="text-3xl leading-none"
              style={{ fontFamily: "var(--font-jp)", color: "var(--color-ink)" }}
            >
              {k.character}
            </span>
            <span className="text-xs leading-snug text-right" style={{ color: "var(--color-ink-faint)" }}>
              {k.meanings.slice(0, 1).join("")}
            </span>
          </div>

          {/* Meaning bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-xs" style={{ color: "var(--color-ink-faint)" }}>
              <span>意</span><span>{pct(k.mastery_meaning)}</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "var(--color-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: pct(k.mastery_meaning), background: masteryColor(k.mastery_meaning) }}
              />
            </div>
          </div>

          {/* Usage bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-xs" style={{ color: "var(--color-ink-faint)" }}>
              <span>用</span><span>{pct(k.mastery_usage)}</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "var(--color-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: pct(k.mastery_usage), background: masteryColor(k.mastery_usage) }}
              />
            </div>
          </div>

          <span className="text-xs" style={{ color: "var(--color-ink-faint)" }}>
            {k.reps_meaning + k.reps_usage} reps
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Generation table ───────────────────────────────────────────────────────────

function GenerationTable({ gens, current }: { gens: GenerationSummary[]; current: number }) {
  if (gens.length <= 1) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--color-border-light)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--color-washi-dark)" }}>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--color-ink-muted)" }}>Ciclo</th>
            <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--color-ink-muted)" }}>Significado</th>
            <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--color-ink-muted)" }}>Uso</th>
            <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--color-ink-muted)" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {[...gens].reverse().map((g) => {
            const total = g.meaning.total + g.usage.total;
            const correct = g.meaning.correct + g.usage.correct;
            const isCurrent = g.generation === current;
            return (
              <tr
                key={g.generation}
                style={{
                  background: isCurrent ? "#FDF0EC" : "var(--color-surface)",
                  borderTop: "1px solid var(--color-border-light)",
                }}
              >
                <td className="px-4 py-3" style={{ color: isCurrent ? "var(--color-torii)" : "var(--color-ink)" }}>
                  Ciclo {g.generation}{isCurrent && " ✦"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--color-ink-muted)" }}>
                  {g.meaning.total > 0 ? pct(g.meaning.accuracy) : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--color-ink-muted)" }}>
                  {g.usage.total > 0 ? pct(g.usage.accuracy) : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium" style={{ color: "var(--color-ink)" }}>
                  {total > 0 ? `${correct}/${total}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function StatsPage() {
  useRequireAuth();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<StatsData>("/stats").then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span style={{ color: "var(--color-ink-faint)" }}>Cargando…</span>
      </main>
    );
  }

  if (!data) return null;

  const currentGen = data.all_generations.find((g) => g.generation === data.current_generation);

  return (
    <main className="flex flex-col gap-10 px-4 py-10 max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
        >
          Estadísticas
        </h1>
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          Ciclo actual: {data.current_generation}
        </p>
      </div>

      {/* Accuracy cards */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
          Precisión — ciclo {data.current_generation}
        </h2>
        <div className="flex gap-3 flex-wrap">
          <AccuracyCard
            label="Significado y lectura"
            data={currentGen?.meaning ?? { total: 0, correct: 0, accuracy: 0 }}
            chip="意味"
          />
          <AccuracyCard
            label="Uso en oración"
            data={currentGen?.usage ?? { total: 0, correct: 0, accuracy: 0 }}
            chip="用法"
          />
        </div>
      </section>

      {/* Activity chart */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
          Actividad reciente — últimos 30 días
        </h2>
        <div
          className="rounded-xl px-5 py-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <ActivityChart daily={data.daily_activity} />
          <div className="flex gap-4 mt-3 text-xs" style={{ color: "var(--color-ink-faint)" }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "var(--color-correct)" }} />
              ≥ 70%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "var(--color-gold)" }} />
              40–70%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "var(--color-torii)" }} />
              &lt; 40%
            </span>
          </div>
        </div>
      </section>

      {/* Kanji progress */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
          Progreso por kanji
        </h2>
        <KanjiGrid items={data.kanji_progress} />
      </section>

      {/* Generation comparison */}
      {data.all_generations.length > 1 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
            Comparación de ciclos
          </h2>
          <GenerationTable gens={data.all_generations} current={data.current_generation} />
        </section>
      )}

    </main>
  );
}
