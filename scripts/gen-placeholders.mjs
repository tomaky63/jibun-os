// キャラクター画像のプレースホルダSVGを生成する(GPT Image 2の本画像が来たら差し替え)
// 実行: node scripts/gen-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const types = [
  ["sol", "SOL", "太陽", "#FFB300", "#FF8A50"],
  ["comet", "COMET", "彗星", "#FF6B35", "#FFD180"],
  ["lighthouse", "LIGHTHOUSE", "灯台", "#F4D06F", "#8C9EFF"],
  ["meteor", "METEOR", "流星", "#FF4E50", "#FFB300"],
  ["prism", "PRISM", "プリズム", "#4FC3F7", "#B794FF"],
  ["spark", "SPARK", "火花", "#00B0FF", "#64FFDA"],
  ["polaris", "POLARIS", "北極星", "#8C9EFF", "#E6E9F0"],
  ["nebula", "NEBULA", "星雲", "#5C6BC0", "#B794FF"],
  ["lantern", "LANTERN", "ランタン", "#FFB74D", "#FFE0B2"],
  ["bonfire", "BONFIRE", "焚き火", "#FF8A50", "#FFD54F"],
  ["luna", "LUNA", "月", "#E6E9F0", "#8C9EFF"],
  ["hotaru", "HOTARU", "蛍", "#A8E063", "#64FFDA"],
  ["kaleido", "KALEIDO", "万華鏡", "#AB47BC", "#EC407A"],
  ["hanabi", "HANABI", "花火", "#EC407A", "#FFD54F"],
  ["crystal", "CRYSTAL", "結晶", "#B39DDB", "#E6E9F0"],
  ["aurora", "AURORA", "オーロラ", "#64FFDA", "#7C4DFF"],
];

const dir = join(root, "public", "characters");
mkdirSync(dir, { recursive: true });

for (const [slug, codename, nameJa, c1, c2] of types) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${codename}(${nameJa})のプレースホルダ画像">
<defs>
  <radialGradient id="g1" cx="50%" cy="42%" r="55%">
    <stop offset="0%" stop-color="${c1}" stop-opacity="0.85"/>
    <stop offset="45%" stop-color="${c1}" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="g2" cx="50%" cy="42%" r="30%">
    <stop offset="0%" stop-color="#F5F3EE" stop-opacity="0.95"/>
    <stop offset="60%" stop-color="${c2}" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="200" cy="168" r="150" fill="url(#g1)"/>
<circle cx="200" cy="168" r="72" fill="url(#g2)"/>
<circle cx="200" cy="168" r="10" fill="#F5F3EE"/>
<circle cx="200" cy="168" r="118" fill="none" stroke="#E8C97A" stroke-opacity="0.55" stroke-width="1.6"/>
<circle cx="200" cy="168" r="126" fill="none" stroke="#E8C97A" stroke-opacity="0.25" stroke-width="0.8"/>
<path d="M200 30 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z" fill="#E8C97A" fill-opacity="0.8"/>
<text x="200" y="330" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="30" letter-spacing="8" fill="${c1}">${codename}</text>
<text x="200" y="362" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#F5F3EE" fill-opacity="0.7">${nameJa}</text>
</svg>
`;
  writeFileSync(join(dir, `${slug}.svg`), svg, "utf8");
}

console.log(`generated ${types.length} placeholder SVGs in public/characters/`);
