import { ButtonHTMLAttributes } from "react";

type Status = "idle" | "correct" | "wrong";

interface ChoiceOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  status?: Status;
}

const statusStyles: Record<Status, React.CSSProperties> = {
  idle: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    color: "var(--color-ink)",
  },
  correct: {
    background: "var(--color-correct-bg)",
    border: "1px solid var(--color-correct)",
    color: "var(--color-correct)",
  },
  wrong: {
    background: "var(--color-wrong-bg)",
    border: "1px solid var(--color-wrong)",
    color: "var(--color-wrong)",
  },
};

export default function ChoiceOption({
  label,
  status = "idle",
  className = "",
  ...props
}: ChoiceOptionProps) {
  return (
    <button
      style={statusStyles[status]}
      className={`
        w-full text-left px-4 py-3 rounded-md text-sm
        transition-all duration-150
        hover:opacity-80 active:scale-[0.99]
        disabled:cursor-not-allowed
        ${className}
      `.trim()}
      {...props}
    >
      {label}
    </button>
  );
}
