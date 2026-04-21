// ============================================================
// NutriSense AI - Goal Coach Service
// Calorie/macro calculations, meal plans, progress tracking
// ============================================================

import { GoalType, ActivityLevel, MacroSplit, Goal, MealPlan, DailyProgress, WeeklyProgress } from '../types';

// ─── BMR & Calorie Calculations ─────────────────────────────
export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
}

export function calculateDailyTarget(tdee: number, goal: GoalType): number {
  switch (goal) {
    case 'weight_loss': return Math.round(tdee - 500); // 0.45 kg/week deficit
    case 'weight_gain': return Math.round(tdee + 400); // lean bulk surplus
    case 'fitness': return tdee; // maintenance with macro optimization
  }
}

export function getMacroSplit(goal: GoalType): MacroSplit {
  switch (goal) {
    case 'weight_loss': return { protein: 40, carbs: 30, fat: 30 };
    case 'weight_gain': return { protein: 30, carbs: 45, fat: 25 };
    case 'fitness': return { protein: 35, carbs: 40, fat: 25 };
  }
}

export function calculateMacroGrams(calorieTarget: number, macroSplit: MacroSplit): {
  protein: number; carbs: number; fat: number;
} {
  return {
    protein: Math.round((calorieTarget * macroSplit.protein / 100) / 4),
    carbs: Math.round((calorieTarget * macroSplit.carbs / 100) / 4),
    fat: Math.round((calorieTarget * macroSplit.fat / 100) / 9),
  };
}

