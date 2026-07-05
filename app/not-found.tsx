import Link from "next/link";
import Starfield from "@/components/Starfield";

export default function NotFound() {
  return (
    <div className="shell">
      <Starfield mode="ambient" />
      <div className="content-layer">
        <div className="power-screen container">
          <p className="codename" style={{ fontSize: 14, letterSpacing: "0.3em", color: "var(--gold)" }}>404</p>
          <h1 style={{ fontSize: 20, fontWeight: 500 }}>この光はまだ観測されていません</h1>
          <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>
            URLが変わったか、まだ生まれていない星のようです。
          </p>
          <Link href="/" className="btn">トップに戻る</Link>
        </div>
      </div>
    </div>
  );
}
