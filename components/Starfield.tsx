"use client";

import { useEffect, useRef } from "react";

export interface StarfieldProps {
  mode: "ambient" | "quiz" | "boot" | "result";
  colors?: [string, string];
  effect?: string;
  seed?: number;
  userStarCount?: number; // quiz: 回答数 / result: 星空の再現
  milestone?: number; // quiz: 回答済み数(月・流れ星などの環境演出)
}

interface Star { x: number; y: number; r: number; a: number; p: number; }
interface UserStar { x: number; y: number; tx: number; ty: number; t: number; r: number; c: string; p: number; }
interface Shot { x: number; y: number; vx: number; vy: number; life: number; }
interface Ember { x: number; y: number; vy: number; life: number; r: number; }
interface Burst { x: number; y: number; t: number; hue: string; }

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export default function Starfield({
  mode,
  colors = ["#64FFDA", "#7C4DFF"],
  effect = "none",
  seed = 20260705,
  userStarCount = 0,
  milestone = 0,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ mode, effect, milestone, userStarCount, colors });
  stateRef.current = { mode, effect, milestone, userStarCount, colors };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rnd = mulberry32(seed);
    const baseStars: Star[] = [];
    const baseCount = Math.min(180, Math.floor((W * H) / 6500));
    for (let i = 0; i < baseCount; i++) {
      baseStars.push({ x: rnd(), y: rnd(), r: 0.35 + rnd() * 1.0, a: 0.1 + rnd() * 0.32, p: rnd() * 6.28 });
    }
    const userStars: UserStar[] = [];
    const shots: Shot[] = [];
    const embers: Ember[] = [];
    const bursts: Burst[] = [];
    let lastShot = 0;
    let lastBurst = 0;
    let milestoneShotDone = false;

    const c1 = hexToRgb(stateRef.current.colors[0]);
    const c2 = hexToRgb(stateRef.current.colors[1]);
    const gold = "232,201,122";

    const syncUserStars = () => {
      const target = stateRef.current.userStarCount;
      while (userStars.length < target) {
        userStars.push({
          x: 0.5, y: 1.05,
          tx: 0.06 + rnd() * 0.88, ty: 0.04 + rnd() * 0.55,
          t: reduced ? 1 : 0,
          r: 1.4 + rnd() * 1.2,
          c: rnd() > 0.45 ? c1 : c2,
          p: rnd() * 6.28,
        });
      }
    };

    const drawAurora = (time: number, dim: number) => {
      const bands = [
        { c: c1, ph: 0, amp: 0.11, x0: 0.24 },
        { c: c2, ph: 2.1, amp: 0.15, x0: 0.55 },
        { c: c1, ph: 4.2, amp: 0.09, x0: 0.8 },
      ];
      for (const bd of bands) {
        for (let y = 0; y < H; y += 8) {
          const wob = reduced ? 0 : Math.sin(y * 0.011 + time * 0.0006 + bd.ph) * bd.amp * W;
          const alpha = 0.055 * (1 - y / H) * dim;
          ctx.fillStyle = `rgba(${bd.c},${alpha.toFixed(3)})`;
          ctx.fillRect(bd.x0 * W + wob - W * 0.09, y, W * 0.18, 8);
        }
      }
    };

    const drawNebulaBlobs = (time: number) => {
      const blobs = [
        { x: 0.22, y: 0.22, r: 0.42, c: c1, a: 0.05 },
        { x: 0.78, y: 0.5, r: 0.5, c: c2, a: 0.055 },
        { x: 0.45, y: 0.85, r: 0.45, c: "236,64,122", a: 0.02 },
      ];
      blobs.forEach((bl, i) => {
        const br = bl.r * Math.min(W, H) * (reduced ? 1 : 1 + 0.06 * Math.sin(time * 0.0004 + i * 2));
        const g = ctx.createRadialGradient(bl.x * W, bl.y * H, 0, bl.x * W, bl.y * H, br);
        g.addColorStop(0, `rgba(${bl.c},${bl.a})`);
        g.addColorStop(1, `rgba(${bl.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(bl.x * W - br, bl.y * H - br, br * 2, br * 2);
      });
    };

    const drawEffect = (time: number) => {
      const eff = stateRef.current.effect;
      if (stateRef.current.mode !== "result") return;
      if (eff === "aurora" || eff === "nebula" || eff === "prisms" || eff === "kaleido") {
        drawAurora(time, eff === "aurora" ? 1 : 0.55);
      }
      if (eff === "halo" || eff === "polestar" || eff === "moon" || eff === "glints") {
        const pr = reduced ? 0 : Math.sin(time * 0.0012) * 0.05 + 1;
        const R = Math.min(W, H) * 0.3 * pr;
        const g = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, R);
        g.addColorStop(0, `rgba(${c1},0.12)`);
        g.addColorStop(1, `rgba(${c1},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(W * 0.5 - R, H * 0.3 - R, R * 2, R * 2);
      }
      if (eff === "beam") {
        const ang = reduced ? -0.4 : Math.sin(time * 0.00025) * 0.5 - 0.2;
        ctx.save();
        ctx.translate(W * 0.15, H * 0.25);
        ctx.rotate(ang);
        const g = ctx.createLinearGradient(0, 0, W * 1.1, 0);
        g.addColorStop(0, `rgba(${c1},0.10)`);
        g.addColorStop(1, `rgba(${c1},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(W * 1.1, -H * 0.09);
        ctx.lineTo(W * 1.1, H * 0.09);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      if ((eff === "streaks" || eff === "meteor") && !reduced && time - lastShot > (eff === "meteor" ? 4200 : 2800)) {
        lastShot = time;
        shots.push({ x: W * (0.25 + Math.random() * 0.6), y: H * 0.08 + Math.random() * H * 0.2, vx: -3.2, vy: 1.7, life: 1 });
      }
      if ((eff === "embers" || eff === "sparks" || eff === "fireflies") && !reduced && embers.length < 40) {
        embers.push({
          x: Math.random() * W,
          y: eff === "fireflies" ? Math.random() * H : H + 8,
          vy: eff === "fireflies" ? 0 : -(0.25 + Math.random() * 0.5),
          life: 1,
          r: 1 + Math.random() * 1.6,
        });
      }
      if (eff === "fireworks" && !reduced && time - lastBurst > 8000) {
        lastBurst = time;
        bursts.push({ x: W * (0.2 + Math.random() * 0.6), y: H * (0.12 + Math.random() * 0.2), t: 0, hue: Math.random() > 0.5 ? c1 : c2 });
      }
    };

    let raf = 0;
    const loop = (time: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0B1026";
      ctx.fillRect(0, 0, W, H);
      drawNebulaBlobs(time);
      drawEffect(time);

      const st = stateRef.current;

      // quiz中のマイルストーン: 月(10問〜)
      if ((st.mode === "quiz" || st.mode === "boot") && st.milestone >= 10) {
        ctx.fillStyle = "rgba(230,233,240,0.75)";
        ctx.beginPath();
        ctx.arc(W * 0.82, H * 0.14, 22, 0, 6.28);
        ctx.fill();
        ctx.fillStyle = "#0B1026";
        ctx.beginPath();
        ctx.arc(W * 0.82 - 9, H * 0.14 - 4, 19, 0, 6.28);
        ctx.fill();
      }
      // 20問目: 流れ星を1回だけ
      if (st.mode === "quiz" && st.milestone >= 20 && !milestoneShotDone && !reduced) {
        milestoneShotDone = true;
        shots.push({ x: W * 0.7, y: H * 0.12, vx: -3.4, vy: 1.8, life: 1 });
      }

      // 流れ星
      for (let i = shots.length - 1; i >= 0; i--) {
        const sh = shots[i];
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.016;
        if (sh.life <= 0) { shots.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(245,243,238,${(0.55 * sh.life).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x + 34, sh.y - 18);
        ctx.stroke();
      }

      // 火の粉・蛍
      for (let i = embers.length - 1; i >= 0; i--) {
        const em = embers[i];
        em.y += em.vy;
        em.life -= 0.004;
        if (em.life <= 0 || em.y < -10) { embers.splice(i, 1); continue; }
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.002 + em.x));
        ctx.fillStyle = `rgba(${c1},${(0.5 * em.life * tw).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(em.x, em.y, em.r, 0, 6.28);
        ctx.fill();
      }

      // 花火
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.t += 0.02;
        if (b.t >= 1) { bursts.splice(i, 1); continue; }
        const R = 10 + b.t * 60;
        for (let k = 0; k < 14; k++) {
          const ang = (k / 14) * 6.28;
          ctx.fillStyle = `rgba(${b.hue},${((1 - b.t) * 0.7).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(b.x + Math.cos(ang) * R, b.y + Math.sin(ang) * R, 1.6, 0, 6.28);
          ctx.fill();
        }
      }

      // ベース星
      for (const s of baseStars) {
        const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(time * 0.001 + s.p);
        ctx.fillStyle = `rgba(245,243,238,${(s.a * tw).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, 6.28);
        ctx.fill();
      }

      // ユーザーの星(回答星)+星座線
      syncUserStars();
      const pts: { x: number; y: number; u: UserStar }[] = [];
      for (const u of userStars) {
        if (u.t < 1) u.t = Math.min(1, u.t + 0.028);
        const e = 1 - Math.pow(1 - u.t, 3);
        let px = (u.x + (u.tx - u.x) * e) * W;
        let py = (u.y + (u.ty - u.y) * e) * H;
        if (st.mode === "boot") {
          px += (W * 0.5 - px) * 0.02;
          py += (H * 0.4 - py) * 0.02;
          u.tx += (0.5 - u.tx) * 0.02;
          u.ty += (0.4 - u.ty) * 0.02;
        }
        pts.push({ x: px, y: py, u });
      }
      ctx.strokeStyle = `rgba(${gold},0.22)`;
      ctx.lineWidth = 0.6;
      for (let k = 1; k < pts.length; k++) {
        const a1 = pts[k - 1], a2 = pts[k];
        const dx = a1.x - a2.x, dy = a1.y - a2.y;
        if (dx * dx + dy * dy < W * H * 0.03) {
          ctx.beginPath();
          ctx.moveTo(a1.x, a1.y);
          ctx.lineTo(a2.x, a2.y);
          ctx.stroke();
        }
      }
      for (const p of pts) {
        const tw = reduced ? 1 : 0.75 + 0.25 * Math.sin(time * 0.0015 + p.u.p);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.u.r * 4);
        g.addColorStop(0, `rgba(${p.u.c},${(0.5 * tw).toFixed(3)})`);
        g.addColorStop(1, `rgba(${p.u.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.u.r * 4, 0, 6.28);
        ctx.fill();
        ctx.fillStyle = `rgba(${p.u.c},${(0.95 * tw).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.u.r, 0, 6.28);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return <canvas ref={canvasRef} className="sky-layer" aria-hidden="true" />;
}
