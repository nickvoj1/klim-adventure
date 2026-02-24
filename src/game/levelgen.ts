import { LevelData } from './types';
import { LEVELS } from './levels';

// Seeded random for reproducibility within a run
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const ground = (x: number, w: number) => ({ x, y: 368, w, h: 32 });
const plat = (x: number, y: number, w: number) => ({ x, y, w, h: 24 });

export function generateLevel(levelIndex: number): LevelData {
  const base = LEVELS[levelIndex];
  if (!base) return LEVELS[0];

  const seed = Date.now() + levelIndex * 7919;
  const rng = mulberry32(seed);

  // Extend width by 40-80%
  const extraWidth = Math.floor(base.width * (0.4 + rng() * 0.4));
  const newWidth = base.width + extraWidth;

  // Copy base elements
  const platforms = [...base.platforms.map(p => ({ ...p }))];
  const coins: { x: number; y: number }[] = [...base.coins.map(c => ({ ...c }))];
  const robots: { x: number; y: number; patrolRange: number }[] = [...base.robots.map(r => ({ ...r }))];
  const spikes: { x: number; y: number }[] = [...base.spikes.map(s => ({ ...s }))];
  const movingSpikes = [...(base.movingSpikes || []).map(ms => ({ ...ms }))];
  const bats = [...(base.bats || []).map(b => ({ ...b }))];
  const hearts: { x: number; y: number }[] = [...base.hearts.map(h => ({ ...h }))];

  // Generate extension section
  const extStart = base.width - 200;
  let cursor = extStart;

  while (cursor < newWidth - 300) {
    const segW = 150 + Math.floor(rng() * 250);
    const gap = 40 + Math.floor(rng() * 80);
    cursor += gap;

    // Ground segment
    const groundStart = cursor;
    const groundEnd = cursor + segW;
    platforms.push(ground(cursor, segW));

    // Maybe elevated platform
    if (rng() < 0.6) {
      const py = 140 + Math.floor(rng() * 160);
      const pw = 64 + Math.floor(rng() * 80);
      const px = cursor + Math.floor(rng() * (segW - pw));
      platforms.push(plat(px, py, pw));

      // Coins on platform
      if (rng() < 0.7) {
        coins.push({ x: px + 10, y: py - 28 });
        coins.push({ x: px + 40, y: py - 28 });
      }
    }

    // Ground coins
    if (rng() < 0.5) {
      const cx = cursor + 30 + Math.floor(rng() * (segW - 60));
      coins.push({ x: cx, y: 340 });
      coins.push({ x: cx + 30, y: 340 });
    }

    // Robot - ensure patrol range stays within ground segment
    if (rng() < 0.4) {
      const margin = 60;
      const rx = groundStart + margin + Math.floor(rng() * Math.max(1, segW - margin * 2));
      const pr = Math.min(60 + Math.floor(rng() * 60), Math.floor((segW - margin) / 2));
      robots.push({ x: rx, y: 344, patrolRange: pr });
    }

    // Spikes - MUST be within the ground segment boundaries
    if (rng() < 0.5) {
      const spikeMargin = 20;
      const maxSpikeX = groundEnd - 64 - spikeMargin;
      const minSpikeX = groundStart + spikeMargin;
      if (maxSpikeX > minSpikeX) {
        const sx = minSpikeX + Math.floor(rng() * (maxSpikeX - minSpikeX));
        spikes.push({ x: sx, y: 360 });
        if (rng() < 0.5 && sx + 32 < groundEnd - spikeMargin) {
          spikes.push({ x: sx + 32, y: 360 });
        }
      }
    }

    // Bat
    if (rng() < 0.35) {
      bats.push({
        x: cursor + Math.floor(rng() * segW),
        y: 80 + Math.floor(rng() * 100),
        patrolRange: 80 + Math.floor(rng() * 60),
        amplitude: 20 + Math.floor(rng() * 20),
        frequency: 0.025 + rng() * 0.02,
      });
    }

    // Moving spike - keep within ground segment
    if (rng() < 0.25) {
      const msMargin = 20;
      const msRange = 100 + Math.floor(rng() * 100);
      const msX = groundStart + msMargin + Math.floor(rng() * Math.max(1, segW - msRange - msMargin * 2));
      const msEndX = Math.min(msX + msRange, groundEnd - msMargin);
      if (msEndX > msX + 50) {
        movingSpikes.push({
          startX: msX, startY: 360,
          endX: msEndX, endY: 360,
          speed: 0.004 + rng() * 0.005,
        });
      }
    }

    cursor += segW;
  }

  // Final ground before flag
  platforms.push(ground(newWidth - 300, 300));

  // One heart in the extension
  if (rng() < 0.6) {
    hearts.push({ x: extStart + Math.floor(rng() * extraWidth * 0.5), y: 340 });
  }

  // Max one chest - pick random skin to display (actual drop is randomized by roulette)
  const chestX = extStart + 100 + Math.floor(rng() * (extraWidth - 400));
  // Find a platform near chestX to place it on
  let chestPlat = platforms.find(p => p.y < 300 && p.x <= chestX && p.x + p.w >= chestX + 32);
  const chests: { x: number; y: number; skinIndex: number }[] = [];
  if (chestPlat) {
    chests.push({ x: chestX, y: chestPlat.y - 28, skinIndex: 0 }); // skinIndex is ignored now
  } else {
    // Use first base chest or place on ground
    chests.push({ x: chestX, y: 340, skinIndex: 0 });
  }

  // Also randomize some positions in the base section
  for (const r of robots) {
    r.x += Math.floor((rng() - 0.5) * 40);
  }

  return {
    ...base,
    width: newWidth,
    platforms,
    coins,
    robots,
    spikes,
    movingSpikes,
    bats,
    chests,
    hearts,
    boss: base.boss,
    flagPos: { x: newWidth - 100, y: 320 },
  };
}
