import React from 'react';
import { Skin } from '@/game/types';

interface SkinAvatarProps {
  skin: Skin;
  size?: number;
  dimmed?: boolean;
  animated?: boolean;
}

const SkinAvatar: React.FC<SkinAvatarProps> = ({ skin, size = 32, dimmed = false, animated = false }) => {
  const scale = size / 24;

  return (
    <div
      className={`relative flex-shrink-0 ${animated ? 'animate-bounce-slow' : ''}`}
      style={{ width: size, height: Math.round(size * 1.6), opacity: dimmed ? 0.4 : 1 }}
    >
      <svg
        width={size}
        height={Math.round(size * 1.6)}
        viewBox="0 0 24 38"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Shadow */}
        <ellipse cx="12" cy="37" rx="7" ry="1.5" fill="#000" opacity="0.2" />

        {/* Hair */}
        <rect x="4" y="0" width="14" height="5" fill={skin.hairColor} />
        <rect x="5" y="1" width="10" height="2" fill={lighten(skin.hairColor, 25)} />
        <rect x="16" y="0" width="2" height="3" fill={darken(skin.hairColor, 20)} />

        {/* Head */}
        <rect x="4" y="5" width="14" height="8" fill={skin.headColor} />
        <rect x="4" y="5" width="14" height="2" fill={lighten(skin.headColor, 15)} />
        <rect x="4" y="11" width="14" height="2" fill={darken(skin.headColor, 20)} />

        {/* Eyes */}
        <rect x="11" y="7" width="5" height="3" fill="white" />
        <rect x="13" y="7" width="3" height="3" fill="#1a1a2e" />
        <rect x="14" y="7" width="1" height="1" fill="white" />
        {/* Eyebrow */}
        <rect x="11" y="6" width="5" height="1" fill={darken(skin.hairColor, 15)} />
        {/* Nose */}
        <rect x="9" y="9" width="2" height="2" fill={darken(skin.headColor, 25)} />
        {/* Mouth */}
        <rect x="11" y="11" width="3" height="1" fill="#cc6644" />

        {/* Body */}
        <rect x="3" y="13" width="16" height="8" fill={skin.bodyColor} />
        <rect x="3" y="13" width="16" height="2" fill={lighten(skin.bodyColor, 20)} />
        <rect x="3" y="19" width="16" height="2" fill={darken(skin.bodyColor, 25)} />
        {/* Belt */}
        <rect x="3" y="20" width="16" height="1" fill={darken(skin.pantsColor, 30)} />

        {/* Arms */}
        <rect x="0" y="14" width="4" height="7" fill={skin.bodyColor} />
        <rect x="0" y="14" width="1" height="7" fill={darken(skin.bodyColor, 30)} />
        <rect x="18" y="14" width="4" height="7" fill={skin.bodyColor} />
        <rect x="21" y="14" width="1" height="7" fill={darken(skin.bodyColor, 30)} />
        {/* Hands */}
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
