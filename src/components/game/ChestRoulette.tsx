import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SKINS, RARITY_WEIGHTS, RARITY_COLORS, RARITY_DUPE_COINS } from '@/game/constants';
import { SkinRarity } from '@/game/types';
import { playSound } from '@/game/audio';
import SkinAvatar from './SkinAvatar';

interface ChestRouletteProps {
  unlockedSkins: boolean[];
  onComplete: (skinIndex: number, isDuplicate: boolean, dupeCoins: number) => void;
}

const ITEM_WIDTH = 80;
const VISIBLE_ITEMS = 7;
const STRIP_WIDTH = ITEM_WIDTH * VISIBLE_ITEMS;
const TOTAL_ITEMS = 40;
const TARGET_POS = Math.floor(VISIBLE_ITEMS / 2);

function pickRandomSkin(): number {
  const entries = Object.entries(RARITY_WEIGHTS) as [SkinRarity, number][];
  const totalWeight = entries.reduce((s, [, w]) => s + w, 0);
  let roll = Math.random() * totalWeight;
  let chosenRarity: SkinRarity = 'common';
  for (const [rarity, weight] of entries) {
    roll -= weight;
    if (roll <= 0) { chosenRarity = rarity; break; }
  }
  const candidates = SKINS.map((s, i) => ({ s, i })).filter(({ s }) => s.rarity === chosenRarity);
  if (candidates.length === 0) return 0;
  return candidates[Math.floor(Math.random() * candidates.length)].i;
}

const ChestRoulette: React.FC<ChestRouletteProps> = ({ unlockedSkins, onComplete }) => {
  const [phase, setPhase] = useState<'opening' | 'spinning' | 'reveal'>('opening');
  const [offset, setOffset] = useState(0);
  const [showGlow, setShowGlow] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);

  const targetSkinIndex = useMemo(() => pickRandomSkin(), []);
  const isDuplicate = unlockedSkins[targetSkinIndex] === true;
  const targetSkin = SKINS[targetSkinIndex];
  const dupeCoins = isDuplicate ? RARITY_DUPE_COINS[targetSkin.rarity] : 0;
  const rarityColor = RARITY_COLORS[targetSkin.rarity];

  const items = useMemo(() => {
    const strip: number[] = [];
    const skinCount = SKINS.length;
    for (let i = 0; i < TOTAL_ITEMS; i++) {
      if (i === TOTAL_ITEMS - TARGET_POS - 1) {
        strip.push(targetSkinIndex);
      } else {
        let r = Math.floor(Math.random() * skinCount);
        while (r === targetSkinIndex) r = Math.floor(Math.random() * skinCount);
        strip.push(r);
      }
    }
    return strip;
  }, [targetSkinIndex]);

  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(() => {
        setPhase('spinning');
        startTimeRef.current = Date.now();
        playSound('coin');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'spinning' || items.length === 0) return;
    const totalDistance = (TOTAL_ITEMS - VISIBLE_ITEMS) * ITEM_WIDTH;
    const duration = 4000;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentOffset = eased * totalDistance;
      setOffset(currentOffset);

      const itemsPassed = Math.floor(currentOffset / ITEM_WIDTH);
      if (itemsPassed !== Math.floor((currentOffset - 2) / ITEM_WIDTH) && progress < 0.95) {
        playSound('select');
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('reveal');
        setShowGlow(true);
        playSound('chest');
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, items]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-4 p-4 max-w-[95vw]">
        <h2 className="font-pixel text-sm sm:text-lg text-primary glow-green animate-bounce-slow">
          {phase === 'opening' ? '📦 OPENING CHEST...' : phase === 'spinning' ? '🎰 SPINNING...' : '🎉 YOU WON!'}
        </h2>

        {/* Roulette strip */}
        <div className="relative" style={{ width: STRIP_WIDTH, height: 100 }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary" />
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-[0.5px] w-[1px] bg-primary/50 z-10" />

          <div className="overflow-hidden border-2 border-border bg-secondary/90 rounded" style={{ width: STRIP_WIDTH, height: 100 }}>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

            <div className="flex items-center h-full transition-none" style={{ transform: `translateX(-${offset}px)` }}>
              {items.map((skinIdx, i) => {
                const skin = SKINS[skinIdx];
                const isTarget = phase === 'reveal' && i === TOTAL_ITEMS - TARGET_POS - 1;
                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 border-r border-border/30 ${isTarget ? 'bg-primary/20' : ''}`}
                    style={{ width: ITEM_WIDTH, height: 100 }}
                  >
                    <SkinAvatar skin={skin} size={32} />
                    <span className="font-pixel text-[6px] text-center leading-tight px-1" style={{ color: RARITY_COLORS[skin.rarity] }}>
                      {skin.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reveal */}
        {phase === 'reveal' && (
          <div className={`flex flex-col items-center gap-3 ${showGlow ? 'animate-scale-in' : ''}`}>
            {/* Rarity badge */}
            <span
              className="font-pixel text-[10px] uppercase px-3 py-1 rounded border"
              style={{ color: rarityColor, borderColor: rarityColor, backgroundColor: `${rarityColor}22` }}
            >
              {targetSkin.rarity}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="font-pixel text-xs sm:text-sm" style={{ color: rarityColor }}>
                {targetSkin?.name || 'Unknown Skin'}
              </span>
              <span className="text-2xl">✨</span>
            </div>

            {isDuplicate ? (
              <span className="font-pixel text-[9px] text-accent">
                DUPLICATE! +{dupeCoins} coins 🪙
              </span>
            ) : (
              targetSkin?.premium && (
                <span className="font-pixel text-[8px] text-accent animate-sparkle">⭐ PREMIUM SKIN!</span>
              )
            )}

            <button
              onClick={() => onComplete(targetSkinIndex, isDuplicate, dupeCoins)}
              className="mt-2 px-8 py-3 font-pixel text-xs bg-primary text-primary-foreground pixel-border hover:scale-105 transition-transform"
            >
              AWESOME!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChestRoulette;
