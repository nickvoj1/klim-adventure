import React, { useEffect, useState } from 'react';
import { playSound } from '@/game/audio';
import { ACHIEVEMENTS } from '@/game/constants';

interface MainMenuProps {
  onPlay: () => void;
  onShop: () => void;
  onSkins: () => void;
  onAchievements: () => void;
  totalCoins: number;
  hasDailyReward: boolean;
  unclaimedAchievements: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onShop, onSkins, onAchievements, totalCoins, hasDailyReward, unclaimedAchievements }) => {
  const [selected, setSelected] = useState(0);
  const buttons = [
    { label: '▶ PLAY', action: onPlay, notify: false },
    { label: '🎨 SKINS', action: onSkins, notify: false },
    { label: '🛒 SHOP', action: onShop, notify: false },
    { label: '🏆 BADGES', action: onAchievements, notify: unclaimedAchievements > 0 },
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

      {/* Floating animated emojis */}
      <div className="absolute top-6 left-6 text-xl sm:text-2xl animate-bounce-slow">🎮</div>
      <div className="absolute top-10 right-8 text-lg sm:text-xl animate-wiggle" style={{ animationDelay: '0.3s' }}>🔥</div>
      <div className="absolute bottom-16 left-10 text-xl sm:text-2xl animate-float">🌵</div>
      <div className="absolute bottom-16 right-10 text-xl sm:text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🏜️</div>
      <div className="absolute top-4 right-4 text-base sm:text-lg animate-sparkle">⭐</div>
      <div className="absolute bottom-8 left-1/2 text-lg animate-bounce-slow" style={{ animationDelay: '1s' }}>💀</div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-primary glow-green mb-1 sm:mb-2 pixel-shadow text-center leading-relaxed z-20">
        PIXEL
      </h1>
      <h1 className="text-lg sm:text-xl md:text-2xl font-pixel text-accent glow-gold mb-4 sm:mb-6 pixel-shadow text-center leading-relaxed z-20">
        PLATFORMER
      </h1>

      <div className="text-xs sm:text-sm font-pixel text-accent mb-4 sm:mb-6 z-20 flex items-center gap-2">
        🪙 {totalCoins} COINS
        {hasDailyReward && (
          <span className="px-1.5 py-0.5 text-[6px] bg-accent text-accent-foreground animate-wiggle">
            🎁 REWARD!
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 z-20 w-full max-w-[280px]">
        {buttons.map((btn, i) => (
          <button
            key={btn.label}
            onClick={() => { playSound('select'); btn.action(); }}
            onMouseEnter={() => setSelected(i)}
            className={`px-6 sm:px-8 py-3 sm:py-4 font-pixel text-xs sm:text-sm transition-all duration-100 w-full relative ${
              selected === i
                ? 'bg-primary text-primary-foreground pixel-border scale-105'
                : 'bg-secondary text-secondary-foreground border-2 border-border hover:border-primary'
            }`}
          >
            {btn.label}
            {btn.notify && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[6px] font-pixel text-destructive-foreground animate-pulse-glow">
                {unclaimedAchievements}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 text-[7px] sm:text-[8px] font-pixel text-muted-foreground text-center space-y-1 z-20">
        <p>WASD / ARROWS + SPACE TO JUMP</p>
        <p>SHIFT TO SPRINT • S TO CROUCH</p>
      </div>
    </div>
  );
};

export default MainMenu;
