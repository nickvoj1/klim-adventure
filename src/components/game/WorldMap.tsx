import React from 'react';
import { WORLD_MAP, LEVELS } from '@/game/levels';
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-xl font-pixel text-primary glow-green mb-4 sm:mb-6">WORLD MAP</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 z-20 mb-4 sm:mb-6 w-full max-w-[500px]">
        {WORLD_MAP.map((world, wi) => (
          <div key={world.name} className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl">{worldIcons[wi]}</span>
            <span className="text-[7px] sm:text-[8px] font-pixel text-muted-foreground">{world.name}</span>
            <div className="flex gap-0.5 sm:gap-1 flex-wrap justify-center">
              {world.levels.map((lvl) => {
                const levelIdx = lvl - 1;
                const unlocked = levelIdx < unlockedLevels;
                const isCurrent = levelIdx === currentLevel;
                const hasData = levelIdx < LEVELS.length;

                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      if (unlocked && hasData) {
                        playSound('select');
                        onSelectLevel(levelIdx);
                      }
                    }}
                    disabled={!unlocked || !hasData}
                    className={`w-6 h-6 sm:w-7 sm:h-7 font-pixel text-[7px] sm:text-[8px] border transition-all ${
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
        className="px-5 sm:px-6 py-2 font-pixel text-[9px] sm:text-[10px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20"
      >
        ← BACK
      </button>
    </div>
  );
};

export default WorldMap;
