"use client";

import { useEffect, useRef } from "react";

// Chosen so a backdrop pixel renders at roughly the same size as a Ted sprite
// pixel (64 wide at ~36% of the screen) — mismatched scales read as two games.
const COLS = 176;

/** Limited arcade palette sampled from the Richmond locker room. */
const PALETTE = [
  "#0a0e16", "#141a26", "#232a38", "#39424f",
  "#4a5566", "#6b7688", "#8994a6", "#a9b4c4", "#cdd6e2", "#eef3f9",
  "#143479", "#1d4ba8", "#2a5fc4", "#4a7fe0",
  "#6e1717", "#a32626", "#cf3a3a",
  "#c79a10", "#f0c419",
  "#6b4a32",
].map((hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]);

// Ordered dithering breaks up flat walls; keep it gentle or it reads as static.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const DITHER = 9;

function nearest(r: number, g: number, b: number) {
  let best = PALETTE[0];
  let bestD = Infinity;
  for (const c of PALETTE) {
    // "Redmean" distance — cheap but far closer to perceptual than raw RGB,
    // which collapses the wall blues into one another.
    const rm = (r + c[0]) / 2;
    const dr = r - c[0];
    const dg = g - c[1];
    const db = b - c[2];
    const d =
      (((512 + rm) * dr * dr) / 256) +
      4 * dg * dg +
      (((767 - rm) * db * db) / 256);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

export function PixelBackdrop({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const img = new Image();
    img.src = "/locker-room.jpg";
    img.onload = () => {
      // Drop the ceiling — at this pixel size the light panels are just noise.
      const sy = Math.round(img.height * 0.13);
      const sh = Math.round(img.height * 0.8);
      const rows = Math.round((COLS * sh) / img.width);
      canvas.width = COLS;
      canvas.height = rows;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, sy, img.width, sh, 0, 0, COLS, rows);
      const frame = ctx.getImageData(0, 0, COLS, rows);
      const px = frame.data;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = (y * COLS + x) * 4;
          const t = (BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * DITHER;
          // Lift and gain first: the source is dim, and quantizing it straight
          // crushes the whole room into the two darkest palette entries.
          const lift = (v: number) => 14 + v * 1.18 + t;
          const [r, g, b] = nearest(lift(px[i]), lift(px[i + 1]), lift(px[i + 2]));
          px[i] = r;
          px[i + 1] = g;
          px[i + 2] = b;
        }
      }
      ctx.putImageData(frame, 0, 0);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
