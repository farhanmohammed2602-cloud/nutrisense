// ============================================================
// NutriSense AI - Goals & Progress Page
// ============================================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, Target, Calendar, Award, Lightbulb, Scale } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { useAppSelector } from '../hooks/useStore';
import { getCoachTip, estimateCompletion } from '../services/goalCoach';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

export default function GoalsProgress() {
  const navigate = useNavigate();
  const darkMode = useAppSelector(s => s.app.darkMode);
  const goal = useAppSelector(s => s.app.goal);
  const profile = useAppSelector(s => s.auth.profile);
  const dailyProgress = useAppSelector(s => s.app.dailyProgress);
  const weightHistory = useAppSelector(s => s.app.weightHistory);

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || profile?.currentWeight || 75;
  const targetWeight = goal?.targetWeight || profile?.targetWeight || 68;
  const startWeight = weightHistory[0]?.weight || profile?.currentWeight || 78;
  const totalLost = Math.round((startWeight - latestWeight) * 10) / 10;
  const remaining = Math.round((latestWeight - targetWeight) * 10) / 10;
  const progressPercent = Math.min(100, Math.round(((startWeight - latestWeight) / Math.max(1, startWeight - targetWeight)) * 100));

  const today = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return dailyProgress.find(d => d.date === todayStr) || {
      date: todayStr, caloriesConsumed: 0, calorieTarget: goal?.dailyCalorieTarget || 1800,
      proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0,
      mealsLogged: 0, healthyChoices: 0, totalChoices: 0,
    };
  }, [dailyProgress, goal]);

  const coachTip = getCoachTip(goal?.type || 'weight_loss', today);
  const estCompletion = estimateCompletion(latestWeight, targetWeight, goal?.weeklyTarget || 0.45);

  const textColor = darkMode ? '#e2e8f0' : '#0f172a';
  const mutedColor = darkMode ? '#64748b' : '#94a3b8';
  const gridColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  // Weight Chart Data
  const weightChartData = {
    labels: weightHistory.slice(-12).map(w => {
      const d = new Date(w.date);
      return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    }),
    datasets: [{
      label: 'Weight (kg)',
      data: weightHistory.slice(-12).map(w => w.weight),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#22c55e',
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  // Calories Chart Data
  const caloriesChartData = {
    labels: dailyProgress.slice(-7).map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Consumed',
        data: dailyProgress.slice(-7).map(d => d.caloriesConsumed),
        backgroundColor: dailyProgress.slice(-7).map(d =>
          d.caloriesConsumed > d.calorieTarget ? 'rgba(239,68,68,0.7)' : 'rgba(34,197,94,0.7)'
        ),
        borderRadius: 8,
      },
      {
        label: 'Target',
        data: dailyProgress.slice(-7).map(d => d.calorieTarget),
        backgroundColor: 'rgba(148,163,184,0.15)',
        borderRadius: 8,
      },
    ],
  };

  // Macro Doughnut
  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [today.proteinConsumed * 4, today.carbsConsumed * 4, today.fatConsumed * 9],
      backgroundColor: ['rgba(59,130,246,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
      borderWidth: 0,
      cutout: '70%',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#fff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: darkMode ? '#2a3550' : '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: { ticks: { color: mutedColor, font: { size: 10 } }, grid: { display: false }, border: { display: false } },
      y: { ticks: { color: mutedColor, font: { size: 10 } }, grid: { color: gridColor }, border: { display: false } },
    },
  };

  // Meal Plan
  const mealPlan = goal?.mealPlan;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24 stagger-children">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold font-[var(--font-heading)]">Goals & Progress</h1>
        </div>

        {/* Goal Summary Card */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold font-[var(--font-heading)] text-sm capitalize">
                  {(goal?.type || 'weight_loss').replace('_', ' ')}
                </p>
                <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                  Est. completion: {estCompletion}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-primary)]">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`h-3 rounded-full mb-3 ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
            <div className="h-full rounded-full gradient-primary transition-all duration-1000"
              style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold">{startWeight}</p>
              <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Start (kg)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-primary)]">{latestWeight}</p>
              <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Current (kg)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{targetWeight}</p>
              <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>Target (kg)</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-[var(--color-primary)]" />
              <span className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>Total Lost</span>
            </div>
            <p className="text-2xl font-bold">{totalLost > 0 ? totalLost : 0} <span className="text-sm font-normal">kg</span></p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={16} className="text-[var(--color-warning)]" />
              <span className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>Remaining</span>
            </div>
            <p className="text-2xl font-bold">{remaining > 0 ? remaining : 0} <span className="text-sm font-normal">kg</span></p>
          </div>
        </div>

        {/* AI Coach Tip */}
        <div className="notification-banner rounded-2xl p-4 mb-5 flex items-start gap-3">
          <Lightbulb size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold mb-1 text-[var(--color-primary)]">AI Coach</p>
            <p className="text-sm">{coachTip}</p>
          </div>
        </div>

        {/* Weight Progress Chart */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <h3 className="font-semibold font-[var(--font-heading)] mb-4">Weight Trend</h3>
          <div style={{ height: '200px' }}>
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </div>

        {/* Calorie vs Target */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <h3 className="font-semibold font-[var(--font-heading)] mb-4">Calories (This Week)</h3>
          <div style={{ height: '200px' }}>
            <Bar data={caloriesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <h3 className="font-semibold font-[var(--font-heading)] mb-4">Today's Macros</h3>
          <div className="flex items-center gap-6">
            <div style={{ width: '120px', height: '120px' }}>
              <Doughnut data={macroData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '70%' }} />
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: 'Protein', value: today.proteinConsumed, color: '#3b82f6' },
                { label: 'Carbs', value: today.carbsConsumed, color: '#f59e0b' },
                { label: 'Fat', value: today.fatConsumed, color: '#ef4444' },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                  <span className={`text-xs flex-1 ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>{m.label}</span>
                  <span className="text-sm font-bold">{m.value}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Meal Plan */}
        {mealPlan && (
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold font-[var(--font-heading)] mb-4">📋 Suggested Meal Plan</h3>
            <div className="space-y-3">
              {Object.entries({
                '🌅 Breakfast': mealPlan.breakfast,
                '☀️ Lunch': mealPlan.lunch,
                '🌙 Dinner': mealPlan.dinner,
                '🍎 Snack': mealPlan.morningSnack,
              }).map(([label, meals]) => {
                const meal = meals[Math.floor(Math.random() * meals.length)];
                return (
                  <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-medium ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>{label}</p>
                      <p className="text-sm font-medium truncate">{meal.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                        {meal.calories} kcal • P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-lg ${darkMode ? 'bg-[rgba(34,197,94,0.12)]' : 'bg-[rgba(34,197,94,0.08)]'} text-[var(--color-primary)] font-medium`}>
                      {meal.prepTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
