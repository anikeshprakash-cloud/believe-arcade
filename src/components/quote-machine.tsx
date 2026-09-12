"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Shuffle, Users, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { Kbd } from "@/components/ui/8bit/kbd";
import { Progress } from "@/components/ui/8bit/progress";
import { CharacterSelect } from "@/components/character-select";
import { IntroScreen } from "@/components/intro-screen";
import { Stage } from "@/components/stage";
import { QUOTES, QUOTES_BY, type Quote } from "@/lib/quotes";
import { BY_ID, ROSTER, type CharacterId } from "@/lib/roster";
import { blip, sting, thunk, tick } from "@/lib/arcade-audio";

const TYPE_MS = 26;

function shuffle<T>(xs: T[]) {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
}

export function QuoteMachine() {
  const [started, setStarted] = useState(false);
  const [picked, setPicked] = useState<CharacterId | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [typed, setTyped] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [sound, setSound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reeling, setReeling] = useState<CharacterId | null>(null);
  const bags = useRef<Partial<Record<CharacterId, Quote[]>>>({});

  const character = picked ? BY_ID[picked] : null;
  const done = !quote || typed >= quote.text.length;

  /** Shuffle-bag per character so a run never repeats until the set is done. */
  const draw = useCallback((id: CharacterId, avoid?: Quote) => {
    const pool = QUOTES_BY[id] ?? [];
    let bag = bags.current[id];
    if (!bag?.length) {
      bag = shuffle(pool.filter((q) => pool.length === 1 || q !== avoid));
      bags.current[id] = bag;
    }
    return bag.pop()!;
  }, []);

  const play = useCallback(
    (id: CharacterId, avoid?: Quote) => {
      const q = draw(id, avoid);
      setPicked(id);
      setQuote(q);
      setTyped(0);
      setCopied(false);
      setSeen((s) => new Set(s).add(q.text));
      if (sound) sting(BY_ID[id].voice);
    },
    [draw, sound]
  );

  // typewriter
  useEffect(() => {
    if (!quote || done) return;
    const t = setTimeout(() => {
      setTyped((n) => {
        if (sound && n % 2 === 0 && picked) blip(BY_ID[picked].voice);
        return n + 1;
      });
    }, TYPE_MS);
    return () => clearTimeout(t);
  }, [typed, done, sound, quote, picked]);

  /** Arcade reel: cycles the roster and decelerates onto the winner. */
  const randomise = useCallback(() => {
    if (reeling) return;
    const target = ROSTER[Math.floor(Math.random() * ROSTER.length)].id;
    let i = Math.floor(Math.random() * ROSTER.length);
    let delay = 60;
    let step = 0;
    const spin = () => {
      i = (i + 1) % ROSTER.length;
      setReeling(ROSTER[i].id);
      if (sound) tick(step % 6);
      step++;
      delay *= 1.18;
      if (delay < 260) {
        setTimeout(spin, delay);
      } else {
        setReeling(null);
        play(target);
      }
    };
    spin();
  }, [reeling, sound, play]);

  const advance = useCallback(() => {
    if (!quote || !picked) return;
    // Mid-type, the first press finishes the line — arcade dialogue convention.
    if (!done) {
      setTyped(quote.text.length);
      if (sound) thunk();
      return;
    }
    play(picked, quote);
  }, [done, picked, quote, sound, play]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      if (document.activeElement instanceof HTMLButtonElement) return;
      if (!picked) return;
      e.preventDefault();
      advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, picked]);

  const copy = async () => {
    if (!quote || !character) return;
    try {
      await navigator.clipboard.writeText(
        `"${quote.text}" — ${character.name}`
      );
    } catch {
      // Clipboard permission can be denied or the document unfocused; stay quiet.
      return;
    }
    setCopied(true);
    if (sound) sting(character.voice);
    setTimeout(() => setCopied(false), 1600);
  };

  // The meter renders 20 blocks, so anything under 2.5% rounds away to an
  // empty bar that reads as broken — floor it at one lit block instead.
  const raw = Math.round((seen.size / QUOTES.length) * 100);
  const pct = seen.size === 0 ? 0 : Math.max(5, raw);

  if (!started) {
    return <IntroScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="flex h-full flex-col items-center px-10 py-6">
      <header className="mb-4 text-center">
        <p className="retro text-[9px] tracking-[0.3em] text-[#6f7bb0]">
          AFC RICHMOND PRESENTS
        </p>
        <h1 className="retro arcade-title mt-2 text-2xl leading-relaxed text-[#f2c50f]">
          BELIEVE <span className="text-[#f4ecd8]">ARCADE</span>
        </h1>
      </header>

      {!character || !quote ? (
        <CharacterSelect
          reeling={reeling}
          onPick={(id) => play(id)}
          onRandom={randomise}
        />
      ) : (
        <>
          <Stage character={character} quote={quote} typed={typed} />

          <div className="mt-5 w-[1100px]">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="retro text-[9px] tracking-widest text-[#f2c50f]">
                BELIEVE METER
              </span>
              <span className="retro text-[9px] text-[#7c88bd]">
                {seen.size}/{QUOTES.length} HEARD
              </span>
            </div>
            <Progress
              value={pct}
              variant="retro"
              progressBg="bg-[#f2c50f]"
              className="h-4 [&>[data-slot=progress]]:bg-[#141d3d]"
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6">
            <Button
              onClick={advance}
              className="h-12 bg-[#f2c50f] px-6 text-[11px] text-[#17120a] hover:bg-[#ffd733]"
            >
              {done ? "NEXT QUOTE" : "SKIP"}
            </Button>

            <Button
              onClick={randomise}
              variant="secondary"
              className="h-12 bg-[#7a2f9e] px-5 text-[10px] text-[#f4ecd8] hover:bg-[#9a44c4]"
            >
              <Shuffle className="size-4" />
              RANDOM
            </Button>

            <Button
              onClick={() => {
                setPicked(null);
                setQuote(null);
              }}
              variant="secondary"
              className="h-12 bg-[#1b3fa0] px-5 text-[10px] text-[#f4ecd8] hover:bg-[#2b58c8]"
            >
              <Users className="size-4" />
              ROSTER
            </Button>

            <Button
              onClick={copy}
              variant="secondary"
              className="h-12 bg-[#2f3849] px-5 text-[10px] text-[#f4ecd8] hover:bg-[#4a5568]"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "COPIED" : "COPY"}
            </Button>

            <Button
              onClick={() => {
                setSound((s) => !s);
                if (!sound && character) sting(character.voice);
              }}
              variant="secondary"
              aria-pressed={sound}
              className="h-12 bg-[#2f3849] px-5 text-[10px] text-[#f4ecd8] hover:bg-[#4a5568]"
            >
              {sound ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
              {sound ? "SOUND ON" : "SOUND OFF"}
            </Button>
          </div>

          <p className="retro mt-5 text-center text-[8px] leading-loose text-[#4c5680]">
            PRESS <Kbd className="bg-[#1a2342] text-[#f4ecd8]">SPACE</Kbd> FOR
            THE NEXT ONE
          </p>
        </>
      )}
    </div>
  );
}
