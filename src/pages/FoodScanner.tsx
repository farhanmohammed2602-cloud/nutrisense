// ============================================================
// NutriSense AI - Food Scanner Page
// ============================================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Zap, AlertTriangle, ChevronRight, Check, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { addBehaviorLog, addPoints } from '../store/slices/appSlice';
import { foodDatabase, getHealthyAlternatives } from '../services/foodDatabase';
import { classifyTimeOfDay } from '../services/predictionEngine';
import { FoodItem } from '../types';

export default function FoodScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [alternatives, setAlternatives] = useState<FoodItem[]>([]);
  const [showCamera, setShowCamera] = useState(true);
  const [logged, setLogged] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const darkMode = useAppSelector(s => s.app.darkMode);
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const simulateScan = () => {
    setScanning(true);
    setShowCamera(false);

    // Simulate AI food detection with random food
    setTimeout(() => {
      const randomFoods = foodDatabase.filter(f => f.category !== 'beverage');
      const detected = randomFoods[Math.floor(Math.random() * randomFoods.length)];
      setScannedFood(detected);
      setAlternatives(getHealthyAlternatives(detected));
      setScanning(false);
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateScan();
    }
  };

  const handleLogScanned = () => {
    if (!scannedFood || !user) return;

    const now = new Date();
    dispatch(addBehaviorLog({
      id: `scan_${Date.now()}`,
      userId: user.id,
      foodItem: scannedFood,
      timestamp: Date.now(),
      timeOfDay: classifyTimeOfDay(now.getHours()),
      dayOfWeek: now.getDay(),
      location: { name: 'Scanned', type: 'other' },
      mood: 'neutral',
      stressLevel: 'low',
      hungerLevel: 5,
      decision: 'planned',
      wasHealthy: scannedFood.healthScore >= 6,
      interventionShown: false,
      interventionAccepted: null,
    }));
    dispatch(addPoints({ points: 10, reason: 'Scanned & logged food' }));
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
  };

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'excellent': return { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', emoji: '🌟', label: 'Excellent Choice!' };
      case 'good': return { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', emoji: '👍', label: 'Good Choice' };
      case 'moderate': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '⚠️', label: 'Moderate' };
      case 'poor': return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', emoji: '🚨', label: 'Poor Choice' };
      default: return { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', emoji: '❓', label: 'Unknown' };
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold font-[var(--font-heading)]">Food Scanner</h1>
        </div>

        {showCamera && !scanning && !scannedFood && (
          <div className="slide-up">
            {/* Camera View Placeholder */}
            <div className={`rounded-2xl overflow-hidden mb-5 relative ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-gray-100'}`}
              style={{ height: '350px' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-4 relative">
                  <Camera size={48} className="text-[var(--color-primary)] opacity-50" />
                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--color-primary)] rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--color-primary)] rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--color-primary)] rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--color-primary)] rounded-br-lg" />
                </div>
                <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  Point camera at your food
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={simulateScan} className="btn-primary flex-1 justify-center" id="scan-capture-btn">
                <Camera size={20} /> Capture
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="btn-secondary flex-1 justify-center" id="scan-upload-btn">
                <Upload size={20} /> Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>

            <p className={`text-center text-xs mt-4 ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
              AI-powered food recognition • Instant nutrition breakdown
            </p>
          </div>
        )}

        {/* Scanning Animation */}
        {scanning && (
          <div className="flex flex-col items-center justify-center py-20 fade-in">
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary)] opacity-20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)] animate-spin" />
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-[var(--color-accent)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={32} className="text-[var(--color-primary)] animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-bold font-[var(--font-heading)] mb-2">Analyzing Food...</h3>
            <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
              AI is detecting food items and nutrition
            </p>
          </div>
        )}

        {/* Scan Results */}
        {scannedFood && !scanning && (
          <div className="slide-up space-y-4">
            {/* Detected Food */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-[var(--color-primary)]" />
                <h3 className="font-semibold text-sm">AI Detection Result</h3>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl`}
                  style={{ background: getVerdictConfig(scannedFood.verdict).bg }}>
                  🍽️
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold font-[var(--font-heading)]">{scannedFood.name}</h2>
                  <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                    {scannedFood.servingSize} • {scannedFood.cuisine}
                  </p>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-5"
                style={{ background: getVerdictConfig(scannedFood.verdict).bg }}>
                <span className="text-2xl">{getVerdictConfig(scannedFood.verdict).emoji}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: getVerdictConfig(scannedFood.verdict).color }}>
                    {getVerdictConfig(scannedFood.verdict).label}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                    Health Score: {scannedFood.healthScore}/10
                  </p>
                </div>
              </div>

              {/* Nutrition Breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Calories', value: scannedFood.calories, unit: 'kcal', color: '#22c55e' },
                  { label: 'Protein', value: scannedFood.protein, unit: 'g', color: '#3b82f6' },
                  { label: 'Carbs', value: scannedFood.carbs, unit: 'g', color: '#f59e0b' },
                  { label: 'Fat', value: scannedFood.fat, unit: 'g', color: '#ef4444' },
                  { label: 'Fiber', value: scannedFood.fiber, unit: 'g', color: '#8b5cf6' },
                  { label: 'Sugar', value: scannedFood.sugar, unit: 'g', color: '#06b6d4' },
                ].map(n => (
                  <div key={n.label} className={`text-center p-2.5 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                    <p className="text-lg font-bold" style={{ color: n.color }}>{n.value}<span className="text-[10px] font-normal">{n.unit}</span></p>
                    <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>{n.label}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button onClick={handleLogScanned} className="btn-primary flex-1 justify-center" id="scan-log-btn">
                  {logged ? <><Check size={18} /> Logged!</> : <><Check size={18} /> Log Food</>}
                </button>
                <button onClick={() => { setScannedFood(null); setShowCamera(true); }}
                  className="btn-secondary" id="scan-again-btn">
                  <Camera size={18} />
                </button>
              </div>
            </div>

            {/* Healthier Alternatives */}
            {alternatives.length > 0 && scannedFood.healthScore < 7 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold font-[var(--font-heading)] mb-3 flex items-center gap-2">
                  💡 Healthier Alternatives
                </h3>
                <div className="space-y-2">
                  {alternatives.slice(0, 3).map(alt => (
                    <div key={alt.id} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                      <div className="w-10 h-10 rounded-xl bg-score-excellent flex items-center justify-center text-lg">🥗</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{alt.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                          {alt.calories} kcal • Score: {alt.healthScore}/10
                        </p>
                      </div>
                      <span className="score-excellent text-xs font-bold">{alt.verdict}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/nearby')}
                  className="w-full mt-3 text-center text-xs text-[var(--color-primary)] font-semibold flex items-center justify-center gap-1">
                  Find these nearby <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
