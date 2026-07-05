import Link from "next/link";
import Starfield from "@/components/Starfield";
import PowerButton from "@/components/PowerButton";
import CharacterArt from "@/components/CharacterArt";
import { TYPES, type Family } from "@/content/types";
import { DISCLAIMER } from "@/content/extra";

const FAMILIES: Family[] = ["前進系", "探究系", "共鳴系", "創造系"];

export default function Home() {
  return (
    <div className="shell">
      <Starfield mode="ambient" />
      <div className="content-layer">
        <section className="power-screen container">
          <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.3em", color: "var(--gold)" }} className="codename">
            JIBUN OS
          </p>
          <PowerButton />
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-dim)" }}>長押しで、あなたのOSを起動</p>
          <p style={{ margin: 0 }} className="mini-note">タップでも起動できます ・ 40問 約8分 ・ 無料 ・ 登録不要</p>
          <p className="ornament" style={{ margin: "10px 0 0" }} aria-hidden="true">✦ ── 16の光 ── ✦</p>
          <p className="mini-note" aria-hidden="true" style={{ marginTop: 20 }}>▾ スクロールして詳しく</p>
        </section>

        <section className="container" style={{ paddingTop: 30 }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.7, textAlign: "center" }}>
            はたらくも、あそぶも、愛するも、<br />ぜんぶ同じOSで動いてる。
          </h1>
          <div className="gpanel">
            <p>
              仕事では冷静なのに恋愛では重い。友人には明るいのに家では無口——。顔が違って見えるのは、
              同じOSの上で違うアプリが動いているから。
            </p>
            <p>
              「じぶんOS」は、40問であなたの中で動いている<strong style={{ fontWeight: 500 }}>基本OS(16の光)</strong>を特定し、
              仕事・転職・プライベート・恋愛という場面ごとの挙動を、1つの結果ページで可視化する診断です。
            </p>
            <ul>
              <li>向いている仕事と、あなたが静かに消耗する環境</li>
              <li>転職・部署異動で重視すべき、あなた専用の3条件</li>
              <li>満たされる休日の過ごし方と、友人関係での役回り</li>
              <li>恋愛での距離感・愛情表現のクセ・すれ違いやすいポイント</li>
              <li>ストレス時の「セーフモード」と再起動方法、AI活用スタイルまで</li>
            </ul>
          </div>
        </section>

        <section className="container" style={{ paddingTop: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, textAlign: "center", letterSpacing: "0.1em" }}>16の光</h2>
          <p className="mini-note" style={{ textAlign: "center" }}>
            あなたはどの光? — 4つの系統 × 充電方式 × 処理方式で、16のOSに分かれます。
          </p>
          {FAMILIES.map((fam) => (
            <div key={fam}>
              <p style={{ margin: "18px 0 4px", fontSize: 13, letterSpacing: "0.15em", color: "var(--gold)" }}>{fam}</p>
              <div className="type-grid">
                {TYPES.filter((t) => t.family === fam).map((t) => (
                  <Link href={`/types/${t.slug}/`} className="type-card" key={t.slug}>
                    <CharacterArt slug={t.slug} className="" />
                    <div className="cn codename" style={{ color: t.colorPrimary }}>{t.codename}</div>
                    <div className="ep">{t.nameJa}|{t.epithet}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="container" style={{ paddingTop: 30, textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.1em" }}>診断のながれ</h2>
          <div className="gpanel" style={{ textAlign: "left" }}>
            <p><span style={{ color: "var(--gold)" }}>一、</span>40問に直感で答える(約8分)。回答するたび、夜空に星がひとつ灯ります。</p>
            <p><span style={{ color: "var(--gold)" }}>二、</span>起動シーケンスのあと、あなたの基本OSが判明。同じタイプでも、星空は一人ひとり違います。</p>
            <p><span style={{ color: "var(--gold)" }}>三、</span>結果を友だち・恋人・同僚に送って答え合わせ。「トリセツ」は相手に送るためのコーナーです。</p>
          </div>
          <Link href="/quiz/" className="btn btn-primary" style={{ marginTop: 8 }}>OSを起動する</Link>
        </section>

        <footer className="container disclaimer">
          <p style={{ color: "var(--gold)", fontSize: 13 }}>このテストについて</p>
          {DISCLAIMER.map((d, i) => <p key={i}>{d}</p>)}
          <div className="site-footer">
            <Link href="/types/">16の光 図鑑</Link> ・ <Link href="/about/">このテストについて</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
