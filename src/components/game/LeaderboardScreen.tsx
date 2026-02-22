import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { playSound } from '@/game/audio';
import { LEVELS } from '@/game/levels';

interface LeaderboardScreenProps {
  onBack: () => void;
}

type LeaderboardTab = 'times' | 'coins';

interface TimeEntry {
  display_name: string;
  best_time: number;
  level_index: number;
}

interface CoinEntry {
  display_name: string;
  total_coins: number;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [tab, setTab] = useState<LeaderboardTab>('times');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [coinEntries, setCoinEntries] = useState<CoinEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === 'times') {
      loadTimeLeaderboard();
    } else {
      loadCoinLeaderboard();
    }
  }, [tab, selectedLevel]);

  const loadTimeLeaderboard = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leaderboard_entries')
      .select('best_time, level_index, user_id')
      .eq('level_index', selectedLevel)
      .order('best_time', { ascending: true })
      .limit(20);

    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

      setTimeEntries(data.map(d => ({
        display_name: profileMap.get(d.user_id) || 'Player',
        best_time: Number(d.best_time),
        level_index: d.level_index,
      })));
    } else {
      setTimeEntries([]);
    }
    setLoading(false);
  };

  const loadCoinLeaderboard = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('display_name, total_coins')
      .order('total_coins', { ascending: false })
      .limit(20);

    setCoinEntries(data?.map(d => ({
      display_name: d.display_name,
      total_coins: d.total_coins,
    })) || []);
    setLoading(false);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col items-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-accent glow-gold mb-3 z-20">🏆 LEADERBOARD</h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 z-20 w-full max-w-[400px]">
        {[
          { key: 'times' as LeaderboardTab, label: '⏱ BEST TIMES' },
          { key: 'coins' as LeaderboardTab, label: '🪙 TOTAL COINS' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { playSound('select'); setTab(t.key); }}
            className={`flex-1 px-2 py-1.5 font-pixel text-[7px] sm:text-[8px] border transition-all ${
              tab === t.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:border-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Level selector for times */}
      {tab === 'times' && (
        <div className="flex gap-1 mb-3 z-20 flex-wrap justify-center max-w-[400px]">
          {LEVELS.slice(0, 10).map((level, i) => (
            <button
              key={i}
              onClick={() => setSelectedLevel(i)}
              className={`px-2 py-1 font-pixel text-[6px] border transition-all ${
                selectedLevel === i
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-secondary text-secondary-foreground border-border hover:border-accent'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Entries */}
      <div className="z-20 w-full max-w-[400px] max-h-[40vh] overflow-y-auto">
        {loading ? (
          <p className="text-[8px] font-pixel text-muted-foreground text-center py-4">LOADING...</p>
        ) : tab === 'times' ? (
          timeEntries.length === 0 ? (
            <p className="text-[8px] font-pixel text-muted-foreground text-center py-4">No entries yet. Be the first!</p>
          ) : (
            timeEntries.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-2 border-b border-border ${
                  i < 3 ? 'bg-accent/5' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-pixel text-muted-foreground w-6">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span className="text-[8px] font-pixel text-foreground">{entry.display_name}</span>
                </div>
                <span className="text-[8px] font-pixel text-accent">{entry.best_time.toFixed(1)}s</span>
              </div>
            ))
          )
        ) : (
          coinEntries.length === 0 ? (
            <p className="text-[8px] font-pixel text-muted-foreground text-center py-4">No entries yet. Start playing!</p>
          ) : (
            coinEntries.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-2 border-b border-border ${
                  i < 3 ? 'bg-accent/5' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-pixel text-muted-foreground w-6">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span className="text-[8px] font-pixel text-foreground">{entry.display_name}</span>
                </div>
                <span className="text-[8px] font-pixel text-accent">🪙 {entry.total_coins.toLocaleString()}</span>
              </div>
            ))
          )
        )}
      </div>

      <button
        onClick={() => { playSound('select'); onBack(); }}
        className="mt-4 px-5 py-2 font-pixel text-[9px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20"
      >
        ← BACK
      </button>
    </div>
  );
};

export default LeaderboardScreen;
