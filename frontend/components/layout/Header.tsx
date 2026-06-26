import Link from "next/link";

export default function Header() {
  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{
        background: "var(--color-washi-light)",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <Link
        href="/"
        className="text-xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-shippori)", color: "var(--color-ink)" }}
      >
        漢字 Enjoyer
      </Link>
      <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--color-ink-muted)" }}>
        <Link href="/kanji" className="hover:opacity-70 transition-opacity">Kanji</Link>
        <Link href="/study" className="hover:opacity-70 transition-opacity">Estudiar</Link>
        <Link href="/stats" className="hover:opacity-70 transition-opacity">Stats</Link>
      </nav>
    </header>
  );
}
