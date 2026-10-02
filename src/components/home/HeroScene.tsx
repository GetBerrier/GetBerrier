"use client";

import { useEffect, useRef } from "react";

/**
 * A perspective floor of observation cells. A price path travels toward the
 * viewer above a brushed-gold barrier rail; each weekly post lights as the
 * path crosses it. Drawn on a 2D canvas, paused when off screen.
 */
export function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Deterministic path heights: a walk that stays above the rail.
    const N = 64;
    const heights: number[] = [];
    let v = 1.25;
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < N; i++) {
      v += (rand() - 0.47) * 0.7;
      v = Math.max(0.45, Math.min(3.1, v));
      heights.push(v);
    }

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const start = performance.now();

    function project(x: number, y: number, z: number) {
      // Camera above the floor, yawed so the lanes run up and to the right.
      const yaw = 0.62;
      const cx = x * Math.cos(yaw) - z * Math.sin(yaw);
      const cz = x * Math.sin(yaw) + z * Math.cos(yaw) + 6;
      if (cz <= 0.2) return null;
      const f = Math.min(w, h * 1.6) * 0.95;
      return { x: w * 0.56 + (cx * f) / cz, y: h * 0.36 + ((2.2 - y) * f) / cz, s: 1 / cz };
    }

    function frame(now: number) {
      raf = 0;
      if (!ctx) return;
      const t = reduce ? 4 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const speed = 0.55;
      const shift = (t * speed) % 1;

      // Floor grid
      for (let i = -14; i <= 14; i++) {
        const a = project(i * 0.5, 0, -4);
        const b = project(i * 0.5, 0, 30);
        if (!a || !b) continue;
        const lane = i === -2 || i === 2;
        ctx.strokeStyle = lane ? "rgba(203,168,106,0.55)" : "rgba(255,255,255,0.07)";
        ctx.lineWidth = lane ? 1.2 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      for (let j = -4; j <= 30; j++) {
        const z = j - shift;
        const a = project(-7, 0, z);
        const b = project(7, 0, z);
        if (!a || !b) continue;
        const alpha = Math.max(0, Math.min(0.09, 0.09 * (1 - z / 30)));
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Barrier band between the gold lanes
      const p1 = project(-1, 0, -4);
      const p2 = project(1, 0, -4);
      const p3 = project(1, 0, 30);
      const p4 = project(-1, 0, 30);
      if (p1 && p2 && p3 && p4) {
        const g = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        g.addColorStop(0, "rgba(203,168,106,0.10)");
        g.addColorStop(1, "rgba(203,168,106,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
      }

      // Weekly observation posts
      for (let k = 0; k < 13; k++) {
        const z = k * 2 - ((t * speed) % 2) + 1;
        const base = project(0, 0, z);
        const top = project(0, 2.6, z);
        if (!base || !top) continue;
        const fade = Math.max(0, Math.min(1, (24 - z) / 20)) * Math.max(0, Math.min(1, (z + 3) / 2));
        ctx.strokeStyle = `rgba(243,227,190,${0.22 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(top.x, top.y);
        ctx.stroke();
      }

      // Price path
      const offset = t * speed * 2;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      let head: { x: number; y: number } | null = null;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < N; i++) {
        const z = 24 - i * 0.5 + (offset % 0.5);
        if (z < -1.5) break;
        const idx = (i + Math.floor(offset / 0.5)) % N;
        const pt = project(0, heights[idx], z);
        if (!pt) continue;
        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else ctx.lineTo(pt.x, pt.y);
        head = pt;
      }
      const grad = ctx.createLinearGradient(0, h * 0.2, w, h);
      grad.addColorStop(0, "rgba(244,242,238,0.05)");
      grad.addColorStop(1, "rgba(227,200,146,0.95)");
      ctx.strokeStyle = grad;
      ctx.stroke();

      if (head) {
        const r = 18;
        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 2.4);
        glow.addColorStop(0, "rgba(243,227,190,0.55)");
        glow.addColorStop(1, "rgba(243,227,190,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(head.x, head.y, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fbf3df";
        ctx.beginPath();
        ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
