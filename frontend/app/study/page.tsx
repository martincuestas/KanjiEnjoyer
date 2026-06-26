"use client";
import { useState, useCallback } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { api } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface KanjiInfo {
  id: number;
  character: string;
  meanings: string[];
  onyomi: string | null;
  kunyomi: string | null;
  romaji: string | null;
}

interface MeaningOption {
  kanji_id: number;
  meanings: string[];
  onyomi: string | null;
  kunyomi: string | null;
  romaji: string | null;
  is_correct: boolean;
}

interface UsageOption {
  sentence_id: number;
  text_jp: string;
  furigana: string | null;
  romaji: string | null;
  translation: string | null;
  is_correct: boolean;
}

interface RoundItem {
  kanji: KanjiInfo;
  meaning_question: MeaningOption[];
  usage_question: UsageOption[] | null;
}

interface Result {
  kanji: KanjiInfo;
  meaningCorrect: boolean;
  usageCorrect: boolean | null;
}

type Phase = "setup" | "meaning" | "meaning-result" | "usage" | "usage-result" | "summary";

// ── Helpers ────────────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between text-xs" style={{ color: "var(--color-ink-faint)" }}>
        <span>Kanji {Math.min(current + 1, total)} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ background: "var(--color-border)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "var(--color-torii)" }}
        />
      </div>
    </div>
  );
}

function QuestionChip({ type }: { type: "meaning" | "usage" }) {
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        background: type === "meaning" ? "#FDF0EC" : "#EEF2EC",
        color: type === "meaning" ? "var(--color-torii)" : "var(--color-matcha)",
        border: `1px solid ${type === "meaning" ? "var(--color-torii-light)" : "var(--color-matcha-light)"}`,
      }}
    >
      {type === "meaning" ? "Significado y lectura" : "Uso en oración"}
    </span>
  );
}

// ── Setup screen ───────────────────────────────────────────────────────────────

function SetupScreen({ onStart }: { onStart: (n: number) => void }) {
  const [n, setN] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle() {
    setError("");
    setLoading(true);
    try {
      await onStart(n);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar la ronda.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-10 py-16 px-4 max-w-sm mx-auto w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <span
          className="text-6xl leading-none select-none"
          style={{ fontFamily: "var(--font-jp)", color: "var(--color-torii)" }}
        >
          学
        </span>
        <h1
          className="text-2xl font-bold mt-2"
          style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
        >
          Nueva ronda
        </h1>
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          El motor elige los kanji que más necesitás repasar.
        </p>
      </div>

      <div
        className="w-full flex flex-col gap-4 rounded-xl px-6 py-6"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Kanji por ronda
            </label>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: "var(--color-torii)" }}
            >
              {n}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-[#C1440E]"
          />
          <div className="flex justify-between text-xs" style={{ color: "var(--color-ink-faint)" }}>
            <span>1</span>
            <span>10</span>
          </div>
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
          onClick={handle}
          disabled={loading}
          className="w-full rounded-md py-3 text-sm font-medium transition-opacity hover:opacity-85 disabled:opacity-50 mt-1"
          style={{ background: "var(--color-torii)", color: "#fff" }}
        >
          {loading ? "Preparando…" : "Empezar"}
        </button>
      </div>
    </div>
  );
}

// ── Meaning question ───────────────────────────────────────────────────────────

