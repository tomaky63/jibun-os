import type { Metadata } from "next";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import { DISCLAIMER } from "@/content/extra";

export const metadata: Metadata = {
  title: "このテストについて",
  description: "じぶんOS診断の考え方と、利用にあたっての注意事項。",
};

export default function AboutPage() {
  return (
    <div className="shell">
      <Starfield mode="ambient" />
      <div className="content-layer">
        <div className="container" style={{ paddingTop: 48, paddingBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.1em" }}>このテストについて</h1>

          <div className="gpanel">
            <h2>「じぶんOS」の考え方</h2>
            <p>
              人は場面ごとに違う顔を見せます。仕事では冷静なのに恋愛では重い、友人には明るいのに家では無口——。
              このテストは、それを「別々の性格」ではなく「同じOSの上で動く別のアプリ」として捉えます。
            </p>
            <p>
              測っているのは3つ+2つ。エネルギーの回復方法(充電方式)、物事の進め方(処理方式)、
              何に燃えるか(コアドライバー4種)で基本OSが決まり、恋愛に関する2つの補助測定(絆の距離感・愛情表現チャネル)が
              恋愛パートの文面を調整します。
            </p>
            <p>
              結果はタイプ名だけでなく、数値ゲージ・サブOS・デュアルブート判定を必ず併記します。
              人をひとつの箱に入れないこと——それがこの診断の設計思想です。OSはアップデートされるので、
              人生の節目には再診断をおすすめします。
            </p>
          </div>

          <div className="gpanel">
            <h2>参考にした考え方</h2>
            <p>
              ビッグファイブ、RIASEC(職業興味)、ストレングス系アセスメント、愛着理論、ラブランゲージなどの
              観点を参考にしていますが、これらに「基づく」検査ではなく、独自のエンタメ+内省ツールです。
            </p>
          </div>

          <div className="gpanel">
            <h2>免責事項</h2>
            {DISCLAIMER.map((d, i) => <p key={i}>{d}</p>)}
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/quiz/" className="btn btn-primary">診断してみる</Link>
          </div>
          <div className="site-footer">
            <Link href="/">トップ</Link> ・ <Link href="/types/">16の光 図鑑</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
