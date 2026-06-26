export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1
        className="text-5xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
      >
        漢字 Enjoyer
      </h1>
      <p style={{ color: "var(--color-ink-muted)" }} className="text-lg">
        Aprende los kanji N5 con repetición adaptativa.
      </p>
      <div className="flex gap-4 mt-4">
        <a
          href="/login"
          className="px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
          style={{ background: "var(--color-torii)", color: "#fff" }}
        >
          Entrar
        </a>
        <a
          href="/register"
          className="px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
          style={{
            background: "var(--color-washi-dark)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-border)",
          }}
        >
          Registrarse
        </a>
      </div>
    </main>
  );
}
