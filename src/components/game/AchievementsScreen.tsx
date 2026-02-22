import React from 'react';
import { ACHIEVEMENTS } from '@/game/constants';
import { GameProgress } from '@/game/types';
import { playSound } from '@/game/audio';

interface AchievementsScreenProps {
  progress: GameProgress;
  onClaimReward: (achievementId: string, reward: number) => void;
  onBack: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ progress, onClaimReward, onBack }) => {
  return (
    <div className="flex flex-col items-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-accent glow-gold mb-1 sm:mb-2 z-20">🏆 ACHIEVEMENTS</h2>
      <p className="text-[8px] sm:text-[9px] font-pixel text-muted-foreground mb-3 z-20">
        {progress.unlockedAchievements.length}/{ACHIEVEMENTS.length} unlocked
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 z-20 mb-4 w-full max-w-[500px] overflow-y-auto max-h-[50vh]">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = ach.check(progress);
          const claimed = progress.unlockedAchievements.includes(ach.id);
          const canClaim = unlocked && !claimed;

          return (
            <div
              key={ach.id}
              className={`flex items-center gap-2 p-2 sm:p-3 border transition-all ${
                claimed
                  ? 'border-primary bg-primary/10'
                  : unlocked
                  ? 'border-accent bg-accent/10 animate-pulse-glow'
                  : 'border-border bg-secondary opacity-60'
              }`}
            >
              <span className={`text-lg sm:text-xl ${!unlocked ? 'grayscale opacity-40' : ''}`}>
                {ach.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[7px] sm:text-[8px] font-pixel text-foreground truncate">{ach.name}</p>
                <p className="text-[6px] sm:text-[7px] font-pixel text-muted-foreground">{ach.description}</p>
                <p className="text-[6px] font-pixel text-accent">🪙 {ach.reward}</p>
              </div>
              {canClaim && (
                <button
                  onClick={() => { playSound('chest'); onClaimReward(ach.id, ach.reward); }}
                  className="px-2 py-1 text-[6px] sm:text-[7px] font-pixel bg-accent text-accent-foreground border border-accent hover:scale-105 transition-transform animate-wiggle shrink-0"
                >
                  CLAIM
                </button>
              )}
              {claimed && (
                <span className="text-[7px] font-pixel text-primary shrink-0">✅</span>
              )}
            </div>
          );
        })}
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

export default AchievementsScreen;
