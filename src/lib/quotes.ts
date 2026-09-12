import type { CharacterId } from "@/lib/roster";

export type Theme = "BELIEF" | "CURIOSITY" | "TEAM" | "GRIT" | "HEART" | "WIT";

export type Quote = {
  by: CharacterId;
  text: string;
  theme: Theme;
};

/** Written out in full so Tailwind can see them — these are picked at runtime. */
export const THEME_BADGE: Record<Theme, string> = {
  BELIEF: "bg-[#f2c50f] border-[#f2c50f] text-[#17120a]",
  CURIOSITY: "bg-[#4ec9e0] border-[#4ec9e0] text-[#04171c]",
  TEAM: "bg-[#5ad469] border-[#5ad469] text-[#05190a]",
  GRIT: "bg-[#ff7a3d] border-[#ff7a3d] text-[#1f0c03]",
  HEART: "bg-[#ff6b9d] border-[#ff6b9d] text-[#1f0510]",
  WIT: "bg-[#c08bff] border-[#c08bff] text-[#14051f]",
};

export const THEME_COLOR: Record<Theme, string> = {
  BELIEF: "#f2c50f",
  CURIOSITY: "#4ec9e0",
  TEAM: "#5ad469",
  GRIT: "#ff7a3d",
  HEART: "#ff6b9d",
  WIT: "#c08bff",
};

