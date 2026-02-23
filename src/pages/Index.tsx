import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GameScreen as GameScreenType, GameProgress, LevelStats } from '@/game/types';
import { DEFAULT_PROGRESS, ACHIEVEMENTS, DAILY_REWARDS } from '@/game/constants';
import { supabase } from '@/integrations/supabase/client';
import MainMenu from '@/components/game/MainMenu';
import GameScreen from '@/components/game/GameScreen';
import GameOverScreen from '@/components/game/GameOverScreen';
import WorldMap from '@/components/game/WorldMap';
import SkinSelector from '@/components/game/SkinSelector';
import ShopScreen from '@/components/game/ShopScreen';
import AchievementsScreen from '@/components/game/AchievementsScreen';
import LevelCompleteScreen from '@/components/game/LevelCompleteScreen';
import DailyReward from '@/components/game/DailyReward';
import AuthScreen from '@/components/game/AuthScreen';
import LeaderboardScreen from '@/components/game/LeaderboardScreen';
import ChestRoulette from '@/components/game/ChestRoulette';
import type { Session } from '@supabase/supabase-js';

const STORAGE_KEY = 'pixel-platformer-progress';

function loadProgress(): GameProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_PROGRESS(), ...parsed };
    }
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
  const [lastStats, setLastStats] = useState<LevelStats | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [chestSkinIndex, setChestSkinIndex] = useState<number | null>(null);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        setDisplayName(sess.user.user_metadata?.display_name || 'Player');
      }
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      if (sess?.user) {
        setDisplayName(sess.user.user_metadata?.display_name || 'Player');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Persist progress
  useEffect(() => { saveProgress(progress); }, [progress]);

  // Check daily reward on mount
  useEffect(() => {
    const now = Date.now();
    const lastClaim = progress.lastDailyReward || 0;
    const hoursSince = (now - lastClaim) / (1000 * 60 * 60);
    if (hoursSince >= 24) setShowDailyReward(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get('purchase') === 'success') {
      const coins = parseInt(params.get('coins') || '0', 10);
      if (coins > 0) setProgress(p => ({ ...p, totalCoins: p.totalCoins + coins }));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const hasDailyReward = useMemo(() => {
    const now = Date.now();
    const hoursSince = (now - (progress.lastDailyReward || 0)) / (1000 * 60 * 60);
    return hoursSince >= 24;
  }, [progress.lastDailyReward]);

  const unclaimedAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter(a => a.check(progress) && !progress.unlockedAchievements.includes(a.id)).length;
  }, [progress]);

  const openedChests = new Set<string>();
  progress.unlockedSkins.forEach((unlocked, i) => {
    if (unlocked && i > 0 && i < 30) openedChests.add(`${i - 1}-${i}`);
  });

  // Sync progress to leaderboard after level complete
  const syncToLeaderboard = useCallback(async (levelIdx: number, stats: LevelStats) => {
    if (!session?.user) return;
    try {
      // Upsert best time
      const { data: existing } = await supabase
        .from('leaderboard_entries')
        .select('best_time')
        .eq('user_id', session.user.id)
        .eq('level_index', levelIdx)
        .maybeSingle();

      if (!existing || stats.timeTaken < Number(existing.best_time)) {
        await supabase.from('leaderboard_entries').upsert({
          user_id: session.user.id,
          level_index: levelIdx,
          best_time: stats.timeTaken,
          coins_collected: stats.coinsCollected,
        }, { onConflict: 'user_id,level_index' });
      }

      // Update profile stats
      await supabase.from('profiles').update({
        total_coins: progress.totalCoins + stats.coinsCollected,
        total_levels_completed: (progress.totalLevelsCompleted || 0) + 1,
        total_robots_killed: (progress.totalRobotsKilled || 0) + stats.robotsKilled,
      }).eq('user_id', session.user.id);
    } catch (err) {
      console.error('Leaderboard sync error:', err);
    }
  }, [session, progress]);

  const handlePlay = useCallback(() => setScreen('worldmap'), []);

  const handleSelectLevel = useCallback((levelIdx: number) => {
    setPlayingLevel(levelIdx);
    setLevelCoins(0);
    setProgress(p => ({ ...p, lives: 3 }));
    setScreen('playing');
  }, []);

  const handleLevelComplete = useCallback((coins: number, stats: LevelStats) => {
    setLastStats(stats);
    setProgress(p => {
      const newProgress = { ...p };
      newProgress.totalCoins += coins;
      newProgress.currentLevel = playingLevel + 1;
      newProgress.totalLevelsCompleted = (p.totalLevelsCompleted || 0) + 1;
      newProgress.totalRobotsKilled = (p.totalRobotsKilled || 0) + stats.robotsKilled;
      if (playingLevel + 1 >= p.unlockedLevels) newProgress.unlockedLevels = playingLevel + 2;
      const bestTimes = { ...(p.bestLevelTimes || {}) };
      if (!bestTimes[playingLevel] || stats.timeTaken < bestTimes[playingLevel]) bestTimes[playingLevel] = stats.timeTaken;
      newProgress.bestLevelTimes = bestTimes;
      return newProgress;
    });
    syncToLeaderboard(playingLevel, stats);
    setScreen('levelcomplete');
  }, [playingLevel, syncToLeaderboard]);

  const handleGameOver = useCallback(() => setScreen('gameover'), []);

  const handleRetry = useCallback(() => {
    setProgress(p => ({ ...p, lives: 3 }));
    setLevelCoins(0);
    setScreen('playing');
  }, []);

  const handleLivesChange = useCallback((lives: number) => {
    setProgress(p => ({ ...p, lives }));
  }, []);

  const handleChestOpen = useCallback((_skinIndex: number) => {
    // skinIndex from level data is ignored; roulette picks randomly
    setChestSkinIndex(0); // just triggers the roulette overlay
  }, []);

  const handleChestRouletteComplete = useCallback((skinIndex: number, isDuplicate: boolean, dupeCoins: number) => {
    setProgress(p => {
      const newP = { ...p, totalChestsOpened: (p.totalChestsOpened || 0) + 1 };
      if (isDuplicate) {
        newP.totalCoins = p.totalCoins + dupeCoins;
      } else {
        const skins = [...p.unlockedSkins];
        skins[skinIndex] = true;
        newP.unlockedSkins = skins;
      }
      return newP;
    });
    setChestSkinIndex(null);
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

  const handleClaimDailyReward = useCallback((coins: number) => {
    setProgress(p => {
      const now = Date.now();
      const hoursSince = (now - (p.lastDailyReward || 0)) / (1000 * 60 * 60);
      let newStreak = hoursSince < 48 ? Math.min((p.dailyStreak || 0) + 1, 7) : 1;
      const newProgress = {
        ...p, totalCoins: p.totalCoins + coins,
        dailyStreak: newStreak >= 7 ? 0 : newStreak, lastDailyReward: now,
      };
      if (newStreak >= 7) {
        const lockedSkins = p.unlockedSkins.map((u, i) => (!u ? i : -1)).filter(i => i >= 0);
        if (lockedSkins.length > 0) {
          const randomSkin = lockedSkins[Math.floor(Math.random() * lockedSkins.length)];
          const skins = [...newProgress.unlockedSkins];
          skins[randomSkin] = true;
          newProgress.unlockedSkins = skins;
        }
      }
      return newProgress;
    });
    setShowDailyReward(false);
  }, []);

  const handleClaimAchievement = useCallback((achievementId: string, reward: number) => {
    setProgress(p => ({
      ...p, totalCoins: p.totalCoins + reward,
      unlockedAchievements: [...(p.unlockedAchievements || []), achievementId],
    }));
  }, []);

  const handleNextLevel = useCallback(() => {
    setPlayingLevel(prev => prev + 1);
    setLevelCoins(0);
    setProgress(p => ({ ...p, lives: 3 }));
    setScreen('playing');
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-background p-2 sm:p-4 overflow-hidden">
      {/* Chest Roulette Overlay */}
      {chestSkinIndex !== null && (
        <ChestRoulette
          unlockedSkins={progress.unlockedSkins}
          onComplete={handleChestRouletteComplete}
        />
      )}

      {showDailyReward && screen === 'menu' && (
        <DailyReward
          streak={progress.dailyStreak || 0}
          onClaim={handleClaimDailyReward}
          onClose={() => setShowDailyReward(false)}
        />
      )}

      {screen === 'menu' && (
        <MainMenu
          onPlay={handlePlay}
          onShop={() => setScreen('shop')}
          onSkins={() => setScreen('skins')}
          onAchievements={() => setScreen('achievements')}
          onLeaderboard={() => setScreen('leaderboard')}
          onAuth={() => setScreen('auth')}
          onLogout={handleLogout}
          totalCoins={progress.totalCoins}
          hasDailyReward={hasDailyReward}
          unclaimedAchievements={unclaimedAchievements}
          isLoggedIn={!!session}
          displayName={displayName}
        />
      )}

      {screen === 'auth' && (
        <AuthScreen
          onBack={() => setScreen('menu')}
          onAuthSuccess={() => setScreen('menu')}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen onBack={() => setScreen('menu')} />
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

      {screen === 'levelcomplete' && lastStats && (
        <LevelCompleteScreen
          levelIndex={playingLevel}
          stats={lastStats}
          onNextLevel={handleNextLevel}
          onWorldMap={() => setScreen('worldmap')}
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

      {screen === 'achievements' && (
        <AchievementsScreen
          progress={progress}
          onClaimReward={handleClaimAchievement}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
};

export default Index;
