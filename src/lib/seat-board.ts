/** Stadium seat mosaic for the intro: blue stand, red seats spelling the title. */

export const COLS = 80;
export const ROWS = 48;
export const CELL = 4; // device pixels per seat, including the gap
export const SEAT = 3; // painted part of the cell

/** Vertical gangways and the walkway, matching the stand in the reference. */
export const AISLES = new Set([13, 26, 40, 53, 66]);
export const WALKWAY = new Set([24, 25]);

// A bold 7x9 face. The obvious move is to scale a thin 5x7 font up, but its
// one-pixel strokes get chewed apart by the seat gaps and the gangways cutting
// through them, and stop reading as letters at any size.
const GLYPHS: Record<string, string[]> = {
  T: ["1111111","1111111","0011100","0011100","0011100","0011100","0011100","0011100","0011100"],
  E: ["1111111","1111111","1100000","1111110","1111110","1100000","1100000","1111111","1111111"],
  D: ["1111110","1111111","1100011","1100011","1100011","1100011","1100011","1111111","1111110"],
  L: ["1100000","1100000","1100000","1100000","1100000","1100000","1100000","1111111","1111111"],
  A: ["0111110","1111111","1100011","1100011","1111111","1111111","1100011","1100011","1100011"],
  S: ["0111111","1111111","1100000","1111110","0111111","0000011","0000011","1111111","1111110"],
  O: ["0111110","1111111","1100011","1100011","1100011","1100011","1100011","1111111","0111110"],
};

const GW = 7;
const GH = 9;
const SCALE = 2; // 7x9 glyph -> 14x18 seats, four-seat strokes
const GLYPH_W = GW * SCALE;
const GAP = 1;

function word(text: string, top: number, grid: boolean[][]) {
  const width = text.length * GLYPH_W + (text.length - 1) * GAP;
  const left = Math.round((COLS - width) / 2);
  text.split("").forEach((ch, i) => {
    const g = GLYPHS[ch];
    const ox = left + i * (GLYPH_W + GAP);
    for (let gy = 0; gy < GH; gy++)
      for (let gx = 0; gx < GW; gx++) {
        if (g[gy][gx] !== "1") continue;
        for (let sy = 0; sy < SCALE; sy++)
          for (let sx = 0; sx < SCALE; sx++)
            grid[top + gy * SCALE + sy][ox + gx * SCALE + sx] = true;
      }
  });
}

/** true where a seat should end up red. */
export function buildMask() {
  const grid: boolean[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  );
  word("TED", 4, grid);
  word("LASSO", 27, grid);
  return grid;
}

export function isSeat(col: number, row: number) {
  return !AISLES.has(col) && !WALKWAY.has(row);
}
