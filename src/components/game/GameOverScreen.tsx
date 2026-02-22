import React from 'react';
import { playSound } from '@/game/audio';

interface GameOverScreenProps {
  onRetry: () => void;
  onMenu: () => void;
  levelCoins: number;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRetry, onMenu, levelCoins }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h1 className="text-2xl sm:text-3xl font-pixel text-destructive mb-3 sm:mb-4 pixel-shadow">
        GAME OVER
      </h1>

      <p className="text-xs sm:text-sm font-pixel text-muted-foreground mb-2">
        You lost 🪙 {levelCoins} coins
      </p>

      <div className="flex flex-col gap-3 mt-6 sm:mt-8 z-20 w-full max-w-[280px]">
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
      </div>

      <div className="absolute bottom-4 text-3xl sm:text-4xl animate-pulse-glow">💀</div>
    </div>
  );
};

export default GameOverScreen;
