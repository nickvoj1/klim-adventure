import React from 'react';
import { playSound } from '@/game/audio';

interface GameOverScreenProps {
  onRetry: () => void;
  onMenu: () => void;
  levelCoins: number;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRetry, onMenu, levelCoins }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h1 className="text-3xl font-pixel text-destructive mb-4 pixel-shadow">
        GAME OVER
      </h1>

      <p className="text-sm font-pixel text-muted-foreground mb-2">
        You lost 🪙 {levelCoins} coins
      </p>

      <div className="flex flex-col gap-3 mt-8 z-20">
        <button
          onClick={() => { playSound('select'); onRetry(); }}
          className="px-8 py-3 font-pixel text-sm bg-primary text-primary-foreground pixel-border hover:scale-105 transition-transform"
        >
          ↩ RETRY LEVEL
        </button>
        <button
          onClick={() => { playSound('select'); onMenu(); }}
          className="px-8 py-3 font-pixel text-sm bg-secondary text-secondary-foreground border-2 border-border hover:border-primary transition-colors"
        >
          🏠 MAIN MENU
        </button>
      </div>

      <div className="absolute bottom-4 text-4xl animate-pulse-glow">💀</div>
    </div>
  );
};

export default GameOverScreen;