export const QUOTES: Quote[] = [
  // ── Ted Lasso ──────────────────────────────────────────────────
  { by: "ted", theme: "BELIEF", text: "I believe in hope. I believe in belief." },
  { by: "ted", theme: "CURIOSITY", text: "Be curious, not judgmental." },
  {
    by: "ted",
    theme: "TEAM",
    text: "For me, success is not about the wins and losses. It's about helping these young fellas be the best versions of themselves on and off the pitch.",
  },
  {
    by: "ted",
    theme: "GRIT",
    text: "You know what the happiest animal on Earth is? It's a goldfish. Be a goldfish.",
  },
  {
    by: "ted",
    theme: "BELIEF",
    text: "It's the hope that kills you... I disagree. It's the lack of hope that comes and gets you.",
  },
  {
    by: "ted",
    theme: "HEART",
    text: "I hope that either all of us or none of us are judged by the actions of our weakest moments, but rather by the strength we show when and if we're ever given a second chance.",
  },
  {
    by: "ted",
    theme: "HEART",
    text: "There is something worse than being sad, and that's being alone and being sad.",
  },
  {
    by: "ted",
    theme: "GRIT",
    text: "Taking on a challenge is a lot like riding a horse. If you're comfortable while you're doing it, you're probably doing it wrong.",
  },
  { by: "ted", theme: "HEART", text: "Doing the right thing is never the wrong thing." },
  {
    by: "ted",
    theme: "TEAM",
    text: "Our goal is to go out there and give them hell, but also have a hell of a good time doing it.",
  },
  {
    by: "ted",
    theme: "GRIT",
    text: "Sometimes the hardest part of moving forward is letting go of the things you thought you needed.",
  },
  {
    by: "ted",
    theme: "GRIT",
    text: "As the man says, success is not final, failure is not fatal: it is the courage to continue that counts.",
  },
  {
    by: "ted",
    theme: "WIT",
    text: "You know my philosophy with cats, babies, and apologies: you gotta let them come to you.",
  },
  {
    by: "ted",
    theme: "WIT",
    text: "Do I believe in ghosts? I do, but more importantly I think they need to believe in themselves.",
  },
  { by: "ted", theme: "CURIOSITY", text: "All people are different people." },
  {
    by: "ted",
    theme: "HEART",
    text: "And in the end what's more important, being right or being kind?",
  },
  {
    by: "ted",
    theme: "BELIEF",
    text: "Fairytales do not start, nor do they end, in the dark forest.",
  },
  { by: "ted", theme: "WIT", text: "It's an inside joke, mostly inside of him." },
  {
    by: "ted",
    theme: "WIT",
    text: "Boy, I love meeting people's moms. It's like reading an instruction manual as to why they're nuts.",
  },

  // ── Roy Kent ───────────────────────────────────────────────────
  {
    by: "roy",
    theme: "HEART",
    text: "You deserve someone who makes you feel like you've been struck by lightning. Don't you dare settle for fine.",
  },
  { by: "roy", theme: "HEART", text: "You are, and always will be, Keeley f*cking Jones." },
  {
    by: "roy",
    theme: "TEAM",
    text: "You can't worry about what people say in the papers. They don't know what happens in this locker room.",
  },

  // ── Dr. Sharon Fieldstone ──────────────────────────────────────
  {
    by: "sharon",
    theme: "CURIOSITY",
    text: "The truth will set you free, but first it will piss you off.",
  },
  {
    by: "sharon",
    theme: "HEART",
    text: "A human being cannot fully love until they are fully seen.",
  },
  {
    by: "sharon",
    theme: "GRIT",
    text: "We all have our demons, but the important thing is that we don't let them drive the bus.",
  },

  // ── Leslie Higgins ─────────────────────────────────────────────
  {
    by: "higgins",
    theme: "HEART",
    text: "I try to love my dad for who he is and forgive him for who he isn't.",
  },
  {
    by: "higgins",
    theme: "TEAM",
    text: "A good mentor hopes you move on. A great mentor knows you will.",
  },
  { by: "higgins", theme: "CURIOSITY", text: "I suppose the best brand is being yourself." },
  {
    by: "higgins",
    theme: "WIT",
    text: "I do believe in second chances; that's why I am still married, and all my sons are alive.",
  },
  {
    by: "higgins",
    theme: "TEAM",
    text: "A great leader doesn't just call the plays; they make sure everyone feels like they belong on the field.",
  },
  {
    by: "higgins",
    theme: "HEART",
    text: "...to the family we're born with and to the one we make along the way.",
  },
  {
    by: "higgins",
    theme: "HEART",
    text: "With the right person, even the hard times seem easy.",
  },

  // ── Rebecca Welton ─────────────────────────────────────────────
  { by: "rebecca", theme: "GRIT", text: "Every disadvantage has its advantage." },
  {
    by: "rebecca",
    theme: "HEART",
    text: "I thought being invulnerable would protect me, so I pushed people away for years, leading me directly to my greatest fear: being alone. Big whoop.",
  },
  {
    by: "rebecca",
    theme: "GRIT",
    text: "I learned a long time ago that you can't control what happens to you, only how you respond to it.",
  },

  // ── Sam Obisanya ───────────────────────────────────────────────
  {
    by: "sam",
    theme: "HEART",
    text: "I know we can't fix every ache inside of us. But I shouldn't have to pretend it's not there, either.",
  },
  {
    by: "sam",
    theme: "WIT",
    text: "There's something I should warn you of: I'm only going to get more wonderful.",
  },
  {
    by: "sam",
    theme: "GRIT",
    text: "The only way to truly fail is to give up on trying to get better.",
  },

  // ── Coach Beard ────────────────────────────────────────────────
  {
    by: "beard",
    theme: "CURIOSITY",
    text: "Change isn't about trying to be perfect. Perfection sucks.",
  },
  {
    by: "beard",
    theme: "CURIOSITY",
    text: "Most of the time, the change you're looking for is right there in the mirror.",
  },
  {
    by: "beard",
    theme: "GRIT",
    text: "It's a long season, fellas. You can't let one bad day define who you are.",
  },
  {
    by: "beard",
    theme: "GRIT",
    text: "If you're not willing to adapt, you're just waiting to get left behind.",
  },

  // ── Dani Rojas ─────────────────────────────────────────────────
  {
    by: "dani",
    theme: "BELIEF",
    text: "To believe in yourself when no one else does is the most important thing.",
  },
  { by: "dani", theme: "BELIEF", text: "Football is life!" },

  // ── Keeley Jones ───────────────────────────────────────────────
  {
    by: "keeley",
    theme: "BELIEF",
    text: "Please do not focus on where you are right now. Focus on where you are going.",
  },
  { by: "keeley", theme: "WIT", text: "Funerals are a party, but for sad people." },
  {
    by: "keeley",
    theme: "BELIEF",
    text: "Sometimes you just have to trust that the universe has a plan, even when it feels like everything is falling apart.",
  },
];

export const QUOTES_BY: Record<string, Quote[]> = QUOTES.reduce(
  (acc, q) => {
    (acc[q.by] ??= []).push(q);
    return acc;
  },
  {} as Record<string, Quote[]>
);
