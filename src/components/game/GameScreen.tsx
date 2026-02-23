import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameEngine } from '@/game/engine';
import { LevelStats } from '@/game/types';

interface GameScreenProps {
  levelIndex: number;
  skinIndex: number;
  lives: number;
  openedChests: Set<string>;
  onLevelComplete: (coins: number, stats: LevelStats) => void;
  onGameOver: () => void;
  onLivesChange: (lives: number) => void;
  onCoinsChange: (coins: number) => void;
  onChestOpen: (skinIndex: number) => void;
  onBack: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  levelIndex, skinIndex, lives, openedChests,
  onLevelComplete, onGameOver, onLivesChange, onCoinsChange, onChestOpen, onBack
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new GameEngine(
      canvasRef.current,
      levelIndex,
      skinIndex,
      lives,
      openedChests,
      {
        onLevelComplete,
        onGameOver,
        onLivesChange,
        onLevelCoinsChange: onCoinsChange,
        onChestOpen,
      }
    );
    engineRef.current = engine;
    engine.start();
    return () => engine.stop();
  }, [levelIndex, skinIndex]);

  const touchStart = useCallback((dir: string) => {
    if (!engineRef.current) return;
    if (dir === 'left') engineRef.current.touchState.left = true;
    if (dir === 'right') engineRef.current.touchState.right = true;
    if (dir === 'jump') engineRef.current.touchState.jump = true;
    if (dir === 'sprint') engineRef.current.touchState.sprint = true;
    if (dir === 'punch') engineRef.current.touchState.punch = true;
    if (dir === 'kick') engineRef.current.touchState.kick = true;
    if (dir === 'special') engineRef.current.touchState.special = true;
  }, []);

  const touchEnd = useCallback((dir: string) => {
    if (!engineRef.current) return;
    if (dir === 'left') engineRef.current.touchState.left = false;
    if (dir === 'right') engineRef.current.touchState.right = false;
    if (dir === 'sprint') engineRef.current.touchState.sprint = false;
  }, []);

  return (
    <div className="relative w-full max-w-[800px] select-none flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-1 right-1 z-30 px-2 py-1 text-[8px] font-pixel bg-secondary/80 text-secondary-foreground border border-border hover:border-primary"
      >
        ESC
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-auto pixel-border touch-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Touch Controls - always show on mobile */}
      {isMobile && (
        <div className="flex justify-between items-center mt-3 px-1 pb-2">
          {/* Left side - D-pad + sprint */}
          <div className="flex gap-1.5 items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); touchStart('left'); }}
              onTouchEnd={(e) => { e.preventDefault(); touchEnd('left'); }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/90 border-2 border-border text-secondary-foreground font-pixel text-2xl active:bg-primary active:text-primary-foreground rounded-lg flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); touchStart('right'); }}
              onTouchEnd={(e) => { e.preventDefault(); touchEnd('right'); }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/90 border-2 border-border text-secondary-foreground font-pixel text-2xl active:bg-primary active:text-primary-foreground rounded-lg flex items-center justify-center"
            >
              ▶
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); touchStart('sprint'); }}
              onTouchEnd={(e) => { e.preventDefault(); touchEnd('sprint'); }}
              className="w-11 h-14 sm:w-12 sm:h-16 bg-accent/20 border-2 border-accent/50 text-accent font-pixel text-[8px] active:bg-accent active:text-accent-foreground rounded-lg flex items-center justify-center"
            >
              RUN
            </button>
          </div>

          {/* Right side - Attack buttons + Jump */}
          <div className="flex gap-1.5 items-center">
            <div className="flex flex-col gap-1">
              <button
                onTouchStart={(e) => { e.preventDefault(); touchStart('punch'); }}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-yellow-600/80 border-2 border-yellow-500 text-white font-pixel text-[8px] active:bg-yellow-400 rounded-lg flex items-center justify-center"
              >
                👊
              </button>
              <button
                onTouchStart={(e) => { e.preventDefault(); touchStart('kick'); }}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-600/80 border-2 border-orange-500 text-white font-pixel text-[8px] active:bg-orange-400 rounded-lg flex items-center justify-center"
              >
                🦶
              </button>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <button
                onTouchStart={(e) => { e.preventDefault(); touchStart('special'); }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-600/80 border-2 border-cyan-400 text-white font-pixel text-[8px] active:bg-cyan-400 rounded-lg flex items-center justify-center"
              >
                ⚡
              </button>
              <button
                onTouchStart={(e) => { e.preventDefault(); touchStart('jump'); }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 border-3 border-primary text-primary-foreground font-pixel text-xs active:scale-90 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform"
              >
                JUMP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
