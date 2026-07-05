"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HOLD_MS = 800;
const CIRC = 2 * Math.PI * 52;

export default function PowerButton() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const firedRef = useRef(false);
  const pressedRef = useRef(false);

  const go = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    router.push("/quiz/");
  };

  const tick = (ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const f = Math.min(1, (ts - startRef.current) / HOLD_MS);
    setProgress(f);
    if (f >= 1) { go(); return; }
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { go(); return; }
    pressedRef.current = true;
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  };

  const end = (fire: boolean) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (fire && pressedRef.current) go();
    pressedRef.current = false;
    setProgress(0);
    startRef.current = 0;
  };

  return (
    <button
      className="power-btn"
      aria-label="診断を始める(OSを起動する)"
      onPointerDown={(e) => { e.preventDefault(); start(); }}
      onPointerUp={() => end(true)}
      onPointerLeave={() => end(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") go(); }}
    >
      <svg className="ring" width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
        <circle cx="55" cy="55" r="52" fill="none" stroke="rgba(232,201,122,0.25)" strokeWidth="1" />
        <circle
          cx="55" cy="55" r="52" fill="none" stroke="#64FFDA" strokeWidth="2"
          strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
          transform="rotate(-90 55 55)"
        />
      </svg>
      <svg className="power-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 3v8" />
        <path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
      </svg>
    </button>
  );
}
