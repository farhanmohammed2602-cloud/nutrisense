// ============================================================
// NutriSense AI - Gamification Engine
// Points, badges, streaks, leaderboard logic
// ============================================================

import { Badge, GamificationState, LeaderboardEntry, PointTransaction } from '../types';

// ─── Badge Definitions ──────────────────────────────────────
export const allBadges: Badge[] = [
  // Streak Badges
  { id: 'b001', name: '3 Day Warrior', description: 'Log food for 3 consecutive days', icon: '🔥', category: 'streak', requirement: '3 day streak', progress: 0, earned: false, tier: 'bronze' },
  { id: 'b002', name: '7 Days No Junk', description: 'Avoid junk food for a full week', icon: '🛡️', category: 'streak', requirement: '7 days no junk', progress: 0, earned: false, tier: 'silver' },
  { id: 'b003', name: 'Fortnight Fighter', description: '14 day logging streak', icon: '⚔️', category: 'streak', requirement: '14 day streak', progress: 0, earned: false, tier: 'silver' },
  { id: 'b004', name: 'Health Hero', description: '30 days of clean eating', icon: '🦸', category: 'streak', requirement: '30 day clean streak', progress: 0, earned: false, tier: 'gold' },
  { id: 'b005', name: 'Century Club', description: '100 day logging streak', icon: '💯', category: 'streak', requirement: '100 day streak', progress: 0, earned: false, tier: 'platinum' },

  // Health Badges
  { id: 'b010', name: 'First Healthy Choice', description: 'Log your first healthy meal', icon: '🥗', category: 'health', requirement: '1 healthy log', progress: 0, earned: false, tier: 'bronze' },
  { id: 'b011', name: 'Green Machine', description: 'Eat 10 meals with health score 8+', icon: '🥦', category: 'health', requirement: '10 healthy meals', progress: 0, earned: false, tier: 'silver' },
  { id: 'b012', name: 'Clean Eater', description: '50 healthy meals logged', icon: '✨', category: 'health', requirement: '50 healthy meals', progress: 0, earned: false, tier: 'gold' },
  { id: 'b013', name: 'Nutrition Master', description: '100 healthy meals logged', icon: '👑', category: 'health', requirement: '100 healthy meals', progress: 0, earned: false, tier: 'platinum' },

  // Prediction Badges
  { id: 'b020', name: 'Prediction Listener', description: 'Accept your first prediction', icon: '🔮', category: 'prediction', requirement: '1 prediction accepted', progress: 0, earned: false, tier: 'bronze' },
  { id: 'b021', name: 'Smart Decision Maker', description: 'Accept 10 predictions', icon: '🧠', category: 'prediction', requirement: '10 predictions accepted', progress: 0, earned: false, tier: 'silver' },
  { id: 'b022', name: 'Prediction Master', description: '80% prediction acceptance rate (min 20)', icon: '🎯', category: 'prediction', requirement: '80% acceptance rate', progress: 0, earned: false, tier: 'gold' },

  // Location Badges
  { id: 'b030', name: 'Healthy Explorer', description: 'Eat healthy at 3 different restaurants', icon: '🗺️', category: 'location', requirement: '3 healthy restaurant visits', progress: 0, earned: false, tier: 'bronze' },
  { id: 'b031', name: 'Location King', description: 'Choose healthy at a usually-junk location', icon: '📍', category: 'location', requirement: 'Healthy choice at junk location', progress: 0, earned: false, tier: 'gold' },

  // Macro Badges
  { id: 'b040', name: 'Macro Aware', description: 'Hit your macro targets for 1 day', icon: '📊', category: 'macro', requirement: 'Perfect macro day', progress: 0, earned: false, tier: 'bronze' },
  { id: 'b041', name: 'Macro Maniac', description: 'Hit perfect macros for 7 days', icon: '💪', category: 'macro', requirement: '7 perfect macro days', progress: 0, earned: false, tier: 'gold' },

  // Budget Badges
  { id: 'b050', name: 'Budget Eater', description: 'Stay under budget for a week while eating healthy', icon: '💰', category: 'budget', requirement: 'Budget + healthy week', progress: 0, earned: false, tier: 'silver' },
  { id: 'b051', name: 'Budget Champion', description: 'Stay under budget for a month while eating healthy', icon: '🏆', category: 'budget', requirement: 'Budget + healthy month', progress: 0, earned: false, tier: 'gold' },

  // Special Badges
  { id: 'b060', name: 'First Scan', description: 'Scan your first food item', icon: '📸', category: 'special', requirement: 'First food scan', progress: 0, earned: false, tier: 'bronze' },
  { id: 'b061', name: 'Night Owl Control', description: 'Replace late-night junk 5 times', icon: '🦉', category: 'special', requirement: '5 late-night healthy swaps', progress: 0, earned: false, tier: 'silver' },
  { id: 'b062', name: 'Goal Crusher', description: 'Reach your target weight', icon: '🎉', category: 'special', requirement: 'Target weight reached', progress: 0, earned: false, tier: 'platinum' },
];

