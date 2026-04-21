// ============================================================
// NutriSense AI - Onboarding Page (Multi-step Wizard)
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Target, Dumbbell, TrendingUp, Activity, Check, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { setProfile } from '../store/slices/authSlice';
import { setGoal } from '../store/slices/appSlice';
import { GoalType, ActivityLevel, DietaryRestriction, Cuisine, UserProfile } from '../types';
import { setupGoal } from '../services/goalCoach';

import React from 'react';

const steps = ['Goal', 'Body Metrics', 'Lifestyle', 'Preferences'];

const goalOptions: { type: GoalType; icon: React.ElementType; label: string; desc: string; color: string }[] = [
  { type: 'weight_loss', icon: TrendingUp, label: 'Weight Loss', desc: 'Lose fat, get lean', color: '#22c55e' },
  { type: 'weight_gain', icon: Dumbbell, label: 'Weight Gain', desc: 'Build muscle, bulk up', color: '#3b82f6' },
  { type: 'fitness', icon: Activity, label: 'Stay Fit', desc: 'Maintain & optimize', color: '#8b5cf6' },
];

const activityOptions: { level: ActivityLevel; label: string; desc: string }[] = [
  { level: 'sedentary', label: 'Sedentary', desc: 'Desk job, minimal exercise' },
  { level: 'light', label: 'Light', desc: '1-3 days/week exercise' },
  { level: 'moderate', label: 'Moderate', desc: '3-5 days/week exercise' },
  { level: 'active', label: 'Active', desc: '6-7 days/week exercise' },
  { level: 'very_active', label: 'Very Active', desc: 'Athlete / physical job' },
];

const dietOptions: { id: DietaryRestriction; label: string; emoji: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'gluten_free', label: 'Gluten Free', emoji: '🌾' },
  { id: 'dairy_free', label: 'Dairy Free', emoji: '🥛' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'halal', label: 'Halal', emoji: '☪️' },
];

