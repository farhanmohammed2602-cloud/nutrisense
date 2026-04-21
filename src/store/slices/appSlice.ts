// ============================================================
// NutriSense AI - App Slice (Dashboard, Behavior, Goals, Gamification)
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BehaviorLog, Pattern, Prediction, Goal, DailyProgress, GamificationState, SmartNotification, FoodItem } from '../../types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../services/storage';
import { createDefaultGamificationState } from '../../services/gamificationEngine';

interface AppState {
  // Theme
  darkMode: boolean;

  // Behavior
  behaviorLogs: BehaviorLog[];
  patterns: Pattern[];
  predictions: Prediction[];
  activePrediction: Prediction | null;

  // Goals
  goal: Goal | null;
  dailyProgress: DailyProgress[];
  todayFoodLogs: BehaviorLog[];
  weightHistory: { date: string; weight: number }[];

  // Gamification
  gamification: GamificationState;

  // Notifications
  notifications: SmartNotification[];

  // UI State
  showPredictionModal: boolean;
  showFoodLogModal: boolean;
  selectedFood: FoodItem | null;
}

const userId = loadFromStorage<any>(STORAGE_KEYS.USER, null)?.id || 'default';

const initialState: AppState = {
  darkMode: loadFromStorage<boolean>(STORAGE_KEYS.THEME, true),
  behaviorLogs: loadFromStorage<BehaviorLog[]>(STORAGE_KEYS.BEHAVIOR_LOGS, []),
  patterns: loadFromStorage<Pattern[]>(STORAGE_KEYS.PATTERNS, []),
  predictions: loadFromStorage<Prediction[]>(STORAGE_KEYS.PREDICTIONS, []),
  activePrediction: null,
  goal: loadFromStorage<Goal | null>(STORAGE_KEYS.GOAL, null),
  dailyProgress: loadFromStorage<DailyProgress[]>(STORAGE_KEYS.DAILY_PROGRESS, generateMockDailyProgress()),
  todayFoodLogs: loadFromStorage<BehaviorLog[]>(STORAGE_KEYS.FOOD_LOGS_TODAY, []),
  weightHistory: loadFromStorage<{ date: string; weight: number }[]>(STORAGE_KEYS.WEIGHT_HISTORY, generateMockWeightHistory()),
  gamification: loadFromStorage<GamificationState>(STORAGE_KEYS.GAMIFICATION, createDefaultGamificationState(userId)),
  notifications: [],
  showPredictionModal: false,
  showFoodLogModal: false,
  selectedFood: null,
};

function generateMockDailyProgress(): DailyProgress[] {
  const progress: DailyProgress[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const cal = Math.round(1400 + Math.random() * 800);
    const healthy = Math.round(Math.random() * 4) + 1;
    const total = healthy + Math.round(Math.random() * 3);
    progress.push({
      date: date.toISOString().split('T')[0],
      caloriesConsumed: cal,
      calorieTarget: 1800,
      proteinConsumed: Math.round(40 + Math.random() * 80),
      carbsConsumed: Math.round(100 + Math.random() * 150),
      fatConsumed: Math.round(30 + Math.random() * 50),
      mealsLogged: Math.round(2 + Math.random() * 3),
      healthyChoices: healthy,
      totalChoices: total,
      weight: 75 - i * 0.1 + Math.random() * 0.3,
    });
  }
  return progress;
}

