interface KanjiCardProps {
  character: string;
  meanings: string[];
  onyomi?: string;
  kunyomi?: string;
  romaji?: string;
  size?: "sm" | "lg";
}

export default function KanjiCard({
  character,
  meanings,
  onyomi,
  kunyomi,
  romaji,
  size = "lg",
}: KanjiCardProps) {
  const charSize = size === "lg" ? "text-8xl" : "text-4xl";
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-lg p-8"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <span
        className={`${charSize} leading-none select-none`}
        style={{ fontFamily: "var(--font-jp)", color: "var(--color-ink)" }}
      >
        {character}
      </span>
      <p
        className="text-base font-medium"
        style={{ color: "var(--color-ink)" }}
      >
        {meanings.join("、")}
      </p>
      {(onyomi || kunyomi) && (
        <div
          className="flex flex-col items-center gap-0.5 text-sm"
          style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-jp)" }}
        >
          {onyomi && <span>音: {onyomi}</span>}
          {kunyomi && <span>訓: {kunyomi}</span>}
        </div>
      )}
      {romaji && (
        <span className="text-xs" style={{ color: "var(--color-ink-faint)" }}>
          {romaji}
        </span>
      )}
    </div>
  );
}
