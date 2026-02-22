import React from 'react';
import { SKINS } from '@/game/constants';
import { playSound } from '@/game/audio';

interface SkinSelectorProps {
  unlockedSkins: boolean[];
  equippedSkin: number;
  onEquip: (index: number) => void;
  onBack: () => void;
}

const SkinSelector: React.FC<SkinSelectorProps> = ({ unlockedSkins, equippedSkin, onEquip, onBack }) => {
  return (
    <div className="flex flex-col items-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-primary glow-green mb-3 sm:mb-4">SKINS</h2>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-2 z-20 mb-3 sm:mb-4 max-h-[50vh] sm:max-h-[260px] overflow-y-auto p-1 sm:p-2 w-full">
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
              className={`w-full aspect-[3/4] flex flex-col items-center justify-center border transition-all relative ${
                equipped
                  ? 'border-primary bg-primary/20 scale-105'
                  : unlocked
                  ? 'border-border bg-secondary hover:border-primary hover:scale-105'
                  : 'border-border bg-muted opacity-30 cursor-not-allowed'
              }`}
              title={skin.name}
            >
              <div className="flex flex-col items-center">
                <div className="w-3 sm:w-4 h-1.5 sm:h-2" style={{ backgroundColor: skin.hairColor }} />
                <div className="w-3 sm:w-4 h-2 sm:h-3" style={{ backgroundColor: skin.headColor }} />
                <div className="w-4 sm:w-5 h-2 sm:h-3" style={{ backgroundColor: skin.bodyColor }} />
                <div className="w-4 sm:w-5 h-2 sm:h-3" style={{ backgroundColor: skin.pantsColor }} />
              </div>
              {!unlocked && <span className="absolute text-[8px] sm:text-[10px]">🔒</span>}
              {equipped && (
                <span className="absolute -top-1 -right-1 text-[6px] sm:text-[8px] bg-primary text-primary-foreground px-0.5 sm:px-1">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-[7px] sm:text-[8px] font-pixel text-muted-foreground mb-3 sm:mb-4 z-20">
        Equipped: {SKINS[equippedSkin].name}
      </div>

      <button
        onClick={() => { playSound('select'); onBack(); }}
        className="px-5 sm:px-6 py-2 font-pixel text-[9px] sm:text-[10px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20"
      >
        ← BACK
      </button>
    </div>
  );
};

export default SkinSelector;
