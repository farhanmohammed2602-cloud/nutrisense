// ============================================================
// NutriSense AI - Splash / Auth Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAppDispatch } from '../hooks/useStore';
import { loginSuccess } from '../store/slices/authSlice';
import { motion } from 'framer-motion';

export default function SplashAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1200));

    const user = {
      id: `user_${Date.now()}`,
      email,
      displayName: name || email.split('@')[0],
      photoURL: '',
      phone: '',
      createdAt: Date.now(),
      onboardingComplete: false,
    };

    dispatch(loginSuccess(user));
    setLoading(false);
    navigate('/onboarding');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const user = {
      id: `user_google_${Date.now()}`,
      email: 'user@gmail.com',
      displayName: 'NutriSense User',
      photoURL: '',
      phone: '',
      createdAt: Date.now(),
      onboardingComplete: false,
    };

    dispatch(loginSuccess(user));
    setLoading(false);
    navigate('/onboarding');
  };

  return (
    <motion.div 
      className="min-h-screen dark flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0a0e1a' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="w-full max-w-md relative z-10 slide-up">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4 pulse-green">
            <Sparkles size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-white tracking-tight">
            NutriSense <span className="text-[var(--color-primary)]">AI</span>
          </h1>
          <p className="text-[var(--color-dark-text-secondary)] mt-2 text-sm">
            Your intelligent food decision coach
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-6">
          {/* Toggle */}
          <div className="flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isLogin ? 'gradient-primary text-white shadow-lg' : 'text-[var(--color-dark-text-secondary)]'
              }`}
              onClick={() => setIsLogin(true)}
              id="auth-login-tab"
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isLogin ? 'gradient-primary text-white shadow-lg' : 'text-[var(--color-dark-text-secondary)]'
              }`}
              onClick={() => setIsLogin(false)}
              id="auth-register-tab"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative fade-in">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-text-muted)]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field pl-11"
                  id="auth-name-input"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-text-muted)]" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-11"
                id="auth-email-input"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-11 pr-11"
                id="auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-text-muted)] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-[var(--color-danger)] text-sm text-center fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              id="auth-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'var(--color-dark-border)' }} />
            <span className="text-xs text-[var(--color-dark-text-muted)]">OR</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-dark-border)' }} />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn-secondary w-full justify-center"
            id="auth-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-[var(--color-dark-text-muted)] mt-6">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </motion.div>
  );
}
