import { LevelData } from './types';

// Helper to create ground segments
const ground = (x: number, w: number) => ({ x, y: 368, w, h: 32 });
const plat = (x: number, y: number, w: number) => ({ x, y, w, h: 24 });

export const LEVELS: LevelData[] = [
  // Level 1 - Desert Beginnings (Easy)
  {
    name: 'Desert Beginnings',
    world: 'Desert',
    width: 2400,
    skyColor: '#1a1a3a',
    groundColor: '#b8863a',
    platformColor: '#9a7030',
    platforms: [
      ground(0, 600),
      ground(660, 400),
      ground(1120, 500),
      ground(1680, 720),
      // Elevated platforms
      plat(280, 280, 120),
      plat(500, 220, 96),
      plat(800, 260, 128),
      plat(1000, 300, 80),
      plat(1300, 240, 120),
      plat(1500, 200, 96),
      plat(1800, 260, 128),
      plat(2050, 300, 96),
    ],
    coins: [
      // Ground coins
      { x: 150, y: 340 }, { x: 180, y: 340 }, { x: 210, y: 340 },
      { x: 700, y: 340 }, { x: 730, y: 340 },
      { x: 1200, y: 340 }, { x: 1230, y: 340 }, { x: 1260, y: 340 },
      { x: 1750, y: 340 }, { x: 1780, y: 340 },
      // Platform coins
      { x: 310, y: 252 }, { x: 340, y: 252 },
      { x: 530, y: 192 }, { x: 560, y: 192 },
      { x: 840, y: 232 }, { x: 870, y: 232 },
      { x: 1340, y: 212 }, { x: 1370, y: 212 },
      { x: 1530, y: 172 }, { x: 1560, y: 172 },
      // Bonus coins high up
      { x: 420, y: 160 }, { x: 1100, y: 160 },
    ],
    robots: [
      { x: 400, y: 344, patrolRange: 100 },
      { x: 1400, y: 344, patrolRange: 120 },
    ],
    spikes: [],
    chests: [
      { x: 1520, y: 168, skinIndex: 1 },
    ],
    hearts: [
      { x: 850, y: 232 },
    ],
    playerSpawn: { x: 60, y: 300 },
    flagPos: { x: 2300, y: 320 },
  },
  // Level 2 - Desert Ruins (Medium)
  {
    name: 'Desert Ruins',
    world: 'Desert',
    width: 2800,
    skyColor: '#1a1a3a',
    groundColor: '#b8863a',
    platformColor: '#9a7030',
    platforms: [
      ground(0, 400),
      ground(480, 300),
      ground(860, 250),
      ground(1200, 350),
      ground(1650, 200),
      ground(1950, 300),
      ground(2350, 450),
      // Elevated platforms
      plat(200, 280, 96),
      plat(420, 220, 80),
      plat(600, 260, 96),
      plat(750, 200, 80),
      plat(950, 280, 96),
      plat(1100, 180, 80),
      plat(1300, 240, 120),
      plat(1500, 300, 80),
      plat(1700, 200, 96),
      plat(1850, 150, 80),
      plat(2100, 260, 96),
      plat(2250, 200, 80),
      // Hidden platform for chest
      plat(1080, 100, 64),
    ],
    coins: [
      { x: 100, y: 340 }, { x: 130, y: 340 }, { x: 160, y: 340 },
      { x: 520, y: 340 }, { x: 550, y: 340 }, { x: 580, y: 340 },
      { x: 900, y: 340 }, { x: 930, y: 340 },
      { x: 1250, y: 340 }, { x: 1280, y: 340 }, { x: 1310, y: 340 },
      { x: 1700, y: 340 }, { x: 1730, y: 340 },
      { x: 2000, y: 340 }, { x: 2030, y: 340 }, { x: 2060, y: 340 },
      { x: 2400, y: 340 }, { x: 2430, y: 340 }, { x: 2460, y: 340 },
      // Platform coins
      { x: 230, y: 252 }, { x: 260, y: 252 },
      { x: 440, y: 192 }, { x: 470, y: 192 },
      { x: 630, y: 232 }, { x: 660, y: 232 },
      { x: 770, y: 172 }, { x: 800, y: 172 },
      { x: 1130, y: 152 }, { x: 1160, y: 152 },
      { x: 1730, y: 172 }, { x: 1760, y: 172 },
      { x: 1870, y: 122 }, { x: 1900, y: 122 },
      { x: 2280, y: 172 },
    ],
    robots: [
      { x: 300, y: 344, patrolRange: 80 },
      { x: 1000, y: 344, patrolRange: 100 },
      { x: 2100, y: 344, patrolRange: 120 },
    ],
    spikes: [
      { x: 430, y: 360 }, { x: 462, y: 360 },
      { x: 810, y: 360 }, { x: 842, y: 360 },
      { x: 1160, y: 360 }, { x: 1192, y: 360 },
      { x: 1600, y: 360 },
      { x: 1900, y: 360 }, { x: 1932, y: 360 },
    ],
    chests: [
      { x: 1096, y: 68, skinIndex: 2 },
    ],
    hearts: [
      { x: 770, y: 172 },
      { x: 2110, y: 232 },
    ],
    playerSpawn: { x: 60, y: 300 },
    flagPos: { x: 2700, y: 320 },
  },
];

// World map data for all 30 levels (only 2 playable in MVP)
export const WORLD_MAP = [
  { name: 'Desert', levels: [1,2,3,4,5], color: '#b8863a' },
  { name: 'Jungle', levels: [6,7,8,9,10], color: '#3a8830' },
  { name: 'Islands', levels: [11,12,13,14,15], color: '#3388bb' },
  { name: 'Mountains', levels: [16,17,18,19,20], color: '#888899' },
  { name: 'Ice', levels: [21,22,23,24,25], color: '#88bbee' },
  { name: 'Volcano', levels: [26,27,28,29,30], color: '#cc3322' },
];
