// ============================================================
// NutriSense AI - Complete Type System
// ============================================================

// ─── User & Auth ────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  phone: string;
  createdAt: number;
  onboardingComplete: boolean;
}

export interface UserProfile {
  userId: string;
  goal: GoalType;
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  dietaryRestrictions: DietaryRestriction[];
  budget: BudgetRange;
  preferredCuisines: Cuisine[];
  notificationPreferences: NotificationPrefs;
}

export type GoalType = 'weight_loss' | 'weight_gain' | 'fitness';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietaryRestriction = 'vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'nut_free' | 'halal' | 'keto' | 'paleo';
export type BudgetRange = 'low' | 'medium' | 'high';
export type Cuisine = 'indian' | 'chinese' | 'italian' | 'mexican' | 'japanese' | 'thai' | 'mediterranean' | 'american' | 'korean';

export interface NotificationPrefs {
  predictions: boolean;
  dailyReminders: boolean;
  weeklyReport: boolean;
  achievements: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

// ─── Food & Nutrition ───────────────────────────────────────
export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  cuisine: Cuisine;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  healthScore: number; // 0-10
  verdict: HealthVerdict;
  imageUrl?: string;
  servingSize: string;
  alternatives: string[];
  tags: string[];
}

export type FoodCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage' | 'dessert' | 'fast_food' | 'street_food';
export type HealthVerdict = 'excellent' | 'good' | 'moderate' | 'poor';

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

// ─── Behavior Tracking ─────────────────────────────────────
export interface BehaviorLog {
  id: string;
  userId: string;
  foodItem: FoodItem;
  timestamp: number;
  timeOfDay: TimeOfDay;
  dayOfWeek: number;
  location: LocationInfo;
  mood: MoodLevel;
  stressLevel: StressLevel;
  hungerLevel: number; // 1-10
  decision: DecisionType;
  wasHealthy: boolean;
  interventionShown: boolean;
  interventionAccepted: boolean | null;
}

export type TimeOfDay = 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'late_night';
export type MoodLevel = 'happy' | 'neutral' | 'sad' | 'stressed' | 'anxious' | 'bored' | 'tired';
export type StressLevel = 'low' | 'medium' | 'high' | 'extreme';
export type DecisionType = 'planned' | 'impulsive' | 'craving' | 'social' | 'convenience';

export interface LocationInfo {
  name: string;
  type: 'home' | 'office' | 'restaurant' | 'cafe' | 'street_food' | 'other';
  lat?: number;
  lng?: number;
}

// ─── Pattern Detection ──────────────────────────────────────
export interface Pattern {
  id: string;
  userId: string;
  type: PatternType;
  description: string;
  confidence: number; // 0-100
  triggerConditions: TriggerCondition;
  frequency: number; // times per week
  lastOccurrence: number;
  foodItems: string[]; // food names
  isNegative: boolean;
  detectedAt: number;
}

export type PatternType = 'temporal' | 'location' | 'stress' | 'day_of_week' | 'mood' | 'social';

export interface TriggerCondition {
  timeRange?: { start: string; end: string };
  dayOfWeek?: number[];
  location?: string;
  stressLevel?: StressLevel;
  mood?: MoodLevel;
  isWeekend?: boolean;
}

// ─── Predictions & Interventions ────────────────────────────
export interface Prediction {
  id: string;
  userId: string;
  patternId: string;
  predictedBehavior: string;
  predictedFood: string;
  confidence: number; // 0-100
  triggerTime: number;
  alternatives: Alternative[];
  status: PredictionStatus;
  userResponse: UserResponse | null;
  respondedAt: number | null;
  createdAt: number;
}

export type PredictionStatus = 'pending' | 'shown' | 'accepted' | 'rejected' | 'ignored' | 'expired';
export type UserResponse = 'accepted' | 'rejected' | 'ignored';

export interface Alternative {
  type: 'restaurant' | 'home_recipe' | 'healthier_swap';
  name: string;
  description: string;
  calories: number;
  healthScore: number;
  distance?: string;
  prepTime?: string;
  imageUrl?: string;
}

// ─── Goals & Progress ───────────────────────────────────────
export interface Goal {
  userId: string;
  type: GoalType;
  dailyCalorieTarget: number;
  macroSplit: MacroSplit;
  currentWeight: number;
  targetWeight: number;
  weeklyTarget: number; // kg per week
  estimatedCompletionDate: number;
  startDate: number;
  mealPlan: MealPlan;
}

export interface MacroSplit {
  protein: number; // percentage
  carbs: number;
  fat: number;
}

export interface MealPlan {
  breakfast: MealSuggestion[];
  morningSnack: MealSuggestion[];
  lunch: MealSuggestion[];
  afternoonSnack: MealSuggestion[];
  dinner: MealSuggestion[];
}

export interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  recipe?: string;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  calorieTarget: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  mealsLogged: number;
  healthyChoices: number;
  totalChoices: number;
  weight?: number;
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  avgCalories: number;
  avgProtein: number;
  totalHealthyChoices: number;
  totalChoices: number;
  weightChange: number;
  streakDays: number;
}

// ─── Gamification ───────────────────────────────────────────
export interface GamificationState {
  userId: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  level: number;
  levelProgress: number; // 0-100
  weeklyPoints: number;
  monthlyPoints: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  requirement: string;
  progress: number; // 0-100
  earned: boolean;
  earnedAt?: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export type BadgeCategory = 'streak' | 'health' | 'prediction' | 'location' | 'macro' | 'budget' | 'special';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string;
  totalPoints: number;
  weeklyPoints: number;
  currentStreak: number;
  rank: number;
  level: number;
}

export interface PointTransaction {
  id: string;
  userId: string;
  points: number;
  reason: string;
  category: 'food_log' | 'prediction' | 'goal' | 'streak' | 'badge' | 'bonus';
  timestamp: number;
}

// ─── Restaurant ─────────────────────────────────────────────
export interface Restaurant {
  id: string;
  name: string;
  type: string;
  cuisine: Cuisine[];
  distance: number; // meters
  rating: number;
  healthScore: number; // 0-10
  priceRange: 'budget' | 'moderate' | 'premium';
  healthyOptionsCount: number;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;
  healthyItems: string[];
  openNow: boolean;
  deliveryAvailable: boolean;
}

// ─── Notifications ──────────────────────────────────────────
export interface SmartNotification {
  id: string;
  type: 'prediction' | 'reminder' | 'achievement' | 'tip' | 'weekly_report';
  title: string;
  message: string;
  icon: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  prediction?: Prediction;
  actionUrl?: string;
  read: boolean;
  createdAt: number;
}

// ─── App State ──────────────────────────────────────────────
export interface AppTheme {
  mode: 'light' | 'dark';
}

export interface OnboardingStep {
  step: number;
  totalSteps: number;
  completed: boolean;
}