// ─── Goal Setup ─────────────────────────────────────────────
export function setupGoal(
  userId: string,
  goalType: GoalType,
  currentWeight: number,
  targetWeight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: ActivityLevel
): Goal {
  const bmr = calculateBMR(currentWeight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const dailyTarget = calculateDailyTarget(tdee, goalType);
  const macroSplit = getMacroSplit(goalType);

  const weightDiff = Math.abs(currentWeight - targetWeight);
  const weeklyRate = goalType === 'weight_loss' ? 0.45 : goalType === 'weight_gain' ? 0.3 : 0;
  const weeksToGoal = weeklyRate > 0 ? Math.ceil(weightDiff / weeklyRate) : 12;
  const estimatedDate = Date.now() + (weeksToGoal * 7 * 24 * 60 * 60 * 1000);

  return {
    userId,
    type: goalType,
    dailyCalorieTarget: dailyTarget,
    macroSplit,
    currentWeight,
    targetWeight,
    weeklyTarget: weeklyRate,
    estimatedCompletionDate: estimatedDate,
    startDate: Date.now(),
    mealPlan: generateMealPlan(goalType, dailyTarget, macroSplit),
  };
}

// ─── Meal Plan Generator ────────────────────────────────────
export function generateMealPlan(goal: GoalType, dailyCalories: number, macroSplit: MacroSplit): MealPlan {
  const plans: Record<GoalType, MealPlan> = {
    weight_loss: {
      breakfast: [
        { name: 'Oats Porridge with Fruits', calories: 250, protein: 8, carbs: 42, fat: 6, prepTime: '10 min' },
        { name: 'Egg White Omelette + Toast', calories: 220, protein: 20, carbs: 18, fat: 6, prepTime: '10 min' },
        { name: 'Greek Yogurt Parfait', calories: 200, protein: 15, carbs: 25, fat: 5, prepTime: '5 min' },
      ],
      morningSnack: [
        { name: 'Mixed Nuts (30g)', calories: 170, protein: 5, carbs: 7, fat: 15, prepTime: '0 min' },
        { name: 'Green Tea + Apple', calories: 80, protein: 0, carbs: 20, fat: 0, prepTime: '3 min' },
      ],
      lunch: [
        { name: 'Grilled Chicken Salad Bowl', calories: 350, protein: 32, carbs: 18, fat: 16, prepTime: '15 min' },
        { name: 'Dal + 2 Rotis + Sabzi', calories: 380, protein: 16, carbs: 52, fat: 10, prepTime: '25 min' },
        { name: 'Quinoa Veggie Bowl', calories: 320, protein: 14, carbs: 45, fat: 10, prepTime: '20 min' },
      ],
      afternoonSnack: [
        { name: 'Protein Shake', calories: 130, protein: 25, carbs: 5, fat: 2, prepTime: '2 min' },
        { name: 'Roasted Makhana', calories: 100, protein: 4, carbs: 18, fat: 1, prepTime: '0 min' },
      ],
      dinner: [
        { name: 'Grilled Fish + Steamed Veggies', calories: 280, protein: 34, carbs: 12, fat: 10, prepTime: '20 min' },
        { name: 'Palak Paneer + 1 Roti', calories: 300, protein: 16, carbs: 28, fat: 14, prepTime: '25 min' },
        { name: 'Mixed Vegetable Soup + Salad', calories: 180, protein: 8, carbs: 24, fat: 5, prepTime: '15 min' },
      ],
    },
    weight_gain: {
      breakfast: [
        { name: 'Peanut Butter Banana Smoothie', calories: 450, protein: 20, carbs: 55, fat: 18, prepTime: '5 min' },
        { name: 'Aloo Paratha + Curd + Butter', calories: 480, protein: 12, carbs: 52, fat: 24, prepTime: '20 min' },
        { name: '3 Egg Omelette + 2 Toast + Cheese', calories: 420, protein: 28, carbs: 30, fat: 22, prepTime: '10 min' },
      ],
      morningSnack: [
        { name: 'Banana + Peanut Butter', calories: 250, protein: 8, carbs: 35, fat: 12, prepTime: '2 min' },
        { name: 'Trail Mix (50g)', calories: 280, protein: 8, carbs: 22, fat: 18, prepTime: '0 min' },
      ],
      lunch: [
        { name: 'Chicken Biryani + Raita', calories: 550, protein: 28, carbs: 65, fat: 18, prepTime: '30 min' },
        { name: 'Rajma Chawal + Paneer Side', calories: 580, protein: 24, carbs: 72, fat: 18, prepTime: '25 min' },
        { name: 'Pasta with Chicken + Garlic Bread', calories: 600, protein: 30, carbs: 68, fat: 22, prepTime: '20 min' },
      ],
      afternoonSnack: [
        { name: 'Protein Bar + Milk', calories: 350, protein: 28, carbs: 35, fat: 10, prepTime: '0 min' },
        { name: 'Cheese Sandwich', calories: 320, protein: 14, carbs: 32, fat: 16, prepTime: '5 min' },
      ],
      dinner: [
        { name: 'Butter Chicken + 3 Rotis', calories: 650, protein: 35, carbs: 55, fat: 30, prepTime: '30 min' },
        { name: 'Fish Curry + Rice + Dal', calories: 580, protein: 32, carbs: 62, fat: 18, prepTime: '25 min' },
        { name: 'Paneer Tikka + Naan + Raita', calories: 550, protein: 26, carbs: 48, fat: 26, prepTime: '25 min' },
      ],
    },
    fitness: {
      breakfast: [
        { name: 'Protein Pancakes + Honey', calories: 350, protein: 30, carbs: 38, fat: 8, prepTime: '15 min' },
        { name: 'Boiled Eggs + Avocado Toast', calories: 380, protein: 22, carbs: 30, fat: 20, prepTime: '10 min' },
        { name: 'Overnight Oats + Whey', calories: 340, protein: 28, carbs: 42, fat: 8, prepTime: '5 min' },
      ],
      morningSnack: [
        { name: 'Pre-workout: Banana + Black Coffee', calories: 120, protein: 1, carbs: 28, fat: 0, prepTime: '2 min' },
        { name: 'Rice Cakes + Peanut Butter', calories: 200, protein: 6, carbs: 28, fat: 8, prepTime: '2 min' },
      ],
      lunch: [
        { name: 'Chicken Breast + Brown Rice + Broccoli', calories: 450, protein: 40, carbs: 48, fat: 8, prepTime: '20 min' },
        { name: 'Salmon Bowl + Sweet Potato', calories: 480, protein: 38, carbs: 42, fat: 16, prepTime: '20 min' },
        { name: 'Lentil Curry + Quinoa', calories: 420, protein: 22, carbs: 55, fat: 12, prepTime: '25 min' },
      ],
      afternoonSnack: [
        { name: 'Post-workout: Whey + Banana', calories: 250, protein: 28, carbs: 30, fat: 3, prepTime: '2 min' },
        { name: 'Greek Yogurt + Granola', calories: 220, protein: 18, carbs: 25, fat: 6, prepTime: '3 min' },
      ],
      dinner: [
        { name: 'Tandoori Chicken + Salad + Roti', calories: 400, protein: 38, carbs: 32, fat: 14, prepTime: '25 min' },
        { name: 'Tofu Stir Fry + Brown Rice', calories: 380, protein: 24, carbs: 45, fat: 12, prepTime: '20 min' },
        { name: 'Egg Curry + 2 Rotis', calories: 420, protein: 26, carbs: 40, fat: 16, prepTime: '20 min' },
      ],
    },
  };

  return plans[goal];
}

// ─── Progress Calculations ──────────────────────────────────
export function calculateWeeklyProgress(dailyLogs: DailyProgress[]): WeeklyProgress {
  if (dailyLogs.length === 0) {
    return {
      weekStart: new Date().toISOString().split('T')[0],
      weekEnd: new Date().toISOString().split('T')[0],
      avgCalories: 0, avgProtein: 0,
      totalHealthyChoices: 0, totalChoices: 0,
      weightChange: 0, streakDays: 0,
    };
  }

  const totalCalories = dailyLogs.reduce((sum, d) => sum + d.caloriesConsumed, 0);
  const totalProtein = dailyLogs.reduce((sum, d) => sum + d.proteinConsumed, 0);
  const healthy = dailyLogs.reduce((sum, d) => sum + d.healthyChoices, 0);
  const total = dailyLogs.reduce((sum, d) => sum + d.totalChoices, 0);
  const weights = dailyLogs.filter(d => d.weight).map(d => d.weight!);
  const weightChange = weights.length >= 2 ? weights[weights.length - 1] - weights[0] : 0;
  const streakDays = dailyLogs.filter(d => d.healthyChoices / Math.max(1, d.totalChoices) >= 0.5).length;

  return {
    weekStart: dailyLogs[0].date,
    weekEnd: dailyLogs[dailyLogs.length - 1].date,
    avgCalories: Math.round(totalCalories / dailyLogs.length),
    avgProtein: Math.round(totalProtein / dailyLogs.length),
    totalHealthyChoices: healthy,
    totalChoices: total,
    weightChange: Math.round(weightChange * 10) / 10,
    streakDays,
  };
}

export function getCoachTip(goal: GoalType, progress: DailyProgress): string {
  const ratio = progress.caloriesConsumed / Math.max(1, progress.calorieTarget);
  
  if (goal === 'weight_loss') {
    if (ratio < 0.7) return "⚠️ You're eating too little! Under-eating can slow metabolism. Aim for at least 80% of your target.";
    if (ratio < 0.9) return "👍 Great deficit control! You're on track for sustainable weight loss.";
    if (ratio <= 1.0) return "✅ Perfect! Right on target. Keep this up!";
    if (ratio <= 1.1) return "🔔 Slightly over target. Try a lighter dinner to compensate.";
    return "🚨 Over your calorie target. Consider a 30-min walk to offset.";
  }
  
  if (goal === 'weight_gain') {
    if (ratio < 0.8) return "📈 You need to eat more! Try adding a protein shake between meals.";
    if (ratio < 0.95) return "💪 Almost there! Add a snack to hit your surplus.";
    if (ratio <= 1.1) return "✅ Perfect surplus! Great job fueling your gains.";
    return "⚠️ Eating too much over surplus can add unwanted fat. Moderate slightly.";
  }

  // fitness
  if (ratio < 0.85) return "⚡ Under-fueling! Your workouts will suffer. Eat more complex carbs.";
  if (ratio <= 1.05) return "✅ Great energy balance! Your performance should be optimal.";
  return "🔔 Slightly over maintenance — fine on heavy training days, watch on rest days.";
}

export function estimateCompletion(currentWeight: number, targetWeight: number, weeklyRate: number): string {
  if (weeklyRate === 0) return 'Ongoing';
  const diff = Math.abs(currentWeight - targetWeight);
  const weeks = Math.ceil(diff / weeklyRate);
  const date = new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}
