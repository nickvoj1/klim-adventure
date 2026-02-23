export interface Player {
  x: number; y: number;
  vx: number; vy: number;
  w: number; h: number;
  onGround: boolean;
  canDoubleJump: boolean;
  crouching: boolean;
  facing: 'left' | 'right';
  frame: number;
  frameTimer: number;
  invincible: number;
}

export interface Robot {
  x: number; y: number;
  w: number; h: number;
  vx: number;
  patrolStart: number;
  patrolEnd: number;
  shootTimer: number;
  alive: boolean;
  frame: number;
}

export interface Bullet {
  x: number; y: number;
  vx: number;
  w: number; h: number;
}

export interface Coin {
  x: number; y: number;
  w: number; h: number;
  collected: boolean;
  bobOffset: number;
}

export interface Chest {
  x: number; y: number;
  w: number; h: number;
  opened: boolean;
  skinIndex: number;
}

export interface Spike {
  x: number; y: number;
  w: number; h: number;
}

export interface MovingSpike {
  x: number; y: number;
  w: number; h: number;
  startX: number; startY: number;
  endX: number; endY: number;
  speed: number;
  progress: number;
  direction: 1 | -1;
}

export interface Bat {
  x: number; y: number;
  w: number; h: number;
  baseY: number;
  vx: number;
  patrolStart: number;
  patrolEnd: number;
  alive: boolean;
  frame: number;
  amplitude: number;
  frequency: number;
}

export interface HeartPickup {
  x: number; y: number;
  w: number; h: number;
  collected: boolean;
}

export interface Flag {
  x: number; y: number;
  w: number; h: number;
}

export interface Platform {
  x: number; y: number;
  w: number; h: number;
}

export type SkinRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Skin {
  name: string;
  bodyColor: string;
  headColor: string;
  hairColor: string;
  pantsColor: string;
  premium: boolean;
  price: number;
  rarity: SkinRarity;
}

export interface LevelData {
  name: string;
  world: string;
  platforms: Platform[];
  coins: { x: number; y: number }[];
  robots: { x: number; y: number; patrolRange: number }[];
  spikes: { x: number; y: number }[];
  movingSpikes?: { startX: number; startY: number; endX: number; endY: number; speed: number }[];
  bats?: { x: number; y: number; patrolRange: number; amplitude?: number; frequency?: number }[];
  chests: { x: number; y: number; skinIndex: number }[];
  hearts: { x: number; y: number }[];
  playerSpawn: { x: number; y: number };
  flagPos: { x: number; y: number };
  width: number;
  skyColor: string;
  groundColor: string;
  platformColor: string;
}

export interface LevelStats {
  coinsCollected: number;
  totalCoins: number;
  timeTaken: number;
  robotsKilled: number;
  wasHit: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  rewardType: 'coins' | 'skin';
  rewardSkinIndex?: number;
  check: (progress: GameProgress) => boolean;
}

export type GameScreen = 'menu' | 'skins' | 'worldmap' | 'playing' | 'shop' | 'gameover' | 'achievements' | 'levelcomplete' | 'auth' | 'leaderboard';

export interface GameProgress {
  totalCoins: number;
  lives: number;
  currentLevel: number;
  unlockedLevels: number;
  unlockedSkins: boolean[];
  equippedSkin: number;
  dailyStreak: number;
  lastDailyReward: number;
  unlockedAchievements: string[];
  totalRobotsKilled: number;
  totalLevelsCompleted: number;
  totalChestsOpened: number;
  bestLevelTimes: Record<number, number>;
}
