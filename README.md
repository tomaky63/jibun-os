# じぶんOS診断 — Web実装

設計資料 `../docs/personality-os-diagnosis/` に基づく、Next.js 16（App Router）+ TypeScriptの静的サイトです。サーバー、DB、ログインを使わずに動作します。

## コマンド

```bash
npm run dev           # 開発サーバー（http://localhost:3000）
npm run build         # 静的サイトを out/ に生成
npm run test          # スコアリングの受け入れテスト
npm run ogp           # 16タイプのOGP画像を再生成
npm run placeholders  # 旧SVGプレースホルダーを再生成
```

## 構成

```text
app/                  ルーティング（/, /quiz, /result/[slug], /types, /about）
content/              16タイプ・40問・仕事/私生活/深層コンテンツ
lib/scoring.ts        決定論的なスコアリング
components/           診断フロー、結果画面、星空エンジン
public/characters/    GPT Image 2で生成した16体の本番PNG
public/ogp/           1200×630のタイプ別OGP画像
scripts/              テスト、プレースホルダー、OGP生成
```

## 画像アセット

16体のキャラクターはGPT Image 2で個別生成し、`public/characters/{slug}.png` に配置済みです。共通プロンプトとタイプ別の象徴は `public/characters/PROMPTS.md` に記録しています。

OGPは生成キャラクターを使い、`scripts/generate-ogp.ps1` で日本語テキストと金枠を正確に合成します。再生成する場合はWindows PowerShell環境で `npm run ogp` を実行してください。

## デプロイ

- 公開URLを `NEXT_PUBLIC_SITE_URL` に設定してください。OGPの絶対URLに使用します。
- `npm run build` で生成される `out/` を任意の静的ホスティングへ配置します。
- 結果はURLクエリ `?p=` にエンコードされるため、サーバーなしで共有・再現できます。

### GitHub Pages

`main` ブランチへのpushで `.github/workflows/deploy-pages.yml` が静的サイトを自動公開します。GitHub Actions上ではリポジトリ名から `basePath` と公開URLを組み立てるため、プロジェクトサイトのサブパスでも動作します。

## 今後の拡張候補

- 縦型シェアカードのクライアント生成と現像演出
- 計測イベント
- サウンド・ハプティクス
