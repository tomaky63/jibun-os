import type { TypeSlug } from "./types";

// ---- 恋愛モジュレータの分岐文(06 §5) ----

export const DISTANCE_TEXT: Record<0 | 1 | 2, { label: string; body: string }> = {
  2: {
    label: "密着",
    body: "あなたの理想は「日常を共有する恋」。毎日の連絡、些細な報告、一緒にいる時間の長さが、そのまま安心につながります。相手の一人時間を「拒絶」と誤解しないことが、あなたの恋の課題になりがちです。",
  },
  1: {
    label: "バランス",
    body: "あなたの理想は「近すぎず、遠すぎず」。一緒にいる時間も、それぞれの時間も、どちらも大事にできるタイプです。ただし相手の距離感が極端な場合、合わせすぎて自分の適温を見失うことがあります。",
  },
  0: {
    label: "自立",
    body: "あなたの理想は「自立した二人の恋」。四六時中の連絡や過度な干渉は、愛情ではなく負荷として届きます。一人の時間はあなたにとって関係を長持ちさせる整備時間——それを相手に「愛情の問題ではない」と説明できるかが鍵です。",
  },
};

export const CHANNEL_TEXT: Record<0 | 1 | 2, { label: string; body: string }> = {
  0: {
    label: "言葉",
    body: "あなたに愛が届くチャネルは「言葉」。「好き」「ありがとう」「今日の服いいね」——口に出された言葉だけが、確かな愛情として記帳されます。行動で示すタイプの恋人の愛を、受信し損ねないよう注意。",
  },
  1: {
    label: "行動",
    body: "あなたに愛が届くチャネルは「行動」。百回の「好き」より、一回の送り迎え。言葉は軽く感じてしまう分、相手が「言葉の人」だった場合、お互いの愛が誤配送される可能性があります。",
  },
  2: {
    label: "時間",
    body: "あなたに愛が届くチャネルは「時間」。何をするかより、一緒に過ごすこと自体が愛情のカウント対象。忙しさで会う時間が削られると、他の何で補われても目減りを感じるタイプです。",
  },
};

// ---- セーフモードX1バリアント(06 §6) ----

export function safemodePrefix(x1: number): string | null {
  if (x1 >= 4) return "あなたのセーフモードは、まず“人から離れる”方向に働きます。";
  if (x1 <= 2) return "あなたのセーフモードは、まず“外に出す”方向(多弁・行動量・苛立ち)に働きます。";
  return null;
}

// ---- 相性(06 §7) ----

export interface PairInfo {
  slug: TypeSlug;
  why: string;
}

export interface Pairs {
  good: PairInfo[];
  caution: PairInfo[];
}

const GOOD_SAME = "価値観とエネルギーが同じで、リズムが補完し合う相手";
const GOOD_COMP = "リズムが同じで、あなたに欠けた視点を持つ相手";

