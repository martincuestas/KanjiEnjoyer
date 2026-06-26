import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import Header from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kanji Enjoyer",
  description: "Aprende los kanji N5 del JLPT con repetición adaptativa",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} ${shipporiMincho.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
          <Header />
          {children}
        </body>
    </html>
  );
}
