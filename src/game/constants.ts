import { Skin, Achievement, GameProgress } from './types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const GRAVITY = 0.5;
export const JUMP_FORCE = -12;
export const WALK_SPEED = 3;
export const SPRINT_SPEED = 6;
export const TERMINAL_VELOCITY = 15;

export const SKINS: Skin[] = [
  { name: 'Classic Blue', bodyColor: '#4466ff', headColor: '#ffcc88', hairColor: '#553311', pantsColor: '#3333aa', premium: false, price: 0 },
  { name: 'Desert Scout', bodyColor: '#cc9944', headColor: '#ffcc88', hairColor: '#aa6622', pantsColor: '#886633', premium: false, price: 0 },
  { name: 'Jungle Runner', bodyColor: '#33aa44', headColor: '#ddbb88', hairColor: '#222200', pantsColor: '#225522', premium: false, price: 0 },
  { name: 'Island Surfer', bodyColor: '#44ccdd', headColor: '#ffddaa', hairColor: '#ffcc00', pantsColor: '#2288aa', premium: false, price: 0 },
  { name: 'Mountain Yeti', bodyColor: '#aabbcc', headColor: '#eeeeff', hairColor: '#ccddee', pantsColor: '#667788', premium: false, price: 0 },
  { name: 'Ice Walker', bodyColor: '#6688ee', headColor: '#ffeedd', hairColor: '#aaccff', pantsColor: '#4455aa', premium: false, price: 0 },
  { name: 'Volcano Dash', bodyColor: '#ee4422', headColor: '#ffcc88', hairColor: '#330000', pantsColor: '#aa2200', premium: false, price: 0 },
  { name: 'Shadow Ninja', bodyColor: '#333344', headColor: '#ddccbb', hairColor: '#111122', pantsColor: '#222233', premium: false, price: 0 },
  { name: 'Royal Guard', bodyColor: '#cc8800', headColor: '#ffcc88', hairColor: '#442200', pantsColor: '#884400', premium: false, price: 0 },
  { name: 'Pirate Cap', bodyColor: '#884422', headColor: '#ffcc88', hairColor: '#111111', pantsColor: '#553311', premium: false, price: 0 },
  { name: 'Robot Suit', bodyColor: '#888899', headColor: '#aabbcc', hairColor: '#666677', pantsColor: '#555566', premium: false, price: 0 },
  { name: 'Knight Armor', bodyColor: '#99aabb', headColor: '#ffcc88', hairColor: '#553322', pantsColor: '#778899', premium: false, price: 0 },
  { name: 'Wizard Robe', bodyColor: '#7744bb', headColor: '#ffcc88', hairColor: '#cccccc', pantsColor: '#553399', premium: false, price: 0 },
  { name: 'Chef Hat', bodyColor: '#ffffff', headColor: '#ffcc88', hairColor: '#553322', pantsColor: '#333333', premium: false, price: 0 },
  { name: 'Space Suit', bodyColor: '#ddddee', headColor: '#aaddff', hairColor: '#6688aa', pantsColor: '#aabbcc', premium: false, price: 0 },
  { name: 'Cowboy', bodyColor: '#aa7744', headColor: '#ffcc88', hairColor: '#553311', pantsColor: '#6644cc', premium: false, price: 0 },
  { name: 'Diver', bodyColor: '#2244aa', headColor: '#88ccff', hairColor: '#4466aa', pantsColor: '#113388', premium: false, price: 0 },
  { name: 'Skater', bodyColor: '#ff6644', headColor: '#ffcc88', hairColor: '#ff8800', pantsColor: '#444444', premium: false, price: 0 },
  { name: 'Farmer', bodyColor: '#55aa33', headColor: '#ffcc88', hairColor: '#886633', pantsColor: '#4477aa', premium: false, price: 0 },
  { name: 'Firefighter', bodyColor: '#dd3300', headColor: '#ffcc88', hairColor: '#222222', pantsColor: '#ccaa00', premium: false, price: 0 },
  { name: 'Pilot', bodyColor: '#334455', headColor: '#ffcc88', hairColor: '#222222', pantsColor: '#223344', premium: false, price: 0 },
  { name: 'Baker', bodyColor: '#eeddcc', headColor: '#ffcc88', hairColor: '#884422', pantsColor: '#ddccbb', premium: false, price: 0 },
  { name: 'Mechanic', bodyColor: '#556677', headColor: '#ffcc88', hairColor: '#333333', pantsColor: '#445566', premium: false, price: 0 },
  { name: 'Doctor', bodyColor: '#eeeeff', headColor: '#ffcc88', hairColor: '#333322', pantsColor: '#4488bb', premium: false, price: 0 },
  { name: 'Sailor', bodyColor: '#2255aa', headColor: '#ffcc88', hairColor: '#ffcc00', pantsColor: '#ffffff', premium: false, price: 0 },
  { name: 'Viking', bodyColor: '#886644', headColor: '#ffcc88', hairColor: '#cc8833', pantsColor: '#554433', premium: false, price: 0 },
  { name: 'Samurai', bodyColor: '#cc2222', headColor: '#ffddaa', hairColor: '#111111', pantsColor: '#222222', premium: false, price: 0 },
  { name: 'Clown', bodyColor: '#ff4488', headColor: '#ffffff', hairColor: '#ff0000', pantsColor: '#44cc44', premium: false, price: 0 },
  { name: 'Ghost', bodyColor: '#ccccdd', headColor: '#eeeeff', hairColor: '#bbbbcc', pantsColor: '#aaaabb', premium: false, price: 0 },
  { name: 'Alien', bodyColor: '#44cc44', headColor: '#66ee66', hairColor: '#228822', pantsColor: '#337733', premium: false, price: 0 },
  // Premium Meme Skins (30-39)
  { name: 'Skibidi Man', bodyColor: '#6644cc', headColor: '#aa88ff', hairColor: '#4422aa', pantsColor: '#3311aa', premium: true, price: 100 },
  { name: 'Ohio Explorer', bodyColor: '#cc2222', headColor: '#ffcc88', hairColor: '#111111', pantsColor: '#1a1a1a', premium: true, price: 100 },
  { name: 'Rizz Lord', bodyColor: '#ffaa00', headColor: '#ffddaa', hairColor: '#ff66aa', pantsColor: '#cc8800', premium: true, price: 250 },
  { name: 'Sigma Boss', bodyColor: '#222222', headColor: '#aaaaaa', hairColor: '#111111', pantsColor: '#333333', premium: true, price: 250 },
  { name: 'Grimace Shake', bodyColor: '#7722cc', headColor: '#9944ee', hairColor: '#6611bb', pantsColor: '#5500aa', premium: true, price: 500 },
  { name: 'Among Us', bodyColor: '#dd2222', headColor: '#88ccff', hairColor: '#dd2222', pantsColor: '#aa1111', premium: true, price: 500 },
  { name: 'Wednesday', bodyColor: '#111111', headColor: '#eeddcc', hairColor: '#000000', pantsColor: '#222222', premium: true, price: 750 },
  { name: 'Baby Gronk', bodyColor: '#33aa55', headColor: '#ffcc88', hairColor: '#ffcc00', pantsColor: '#228844', premium: true, price: 750 },
  { name: 'Nyan Runner', bodyColor: '#ff6699', headColor: '#ffaacc', hairColor: '#ffff00', pantsColor: '#6699ff', premium: true, price: 1000 },
  { name: 'Mog Master', bodyColor: '#116666', headColor: '#44aaaa', hairColor: '#004444', pantsColor: '#005555', premium: true, price: 1000 },
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
