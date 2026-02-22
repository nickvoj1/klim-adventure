import React from 'react';
import { WORLD_MAP } from '@/game/levels';
import { playSound } from '@/game/audio';

interface WorldMapProps {
  unlockedLevels: number;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ unlockedLevels, currentLevel, onSelectLevel, onBack }) => {
  const worldIcons = ['🏜️', '🌴', '🏝️', '⛰️', '❄️', '🌋'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-xl font-pixel text-primary glow-green mb-6">WORLD MAP</h2>

      <div className="grid grid-cols-3 gap-4 z-20 mb-6">
        {WORLD_MAP.map((world, wi) => (
          <div key={world.name} className="flex flex-col items-center gap-2">
            <span className="text-2xl">{worldIcons[wi]}</span>
            <span className="text-[8px] font-pixel text-muted-foreground">{world.name}</span>
            <div className="flex gap-1">
              {world.levels.map((lvl) => {
                const levelIdx = lvl - 1;
                const unlocked = levelIdx < unlockedLevels;
                const isCurrent = levelIdx === currentLevel;
                const playable = levelIdx < 2; // MVP: only 2 levels

                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      if (unlocked && playable) {
                        playSound('select');
                        onSelectLevel(levelIdx);
                      }
                    }}
                    disabled={!unlocked || !playable}
                    className={`w-7 h-7 font-pixel text-[8px] border transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground border-primary animate-pulse-glow'
                        : unlocked && playable
                        ? 'bg-secondary text-secondary-foreground border-border hover:border-primary hover:scale-110'
                        : 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { playSound('select'); onBack(); }}
        className="px-6 py-2 font-pixel text-[10px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20"
      >
        ← BACK
      </button>
    </div>
  );
};

export default WorldMap;
