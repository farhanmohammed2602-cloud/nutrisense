// ============================================================
// NutriSense AI - Local Storage Persistence Layer
// ============================================================

const STORAGE_KEYS = {
  USER: 'nutrisense_user',
  PROFILE: 'nutrisense_profile',
  BEHAVIOR_LOGS: 'nutrisense_behavior_logs',
  PATTERNS: 'nutrisense_patterns',
  PREDICTIONS: 'nutrisense_predictions',
  GOAL: 'nutrisense_goal',
  DAILY_PROGRESS: 'nutrisense_daily_progress',
  GAMIFICATION: 'nutrisense_gamification',
  THEME: 'nutrisense_theme',
  FOOD_LOGS_TODAY: 'nutrisense_food_logs_today',
  WEIGHT_HISTORY: 'nutrisense_weight_history',
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage load error:', e);
    return defaultValue;
  }
}

export function clearStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

export { STORAGE_KEYS };
