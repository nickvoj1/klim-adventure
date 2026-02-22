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

export interface Skin {
  name: string;
  bodyColor: string;
  headColor: string;
  hairColor: string;
  pantsColor: string;
  premium: boolean;
  price: number;
}

export interface LevelData {
  name: string;
  world: string;
  platforms: Platform[];
  coins: { x: number; y: number }[];
  robots: { x: number; y: number; patrolRange: number }[];
  spikes: { x: number; y: number }[];
  chests: { x: number; y: number; skinIndex: number }[];
  hearts: { x: number; y: number }[];
  playerSpawn: { x: number; y: number };
  flagPos: { x: number; y: number };
  width: number;
  skyColor: string;
  groundColor: string;
  platformColor: string;
}

export type GameScreen = 'menu' | 'skins' | 'worldmap' | 'playing' | 'shop' | 'gameover';

export interface GameProgress {
  totalCoins: number;
  lives: number;
  currentLevel: number;
  unlockedLevels: number;
  unlockedSkins: boolean[];
  equippedSkin: number;
}
