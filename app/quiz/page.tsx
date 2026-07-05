"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Starfield from "@/components/Starfield";
import { QUESTIONS, QUESTION_ORDER, LIKERT_LABELS } from "@/content/questions";
import { DRIVER_LABEL } from "@/content/types";
import { score, encodePayload, type Answers } from "@/lib/scoring";

const STORAGE_KEY = "jibunos-quiz-v1";
const TOTAL = QUESTION_ORDER.length;

interface Saved { answers: Answers; idx: number; }

export default function QuizPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<"quiz" | "boot">("quiz");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);
  const [restored, setRestored] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Saved = JSON.parse(raw);
        if (saved && typeof saved.idx === "number" && saved.answers) {
          setAnswers(saved.answers);
          setIdx(Math.min(saved.idx, TOTAL - 1));
        }
      }
    } catch { /* 復元失敗は無視 */ }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, idx }));
    } catch { /* 保存失敗は無視 */ }
  }, [answers, idx, restored]);

  const qid = QUESTION_ORDER[idx];
  const q = QUESTIONS[qid];
  const answeredCount = useMemo(
    () => QUESTION_ORDER.filter((id) => answers[id] != null).length,
    [answers]
  );
  const pct = Math.round((answeredCount / TOTAL) * 100);

  const finish = useCallback((finalAnswers: Answers) => {
    const result = score(finalAnswers);
    const chargeLabel = result.charge === "C" ? "つながり充電" : "ひとり充電";
    const processLabel = result.process === "O" ? "設計走行" : "即興走行";
    const lines = [
      "JIBUN OS セットアップを完了しています…",
      `> 充電方式 ………… ${chargeLabel} ✓`,
      `> 処理方式 ………… ${processLabel} ✓`,
      `> コアドライバー … ${DRIVER_LABEL[result.driver]} ✓`,
      result.dualBoot ? "> 2つの光が共鳴しています……" : "> あなたの光を探しています……",
    ];
    setPhase("boot");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 60 : 430;
    lines.forEach((ln, i) => {
      setTimeout(() => setBootLines((prev) => [...prev, ln]), delay * (i + 1));
    });
    const url = `/result/${result.slug}/?p=${encodePayload(result)}`;
    setTimeout(() => {
      setFlash(true);
      setTimeout(() => {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
        router.push(url);
      }, reduced ? 100 : 500);
    }, delay * (lines.length + 1) + (reduced ? 100 : 700));
  }, [router]);

  const answer = useCallback((value: number) => {
    if (lockRef.current || phase !== "quiz") return;
    lockRef.current = true;
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    setTimeout(() => {
      lockRef.current = false;
      if (idx + 1 >= TOTAL) {
        finish(next);
      } else {
        setIdx(idx + 1);
      }
    }, 240);
  }, [answers, qid, idx, phase, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "quiz") return;
      if (e.key >= "1" && e.key <= "5") answer(parseInt(e.key, 10));
      if (e.key === "Backspace" && idx > 0) { e.preventDefault(); setIdx(idx - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, idx, phase]);

  return (
    <div className="shell">
      <Starfield mode={phase === "boot" ? "boot" : "quiz"} userStarCount={answeredCount} milestone={answeredCount} />
      {flash && (
        <div style={{ position: "fixed", inset: 0, background: "#F5F3EE", zIndex: 10, animation: "bootIn 0.25s ease" }} />
      )}
      <div className="content-layer">
        {phase === "quiz" ? (
          <div className="container" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <div style={{ paddingTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-faint)" }}>
                <span style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>じぶんOS 初期設定</span>
                <span aria-live="polite">インストール中 {pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div style={{ flex: 1, minHeight: "16dvh" }} />
            <div className="quiz-card">
              <div className="quiz-card-inner">
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--gold)" }}>
                  Q{idx + 1} / {TOTAL}
                </p>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, minHeight: "3.5em" }}>{q.text}</p>
                <div className="orbs" role="radiogroup" aria-label="回答">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      className="orb"
                      role="radio"
                      aria-checked={answers[qid] === v}
                      aria-label={LIKERT_LABELS[v - 1]}
                      onClick={() => answer(v)}
                      style={{
                        background: `rgba(100,255,218,${0.06 + (v - 1) * 0.13})`,
                        border: `1px solid rgba(232,201,122,${0.3 + v * 0.12})`,
                        boxShadow: answers[qid] === v ? "0 0 0 2px var(--teal)" : "none",
                      }}
                    />
                  ))}
                </div>
                <div className="orb-labels">
                  <span>そう思わない</span>
                  <span>そう思う</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: "8px 16px", fontSize: 12, visibility: idx > 0 ? "visible" : "hidden" }}
                    onClick={() => setIdx(Math.max(0, idx - 1))}
                  >
                    ひとつ戻る
                  </button>
                  <span className="mini-note" style={{ alignSelf: "center" }}>キーボード 1〜5 でも回答できます</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="boot-screen container" aria-live="polite">
            {bootLines.map((ln, i) => (
              <p key={i} className="boot-line" style={{ margin: 0 }}>{ln}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
