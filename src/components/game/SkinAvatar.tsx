import React from 'react';
import { Skin, SkinRarity } from '@/game/types';
import { RARITY_COLORS } from '@/game/constants';

interface SkinAvatarProps {
  skin: Skin;
  size?: number;
  dimmed?: boolean;
  animated?: boolean;
}

// Unique accessories/features per skin name
const SKIN_EXTRAS: Record<string, (scale: number) => React.ReactNode> = {
  // ===== COMMON =====
  'Classic Blue': () => (
    <>
      {/* Backpack */}
      <rect x="18" y="14" width="4" height="6" rx="1" fill="#2244aa" />
      <rect x="19" y="15" width="2" height="1" fill="#6688cc" />
      {/* Wristwatch */}
      <rect x="0" y="19" width="4" height="2" fill="#cccccc" />
      <rect x="1" y="19" width="2" height="2" fill="#88ccff" />
    </>
  ),
  'Desert Scout': () => (
    <>
      {/* Turban */}
      <rect x="3" y="-2" width="16" height="5" fill="#eedd88" />
      <rect x="5" y="-3" width="12" height="2" fill="#ddcc77" />
      <rect x="10" y="-2" width="3" height="3" fill="#ffffff" opacity="0.3" />
      {/* Scarf blowing */}
      <rect x="17" y="3" width="6" height="2" fill="#eedd88" />
      <rect x="20" y="4" width="4" height="2" fill="#eedd88" opacity="0.7" />
      {/* Compass */}
      <circle cx="-2" cy="18" r="2" fill="#886633" />
      <circle cx="-2" cy="18" r="1.2" fill="#ffeecc" />
      <rect x="-2.3" y="16.5" width="0.6" height="1.5" fill="#cc2222" />
    </>
  ),
  'Jungle Runner': () => (
    <>
      {/* Leaf crown */}
      <polygon points="6,-2 4,-5 8,-1" fill="#33cc33" />
      <polygon points="10,-2 9,-6 12,-1" fill="#22aa22" />
      <polygon points="14,-2 13,-5 16,-1" fill="#33cc33" />
      <polygon points="17,-1 16,-4 19,0" fill="#22aa22" />
      {/* Vine on arm */}
      <rect x="-1" y="14" width="1" height="8" fill="#228822" />
      <circle cx="-1" cy="15" r="1" fill="#33cc33" />
      <circle cx="0" cy="18" r="0.8" fill="#33cc33" />
      {/* Tribal paint */}
      <rect x="6" y="9" width="2" height="1" fill="#cc4422" opacity="0.7" />
      <rect x="14" y="9" width="2" height="1" fill="#cc4422" opacity="0.7" />
    </>
  ),
  'Island Surfer': () => (
    <>
      {/* Flower lei */}
      <circle cx="6" cy="13" r="1.5" fill="#ff6699" />
      <circle cx="9" cy="12.5" r="1.5" fill="#ffcc44" />
      <circle cx="12" cy="12.5" r="1.5" fill="#ff6699" />
      <circle cx="15" cy="13" r="1.5" fill="#ffcc44" />
      {/* Surfboard on back */}
      <rect x="20" y="6" width="2" height="22" rx="1" fill="#ff8844" />
      <rect x="20" y="6" width="2" height="4" fill="#ffcc44" />
      <rect x="20" y="24" width="2" height="3" fill="#44ccdd" />
      {/* Sunglasses */}
      <rect x="6" y="7" width="4" height="2" fill="#111111" />
      <rect x="12" y="7" width="4" height="2" fill="#111111" />
      <rect x="10" y="7.5" width="2" height="1" fill="#111111" />
    </>
  ),
  'Mountain Yeti': () => (
    <>
      {/* Fur tufts */}
      <rect x="0" y="13" width="3" height="2" fill="#ddeeff" opacity="0.6" />
      <rect x="19" y="13" width="3" height="2" fill="#ddeeff" opacity="0.6" />
      <rect x="2" y="0" width="3" height="3" fill="#ddeeff" opacity="0.5" />
      <rect x="17" y="0" width="3" height="3" fill="#ddeeff" opacity="0.5" />
      {/* Icicle beard */}
      <polygon points="7,12 6,16 8,12" fill="#aaddff" opacity="0.7" />
      <polygon points="10,12 9,17 11,12" fill="#88ccff" opacity="0.7" />
      <polygon points="13,12 12,15 14,12" fill="#aaddff" opacity="0.7" />
      {/* Snowflakes */}
      <rect x="-3" y="5" width="2" height="2" fill="#ffffff" opacity="0.5" />
      <rect x="23" cy="10" width="2" height="2" fill="#ffffff" opacity="0.4" />
    </>
  ),
  'Ice Walker': () => (
    <>
      {/* Ice crystals on shoulders */}
      <polygon points="0,14 -3,12 0,10" fill="#aaddff" opacity="0.7" />
      <polygon points="22,14 25,12 22,10" fill="#aaddff" opacity="0.7" />
      {/* Frost breath */}
      <circle cx="18" cy="10" r="1" fill="#cceeFF" opacity="0.3" />
      <circle cx="20" cy="9" r="1.5" fill="#cceeFF" opacity="0.2" />
      <circle cx="23" cy="8" r="1" fill="#cceeFF" opacity="0.15" />
      {/* Earmuffs */}
      <rect x="2" y="5" width="3" height="3" rx="1" fill="#4466cc" />
      <rect x="17" y="5" width="3" height="3" rx="1" fill="#4466cc" />
      <rect x="5" y="3" width="12" height="1.5" fill="#4466cc" />
    </>
  ),
  'Volcano Dash': () => (
    <>
      {/* Fire hair */}
      <polygon points="6,-1 4,-6 9,-1" fill="#ff4400" />
      <polygon points="9,-1 8,-7 12,-1" fill="#ff6600" />
      <polygon points="12,-1 11,-8 14,-1" fill="#ffaa00" />
      <polygon points="14,-1 13,-6 17,-1" fill="#ff4400" />
      {/* Ember particles */}
      <circle cx="-2" cy="8" r="1" fill="#ff6600" opacity="0.6" />
      <circle cx="24" cy="5" r="0.8" fill="#ffaa00" opacity="0.5" />
      <circle cx="6" cy="-5" r="0.6" fill="#ffcc00" opacity="0.7" />
      {/* Lava cracks on body */}
      <rect x="5" y="15" width="1" height="3" fill="#ff4400" opacity="0.5" />
      <rect x="10" y="16" width="1" height="2" fill="#ff6600" opacity="0.4" />
      <rect x="15" y="14" width="1" height="4" fill="#ff4400" opacity="0.5" />
    </>
  ),
  'Shadow Ninja': () => (
    <>
      {/* Headband */}
      <rect x="4" y="4" width="16" height="2" fill="#cc2222" />
      <rect x="18" y="3" width="6" height="1" fill="#cc2222" opacity="0.7" />
      <rect x="20" y="4" width="5" height="1" fill="#cc2222" opacity="0.4" />
      {/* Mask */}
      <rect x="5" y="9" width="12" height="4" fill="#222233" opacity="0.8" />
      {/* Shuriken on back */}
      <polygon points="22,18 24,16 26,18 24,20" fill="#aaaacc" />
      <polygon points="22.5,16.5 24,18 25.5,16.5 24,15" fill="#888899" />
      {/* Smoke puff */}
      <circle cx="-3" cy="28" r="2" fill="#555555" opacity="0.2" />
      <circle cx="-1" cy="26" r="1.5" fill="#555555" opacity="0.15" />
    </>
  ),
  'Royal Guard': () => (
    <>
      {/* Crown */}
      <rect x="5" y="-2" width="12" height="3" fill="#ffcc00" />
      <rect x="5" y="-3" width="2" height="2" fill="#ffcc00" />
      <rect x="10" y="-4" width="2" height="3" fill="#ffcc00" />
      <rect x="15" y="-3" width="2" height="2" fill="#ffcc00" />
      {/* Gems */}
      <rect x="10" y="-3" width="2" height="2" fill="#ff2244" />
      <rect x="6" y="-2" width="1" height="1" fill="#2266ff" />
      <rect x="15" y="-2" width="1" height="1" fill="#2266ff" />
      {/* Cape */}
      <polygon points="18,13 24,13 22,28 18,26" fill="#cc0000" opacity="0.8" />
      <polygon points="19,14 23,14 22,26 19,25" fill="#ee2222" opacity="0.5" />
      {/* Scepter */}
      <rect x="-3" y="14" width="2" height="10" fill="#ccaa00" />
      <circle cx="-2" cy="14" r="2" fill="#ffcc00" />
      <circle cx="-2" cy="14" r="1" fill="#ff4488" />
    </>
  ),
  'Pirate Cap': () => (
    <>
      {/* Pirate hat */}
      <rect x="2" y="-1" width="18" height="3" fill="#222222" />
      <rect x="4" y="-3" width="14" height="3" fill="#222222" />
      {/* Skull & crossbones */}
      <rect x="9" y="-2" width="4" height="3" fill="#ffffff" />
      <rect x="10" y="-1" width="1" height="1" fill="#222222" />
      <rect x="12" y="-1" width="1" height="1" fill="#222222" />
      {/* Eye patch */}
      <rect x="7" y="7" width="3" height="3" fill="#222222" />
      <rect x="5" y="6" width="8" height="1" fill="#222222" />
      {/* Hook hand */}
      <rect x="-1" y="20" width="3" height="1" fill="#cccccc" />
      <rect x="-1" y="19" width="1" height="2" fill="#cccccc" />
      {/* Parrot on shoulder */}
      <rect x="19" y="10" width="3" height="3" fill="#44cc44" />
      <rect x="20" y="9" width="2" height="2" fill="#ff4444" />
      <rect x="22" y="11" width="2" height="1" fill="#ffaa00" />
    </>
  ),
  // ===== UNCOMMON =====
  'Robot Suit': () => (
    <>
      {/* Antenna */}
      <rect x="11" y="-4" width="2" height="5" fill="#888899" />
      <circle cx="12" cy="-4" r="2" fill="#44ff44" opacity="0.8" />
      {/* Visor */}
      <rect x="6" y="7" width="10" height="3" fill="#44ccff" opacity="0.6" />
      {/* Chest panel */}
      <rect x="6" y="15" width="10" height="4" fill="#666677" />
      <rect x="7" y="16" width="2" height="1" fill="#44ff44" />
      <rect x="10" y="16" width="2" height="1" fill="#ff4444" />
      <rect x="13" y="16" width="2" height="1" fill="#ffaa00" />
      {/* Jet boosters */}
      <rect x="1" y="27" width="3" height="4" fill="#666677" />
      <rect x="18" y="27" width="3" height="4" fill="#666677" />
      <polygon points="1,31 2.5,35 4,31" fill="#ff6600" opacity="0.5" />
      <polygon points="18,31 19.5,35 21,31" fill="#ff6600" opacity="0.5" />
    </>
  ),
  'Knight Armor': () => (
    <>
      {/* Helmet visor */}
      <rect x="4" y="0" width="14" height="4" fill="#889aab" />
      <rect x="6" y="7" width="10" height="2" fill="#334455" opacity="0.5" />
      {/* Plume */}
      <rect x="10" y="-4" width="3" height="5" fill="#cc2222" />
      <rect x="11" y="-5" width="1" height="2" fill="#ee4444" />
      {/* Shoulder pads */}
      <rect x="-2" y="13" width="6" height="3" fill="#99aabb" />
      <rect x="18" y="13" width="6" height="3" fill="#99aabb" />
      {/* Shield */}
      <rect x="-4" y="16" width="5" height="7" rx="1" fill="#3355aa" />
      <rect x="-3" y="17" width="3" height="2" fill="#ffcc00" />
      {/* Sword */}
      <rect x="22" y="10" width="2" height="14" fill="#ccccdd" />
      <rect x="21" y="10" width="4" height="2" fill="#886633" />
    </>
  ),
  'Wizard Robe': () => (
    <>
      {/* Wizard hat */}
      <polygon points="12,-8 4,2 20,2" fill="#7744bb" />
      <polygon points="12,-8 7,0 17,0" fill="#9966dd" opacity="0.6" />
      <rect x="11" y="-5" width="2" height="2" fill="#ffff44" />
      {/* Staff */}
      <rect x="-3" y="8" width="2" height="22" fill="#663300" />
      <circle cx="-2" cy="8" r="3" fill="#aa44ee" opacity="0.6" />
      <circle cx="-2" cy="8" r="1.5" fill="#ff88ff" opacity="0.8" />
      {/* Magic sparkles */}
      <rect x="22" y="6" width="1.5" height="1.5" fill="#ffff44" opacity="0.6" />
      <rect x="-5" cy="14" width="1" height="1" fill="#aa88ff" opacity="0.5" />
      <rect x="24" y="20" width="1" height="1" fill="#ffff44" opacity="0.4" />
      {/* Robe trim */}
      <rect x="3" y="20" width="16" height="1" fill="#ffcc00" />
    </>
  ),
  'Chef Hat': () => (
    <>
      {/* Chef toque */}
      <rect x="5" y="-1" width="12" height="4" fill="#ffffff" />
      <rect x="4" y="-4" width="14" height="5" fill="#ffffff" />
      <rect x="6" y="-6" width="10" height="4" fill="#ffffff" />
      <rect x="7" y="-3" width="2" height="1" fill="#eeeeee" />
      {/* Mustache */}
      <rect x="7" y="10" width="3" height="1" fill="#553322" />
      <rect x="12" y="10" width="3" height="1" fill="#553322" />
      <rect x="6" y="10" width="1" height="1" fill="#553322" opacity="0.5" />
      <rect x="15" y="10" width="1" height="1" fill="#553322" opacity="0.5" />
      {/* Frying pan */}
      <circle cx="24" cy="18" r="3" fill="#555555" />
      <rect x="24" y="19" width="5" height="1.5" fill="#885533" />
      {/* Apron */}
      <rect x="5" y="14" width="12" height="7" fill="#ffffff" opacity="0.6" />
      <rect x="9" y="14" width="4" height="2" fill="#ffffff" />
    </>
  ),
  'Space Suit': () => (
    <>
      {/* Helmet bubble */}
      <rect x="2" y="2" width="18" height="12" rx="4" fill="#aaddff" opacity="0.2" />
      <rect x="3" y="3" width="4" height="6" fill="#ffffff" opacity="0.12" />
      {/* Oxygen tube */}
      <rect x="18" y="8" width="4" height="2" fill="#cccccc" />
      <rect x="20" y="6" width="3" height="8" rx="1" fill="#dddddd" />
      {/* Flag patch */}
      <rect x="4" y="15" width="4" height="3" fill="#cc2222" />
      <rect x="4" y="15" width="4" height="1" fill="#ffffff" />
      <rect x="4" y="17" width="4" height="1" fill="#ffffff" />
      {/* Stars */}
      <rect x="-3" y="4" width="1.5" height="1.5" fill="#ffffff" opacity="0.5" />
      <rect x="24" y="12" width="1" height="1" fill="#ffffff" opacity="0.4" />
    </>
  ),
  'Cowboy': () => (
    <>
      {/* Cowboy hat */}
      <rect x="1" y="-1" width="20" height="3" fill="#886633" />
      <rect x="5" y="-4" width="12" height="4" fill="#aa7744" />
      <rect x="5" y="-4" width="12" height="1" fill="#ccaa66" />
      {/* Hat band */}
      <rect x="5" y="-2" width="12" height="1" fill="#cc8833" />
      {/* Star badge */}
      <polygon points="11,16 10,18 8,18 9.5,19.5 9,21.5 11,20.3 13,21.5 12.5,19.5 14,18 12,18" fill="#ffcc00" />
      {/* Lasso */}
      <circle cx="24" cy="14" r="3" fill="none" stroke="#aa8855" strokeWidth="1" />
      <rect x="22" y="16" width="1" height="6" fill="#aa8855" />
      {/* Boots spurs */}
      <rect x="2" y="30" width="2" height="1" fill="#ccaa00" />
      <rect x="18" y="30" width="2" height="1" fill="#ccaa00" />
    </>
  ),
  'Diver': () => (
    <>
      {/* Diving mask */}
      <rect x="5" y="5" width="12" height="6" rx="2" fill="#88ccff" opacity="0.3" />
      <rect x="6" y="6" width="10" height="4" fill="#aaddff" opacity="0.2" />
      {/* Snorkel */}
      <rect x="17" y="3" width="2" height="8" fill="#ffcc00" />
      <rect x="17" y="2" width="4" height="2" fill="#ffcc00" />
      {/* Flippers */}
      <rect x="1" y="30" width="8" height="2" fill="#2288aa" />
      <rect x="13" y="30" width="8" height="2" fill="#2288aa" />
      {/* Bubbles */}
      <circle cx="22" cy="4" r="1.5" fill="#88ccff" opacity="0.3" />
      <circle cx="24" cy="1" r="1" fill="#88ccff" opacity="0.25" />
      <circle cx="21" cy="-1" r="0.8" fill="#88ccff" opacity="0.2" />
      {/* Harpoon */}
      <rect x="-4" y="14" width="2" height="12" fill="#888888" />
      <polygon points="-4,14 -3,11 -2,14" fill="#aaaacc" />
    </>
  ),
  'Skater': () => (
    <>
      {/* Backwards cap */}
      <rect x="4" y="0" width="14" height="4" fill="#ff6644" />
      <rect x="14" y="1" width="6" height="3" fill="#ff6644" />
      <rect x="4" y="3" width="14" height="1" fill="#cc4422" />
      {/* Headphones */}
      <rect x="3" y="4" width="3" height="4" fill="#333333" />
      <rect x="16" y="4" width="3" height="4" fill="#333333" />
      <rect x="3" y="2" width="16" height="2" fill="#333333" />
      {/* Skateboard */}
      <rect x="2" y="33" width="18" height="2" rx="1" fill="#ff8800" />
      <circle cx="5" cy="36" r="1.5" fill="#333333" />
      <circle cx="17" cy="36" r="1.5" fill="#333333" />
      {/* Graffiti on body */}
      <rect x="7" y="15" width="2" height="3" fill="#44cc44" opacity="0.4" />
      <rect x="12" y="16" width="3" height="2" fill="#ff44ff" opacity="0.3" />
    </>
  ),
  'Farmer': () => (
    <>
      {/* Straw hat */}
      <rect x="1" y="-1" width="20" height="3" fill="#ddcc77" />
      <rect x="5" y="-3" width="12" height="3" fill="#eedd88" />
      <rect x="5" y="-3" width="12" height="1" fill="#ffeeaa" />
      {/* Wheat straw in mouth */}
      <rect x="14" y="11" width="8" height="0.8" fill="#ddcc55" />
      {/* Pitchfork */}
      <rect x="22" y="8" width="1.5" height="16" fill="#886633" />
      <rect x="20" y="8" width="1" height="4" fill="#888888" />
      <rect x="22" y="8" width="1" height="4" fill="#888888" />
      <rect x="24" y="8" width="1" height="4" fill="#888888" />
      {/* Overall straps */}
      <rect x="6" y="13" width="2" height="5" fill="#4477aa" />
      <rect x="14" y="13" width="2" height="5" fill="#4477aa" />
    </>
  ),
  'Firefighter': () => (
    <>
      {/* Fire helmet */}
      <rect x="3" y="-2" width="16" height="5" fill="#cc2200" />
      <rect x="2" y="1" width="18" height="2" fill="#dd3300" />
      <rect x="8" y="-2" width="6" height="2" fill="#ffcc00" />
      {/* Oxygen tank */}
      <rect x="19" y="14" width="4" height="8" rx="1" fill="#cccccc" />
      <rect x="20" y="15" width="2" height="2" fill="#888888" />
      {/* Fire hose */}
      <rect x="-4" y="16" width="5" height="2" fill="#aa8800" />
      <rect x="-4" y="14" width="2" height="4" fill="#aa8800" />
      {/* Water spray */}
      <circle cx="-5" cy="15" r="1" fill="#4488ff" opacity="0.4" />
      <circle cx="-6" cy="14" r="0.8" fill="#4488ff" opacity="0.3" />
      {/* Reflective strips */}
      <rect x="3" y="17" width="16" height="1" fill="#ffcc00" opacity="0.6" />
    </>
  ),
  // ===== RARE =====
  'Pilot': () => (
    <>
      {/* Aviator hat + goggles */}
      <rect x="3" y="-1" width="16" height="5" fill="#553322" />
      <rect x="2" y="2" width="3" height="3" fill="#553322" />
      <rect x="17" y="2" width="3" height="3" fill="#553322" />
      <rect x="5" y="5" width="5" height="3" rx="1" fill="#ffcc44" opacity="0.5" />
      <rect x="12" y="5" width="5" height="3" rx="1" fill="#ffcc44" opacity="0.5" />
      {/* Scarf */}
      <rect x="3" y="13" width="4" height="8" fill="#cc2222" />
      <rect x="1" y="18" width="3" height="4" fill="#cc2222" opacity="0.7" />
      {/* Wings badge */}
      <rect x="7" y="15" width="8" height="1" fill="#ccaa00" />
      <polygon points="7,15 4,15.5 7,16" fill="#ccaa00" />
      <polygon points="15,15 18,15.5 15,16" fill="#ccaa00" />
    </>
  ),
  'Baker': () => (
    <>
      {/* Baker hat */}
      <rect x="5" y="-1" width="12" height="3" fill="#ffffff" />
      <rect x="6" y="-4" width="10" height="5" fill="#ffffff" />
      {/* Flour dust */}
      <circle cx="3" cy="16" r="1" fill="#ffffff" opacity="0.3" />
      <circle cx="19" cy="14" r="0.8" fill="#ffffff" opacity="0.25" />
      {/* Rolling pin */}
      <rect x="22" y="14" width="2" height="10" fill="#ccaa77" />
      <rect x="21" y="14" width="4" height="2" fill="#aa8855" />
      <rect x="21" y="22" width="4" height="2" fill="#aa8855" />
      {/* Apron with heart */}
      <rect x="5" y="14" width="12" height="6" fill="#ffcccc" opacity="0.5" />
      <rect x="10" y="15" width="2" height="2" fill="#ff4466" />
    </>
  ),
  'Mechanic': () => (
    <>
      {/* Welding mask (up) */}
      <rect x="4" y="-2" width="14" height="4" fill="#444444" />
      <rect x="6" y="-2" width="10" height="3" fill="#333333" />
      {/* Wrench */}
      <rect x="22" y="12" width="2" height="12" fill="#888888" />
      <rect x="20" y="12" width="6" height="3" fill="#888888" />
      <rect x="21" y="13" width="1" height="1" fill="#444444" />
      <rect x="24" y="13" width="1" height="1" fill="#444444" />
      {/* Oil stains */}
      <circle cx="8" cy="17" r="1.5" fill="#222222" opacity="0.3" />
      <circle cx="14" cy="19" r="1" fill="#222222" opacity="0.25" />
      {/* Tool belt */}
      <rect x="3" y="20" width="16" height="1.5" fill="#886633" />
      <rect x="5" y="20" width="2" height="3" fill="#888888" />
      <rect x="15" y="20" width="2" height="3" fill="#888888" />
    </>
  ),
  'Doctor': () => (
    <>
      {/* Head mirror */}
      <circle cx="16" cy="2" r="2.5" fill="#cccccc" />
      <circle cx="16" cy="2" r="1.5" fill="#ffffff" opacity="0.5" />
      {/* Stethoscope */}
      <rect x="8" y="13" width="1" height="6" fill="#333333" />
      <circle cx="8.5" cy="19" r="2" fill="#444444" />
      <circle cx="8.5" cy="19" r="1" fill="#888888" />
      {/* Lab coat */}
      <rect x="3" y="13" width="16" height="1" fill="#ffffff" opacity="0.7" />
      {/* Clipboard */}
      <rect x="-4" y="16" width="5" height="7" fill="#cc8844" />
      <rect x="-3" y="17" width="3" height="1" fill="#ffffff" />
      <rect x="-3" y="19" width="3" height="1" fill="#ffffff" />
      <rect x="-3" y="21" width="2" height="1" fill="#ffffff" />
    </>
  ),
  'Sailor': () => (
    <>
      {/* Sailor cap */}
      <rect x="4" y="-2" width="14" height="4" fill="#ffffff" />
      <rect x="3" y="1" width="16" height="2" fill="#2255aa" />
      {/* Anchor on cap */}
      <rect x="10" y="-1" width="2" height="2" fill="#2255aa" />
      {/* Anchor tattoo */}
      <rect x="1" y="16" width="2" height="3" fill="#2255aa" opacity="0.6" />
      {/* Telescope */}
      <rect x="20" y="14" width="6" height="2" fill="#886633" />
      <rect x="24" y="13" width="3" height="4" fill="#aa8844" />
      {/* Rope belt */}
      <rect x="3" y="20" width="16" height="1" fill="#ddcc88" />
    </>
  ),
  'Viking': () => (
    <>
      {/* Viking helmet */}
      <rect x="3" y="-1" width="16" height="4" fill="#888888" />
      <rect x="5" y="-1" width="12" height="2" fill="#999999" />
      {/* Horns - bigger & curved */}
      <polygon points="3,0 -2,-6 0,-7 5,1" fill="#eeeecc" />
      <polygon points="19,0 24,-6 22,-7 17,1" fill="#eeeecc" />
      {/* Braided beard */}
      <rect x="8" y="12" width="2" height="5" fill="#cc8833" />
      <rect x="12" y="12" width="2" height="5" fill="#cc8833" />
      <rect x="10" y="12" width="2" height="4" fill="#cc8833" />
      <rect x="9" y="16" width="1" height="1" fill="#cc8833" />
      <rect x="12" y="16" width="1" height="1" fill="#cc8833" />
      {/* Battle axe */}
      <rect x="22" y="10" width="2" height="14" fill="#886633" />
      <polygon points="22,10 18,14 22,18" fill="#aaaacc" />
    </>
  ),
  'Samurai': () => (
    <>
      {/* Samurai helmet crest */}
      <rect x="4" y="-1" width="14" height="3" fill="#cc2222" />
      <polygon points="12,-6 8,-1 16,-1" fill="#ffcc00" />
      <rect x="11" y="-6" width="2" height="2" fill="#ffee00" />
      {/* Face mask */}
      <rect x="5" y="9" width="12" height="3" fill="#222222" opacity="0.6" />
      {/* Katana on back */}
      <rect x="20" y="6" width="1.5" height="18" fill="#aaaacc" />
      <rect x="19" y="6" width="3.5" height="2" fill="#886633" />
      <rect x="19" y="7" width="1" height="1" fill="#ffcc00" />
      {/* Armor plates */}
      <rect x="3" y="13" width="2" height="6" fill="#cc2222" opacity="0.6" />
      <rect x="17" y="13" width="2" height="6" fill="#cc2222" opacity="0.6" />
    </>
  ),
  'Clown': () => (
    <>
      {/* Rainbow afro */}
      <circle cx="6" cy="0" r="4" fill="#ff0000" />
      <circle cx="11" cy="-2" r="4" fill="#ffaa00" />
      <circle cx="16" cy="0" r="4" fill="#00cc00" />
      <circle cx="8" cy="-3" r="3" fill="#ff6600" />
      <circle cx="14" cy="-3" r="3" fill="#00aaff" />
      {/* Red nose */}
      <circle cx="11" cy="9" r="2" fill="#ff0000" />
      <circle cx="11" cy="8.5" r="0.8" fill="#ff6666" />
      {/* Bow tie */}
      <polygon points="8,13 11,14.5 8,16" fill="#ff44ff" />
      <polygon points="14,13 11,14.5 14,16" fill="#ff44ff" />
      <circle cx="11" cy="14.5" r="1" fill="#ffff00" />
      {/* Big shoes */}
      <rect x="0" y="28" width="10" height="4" rx="2" fill="#ff4444" />
      <rect x="12" y="28" width="10" height="4" rx="2" fill="#44cc44" />
    </>
  ),
  'Ghost': () => (
    <>
      {/* Ghostly trail */}
      <rect x="5" y="28" width="12" height="4" fill="#ccccdd" opacity="0.3" />
      <rect x="7" y="31" width="8" height="3" fill="#ccccdd" opacity="0.2" />
      <rect x="9" y="33" width="4" height="2" fill="#ccccdd" opacity="0.1" />
      {/* Spooky eyes */}
      <circle cx="8" cy="8" r="2.5" fill="#000000" />
      <circle cx="14" cy="8" r="2.5" fill="#000000" />
      <circle cx="8" cy="7.5" r="1" fill="#ffffff" />
      <circle cx="14" cy="7.5" r="1" fill="#ffffff" />
      {/* Eerie glow */}
      <ellipse cx="11" cy="16" rx="10" ry="12" fill="#ccccee" opacity="0.08" />
      {/* Chains */}
      <circle cx="-2" cy="20" r="1.5" fill="none" stroke="#888888" strokeWidth="0.6" />
      <circle cx="-2" cy="23" r="1.5" fill="none" stroke="#888888" strokeWidth="0.6" />
    </>
  ),
  'Alien': () => (
    <>
      {/* Antennae with glowing tips */}
      <rect x="7" y="-4" width="1" height="5" fill="#228822" />
      <rect x="14" y="-4" width="1" height="5" fill="#228822" />
      <circle cx="7.5" cy="-4.5" r="2" fill="#66ee66" opacity="0.8" />
      <circle cx="14.5" cy="-4.5" r="2" fill="#66ee66" opacity="0.8" />
      <circle cx="7.5" cy="-4.5" r="1" fill="#aaffaa" />
      <circle cx="14.5" cy="-4.5" r="1" fill="#aaffaa" />
      {/* Big eyes */}
      <ellipse cx="8" cy="8" rx="3.5" ry="3" fill="#111111" />
      <ellipse cx="14" cy="8" rx="3.5" ry="3" fill="#111111" />
      <ellipse cx="7.5" cy="7" rx="1.2" ry="1" fill="#66ee66" />
      <ellipse cx="13.5" cy="7" rx="1.2" ry="1" fill="#66ee66" />
      {/* Ray gun */}
      <rect x="22" y="16" width="5" height="3" fill="#888888" />
      <rect x="26" y="17" width="2" height="1" fill="#66ff66" />
      {/* UFO beam particles */}
      <circle cx="-3" cy="10" r="0.8" fill="#66ff66" opacity="0.3" />
      <circle cx="25" cy="8" r="0.6" fill="#66ff66" opacity="0.25" />
    </>
  ),
  // ===== EPIC =====
  'Skibidi Man': () => (
    <>
      {/* Toilet seat halo - spinning effect */}
      <ellipse cx="12" cy="-2" rx="9" ry="3.5" fill="none" stroke="#aa88ff" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="12" cy="-2" rx="7" ry="2.5" fill="none" stroke="#bb99ff" strokeWidth="0.8" opacity="0.3" />
      {/* Swirl on body */}
      <circle cx="11" cy="17" r="3.5" fill="none" stroke="#bb99ff" strokeWidth="1.2" opacity="0.5" />
      <circle cx="11" cy="17" r="1.5" fill="#cc99ff" opacity="0.3" />
      {/* Musical notes */}
      <rect x="22" y="6" width="1" height="4" fill="#aa88ff" opacity="0.6" />
      <circle cx="22" cy="6" r="1.5" fill="#aa88ff" opacity="0.6" />
      <rect x="-3" y="10" width="1" height="3" fill="#bb99ff" opacity="0.5" />
      <circle cx="-3" cy="10" r="1" fill="#bb99ff" opacity="0.5" />
      {/* Sparkle eyes */}
      <rect x="8" y="7" width="2" height="2" fill="#dd88ff" />
      <rect x="13" y="7" width="2" height="2" fill="#dd88ff" />
    </>
  ),
  'Ohio Explorer': () => (
    <>
      {/* Ohio flag cape */}
      <polygon points="20,13 28,13 28,24 24,20 20,24" fill="#cc2222" />
      <rect x="22" y="14" width="4" height="3" fill="#ffffff" />
      <circle cx="24" cy="19" r="1.5" fill="#ffffff" />
      {/* Explorer hat */}
      <rect x="3" y="-2" width="16" height="4" fill="#886644" />
      <rect x="1" y="1" width="20" height="2" fill="#775533" />
      {/* Binoculars */}
      <rect x="-4" y="14" width="4" height="3" fill="#333333" />
      <rect x="-4" y="14" width="2" height="3" fill="#444444" />
      <circle cx="-3" cy="14" r="1.5" fill="#88ccff" opacity="0.4" />
      <circle cx="-1" cy="14" r="1.5" fill="#88ccff" opacity="0.4" />
      {/* Compass on belt */}
      <circle cx="11" cy="21" r="1.5" fill="#ccaa00" />
      <rect x="10.7" y="19.5" width="0.6" height="1.5" fill="#cc2222" />
    </>
  ),
  'Rizz Lord': () => (
    <>
      {/* Floating crown */}
      <rect x="5" y="-4" width="12" height="4" fill="#ffcc00" />
      <rect x="6" y="-6" width="2" height="3" fill="#ffcc00" />
      <rect x="10" y="-7" width="2" height="4" fill="#ffcc00" />
      <rect x="14" y="-6" width="2" height="3" fill="#ffcc00" />
      <rect x="10" y="-6" width="2" height="2" fill="#ff44aa" />
      {/* Drip sunglasses */}
      <rect x="5" y="6" width="6" height="4" rx="1" fill="#111111" />
      <rect x="11" y="6" width="6" height="4" rx="1" fill="#111111" />
      <rect x="11" y="7" width="1" height="2" fill="#ffaa00" />
      <rect x="6" y="7" width="2" height="1" fill="#ffffff" opacity="0.3" />
      {/* Gold chain */}
      <circle cx="8" cy="15" r="1" fill="none" stroke="#ffcc00" strokeWidth="0.8" />
      <circle cx="11" cy="16" r="1" fill="none" stroke="#ffcc00" strokeWidth="0.8" />
      <circle cx="14" cy="15" r="1" fill="none" stroke="#ffcc00" strokeWidth="0.8" />
      <circle cx="11" cy="17.5" r="2" fill="#ffcc00" />
      <rect x="10" y="16.5" width="2" height="2" fill="#ff4488" />
      {/* Sparkles */}
      <rect x="22" y="4" width="2" height="2" fill="#ffff44" opacity="0.7" />
      <rect x="-3" y="8" width="1.5" height="1.5" fill="#ffff44" opacity="0.5" />
      <rect x="24" y="14" width="1" height="1" fill="#ffff44" opacity="0.6" />
    </>
  ),
  'Sigma Boss': () => (
    <>
      {/* Dark aura */}
      <rect x="-2" y="8" width="26" height="18" fill="#111111" opacity="0.12" />
      <rect x="0" y="10" width="22" height="14" fill="#111111" opacity="0.08" />
      {/* Glowing red eyes */}
      <rect x="7" y="7" width="3" height="2" fill="#ff0000" />
      <rect x="12" y="7" width="3" height="2" fill="#ff0000" />
      <rect x="8" y="7" width="1" height="1" fill="#ff6666" />
      <rect x="13" y="7" width="1" height="1" fill="#ff6666" />
      {/* Heavy chain */}
      <circle cx="8" cy="14" r="1.5" fill="none" stroke="#888888" strokeWidth="1" />
      <circle cx="11" cy="15" r="1.5" fill="none" stroke="#888888" strokeWidth="1" />
      <circle cx="14" cy="14" r="1.5" fill="none" stroke="#888888" strokeWidth="1" />
      {/* Battle scars */}
      <rect x="15" y="8" width="3" height="0.5" fill="#882222" opacity="0.5" />
      {/* Smoke */}
      <circle cx="-3" cy="24" r="2" fill="#222222" opacity="0.15" />
      <circle cx="25" cy="22" r="1.5" fill="#222222" opacity="0.1" />
    </>
  ),
  'Grimace Shake': () => (
    <>
      {/* Shake cup in hand */}
      <rect x="-3" y="15" width="6" height="9" fill="#ffffff" />
      <rect x="-3" y="15" width="6" height="2.5" fill="#7722cc" />
      <rect x="-2" y="14" width="4" height="2" fill="#ffccee" />
      {/* Straw */}
      <rect x="0" y="9" width="1" height="7" fill="#ff6688" />
      <rect x="-1" y="9" width="3" height="1" fill="#ff6688" />
      {/* Purple drips on body */}
      <rect x="5" y="20" width="2" height="3" fill="#9933ee" opacity="0.3" />
      <rect x="15" y="19" width="2" height="4" fill="#9933ee" opacity="0.25" />
      {/* Grimace smile */}
      <rect x="7" y="10" width="8" height="1" fill="#ffffff" />
      <rect x="6" y="9" width="1" height="2" fill="#ffffff" />
      <rect x="15" y="9" width="1" height="2" fill="#ffffff" />
      {/* Purple sparkles */}
      <circle cx="22" cy="8" r="1" fill="#9933ee" opacity="0.4" />
      <circle cx="-5" cy="12" r="0.8" fill="#bb66ff" opacity="0.3" />
    </>
  ),
  'Among Us': () => (
    <>
      {/* Visor */}
      <rect x="4" y="4" width="9" height="7" rx="2" fill="#88ccff" />
      <rect x="5" y="5" width="3" height="3" fill="#ffffff" opacity="0.3" />
      {/* Backpack */}
      <rect x="18" y="13" width="5" height="8" rx="1" fill="#cc1111" />
      <rect x="19" y="14" width="3" height="2" fill="#ee3333" opacity="0.5" />
      {/* Bone */}
      <rect x="-4" y="22" width="6" height="1.5" fill="#ffffff" />
      <circle cx="-3.5" cy="22" r="1" fill="#ffffff" />
      <circle cx="1.5" cy="22" r="1" fill="#ffffff" />
      <circle cx="-3.5" cy="23.5" r="1" fill="#ffffff" />
      <circle cx="1.5" cy="23.5" r="1" fill="#ffffff" />
      {/* Mini crewmate */}
      <rect x="22" cy="26" width="3" height="4" rx="1" fill="#3366ff" />
      <rect x="22" cy="25" width="2" height="2" fill="#88ccff" />
    </>
  ),
  'Wednesday': () => (
    <>
      {/* Long braids */}
      <rect x="0" y="4" width="3" height="16" fill="#000000" />
      <rect x="19" y="4" width="3" height="16" fill="#000000" />
      <rect x="0" y="19" width="2" height="2" fill="#000000" />
      <rect x="20" y="19" width="2" height="2" fill="#000000" />
      {/* Peter Pan collar */}
      <polygon points="4,13 8,11 11,13" fill="#ffffff" />
      <polygon points="18,13 14,11 11,13" fill="#ffffff" />
      {/* Thing (hand) */}
      <rect x="22" y="8" width="4" height="5" fill="#ffcc88" />
      <rect x="22" y="8" width="1" height="3" fill="#ffcc88" />
      <rect x="23" y="7" width="1" height="3" fill="#ffcc88" />
      <rect x="24" y="8" width="1" height="3" fill="#ffcc88" />
      <rect x="25" y="9" width="1" height="2" fill="#ffcc88" />
      {/* Dead stare */}
      <rect x="8" y="7" width="2" height="2" fill="#000000" />
      <rect x="12" y="7" width="2" height="2" fill="#000000" />
    </>
  ),
  'Baby Gronk': () => (
    <>
      {/* Football helmet */}
      <rect x="3" y="-2" width="16" height="6" fill="#33aa55" />
      <rect x="4" y="-1" width="14" height="4" fill="#44bb66" />
      <rect x="6" y="0" width="1" height="5" fill="#ffffff" />
      {/* Facemask */}
      <rect x="4" y="6" width="2" height="5" fill="#888888" opacity="0.5" />
      <rect x="4" y="6" width="8" height="1" fill="#888888" opacity="0.4" />
      {/* Football */}
      <ellipse cx="24" cy="17" rx="3.5" ry="2.2" fill="#884422" />
      <rect x="23" y="16" width="2" height="0.8" fill="#ffffff" />
      <rect x="23.8" y="15" width="0.4" height="4" fill="#ffffff" />
      {/* Jersey number */}
      <rect x="8" y="15" width="6" height="4" fill="#ffffff" opacity="0.3" />
      <rect x="10" y="16" width="2" height="2" fill="#33aa55" />
    </>
  ),
  // ===== LEGENDARY =====
  'Nyan Runner': () => (
    <>
      {/* Rainbow trail */}
      <rect x="-10" y="13" width="10" height="1.5" fill="#ff0000" />
      <rect x="-10" y="14.5" width="10" height="1.5" fill="#ff8800" />
      <rect x="-10" y="16" width="10" height="1.5" fill="#ffff00" />
      <rect x="-10" y="17.5" width="10" height="1.5" fill="#00ff00" />
      <rect x="-10" y="19" width="10" height="1.5" fill="#0088ff" />
      <rect x="-10" y="20.5" width="10" height="1.5" fill="#8800ff" />
      {/* Cat ears */}
      <polygon points="5,0 2,-5 9,0" fill="#ff6699" />
      <polygon points="17,0 14,-5 20,0" fill="#ff6699" />
      <polygon points="6,0 4,-3 8,0" fill="#ffaacc" />
      <polygon points="16,0 15,-3 19,0" fill="#ffaacc" />
      {/* Whiskers */}
      <rect x="-2" y="9" width="6" height="0.5" fill="#ffaacc" opacity="0.5" />
      <rect x="-1" y="11" width="5" height="0.5" fill="#ffaacc" opacity="0.5" />
      <rect x="18" y="9" width="6" height="0.5" fill="#ffaacc" opacity="0.5" />
      <rect x="17" y="11" width="5" height="0.5" fill="#ffaacc" opacity="0.5" />
      {/* Poptart body outline */}
      <rect x="3" y="13" width="16" height="8" fill="none" stroke="#ff8866" strokeWidth="0.8" opacity="0.4" />
      {/* Sprinkles */}
      <rect x="5" y="15" width="1" height="1" fill="#ff4488" opacity="0.6" />
      <rect x="9" y="14" width="1" height="1" fill="#44ff88" opacity="0.6" />
      <rect x="13" y="16" width="1" height="1" fill="#4488ff" opacity="0.6" />
      <rect x="7" y="18" width="1" height="1" fill="#ffff44" opacity="0.6" />
      <rect x="15" y="14" width="1" height="1" fill="#ff44ff" opacity="0.6" />
      {/* Star sparkles */}
      <rect x="23" y="8" width="2" height="2" fill="#ffff44" opacity="0.8" />
      <rect x="-5" y="6" width="2" height="2" fill="#ffff44" opacity="0.6" />
      <rect x="25" y="18" width="1.5" height="1.5" fill="#ffff44" opacity="0.5" />
    </>
  ),
  'Mog Master': () => (
    <>
      {/* Dark mystic hood */}
      <rect x="1" y="-3" width="20" height="10" fill="#003333" />
      <rect x="2" y="-2" width="18" height="8" fill="#004444" opacity="0.8" />
      <polygon points="11,-3 8,-3 6,3" fill="#005555" opacity="0.4" />
      <polygon points="11,-3 14,-3 16,3" fill="#005555" opacity="0.4" />
      {/* Glowing eyes from under hood */}
      <rect x="7" y="4" width="3" height="3" fill="#00ffaa" />
      <rect x="12" y="4" width="3" height="3" fill="#00ffaa" />
      <rect x="8" y="4.5" width="1" height="1.5" fill="#88ffcc" />
      <rect x="13" y="4.5" width="1" height="1.5" fill="#88ffcc" />
      {/* Floating runes */}
      <rect x="-4" y="8" width="3" height="3" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.4" />
      <rect x="23" y="12" width="3" height="3" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.3" />
      <rect x="-3" y="20" width="2" height="2" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.3" />
      {/* Mystical aura particles */}
      <circle cx="-1" cy="12" r="1.2" fill="#00ffaa" opacity="0.4" />
      <circle cx="23" cy="8" r="1" fill="#00ffaa" opacity="0.3" />
      <circle cx="-3" cy="24" r="0.8" fill="#00ffaa" opacity="0.3" />
      <circle cx="25" cy="20" r="0.8" fill="#00ffaa" opacity="0.4" />
      <circle cx="11" cy="-4" r="0.6" fill="#88ffcc" opacity="0.5" />
      {/* Mystical cloak trail */}
      <rect x="4" y="28" width="14" height="4" fill="#004444" opacity="0.3" />
      <rect x="6" y="31" width="10" height="3" fill="#003333" opacity="0.2" />
      {/* Ancient staff */}
      <rect x="-5" y="6" width="1.5" height="20" fill="#336655" />
      <circle cx="-4.2" cy="6" r="2.5" fill="#00aa77" opacity="0.5" />
      <circle cx="-4.2" cy="6" r="1.2" fill="#00ffaa" opacity="0.7" />
    </>
  ),
};

