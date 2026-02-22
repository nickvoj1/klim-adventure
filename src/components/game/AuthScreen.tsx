import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { playSound } from '@/game/audio';

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onBack, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || 'Player' },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setMessage('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        playSound('chest');
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[400px] w-full max-w-[800px] bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      <h2 className="text-base sm:text-lg font-pixel text-primary glow-green mb-4 z-20">
        {mode === 'login' ? '🔑 LOGIN' : '📝 SIGN UP'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 z-20 w-full max-w-[300px]">
        {mode === 'signup' && (
          <div className="flex flex-col gap-1">
            <label className="text-[7px] font-pixel text-muted-foreground">DISPLAY NAME</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={20}
              placeholder="Player"
              className="px-3 py-2 font-pixel text-[9px] bg-secondary text-foreground border-2 border-border focus:border-primary outline-none"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-[7px] font-pixel text-muted-foreground">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="px-3 py-2 font-pixel text-[9px] bg-secondary text-foreground border-2 border-border focus:border-primary outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[7px] font-pixel text-muted-foreground">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="px-3 py-2 font-pixel text-[9px] bg-secondary text-foreground border-2 border-border focus:border-primary outline-none"
          />
        </div>

        {error && (
          <p className="text-[7px] font-pixel text-destructive text-center">{error}</p>
        )}
        {message && (
          <p className="text-[7px] font-pixel text-primary text-center">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 font-pixel text-xs bg-primary text-primary-foreground pixel-border hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? 'LOADING...' : mode === 'login' ? '▶ LOGIN' : '▶ CREATE ACCOUNT'}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
          className="text-[7px] font-pixel text-muted-foreground hover:text-primary transition-colors"
        >
          {mode === 'login' ? 'Need an account? SIGN UP' : 'Have an account? LOGIN'}
        </button>
      </form>

      <button
        onClick={() => { playSound('select'); onBack(); }}
        className="mt-4 px-5 py-2 font-pixel text-[9px] bg-secondary text-secondary-foreground border-2 border-border hover:border-primary z-20"
      >
        ← BACK
      </button>
    </div>
  );
};

export default AuthScreen;
