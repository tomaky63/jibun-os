// 04_questions_and_scoring.md に準拠した決定論スコアリング。乱数禁止。
import { QUESTIONS } from "../content/questions.ts";
import type { Driver, Charge, ProcessAxis, TypeSlug } from "../content/types.ts";

export type Answers = Record<string, number>; // questionId -> 1..5

export interface DiagnosisResult {
  slug: TypeSlug;
  driver: Driver;
  subDriver: Driver;
  charge: Charge;
  process: ProcessAxis;
  chargePct: number; // ソーシャル充電率 0..100
  processPct: number; // 設計度 0..100
  radar: Record<Driver, number>; // 0..100
  subSlug: TypeSlug;
  dualBoot: boolean;
  distance: 0 | 1 | 2; // 0:自立 1:バランス 2:密着
  channel: 0 | 1 | 2; // 0:言葉 1:行動 2:時間
  x1: number;
  x2: number;
}

const SLUG_TABLE: Record<string, TypeSlug> = {
  "D-CO": "sol", "D-CF": "comet", "D-SO": "lighthouse", "D-SF": "meteor",
  "I-CO": "prism", "I-CF": "spark", "I-SO": "polaris", "I-SF": "nebula",
  "H-CO": "lantern", "H-CF": "bonfire", "H-SO": "luna", "H-SF": "hotaru",
  "M-CO": "kaleido", "M-CF": "hanabi", "M-SO": "crystal", "M-SF": "aurora",
};

function slugOf(driver: Driver, charge: Charge, process: ProcessAxis): TypeSlug {
  return SLUG_TABLE[`${driver}-${charge}${process}`];
}

function v(answers: Answers, id: string): number {
  const raw = answers[id];
  if (raw == null || raw < 1 || raw > 5) throw new Error(`missing/invalid answer: ${id}`);
  return QUESTIONS[id].reversed ? 6 - raw : raw;
}

function axisScore(
  answers: Answers,
  positives: string[],
  negatives: string[]
): { pct: number; high: boolean } {
  const ids = [...positives, ...negatives];
  const raw = ids.reduce((sum, id) => sum + v(answers, id), 0); // 8..40
  const pct = Math.round(((raw - 8) / 32) * 100);
  if (pct > 50) return { pct, high: true };
  if (pct < 50) return { pct, high: false };
  // 同点処理: 正側項目の最大値 vs 逆転側(変換済み)の最大値。なお同点なら high 側に倒す
  const maxPos = Math.max(...positives.map((id) => v(answers, id)));
  const maxNeg = Math.max(...negatives.map((id) => v(answers, id)));
  return { pct, high: maxPos >= maxNeg };
}

const DRIVER_ITEMS: Record<Driver, string[]> = {
  D: ["D1", "D2", "D3", "D4"],
  I: ["I1", "I2", "I3", "I4"],
  H: ["H1", "H2", "H3", "H4"],
  M: ["M1", "M2", "M3", "M4"],
};

// 同点時の固定優先順(04 §3-3): H > M > I > D
const DRIVER_PRIORITY: Driver[] = ["H", "M", "I", "D"];

function rankDrivers(answers: Answers): { order: Driver[]; scores: Record<Driver, number> } {
  const scores = { D: 0, I: 0, H: 0, M: 0 } as Record<Driver, number>;
  const countOf = (d: Driver, val: number) =>
    DRIVER_ITEMS[d].filter((id) => v(answers, id) === val).length;
  (Object.keys(DRIVER_ITEMS) as Driver[]).forEach((d) => {
    scores[d] = DRIVER_ITEMS[d].reduce((s, id) => s + v(answers, id), 0);
  });
  const order = ([...DRIVER_PRIORITY] as Driver[]).sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    const fivesA = countOf(a, 5), fivesB = countOf(b, 5);
    if (fivesB !== fivesA) return fivesB - fivesA;
    const foursA = countOf(a, 4), foursB = countOf(b, 4);
    if (foursB !== foursA) return foursB - foursA;
    return DRIVER_PRIORITY.indexOf(a) - DRIVER_PRIORITY.indexOf(b);
  });
  return { order, scores };
}

export const DUAL_BOOT_THRESHOLD = 6;

