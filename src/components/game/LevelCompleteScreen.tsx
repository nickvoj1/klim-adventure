import React, { useEffect, useState } from 'react';
import { playSound } from '@/game/audio';
import { LevelStats } from '@/game/types';
import { LEVELS } from '@/game/levels';

interface LevelCompleteScreenProps {
  levelIndex: number;
  stats: LevelStats;
  onNextLevel: () => void;
  onWorldMap: () => void;
}

const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({ levelIndex, stats, onNextLevel, onWorldMap }) => {
  const [showStars, setShowStars] = useState(0);
  const level = LEVELS[levelIndex];

  // Calculate stars: 1=complete, 2=all coins, 3=all coins + under 60s
  const stars = 1 + (stats.coinsCollected >= stats.totalCoins ? 1 : 0) + (stats.coinsCollected >= stats.totalCoins && stats.timeTaken < 60 ? 1 : 0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= stars; i++) {
      timers.push(setTimeout(() => {
        setShowStars(i);
        playSound('coin');
      }, i * 400));
    }
    return () => timers.forEach(clearTimeout);
  }, [stars]);

  const confetti = ['🎉', '⭐', '🪙', '🎊', '✨', '🏆', '💎', '🌟'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      {/* Confetti */}
      {confetti.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-lg sm:text-2xl animate-confetti z-0"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        >
          {emoji}
        </div>
      ))}

      <h1 className="text-lg sm:text-2xl font-pixel text-primary glow-green mb-1 z-20 animate-bounce-slow">
        LEVEL COMPLETE!
      </h1>
      <p className="text-[8px] sm:text-[10px] font-pixel text-muted-foreground mb-4 z-20">
        {level?.name || `Level ${levelIndex + 1}`}
      </p>

      {/* Stars */}
      <div className="flex gap-2 mb-4 z-20">
        {[1, 2, 3].map(s => (
          <span
            key={s}
            className={`text-2xl sm:text-3xl transition-all duration-300 ${
              s <= showStars ? 'scale-110 animate-sparkle' : 'opacity-20 grayscale'
            }`}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1 mb-4 z-20 text-center">
        <p className="text-[8px] sm:text-[10px] font-pixel text-accent">
          🪙 {stats.coinsCollected}/{stats.totalCoins} coins
        </p>
        <p className="text-[8px] sm:text-[10px] font-pixel text-foreground">
          ⏱ {Math.floor(stats.timeTaken)}s
        </p>
        <p className="text-[8px] sm:text-[10px] font-pixel text-foreground">
          🤖 {stats.robotsKilled} robots defeated
        </p>
        {!stats.wasHit && (
          <p className="text-[8px] sm:text-[10px] font-pixel text-primary animate-sparkle">
            ✨ PERFECT RUN — No hits!
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 z-20 w-full max-w-[280px]">
        <button
          onClick={() => { playSound('select'); onNextLevel(); }}
          className="px-6 py-3 font-pixel text-xs bg-primary text-primary-foreground pixel-border hover:scale-105 transition-transform w-full"
        >
          ▶ NEXT LEVEL
        </button>
        <button
          onClick={() => { playSound('select'); onWorldMap(); }}
          className="px-6 py-3 font-pixel text-[9px] sm:text-[10px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary w-full"
        >
          🗺 WORLD MAP
        </button>
      </div>
    </div>
  );
};

export default LevelCompleteScreen;
