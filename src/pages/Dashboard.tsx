// ============================================================
// NutriSense AI - Dashboard (Home Screen)
// ============================================================

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, MapPin, Target, LineChart, Bell, Flame, Zap, TrendingUp, ChevronRight, Utensils, Brain, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { setActivePrediction, respondToPrediction, addPoints, setPatterns, setPredictions } from '../store/slices/appSlice';
import { detectPatterns, generatePredictions, generateSmartNotification } from '../services/predictionEngine';
import { Prediction } from '../types';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const darkMode = useAppSelector(s => s.app.darkMode);
  const user = useAppSelector(s => s.auth.user);
  const profile = useAppSelector(s => s.auth.profile);
  const goal = useAppSelector(s => s.app.goal);
  const dailyProgress = useAppSelector(s => s.app.dailyProgress);
  const behaviorLogs = useAppSelector(s => s.app.behaviorLogs);
  const patterns = useAppSelector(s => s.app.patterns);
  const gamification = useAppSelector(s => s.app.gamification);
  const todayFoodLogs = useAppSelector(s => s.app.todayFoodLogs);
  const activePrediction = useAppSelector(s => s.app.activePrediction);
  const showPredictionModal = useAppSelector(s => s.app.showPredictionModal);

  const [smartNotif, setSmartNotif] = useState<string | null>(null);
  const [showNotifBanner, setShowNotifBanner] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Today's data
  const today = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return dailyProgress.find(d => d.date === todayStr) || {
      date: todayStr, caloriesConsumed: 0, calorieTarget: goal?.dailyCalorieTarget || 1800,
      proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0,
      mealsLogged: 0, healthyChoices: 0, totalChoices: 0,
    };
  }, [dailyProgress, goal]);

  const caloriePercent = Math.min(100, Math.round((today.caloriesConsumed / today.calorieTarget) * 100));
  const macroTargets = useMemo(() => {
    const target = goal?.dailyCalorieTarget || 1800;
    const split = goal?.macroSplit || { protein: 35, carbs: 40, fat: 25 };
    return {
      protein: Math.round((target * split.protein / 100) / 4),
      carbs: Math.round((target * split.carbs / 100) / 4),
      fat: Math.round((target * split.fat / 100) / 9),
    };
  }, [goal]);

  // Run prediction engine
  useEffect(() => {
    if (behaviorLogs.length >= 3) {
      const detected = detectPatterns(behaviorLogs);
      dispatch(setPatterns(detected));
      const preds = generatePredictions(detected, user?.id || 'default');
      dispatch(setPredictions(preds));
      const notif = generateSmartNotification(detected);
      setSmartNotif(notif);
    } else {
      // Demo notification
      setSmartNotif("🕐 You usually order junk around this time. Healthier options nearby?");
    }
  }, [behaviorLogs.length]);

  const handlePredictionResponse = (response: 'accepted' | 'rejected' | 'ignored') => {
    if (activePrediction) {
      dispatch(respondToPrediction({ predictionId: activePrediction.id, response }));
      if (response === 'accepted') {
        dispatch(addPoints({ points: 25, reason: 'Accepted healthy prediction' }));
      }
    }
  };

  // Progress ring SVG params
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;
  const ringColor = caloriePercent > 100 ? '#ef4444' : caloriePercent > 80 ? '#f59e0b' : '#22c55e';

  const quickActions = [
    { icon: ScanLine, label: 'Scan Food', path: '/scanner', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { icon: MapPin, label: 'Find Nearby', path: '/nearby', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { icon: Utensils, label: 'Log Food', path: '/food-logger', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { icon: LineChart, label: 'Progress', path: '/goals', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'} gradient-mesh`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-lg md:max-w-5xl mx-auto px-4 pt-6 pb-4 md:py-8 md:grid md:grid-cols-12 md:gap-6 md:items-start flex flex-col gap-5"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between md:col-span-12 md:mb-2">
          <div>
            <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
            </p>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">
              {user?.displayName || 'User'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/achievements')} className="relative" id="dash-notif-btn">
              <Bell size={22} className={darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--color-danger)] pulse-dot" />
            </button>
            <button onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm"
              id="dash-profile-btn"
            >
              {(user?.displayName || 'U')[0].toUpperCase()}
            </button>
          </div>
        </motion.div>

        {/* Smart Notification Banner */}
        {smartNotif && showNotifBanner && (
          <motion.div variants={itemVariants} className="notification-banner rounded-2xl p-4 md:col-span-7 md:col-start-6 md:row-start-2 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Brain size={20} className="text-[var(--color-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-relaxed">{smartNotif}</p>
              <button onClick={() => navigate('/nearby')}
                className="text-xs text-[var(--color-primary)] font-semibold mt-2 flex items-center gap-1 hover:gap-2 transition-all">
                View Alternatives <ChevronRight size={14} />
              </button>
            </div>
            <button onClick={() => setShowNotifBanner(false)} className="text-[var(--color-dark-text-muted)] hover:text-white transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Calorie Progress Ring */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 md:col-span-5 md:col-start-1 md:row-start-2 md:row-span-3">
          <div className="flex items-center gap-6 md:flex-col md:text-center lg:flex-row lg:text-left">
            {/* Ring */}
            <div className="relative flex-shrink-0">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={radius} fill="none" stroke={darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  strokeWidth="10" />
                <circle cx="80" cy="80" r={radius} fill="none" stroke={ringColor}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  className="progress-ring-circle" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-[var(--font-heading)]">{today.caloriesConsumed}</span>
                <span className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                  / {today.calorieTarget} kcal
                </span>
              </div>
            </div>

            {/* Macros */}
            <div className="flex-1 space-y-3">
              <MacroBar label="Protein" current={today.proteinConsumed} target={macroTargets.protein} color="#3b82f6" unit="g" />
              <MacroBar label="Carbs" current={today.carbsConsumed} target={macroTargets.carbs} color="#f59e0b" unit="g" />
              <MacroBar label="Fat" current={today.fatConsumed} target={macroTargets.fat} color="#ef4444" unit="g" />
            </div>
          </div>
        </motion.div>

        {/* Streak & Points Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 md:col-span-7 md:col-start-6 md:row-start-3">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl streak-fire mb-1">🔥</div>
            <p className="text-lg font-bold font-[var(--font-heading)]">{gamification.currentStreak}</p>
            <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Day Streak</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-lg font-bold font-[var(--font-heading)]">{gamification.totalPoints}</p>
            <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Total Points</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🏅</div>
            <p className="text-lg font-bold font-[var(--font-heading)]">Lv.{gamification.level}</p>
            <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Level</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3 md:col-span-7 md:col-start-6 md:row-start-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button key={action.label} onClick={() => navigate(action.path)}
                className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2 transition-transform active:scale-95"
                id={`quick-${action.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: action.bg }}>
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <span className={`text-[10px] font-medium ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Today's Food Log */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 md:col-span-5 md:col-start-1 md:row-start-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold font-[var(--font-heading)]">Today's Log</h3>
            <button onClick={() => navigate('/food-logger')}
              className="text-xs text-[var(--color-primary)] font-semibold flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {todayFoodLogs.length > 0 ? (
            <div className="space-y-3">
              {todayFoodLogs.slice(-4).map((log, i) => (
                <div key={i} className={`flex items-center gap-3 py-2 ${i > 0 ? `border-t ${darkMode ? 'border-[var(--color-dark-border)]' : 'border-[var(--color-light-border)]'}` : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    log.wasHealthy ? 'bg-[rgba(34,197,94,0.12)]' : 'bg-[rgba(239,68,68,0.12)]'
                  }`}>
                    {log.wasHealthy ? '🥗' : '🍔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{log.foodItem.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                      {log.foodItem.calories} kcal • {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    log.foodItem.healthScore >= 7 ? 'bg-score-excellent score-excellent' :
                    log.foodItem.healthScore >= 5 ? 'bg-score-moderate score-moderate' :
                    'bg-score-poor score-poor'
                  }`}>
                    {log.foodItem.healthScore}/10
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-4xl mb-2">🍽️</p>
              <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                No meals logged yet today
              </p>
              <button onClick={() => navigate('/food-logger')} className="btn-primary mt-3 text-sm">
                Log Your First Meal
              </button>
            </div>
          )}
        </motion.div>

        {/* AI Patterns Detected */}
        {patterns.length > 0 && (
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 md:col-span-7 md:col-start-6 md:row-start-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-[var(--color-accent)]" />
              <h3 className="font-semibold font-[var(--font-heading)]">AI Patterns Detected</h3>
            </div>
            <div className="space-y-3">
              {patterns.slice(0, 3).map((p, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${p.confidence >= 70 ? 'bg-[var(--color-danger)]' : p.confidence >= 50 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-blue)]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">{p.description}</p>
                  </div>
                  <span className={`text-xs font-bold ${p.confidence >= 70 ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'}`}>
                    {p.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weekly Overview */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 md:col-span-12">
          <h3 className="font-semibold font-[var(--font-heading)] mb-4">This Week</h3>
          <div className="flex gap-1.5">
            {dailyProgress.slice(-7).map((d, i) => {
              const pct = Math.min(100, (d.caloriesConsumed / d.calorieTarget) * 100);
              const day = new Date(d.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-lg ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`} style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-700"
                      style={{
                        height: `${pct}%`,
                        background: pct > 100 ? 'var(--color-danger)' : pct > 80 ? 'var(--color-warning)' : 'var(--color-primary)',
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Prediction Intervention Modal */}
      {showPredictionModal && activePrediction && (
        <PredictionModal
          prediction={activePrediction}
          onAccept={() => handlePredictionResponse('accepted')}
          onReject={() => handlePredictionResponse('rejected')}
          onIgnore={() => handlePredictionResponse('ignored')}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function MacroBar({ label, current, target, color, unit }: {
  label: string; current: number; target: number; color: string; unit: string;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs text-[var(--color-dark-text-muted)]">{current}/{target}{unit}</span>
      </div>
      <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function PredictionModal({ prediction, onAccept, onReject, onIgnore, darkMode }: {
  prediction: Prediction; onAccept: () => void; onReject: () => void; onIgnore: () => void; darkMode: boolean;
}) {
  return (
    <div className="modal-overlay" onClick={onIgnore}>
      <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(239,68,68,0.12)] flex items-center justify-center mb-3">
            <Brain size={32} className="text-[var(--color-danger)]" />
          </div>
          <h3 className="text-lg font-bold font-[var(--font-heading)]">🔮 Prediction Alert</h3>
          <p className={`text-sm mt-2 ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
            {prediction.predictedBehavior}
          </p>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-3"
            style={{ background: prediction.confidence >= 70 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)' }}>
            <span className={`text-xs font-bold ${prediction.confidence >= 70 ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'}`}>
              {prediction.confidence}% confidence
            </span>
          </div>
        </div>

        <p className={`font-semibold text-sm mb-3 ${darkMode ? 'text-white' : 'text-[var(--color-light-text)]'}`}>
          💡 Try these instead:
        </p>

        <div className="space-y-2 mb-5">
          {prediction.alternatives.map((alt, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
              <span className="text-xl">
                {alt.type === 'restaurant' ? '🏪' : alt.type === 'home_recipe' ? '🏠' : '🔄'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alt.name}</p>
                <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                  {alt.description}
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--color-primary)]">{alt.calories} cal</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onReject} className="btn-secondary flex-1 justify-center text-sm">
            Skip
          </button>
          <button onClick={onAccept} className="btn-primary flex-1 justify-center text-sm">
            Accept ✓
          </button>
        </div>
      </div>
    </div>
  );
}
