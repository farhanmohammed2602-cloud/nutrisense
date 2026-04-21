// ============================================================
// NutriSense AI - Prediction Engine (CORE USP)
// Analyzes behavior patterns and predicts bad food decisions
// BEFORE they happen. Generates smart interventions.
// ============================================================

import { BehaviorLog, Pattern, Prediction, Alternative, PatternType, StressLevel, TimeOfDay } from '../types';
import { foodDatabase, getHealthyAlternatives } from './foodDatabase';
import { getRestaurants } from './restaurantService';

// ─── Time Classification ────────────────────────────────────
export function classifyTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'early_morning';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'late_night';
}

// ─── Pattern Detection Engine ───────────────────────────────
export function detectPatterns(logs: BehaviorLog[]): Pattern[] {
  const patterns: Pattern[] = [];
  
  if (logs.length < 3) return patterns;

  // 1. Temporal Pattern Detection
  patterns.push(...detectTemporalPatterns(logs));
  
  // 2. Location-based Pattern Detection
  patterns.push(...detectLocationPatterns(logs));
  
  // 3. Stress-triggered Pattern Detection
  patterns.push(...detectStressPatterns(logs));
  
  // 4. Day-of-week Pattern Detection
  patterns.push(...detectDayOfWeekPatterns(logs));
  
  // 5. Mood-based Pattern Detection
  patterns.push(...detectMoodPatterns(logs));

  return patterns.filter(p => p.confidence >= 40);
}

function detectTemporalPatterns(logs: BehaviorLog[]): Pattern[] {
  const patterns: Pattern[] = [];
  const timeGroups: Record<string, BehaviorLog[]> = {};

  logs.forEach(log => {
    const key = log.timeOfDay;
    if (!timeGroups[key]) timeGroups[key] = [];
    timeGroups[key].push(log);
  });

  Object.entries(timeGroups).forEach(([timeOfDay, groupLogs]) => {
    const unhealthyLogs = groupLogs.filter(l => !l.wasHealthy);
    if (unhealthyLogs.length >= 2) {
      const confidence = Math.min(95, (unhealthyLogs.length / groupLogs.length) * 100);
      const foodNames = [...new Set(unhealthyLogs.map(l => l.foodItem.name))];
      const frequency = (unhealthyLogs.length / Math.max(1, getWeekSpan(logs))) * 7;

      const timeRanges: Record<string, {start: string; end: string}> = {
        'early_morning': { start: '05:00', end: '08:00' },
        'morning': { start: '08:00', end: '12:00' },
        'afternoon': { start: '12:00', end: '17:00' },
        'evening': { start: '17:00', end: '21:00' },
        'late_night': { start: '21:00', end: '05:00' },
      };

      patterns.push({
        id: `temporal_${timeOfDay}_${Date.now()}`,
        userId: logs[0].userId,
        type: 'temporal',
        description: `Orders unhealthy food during ${timeOfDay.replace('_', ' ')} (${foodNames.slice(0, 3).join(', ')})`,
        confidence: Math.round(confidence),
        triggerConditions: { timeRange: timeRanges[timeOfDay] },
        frequency: Math.round(frequency * 10) / 10,
        lastOccurrence: Math.max(...unhealthyLogs.map(l => l.timestamp)),
        foodItems: foodNames,
        isNegative: true,
        detectedAt: Date.now(),
      });
    }
  });

  return patterns;
}

function detectLocationPatterns(logs: BehaviorLog[]): Pattern[] {
  const patterns: Pattern[] = [];
  const locationGroups: Record<string, BehaviorLog[]> = {};

  logs.forEach(log => {
    if (log.location?.name) {
      const key = log.location.name;
      if (!locationGroups[key]) locationGroups[key] = [];
      locationGroups[key].push(log);
    }
  });

  Object.entries(locationGroups).forEach(([location, groupLogs]) => {
    if (groupLogs.length < 2) return;
    const unhealthyLogs = groupLogs.filter(l => !l.wasHealthy);
    if (unhealthyLogs.length >= 2) {
      const confidence = Math.min(95, (unhealthyLogs.length / groupLogs.length) * 100);
      const foodNames = [...new Set(unhealthyLogs.map(l => l.foodItem.name))];

      patterns.push({
        id: `location_${location.replace(/\s/g, '_')}_${Date.now()}`,
        userId: logs[0].userId,
        type: 'location',
        description: `Always gets unhealthy food at ${location} (${foodNames.slice(0, 2).join(', ')})`,
        confidence: Math.round(confidence),
        triggerConditions: { location },
        frequency: groupLogs.length,
        lastOccurrence: Math.max(...unhealthyLogs.map(l => l.timestamp)),
        foodItems: foodNames,
        isNegative: true,
        detectedAt: Date.now(),
      });
    }
  });

  return patterns;
}

