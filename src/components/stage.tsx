"use client";

import { Badge } from "@/components/ui/8bit/badge";
import { CharacterSprite } from "@/components/character-sprite";
import { PixelBackdrop } from "@/components/pixel-backdrop";
import { THEME_BADGE, THEME_COLOR, type Quote } from "@/lib/quotes";
import type { Character } from "@/lib/roster";
import { cn } from "@/lib/utils";

export function Stage({
  character,
  quote,
  typed,
}: {
  character: Character;
  quote: Quote;
  typed: number;
}) {
  const done = typed >= quote.text.length;
  const accent = THEME_COLOR[quote.theme];

  return (
    <div className="relative h-[404px] w-[1100px]">
      <div className="crt relative h-full overflow-hidden border-y-6 border-[#f4ecd8] bg-[#060912]">
        <div
          className="pointer-events-none absolute inset-0 z-30 border-x-6 border-inherit"
          aria-hidden="true"
        />

        <div className="relative h-full w-full">
          <PixelBackdrop className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="scanlines pointer-events-none absolute inset-0 z-20" />
          <div className="vignette pointer-events-none absolute inset-0 z-20" />

          <div className="believe-sign absolute left-[5%] top-[8%] z-10 border-4 border-[#1a1608] bg-[#f2c50f] px-3 py-2">
            <span className="retro text-[11px] tracking-[0.2em] text-[#14204a]">
              BELIEVE
            </span>
          </div>

          <div className="absolute bottom-0 right-[2%] z-10 w-[340px]">
            <CharacterSprite
              key={character.id}
              character={character}
              talking={!done}
              className="ted-bob h-[340px] w-[340px] drop-shadow-[0_0_14px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-[8%] left-[4%] z-10 w-[600px]">
        <div className="relative border-y-6 border-[#f4ecd8] bg-[#0b1230]/95">
          <div
            className="pointer-events-none absolute inset-0 border-x-6 border-inherit"
            aria-hidden="true"
          />
          <div className="px-7 py-5">
            <div className="mb-4 flex">
              <Badge className={cn("h-5", THEME_BADGE[quote.theme])}>
                <span className="text-[8px] tracking-widest">{quote.theme}</span>
              </Badge>
            </div>

            {/* Fixed height: the tallest quote is six lines, and letting the box
                resize per quote makes the whole screen jump. */}
            <p className="retro h-[112px] overflow-hidden text-[12px] leading-[1.85] text-[#f4ecd8]">
              {quote.text.slice(0, typed)}
              {!done && <span className="caret">_</span>}
            </p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <span
                className="retro truncate text-[9px]"
                style={{ color: character.accent }}
              >
                — {character.name.toUpperCase()}
              </span>
              {done && (
                <span
                  className="retro animate-pulse text-[9px]"
                  style={{ color: accent }}
                >
                  ▼
                </span>
              )}
            </div>
          </div>

          {/* Tail, stepped like a sprite, pointing across at the speaker */}
          <div
            className="absolute left-full top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-2 w-3 bg-[#f4ecd8]" />
            <div className="h-2 w-6 bg-[#f4ecd8]" />
            <div className="h-2 w-9 bg-[#f4ecd8]" />
            <div className="h-2 w-6 bg-[#f4ecd8]" />
            <div className="h-2 w-3 bg-[#f4ecd8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
