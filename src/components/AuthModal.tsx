import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Offline / Demo mode authentication
      setTimeout(() => {
        setLoading(false);
        onSuccess(email || 'alex.design@example.com');
        onClose();
      }, 500);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Account created! Check your email to verify, or continue to app.');
        setTimeout(() => {
          onSuccess(email);
          onClose();
        }, 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess(email);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    onSuccess('alex.design@example.com');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm bg-[#FAF6EE] rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 border border-white/40 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DC]">
          <div>
            <h3 className="text-lg font-bold text-[#141414] leading-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h3>
            <p className="text-[11px] text-[#8C8880] mt-0.5">
              Sync your subscriptions across all your devices
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EDE8DE] hover:bg-[#E2DDD3] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#141414]" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#EFE9DF] rounded-xl p-1 my-4">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp ? 'bg-white text-[#141414] shadow-xs' : 'text-[#7A766F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSignUp ? 'bg-white text-[#141414] shadow-xs' : 'text-[#7A766F]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-[#7C7972] block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9E9B95] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-white rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#181818] border border-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#7C7972] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E9B95] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#181818] border border-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#181818] hover:bg-black text-white py-3 rounded-full font-semibold text-xs transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ECE7DC]" />
          </div>
          <span className="relative bg-[#FAF6EE] px-2 text-[10px] text-[#A19D94] uppercase tracking-wider font-medium">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full py-2.5 rounded-full bg-white hover:bg-neutral-50 border border-[#E0DBCF] text-xs font-semibold text-[#54514B] transition-colors"
        >
          Continue in Demo Mode (Alex)
        </button>

        {!isSupabaseConfigured && (
          <p className="text-[10px] text-[#A19D94] text-center mt-3">
            Supabase keys not yet provided — running in instant offline persistence mode.
          </p>
        )}
      </div>
    </div>
  );
};