function MeaningQuestion({
  item,
  onAnswer,
  answered,
  selectedIdx,
}: {
  item: RoundItem;
  onAnswer: (idx: number, correct: boolean) => void;
  answered: boolean;
  selectedIdx: number | null;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 py-8">
        <span
          className="text-9xl leading-none select-none"
          style={{ fontFamily: "var(--font-jp)", color: "var(--color-ink)" }}
        >
          {item.kanji.character}
        </span>
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          ¿Qué significa y cómo se lee?
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {item.meaning_question.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const showResult = answered;
          let bg = "var(--color-surface)";
          let border = "var(--color-border-light)";
          let textColor = "var(--color-ink)";
          if (showResult) {
            if (opt.is_correct) {
              bg = "var(--color-correct-bg)";
              border = "var(--color-correct)";
              textColor = "var(--color-correct)";
            } else if (isSelected && !opt.is_correct) {
              bg = "var(--color-wrong-bg)";
              border = "var(--color-wrong)";
              textColor = "var(--color-wrong)";
            }
          } else if (isSelected) {
            border = "var(--color-torii)";
          }

          return (
            <button
              key={idx}
              onClick={() => !answered && onAnswer(idx, opt.is_correct)}
              disabled={answered}
              className="w-full text-left rounded-lg px-4 py-3.5 transition-all duration-200 disabled:cursor-default"
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                color: textColor,
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {opt.meanings.join(", ")}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-jp)",
                    color: showResult && opt.is_correct ? "var(--color-correct)" : "var(--color-ink-muted)",
                  }}
                >
                  {[opt.onyomi, opt.kunyomi].filter(Boolean).join(" / ")}
                </span>
                {opt.romaji && (
                  <span className="text-xs" style={{ color: "var(--color-ink-faint)" }}>
                    {opt.romaji}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Usage question ─────────────────────────────────────────────────────────────

function UsageQuestion({
  item,
  onAnswer,
  answered,
  selectedIdx,
}: {
  item: RoundItem;
  onAnswer: (idx: number, correct: boolean) => void;
  answered: boolean;
  selectedIdx: number | null;
}) {
  if (!item.usage_question) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 py-6">
        <span
          className="text-5xl leading-none select-none"
          style={{ fontFamily: "var(--font-jp)", color: "var(--color-ink)" }}
        >
          {item.kanji.character}
        </span>
        <span className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          {item.kanji.meanings.slice(0, 2).join(", ")}
        </span>
        <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
          ¿En cuál oración se usa <span style={{ fontFamily: "var(--font-jp)" }}>{item.kanji.character}</span> correctamente?
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {item.usage_question.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const showResult = answered;
          let bg = "var(--color-surface)";
          let border = "var(--color-border-light)";
          let textColor = "var(--color-ink)";
          if (showResult) {
            if (opt.is_correct) {
              bg = "var(--color-correct-bg)";
              border = "var(--color-correct)";
              textColor = "var(--color-correct)";
            } else if (isSelected && !opt.is_correct) {
              bg = "var(--color-wrong-bg)";
              border = "var(--color-wrong)";
              textColor = "var(--color-wrong)";
            }
          } else if (isSelected) {
            border = "var(--color-torii)";
          }

          return (
            <button
              key={idx}
              onClick={() => !answered && onAnswer(idx, opt.is_correct)}
              disabled={answered}
              className="w-full text-left rounded-lg px-4 py-4 transition-all duration-200 disabled:cursor-default"
              style={{ background: bg, border: `1.5px solid ${border}` }}
            >
              <div className="flex flex-col gap-1">
                <span
                  className="text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-jp)", color: textColor }}
                >
                  {opt.text_jp}
                </span>
                {opt.translation && (
                  <span
                    className="text-xs"
                    style={{
                      color: showResult && opt.is_correct ? "var(--color-correct)" : "var(--color-ink-faint)",
                    }}
                  >
                    {opt.translation}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Feedback bar ───────────────────────────────────────────────────────────────

function FeedbackBar({
  correct,
  onContinue,
  label,
}: {
  correct: boolean;
  onContinue: () => void;
  label: string;
}) {
  return (
    <div
      className="w-full flex items-center justify-between rounded-xl px-5 py-4 mt-2"
      style={{
        background: correct ? "var(--color-correct-bg)" : "var(--color-wrong-bg)",
        border: `1px solid ${correct ? "var(--color-correct)" : "var(--color-wrong)"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{correct ? "✓" : "✗"}</span>
        <span
          className="text-sm font-medium"
          style={{ color: correct ? "var(--color-correct)" : "var(--color-wrong)" }}
        >
          {correct ? "¡Correcto!" : "Incorrecto"}
        </span>
      </div>
      <button
        onClick={onContinue}
        className="text-sm font-medium px-4 py-1.5 rounded-md transition-opacity hover:opacity-80"
        style={{
          background: correct ? "var(--color-correct)" : "var(--color-wrong)",
          color: "#fff",
        }}
      >
        {label} →
      </button>
    </div>
  );
}

// ── Summary screen ─────────────────────────────────────────────────────────────

function SummaryScreen({
  results,
  onNewRound,
}: {
  results: Result[];
  onNewRound: () => void;
}) {
  const meaningCorrect = results.filter((r) => r.meaningCorrect).length;
  const usageResults = results.filter((r) => r.usageCorrect !== null);
  const usageCorrect = usageResults.filter((r) => r.usageCorrect).length;
  const total = results.length;

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4 max-w-md mx-auto w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <span
          className="text-6xl leading-none select-none"
          style={{ fontFamily: "var(--font-jp)", color: "var(--color-torii)" }}
        >
          完
        </span>
        <h2
          className="text-2xl font-bold mt-2"
          style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
        >
          Ronda completada
        </h2>
      </div>

      <div
        className="w-full rounded-xl px-6 py-6 flex flex-col gap-5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Score bars */}
        {[
          { label: "Significado y lectura", correct: meaningCorrect, total },
          ...(usageResults.length > 0
            ? [{ label: "Uso en oración", correct: usageCorrect, total: usageResults.length }]
            : []),
        ].map(({ label, correct, total: t }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-ink-muted)" }}>{label}</span>
              <span
                className="font-bold tabular-nums"
                style={{ color: correct === t ? "var(--color-correct)" : "var(--color-torii)" }}
              >
                {correct}/{t}
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: "var(--color-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.round((correct / t) * 100)}%`,
                  background: correct === t ? "var(--color-correct)" : "var(--color-torii)",
                }}
              />
            </div>
          </div>
        ))}

        {/* Per-kanji breakdown */}
        <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid var(--color-border-light)" }}>
          {results.map((r) => (
            <div key={r.kanji.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl leading-none"
                  style={{ fontFamily: "var(--font-jp)", color: "var(--color-ink)" }}
                >
                  {r.kanji.character}
                </span>
                <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                  {r.kanji.meanings.slice(0, 1).join(", ")}
                </span>
              </div>
              <div className="flex gap-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: r.meaningCorrect ? "var(--color-correct-bg)" : "var(--color-wrong-bg)",
                    color: r.meaningCorrect ? "var(--color-correct)" : "var(--color-wrong)",
                  }}
                >
                  意
                </span>
                {r.usageCorrect !== null && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: r.usageCorrect ? "var(--color-correct-bg)" : "var(--color-wrong-bg)",
                      color: r.usageCorrect ? "var(--color-correct)" : "var(--color-wrong)",
                    }}
                  >
                    用
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onNewRound}
          className="w-full rounded-md py-3 text-sm font-medium transition-opacity hover:opacity-85"
          style={{ background: "var(--color-torii)", color: "#fff" }}
        >
          Nueva ronda
        </button>
        <a
          href="/kanji"
          className="w-full rounded-md py-3 text-sm font-medium text-center transition-opacity hover:opacity-70"
          style={{
            background: "var(--color-washi-dark)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-border)",
          }}
        >
          Editar selección de kanji
        </a>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function StudyPage() {
  useRequireAuth();

  const [phase, setPhase] = useState<Phase>("setup");
  const [items, setItems] = useState<RoundItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  // Accumulate per-item result as we go
  const [currentResult, setCurrentResult] = useState<Partial<Result>>({});

  const currentItem = items[currentIdx] ?? null;

  const startRound = useCallback(async (n: number) => {
    const data = await api.post<{ items: RoundItem[] }>("/study/round", { n });
    setItems(data.items);
    setCurrentIdx(0);
    setSelectedIdx(null);
    setResults([]);
    setCurrentResult({});
    setPhase("meaning");
  }, []);

  function handleMeaningAnswer(optIdx: number, correct: boolean) {
    setSelectedIdx(optIdx);
    setCurrentResult((prev) => ({ ...prev, kanji: currentItem.kanji, meaningCorrect: correct }));
    // Fire and forget
    api.post("/study/answer", {
      kanji_id: currentItem.kanji.id,
      question_type: "meaning",
      correct,
    }).catch(() => {});
    setPhase("meaning-result");
  }

  function handleUsageAnswer(optIdx: number, correct: boolean) {
    setSelectedIdx(optIdx);
    setCurrentResult((prev) => ({ ...prev, usageCorrect: correct }));
    api.post("/study/answer", {
      kanji_id: currentItem.kanji.id,
      question_type: "usage",
      correct,
    }).catch(() => {});
    setPhase("usage-result");
  }

  function advanceFromMeaning() {
    setSelectedIdx(null);
    if (currentItem.usage_question) {
      setPhase("usage");
    } else {
      // No usage question for this kanji — finalize and move on
      finalizeItem({ ...currentResult, usageCorrect: null } as Result);
    }
  }

  function advanceFromUsage() {
    setSelectedIdx(null);
    finalizeItem({ ...currentResult, usageCorrect: currentResult.usageCorrect ?? null } as Result);
  }

  function finalizeItem(result: Result) {
    const newResults = [...results, result];
    setResults(newResults);
    setCurrentResult({});
    const nextIdx = currentIdx + 1;
    if (nextIdx >= items.length) {
      setPhase("summary");
    } else {
      setCurrentIdx(nextIdx);
      setPhase("meaning");
    }
  }

  function resetToSetup() {
    setPhase("setup");
    setItems([]);
    setCurrentIdx(0);
    setSelectedIdx(null);
    setResults([]);
    setCurrentResult({});
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return <SetupScreen onStart={startRound} />;
  }

  if (phase === "summary") {
    return <SummaryScreen results={results} onNewRound={resetToSetup} />;
  }

  if (!currentItem) return null;

  const isAnswered = phase === "meaning-result" || phase === "usage-result";
  const isMeaning = phase === "meaning" || phase === "meaning-result";

  return (
    <main className="flex flex-col gap-6 px-4 py-8 max-w-lg mx-auto w-full">
      <ProgressBar current={currentIdx} total={items.length} />

      <div className="flex items-center gap-2">
        <QuestionChip type={isMeaning ? "meaning" : "usage"} />
      </div>

      {isMeaning ? (
        <MeaningQuestion
          item={currentItem}
          onAnswer={handleMeaningAnswer}
          answered={phase === "meaning-result"}
          selectedIdx={selectedIdx}
        />
      ) : (
        <UsageQuestion
          item={currentItem}
          onAnswer={handleUsageAnswer}
          answered={phase === "usage-result"}
          selectedIdx={selectedIdx}
        />
      )}

      {isAnswered && (
        <FeedbackBar
          correct={
            isMeaning
              ? (currentResult.meaningCorrect ?? false)
              : (currentResult.usageCorrect ?? false)
          }
          onContinue={isMeaning ? advanceFromMeaning : advanceFromUsage}
          label={
            isMeaning && currentItem.usage_question
              ? "Siguiente pregunta"
              : currentIdx + 1 < items.length
              ? "Siguiente kanji"
              : "Ver resultados"
          }
        />
      )}
    </main>
  );
}
