import { Skin } from './types';

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
  // Premium skins (30-39)
  { name: 'Golden Hero', bodyColor: '#ffcc00', headColor: '#ffee88', hairColor: '#cc9900', pantsColor: '#ddaa00', premium: true, price: 100 },
  { name: 'Diamond Knight', bodyColor: '#88ddff', headColor: '#ccffff', hairColor: '#66aacc', pantsColor: '#5599bb', premium: true, price: 250 },
  { name: 'Flame Lord', bodyColor: '#ff4400', headColor: '#ffaa44', hairColor: '#ff6600', pantsColor: '#cc2200', premium: true, price: 500 },
  { name: 'Frost Mage', bodyColor: '#4488ff', headColor: '#aaddff', hairColor: '#88bbff', pantsColor: '#2266dd', premium: true, price: 750 },
  { name: 'Shadow King', bodyColor: '#220033', headColor: '#553366', hairColor: '#110022', pantsColor: '#110022', premium: true, price: 1000 },
  { name: 'Neon Runner', bodyColor: '#00ff88', headColor: '#88ffcc', hairColor: '#00cc66', pantsColor: '#009944', premium: true, price: 100 },
  { name: 'Cyber Punk', bodyColor: '#ff00ff', headColor: '#ffaaff', hairColor: '#cc00cc', pantsColor: '#880088', premium: true, price: 250 },
  { name: 'Pixel King', bodyColor: '#ff8800', headColor: '#ffcc88', hairColor: '#cc6600', pantsColor: '#aa4400', premium: true, price: 500 },
  { name: 'Star Walker', bodyColor: '#ffff44', headColor: '#ffffaa', hairColor: '#cccc00', pantsColor: '#aaaa00', premium: true, price: 750 },
  { name: 'Dark Matter', bodyColor: '#111122', headColor: '#333355', hairColor: '#000011', pantsColor: '#000011', premium: true, price: 1000 },
];

export const DEFAULT_PROGRESS = (): import('./types').GameProgress => ({
  totalCoins: 0,
  lives: 3,
  currentLevel: 0,
  unlockedLevels: 1,
  unlockedSkins: Array(40).fill(false).map((_, i) => i === 0),
  equippedSkin: 0,
});
