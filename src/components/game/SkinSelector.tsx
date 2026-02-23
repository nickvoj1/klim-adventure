import React from 'react';
import { SKINS, RARITY_COLORS } from '@/game/constants';
import { playSound } from '@/game/audio';
import SkinAvatar from './SkinAvatar';

interface SkinSelectorProps {
  unlockedSkins: boolean[];
  equippedSkin: number;
  onEquip: (index: number) => void;
  onBack: () => void;
}

const SkinSelector: React.FC<SkinSelectorProps> = ({ unlockedSkins, equippedSkin, onEquip, onBack }) => {
  const equippedSkin_ = SKINS[equippedSkin];

  return (
    <div className="flex flex-col items-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-primary glow-green mb-1">SKINS</h2>

      {/* Equipped skin showcase */}
      <div className="flex items-center gap-3 mb-3 z-20 bg-primary/5 border border-primary/30 rounded px-4 py-2">
        <SkinAvatar skin={equippedSkin_} size={48} animated />
        <div className="flex flex-col">
          <span className="font-pixel text-[8px] text-muted-foreground">Equipped</span>
          <span className="font-pixel text-[10px] text-primary">{equippedSkin_.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 sm:gap-2 z-20 mb-3 sm:mb-4 max-h-[50vh] sm:max-h-[280px] overflow-y-auto p-1 sm:p-2 w-full">
        {SKINS.map((skin, i) => {
          const unlocked = unlockedSkins[i];
          const equipped = equippedSkin === i;

          return (
            <button
              key={i}
              onClick={() => {
                if (unlocked) { playSound('select'); onEquip(i); }
              }}
              disabled={!unlocked}
              className={`group w-full aspect-[3/4] flex flex-col items-center justify-center border rounded transition-all relative p-1 ${
                equipped
                  ? 'border-primary bg-primary/15 shadow-[0_0_8px_hsl(var(--primary)/0.3)] scale-105'
                  : unlocked
                  ? 'border-border bg-secondary/80 hover:border-primary hover:scale-105 hover:bg-secondary'
                  : 'border-border/50 bg-muted/40 opacity-40 cursor-not-allowed'
              }`}
              title={skin.name}
            >
              <SkinAvatar skin={skin} size={unlocked ? 32 : 28} dimmed={!unlocked} />
              <span className={`font-pixel text-[5px] mt-0.5 text-center leading-tight truncate w-full ${
                equipped ? 'text-primary' : unlocked ? 'text-foreground/70' : 'text-muted-foreground'
              }`}>
                {skin.name}
              </span>
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm opacity-60">🔒</span>
                </div>
              )}
              {equipped && (
                <span className="absolute -top-1.5 -right-1.5 text-[7px] bg-primary text-primary-foreground px-1 py-0.5 rounded-sm font-pixel">
                  ✓
                </span>
              )}
              {skin.premium && unlocked && !equipped && (
                <span className="absolute -top-1 -left-1 text-[6px]">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => { playSound('select'); onBack(); }}
        className="px-5 sm:px-6 py-2 font-pixel text-[9px] sm:text-[10px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20 rounded"
      >
        ← BACK
      </button>
    </div>
  );
};

export default SkinSelector;