// CSS animation styles for rare+ skins
function getRarityWrapperStyle(rarity: SkinRarity): React.CSSProperties {
  switch (rarity) {
    case 'rare':
      return {};
    case 'epic':
      return {
        filter: 'drop-shadow(0 0 3px rgba(170,68,238,0.5))',
      };
    case 'legendary':
      return {
        filter: 'drop-shadow(0 0 6px rgba(255,170,0,0.6))',
      };
    default:
      return {};
  }
}

function getRarityAnimClass(rarity: SkinRarity): string {
  switch (rarity) {
    case 'epic': return 'skin-epic-glow';
    case 'legendary': return 'skin-legendary-glow';
    default: return '';
  }
}

const SkinAvatar: React.FC<SkinAvatarProps> = ({ skin, size = 32, dimmed = false, animated = false }) => {
  const scale = size / 24;
  const extras = SKIN_EXTRAS[skin.name];
  const rarityClass = getRarityAnimClass(skin.rarity);
  const rarityStyle = getRarityWrapperStyle(skin.rarity);

  return (
    <div
      className={`relative flex-shrink-0 ${animated ? 'animate-bounce-slow' : ''} ${rarityClass}`}
      style={{
        width: size,
        height: Math.round(size * 1.6),
        opacity: dimmed ? 0.4 : 1,
        ...(!dimmed ? rarityStyle : {}),
      }}
    >
      {/* Rarity border glow for legendary */}
      {skin.rarity === 'legendary' && !dimmed && (
        <div
          className="absolute -inset-1 rounded-sm skin-legendary-ring pointer-events-none"
          style={{ border: `1px solid ${RARITY_COLORS.legendary}40` }}
        />
      )}

      <svg
        width={size}
        height={Math.round(size * 1.6)}
        viewBox="-4 -6 32 44"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Rarity aura for epic+ */}
        {skin.rarity === 'legendary' && !dimmed && (
          <ellipse cx="12" cy="16" rx="14" ry="18" fill={`${RARITY_COLORS.legendary}15`} className="skin-pulse" />
        )}
        {skin.rarity === 'epic' && !dimmed && (
          <ellipse cx="12" cy="16" rx="12" ry="16" fill={`${RARITY_COLORS.epic}10`} className="skin-pulse" />
        )}

        {/* Shadow */}
        <ellipse cx="12" cy="37" rx="7" ry="1.5" fill="#000" opacity="0.2" />

        {/* Unique extras (behind character for some) */}
        {extras && extras(scale)}

        {/* Hair */}
        <rect x="4" y="0" width="14" height="5" fill={skin.hairColor} />
        <rect x="5" y="1" width="10" height="2" fill={lighten(skin.hairColor, 25)} />
        <rect x="16" y="0" width="2" height="3" fill={darken(skin.hairColor, 20)} />

        {/* Head */}
        <rect x="4" y="5" width="14" height="8" fill={skin.headColor} />
        <rect x="4" y="5" width="14" height="2" fill={lighten(skin.headColor, 15)} />
        <rect x="4" y="11" width="14" height="2" fill={darken(skin.headColor, 20)} />

        {/* Eyes - special for some skins handled by extras overlay */}
        <rect x="11" y="7" width="5" height="3" fill="white" />
        <rect x="13" y="7" width="3" height="3" fill="#1a1a2e" />
        <rect x="14" y="7" width="1" height="1" fill="white" />
        <rect x="11" y="6" width="5" height="1" fill={darken(skin.hairColor, 15)} />
        <rect x="9" y="9" width="2" height="2" fill={darken(skin.headColor, 25)} />
        <rect x="11" y="11" width="3" height="1" fill="#cc6644" />

        {/* Body */}
        <rect x="3" y="13" width="16" height="8" fill={skin.bodyColor} />
        <rect x="3" y="13" width="16" height="2" fill={lighten(skin.bodyColor, 20)} />
        <rect x="3" y="19" width="16" height="2" fill={darken(skin.bodyColor, 25)} />
        <rect x="3" y="20" width="16" height="1" fill={darken(skin.pantsColor, 30)} />

        {/* Arms */}
        <rect x="0" y="14" width="4" height="7" fill={skin.bodyColor} />
        <rect x="0" y="14" width="1" height="7" fill={darken(skin.bodyColor, 30)} />
        <rect x="18" y="14" width="4" height="7" fill={skin.bodyColor} />
        <rect x="21" y="14" width="1" height="7" fill={darken(skin.bodyColor, 30)} />
        <rect x="0" y="20" width="4" height="2" fill={skin.headColor} />
        <rect x="18" y="20" width="4" height="2" fill={skin.headColor} />

        {/* Pants */}
        <rect x="4" y="21" width="6" height="6" fill={skin.pantsColor} />
        <rect x="12" y="21" width="6" height="6" fill={skin.pantsColor} />
        <rect x="4" y="21" width="1" height="6" fill={darken(skin.pantsColor, 25)} />
        <rect x="12" y="21" width="1" height="6" fill={darken(skin.pantsColor, 25)} />
        <rect x="10" y="21" width="2" height="6" fill={darken(skin.pantsColor, 35)} />

        {/* Shoes */}
        <rect x="3" y="27" width="7" height="4" fill="#3a2211" />
        <rect x="12" y="27" width="7" height="4" fill="#3a2211" />
        <rect x="3" y="27" width="7" height="1" fill="#5a3a22" />
        <rect x="12" y="27" width="7" height="1" fill="#5a3a22" />
        <rect x="3" y="30" width="7" height="1" fill="#221108" />
        <rect x="12" y="30" width="7" height="1" fill="#221108" />
      </svg>
    </div>
  );
};

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amount: number): string {
  return lighten(hex, -amount);
}

export default SkinAvatar;
