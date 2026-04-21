// ============================================================
// NutriSense AI - Achievements Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Flame, Star, Crown, ChevronUp, Gift, Zap } from 'lucide-react';
import { useAppSelector } from '../hooks/useStore';
import { getLeaderboard, calculateLevel, LEVEL_NAMES } from '../services/gamificationEngine';
import { Badge } from '../types';

const tabs = ['Badges', 'Leaderboard', 'Rewards'];

export default function Achievements() {
  const [activeTab, setActiveTab] = useState('Badges');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();
  const darkMode = useAppSelector(s => s.app.darkMode);
  const gamification = useAppSelector(s => s.app.gamification);
  const user = useAppSelector(s => s.auth.user);

  const { level, progress, nextLevel } = calculateLevel(gamification.totalPoints);
  const leaderboard = getLeaderboard();
  const earnedBadges = gamification.badges.filter(b => b.earned);
  const lockedBadges = gamification.badges.filter(b => !b.earned);

  const categories = ['all', 'streak', 'health', 'prediction', 'location', 'macro', 'budget', 'special'];

  const filteredBadges = filterCategory === 'all'
    ? gamification.badges
    : gamification.badges.filter(b => b.category === filterCategory);

  const tierColors: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold font-[var(--font-heading)]">Achievements</h1>
        </div>

        {/* Level Card */}
        <div className="glass-card rounded-2xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <Trophy size={128} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{level}</span>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold font-[var(--font-heading)]">{LEVEL_NAMES[level - 1] || 'Master'}</p>
                <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  {gamification.totalPoints} total points
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                Level {level}
              </span>
              <div className={`flex-1 h-2.5 rounded-full ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                <div className="h-full rounded-full gradient-accent transition-all duration-1000"
                  style={{ width: `${progress}%` }} />
              </div>
              <span className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                Level {level + 1}
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-lg font-bold">{gamification.currentStreak}</span>
                </div>
                <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Trophy size={14} className="text-[var(--color-warning)]" />
                  <span className="text-lg font-bold">{earnedBadges.length}</span>
                </div>
                <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Badges</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap size={14} className="text-[var(--color-primary)]" />
                  <span className="text-lg font-bold">{gamification.weeklyPoints}</span>
                </div>
                <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className={`flex rounded-xl p-1 mb-5 ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? 'gradient-primary text-white shadow-lg' : darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'
              }`}
            >
              {tab === 'Badges' && '🏅 '}{tab === 'Leaderboard' && '🏆 '}{tab === 'Rewards' && '🎁 '}{tab}
            </button>
          ))}
        </div>

        {/* Badges Tab */}
        {activeTab === 'Badges' && (
          <div className="slide-up">
            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {categories.map(c => (
                <button key={c} onClick={() => setFilterCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterCategory === c
                      ? 'gradient-primary text-white'
                      : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)]'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} darkMode={darkMode} tierColors={tierColors} />
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'Leaderboard' && (
          <div className="slide-up space-y-2">
            {/* Your Position */}
            <div className="glass-card rounded-2xl p-4 mb-3 border-2 border-[var(--color-primary)]">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-[var(--color-primary)] w-8">#--</span>
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  {(user?.displayName || 'U')[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user?.displayName || 'You'} (You)</p>
                  <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                    Level {level} • {gamification.currentStreak} day streak
                  </p>
                </div>
                <p className="font-bold text-[var(--color-primary)]">{gamification.totalPoints}</p>
              </div>
            </div>

            {/* Leaderboard List */}
            {leaderboard.map((entry, i) => (
              <div key={entry.userId} className={`glass-card rounded-xl p-3 flex items-center gap-3 ${i < 3 ? 'border border-[var(--color-warning)]' : ''}`}>
                <span className={`text-lg font-bold w-8 text-center ${i === 0 ? 'text-[#ffd700]' : i === 1 ? 'text-[#c0c0c0]' : i === 2 ? 'text-[#cd7f32]' : darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${i === 0 ? 'gradient-warning' : i === 1 ? 'gradient-blue' : 'gradient-accent'}`} 
                  style={i > 2 ? { background: darkMode ? 'var(--color-dark-card)' : 'var(--color-light-card-hover)', color: textColor(darkMode) } : {}}>
                  {entry.displayName[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{entry.displayName}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                    Lv.{entry.level} • 🔥 {entry.currentStreak}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{entry.totalPoints}</p>
                  <p className={`text-[10px] text-[var(--color-primary)]`}>+{entry.weeklyPoints}/w</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'Rewards' && (
          <div className="slide-up space-y-3">
            <div className="glass-card rounded-2xl p-5 text-center mb-4">
              <Gift size={40} className="mx-auto text-[var(--color-accent)] mb-3" />
              <p className="text-2xl font-bold font-[var(--font-heading)]">{gamification.totalPoints}</p>
              <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                Redeemable Points
              </p>
            </div>

            {[
              { name: '🥗 Free Healthy Meal Voucher', points: 500, desc: 'Redeem at partner restaurants' },
              { name: '⭐ Premium Feature: AI Coach', points: 1000, desc: 'Unlock personalized AI coaching for 30 days' },
              { name: '🏋️ Gym Day Pass', points: 750, desc: 'Free day pass at partner gyms' },
              { name: '📱 Custom Meal Plan', points: 1500, desc: 'AI-generated 7-day personalized plan' },
              { name: '🎯 Nutrition Consultation', points: 3000, desc: '30-min session with certified nutritionist' },
            ].map(reward => (
              <div key={reward.name} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{reward.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                    {reward.desc}
                  </p>
                </div>
                <button className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  gamification.totalPoints >= reward.points
                    ? 'gradient-primary text-white'
                    : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-muted)]' : 'bg-[var(--color-light-card-hover)] text-[var(--color-light-text-muted)]'
                }`}
                  disabled={gamification.totalPoints < reward.points}
                >
                  {reward.points} pts
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function textColor(dark: boolean) { return dark ? '#e2e8f0' : '#0f172a'; }

function BadgeCard({ badge, darkMode, tierColors }: { badge: Badge; darkMode: boolean; tierColors: Record<string, string> }) {
  return (
    <div className={`glass-card rounded-2xl p-4 text-center relative ${badge.earned ? 'badge-earned' : 'opacity-60'}`}>
      {badge.earned && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
            <Star size={10} className="text-white" fill="white" />
          </div>
        </div>
      )}
      <div className="text-3xl mb-2">{badge.icon}</div>
      <p className="font-semibold text-xs mb-1">{badge.name}</p>
      <p className={`text-[10px] mb-2 ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
        {badge.description}
      </p>

      {/* Tier indicator */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: tierColors[badge.tier] }} />
        <span className="text-[10px] capitalize" style={{ color: tierColors[badge.tier] }}>{badge.tier}</span>
      </div>

      {/* Progress */}
      {!badge.earned && (
        <div className={`h-1.5 rounded-full ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
          <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${badge.progress}%` }} />
        </div>
      )}
      {badge.earned && (
        <span className="text-[10px] text-[var(--color-primary)] font-semibold">✓ Earned</span>
      )}
    </div>
  );
}