export const PAIRS: Record<TypeSlug, Pairs> = {
  sol: {
    good: [
      { slug: "comet", why: GOOD_SAME },
      { slug: "lantern", why: GOOD_COMP },
    ],
    caution: [
      { slug: "hanabi", why: "効率と美学、計画と気分——初期設定が正面から異なるペア" },
      { slug: "aurora", why: "進めたいあなたと、こだわりたい相手。役割を分ければ最強の製作チーム" },
    ],
  },
  comet: {
    good: [
      { slug: "sol", why: GOOD_SAME },
      { slug: "bonfire", why: GOOD_COMP },
    ],
    caution: [
      { slug: "kaleido", why: "速度優先のあなたと品質優先の相手。締切と基準の担当分けが鍵" },
      { slug: "crystal", why: "「もう出そう」と「まだ出せない」の衝突。時間の感覚が別の星" },
    ],
  },
  lighthouse: {
    good: [
      { slug: "meteor", why: GOOD_SAME },
      { slug: "luna", why: GOOD_COMP },
    ],
    caution: [
      { slug: "hanabi", why: "静かな積み上げ派と、瞬間の爆発派。互いのペースが読めない" },
      { slug: "aurora", why: "計画のあなたと気分の相手。「予定」の意味がまず違う" },
    ],
  },
  meteor: {
    good: [
      { slug: "lighthouse", why: GOOD_SAME },
      { slug: "hotaru", why: GOOD_COMP },
    ],
    caution: [
      { slug: "kaleido", why: "最短距離のあなたと、細部演出の相手。「そこ要る?」が口癖になる" },
      { slug: "crystal", why: "スピードと純度の正面衝突。納期は前進側、品質は創造側が握ると回る" },
    ],
  },
  prism: {
    good: [
      { slug: "spark", why: GOOD_SAME },
      { slug: "kaleido", why: GOOD_COMP },
    ],
    caution: [
      { slug: "bonfire", why: "「正しさ」で考える人と「気持ち」で感じる人。会話の目的を先に宣言して" },
      { slug: "hotaru", why: "論点整理が、繊細な相手には詰問に聞こえる日がある" },
    ],
  },
  spark: {
    good: [
      { slug: "prism", why: GOOD_SAME },
      { slug: "hanabi", why: GOOD_COMP },
    ],
    caution: [
      { slug: "lantern", why: "議論好きのあなたに、和を重んじる相手が静かに疲弊することがある" },
      { slug: "luna", why: "刺激を求めるあなたと、平穏を守る相手。音量の差から始まるすれ違い" },
    ],
  },
  polaris: {
    good: [
      { slug: "nebula", why: GOOD_SAME },
      { slug: "crystal", why: GOOD_COMP },
    ],
    caution: [
      { slug: "bonfire", why: "根拠の人と、ノリの人。互いの言語を「翻訳」する一手間が必要" },
      { slug: "hotaru", why: "正論の刃が、感受性のアンテナに深く刺さってしまうことがある" },
    ],
  },
  nebula: {
    good: [
      { slug: "polaris", why: GOOD_SAME },
      { slug: "aurora", why: GOOD_COMP },
    ],
    caution: [
      { slug: "lantern", why: "宇宙時間で生きるあなたと、段取りで支える相手。締切の共有がすべて" },
      { slug: "luna", why: "予測不能なあなたが、安定を愛する相手の秩序を揺らしてしまう" },
    ],
  },
  lantern: {
    good: [
      { slug: "bonfire", why: GOOD_SAME },
      { slug: "sol", why: GOOD_COMP },
    ],
    caution: [
      { slug: "spark", why: "会話の火花が、世話役のあなたには「揉め事」に見えてしまう" },
      { slug: "nebula", why: "気配りの人と、上の空の人。悪気のなさが一番わかりにくい" },
    ],
  },
  bonfire: {
    good: [
      { slug: "lantern", why: GOOD_SAME },
      { slug: "comet", why: GOOD_COMP },
    ],
    caution: [
      { slug: "prism", why: "共感してほしいあなたに、解決策が返ってくる。「今日は聞いて」と先に言おう" },
      { slug: "polaris", why: "みんなの人と、一人の人。誘いの断りを拒絶と受け取らないこと" },
    ],
  },
  luna: {
    good: [
      { slug: "hotaru", why: GOOD_SAME },
      { slug: "lighthouse", why: GOOD_COMP },
    ],
    caution: [
      { slug: "spark", why: "静けさを愛するあなたに、刺激の人の音量は少し大きい" },
      { slug: "nebula", why: "「いつも通り」を守る人と、「いつも通り」が苦手な人" },
    ],
  },
  hotaru: {
    good: [
      { slug: "luna", why: GOOD_SAME },
      { slug: "meteor", why: GOOD_COMP },
    ],
    caution: [
      { slug: "prism", why: "分析の光が、あなたには眩しすぎる日がある。「聞いてほしいだけ」を先に伝えて" },
      { slug: "polaris", why: "正しさより先に気持ちがある日を、相手は言われないと気づけない" },
    ],
  },
  kaleido: {
    good: [
      { slug: "hanabi", why: GOOD_SAME },
      { slug: "prism", why: GOOD_COMP },
    ],
    caution: [
      { slug: "comet", why: "「まず出す」文化と「磨いてから出す」文化。工程の合意を先に" },
      { slug: "meteor", why: "効率の人には、あなたの演出が「回り道」に見えることがある" },
    ],
  },
  hanabi: {
    good: [
      { slug: "kaleido", why: GOOD_SAME },
      { slug: "spark", why: GOOD_COMP },
    ],
    caution: [
      { slug: "sol", why: "計画で進めたい相手と、瞬間に賭けるあなた。本番の定義を共有しよう" },
      { slug: "lighthouse", why: "毎日コツコツの人には、あなたの波が読めない。波の説明書を渡して" },
    ],
  },
  crystal: {
    good: [
      { slug: "aurora", why: GOOD_SAME },
      { slug: "polaris", why: GOOD_COMP },
    ],
    caution: [
      { slug: "comet", why: "初速の人と純度の人。「いつ出すか」の基準がまず噛み合わない" },
      { slug: "meteor", why: "最短距離の相手に、あなたの工程の意味を一度だけ説明しておくこと" },
    ],
  },
  aurora: {
    good: [
      { slug: "crystal", why: GOOD_SAME },
      { slug: "nebula", why: GOOD_COMP },
    ],
    caution: [
      { slug: "sol", why: "進めたい人と、潜りたい人。「潜ります宣言」のルール化で大半は解決する" },
      { slug: "lighthouse", why: "計画の人には、あなたの気分の波が「不誠実」に見える日がある。仕様の共有を" },
    ],
  },
};

export const PAIR_PHILOSOPHY =
  "相性に「良し悪し」はありません。あるのは初期設定の違いだけ。どのペアも、設定の違いを知っていれば接続できます。";

// ---- 固定文言 ----

export const UPDATE_TEXT = [
  "このOSは、あなたの「現在のバージョン」です。",
  "転職、引っ越し、出会い、別れ——大きなアップデートのあとは、光り方が変わることがあります。",
  "半年後、また診断してみてください。変わっていたら、それは矛盾ではなく成長ログです。",
];

export const DISCLAIMER = [
  "「じぶんOS」は、自己理解・キャリアの検討・人間関係の振り返りに使っていただくためのエンタメ+内省ツールです。学術的に検証された心理検査・適性検査ではありません。",
  "結果は行動や環境を考えるヒントであり、あなたの能力や未来を決めつけるものではありません。採用選考・人事評価など、人の処遇を決める目的での利用はお控えください。",
  "心や体の不調が続いている場合は、この診断ではなく、医療機関や公的な相談窓口にご相談ください。",
  "回答内容はサーバーに保存されません。結果はURLに含まれる数値のみで表示されています。",
];

export const SAFEMODE_FOOTER =
  "セーフモードは故障ではなく、あなたを守るための仕様です。ただし、つらさが長く続くときは、一人で再起動しようとせず、専門家や相談窓口を頼ってください。";

export const NG_ENV_FOOTER =
  "3つ以上当てはまる環境にいるなら、それはあなたの能力の問題ではなく、電源の相性の問題かもしれません。";
