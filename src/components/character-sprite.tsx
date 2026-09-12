"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { SPRITE_N, type Character } from "@/lib/roster";

/** Char grid -> RGBA buffer. `overrides` swaps in the talking jaw rows. */
function toRgba(c: Character, overrides?: Record<number, string>) {
  const buf = new Uint8ClampedArray(SPRITE_N * SPRITE_N * 4);
  const rgb = new Map<string, [number, number, number]>();
  for (const [ch, hex] of Object.entries(c.palette)) {
    rgb.set(ch, [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ]);
  }
  for (let y = 0; y < SPRITE_N; y++) {
    const row = overrides?.[y] ?? c.rest[y];
    for (let x = 0; x < SPRITE_N; x++) {
      const col = rgb.get(row[x]);
      if (!col) continue;
      const i = (y * SPRITE_N + x) * 4;
      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = 255;
    }
  }
  return buf;
}

export function CharacterSprite({
  character,
  talking = false,
  className,
}: {
  character: Character;
  talking?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [openMouth, setOpenMouth] = useState(false);

  const frames = useMemo(
    () => ({ rest: toRgba(character), talk: toRgba(character, character.talk) }),
    [character]
  );

  useEffect(() => {
    if (!talking) return;
    // Irregular cadence reads as speech; a fixed interval reads as a metronome.
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setOpenMouth((v) => !v);
      timer = setTimeout(tick, 110 + Math.random() * 90);
    };
    timer = setTimeout(tick, 90);
    return () => clearTimeout(timer);
  }, [talking]);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const data = talking && openMouth ? frames.talk : frames.rest;
    ctx.putImageData(new ImageData(data, SPRITE_N, SPRITE_N), 0, 0);
  }, [talking, openMouth, frames]);

  return (
    <canvas
      ref={ref}
      width={SPRITE_N}
      height={SPRITE_N}
      className={className}
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label={`${character.name}, ${talking ? "speaking" : "waiting"}`}
    />
  );
}
