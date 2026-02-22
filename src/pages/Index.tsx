import React, { useState, useCallback, useEffect } from 'react';
import { GameScreen as GameScreenType, GameProgress } from '@/game/types';
import { DEFAULT_PROGRESS } from '@/game/constants';
import MainMenu from '@/components/game/MainMenu';
import GameScreen from '@/components/game/GameScreen';
import GameOverScreen from '@/components/game/GameOverScreen';
import WorldMap from '@/components/game/WorldMap';
import SkinSelector from '@/components/game/SkinSelector';
import ShopScreen from '@/components/game/ShopScreen';

const STORAGE_KEY = 'pixel-platformer-progress';

function loadProgress(): GameProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_PROGRESS();
}

function saveProgress(p: GameProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

const Index = () => {
  const [screen, setScreen] = useState<GameScreenType>('menu');
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [levelCoins, setLevelCoins] = useState(0);
  const [playingLevel, setPlayingLevel] = useState(0);

  // Persist progress
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Opened chests tracking
  const openedChests = new Set<string>();
  progress.unlockedSkins.forEach((unlocked, i) => {
    if (unlocked && i > 0 && i < 30) {
      // Find which level this skin belongs to (skinIndex matches level chest)
      openedChests.add(`${i - 1}-${i}`);
    }
  });

  const handlePlay = useCallback(() => {
    setScreen('worldmap');
  }, []);

  const handleSelectLevel = useCallback((levelIdx: number) => {
    setPlayingLevel(levelIdx);
    setLevelCoins(0);
    setProgress(p => ({ ...p, lives: 3 }));
    setScreen('playing');
  }, []);

  const handleLevelComplete = useCallback((coins: number) => {
    setProgress(p => {
      const newProgress = { ...p };
      newProgress.totalCoins += coins;
      newProgress.currentLevel = playingLevel + 1;
      if (playingLevel + 1 >= p.unlockedLevels) {
        newProgress.unlockedLevels = playingLevel + 2;
      }
      return newProgress;
    });
    setScreen('worldmap');
  }, [playingLevel]);

  const handleGameOver = useCallback(() => {
    setScreen('gameover');
  }, []);

  const handleRetry = useCallback(() => {
    setProgress(p => ({ ...p, lives: 3 }));
    setLevelCoins(0);
    setScreen('playing');
  }, []);

  const handleLivesChange = useCallback((lives: number) => {
    setProgress(p => ({ ...p, lives }));
  }, []);

  const handleChestOpen = useCallback((skinIndex: number) => {
    setProgress(p => {
      const skins = [...p.unlockedSkins];
      skins[skinIndex] = true;
      return { ...p, unlockedSkins: skins };
    });
  }, []);

  const handleEquipSkin = useCallback((index: number) => {
    setProgress(p => ({ ...p, equippedSkin: index }));
  }, []);

  const handleBuySkin = useCallback((skinIndex: number, price: number) => {
    setProgress(p => {
      if (p.totalCoins < price) return p;
      const skins = [...p.unlockedSkins];
      skins[skinIndex] = true;
      return { ...p, totalCoins: p.totalCoins - price, unlockedSkins: skins };
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-background p-2 sm:p-4 overflow-hidden">
      {screen === 'menu' && (
        <MainMenu
          onPlay={handlePlay}
          onShop={() => setScreen('shop')}
          onSkins={() => setScreen('skins')}
          totalCoins={progress.totalCoins}
        />
      )}

      {screen === 'worldmap' && (
        <WorldMap
          unlockedLevels={progress.unlockedLevels}
          currentLevel={progress.currentLevel}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'playing' && (
        <GameScreen
          levelIndex={playingLevel}
          skinIndex={progress.equippedSkin}
          lives={progress.lives}
          openedChests={openedChests}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
          onLivesChange={handleLivesChange}
          onCoinsChange={setLevelCoins}
          onChestOpen={handleChestOpen}
          onBack={() => setScreen('worldmap')}
        />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          onRetry={handleRetry}
          onMenu={() => setScreen('menu')}
          levelCoins={levelCoins}
        />
      )}

      {screen === 'skins' && (
        <SkinSelector
          unlockedSkins={progress.unlockedSkins}
          equippedSkin={progress.equippedSkin}
          onEquip={handleEquipSkin}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'shop' && (
        <ShopScreen
          totalCoins={progress.totalCoins}
          unlockedSkins={progress.unlockedSkins}
          onBuy={handleBuySkin}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
};

export default Index;
