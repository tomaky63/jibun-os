// 04_questions_and_scoring.md §6 の受け入れテスト
// 実行: node scripts/test-scoring.mts (Node 24 の型ストリッピングで動く)
import { strict as assert } from "node:assert";
import { score, encodePayload, decodePayload, DEFAULT_PAYLOAD, type Answers } from "../lib/scoring.ts";
import { QUESTION_ORDER } from "../content/questions.ts";

function answersAll(value: number, overrides: Record<string, number> = {}): Answers {
  const a: Answers = {};
  for (const id of QUESTION_ORDER) a[id] = value;
  return { ...a, ...overrides };
}

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

// 1. 全問3: 同点処理でC×O、ドライバー同点はH → LANTERN、デュアルブート
test("case1: 全問3 → LANTERN(H-CO)+デュアルブート", () => {
  const r = score(answersAll(3));
  assert.equal(r.chargePct, 50);
  assert.equal(r.processPct, 50);
  assert.equal(r.charge, "C");
  assert.equal(r.process, "O");
  assert.equal(r.driver, "H");
  assert.equal(r.slug, "lantern");
  assert.equal(r.dualBoot, true);
  assert.equal(r.distance, 1);
  assert.equal(r.channel, 2);
});

// 2. 全問5: 逆転により充電/処理は50で同点→C/O、ドライバー全20同点→H → LANTERN
test("case2: 全問5 → LANTERN", () => {
  const r = score(answersAll(5));
  assert.equal(r.chargePct, 50);
  assert.equal(r.charge, "C");
  assert.equal(r.process, "O");
  assert.equal(r.driver, "H");
  assert.equal(r.slug, "lantern");
});

// 3. C系4問=5・逆転4問=1(変換後5)→ charge_pct=100・C判定
test("case3: つながり全振り → 充電率100%", () => {
  const r = score(answersAll(3, { C1: 5, C3: 5, C5: 5, C7: 5, C2: 1, C4: 1, C6: 1, C8: 1 }));
  assert.equal(r.chargePct, 100);
  assert.equal(r.charge, "C");
});

// 4. D4問=5・他ドライバー=1 → 主ドライバーD、レーダー100/0
test("case4: 前進全振り → ドライバーD", () => {
  const r = score(answersAll(3, {
    D1: 5, D2: 5, D3: 5, D4: 5,
    I1: 1, I2: 1, I3: 1, I4: 1,
    H1: 1, H2: 1, H3: 1, H4: 1,
    M1: 1, M2: 1, M3: 1, M4: 1,
  }));
  assert.equal(r.driver, "D");
  assert.equal(r.radar.D, 100);
  assert.equal(r.radar.I, 0);
});

// 5. ドライバー差2(margin 6.25)→ 非デュアル / 差1(3.125)→ デュアル
test("case5: デュアルブート閾値", () => {
  const far = {
    C1: 5, C3: 5, C5: 5, C7: 5, C2: 1, C4: 1, C6: 1, C8: 1,
    P1: 5, P3: 5, P5: 5, P7: 5, P2: 1, P4: 1, P6: 1, P8: 1,
    H1: 1, H2: 1, H3: 1, H4: 1, M1: 1, M2: 1, M3: 1, M4: 1,
  };
  const diff2 = score(answersAll(3, { ...far, D1: 5, D2: 5, D3: 5, D4: 5, I1: 5, I2: 5, I3: 5, I4: 3 }));
  assert.equal(diff2.driver, "D");
  assert.equal(diff2.dualBoot, false);
  const diff1 = score(answersAll(3, { ...far, D1: 5, D2: 5, D3: 5, D4: 5, I1: 5, I2: 5, I3: 5, I4: 4 }));
  assert.equal(diff1.dualBoot, true);
  assert.equal(diff1.subSlug, "prism"); // I×C×O
});

// 6. ペイロード往復
test("case6: ペイロードのエンコード/デコード往復", () => {
  const r = score(answersAll(4, { C2: 2, L1: 5, L3: 5, E2: 5 }));
  const p = decodePayload(encodePayload(r));
  assert.equal(p.chargePct, r.chargePct);
  assert.equal(p.processPct, r.processPct);
  assert.deepEqual(p.radar, r.radar);
  assert.equal(p.distance, r.distance);
  assert.equal(p.channel, r.channel);
});

// 7. 不正ペイロード → 既定値でクラッシュしない
test("case7: 不正ペイロードは既定値", () => {
  assert.deepEqual(decodePayload("abc"), DEFAULT_PAYLOAD);
  assert.deepEqual(decodePayload("1-2-3"), DEFAULT_PAYLOAD);
  assert.deepEqual(decodePayload("999-0-0-0-0-0-0-0-3-3"), DEFAULT_PAYLOAD);
  assert.deepEqual(decodePayload(null), DEFAULT_PAYLOAD);
});

// 追加: 16タイプ網羅(各ドライバー×充電×処理の組み合わせが正しいslugになる)
test("extra: 16タイプすべてに到達できる", () => {
  const driverSets: Record<string, Record<string, number>> = {
    D: { D1: 5, D2: 5, D3: 5, D4: 5 },
    I: { I1: 5, I2: 5, I3: 5, I4: 5 },
    H: { H1: 5, H2: 5, H3: 5, H4: 5 },
    M: { M1: 5, M2: 5, M3: 5, M4: 5 },
  };
  const zeroDrivers = {
    D1: 1, D2: 1, D3: 1, D4: 1, I1: 1, I2: 1, I3: 1, I4: 1,
    H1: 1, H2: 1, H3: 1, H4: 1, M1: 1, M2: 1, M3: 1, M4: 1,
  };
  const chargeHigh = { C1: 5, C3: 5, C5: 5, C7: 5, C2: 1, C4: 1, C6: 1, C8: 1 };
  const chargeLow = { C1: 1, C3: 1, C5: 1, C7: 1, C2: 5, C4: 5, C6: 5, C8: 5 };
  const procHigh = { P1: 5, P3: 5, P5: 5, P7: 5, P2: 1, P4: 1, P6: 1, P8: 1 };
  const procLow = { P1: 1, P3: 1, P5: 1, P7: 1, P2: 5, P4: 5, P6: 5, P8: 5 };
  const expected: Record<string, string> = {
    "D-CO": "sol", "D-CF": "comet", "D-SO": "lighthouse", "D-SF": "meteor",
    "I-CO": "prism", "I-CF": "spark", "I-SO": "polaris", "I-SF": "nebula",
    "H-CO": "lantern", "H-CF": "bonfire", "H-SO": "luna", "H-SF": "hotaru",
    "M-CO": "kaleido", "M-CF": "hanabi", "M-SO": "crystal", "M-SF": "aurora",
  };
  const seen = new Set<string>();
  for (const d of ["D", "I", "H", "M"]) {
    for (const [c, cSet] of [["C", chargeHigh], ["S", chargeLow]] as const) {
      for (const [p, pSet] of [["O", procHigh], ["F", procLow]] as const) {
        const r = score(answersAll(3, { ...zeroDrivers, ...driverSets[d], ...cSet, ...pSet }));
        assert.equal(r.slug, expected[`${d}-${c}${p}`], `${d}-${c}${p}`);
        seen.add(r.slug);
      }
    }
  }
  assert.equal(seen.size, 16);
});

console.log(`\n${passed} tests passed`);
