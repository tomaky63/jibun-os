"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Starfield from "@/components/Starfield";
import CharacterArt from "@/components/CharacterArt";
import {
  TYPE_BY_SLUG, DRIVER_LABEL, findType,
  type Driver, type TypeSlug,
} from "@/content/types";
import { WORK } from "@/content/work";
import { PRIVATE } from "@/content/private";
import { DEEP } from "@/content/deep";
import {
  DISTANCE_TEXT, CHANNEL_TEXT, PAIRS, PAIR_PHILOSOPHY,
  UPDATE_TEXT, DISCLAIMER, SAFEMODE_FOOTER, NG_ENV_FOOTER, safemodePrefix,
} from "@/content/extra";
import { decodePayload, payloadSeed, DUAL_BOOT_THRESHOLD, type Payload } from "@/lib/scoring";

const DRIVER_PRIORITY: Driver[] = ["H", "M", "I", "D"];

function deriveSub(slug: TypeSlug, p: Payload): { subSlug: TypeSlug; dualBoot: boolean } {
  const t = TYPE_BY_SLUG[slug];
  if (p.chargePct < 0) return { subSlug: slug, dualBoot: false };
  const others = DRIVER_PRIORITY.filter((d) => d !== t.driver).sort((a, b) => {
    if (p.radar[b] !== p.radar[a]) return p.radar[b] - p.radar[a];
    return DRIVER_PRIORITY.indexOf(a) - DRIVER_PRIORITY.indexOf(b);
  });
  const second = others[0];
  const mc = Math.abs(p.chargePct - 50);
  const mp = Math.abs(p.processPct - 50);
  const md = Math.max(0, (p.radar[t.driver] - p.radar[second]) / 2);
  const min = Math.min(md, mc, mp);
  let subSlug: TypeSlug;
  if (md <= min) subSlug = findType(second, t.charge, t.process).slug;
  else if (mc <= min) subSlug = findType(t.driver, t.charge === "C" ? "S" : "C", t.process).slug;
  else subSlug = findType(t.driver, t.charge, t.process === "O" ? "F" : "O").slug;
  return { subSlug, dualBoot: min <= DUAL_BOOT_THRESHOLD };
}

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="section-title">
        <span aria-hidden="true" style={{ color: "var(--gold-dim)" }}>✦</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Radar({ radar, color }: { radar: Record<Driver, number>; color: string }) {
  const cx = 135, cy = 112, R = 74;
  const axes: { d: Driver; x: number; y: number; lx: number; ly: number }[] = [
    { d: "D", x: 0, y: -1, lx: 0, ly: -1.28 },
    { d: "I", x: 1, y: 0, lx: 1.3, ly: 0.06 },
    { d: "H", x: 0, y: 1, lx: 0, ly: 1.36 },
    { d: "M", x: -1, y: 0, lx: -1.3, ly: 0.06 },
  ];
  const pt = (d: { x: number; y: number }, r: number) => `${cx + d.x * r},${cy + d.y * r}`;
  const poly = axes.map((a) => pt(a, (Math.max(radar[a.d], 0) / 100) * R)).join(" ");
  return (
    <svg viewBox="0 0 270 224" width="240" height="199" role="img" aria-label="コアドライバーのバランス">
      {[0.5, 1].map((f) => (
        <polygon
          key={f}
          points={axes.map((a) => pt(a, R * f)).join(" ")}
          fill="none" stroke="rgba(232,201,122,0.25)" strokeWidth="0.8"
        />
      ))}
      <polygon points={poly} fill={`${color}38`} stroke={color} strokeWidth="1.6" />
      {axes.map((a) => (
        <circle key={a.d} cx={cx + a.x * (Math.max(radar[a.d], 0) / 100) * R} cy={cy + a.y * (Math.max(radar[a.d], 0) / 100) * R} r="3" fill="#E8C97A" />
      ))}
      {axes.map((a) => (
        <text
          key={`l-${a.d}`} x={cx + a.lx * R} y={cy + a.ly * R + 4}
          textAnchor="middle" fontSize="12" fill="rgba(245,243,238,0.7)"
        >
          {DRIVER_LABEL[a.d]} {radar[a.d] >= 0 ? radar[a.d] : "–"}
        </text>
      ))}
    </svg>
  );
}

