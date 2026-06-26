import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--color-torii)",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "var(--color-washi-dark)",
    color: "var(--color-ink)",
    border: "1px solid var(--color-border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-ink-muted)",
    border: "1px solid var(--color-border-light)",
  },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth = false, className = "", style, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        style={{ ...variantStyles[variant], ...style }}
        className={`
          inline-flex items-center justify-center gap-2
          px-5 py-2.5 rounded-md text-sm font-medium
          transition-opacity duration-150
          hover:opacity-80 active:opacity-70
          disabled:opacity-40 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-offset-2
          ${fullWidth ? "w-full" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
