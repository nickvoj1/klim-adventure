import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameEngine } from '@/game/engine';

interface GameScreenProps {
  levelIndex: number;
  skinIndex: number;
  lives: number;
  openedChests: Set<string>;
  onLevelComplete: (coins: number) => void;
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
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
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
  }, []);

  const touchEnd = useCallback((dir: string) => {
    if (!engineRef.current) return;
    if (dir === 'left') engineRef.current.touchState.left = false;
    if (dir === 'right') engineRef.current.touchState.right = false;
    if (dir === 'sprint') engineRef.current.touchState.sprint = false;
  }, []);

  return (
    <div className="relative w-full max-w-[800px] select-none">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-2 right-2 z-30 px-2 py-1 text-[8px] font-pixel bg-secondary text-secondary-foreground border border-border hover:border-primary"
      >
        ESC
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-auto pixel-border"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Touch Controls */}
      {isMobile && (
        <div className="flex justify-between items-end mt-2 px-2">
          {/* Left side - D-pad */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => touchStart('left')}
              onTouchEnd={() => touchEnd('left')}
              className="w-14 h-14 bg-secondary border-2 border-border text-secondary-foreground font-pixel text-xl active:bg-primary active:text-primary-foreground rounded-sm"
            >
              ◀
            </button>
            <button
              onTouchStart={() => touchStart('right')}
              onTouchEnd={() => touchEnd('right')}
              className="w-14 h-14 bg-secondary border-2 border-border text-secondary-foreground font-pixel text-xl active:bg-primary active:text-primary-foreground rounded-sm"
            >
              ▶
            </button>
            <button
              onTouchStart={() => touchStart('sprint')}
              onTouchEnd={() => touchEnd('sprint')}
              className="w-10 h-14 bg-secondary border-2 border-border text-secondary-foreground font-pixel text-[8px] active:bg-accent active:text-accent-foreground rounded-sm"
            >
              RUN
            </button>
          </div>

          {/* Right side - Jump */}
          <button
            onTouchStart={() => touchStart('jump')}
            className="w-16 h-16 bg-primary border-2 border-primary text-primary-foreground font-pixel text-sm active:scale-95 rounded-sm"
          >
            JUMP
          </button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
