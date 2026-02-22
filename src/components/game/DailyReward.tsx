import React from 'react';
import { DAILY_REWARDS } from '@/game/constants';
import { playSound } from '@/game/audio';

interface DailyRewardProps {
  streak: number;
  onClaim: (coins: number) => void;
  onClose: () => void;
}

const DailyReward: React.FC<DailyRewardProps> = ({ streak, onClaim, onClose }) => {
  const dayIndex = Math.min(streak, 6);
  const reward = DAILY_REWARDS[dayIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="flex flex-col items-center bg-card border-2 border-accent p-4 sm:p-6 max-w-[340px] w-full relative">
        <div className="absolute inset-0 scanlines pointer-events-none" />

        <h2 className="text-sm sm:text-base font-pixel text-accent glow-gold mb-1 animate-bounce-slow z-10">
          🎁 DAILY REWARD!
        </h2>
        <p className="text-[8px] sm:text-[9px] font-pixel text-muted-foreground mb-3 z-10">
          Day {dayIndex + 1} Streak!
        </p>

        <div className="grid grid-cols-7 gap-1 mb-4 z-10 w-full">
          {DAILY_REWARDS.map((r, i) => (
            <div
              key={i}
              className={`flex flex-col items-center p-1 border text-center ${
                i < streak
                  ? 'border-primary bg-primary/20'
                  : i === dayIndex
                  ? 'border-accent bg-accent/20 animate-pulse-glow'
                  : 'border-border bg-secondary'
              }`}
            >
              <span className="text-[6px] font-pixel text-muted-foreground">D{i + 1}</span>
              <span className="text-[7px] font-pixel text-accent">{r}</span>
              {i < streak && <span className="text-[8px]">✅</span>}
              {i === dayIndex && <span className="text-[8px] animate-wiggle">🎁</span>}
            </div>
          ))}
        </div>

        {streak === 6 && (
          <p className="text-[7px] font-pixel text-primary mb-2 z-10 animate-sparkle">
            🌟 BONUS: +200 coins + mystery skin!
          </p>
        )}

        <div className="flex gap-2 z-10">
          <button
            onClick={() => { playSound('chest'); onClaim(reward); }}
            className="px-4 sm:px-6 py-2 sm:py-3 font-pixel text-[9px] sm:text-xs bg-accent text-accent-foreground pixel-border hover:scale-105 transition-transform animate-bounce-slow"
          >
            🪙 CLAIM {reward} COINS
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-2 text-[7px] font-pixel text-muted-foreground hover:text-foreground z-10"
        >
          skip →
        </button>
      </div>
    </div>
  );
};

export default DailyReward;
