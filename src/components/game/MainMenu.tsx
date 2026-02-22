import React, { useEffect, useState } from 'react';
import { playSound } from '@/game/audio';

interface MainMenuProps {
  onPlay: () => void;
  onShop: () => void;
  onSkins: () => void;
  totalCoins: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onShop, onSkins, totalCoins }) => {
  const [selected, setSelected] = useState(0);
  const buttons = [
    { label: '▶ PLAY', action: onPlay },
    { label: '🎨 SKINS', action: onSkins },
    { label: '🛒 SHOP', action: onShop },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setSelected(s => (s + 1) % buttons.length);
        playSound('select');
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        setSelected(s => (s - 1 + buttons.length) % buttons.length);
        playSound('select');
      } else if (e.code === 'Enter' || e.code === 'Space') {
        buttons[selected].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-primary glow-green mb-1 sm:mb-2 pixel-shadow text-center leading-relaxed">
        PIXEL
      </h1>
      <h1 className="text-lg sm:text-xl md:text-2xl font-pixel text-accent glow-gold mb-6 sm:mb-8 pixel-shadow text-center leading-relaxed">
        PLATFORMER
      </h1>

      <div className="text-xs sm:text-sm font-pixel text-accent mb-6 sm:mb-8">
        🪙 {totalCoins} COINS
      </div>

      <div className="flex flex-col gap-3 z-20 w-full max-w-[280px]">
        {buttons.map((btn, i) => (
          <button
            key={btn.label}
            onClick={() => { playSound('select'); btn.action(); }}
            onMouseEnter={() => setSelected(i)}
            className={`px-6 sm:px-8 py-3 sm:py-4 font-pixel text-xs sm:text-sm transition-all duration-100 w-full ${
              selected === i
                ? 'bg-primary text-primary-foreground pixel-border scale-105'
                : 'bg-secondary text-secondary-foreground border-2 border-border hover:border-primary'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 text-[7px] sm:text-[8px] font-pixel text-muted-foreground text-center space-y-1">
        <p>WASD / ARROWS + SPACE TO JUMP</p>
        <p>SHIFT TO SPRINT • S TO CROUCH</p>
      </div>

      <div className="absolute bottom-4 left-4 text-xl sm:text-2xl animate-float">🌵</div>
      <div className="absolute bottom-4 right-4 text-xl sm:text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🏜️</div>
      <div className="absolute top-4 right-4 text-base sm:text-lg animate-pulse-glow">⭐</div>
    </div>
  );
};

export default MainMenu;
