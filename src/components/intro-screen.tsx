"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  AISLES,
  CELL,
  COLS,
  ROWS,
  SEAT,
  WALKWAY,
  buildMask,
  isSeat,
} from "@/lib/seat-board";

const BLUE = [
  { base: "#0f6fc9", light: "#4aa6ee", dark: "#0a4a8e" },
  { base: "#1179d6", light: "#55b0f4", dark: "#0b5199" },
];
const RED = [
  { base: "#dc3f26", light: "#f4734c", dark: "#9e2a15" },
  { base: "#e6492c", light: "#fa8057", dark: "#a82f18" },
];

const PAINT_MS = 2300;

/** Stable per-seat variation so the stand isn't a flat colour field. */
const variant = (c: number, r: number) => ((c * 7 + r * 13) >>> 0) % 2;

export function IntroScreen({ onStart }: { onStart: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);
  const skipRef = useRef(false);

  const skip = useCallback(() => {
    skipRef.current = true;
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const seat = (c: number, r: number, pal: (typeof BLUE)[number]) => {
      const x = c * CELL;
      const y = r * CELL;
      ctx.fillStyle = pal.base;
      ctx.fillRect(x, y, SEAT, SEAT);
      ctx.fillStyle = pal.light;
      ctx.fillRect(x, y, SEAT, 1);
      ctx.fillStyle = pal.dark;
      ctx.fillRect(x, y + SEAT - 1, SEAT, 1);
    };

    // concrete
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#243047";
    for (const c of AISLES) ctx.fillRect(c * CELL, 0, SEAT, canvas.height);
    for (const r of WALKWAY) ctx.fillRect(0, r * CELL, canvas.width, SEAT);

    const mask = buildMask();
    const red: Array<[number, number]> = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!isSeat(c, r)) continue;
        seat(c, r, BLUE[variant(c, r)]);
        if (mask[r][c]) red.push([c, r]);
      }
    }

    // Sweep left to right, but scattered — a clean wipe reads mechanical,
    // while pure random reads like noise.
    const order = red
      .map((p) => ({ p, k: p[0] + Math.random() * 13 }))
      .sort((a, b) => a.k - b.k)
      .map((o) => o.p);

    // Reduced motion paints the whole board on the first frame rather than
    // returning early, which would mean setting state inside the effect body.
    const duration = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : PAINT_MS;

    let raf = 0;
    let drawn = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t =
        skipRef.current || duration <= 0
          ? 1
          : Math.min(1, (now - t0) / duration);
      const target = Math.floor(t * order.length);
      for (; drawn < target; drawn++) {
        const [c, r] = order[drawn];
        seat(c, r, RED[variant(c, r)]);
      }
      if (t < 1) raf = requestAnimationFrame(frame);
      else setPainted(true);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      e.preventDefault();
      if (painted) onStart();
      else skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [painted, onStart, skip]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-7 px-10">
      <button
        type="button"
        onClick={() => (painted ? onStart() : skip())}
        aria-label={painted ? "Press start" : "Skip intro"}
        className="cursor-pointer"
      >
        <div className="crt relative overflow-hidden border-y-6 border-[#f4ecd8] bg-[#0b1020]">
          <div
            className="pointer-events-none absolute inset-0 z-30 border-x-6 border-inherit"
            aria-hidden="true"
          />
          <canvas
            ref={ref}
            width={COLS * CELL}
            height={ROWS * CELL}
            className="block"
            style={{ width: 780, height: 468, imageRendering: "pixelated" }}
            role="img"
            aria-label="Stadium crowd spelling TED LASSO in red seats"
          />
          <div className="scanlines pointer-events-none absolute inset-0 z-20" />
          <div className="vignette pointer-events-none absolute inset-0 z-20" />
        </div>
      </button>

      <div className="text-center">
        <h1 className="retro arcade-title text-3xl leading-relaxed text-[#f2c50f]">
          BELIEVE <span className="text-[#f4ecd8]">ARCADE</span>
        </h1>

        <div className="mt-6 flex h-9 items-center justify-center">
          {painted ? (
            <button
              type="button"
              onClick={onStart}
              className="retro press-start cursor-pointer px-4 py-2 text-[13px] tracking-[0.25em] text-[#f4ecd8]"
            >
              ▸ PRESS START ◂
            </button>
          ) : (
            <button
              type="button"
              onClick={skip}
              className="retro cursor-pointer px-4 py-2 text-[10px] tracking-[0.2em] text-[#4c5680] hover:text-[#7c88bd]"
            >
              SKIP ▸
            </button>
          )}
        </div>

        <p className="retro mt-4 text-[8px] leading-loose text-[#3c4569]">
          © 1987 AFC RICHMOND · DRAFTED BY ANIKESH &amp; CRAFTED BY CLAUDE ·
          8bitcn
        </p>
      </div>
    </div>
  );
}