function detectStressPatterns(logs: BehaviorLog[]): Pattern[] {
  const patterns: Pattern[] = [];
  const stressLevels: StressLevel[] = ['high', 'extreme'];

  stressLevels.forEach(level => {
    const stressedLogs = logs.filter(l => l.stressLevel === level);
    if (stressedLogs.length < 2) return;

    const unhealthyInStress = stressedLogs.filter(l => !l.wasHealthy);
    if (unhealthyInStress.length >= 2) {
      const confidence = Math.min(95, (unhealthyInStress.length / stressedLogs.length) * 100);
      const foodNames = [...new Set(unhealthyInStress.map(l => l.foodItem.name))];

      patterns.push({
        id: `stress_${level}_${Date.now()}`,
        userId: logs[0].userId,
        type: 'stress',
        description: `${level} stress = ${Math.round(confidence)}% chance of unhealthy food`,
        confidence: Math.round(confidence),
        triggerConditions: { stressLevel: level },
        frequency: unhealthyInStress.length,
        lastOccurrence: Math.max(...unhealthyInStress.map(l => l.timestamp)),
        foodItems: foodNames,
        isNegative: true,
        detectedAt: Date.now(),
      });
    }
  });

  return patterns;
}

function detectDayOfWeekPatterns(logs: BehaviorLog[]): Pattern[] {
  const patterns: Pattern[] = [];
  const dayGroups: Record<number, BehaviorLog[]> = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  logs.forEach(log => {
    const day = log.dayOfWeek;
    if (!dayGroups[day]) dayGroups[day] = [];
    dayGroups[day].push(log);
  });

  Object.entries(dayGroups).forEach(([day, groupLogs]) => {
    const dayNum = parseInt(day);
    const unhealthyLogs = groupLogs.filter(l => !l.wasHealthy);
    if (unhealthyLogs.length >= 2 && unhealthyLogs.length / groupLogs.length > 0.6) {
      const confidence = Math.min(95, (unhealthyLogs.length / groupLogs.length) * 100);
      const foodNames = [...new Set(unhealthyLogs.map(l => l.foodItem.name))];

      patterns.push({
        id: `day_${dayNames[dayNum]}_${Date.now()}`,
        userId: logs[0].userId,
        type: 'day_of_week',
        description: `${dayNames[dayNum]} pattern: tends to eat ${foodNames[0]} and similar`,
        confidence: Math.round(confidence),
        triggerConditions: { dayOfWeek: [dayNum], isWeekend: dayNum === 0 || dayNum === 6 },
        frequency: unhealthyLogs.length,
        lastOccurrence: Math.max(...unhealthyLogs.map(l => l.timestamp)),
        foodItems: foodNames,
        isNegative: true,
        detectedAt: Date.now(),
      });
    }
  });

  return patterns;
}

function detectMoodPatterns(logs: BehaviorLog[]): Pattern[] {
  const patterns: Pattern[] = [];
  const moodGroups: Record<string, BehaviorLog[]> = {};

  logs.forEach(log => {
    if (!moodGroups[log.mood]) moodGroups[log.mood] = [];
    moodGroups[log.mood].push(log);
  });

  Object.entries(moodGroups).forEach(([mood, groupLogs]) => {
    if (['happy', 'neutral'].includes(mood)) return;
    const unhealthyLogs = groupLogs.filter(l => !l.wasHealthy);
    if (unhealthyLogs.length >= 2 && unhealthyLogs.length / groupLogs.length > 0.5) {
      const confidence = Math.min(95, (unhealthyLogs.length / groupLogs.length) * 100);
      const foodNames = [...new Set(unhealthyLogs.map(l => l.foodItem.name))];

      patterns.push({
        id: `mood_${mood}_${Date.now()}`,
        userId: logs[0].userId,
        type: 'mood',
        description: `When feeling ${mood}, ${Math.round(confidence)}% likely to eat junk`,
        confidence: Math.round(confidence),
        triggerConditions: { mood: mood as any },
        frequency: unhealthyLogs.length,
        lastOccurrence: Math.max(...unhealthyLogs.map(l => l.timestamp)),
        foodItems: foodNames,
        isNegative: true,
        detectedAt: Date.now(),
      });
    }
  });

  return patterns;
}

