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
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-pixel text-primary glow-green mb-2 pixel-shadow text-center leading-relaxed">
        PIXEL
      </h1>
      <h1 className="text-xl md:text-2xl font-pixel text-accent glow-gold mb-8 pixel-shadow text-center leading-relaxed">
        PLATFORMER
      </h1>

      {/* Coins display */}
      <div className="text-sm font-pixel text-accent mb-8">
        🪙 {totalCoins} COINS
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 z-20">
        {buttons.map((btn, i) => (
          <button
            key={btn.label}
            onClick={() => { playSound('select'); btn.action(); }}
            onMouseEnter={() => setSelected(i)}
            className={`px-8 py-3 font-pixel text-sm transition-all duration-100 ${
              selected === i
                ? 'bg-primary text-primary-foreground pixel-border scale-105'
                : 'bg-secondary text-secondary-foreground border-2 border-border hover:border-primary'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Controls hint */}
      <div className="mt-8 text-[8px] font-pixel text-muted-foreground text-center space-y-1">
        <p>WASD / ARROWS + SPACE TO JUMP</p>
        <p>SHIFT TO SPRINT • S TO CROUCH</p>
      </div>

      {/* Animated pixel decorations */}
      <div className="absolute bottom-4 left-4 text-2xl animate-float">🌵</div>
      <div className="absolute bottom-4 right-4 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🏜️</div>
      <div className="absolute top-4 right-4 text-lg animate-pulse-glow">⭐</div>
    </div>
  );
};

export default MainMenu;
