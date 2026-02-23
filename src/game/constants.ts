import { Skin, SkinRarity, Achievement, GameProgress } from './types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const GRAVITY = 0.5;
export const JUMP_FORCE = -12;
export const WALK_SPEED = 3;
export const SPRINT_SPEED = 6;
export const TERMINAL_VELOCITY = 15;

export const RARITY_COLORS: Record<SkinRarity, string> = {
  common: '#aaaaaa',
  uncommon: '#44bb44',
  rare: '#4488ff',
  epic: '#aa44ee',
  legendary: '#ffaa00',
};

export const RARITY_WEIGHTS: Record<SkinRarity, number> = {
  common: 50,
  uncommon: 25,
  rare: 15,
  epic: 7,
  legendary: 3,
};

export const RARITY_DUPE_COINS: Record<SkinRarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 30,
  epic: 75,
  legendary: 150,
};

export const SKINS: Skin[] = [
  // Common (0-9)
  { name: 'Classic Blue', bodyColor: '#3355dd', headColor: '#ffcc88', hairColor: '#442200', pantsColor: '#2244aa', premium: false, price: 0, rarity: 'common' },
  { name: 'Desert Scout', bodyColor: '#ccaa55', headColor: '#e8c080', hairColor: '#aa6622', pantsColor: '#997744', premium: false, price: 0, rarity: 'common' },
  { name: 'Jungle Runner', bodyColor: '#227733', headColor: '#c8a870', hairColor: '#1a1a00', pantsColor: '#1a4422', premium: false, price: 0, rarity: 'common' },
  { name: 'Island Surfer', bodyColor: '#33bbcc', headColor: '#ffddaa', hairColor: '#eebb00', pantsColor: '#ff6644', premium: false, price: 0, rarity: 'common' },
  { name: 'Mountain Yeti', bodyColor: '#ccddee', headColor: '#eeeeff', hairColor: '#ffffff', pantsColor: '#aabbcc', premium: false, price: 0, rarity: 'common' },
  { name: 'Ice Walker', bodyColor: '#88bbee', headColor: '#ddeeff', hairColor: '#aaddff', pantsColor: '#5577bb', premium: false, price: 0, rarity: 'common' },
  { name: 'Volcano Dash', bodyColor: '#cc3300', headColor: '#ffaa66', hairColor: '#ff4400', pantsColor: '#882200', premium: false, price: 0, rarity: 'common' },
  { name: 'Shadow Ninja', bodyColor: '#1a1a2e', headColor: '#ccbbaa', hairColor: '#0a0a15', pantsColor: '#111122', premium: false, price: 0, rarity: 'common' },
  { name: 'Royal Guard', bodyColor: '#bb2222', headColor: '#ffcc88', hairColor: '#332200', pantsColor: '#eebb00', premium: false, price: 0, rarity: 'common' },
  { name: 'Pirate Cap', bodyColor: '#774422', headColor: '#e8bb77', hairColor: '#111111', pantsColor: '#443322', premium: false, price: 0, rarity: 'common' },
  // Uncommon (10-19)
  { name: 'Robot Suit', bodyColor: '#99aabb', headColor: '#bbccdd', hairColor: '#778899', pantsColor: '#667788', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Knight Armor', bodyColor: '#8899aa', headColor: '#ffcc88', hairColor: '#442211', pantsColor: '#667788', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Wizard Robe', bodyColor: '#6633aa', headColor: '#eeddcc', hairColor: '#bbbbbb', pantsColor: '#442288', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Chef Hat', bodyColor: '#ffffff', headColor: '#ffcc88', hairColor: '#443322', pantsColor: '#222222', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Space Suit', bodyColor: '#eeeeee', headColor: '#aaddff', hairColor: '#556677', pantsColor: '#cccccc', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Cowboy', bodyColor: '#996633', headColor: '#e8bb77', hairColor: '#443311', pantsColor: '#5544aa', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Diver', bodyColor: '#1133aa', headColor: '#88ccff', hairColor: '#335588', pantsColor: '#0a2277', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Skater', bodyColor: '#ff5533', headColor: '#ffcc88', hairColor: '#ff7700', pantsColor: '#333333', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Farmer', bodyColor: '#ddaa44', headColor: '#e8bb77', hairColor: '#775522', pantsColor: '#4477cc', premium: false, price: 0, rarity: 'uncommon' },
  { name: 'Firefighter', bodyColor: '#dd2200', headColor: '#ffcc88', hairColor: '#222222', pantsColor: '#dd2200', premium: false, price: 0, rarity: 'uncommon' },
  // Rare (20-29)
  { name: 'Pilot', bodyColor: '#223344', headColor: '#ffcc88', hairColor: '#222222', pantsColor: '#1a2a3a', premium: false, price: 0, rarity: 'rare' },
  { name: 'Baker', bodyColor: '#eecc99', headColor: '#ffcc88', hairColor: '#773311', pantsColor: '#ddbb88', premium: false, price: 0, rarity: 'rare' },
  { name: 'Mechanic', bodyColor: '#445566', headColor: '#ddbb99', hairColor: '#222222', pantsColor: '#334455', premium: false, price: 0, rarity: 'rare' },
  { name: 'Doctor', bodyColor: '#ffffff', headColor: '#ffcc88', hairColor: '#332211', pantsColor: '#3388bb', premium: false, price: 0, rarity: 'rare' },
  { name: 'Sailor', bodyColor: '#1144aa', headColor: '#ffcc88', hairColor: '#eebb00', pantsColor: '#ffffff', premium: false, price: 0, rarity: 'rare' },
  { name: 'Viking', bodyColor: '#886644', headColor: '#e8bb77', hairColor: '#cc7722', pantsColor: '#554433', premium: false, price: 0, rarity: 'rare' },
  { name: 'Samurai', bodyColor: '#bb1111', headColor: '#eeddaa', hairColor: '#0a0a0a', pantsColor: '#1a1a1a', premium: false, price: 0, rarity: 'rare' },
  { name: 'Clown', bodyColor: '#ff3377', headColor: '#ffffff', hairColor: '#ff0000', pantsColor: '#33cc33', premium: false, price: 0, rarity: 'rare' },
  { name: 'Ghost', bodyColor: '#ccccee', headColor: '#eeeeff', hairColor: '#ddddef', pantsColor: '#bbbbdd', premium: false, price: 0, rarity: 'rare' },
  { name: 'Alien', bodyColor: '#33bb33', headColor: '#55ee55', hairColor: '#117711', pantsColor: '#226622', premium: false, price: 0, rarity: 'rare' },
  // Epic (30-37)
  { name: 'Skibidi Man', bodyColor: '#5533bb', headColor: '#9977ee', hairColor: '#3311aa', pantsColor: '#2200aa', premium: true, price: 100, rarity: 'epic' },
  { name: 'Ohio Explorer', bodyColor: '#cc2222', headColor: '#e8bb77', hairColor: '#111111', pantsColor: '#1a1a1a', premium: true, price: 100, rarity: 'epic' },
  { name: 'Rizz Lord', bodyColor: '#ffaa00', headColor: '#ffddaa', hairColor: '#ff55aa', pantsColor: '#cc8800', premium: true, price: 250, rarity: 'epic' },
  { name: 'Sigma Boss', bodyColor: '#111111', headColor: '#888888', hairColor: '#0a0a0a', pantsColor: '#222222', premium: true, price: 250, rarity: 'epic' },
  { name: 'Grimace Shake', bodyColor: '#7722cc', headColor: '#9944ee', hairColor: '#5511aa', pantsColor: '#4400aa', premium: true, price: 500, rarity: 'epic' },
  { name: 'Among Us', bodyColor: '#dd2222', headColor: '#88ccff', hairColor: '#dd2222', pantsColor: '#aa1111', premium: true, price: 500, rarity: 'epic' },
  { name: 'Wednesday', bodyColor: '#0a0a0a', headColor: '#eeddcc', hairColor: '#000000', pantsColor: '#111111', premium: true, price: 750, rarity: 'epic' },
  { name: 'Baby Gronk', bodyColor: '#228844', headColor: '#ffcc88', hairColor: '#eebb00', pantsColor: '#116633', premium: true, price: 750, rarity: 'epic' },
  // Legendary (38-39)
  { name: 'Nyan Runner', bodyColor: '#ff6699', headColor: '#ffaacc', hairColor: '#ffee00', pantsColor: '#6699ff', premium: true, price: 1000, rarity: 'legendary' },
  { name: 'Mog Master', bodyColor: '#0a4444', headColor: '#33aaaa', hairColor: '#003333', pantsColor: '#004444', premium: true, price: 1000, rarity: 'legendary' },
];

export const DAILY_REWARDS = [10, 25, 50, 75, 100, 150, 200];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps', name: 'First Steps', description: 'Complete Level 1',
    icon: '👟', reward: 10, rewardType: 'coins',
    check: (p) => p.totalLevelsCompleted >= 1,
  },
  {
    id: 'coin_collector', name: 'Coin Collector', description: 'Collect 100 total coins',
    icon: '🪙', reward: 25, rewardType: 'coins',
    check: (p) => p.totalCoins >= 100,
  },
  {
    id: 'skin_collector', name: 'Skin Collector', description: 'Unlock 5 skins',
    icon: '🎨', reward: 50, rewardType: 'coins',
    check: (p) => p.unlockedSkins.filter(Boolean).length >= 5,
  },
  {
    id: 'speed_runner', name: 'Speed Runner', description: 'Complete a level in under 60s',
    icon: '⚡', reward: 50, rewardType: 'coins',
    check: (p) => Object.values(p.bestLevelTimes).some(t => t < 60),
  },
  {
    id: 'robot_slayer', name: 'Robot Slayer', description: 'Defeat 10 robots total',
    icon: '🤖', reward: 75, rewardType: 'coins',
    check: (p) => p.totalRobotsKilled >= 10,
  },
  {
    id: 'rich_kid', name: 'Rich Kid', description: 'Have 500 coins at once',
    icon: '💰', reward: 100, rewardType: 'coins',
    check: (p) => p.totalCoins >= 500,
  },
  {
    id: 'explorer', name: 'Explorer', description: 'Open 5 chests',
    icon: '📦', reward: 100, rewardType: 'coins',
    check: (p) => p.totalChestsOpened >= 5,
  },
  {
    id: 'world_traveler', name: 'World Traveler', description: 'Complete 10 levels',
    icon: '🌍', reward: 200, rewardType: 'coins',
    check: (p) => p.totalLevelsCompleted >= 10,
  },
];

export const DEFAULT_PROGRESS = (): import('./types').GameProgress => ({
  totalCoins: 0,
  lives: 3,
  currentLevel: 0,
  unlockedLevels: 1,
  unlockedSkins: Array(40).fill(false).map((_, i) => i === 0),
  equippedSkin: 0,
  dailyStreak: 0,
  lastDailyReward: 0,
  unlockedAchievements: [],
  totalRobotsKilled: 0,
  totalLevelsCompleted: 0,
  totalChestsOpened: 0,
  bestLevelTimes: {},
});
