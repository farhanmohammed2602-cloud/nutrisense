// ============================================================
// NutriSense AI - Food Logger Page
// ============================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Plus, Clock, MapPin, Heart, Frown, Smile, Meh, Zap, ChevronDown, Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { addBehaviorLog, addPoints, incrementStreak } from '../store/slices/appSlice';
import { searchFoods, foodDatabase } from '../services/foodDatabase';
import { classifyTimeOfDay } from '../services/predictionEngine';
import { FoodItem, MoodLevel, StressLevel, BehaviorLog } from '../types';

const moods: { value: MoodLevel; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'stressed', emoji: '😤', label: 'Stressed' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'bored', emoji: '😑', label: 'Bored' },
];

const stressLevels: { value: StressLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'extreme', label: 'Extreme', color: '#dc2626' },
];

export default function FoodLogger() {
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mood, setMood] = useState<MoodLevel>('neutral');
  const [stress, setStress] = useState<StressLevel>('low');
  const [location, setLocation] = useState('Home');
  const [hungerLevel, setHungerLevel] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'favorites'>('search');

  const darkMode = useAppSelector(s => s.app.darkMode);
  const user = useAppSelector(s => s.auth.user);
  const todayLogs = useAppSelector(s => s.app.todayFoodLogs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return foodDatabase.slice(0, 12);
    return searchFoods(query);
  }, [query]);

  const categories = ['All', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredResults = activeCategory === 'All' ? results : results.filter(f => f.category === activeCategory);

  const handleLogFood = () => {
    if (!selectedFood || !user) return;

    const now = new Date();
    const log: BehaviorLog = {
      id: `log_${Date.now()}`,
      userId: user.id,
      foodItem: selectedFood,
      timestamp: Date.now(),
      timeOfDay: classifyTimeOfDay(now.getHours()),
      dayOfWeek: now.getDay(),
      location: { name: location, type: location.toLowerCase() === 'home' ? 'home' : 'restaurant' },
      mood,
      stressLevel: stress,
      hungerLevel,
      decision: 'planned',
      wasHealthy: selectedFood.healthScore >= 6,
      interventionShown: false,
      interventionAccepted: null,
    };

    dispatch(addBehaviorLog(log));
    dispatch(addPoints({ points: 10, reason: 'Logged food' }));
    dispatch(incrementStreak());

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedFood(null);
      setQuery('');
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold font-[var(--font-heading)]">Log Food</h1>
        </div>

        {!selectedFood ? (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`} />
              <input
                type="text"
                placeholder="Search food items..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input-field pl-11"
                id="food-search-input"
                autoFocus
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === c
                      ? 'gradient-primary text-white'
                      : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)] text-[var(--color-light-text-secondary)]'
                  }`}
                >
                  {c === 'All' ? '🍽️ All' : c === 'breakfast' ? '🌅 Breakfast' : c === 'lunch' ? '☀️ Lunch' : c === 'dinner' ? '🌙 Dinner' : c === 'snack' ? '🍿 Snack' : '🥤 Beverage'}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="space-y-2">
              {filteredResults.map(food => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                    darkMode ? 'border-[var(--color-dark-border)] hover:border-[var(--color-primary)]' : 'border-[var(--color-light-border)] hover:border-[var(--color-primary)]'
                  } ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-white'}`}
                  id={`food-${food.id}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    food.healthScore >= 7 ? 'bg-score-excellent' :
                    food.healthScore >= 5 ? 'bg-score-moderate' :
                    'bg-score-poor'
                  }`}>
                    {food.category === 'breakfast' ? '🌅' : food.category === 'beverage' ? '🥤' : food.category === 'dessert' ? '🍰' : food.category === 'snack' ? '🍿' : '🍽️'}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{food.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                      {food.calories} kcal • P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      food.verdict === 'excellent' ? 'bg-score-excellent score-excellent' :
                      food.verdict === 'good' ? 'bg-score-good score-good' :
                      food.verdict === 'moderate' ? 'bg-score-moderate score-moderate' :
                      'bg-score-poor score-poor'
                    }`}>
                      {food.healthScore}/10
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Food Detail + Log Form */
          <div className="slide-up space-y-5">
            {/* Selected Food Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                  selectedFood.healthScore >= 7 ? 'bg-score-excellent' : selectedFood.healthScore >= 5 ? 'bg-score-moderate' : 'bg-score-poor'
                }`}>
                  🍽️
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold font-[var(--font-heading)]">{selectedFood.name}</h2>
                  <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                    {selectedFood.servingSize} • {selectedFood.cuisine}
                  </p>
                </div>
                <button onClick={() => setSelectedFood(null)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                  ✕
                </button>
              </div>

              {/* Nutrition Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Calories', value: `${selectedFood.calories}`, unit: 'kcal', color: '#22c55e' },
                  { label: 'Protein', value: `${selectedFood.protein}`, unit: 'g', color: '#3b82f6' },
                  { label: 'Carbs', value: `${selectedFood.carbs}`, unit: 'g', color: '#f59e0b' },
                  { label: 'Fat', value: `${selectedFood.fat}`, unit: 'g', color: '#ef4444' },
                ].map(n => (
                  <div key={n.label} className={`text-center p-3 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                    <p className="text-lg font-bold" style={{ color: n.color }}>{n.value}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>{n.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm">Health Score</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  selectedFood.verdict === 'excellent' ? 'bg-score-excellent' :
                  selectedFood.verdict === 'good' ? 'bg-score-good' :
                  selectedFood.verdict === 'moderate' ? 'bg-score-moderate' :
                  'bg-score-poor'
                }`}>
                  <span className={`text-sm font-bold ${
                    selectedFood.verdict === 'excellent' ? 'score-excellent' :
                    selectedFood.verdict === 'good' ? 'score-good' :
                    selectedFood.verdict === 'moderate' ? 'score-moderate' :
                    'score-poor'
                  }`}>
                    {selectedFood.healthScore}/10 — {selectedFood.verdict.charAt(0).toUpperCase() + selectedFood.verdict.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mood Selection */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-white' : 'text-[var(--color-light-text)]'}`}>
                How are you feeling?
              </label>
              <div className="flex gap-2 flex-wrap">
                {moods.map(m => (
                  <button key={m.value} onClick={() => setMood(m.value)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      mood === m.value
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)] text-[var(--color-primary)]'
                        : darkMode ? 'border-[var(--color-dark-border)] text-[var(--color-dark-text-secondary)]' : 'border-[var(--color-light-border)] text-[var(--color-light-text-secondary)]'
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-white' : 'text-[var(--color-light-text)]'}`}>
                Stress Level
              </label>
              <div className="flex gap-2">
                {stressLevels.map(s => (
                  <button key={s.value} onClick={() => setStress(s.value)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all border text-center ${
                      stress === s.value
                        ? `border-[${s.color}]`
                        : darkMode ? 'border-[var(--color-dark-border)]' : 'border-[var(--color-light-border)]'
                    }`}
                    style={stress === s.value ? { borderColor: s.color, background: `${s.color}15`, color: s.color } : {}}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-white' : 'text-[var(--color-light-text)]'}`}>
                Location
              </label>
              <div className="flex gap-2 flex-wrap">
                {['Home', 'Office', 'Restaurant', 'Cafe', 'Street Food'].map(loc => (
                  <button key={loc} onClick={() => setLocation(loc)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      location === loc
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)] text-[var(--color-primary)]'
                        : darkMode ? 'border-[var(--color-dark-border)] text-[var(--color-dark-text-secondary)]' : 'border-[var(--color-light-border)] text-[var(--color-light-text-secondary)]'
                    }`}
                  >
                    {loc === 'Home' ? '🏠' : loc === 'Office' ? '🏢' : loc === 'Restaurant' ? '🍴' : loc === 'Cafe' ? '☕' : '🛒'} {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Hunger Level Slider */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-white' : 'text-[var(--color-light-text)]'}`}>
                Hunger Level: <span className="text-[var(--color-primary)]">{hungerLevel}/10</span>
              </label>
              <input
                type="range" min="1" max="10" value={hungerLevel}
                onChange={e => setHungerLevel(parseInt(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
                id="hunger-slider"
              />
            </div>

            {/* Log Button */}
            <button onClick={handleLogFood} className="btn-primary w-full justify-center text-base" id="log-food-btn">
              <Plus size={20} /> Log This Food (+10 pts)
            </button>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl gradient-primary text-white shadow-lg">
            <Check size={20} />
            <span className="font-semibold text-sm">Food logged! +10 points 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
}
