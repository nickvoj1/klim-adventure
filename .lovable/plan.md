

# Monetization + Meme Skins + Kid-Friendly Features

## Overview
This plan adds meme-themed skins, a daily rewards system, achievements, a level completion screen with star ratings, and prepares the shop for future Stripe integration -- all using localStorage (no backend needed yet).

---

## 1. Add 10 Meme Skins (replace current premium skins)

**File: `src/game/constants.ts`**

Replace the 10 premium skins (indices 30-39) with meme-themed ones:
- Skibidi Man (bodyColor: purple/blue) -- 100 coins
- Ohio Explorer (red/black) -- 100 coins  
- Rizz Lord (gold/pink) -- 250 coins
- Sigma Boss (black/gray) -- 250 coins
- Grimace Shake (purple) -- 500 coins
- Among Us Crewmate (red/blue) -- 500 coins
- Wednesday Dancer (black/white) -- 750 coins
- Baby Gronk (green/gold) -- 750 coins
- Nyan Runner (rainbow) -- 1000 coins
- Mog Master (dark teal) -- 1000 coins

Each skin keeps the same color-block pixel art style but with fun meme-inspired names that kids will recognize.

---

## 2. Daily Rewards System

**New file: `src/components/game/DailyReward.tsx`**

A popup/modal that shows when you open the game if 24+ hours have passed since last claim:
- Day 1: 10 coins
- Day 2: 25 coins
- Day 3: 50 coins
- Day 4: 75 coins
- Day 5: 100 coins
- Day 6: 150 coins
- Day 7: 200 coins + random free skin unlock

Shows a 7-day streak calendar with the current day highlighted. Big animated "CLAIM" button. Streak resets if you miss a day.

**Changes to `src/game/types.ts`:**
- Add `dailyStreak`, `lastDailyReward` (timestamp), and `achievements` fields to `GameProgress`

**Changes to `src/game/constants.ts`:**
- Update `DEFAULT_PROGRESS` with new fields

**Changes to `src/pages/Index.tsx`:**
- Add daily reward check on mount, show DailyReward modal
- Add new screen type for `'daily'` or use a modal overlay

---

## 3. Achievement / Badge System

**New file: `src/components/game/AchievementsScreen.tsx`**

A new screen accessible from the main menu showing unlockable badges:
- "First Steps" -- Complete Level 1 (reward: 10 coins)
- "Coin Collector" -- Collect 100 total coins (reward: 25 coins)
- "Skin Collector" -- Unlock 5 skins (reward: 50 coins)
- "No Hit Run" -- Complete a level without getting hit (reward: 100 coins)
- "Speed Runner" -- Complete a level in under 60 seconds (reward: 50 coins)
- "Robot Slayer" -- Defeat 10 robots total (reward: 75 coins)
- "Rich Kid" -- Have 500 coins at once (reward: skin unlock)
- "Explorer" -- Open 5 chests (reward: 100 coins)

Each badge shows locked/unlocked state with a pixel art icon and reward info.

**Changes to `src/game/types.ts`:**
- Add `Achievement` interface and `achievements` record to `GameProgress`
- Add `totalRobotsKilled`, `totalLevelsCompleted`, `fastestLevelTime` tracking fields
- Add `GameScreen` type: add `'achievements'`

**Changes to `src/game/engine.ts`:**
- Track stats: robots killed, level completion time, no-hit flag
- Pass stats back via callbacks on level complete

**Changes to `src/pages/Index.tsx`:**
- Achievement check logic after level complete
- Wire up new screen

**Changes to `src/components/game/MainMenu.tsx`:**
- Add "ACHIEVEMENTS" button (trophy icon)

---

## 4. Level Complete Screen with Star Rating

**New file: `src/components/game/LevelCompleteScreen.tsx`**

Shown after touching the flag instead of going straight to world map:
- Shows level name + "COMPLETE!" with celebration animation
- Coins earned this level
- Time taken
- Star rating (1-3 stars): 1 star = completed, 2 stars = all coins, 3 stars = all coins + under time limit
- "NEXT LEVEL" and "WORLD MAP" buttons
- Confetti-style particle animation using emoji

**Changes to `src/game/types.ts`:**
- Add `'levelcomplete'` to `GameScreen` type
- Add level stats interface for time/coins/stars

**Changes to `src/pages/Index.tsx`:**
- Route to level complete screen instead of directly back to world map
- Track level time

**Changes to `src/game/engine.ts`:**
- Track elapsed time, report on completion

---

## 5. Enhanced Shop with Categories + Coin Packs Placeholder

**File: `src/components/game/ShopScreen.tsx`**

Redesign with tabs:
- **MEME SKINS** tab -- the 10 meme skins with buy buttons (current functionality, new skins)
- **COIN PACKS** tab -- shows 3-4 coin bundles with "COMING SOON" badges (prepares for Stripe):
  - Starter Pack: 500 coins
  - Popular Pack: 1500 coins (best value badge)
  - Mega Pack: 5000 coins
  - Ultimate Pack: 15000 coins
- **DAILY DEALS** tab -- 1 random skin at 50% off, refreshes every 24h

This keeps the UI ready for monetization without requiring Stripe yet.

---

## 6. UI Polish for Kids

**File: `src/components/game/MainMenu.tsx`:**
- Add animated emoji decorations (rotating, bouncing)
- Add "DAILY REWARD" notification dot when unclaimed
- Add "ACHIEVEMENTS" button

**File: `src/index.css`:**
- Add bounce, wiggle, and sparkle animations
- Add rainbow text utility class for special items

**File: `src/components/game/GameOverScreen.tsx`:**
- Add encouraging messages ("Almost got it!", "Try again, you're so close!")
- Add "Watch Ad for Extra Life" button (placeholder, shows "COMING SOON")

---

## Technical Summary

| File | Action |
|------|--------|
| `src/game/types.ts` | Add Achievement, LevelStats interfaces; expand GameProgress and GameScreen |
| `src/game/constants.ts` | Replace premium skins with meme skins; add achievements data; update DEFAULT_PROGRESS |
| `src/game/engine.ts` | Track time, robot kills, no-hit runs; report stats on level complete |
| `src/components/game/DailyReward.tsx` | New -- daily reward popup with streak calendar |
| `src/components/game/AchievementsScreen.tsx` | New -- achievement grid with badges |
| `src/components/game/LevelCompleteScreen.tsx` | New -- star rating + stats after level win |
| `src/components/game/ShopScreen.tsx` | Redesign with tabs: Meme Skins, Coin Packs (placeholder), Daily Deals |
| `src/components/game/MainMenu.tsx` | Add Achievements + Daily Reward buttons, notification dots |
| `src/components/game/GameOverScreen.tsx` | Encouraging messages, ad placeholder |
| `src/pages/Index.tsx` | Wire up all new screens, daily reward logic, achievement checks |
| `src/index.css` | Add bounce, wiggle, sparkle, rainbow animations |

No backend or Supabase changes needed -- everything persists via localStorage. Stripe coin packs are UI-only placeholders ready for future integration.