export function score(answers: Answers): DiagnosisResult {
  const chargeRes = axisScore(answers, ["C1", "C3", "C5", "C7"], ["C2", "C4", "C6", "C8"]);
  const processRes = axisScore(answers, ["P1", "P3", "P5", "P7"], ["P2", "P4", "P6", "P8"]);
  const charge: Charge = chargeRes.high ? "C" : "S";
  const process: ProcessAxis = processRes.high ? "O" : "F";

  const { order, scores } = rankDrivers(answers);
  const driver = order[0];
  const subDriver = order[1];

  const radar = { D: 0, I: 0, H: 0, M: 0 } as Record<Driver, number>;
  (Object.keys(scores) as Driver[]).forEach((d) => {
    radar[d] = Math.round(((scores[d] - 4) / 16) * 100);
  });

  // マージン(0..50 正規化)
  const marginCharge = Math.abs(chargeRes.pct - 50);
  const marginProcess = Math.abs(processRes.pct - 50);
  const marginDriver = ((scores[driver] - scores[subDriver]) / 16) * 50;

  // サブOS: 最小マージン次元を反転(同点時の優先: driver > charge > process)
  let subSlug: TypeSlug;
  const minMargin = Math.min(marginDriver, marginCharge, marginProcess);
  if (marginDriver <= minMargin) {
    subSlug = slugOf(subDriver, charge, process);
  } else if (marginCharge <= minMargin) {
    subSlug = slugOf(driver, charge === "C" ? "S" : "C", process);
  } else {
    subSlug = slugOf(driver, charge, process === "O" ? "F" : "O");
  }

  const dualBoot = minMargin <= DUAL_BOOT_THRESHOLD;

  const distanceRaw = v(answers, "L1") + v(answers, "L2") + v(answers, "L3"); // 3..15
  const distance: 0 | 1 | 2 = distanceRaw >= 11 ? 2 : distanceRaw >= 7 ? 1 : 0;

  // チャネル同点処理: 時間(2) > 行動(1) > 言葉(0)
  const e = [v(answers, "E1"), v(answers, "E2"), v(answers, "E3")];
  const channel: 0 | 1 | 2 =
    e[2] >= e[1] && e[2] >= e[0] ? 2 : e[1] >= e[0] ? 1 : 0;

  return {
    slug: slugOf(driver, charge, process),
    driver,
    subDriver,
    charge,
    process,
    chargePct: chargeRes.pct,
    processPct: processRes.pct,
    radar,
    subSlug,
    dualBoot,
    distance,
    channel,
    x1: answers["X1"],
    x2: answers["X2"],
  };
}

// ---- 結果URLペイロード(04 §5) ----

export interface Payload {
  chargePct: number;
  processPct: number;
  radar: Record<Driver, number>;
  distance: 0 | 1 | 2;
  channel: 0 | 1 | 2;
  x1: number;
  x2: number;
}

export function encodePayload(r: DiagnosisResult): string {
  return [
    r.chargePct, r.processPct,
    r.radar.D, r.radar.I, r.radar.H, r.radar.M,
    r.distance, r.channel, r.x1, r.x2,
  ].join("-");
}

export const DEFAULT_PAYLOAD: Payload = {
  chargePct: -1, // -1 = ゲージ非表示(未受診の共有ビュー)
  processPct: -1,
  radar: { D: -1, I: -1, H: -1, M: -1 },
  distance: 1,
  channel: 2,
  x1: 3,
  x2: 3,
};

export function decodePayload(p: string | null | undefined): Payload {
  if (!p) return DEFAULT_PAYLOAD;
  const parts = p.split("-").map((s) => parseInt(s, 10));
  if (parts.length !== 10 || parts.some((n) => Number.isNaN(n))) return DEFAULT_PAYLOAD;
  const [c, pr, d, i, h, m, dist, ch, x1, x2] = parts;
  const inRange = (n: number, lo: number, hi: number) => n >= lo && n <= hi;
  if (
    !inRange(c, 0, 100) || !inRange(pr, 0, 100) ||
    !inRange(d, 0, 100) || !inRange(i, 0, 100) || !inRange(h, 0, 100) || !inRange(m, 0, 100) ||
    !inRange(dist, 0, 2) || !inRange(ch, 0, 2) || !inRange(x1, 1, 5) || !inRange(x2, 1, 5)
  ) {
    return DEFAULT_PAYLOAD;
  }
  return {
    chargePct: c,
    processPct: pr,
    radar: { D: d, I: i, H: h, M: m },
    distance: dist as 0 | 1 | 2,
    channel: ch as 0 | 1 | 2,
    x1,
    x2,
  };
}

// ペイロードから決定論の星空シードを作る(11 §3-2)
export function payloadSeed(p: Payload): number {
  const nums = [
    Math.max(p.chargePct, 0), Math.max(p.processPct, 0),
    Math.max(p.radar.D, 0), Math.max(p.radar.I, 0),
    Math.max(p.radar.H, 0), Math.max(p.radar.M, 0),
    p.distance, p.channel, p.x1, p.x2,
  ];
  let seed = 20260705;
  for (const n of nums) seed = (Math.imul(seed, 31) + n + 7) | 0;
  return seed >>> 0;
}
