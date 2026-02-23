import React, { useState, useMemo } from 'react';
import { SKINS } from '@/game/constants';
import { playSound } from '@/game/audio';
import { supabase } from '@/integrations/supabase/client';
import SkinAvatar from './SkinAvatar';

interface ShopScreenProps {
  totalCoins: number;
  unlockedSkins: boolean[];
  onBuy: (skinIndex: number, price: number) => void;
  onBack: () => void;
}

const COIN_PACKS = [
  { id: 'starter', name: 'Starter Pack', coins: 500, price: '$0.99', icon: '🪙', badge: '' },
  { id: 'popular', name: 'Popular Pack', coins: 1500, price: '$2.99', icon: '💰', badge: 'BEST VALUE' },
  { id: 'mega', name: 'Mega Pack', coins: 5000, price: '$7.99', icon: '💎', badge: '' },
  { id: 'ultimate', name: 'Ultimate Pack', coins: 15000, price: '$19.99', icon: '👑', badge: 'MOST COINS' },
];

type Tab = 'skins' | 'packs' | 'deals';

const ShopScreen: React.FC<ShopScreenProps> = ({ totalCoins, unlockedSkins, onBuy, onBack }) => {
  const [tab, setTab] = useState<Tab>('skins');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const premiumSkins = SKINS
    .map((skin, i) => ({ ...skin, index: i }))
    .filter(s => s.premium);

  const dailyDeal = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const available = premiumSkins.filter(s => !unlockedSkins[s.index]);
    if (available.length === 0) return null;
    return available[dayIndex % available.length];
  }, [unlockedSkins]);

  const handleBuyPack = async (packId: string) => {
    setPurchasing(packId);
    try {
      const { data, error } = await supabase.functions.invoke('create-coin-checkout', {
        body: { packId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setPurchasing(null);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'skins', label: '🔥 MEME SKINS' },
    { key: 'packs', label: '💎 COIN PACKS' },
    { key: 'deals', label: '⚡ DAILY DEAL' },
  ];

  return (
    <div className="flex flex-col items-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-accent glow-gold mb-1 z-20">🛒 SHOP</h2>
      <p className="text-xs sm:text-sm font-pixel text-accent mb-2 z-20">🪙 {totalCoins}</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 z-20 w-full max-w-[500px]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { playSound('select'); setTab(t.key); }}
            className={`flex-1 px-2 py-1.5 font-pixel text-[6px] sm:text-[8px] border transition-all ${
              tab === t.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:border-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Meme Skins Tab */}
      {tab === 'skins' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 z-20 mb-3 w-full max-w-[500px] overflow-y-auto max-h-[45vh]">
          {premiumSkins.map((skin) => {
            const owned = unlockedSkins[skin.index];
            const canAfford = totalCoins >= skin.price;
            return (
              <div
                key={skin.index}
                className={`flex flex-col items-center p-2 sm:p-3 border transition-all ${
                  owned ? 'border-primary bg-primary/10' : 'border-border bg-secondary'
                }`}
              >
                <div className="flex flex-col items-center mb-1.5">
                  <div className="w-3 sm:w-4 h-1.5 sm:h-2" style={{ backgroundColor: skin.hairColor }} />
                  <div className="w-3 sm:w-4 h-2 sm:h-3" style={{ backgroundColor: skin.headColor }} />
                  <div className="w-4 sm:w-5 h-2 sm:h-3" style={{ backgroundColor: skin.bodyColor }} />
                  <div className="w-4 sm:w-5 h-2 sm:h-3" style={{ backgroundColor: skin.pantsColor }} />
                </div>
                <span className="text-[6px] sm:text-[7px] font-pixel text-foreground mb-1 text-center leading-tight">{skin.name}</span>
                {owned ? (
                  <span className="text-[6px] sm:text-[7px] font-pixel text-primary">OWNED ✅</span>
                ) : (
                  <button
                    onClick={() => { if (canAfford) { playSound('chest'); onBuy(skin.index, skin.price); } }}
                    disabled={!canAfford}
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-[7px] font-pixel border transition-all ${
                      canAfford
                        ? 'bg-accent text-accent-foreground border-accent hover:scale-105'
                        : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                    }`}
                  >
                    🪙 {skin.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Coin Packs Tab */}
      {tab === 'packs' && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 z-20 mb-3 w-full max-w-[400px]">
          {COIN_PACKS.map((pack) => (
            <div key={pack.id} className="flex flex-col items-center p-3 sm:p-4 border border-border bg-secondary relative">
              {pack.badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[5px] sm:text-[6px] font-pixel bg-accent text-accent-foreground animate-wiggle">
                  {pack.badge}
                </span>
              )}
              <span className="text-xl sm:text-2xl mb-1">{pack.icon}</span>
              <span className="text-[7px] sm:text-[8px] font-pixel text-foreground mb-0.5">{pack.name}</span>
              <span className="text-[8px] sm:text-[9px] font-pixel text-accent mb-1">🪙 {pack.coins.toLocaleString()}</span>
              <button
                onClick={() => handleBuyPack(pack.id)}
                disabled={purchasing === pack.id}
                className={`px-3 py-1.5 text-[7px] sm:text-[8px] font-pixel border transition-all ${
                  purchasing === pack.id
                    ? 'bg-muted text-muted-foreground border-border cursor-wait'
                    : 'bg-accent text-accent-foreground border-accent hover:scale-105'
                }`}
              >
                {purchasing === pack.id ? 'LOADING...' : pack.price}
              </button>
            </div>
          ))}
          <p className="col-span-2 text-[6px] sm:text-[7px] font-pixel text-muted-foreground text-center mt-1">
            💳 Powered by Stripe — secure payments
          </p>
        </div>
      )}

      {/* Daily Deal Tab */}
      {tab === 'deals' && (
        <div className="flex flex-col items-center z-20 mb-3 w-full max-w-[300px]">
          {dailyDeal ? (
            <div className="flex flex-col items-center p-4 sm:p-6 border-2 border-accent bg-accent/5 w-full animate-pulse-glow">
              <span className="text-[7px] font-pixel text-accent mb-2 animate-sparkle">⚡ TODAY ONLY — 50% OFF!</span>
              <div className="flex flex-col items-center mb-2">
                <div className="w-5 h-2" style={{ backgroundColor: dailyDeal.hairColor }} />
                <div className="w-5 h-4" style={{ backgroundColor: dailyDeal.headColor }} />
                <div className="w-6 h-4" style={{ backgroundColor: dailyDeal.bodyColor }} />
                <div className="w-6 h-4" style={{ backgroundColor: dailyDeal.pantsColor }} />
              </div>
              <span className="text-[8px] sm:text-[10px] font-pixel text-foreground mb-1">{dailyDeal.name}</span>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[7px] font-pixel text-muted-foreground line-through">🪙 {dailyDeal.price}</span>
                <span className="text-[9px] font-pixel text-accent">🪙 {Math.floor(dailyDeal.price / 2)}</span>
              </div>
              <button
                onClick={() => {
                  const halfPrice = Math.floor(dailyDeal.price / 2);
                  if (totalCoins >= halfPrice) {
                    playSound('chest');
                    onBuy(dailyDeal.index, halfPrice);
                  }
                }}
                disabled={totalCoins < Math.floor(dailyDeal.price / 2)}
                className={`px-4 py-2 text-[8px] font-pixel border transition-all ${
                  totalCoins >= Math.floor(dailyDeal.price / 2)
                    ? 'bg-accent text-accent-foreground border-accent hover:scale-105'
                    : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                }`}
              >
                BUY NOW
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <span className="text-2xl mb-2 block">🎉</span>
              <p className="text-[8px] font-pixel text-primary">You own all skins!</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => { playSound('select'); onBack(); }}
        className="px-5 sm:px-6 py-2 font-pixel text-[9px] sm:text-[10px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20"
      >
        ← BACK
      </button>
    </div>
  );
};

export default ShopScreen;
