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
  'Shadow Ninja': () => (
    <>
      {/* Headband */}
      <rect x="4" y="4" width="16" height="2" fill="#cc2222" />
      <rect x="18" y="3" width="4" height="1" fill="#cc2222" opacity="0.7" />
      <rect x="19" y="4" width="3" height="1" fill="#cc2222" opacity="0.5" />
      {/* Mask */}
      <rect x="5" y="9" width="12" height="4" fill="#222233" opacity="0.8" />
    </>
  ),
  'Royal Guard': () => (
    <>
      {/* Crown */}
      <rect x="5" y="-2" width="12" height="3" fill="#ffcc00" />
      <rect x="5" y="-3" width="2" height="2" fill="#ffcc00" />
      <rect x="10" y="-4" width="2" height="3" fill="#ffcc00" />
      <rect x="15" y="-3" width="2" height="2" fill="#ffcc00" />
      {/* Gem */}
      <rect x="10" y="-3" width="2" height="2" fill="#ff2244" />
    </>
  ),
  'Pirate Cap': () => (
    <>
      {/* Pirate hat */}
      <rect x="2" y="-1" width="18" height="3" fill="#222222" />
      <rect x="4" y="-3" width="14" height="3" fill="#222222" />
      {/* Skull */}
      <rect x="9" y="-2" width="4" height="3" fill="#ffffff" />
      <rect x="10" y="-1" width="1" height="1" fill="#222222" />
      <rect x="12" y="-1" width="1" height="1" fill="#222222" />
    </>
  ),
  'Robot Suit': () => (
    <>
      {/* Antenna */}
      <rect x="11" y="-4" width="2" height="5" fill="#888899" />
      <circle cx="12" cy="-4" r="2" fill="#44ff44" opacity="0.8" />
      {/* Visor */}
      <rect x="6" y="7" width="10" height="3" fill="#44ccff" opacity="0.6" />
    </>
  ),
  'Knight Armor': () => (
    <>
      {/* Helmet visor */}
      <rect x="4" y="0" width="14" height="4" fill="#889aab" />
      <rect x="6" y="7" width="10" height="2" fill="#334455" opacity="0.5" />
      {/* Shoulder pads */}
      <rect x="-1" y="13" width="5" height="3" fill="#99aabb" />
      <rect x="18" y="13" width="5" height="3" fill="#99aabb" />
    </>
  ),
  'Wizard Robe': () => (
    <>
      {/* Wizard hat */}
      <polygon points="12,-6 6,2 18,2" fill="#7744bb" />
      <polygon points="12,-6 8,0 16,0" fill="#9966dd" opacity="0.6" />
      {/* Star on hat */}
      <rect x="11" y="-3" width="2" height="2" fill="#ffff44" />
    </>
  ),
  'Space Suit': () => (
    <>
      {/* Helmet bubble */}
      <rect x="2" y="3" width="18" height="11" rx="3" fill="#aaddff" opacity="0.25" />
      {/* Visor reflection */}
      <rect x="5" y="5" width="3" height="5" fill="#ffffff" opacity="0.15" />
    </>
  ),
  'Viking': () => (
    <>
      {/* Viking helmet */}
      <rect x="3" y="-1" width="16" height="4" fill="#888888" />
      {/* Horns */}
      <polygon points="3,0 -1,-5 5,1" fill="#eeeecc" />
      <polygon points="19,0 23,-5 17,1" fill="#eeeecc" />
    </>
  ),
  'Samurai': () => (
    <>
      {/* Samurai helmet crest */}
      <rect x="4" y="-1" width="14" height="3" fill="#cc2222" />
      <polygon points="12,-5 9,-1 15,-1" fill="#ffcc00" />
      {/* Sword on back */}
      <rect x="20" y="8" width="2" height="16" fill="#aaaacc" />
      <rect x="19" y="8" width="4" height="2" fill="#886633" />
    </>
  ),
  'Ghost': () => (
    <>
      {/* Ghostly trail */}
      <rect x="6" y="28" width="10" height="4" fill="#ccccdd" opacity="0.3" />
      <rect x="8" y="31" width="6" height="3" fill="#ccccdd" opacity="0.15" />
    </>
  ),
  'Alien': () => (
    <>
      {/* Antennae */}
      <rect x="7" y="-3" width="1" height="4" fill="#228822" />
      <rect x="14" y="-3" width="1" height="4" fill="#228822" />
      <circle cx="7.5" cy="-3.5" r="1.5" fill="#66ee66" />
      <circle cx="14.5" cy="-3.5" r="1.5" fill="#66ee66" />
      {/* Big eyes */}
      <ellipse cx="8" cy="8" rx="3" ry="2.5" fill="#111111" />
      <ellipse cx="14" cy="8" rx="3" ry="2.5" fill="#111111" />
      <ellipse cx="8" cy="7.5" rx="1" ry="1" fill="#66ee66" />
      <ellipse cx="14" cy="7.5" rx="1" ry="1" fill="#66ee66" />
    </>
  ),
  // Epic skins
  'Skibidi Man': () => (
    <>
      {/* Toilet seat halo */}
      <ellipse cx="12" cy="-2" rx="8" ry="3" fill="none" stroke="#aa88ff" strokeWidth="1.5" opacity="0.6" />
      {/* Swirl on body */}
      <circle cx="11" cy="17" r="3" fill="none" stroke="#bb99ff" strokeWidth="1" opacity="0.5" />
    </>
  ),
  'Ohio Explorer': () => (
    <>
      {/* Ohio flag cape */}
      <polygon points="20,14 28,14 28,22 24,19 20,22" fill="#cc2222" />
      <rect x="22" y="15" width="4" height="2" fill="#ffffff" />
      <circle cx="24" cy="18" r="1" fill="#ffffff" />
    </>
  ),
  'Rizz Lord': () => (
    <>
      {/* Crown + sparkles */}
      <rect x="6" y="-2" width="10" height="3" fill="#ffcc00" />
      <rect x="7" y="-4" width="2" height="3" fill="#ffcc00" />
      <rect x="10" y="-5" width="2" height="4" fill="#ffcc00" />
      <rect x="13" y="-4" width="2" height="3" fill="#ffcc00" />
      {/* Sunglasses */}
      <rect x="6" y="7" width="5" height="3" fill="#111111" />
      <rect x="11" y="7" width="5" height="3" fill="#111111" />
      <rect x="11" y="8" width="1" height="1" fill="#ffaa00" />
    </>
  ),
  'Sigma Boss': () => (
    <>
      {/* Dark aura */}
      <rect x="1" y="11" width="20" height="12" fill="#111111" opacity="0.15" />
      {/* Glowing eyes */}
      <rect x="7" y="7" width="3" height="2" fill="#ff0000" />
      <rect x="12" y="7" width="3" height="2" fill="#ff0000" />
      {/* Chain */}
      <circle cx="11" cy="16" r="2" fill="none" stroke="#888888" strokeWidth="0.8" />
    </>
  ),
  'Grimace Shake': () => (
    <>
      {/* Shake cup */}
      <rect x="-2" y="16" width="5" height="8" fill="#ffffff" />
      <rect x="-2" y="16" width="5" height="2" fill="#7722cc" />
      <rect x="-1" y="15" width="3" height="2" fill="#ffccee" />
      {/* Straw */}
      <rect x="0" y="10" width="1" height="7" fill="#ff6688" />
    </>
  ),
  'Among Us': () => (
    <>
      {/* Visor */}
      <rect x="5" y="5" width="8" height="6" rx="2" fill="#88ccff" />
      <rect x="6" y="6" width="3" height="2" fill="#ffffff" opacity="0.4" />
      {/* Backpack */}
      <rect x="18" y="14" width="4" height="6" rx="1" fill="#aa1111" />
    </>
  ),
  'Wednesday': () => (
    <>
      {/* Braids */}
      <rect x="1" y="5" width="3" height="14" fill="#000000" />
      <rect x="18" y="5" width="3" height="14" fill="#000000" />
      {/* Collar */}
      <rect x="5" y="13" width="12" height="2" fill="#ffffff" />
      <polygon points="11,13 9,11 13,11" fill="#ffffff" />
    </>
  ),
  'Baby Gronk': () => (
    <>
      {/* Football helmet */}
      <rect x="3" y="-1" width="16" height="5" fill="#33aa55" />
      <rect x="6" y="0" width="1" height="5" fill="#ffffff" />
      {/* Facemask */}
      <rect x="5" y="6" width="2" height="5" fill="#888888" opacity="0.5" />
      {/* Football */}
      <ellipse cx="24" cy="18" rx="3" ry="2" fill="#884422" />
      <rect x="23" y="17" width="2" height="1" fill="#ffffff" />
    </>
  ),
  // Legendary skins
  'Nyan Runner': () => (
    <>
      {/* Rainbow trail */}
      <rect x="-8" y="14" width="8" height="1.5" fill="#ff0000" />
      <rect x="-8" y="15.5" width="8" height="1.5" fill="#ff8800" />
      <rect x="-8" y="17" width="8" height="1.5" fill="#ffff00" />
      <rect x="-8" y="18.5" width="8" height="1.5" fill="#00ff00" />
      <rect x="-8" y="20" width="8" height="1.5" fill="#0088ff" />
      <rect x="-8" y="21.5" width="8" height="1.5" fill="#8800ff" />
      {/* Cat ears */}
      <polygon points="5,0 3,-4 8,0" fill="#ff6699" />
      <polygon points="17,0 14,-4 19,0" fill="#ff6699" />
      <polygon points="6,0 4,-3 8,0" fill="#ffaacc" />
      <polygon points="16,0 15,-3 18,0" fill="#ffaacc" />
      {/* Star sparkles */}
      <rect x="22" y="10" width="2" height="2" fill="#ffff44" opacity="0.8" />
      <rect x="-4" y="8" width="2" height="2" fill="#ffff44" opacity="0.6" />
    </>
  ),
  'Mog Master': () => (
    <>
      {/* Dark hood */}
      <rect x="2" y="-2" width="18" height="8" fill="#004444" />
      <rect x="3" y="-1" width="16" height="6" fill="#005555" opacity="0.8" />
      {/* Glowing eyes from under hood */}
      <rect x="7" y="5" width="3" height="2" fill="#00ffaa" />
      <rect x="12" y="5" width="3" height="2" fill="#00ffaa" />
      <rect x="8" y="5" width="1" height="1" fill="#88ffcc" />
      <rect x="13" y="5" width="1" height="1" fill="#88ffcc" />
      {/* Mystical aura particles */}
      <circle cx="0" cy="12" r="1" fill="#00ffaa" opacity="0.4" />
      <circle cx="22" cy="8" r="1" fill="#00ffaa" opacity="0.3" />
      <circle cx="-2" cy="20" r="0.8" fill="#00ffaa" opacity="0.3" />
      <circle cx="24" cy="18" r="0.8" fill="#00ffaa" opacity="0.4" />
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
