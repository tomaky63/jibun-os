import type { Metadata } from "next";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import CharacterArt from "@/components/CharacterArt";
import { TYPES, type Family } from "@/content/types";

export const metadata: Metadata = {
  title: "16の光 図鑑",
  description: "じぶんOS診断の16タイプ(16の光)一覧。4つの系統×充電方式×処理方式で分かれる、あなたと周りの人の基本OS。",
};

const FAMILIES: { name: Family; desc: string }[] = [
  { name: "前進系", desc: "前に進んでいる実感で生きている。止まると死ぬ" },
  { name: "探究系", desc: "「わかった!」の瞬間のために生きている" },
  { name: "共鳴系", desc: "人の温度を感じ取り、場をあたためる" },
  { name: "創造系", desc: "自分の中から出たものだけが本物" },
];

export default function TypesPage() {
  return (
    <div className="shell">
      <Starfield mode="ambient" />
      <div className="content-layer">
        <div className="container" style={{ paddingTop: 48, paddingBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, textAlign: "center", letterSpacing: "0.12em" }}>16の光 図鑑</h1>
          <p className="mini-note" style={{ textAlign: "center" }}>
            気になる光をタップすると、そのOSの全解説(仕事・恋愛・トリセツ)が読めます。
          </p>
          {FAMILIES.map((fam) => (
            <div key={fam.name}>
              <p style={{ margin: "26px 0 2px", fontSize: 14, letterSpacing: "0.15em", color: "var(--gold)" }}>{fam.name}</p>
              <p className="mini-note" style={{ margin: "0 0 8px" }}>{fam.desc}</p>
              <div className="type-grid">
                {TYPES.filter((t) => t.family === fam.name).map((t) => (
                  <Link href={`/types/${t.slug}/`} className="type-card" key={t.slug}>
                    <CharacterArt slug={t.slug} className="" />
                    <div className="cn codename" style={{ color: t.colorPrimary }}>{t.codename}</div>
                    <div className="ep">{t.nameJa}|{t.epithet}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link href="/quiz/" className="btn btn-primary">自分のOSを診断する(無料・約8分)</Link>
          </div>
          <div className="site-footer">
            <Link href="/">トップ</Link> ・ <Link href="/about/">このテストについて</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
