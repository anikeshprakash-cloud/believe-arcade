"use client";

import { Shuffle } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { CharacterSprite } from "@/components/character-sprite";
import { ROSTER, type Character, type CharacterId } from "@/lib/roster";
import { QUOTES_BY } from "@/lib/quotes";
import { cn } from "@/lib/utils";

function Card({
  character,
  highlighted,
  onPick,
}: {
  character: Character;
  highlighted: boolean;
  onPick: (id: CharacterId) => void;
}) {
  const count = QUOTES_BY[character.id]?.length ?? 0;
  return (
    <button
      type="button"
      onClick={() => onPick(character.id)}
      style={{ borderColor: highlighted ? character.accent : undefined }}
      className={cn(
        "relative flex w-[186px] flex-col items-center gap-1.5 border-4 border-[#243059] bg-[#0b1230] p-3 transition-transform",
        "hover:-translate-y-1 hover:border-[#f4ecd8] focus-visible:-translate-y-1 focus-visible:outline-none",
        highlighted && "-translate-y-1"
      )}
    >
      <CharacterSprite character={character} className="h-[132px] w-[132px]" />
      <div className="w-full text-center">
        <p className="retro flex h-[2.6em] items-center justify-center text-[9px] leading-[1.6] text-balance text-[#f4ecd8]">
          {character.name}
        </p>
        <p
          className="retro mt-1 truncate text-[7px] leading-relaxed"
          style={{ color: character.accent }}
        >
          {character.role}
        </p>
      </div>
      <span className="retro text-[7px] text-[#5d689c]">{count} QUOTES</span>
    </button>
  );
}

export function CharacterSelect({
  reeling,
  onPick,
  onRandom,
}: {
  reeling: CharacterId | null;
  onPick: (id: CharacterId) => void;
  onRandom: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="retro mb-4 text-[9px] tracking-[0.25em] text-[#7c88bd]">
        SELECT YOUR CHARACTER
      </p>

      {/* Five across uses the landscape width; nine items wrap 5 + 4. */}
      <div className="flex max-w-[1120px] flex-wrap justify-center gap-4">
        {ROSTER.map((c) => (
          <Card
            key={c.id}
            character={c}
            highlighted={reeling === c.id}
            onPick={onPick}
          />
        ))}
      </div>

      <div className="mt-5">
        <Button
          onClick={onRandom}
          disabled={reeling !== null}
          className="h-12 bg-[#f2c50f] px-6 text-[10px] text-[#17120a] hover:bg-[#ffd733]"
        >
          <Shuffle className="size-4" />
          {reeling ? "PICKING..." : "SURPRISE ME"}
        </Button>
      </div>
    </div>
  );
}
