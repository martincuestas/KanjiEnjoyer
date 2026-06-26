function BambooSvg() {
  return (
    <svg
      viewBox="0 0 160 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", color: "var(--color-torii)" }}
      aria-hidden="true"
    >
      {/* Stalk 1 — main */}
      <rect x="22" y="0"  width="19" height="500" rx="9.5" fill="currentColor" opacity="0.09" />
      <rect x="19" y="98"  width="25" height="5" rx="2.5" fill="currentColor" opacity="0.20" />
      <rect x="19" y="198" width="25" height="5" rx="2.5" fill="currentColor" opacity="0.20" />
      <rect x="19" y="298" width="25" height="5" rx="2.5" fill="currentColor" opacity="0.20" />
      <rect x="19" y="398" width="25" height="5" rx="2.5" fill="currentColor" opacity="0.20" />
      {/* Leaves — derecha */}
      <path d="M41,88 C62,74 108,76 122,83 C108,91 62,93 41,88Z"   fill="currentColor" opacity="0.14" />
      <path d="M41,288 C63,274 112,275 126,282 C112,290 63,292 41,288Z" fill="currentColor" opacity="0.12" />
      {/* Leaves — izquierda */}
      <path d="M22,188 C4,174 -28,177 -38,184 C-26,191 4,193 22,188Z"  fill="currentColor" opacity="0.13" />
      <path d="M22,388 C5,375 -22,378 -32,385 C-20,392 5,394 22,388Z"  fill="currentColor" opacity="0.11" />

      {/* Stalk 2 — secondary */}
      <rect x="95" y="55"  width="14" height="445" rx="7"   fill="currentColor" opacity="0.055" />
      <rect x="92" y="163" width="20" height="4"   rx="2"   fill="currentColor" opacity="0.12" />
      <rect x="92" y="273" width="20" height="4"   rx="2"   fill="currentColor" opacity="0.12" />
      <rect x="92" y="383" width="20" height="4"   rx="2"   fill="currentColor" opacity="0.12" />
      <path d="M109,154 C127,142 156,144 160,151 C156,158 127,160 109,154Z" fill="currentColor" opacity="0.08" />
      <path d="M95,264  C78,252 50,255 42,262  C50,269 78,271 95,264Z"      fill="currentColor" opacity="0.08" />
      <path d="M109,374 C128,362 155,364 160,371 C155,378 128,380 109,374Z" fill="currentColor" opacity="0.07" />
    </svg>
  );
}

const features = [
  {
    kanji: "学",
    reading: "まなぶ",
    title: "Repetición adaptativa",
    desc: "El sistema identifica los kanji que te cuestan y los prioriza automáticamente en cada ronda.",
  },
  {
    kanji: "文",
    reading: "ぶん",
    title: "Oraciones en contexto",
    desc: "Practica el uso real de cada kanji con oraciones de nivel JLPT N5, no solo la traducción aislada.",
  },
  {
    kanji: "記",
    reading: "き",
    title: "Estadísticas detalladas",
    desc: "Seguí tu progreso ciclo a ciclo con gráficos de actividad, precisión por tipo y mastery individual.",
  },
];

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", flex: 1 }}>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1rem",
        }}
      >
        {/* Watermark 字 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontSize: "min(65vw, 500px)",
              lineHeight: 1,
              fontFamily: "var(--font-jp)",
              color: "var(--color-torii)",
              opacity: 0.045,
            }}
          >
            字
          </span>
        </div>

        {/* Bambú derecha */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "150px",
            pointerEvents: "none",
            userSelect: "none",
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent 0%, black 45%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 45%)",
          }}
        >
          <BambooSvg />
        </div>

        {/* Bambú izquierda (espejo) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "150px",
            pointerEvents: "none",
            userSelect: "none",
            overflow: "hidden",
            transform: "scaleX(-1)",
            maskImage: "linear-gradient(to right, transparent 0%, black 45%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 45%)",
          }}
        >
          <BambooSvg />
        </div>

        {/* Contenido */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            textAlign: "center",
            maxWidth: "520px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              borderRadius: "999px",
              background: "var(--color-washi-dark)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontFamily: "var(--font-jp)", fontSize: "13px", color: "var(--color-ink-muted)" }}>漢字</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-ink-faint)", letterSpacing: "0.06em" }}>
              JLPT N5
            </span>
          </div>

          {/* Título */}
          <h1
            style={{
              fontFamily: "var(--font-shippori)",
              fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              color: "var(--color-ink)",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Kanji Enjoyer
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--color-ink-muted)",
              maxWidth: "380px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Aprendé los 103 kanji del JLPT N5 con un motor de repetición que se adapta a tu ritmo.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="/register"
              style={{
                padding: "11px 30px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 500,
                background: "var(--color-torii)",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 2px 14px rgba(58,107,71,0.30)",
              }}
            >
              Empezar gratis
            </a>
            <a
              href="/login"
              style={{
                padding: "11px 30px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 500,
                background: "var(--color-surface)",
                color: "var(--color-ink)",
                border: "1px solid var(--color-border)",
                textDecoration: "none",
              }}
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </section>

      {/* Divisor decorativo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 2rem", opacity: 0.4 }}>
        <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        <span style={{ fontFamily: "var(--font-jp)", fontSize: "18px", color: "var(--color-matcha)" }}>竹</span>
        <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
      </div>

      {/* Features */}
      <section style={{ padding: "3rem 1.5rem 4.5rem", maxWidth: "820px", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.kanji}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "12px",
                padding: "1.5rem 1.5rem 1.6rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "7px" }}>
                <span style={{ fontSize: "2.3rem", fontFamily: "var(--font-jp)", color: "var(--color-torii)", lineHeight: 1 }}>
                  {f.kanji}
                </span>
                <span style={{ fontSize: "11px", color: "var(--color-ink-faint)", fontFamily: "var(--font-jp)" }}>
                  {f.reading}
                </span>
              </div>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-ink)", margin: 0 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)", lineHeight: 1.55, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
