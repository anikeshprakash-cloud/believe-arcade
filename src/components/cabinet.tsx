"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/** Design resolution. Every screen is laid out at exactly this size. */
export const STAGE_W = 1280;
export const STAGE_H = 720;

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  window.addEventListener("orientationchange", cb);
  return () => {
    window.removeEventListener("resize", cb);
    window.removeEventListener("orientationchange", cb);
  };
}

/**
 * Viewport as a primitive string — returning a fresh object here would give
 * useSyncExternalStore a new snapshot every call and loop forever.
 */
function useViewport() {
  const raw = useSyncExternalStore(
    subscribe,
    () => `${window.innerWidth}x${window.innerHeight}`,
    () => `${STAGE_W}x${STAGE_H}`
  );
  const [w, h] = raw.split("x").map(Number);
  return { w, h };
}

export function Cabinet({ children }: { children: ReactNode }) {
  const { w, h } = useViewport();
  const scale = Math.min(w / STAGE_W, h / STAGE_H);

  // A 16:9 cabinet squeezed into a portrait phone leaves text a few pixels
  // tall, so ask for landscape instead of shipping something unreadable.
  const tooNarrow = h > w && w < 820;

  if (tooNarrow) {
    return (
      <div className="flex h-dvh w-screen flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="rotate-hint text-[40px]">▭</div>
        <p className="retro text-[11px] leading-relaxed text-[#f2c50f]">
          ROTATE YOUR DEVICE
        </p>
        <p className="retro text-[8px] leading-loose text-[#6f7bb0]">
          BELIEVE ARCADE RUNS IN LANDSCAPE
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
