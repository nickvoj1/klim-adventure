import React from 'react';
import { playSound } from '@/game/audio';

interface GameOverScreenProps {
  onRetry: () => void;
  onMenu: () => void;
  levelCoins: number;
}

const ENCOURAGEMENTS = [
  "Almost got it! 💪",
  "You're SO close! 🔥",
  "Try again, legend! 🌟",
  "Don't give up! 🚀",
  "One more try! ⚡",
  "You got this! 😎",
  "Keep going, champ! 🏆",
];

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRetry, onMenu, levelCoins }) => {
  const message = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h1 className="text-2xl sm:text-3xl font-pixel text-destructive mb-2 sm:mb-3 pixel-shadow z-20">
        GAME OVER
      </h1>

      <p className="text-xs sm:text-sm font-pixel text-accent mb-1 z-20 animate-bounce-slow">
        {message}
      </p>

      <p className="text-[9px] sm:text-xs font-pixel text-muted-foreground mb-4 z-20">
        You lost 🪙 {levelCoins} coins
      </p>

      <div className="flex flex-col gap-3 z-20 w-full max-w-[280px]">
        <button
          onClick={() => { playSound('select'); onRetry(); }}
          className="px-6 sm:px-8 py-3 font-pixel text-xs sm:text-sm bg-primary text-primary-foreground pixel-border hover:scale-105 transition-transform w-full"
        >
          ↩ RETRY LEVEL
        </button>
        <button
          onClick={() => { playSound('select'); onMenu(); }}
          className="px-6 sm:px-8 py-3 font-pixel text-xs sm:text-sm bg-secondary text-secondary-foreground border-2 border-border hover:border-primary transition-colors w-full"
        >
          🏠 MAIN MENU
        </button>

        {/* Ad placeholder */}
        <button
          disabled
          className="px-6 sm:px-8 py-3 font-pixel text-[8px] sm:text-[9px] bg-muted text-muted-foreground border border-border cursor-not-allowed w-full relative"
        >
          📺 WATCH AD FOR EXTRA LIFE
          <span className="absolute -top-1 -right-1 px-1 py-0.5 text-[5px] font-pixel bg-accent text-accent-foreground">
            SOON
          </span>
        </button>
      </div>

      <div className="absolute bottom-4 text-3xl sm:text-4xl animate-pulse-glow z-0">💀</div>
    </div>
  );
};

export default GameOverScreen;