const cuisineOptions: { id: Cuisine; label: string; emoji: string }[] = [
  { id: 'indian', label: 'Indian', emoji: '🇮🇳' },
  { id: 'chinese', label: 'Chinese', emoji: '🥢' },
  { id: 'italian', label: 'Italian', emoji: '🍝' },
  { id: 'japanese', label: 'Japanese', emoji: '🍣' },
  { id: 'thai', label: 'Thai', emoji: '🍜' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'korean', label: 'Korean', emoji: '🥘' },
  { id: 'american', label: 'American', emoji: '🍔' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [goal, setGoalType] = useState<GoalType>('weight_loss');
  const [weight, setWeight] = useState('75');
  const [targetWeight, setTargetWeight] = useState('68');
  const [height, setHeight] = useState('170');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [diets, setDiets] = useState<DietaryRestriction[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>(['indian']);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);

  const toggleDiet = (d: DietaryRestriction) => {
    setDiets(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const toggleCuisine = (c: Cuisine) => {
    setCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleComplete = () => {
    if (!user) return;

    const profile: UserProfile = {
      userId: user.id,
      goal,
      currentWeight: parseFloat(weight),
      targetWeight: parseFloat(targetWeight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activityLevel: activity,
      dietaryRestrictions: diets,
      budget,
      preferredCuisines: cuisines,
      notificationPreferences: {
        predictions: true,
        dailyReminders: true,
        weeklyReport: true,
        achievements: true,
        quietHoursStart: '23:00',
        quietHoursEnd: '07:00',
      },
    };

    dispatch(setProfile(profile));

    const goalData = setupGoal(
      user.id, goal,
      parseFloat(weight), parseFloat(targetWeight),
      parseFloat(height), parseInt(age),
      gender, activity
    );
    dispatch(setGoal(goalData));

    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 stagger-children">
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-white text-center mb-2">
              What's your goal?
            </h2>
            <p className="text-center text-[var(--color-dark-text-secondary)] text-sm mb-6">
              We'll customize your plan based on this
            </p>
            {goalOptions.map(opt => {
              const Icon = opt.icon;
              const selected = goal === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => setGoalType(opt.type)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                    selected
                      ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)]'
                      : 'border-[var(--color-dark-border)] bg-[var(--color-dark-card)] hover:border-[var(--color-dark-text-muted)]'
                  }`}
                  id={`goal-${opt.type}`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${opt.color}20` }}>
                    <Icon size={24} style={{ color: opt.color }} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-white">{opt.label}</p>
                    <p className="text-sm text-[var(--color-dark-text-secondary)]">{opt.desc}</p>
                  </div>
                  {selected && (
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        );

      case 1:
        return (
          <div className="space-y-5 stagger-children">
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-white text-center mb-2">
              Body Metrics
            </h2>
            <p className="text-center text-[var(--color-dark-text-secondary)] text-sm mb-6">
              Help us calculate your ideal nutrition plan
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--color-dark-text-secondary)] mb-1 block">Current Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                  className="input-field text-center text-lg font-semibold" id="onboard-weight" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-dark-text-secondary)] mb-1 block">Target Weight (kg)</label>
                <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)}
                  className="input-field text-center text-lg font-semibold" id="onboard-target-weight" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--color-dark-text-secondary)] mb-1 block">Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)}
                  className="input-field text-center text-lg font-semibold" id="onboard-height" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-dark-text-secondary)] mb-1 block">Age</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)}
                  className="input-field text-center text-lg font-semibold" id="onboard-age" />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--color-dark-text-secondary)] mb-2 block">Gender</label>
              <div className="flex gap-3">
                {(['male', 'female', 'other'] as const).map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                      gender === g
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)] text-[var(--color-primary)]'
                        : 'border-[var(--color-dark-border)] text-[var(--color-dark-text-secondary)]'
                    }`}
                    id={`gender-${g}`}
                  >
                    {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🧑 Other'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 stagger-children">
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-white text-center mb-2">
              Your Lifestyle
            </h2>

            <div>
              <label className="text-xs text-[var(--color-dark-text-secondary)] mb-2 block">Activity Level</label>
              <div className="space-y-2">
                {activityOptions.map(opt => (
                  <button key={opt.level} onClick={() => setActivity(opt.level)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                      activity === opt.level
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)]'
                        : 'border-[var(--color-dark-border)]'
                    }`}
                    id={`activity-${opt.level}`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${activity === opt.level ? 'text-[var(--color-primary)]' : 'text-white'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-[var(--color-dark-text-muted)]">{opt.desc}</p>
                    </div>
                    {activity === opt.level && <Check size={16} className="text-[var(--color-primary)]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--color-dark-text-secondary)] mb-2 block">Budget</label>
              <div className="flex gap-3">
                {([
                  { val: 'low', label: '💵 Budget', desc: '< ₹200/meal' },
                  { val: 'medium', label: '💰 Moderate', desc: '₹200-500' },
                  { val: 'high', label: '💎 Premium', desc: '₹500+' },
                ] as const).map(b => (
                  <button key={b.val} onClick={() => setBudget(b.val)}
                    className={`flex-1 py-3 rounded-xl text-center transition-all border ${
                      budget === b.val
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)]'
                        : 'border-[var(--color-dark-border)]'
                    }`}
                    id={`budget-${b.val}`}
                  >
                    <p className={`text-xs font-medium ${budget === b.val ? 'text-[var(--color-primary)]' : 'text-white'}`}>
                      {b.label}
                    </p>
                    <p className="text-[10px] text-[var(--color-dark-text-muted)] mt-1">{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 stagger-children">
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-white text-center mb-2">
              Preferences
            </h2>

            <div>
              <label className="text-xs text-[var(--color-dark-text-secondary)] mb-2 block">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-2">
                {dietOptions.map(d => (
                  <button key={d.id} onClick={() => toggleDiet(d.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      diets.includes(d.id)
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)] text-[var(--color-primary)]'
                        : 'border-[var(--color-dark-border)] text-[var(--color-dark-text-secondary)]'
                    }`}
                    id={`diet-${d.id}`}
                  >
                    {d.emoji} {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--color-dark-text-secondary)] mb-2 block">Preferred Cuisines</label>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map(c => (
                  <button key={c.id} onClick={() => toggleCuisine(c.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      cuisines.includes(c.id)
                        ? 'border-[var(--color-primary)] bg-[rgba(34,197,94,0.1)] text-[var(--color-primary)]'
                        : 'border-[var(--color-dark-border)] text-[var(--color-dark-text-secondary)]'
                    }`}
                    id={`cuisine-${c.id}`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden" style={{ background: '#0a0e1a', color: 'white' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto mb-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--color-dark-text-secondary)]">
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-xs text-[var(--color-primary)] font-medium">{steps[step]}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-dark-card)]">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md relative z-10">
          {renderStep()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-md mx-auto flex gap-3 mt-6 relative z-10">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-shrink-0" id="onboard-back">
            <ArrowLeft size={18} />
          </button>
        )}
        <button
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleComplete()}
          className="btn-primary flex-1 justify-center"
          id="onboard-next"
        >
          {step < steps.length - 1 ? (
            <>Next <ArrowRight size={18} /></>
          ) : (
            <>Start My Journey <Sparkles size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}