// ─── Points System ──────────────────────────────────────────
export const POINTS = {
  LOG_FOOD: 10,
  ACCEPT_PREDICTION: 25,
  COMPLETE_DAILY_GOAL: 50,
  MAINTAIN_STREAK: 5, // per day
  HEALTHY_CHOICE: 15,
  SCAN_FOOD: 10,
  FIRST_LOG_OF_DAY: 20,
  PERFECT_MACRO_DAY: 30,
  BADGE_EARNED_BONUS: 100,
} as const;

// ─── Level System ───────────────────────────────────────────
export function calculateLevel(totalPoints: number): { level: number; progress: number; nextLevel: number } {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000, 15000, 20000, 30000];
  let level = 1;
  for (let i = 1; i < levelThresholds.length; i++) {
    if (totalPoints >= levelThresholds[i]) level = i + 1;
    else break;
  }
  const currentThreshold = levelThresholds[Math.min(level - 1, levelThresholds.length - 1)];
  const nextThreshold = levelThresholds[Math.min(level, levelThresholds.length - 1)];
  const progress = nextThreshold > currentThreshold
    ? Math.round(((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100;
  return { level, progress: Math.min(100, progress), nextLevel: nextThreshold };
}

export const LEVEL_NAMES = [
  'Beginner', 'Food Rookie', 'Health Seeker', 'Nutrition Novice', 'Wellness Walker',
  'Diet Pro', 'Health Advocate', 'Nutrition Ninja', 'Wellness Warrior', 'Health Champion',
  'Nutrition Master', 'Wellness Legend', 'Health Icon', 'Nutrition Sage', 'Ultimate Guru',
];

// ─── Default Gamification State ─────────────────────────────
export function createDefaultGamificationState(userId: string): GamificationState {
  return {
    userId,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: allBadges.map(b => ({ ...b })),
    level: 1,
    levelProgress: 0,
    weeklyPoints: 0,
    monthlyPoints: 0,
  };
}

// ─── Update Gamification ────────────────────────────────────
export function awardPoints(
  state: GamificationState,
  points: number,
  reason: string,
  category: PointTransaction['category']
): { state: GamificationState; transaction: PointTransaction } {
  const newState = { ...state };
  newState.totalPoints += points;
  newState.weeklyPoints += points;
  newState.monthlyPoints += points;

  const { level, progress } = calculateLevel(newState.totalPoints);
  newState.level = level;
  newState.levelProgress = progress;

  const transaction: PointTransaction = {
    id: `pt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: state.userId,
    points,
    reason,
    category,
    timestamp: Date.now(),
  };

  return { state: newState, transaction };
}

export function updateStreak(state: GamificationState, loggedToday: boolean): GamificationState {
  const newState = { ...state };
  if (loggedToday) {
    newState.currentStreak += 1;
    if (newState.currentStreak > newState.longestStreak) {
      newState.longestStreak = newState.currentStreak;
    }
  } else {
    newState.currentStreak = 0;
  }
  return newState;
}

export function checkBadgeProgress(state: GamificationState, stats: {
  totalLogs: number;
  healthyLogs: number;
  currentStreak: number;
  acceptedPredictions: number;
  totalPredictions: number;
  uniqueHealthyRestaurants: number;
  perfectMacroDays: number;
  scansCount: number;
  lateNightHealthySwaps: number;
}): GamificationState {
  const newState = { ...state };
  const badges = [...newState.badges];

  // Streak badges
  updateBadge(badges, 'b001', stats.currentStreak, 3);
  updateBadge(badges, 'b003', stats.currentStreak, 14);
  updateBadge(badges, 'b005', stats.currentStreak, 100);

  // Health badges
  updateBadge(badges, 'b010', stats.healthyLogs, 1);
  updateBadge(badges, 'b011', stats.healthyLogs, 10);
  updateBadge(badges, 'b012', stats.healthyLogs, 50);
  updateBadge(badges, 'b013', stats.healthyLogs, 100);

  // Prediction badges
  updateBadge(badges, 'b020', stats.acceptedPredictions, 1);
  updateBadge(badges, 'b021', stats.acceptedPredictions, 10);
  if (stats.totalPredictions >= 20) {
    const rate = (stats.acceptedPredictions / stats.totalPredictions) * 100;
    updateBadge(badges, 'b022', rate, 80);
  }

  // Location badges
  updateBadge(badges, 'b030', stats.uniqueHealthyRestaurants, 3);

  // Macro badges
  updateBadge(badges, 'b040', stats.perfectMacroDays, 1);
  updateBadge(badges, 'b041', stats.perfectMacroDays, 7);

  // Special badges
  updateBadge(badges, 'b060', stats.scansCount, 1);
  updateBadge(badges, 'b061', stats.lateNightHealthySwaps, 5);

  newState.badges = badges;
  return newState;
}

function updateBadge(badges: Badge[], id: string, current: number, target: number) {
  const badge = badges.find(b => b.id === id);
  if (badge && !badge.earned) {
    badge.progress = Math.min(100, Math.round((current / target) * 100));
    if (current >= target) {
      badge.earned = true;
      badge.earnedAt = Date.now();
    }
  }
}

// ─── Mock Leaderboard ───────────────────────────────────────
export function getLeaderboard(): LeaderboardEntry[] {
  return [
    { userId: 'u001', displayName: 'Priya S.', photoURL: '', totalPoints: 4250, weeklyPoints: 380, currentStreak: 21, rank: 1, level: 8 },
    { userId: 'u002', displayName: 'Rahul K.', photoURL: '', totalPoints: 3800, weeklyPoints: 350, currentStreak: 15, rank: 2, level: 7 },
    { userId: 'u003', displayName: 'Ananya M.', photoURL: '', totalPoints: 3200, weeklyPoints: 290, currentStreak: 12, rank: 3, level: 7 },
    { userId: 'u004', displayName: 'Vikram P.', photoURL: '', totalPoints: 2800, weeklyPoints: 260, currentStreak: 18, rank: 4, level: 6 },
    { userId: 'u005', displayName: 'Sneha R.', photoURL: '', totalPoints: 2400, weeklyPoints: 220, currentStreak: 9, rank: 5, level: 6 },
    { userId: 'u006', displayName: 'Arjun D.', photoURL: '', totalPoints: 2100, weeklyPoints: 190, currentStreak: 7, rank: 6, level: 5 },
    { userId: 'u007', displayName: 'Meera T.', photoURL: '', totalPoints: 1800, weeklyPoints: 170, currentStreak: 11, rank: 7, level: 5 },
    { userId: 'u008', displayName: 'Karthik N.', photoURL: '', totalPoints: 1500, weeklyPoints: 145, currentStreak: 5, rank: 8, level: 4 },
    { userId: 'u009', displayName: 'Divya L.', photoURL: '', totalPoints: 1200, weeklyPoints: 120, currentStreak: 8, rank: 9, level: 4 },
    { userId: 'u010', displayName: 'Amit G.', photoURL: '', totalPoints: 900, weeklyPoints: 95, currentStreak: 3, rank: 10, level: 3 },
  ];
}
