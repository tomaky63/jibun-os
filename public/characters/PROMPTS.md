# GPT Image 2 キャラクター生成記録

`public/characters/{slug}.png` の16体は、GPT Image 2で個別生成した本番アセットです。
すべて `sol.png` を画風の参照画像に使い、同じマスコットシリーズとして統一しています。

## 共通プロンプト

```text
Use case: stylized-concept
Asset type: square website mascot illustration for a Japanese personality-diagnosis site
Input images: Image 1 is the canonical style reference. Match its premium modern
storybook rendering, rounded mascot anatomy, facial design, deep navy starfield
backdrop, glow treatment, and polish, while creating a clearly different character.
Scene/backdrop: deep navy night sky (#0B1026), sparse tiny stars and subtle light
particles, no horizon or floor.
Style/medium: premium modern storybook illustration, softly painted 2.5D finish,
rounded gentle shapes, polished mobile-game mascot quality.
Composition/framing: square, exactly one full-body gender-neutral non-human spirit
creature centered, fills about 70% of canvas, generous safe padding, readable
silhouette at thumbnail size.
Constraints: exactly one character; no realistic human face; no gender coding;
no text; no letters; no logo; no watermark; no frame; no UI; no duplicate limbs.
```

各タイプ固有の指定は、`content/types.ts` の名称・性格・配色と以下の象徴を反映しています。

| slug | 象徴 |
|---|---|
| sol | 頭上の小さな太陽、短いマント、前を指すポーズ |
| comet | 長い彗星の尾、走り出すポーズ |
| lighthouse | 灯台モチーフ、胸元のランタン、一定の光線 |
| meteor | 赤い流星、低い前傾姿勢、鋭い集中 |
| prism | 半透明の三角プリズム、分光する虹 |
| spark | 青い電気火花、ひらめきを示す指 |
| polaris | 頭上の北極星、コンパスローズ |
| nebula | 星雲の身体、頭上の銀河、思索ポーズ |
| lantern | 両手で差し出す琥珀色のランタン |
| bonfire | 薪と炎、両手を広げた歓迎ポーズ |
| luna | 胸に抱いた三日月、静かな月光 |
| hotaru | 小さな羽、腹部の光、淡い水面 |
| kaleido | 万華鏡の幾何学模様、画角を作る手 |
| hanabi | 花火の冠、跳躍、祝祭の火花 |
| crystal | ラベンダー色の結晶、小片を吟味する手 |
| aurora | 緑から紫の極光の身体、新しい星を放つ手 |

OGPはこれらの生成画像を使い、`scripts/generate-ogp.ps1` で日本語を正確に合成します。
`npm run ogp` で `public/ogp/{slug}.png` を再生成できます。
