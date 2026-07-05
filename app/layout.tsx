import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Montserrat } from "next/font/google";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-en",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jibun-os.example.com"),
  title: {
    default: "じぶんOS診断 — 16の光",
    template: "%s | じぶんOS診断",
  },
  description:
    "はたらくも、あそぶも、愛するも、ぜんぶ同じOSで動いてる。40問・約8分で、あなたの基本OS(16の光)を診断。仕事・転職・プライベート・恋愛での「あなたの挙動」を1つの結果で可視化します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenKaku.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