function generateMockWeightHistory(): { date: string; weight: number }[] {
  const history: { date: string; weight: number }[] = [];
  let weight = 78;
  for (let i = 90; i >= 0; i -= 7) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    weight = Math.max(70, weight - (0.2 + Math.random() * 0.5));
    history.push({
      date: date.toISOString().split('T')[0],
      weight: Math.round(weight * 10) / 10,
    });
  }
  return history;
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      saveToStorage(STORAGE_KEYS.THEME, state.darkMode);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      saveToStorage(STORAGE_KEYS.THEME, action.payload);
    },

    // Behavior
    addBehaviorLog: (state, action: PayloadAction<BehaviorLog>) => {
      state.behaviorLogs.push(action.payload);
      state.todayFoodLogs.push(action.payload);
      saveToStorage(STORAGE_KEYS.BEHAVIOR_LOGS, state.behaviorLogs);
      saveToStorage(STORAGE_KEYS.FOOD_LOGS_TODAY, state.todayFoodLogs);

      // Update daily progress
      const today = new Date().toISOString().split('T')[0];
      const todayProgress = state.dailyProgress.find(d => d.date === today);
      if (todayProgress) {
        todayProgress.caloriesConsumed += action.payload.foodItem.calories;
        todayProgress.proteinConsumed += action.payload.foodItem.protein;
        todayProgress.carbsConsumed += action.payload.foodItem.carbs;
        todayProgress.fatConsumed += action.payload.foodItem.fat;
        todayProgress.mealsLogged += 1;
        todayProgress.totalChoices += 1;
        if (action.payload.wasHealthy) todayProgress.healthyChoices += 1;
      } else {
        state.dailyProgress.push({
          date: today,
          caloriesConsumed: action.payload.foodItem.calories,
          calorieTarget: state.goal?.dailyCalorieTarget || 1800,
          proteinConsumed: action.payload.foodItem.protein,
          carbsConsumed: action.payload.foodItem.carbs,
          fatConsumed: action.payload.foodItem.fat,
          mealsLogged: 1,
          healthyChoices: action.payload.wasHealthy ? 1 : 0,
          totalChoices: 1,
        });
      }
      saveToStorage(STORAGE_KEYS.DAILY_PROGRESS, state.dailyProgress);
    },

    setPatterns: (state, action: PayloadAction<Pattern[]>) => {
      state.patterns = action.payload;
      saveToStorage(STORAGE_KEYS.PATTERNS, action.payload);
    },

    setPredictions: (state, action: PayloadAction<Prediction[]>) => {
      state.predictions = action.payload;
      saveToStorage(STORAGE_KEYS.PREDICTIONS, action.payload);
    },

    setActivePrediction: (state, action: PayloadAction<Prediction | null>) => {
      state.activePrediction = action.payload;
      state.showPredictionModal = !!action.payload;
    },

    respondToPrediction: (state, action: PayloadAction<{ predictionId: string; response: 'accepted' | 'rejected' | 'ignored' }>) => {
      const pred = state.predictions.find(p => p.id === action.payload.predictionId);
      if (pred) {
        pred.status = action.payload.response;
        pred.userResponse = action.payload.response;
        pred.respondedAt = Date.now();
      }
      state.activePrediction = null;
      state.showPredictionModal = false;
      saveToStorage(STORAGE_KEYS.PREDICTIONS, state.predictions);
    },

    // Goals
    setGoal: (state, action: PayloadAction<Goal>) => {
      state.goal = action.payload;
      saveToStorage(STORAGE_KEYS.GOAL, action.payload);
    },

    addWeightEntry: (state, action: PayloadAction<{ date: string; weight: number }>) => {
      state.weightHistory.push(action.payload);
      saveToStorage(STORAGE_KEYS.WEIGHT_HISTORY, state.weightHistory);
    },

    // Gamification
    updateGamification: (state, action: PayloadAction<GamificationState>) => {
      state.gamification = action.payload;
      saveToStorage(STORAGE_KEYS.GAMIFICATION, action.payload);
    },

    addPoints: (state, action: PayloadAction<{ points: number; reason: string }>) => {
      state.gamification.totalPoints += action.payload.points;
      state.gamification.weeklyPoints += action.payload.points;
      saveToStorage(STORAGE_KEYS.GAMIFICATION, state.gamification);
    },

    incrementStreak: (state) => {
      state.gamification.currentStreak += 1;
      if (state.gamification.currentStreak > state.gamification.longestStreak) {
        state.gamification.longestStreak = state.gamification.currentStreak;
      }
      saveToStorage(STORAGE_KEYS.GAMIFICATION, state.gamification);
    },

    earnBadge: (state, action: PayloadAction<string>) => {
      const badge = state.gamification.badges.find(b => b.id === action.payload);
      if (badge && !badge.earned) {
        badge.earned = true;
        badge.earnedAt = Date.now();
        badge.progress = 100;
        state.gamification.totalPoints += 100;
      }
      saveToStorage(STORAGE_KEYS.GAMIFICATION, state.gamification);
    },

    // Notifications
    addNotification: (state, action: PayloadAction<SmartNotification>) => {
      state.notifications.unshift(action.payload);
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },

    // UI
    setShowPredictionModal: (state, action: PayloadAction<boolean>) => {
      state.showPredictionModal = action.payload;
    },

    setShowFoodLogModal: (state, action: PayloadAction<boolean>) => {
      state.showFoodLogModal = action.payload;
    },

    setSelectedFood: (state, action: PayloadAction<FoodItem | null>) => {
      state.selectedFood = action.payload;
    },
  },
});

export const {
  toggleDarkMode, setDarkMode,
  addBehaviorLog, setPatterns, setPredictions, setActivePrediction, respondToPrediction,
  setGoal, addWeightEntry,
  updateGamification, addPoints, incrementStreak, earnBadge,
  addNotification, markNotificationRead,
  setShowPredictionModal, setShowFoodLogModal, setSelectedFood,
} = appSlice.actions;

export default appSlice.reducer;