// ─── Prediction Generator ───────────────────────────────────
export function generatePredictions(patterns: Pattern[], userId: string): Prediction[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  const currentTimeOfDay = classifyTimeOfDay(currentHour);
  const predictions: Prediction[] = [];

  patterns.forEach(pattern => {
    let shouldTrigger = false;
    let triggerTime = Date.now();

    switch (pattern.type) {
      case 'temporal': {
        const range = pattern.triggerConditions.timeRange;
        if (range) {
          const startHour = parseInt(range.start.split(':')[0]);
          // Trigger 30 minutes before the pattern window
          const triggerHour = startHour > 0 ? startHour - 1 : 23;
          if (currentHour === triggerHour || currentTimeOfDay === getTimeOfDayFromRange(range.start)) {
            shouldTrigger = true;
            triggerTime = Date.now() + (30 * 60 * 1000); // 30 mins from now
          }
        }
        break;
      }
      case 'day_of_week': {
        const days = pattern.triggerConditions.dayOfWeek;
        if (days?.includes(currentDay)) {
          shouldTrigger = true;
          triggerTime = Date.now() + (15 * 60 * 1000);
        }
        break;
      }
      case 'stress':
      case 'mood': {
        // These trigger based on current state, always ready
        shouldTrigger = pattern.confidence >= 60;
        triggerTime = Date.now() + (5 * 60 * 1000);
        break;
      }
      case 'location': {
        shouldTrigger = pattern.confidence >= 65;
        triggerTime = Date.now() + (10 * 60 * 1000);
        break;
      }
    }

    if (shouldTrigger && pattern.confidence >= 50) {
      const topFood = pattern.foodItems[0] || 'unhealthy food';
      const alternatives = generateAlternatives(topFood, pattern);

      predictions.push({
        id: `pred_${pattern.id}_${Date.now()}`,
        userId,
        patternId: pattern.id,
        predictedBehavior: pattern.description,
        predictedFood: topFood,
        confidence: pattern.confidence,
        triggerTime,
        alternatives,
        status: 'pending',
        userResponse: null,
        respondedAt: null,
        createdAt: Date.now(),
      });
    }
  });

  return predictions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

function generateAlternatives(predictedFood: string, pattern: Pattern): Alternative[] {
  const alternatives: Alternative[] = [];
  const foodItem = foodDatabase.find(f => f.name.toLowerCase() === predictedFood.toLowerCase());
  
  // 1. Nearby healthy restaurant option
  const restaurants = getRestaurants();
  const healthyRestaurant = restaurants.find(r => r.healthScore >= 7);
  if (healthyRestaurant) {
    alternatives.push({
      type: 'restaurant',
      name: healthyRestaurant.name,
      description: `${healthyRestaurant.healthyItems[0]} at ${healthyRestaurant.name} (${healthyRestaurant.distance}m away)`,
      calories: Math.round(Math.random() * 100 + 200),
      healthScore: healthyRestaurant.healthScore,
      distance: `${healthyRestaurant.distance}m`,
    });
  }

  // 2. Quick home recipe
  const homeOptions = [
    { name: 'Quick Protein Bowl', desc: 'Brown rice + grilled chicken + veggies', cal: 350, time: '15 min' },
    { name: 'Oats Smoothie Bowl', desc: 'Oats + banana + peanut butter + berries', cal: 280, time: '5 min' },
    { name: 'Egg Wrap', desc: 'Whole wheat wrap + scrambled eggs + spinach', cal: 300, time: '10 min' },
    { name: 'Paneer Tikka Salad', desc: 'Grilled paneer + mixed greens + dressing', cal: 250, time: '12 min' },
    { name: 'Dal Khichdi', desc: 'Moong dal + rice + veggies + ghee', cal: 320, time: '20 min' },
    { name: 'Vegetable Stir Fry', desc: 'Mixed vegetables + soy sauce + brown rice', cal: 280, time: '15 min' },
  ];
  const homeOption = homeOptions[Math.floor(Math.random() * homeOptions.length)];
  alternatives.push({
    type: 'home_recipe',
    name: homeOption.name,
    description: homeOption.desc,
    calories: homeOption.cal,
    healthScore: 8,
    prepTime: homeOption.time,
  });

  // 3. Healthier swap
  if (foodItem) {
    const healthyAlts = getHealthyAlternatives(foodItem);
    if (healthyAlts.length > 0) {
      const alt = healthyAlts[0];
      alternatives.push({
        type: 'healthier_swap',
        name: alt.name,
        description: `Similar taste, ${alt.calories} cal instead of ${foodItem.calories} cal. Health score: ${alt.healthScore}/10`,
        calories: alt.calories,
        healthScore: alt.healthScore,
      });
    }
  } else {
    alternatives.push({
      type: 'healthier_swap',
      name: 'Grilled Chicken Salad',
      description: 'High protein, low calorie option that satisfies cravings',
      calories: 220,
      healthScore: 9,
    });
  }

  return alternatives;
}

// ─── Smart Notification Generator ───────────────────────────
export function generateSmartNotification(patterns: Pattern[]): string | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentTimeOfDay = classifyTimeOfDay(currentHour);

  // Find the most relevant active pattern
  const relevantPattern = patterns
    .filter(p => p.isNegative && p.confidence >= 55)
    .sort((a, b) => b.confidence - a.confidence)[0];

  if (!relevantPattern) return null;

  const messages: Record<PatternType, string[]> = {
    temporal: [
      `🕐 You usually order ${relevantPattern.foodItems[0]} around this time. Healthier options nearby?`,
      `⏰ Pattern detected: ${relevantPattern.description}. Let's break the cycle!`,
      `🌙 Late night craving alert! You tend to order junk now. Try these alternatives?`,
    ],
    location: [
      `📍 You're near ${relevantPattern.triggerConditions.location}. Last time you ordered ${relevantPattern.foodItems[0]}. Try something healthier?`,
      `🗺️ Pattern: ${relevantPattern.description}. We found healthy alternatives nearby!`,
    ],
    stress: [
      `😤 Feeling stressed? You usually reach for ${relevantPattern.foodItems[0]}. Here are comfort foods that are actually healthy!`,
      `🧘 Stress eating pattern detected (${relevantPattern.confidence}% match). Let us suggest better options!`,
    ],
    day_of_week: [
      `📅 It's your usual ${relevantPattern.foodItems[0]} day! Want to try a healthier version?`,
      `🗓️ ${relevantPattern.description}. Ready for a health-conscious alternative?`,
    ],
    mood: [
      `💭 We notice you tend to eat unhealthy when ${relevantPattern.triggerConditions.mood}. Need comfort food that's actually good for you?`,
    ],
    social: [
      `👥 Social eating detected! Here are fun, healthy group food options.`,
    ],
  };

  const typeMessages = messages[relevantPattern.type] || messages.temporal;
  return typeMessages[Math.floor(Math.random() * typeMessages.length)];
}

// ─── Helper Functions ───────────────────────────────────────
function getWeekSpan(logs: BehaviorLog[]): number {
  if (logs.length < 2) return 1;
  const timestamps = logs.map(l => l.timestamp);
  const span = Math.max(...timestamps) - Math.min(...timestamps);
  return Math.max(1, Math.ceil(span / (7 * 24 * 60 * 60 * 1000)));
}

function getTimeOfDayFromRange(startTime: string): TimeOfDay {
  const hour = parseInt(startTime.split(':')[0]);
  return classifyTimeOfDay(hour);
}

// ─── Intervention Response Processor ────────────────────────
export function processInterventionResponse(
  prediction: Prediction,
  response: 'accepted' | 'rejected' | 'ignored'
): { pointsEarned: number; message: string } {
  switch (response) {
    case 'accepted':
      return { pointsEarned: 25, message: '🎉 Great choice! +25 points for making a healthy decision!' };
    case 'rejected':
      return { pointsEarned: 0, message: 'No worries! We\'ll keep learning your preferences.' };
    case 'ignored':
      return { pointsEarned: 0, message: '' };
  }
}
