import React from 'react';
import { SKINS } from '@/game/constants';
import { playSound } from '@/game/audio';

interface ShopScreenProps {
  totalCoins: number;
  unlockedSkins: boolean[];
  onBuy: (skinIndex: number, price: number) => void;
  onBack: () => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ totalCoins, unlockedSkins, onBuy, onBack }) => {
  const premiumSkins = SKINS
    .map((skin, i) => ({ ...skin, index: i }))
    .filter(s => s.premium);

  return (
    <div className="flex flex-col items-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-accent glow-gold mb-1 sm:mb-2">SHOP</h2>
      <p className="text-xs sm:text-sm font-pixel text-accent mb-3 sm:mb-4">🪙 {totalCoins}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 z-20 mb-3 sm:mb-4 w-full max-w-[500px]">
        {premiumSkins.map((skin) => {
          const owned = unlockedSkins[skin.index];
          const canAfford = totalCoins >= skin.price;

          return (
            <div
              key={skin.index}
              className={`flex flex-col items-center p-2 sm:p-3 border transition-all ${
                owned
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary'
              }`}
            >
              <div className="flex flex-col items-center mb-1.5 sm:mb-2">
                <div className="w-3 sm:w-4 h-1.5 sm:h-2" style={{ backgroundColor: skin.hairColor }} />
                <div className="w-3 sm:w-4 h-2 sm:h-3" style={{ backgroundColor: skin.headColor }} />
                <div className="w-4 sm:w-5 h-2 sm:h-3" style={{ backgroundColor: skin.bodyColor }} />
                <div className="w-4 sm:w-5 h-2 sm:h-3" style={{ backgroundColor: skin.pantsColor }} />
              </div>
              <span className="text-[6px] sm:text-[7px] font-pixel text-foreground mb-1 text-center leading-tight">{skin.name}</span>
              {owned ? (
                <span className="text-[6px] sm:text-[7px] font-pixel text-primary">OWNED</span>
              ) : (
                <button
                  onClick={() => {
                    if (canAfford) {
                      playSound('chest');
                      onBuy(skin.index, skin.price);
                    }
                  }}
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