function ResultBody({ slug, catalog }: { slug: TypeSlug; catalog?: boolean }) {
  const searchParams = useSearchParams();
  const t = TYPE_BY_SLUG[slug];
  const work = WORK[slug];
  const priv = PRIVATE[slug];
  const deep = DEEP[slug];
  const pairs = PAIRS[slug];

  const payload = useMemo(
    () => decodePayload(catalog ? null : searchParams.get("p")),
    [searchParams, catalog]
  );
  const hasPayload = payload.chargePct >= 0;
  const { subSlug, dualBoot } = useMemo(() => deriveSub(slug, payload), [slug, payload]);
  const seed = useMemo(() => payloadSeed(payload) ^ slug.length, [payload, slug]);

  const [checked, setChecked] = useState<boolean[]>(() => deep.aruaru.map(() => false));
  const checkedCount = checked.filter(Boolean).length;
  const [secretOpen, setSecretOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [safeDim, setSafeDim] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titles = shellRef.current?.querySelectorAll(".section-title");
    if (!titles) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lit"); }),
      { threshold: 0.4 }
    );
    titles.forEach((el) => obs.observe(el));
    const safeEl = shellRef.current?.querySelector("#safemode");
    let safeObs: IntersectionObserver | null = null;
    if (safeEl) {
      safeObs = new IntersectionObserver(
        (entries) => entries.forEach((e) => setSafeDim(e.isIntersecting)),
        { threshold: 0.25 }
      );
      safeObs.observe(safeEl);
    }
    return () => { obs.disconnect(); safeObs?.disconnect(); };
  }, [slug]);

  const pageUrl = () => (typeof window !== "undefined" ? window.location.href : "");
  const shareText = () => {
    if (checkedCount > 0) {
      return `私の基本OSは${t.codename}(${t.nameJa})。あるある10個中${checkedCount}個当てはまった。 #じぶんOS #16の光`;
    }
    return `私の基本OSは ${t.codename}(${t.nameJa})だった。「${t.catchcopy}」 #じぶんOS #16の光`;
  };
  const shareX = () => {
    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("text", shareText());
    u.searchParams.set("url", pageUrl());
    window.open(u.toString(), "_blank", "noopener");
  };
  const shareLine = () => {
    const u = new URL("https://social-plugins.line.me/lineit/share");
    u.searchParams.set("url", pageUrl());
    window.open(u.toString(), "_blank", "noopener");
  };
  const copy = async (text: string, tag: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* clipboard不可の環境では無視 */ }
  };

  const sub = TYPE_BY_SLUG[subSlug];
  const smPrefix = hasPayload ? safemodePrefix(payload.x1) : null;

  return (
    <div
      ref={shellRef}
      className={`shell${safeDim ? " safe-dim" : ""}`}
      style={{ ["--type-color" as string]: t.colorPrimary } as React.CSSProperties}
    >
      <Starfield mode="result" colors={[t.colorPrimary, t.colorSecondary]} effect={t.effect} seed={seed} userStarCount={hasPayload ? 24 : 10} />
      <div className="content-layer">
        <div className="container">
          {/* 0. ヒーロー */}
          <header className="hero">
            <p className="lead-in">
              {catalog ? "✦ 16の光・図鑑 ✦" : dualBoot ? "✦ あなたはデュアルブートOS ✦" : "✦ あなたの基本OS ✦"}
            </p>
            <CharacterArt slug={slug} />
            <h1 className="codename codename-big">{t.codename}</h1>
            <p className="epithet">{t.nameJa} — {t.epithet}</p>
            <p className="catch">「{t.catchcopy}」</p>
            <span className="family-badge">{t.family} {t.code}</span>
            {dualBoot && (
              <p className="mini-note" style={{ marginTop: 12 }}>
                判定が僅差でした。あなたは <strong>{t.codename}</strong> と <strong>{sub.codename}</strong> の2つの光を併せ持つ人です。
              </p>
            )}
            {hasPayload && payload.x2 <= 2 && (
              <p className="mini-note" style={{ marginTop: 12 }}>
                ※いまのあなたは少し消耗気味のようです。この結果は“本来のあなた”として読んでください。
              </p>
            )}
          </header>
          <p className="ornament" aria-hidden="true">✦ ──────── ✦</p>

          {/* 1. 基本OS */}
          <Section id="os" title="あなたの基本OS">
            <div className="gpanel">
              <p>{t.summary}</p>
            </div>
            <div className="gpanel">
              <h3>深層 — あなたという現象</h3>
              <p style={{ lineHeight: 2 }}>{deep.narrative}</p>
            </div>
            <div className="gpanel">
              <h3>このOSについて</h3>
              {hasPayload ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "center" }}>
                  <Radar radar={payload.radar} color={t.colorPrimary} />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div className="kv"><span className="k">コア</span><span>{DRIVER_LABEL[t.driver]}(サブ: {DRIVER_LABEL[deriveSecond(t.driver, payload)]})</span></div>
                    <div className="kv"><span className="k">バッテリー</span><span>{t.charge === "C" ? "つながり充電式" : "ひとり充電式"}</span></div>
                    <div className="bar-row">
                      <div className="kv"><span className="k">ソーシャル充電率</span><span>{payload.chargePct}%</span></div>
                      <div className="bar-track"><div className="bar-fill" style={{ width: `${payload.chargePct}%`, background: t.colorPrimary }} /></div>
                      <div className="bar-labels"><span>ひとり充電</span><span>つながり充電</span></div>
                    </div>
                    <div className="bar-row">
                      <div className="kv"><span className="k">設計度</span><span>{payload.processPct}%</span></div>
                      <div className="bar-track"><div className="bar-fill" style={{ width: `${payload.processPct}%`, background: t.colorSecondary }} /></div>
                      <div className="bar-labels"><span>即興走行</span><span>設計走行</span></div>
                    </div>
                    <div className="kv" style={{ marginTop: 10 }}><span className="k">稼働モード</span><span>{t.operatingMode}</span></div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <p style={{ color: "var(--ink-dim)" }}>あなたも診断すると、ここにあなたの数値(充電率・設計度・4つのドライバー)が入ります。</p>
                  <Link href="/quiz/" className="btn btn-primary">診断する(無料・約8分)</Link>
                </div>
              )}
            </div>
            <div className="gpanel">
              <h3>強みと、その裏側の影</h3>
              <p className="mini-note">影は欠点ではなく、強みと同じ根から生えています。</p>
              <ul>
                {t.strengths.map((s, i) => <li key={`s${i}`}><strong style={{ fontWeight: 500, color: t.colorPrimary }}>光</strong> — {s}</li>)}
                {t.shadows.map((s, i) => <li key={`w${i}`}><strong style={{ fontWeight: 500, color: "var(--ink-faint)" }}>影</strong> — {s}</li>)}
              </ul>
            </div>
            {hasPayload && !dualBoot && (
              <div className="gpanel">
                <h3>あなたのサブOS</h3>
                <p>
                  <Link href={`/types/${sub.slug}/`} className="codename" style={{ color: sub.colorPrimary, fontWeight: 500 }}>{sub.codename}</Link>
                  ({sub.nameJa} — {sub.epithet})— 環境や年齢によって、こちらの顔が出ることがあります。
                </p>
              </div>
            )}
          </Section>

          {/* 2. あるある */}
          <Section id="aruaru" title="あなたの「あるある」10連発">
            <div className="gpanel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <p className="mini-note" style={{ margin: 0 }}>タップで答え合わせ</p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--gold)" }} aria-live="polite">
                  {checkedCount > 0 ? `10個中 ${checkedCount}個 当てはまった` : ""}
                </p>
              </div>
              {deep.aruaru.map((item, i) => (
                <button
                  key={i}
                  className={`aru-row${checked[i] ? " on" : ""}`}
                  aria-pressed={checked[i]}
                  onClick={() => setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)))}
                >
                  <span className="mark" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </button>
              ))}
              {checkedCount >= 8 && (
                <p style={{ marginTop: 12, color: "var(--gold)", fontSize: 13.5, textAlign: "center" }}>
                  {checkedCount}個…… ほぼ全部です。この結果、誰かに見せたくなりませんか?
                </p>
              )}
            </div>
          </Section>

          {/* 3. 他人から見たあなた */}
          <Section id="mirror" title="他人から見たあなた">
            <div className="gpanel">
              <p><span style={{ color: "var(--gold)" }}>第一印象</span> — {deep.mirror.first}</p>
              <p><span style={{ color: "var(--gold)" }}>距離が縮まると</span> — {deep.mirror.closer}</p>
              <p
                className={`secret-line${secretOpen ? " open" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setSecretOpen(true)}
                onKeyDown={(e) => { if (e.key === "Enter") setSecretOpen(true); }}
              >
                <span style={{ color: "var(--gold)" }}>深く知る人だけが知っていること</span> — {secretOpen ? deep.mirror.secret : "タップして開封 ✦"}
              </p>
            </div>
          </Section>

          {/* 4. 場面別スナップ */}
          <Section id="snap" title="場面別スナップ">
            {[
              ["会議で", deep.snap.meeting],
              ["LINEで", deep.snap.line],
              ["飲み会で", deep.snap.party],
              ["恋の始まりに", deep.snap.love],
            ].map(([where, what]) => (
              <div className="snap-card" key={where}>
                <div className="where">{where}</div>
                <div className="what">{what}</div>
              </div>
            ))}
          </Section>

          {/* 5-8. 仕事ブロック */}
          <Section id="work" title="仕事でのあなた">
            <div className="gpanel"><p>{work.overview}</p></div>
          </Section>
          <Section id="career" title="転職・異動で重視すべき3条件">
            <div className="gpanel">
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {work.career.map((c, i) => (
                  <li key={i} style={{ margin: "12px 0" }}>
                    <span style={{ color: "var(--gold)", marginRight: 8 }}>{["一", "二", "三"][i]}、</span>
                    <strong style={{ fontWeight: 500 }}>{c.title}</strong>
                    <span style={{ display: "block", color: "var(--ink-dim)", fontSize: 13.5, marginLeft: "2em" }}>{c.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
          <Section id="jobs" title="向いている職種・部署・働き方">
            <div className="gpanel">
              <div style={{ marginBottom: 10 }}>
                {work.jobs.map((j) => <span className="chip" key={j}>{j}</span>)}
              </div>
              <p className="mini-note">働き方: {work.workstyle}</p>
              <p className="mini-note">※「型が合いやすい例」です。適職の断定ではありません。</p>
            </div>
          </Section>
          <Section id="ng-env" title="消耗する環境">
            <div className="gpanel">
              <ul>{work.badEnv.map((b, i) => <li key={i}>{b}</li>)}</ul>
              <p style={{ marginTop: 12, color: "var(--gold)", fontSize: 13.5 }}>{NG_ENV_FOOTER}</p>
            </div>
          </Section>

          {/* 9-13. 私生活・恋愛ブロック */}
          <Section id="private" title="プライベートで満たされる過ごし方">
            <div className="gpanel"><ul>{priv.recharge.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
          </Section>
          <Section id="friends" title="友人関係でのあなた">
            <div className="gpanel"><p>{priv.friends}</p></div>
          </Section>
          <Section id="love" title="恋愛でのあなた">
            <div className="gpanel">
              <p>{priv.love}</p>
              <h3 style={{ marginTop: 16 }}>すれ違いやすいポイント</h3>
              <ul>{priv.missteps.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          </Section>
          <Section id="love-style" title="求めがちな愛情表現">
            <div className="gpanel">
              {!hasPayload && <p className="mini-note">※診断を受けると、あなたの「距離感」と「チャネル」で内容が変わります。以下は標準設定の例です。</p>}
              <p><span style={{ color: "var(--gold)" }}>距離感: {DISTANCE_TEXT[payload.distance].label}</span> — {DISTANCE_TEXT[payload.distance].body}</p>
              <p><span style={{ color: "var(--gold)" }}>チャネル: {CHANNEL_TEXT[payload.channel].label}</span> — {CHANNEL_TEXT[payload.channel].body}</p>
              <p style={{ color: "var(--ink-dim)" }}>{t.loveFlavor}</p>
            </div>
          </Section>
          <Section id="pairs" title="噛み合うOS・すれ違い注意OS">
            <p className="mini-note" style={{ margin: "0 0 10px" }}>{PAIR_PHILOSOPHY}</p>
            <div className="pair-grid">
              {pairs.good.map((pi) => {
                const pt2 = TYPE_BY_SLUG[pi.slug];
                return (
                  <div className="pair-card" key={pi.slug}>
                    <div className="rel good">自然と噛み合う</div>
                    <div className="who codename"><Link href={`/types/${pi.slug}/`} style={{ color: pt2.colorPrimary }}>{pt2.codename}</Link> <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{pt2.nameJa}</span></div>
                    <div className="why">{pi.why}</div>
                  </div>
                );
              })}
              {pairs.caution.map((pi) => {
                const pt2 = TYPE_BY_SLUG[pi.slug];
                return (
                  <div className="pair-card" key={pi.slug}>
                    <div className="rel caution">すれ違い注意(接続可能)</div>
                    <div className="who codename"><Link href={`/types/${pi.slug}/`} style={{ color: pt2.colorPrimary }}>{pt2.codename}</Link> <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{pt2.nameJa}</span></div>
                    <div className="why">{pi.why}</div>
                  </div>
                );
              })}
            </div>
            <div className="gpanel" style={{ textAlign: "center" }}>
              <p style={{ marginBottom: 10 }}>あの人はどの光? — 診断リンクを送って、答え合わせしてみてください。</p>
              <button className="btn" onClick={() => copy(
                typeof window !== "undefined"
                  ? (process.env.NEXT_PUBLIC_SITE_URL ?? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`)
                  : "",
                "invite"
              )}>
                {copied === "invite" ? "コピーしました ✦" : "診断リンクをコピー"}
              </button>
            </div>
          </Section>

          {/* 14. セーフモード */}
          <Section id="safemode" title="セーフモード — ストレス時のあなた">
            <div className="gpanel">
              {smPrefix && <p style={{ color: "var(--ink-dim)" }}>{smPrefix}</p>}
              <h3>崩れ方</h3>
              <p>{priv.safemode.crash}</p>
              <h3 style={{ marginTop: 14 }}>再起動方法</h3>
              <ol style={{ margin: 0, paddingLeft: "1.5em", fontSize: 14.5 }}>
                {priv.safemode.reboot.map((r, i) => <li key={i} style={{ margin: "6px 0" }}>{r}</li>)}
              </ol>
              <p style={{ marginTop: 14, fontSize: 13, color: "var(--ink-faint)" }}>{SAFEMODE_FOOTER}</p>
            </div>
          </Section>

          {/* 15. AI活用スタイル */}
          <Section id="ai" title="AI活用スタイル">
            <div className="gpanel">
              <p>{work.aiStyle}</p>
              <p style={{ fontSize: 13.5, color: "var(--ink-dim)", borderLeft: "2px solid var(--gold-dim)", paddingLeft: 12 }}>
                使い方の一例: {work.aiExample}
              </p>
            </div>
          </Section>

          {/* 16. トリセツ */}
          <Section id="manual" title="あなたのトリセツ(周りの人へ)">
            <div className="gpanel">
              <ol style={{ margin: 0, paddingLeft: "1.5em", fontSize: 14.5 }}>
                {deep.manual.map((m, i) => <li key={i} style={{ margin: "8px 0" }}>{m}</li>)}
              </ol>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <button
                  className="btn"
                  onClick={() => copy(`【${t.codename}(${t.nameJa})のトリセツ】\n${deep.manual.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n#じぶんOS ${pageUrl()}`, "manual")}
                >
                  {copied === "manual" ? "コピーしました ✦" : "この3か条を送る(コピー)"}
                </button>
              </div>
            </div>
          </Section>

          {/* 17. アップデート */}
          <Section id="update" title="OSはアップデートされる">
            <div className="gpanel" style={{ textAlign: "center" }}>
              {UPDATE_TEXT.map((l, i) => <p key={i} style={{ color: "var(--ink-dim)" }}>{l}</p>)}
              <Link href="/quiz/" className="btn" style={{ marginTop: 8 }}>OSをアップデートする(再診断)</Link>
            </div>
          </Section>

          {/* 18. シェア */}
          <Section id="share" title="結果をシェアする">
            <div className="gpanel" style={{ textAlign: "center" }}>
              <p style={{ color: "var(--ink-dim)", fontSize: 13.5 }}>{shareText()}</p>
              <div className="share-row" style={{ justifyContent: "center" }}>
                <button className="btn" onClick={shareX}>Xでシェア</button>
                <button className="btn" onClick={shareLine}>LINEで送る</button>
                <button className="btn" onClick={() => copy(`${shareText()} ${pageUrl()}`, "share")}>
                  {copied === "share" ? "コピーしました ✦" : "リンクをコピー"}
                </button>
              </div>
            </div>
          </Section>

          {/* 19. フッター */}
          <footer className="disclaimer">
            <p style={{ color: "var(--gold)", fontSize: 13 }}>このテストについて</p>
            {DISCLAIMER.map((d, i) => <p key={i}>{d}</p>)}
            <div className="site-footer">
              <Link href="/">じぶんOS トップ</Link> ・ <Link href="/types/">16の光 図鑑</Link> ・ <Link href="/about/">このテストについて</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function deriveSecond(top: Driver, p: Payload): Driver {
  const others = DRIVER_PRIORITY.filter((d) => d !== top).sort((a, b) => {
    if (p.radar[b] !== p.radar[a]) return p.radar[b] - p.radar[a];
    return DRIVER_PRIORITY.indexOf(a) - DRIVER_PRIORITY.indexOf(b);
  });
  return others[0];
}

export default function ResultShell({ slug, catalog }: { slug: TypeSlug; catalog?: boolean }) {
  return (
    <Suspense fallback={<div className="shell" style={{ background: "var(--night)" }} />}>
      <ResultBody slug={slug} catalog={catalog} />
    </Suspense>
  );
}
