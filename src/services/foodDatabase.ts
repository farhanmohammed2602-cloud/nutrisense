// ============================================================
// NutriSense AI - Comprehensive Food Database
// 100+ foods with full nutrition data
// ============================================================

import { FoodItem } from '../types';

export const foodDatabase: FoodItem[] = [
  // ─── Indian Breakfast ──────────────────────────────────────
  { id: 'f001', name: 'Masala Dosa', category: 'breakfast', cuisine: 'indian', calories: 250, protein: 6, carbs: 35, fat: 10, fiber: 2, sugar: 3, sodium: 400, healthScore: 6, verdict: 'moderate', servingSize: '1 dosa', alternatives: ['Ragi Dosa', 'Oats Dosa'], tags: ['south_indian', 'fermented'] },
  { id: 'f002', name: 'Idli Sambar', category: 'breakfast', cuisine: 'indian', calories: 180, protein: 8, carbs: 32, fat: 3, fiber: 4, sugar: 2, sodium: 350, healthScore: 8, verdict: 'excellent', servingSize: '3 idlis + sambar', alternatives: ['Ragi Idli'], tags: ['south_indian', 'steamed', 'fermented'] },
  { id: 'f003', name: 'Poha', category: 'breakfast', cuisine: 'indian', calories: 200, protein: 4, carbs: 38, fat: 5, fiber: 2, sugar: 2, sodium: 300, healthScore: 7, verdict: 'good', servingSize: '1 bowl', alternatives: ['Oats Poha'], tags: ['light', 'flattened_rice'] },
  { id: 'f004', name: 'Aloo Paratha', category: 'breakfast', cuisine: 'indian', calories: 320, protein: 7, carbs: 42, fat: 14, fiber: 3, sugar: 2, sodium: 500, healthScore: 5, verdict: 'moderate', servingSize: '1 paratha', alternatives: ['Methi Paratha', 'Roti with Vegetables'], tags: ['north_indian', 'stuffed'] },
  { id: 'f005', name: 'Upma', category: 'breakfast', cuisine: 'indian', calories: 190, protein: 5, carbs: 30, fat: 6, fiber: 3, sugar: 1, sodium: 350, healthScore: 7, verdict: 'good', servingSize: '1 bowl', alternatives: ['Oats Upma', 'Quinoa Upma'], tags: ['south_indian', 'semolina'] },
  { id: 'f006', name: 'Chole Bhature', category: 'breakfast', cuisine: 'indian', calories: 520, protein: 14, carbs: 60, fat: 26, fiber: 8, sugar: 4, sodium: 800, healthScore: 3, verdict: 'poor', servingSize: '2 bhature + chole', alternatives: ['Chole with Roti', 'Chole Salad Bowl'], tags: ['north_indian', 'fried', 'heavy'] },
  { id: 'f007', name: 'Oats Porridge', category: 'breakfast', cuisine: 'indian', calories: 150, protein: 6, carbs: 27, fat: 3, fiber: 4, sugar: 2, sodium: 100, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['healthy', 'fiber_rich'] },
  { id: 'f008', name: 'Sprouts Salad', category: 'breakfast', cuisine: 'indian', calories: 120, protein: 8, carbs: 18, fat: 2, fiber: 6, sugar: 3, sodium: 150, healthScore: 10, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['raw', 'protein_rich', 'healthy'] },

  // ─── Indian Lunch/Dinner ──────────────────────────────────
  { id: 'f010', name: 'Chicken Biryani', category: 'lunch', cuisine: 'indian', calories: 450, protein: 22, carbs: 55, fat: 16, fiber: 2, sugar: 3, sodium: 700, healthScore: 5, verdict: 'moderate', servingSize: '1 plate', alternatives: ['Chicken Pulao', 'Brown Rice Biryani', 'Grilled Chicken Bowl'], tags: ['rice', 'non_veg', 'spicy'] },
  { id: 'f011', name: 'Fried Biryani', category: 'lunch', cuisine: 'indian', calories: 580, protein: 20, carbs: 62, fat: 28, fiber: 1, sugar: 4, sodium: 900, healthScore: 3, verdict: 'poor', servingSize: '1 plate', alternatives: ['Steamed Biryani', 'Grilled Chicken Salad'], tags: ['fried', 'heavy', 'non_veg'] },
  { id: 'f012', name: 'Dal Tadka with Roti', category: 'lunch', cuisine: 'indian', calories: 350, protein: 16, carbs: 48, fat: 10, fiber: 8, sugar: 3, sodium: 450, healthScore: 8, verdict: 'excellent', servingSize: '1 bowl + 2 rotis', alternatives: [], tags: ['lentils', 'protein_rich', 'vegetarian'] },
  { id: 'f013', name: 'Paneer Butter Masala', category: 'dinner', cuisine: 'indian', calories: 420, protein: 18, carbs: 22, fat: 30, fiber: 3, sugar: 6, sodium: 650, healthScore: 5, verdict: 'moderate', servingSize: '1 bowl', alternatives: ['Palak Paneer', 'Paneer Tikka'], tags: ['rich', 'creamy', 'vegetarian'] },
  { id: 'f014', name: 'Palak Paneer with Roti', category: 'dinner', cuisine: 'indian', calories: 340, protein: 18, carbs: 35, fat: 15, fiber: 5, sugar: 3, sodium: 400, healthScore: 8, verdict: 'excellent', servingSize: '1 bowl + 2 rotis', alternatives: [], tags: ['spinach', 'iron_rich', 'vegetarian'] },
  { id: 'f015', name: 'Rajma Chawal', category: 'lunch', cuisine: 'indian', calories: 380, protein: 14, carbs: 60, fat: 8, fiber: 10, sugar: 4, sodium: 500, healthScore: 7, verdict: 'good', servingSize: '1 plate', alternatives: ['Rajma with Brown Rice'], tags: ['kidney_beans', 'comfort_food'] },
  { id: 'f016', name: 'Tandoori Chicken', category: 'dinner', cuisine: 'indian', calories: 260, protein: 32, carbs: 8, fat: 12, fiber: 1, sugar: 2, sodium: 550, healthScore: 8, verdict: 'excellent', servingSize: '2 pieces', alternatives: [], tags: ['grilled', 'high_protein', 'non_veg'] },
  { id: 'f017', name: 'Fish Curry with Rice', category: 'dinner', cuisine: 'indian', calories: 380, protein: 28, carbs: 42, fat: 10, fiber: 2, sugar: 3, sodium: 500, healthScore: 7, verdict: 'good', servingSize: '1 plate', alternatives: ['Grilled Fish with Salad'], tags: ['omega3', 'non_veg'] },
  { id: 'f018', name: 'Butter Chicken', category: 'dinner', cuisine: 'indian', calories: 490, protein: 28, carbs: 18, fat: 34, fiber: 2, sugar: 8, sodium: 750, healthScore: 4, verdict: 'moderate', servingSize: '1 bowl', alternatives: ['Tandoori Chicken', 'Chicken Tikka'], tags: ['creamy', 'rich', 'non_veg'] },
  { id: 'f019', name: 'Vegetable Thali', category: 'lunch', cuisine: 'indian', calories: 550, protein: 18, carbs: 72, fat: 20, fiber: 12, sugar: 8, sodium: 600, healthScore: 7, verdict: 'good', servingSize: '1 thali', alternatives: [], tags: ['balanced', 'complete_meal'] },
  { id: 'f020', name: 'Grilled Chicken Salad', category: 'lunch', cuisine: 'indian', calories: 220, protein: 28, carbs: 12, fat: 8, fiber: 4, sugar: 5, sodium: 300, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['high_protein', 'low_carb', 'healthy'] },

  // ─── Street Food / Fast Food ──────────────────────────────
  { id: 'f030', name: 'Pani Puri', category: 'snack', cuisine: 'indian', calories: 280, protein: 6, carbs: 42, fat: 10, fiber: 3, sugar: 6, sodium: 600, healthScore: 4, verdict: 'moderate', servingSize: '6 puris', alternatives: ['Sprouts Chaat'], tags: ['street_food', 'crispy'] },
  { id: 'f031', name: 'Samosa', category: 'snack', cuisine: 'indian', calories: 260, protein: 5, carbs: 30, fat: 14, fiber: 2, sugar: 2, sodium: 450, healthScore: 3, verdict: 'poor', servingSize: '2 samosas', alternatives: ['Baked Samosa', 'Sprouts Tikki'], tags: ['fried', 'street_food'] },
  { id: 'f032', name: 'Vada Pav', category: 'snack', cuisine: 'indian', calories: 310, protein: 6, carbs: 38, fat: 16, fiber: 2, sugar: 3, sodium: 500, healthScore: 3, verdict: 'poor', servingSize: '1 piece', alternatives: ['Grilled Paneer Sandwich'], tags: ['fried', 'mumbai', 'street_food'] },
  { id: 'f033', name: 'Pizza (Regular)', category: 'fast_food', cuisine: 'italian', calories: 270, protein: 11, carbs: 33, fat: 12, fiber: 2, sugar: 4, sodium: 650, healthScore: 4, verdict: 'moderate', servingSize: '1 slice', alternatives: ['Whole Wheat Pizza', 'Veggie Flatbread'], tags: ['cheese', 'fast_food'] },
  { id: 'f034', name: 'Burger (Chicken)', category: 'fast_food', cuisine: 'american', calories: 450, protein: 22, carbs: 40, fat: 22, fiber: 2, sugar: 8, sodium: 800, healthScore: 3, verdict: 'poor', servingSize: '1 burger', alternatives: ['Grilled Chicken Wrap', 'Lettuce Wrap Burger'], tags: ['fast_food', 'processed'] },
  { id: 'f035', name: 'French Fries', category: 'snack', cuisine: 'american', calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sugar: 1, sodium: 230, healthScore: 2, verdict: 'poor', servingSize: 'medium', alternatives: ['Sweet Potato Fries', 'Baked Wedges'], tags: ['fried', 'fast_food'] },
  { id: 'f036', name: 'Momos (Fried)', category: 'snack', cuisine: 'chinese', calories: 350, protein: 12, carbs: 35, fat: 18, fiber: 1, sugar: 2, sodium: 550, healthScore: 3, verdict: 'poor', servingSize: '6 pieces', alternatives: ['Steamed Momos', 'Steamed Veg Dim Sum'], tags: ['fried', 'street_food'] },
  { id: 'f037', name: 'Steamed Momos', category: 'snack', cuisine: 'chinese', calories: 200, protein: 12, carbs: 28, fat: 5, fiber: 1, sugar: 2, sodium: 400, healthScore: 7, verdict: 'good', servingSize: '6 pieces', alternatives: [], tags: ['steamed', 'light'] },

  // ─── Healthy Options ──────────────────────────────────────
  { id: 'f040', name: 'Quinoa Bowl', category: 'lunch', cuisine: 'mediterranean', calories: 320, protein: 14, carbs: 45, fat: 10, fiber: 6, sugar: 4, sodium: 300, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['superfood', 'complete_protein'] },
  { id: 'f041', name: 'Greek Yogurt Parfait', category: 'breakfast', cuisine: 'mediterranean', calories: 200, protein: 15, carbs: 25, fat: 5, fiber: 3, sugar: 12, sodium: 100, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['probiotic', 'protein_rich'] },
  { id: 'f042', name: 'Chicken Breast (Grilled)', category: 'dinner', cuisine: 'american', calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0, sugar: 0, sodium: 200, healthScore: 9, verdict: 'excellent', servingSize: '100g', alternatives: [], tags: ['lean_protein', 'muscle_building'] },
  { id: 'f043', name: 'Brown Rice Bowl', category: 'lunch', cuisine: 'indian', calories: 280, protein: 6, carbs: 58, fat: 3, fiber: 4, sugar: 1, sodium: 200, healthScore: 7, verdict: 'good', servingSize: '1 bowl', alternatives: [], tags: ['whole_grain', 'fiber_rich'] },
  { id: 'f044', name: 'Protein Smoothie', category: 'snack', cuisine: 'american', calories: 250, protein: 24, carbs: 30, fat: 5, fiber: 3, sugar: 18, sodium: 150, healthScore: 8, verdict: 'excellent', servingSize: '1 glass', alternatives: [], tags: ['post_workout', 'protein_rich'] },
  { id: 'f045', name: 'Mixed Vegetable Soup', category: 'dinner', cuisine: 'indian', calories: 120, protein: 4, carbs: 18, fat: 3, fiber: 5, sugar: 6, sodium: 350, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['low_calorie', 'warm', 'comforting'] },
  { id: 'f046', name: 'Egg White Omelette', category: 'breakfast', cuisine: 'american', calories: 120, protein: 18, carbs: 2, fat: 4, fiber: 0, sugar: 1, sodium: 300, healthScore: 9, verdict: 'excellent', servingSize: '3 egg whites + veggies', alternatives: [], tags: ['high_protein', 'low_fat'] },
  { id: 'f047', name: 'Avocado Toast', category: 'breakfast', cuisine: 'american', calories: 280, protein: 8, carbs: 28, fat: 16, fiber: 7, sugar: 1, sodium: 250, healthScore: 8, verdict: 'excellent', servingSize: '1 slice', alternatives: [], tags: ['healthy_fats', 'whole_grain'] },

  // ─── Beverages ────────────────────────────────────────────
  { id: 'f050', name: 'Masala Chai', category: 'beverage', cuisine: 'indian', calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 0, sugar: 10, sodium: 50, healthScore: 6, verdict: 'moderate', servingSize: '1 cup', alternatives: ['Green Tea', 'Black Coffee'], tags: ['tea', 'warm'] },
  { id: 'f051', name: 'Green Tea', category: 'beverage', cuisine: 'japanese', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0, sugar: 0, sodium: 0, healthScore: 10, verdict: 'excellent', servingSize: '1 cup', alternatives: [], tags: ['antioxidant', 'zero_calorie'] },
  { id: 'f052', name: 'Cold Coffee', category: 'beverage', cuisine: 'american', calories: 220, protein: 4, carbs: 35, fat: 8, fiber: 0, sugar: 30, sodium: 100, healthScore: 3, verdict: 'poor', servingSize: '1 glass', alternatives: ['Black Coffee', 'Green Tea'], tags: ['sugar_heavy', 'caffeine'] },
  { id: 'f053', name: 'Fresh Orange Juice', category: 'beverage', cuisine: 'american', calories: 110, protein: 2, carbs: 26, fat: 0, fiber: 0, sugar: 22, sodium: 5, healthScore: 7, verdict: 'good', servingSize: '1 glass', alternatives: ['Whole Orange'], tags: ['vitamin_c', 'natural'] },
  { id: 'f054', name: 'Lassi (Sweet)', category: 'beverage', cuisine: 'indian', calories: 180, protein: 6, carbs: 30, fat: 5, fiber: 0, sugar: 26, sodium: 80, healthScore: 5, verdict: 'moderate', servingSize: '1 glass', alternatives: ['Chaas', 'Buttermilk'], tags: ['probiotic', 'sweet'] },
  { id: 'f055', name: 'Buttermilk (Chaas)', category: 'beverage', cuisine: 'indian', calories: 40, protein: 3, carbs: 5, fat: 1, fiber: 0, sugar: 4, sodium: 200, healthScore: 9, verdict: 'excellent', servingSize: '1 glass', alternatives: [], tags: ['digestive', 'probiotic', 'low_calorie'] },
  { id: 'f056', name: 'Soft Drink (Cola)', category: 'beverage', cuisine: 'american', calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, sodium: 45, healthScore: 1, verdict: 'poor', servingSize: '1 can', alternatives: ['Sparkling Water', 'Lemon Water', 'Green Tea'], tags: ['sugar_bomb', 'processed', 'unhealthy'] },
  { id: 'f057', name: 'Coconut Water', category: 'beverage', cuisine: 'indian', calories: 45, protein: 2, carbs: 9, fat: 0, fiber: 0, sugar: 6, sodium: 250, healthScore: 9, verdict: 'excellent', servingSize: '1 glass', alternatives: [], tags: ['electrolytes', 'natural', 'hydrating'] },

  // ─── Desserts ─────────────────────────────────────────────
  { id: 'f060', name: 'Gulab Jamun', category: 'dessert', cuisine: 'indian', calories: 150, protein: 2, carbs: 25, fat: 5, fiber: 0, sugar: 22, sodium: 50, healthScore: 2, verdict: 'poor', servingSize: '2 pieces', alternatives: ['Date Balls', 'Fruit Bowl'], tags: ['sweet', 'fried', 'sugar_heavy'] },
  { id: 'f061', name: 'Ice Cream', category: 'dessert', cuisine: 'american', calories: 270, protein: 5, carbs: 32, fat: 14, fiber: 0, sugar: 28, sodium: 90, healthScore: 2, verdict: 'poor', servingSize: '1 scoop', alternatives: ['Frozen Yogurt', 'Banana Ice Cream'], tags: ['cold', 'sugar_heavy'] },
  { id: 'f062', name: 'Dark Chocolate', category: 'dessert', cuisine: 'american', calories: 170, protein: 2, carbs: 13, fat: 12, fiber: 3, sugar: 7, sodium: 20, healthScore: 6, verdict: 'moderate', servingSize: '30g', alternatives: [], tags: ['antioxidant', 'moderate'] },
  { id: 'f063', name: 'Fresh Fruit Bowl', category: 'dessert', cuisine: 'indian', calories: 100, protein: 1, carbs: 25, fat: 0, fiber: 4, sugar: 18, sodium: 5, healthScore: 10, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['natural', 'vitamin_rich', 'healthy'] },

  // ─── Chinese/Thai ─────────────────────────────────────────
  { id: 'f070', name: 'Fried Rice', category: 'lunch', cuisine: 'chinese', calories: 380, protein: 10, carbs: 52, fat: 15, fiber: 2, sugar: 3, sodium: 700, healthScore: 4, verdict: 'moderate', servingSize: '1 plate', alternatives: ['Steamed Rice with Veggies'], tags: ['fried', 'heavy'] },
  { id: 'f071', name: 'Manchurian (Dry)', category: 'snack', cuisine: 'chinese', calories: 320, protein: 8, carbs: 35, fat: 17, fiber: 2, sugar: 6, sodium: 800, healthScore: 3, verdict: 'poor', servingSize: '1 plate', alternatives: ['Steamed Dim Sum'], tags: ['fried', 'indo_chinese'] },
  { id: 'f072', name: 'Spring Rolls', category: 'snack', cuisine: 'chinese', calories: 200, protein: 4, carbs: 22, fat: 11, fiber: 1, sugar: 2, sodium: 350, healthScore: 4, verdict: 'moderate', servingSize: '2 rolls', alternatives: ['Fresh Spring Rolls (Rice Paper)'], tags: ['fried', 'crispy'] },
  { id: 'f073', name: 'Thai Green Curry', category: 'dinner', cuisine: 'thai', calories: 350, protein: 20, carbs: 18, fat: 24, fiber: 3, sugar: 5, sodium: 600, healthScore: 6, verdict: 'moderate', servingSize: '1 bowl', alternatives: ['Tom Yum Soup'], tags: ['coconut', 'spicy'] },
  { id: 'f074', name: 'Pad Thai', category: 'dinner', cuisine: 'thai', calories: 400, protein: 16, carbs: 48, fat: 16, fiber: 2, sugar: 8, sodium: 700, healthScore: 5, verdict: 'moderate', servingSize: '1 plate', alternatives: ['Zucchini Noodles'], tags: ['noodles', 'sweet'] },

  // ─── Italian ──────────────────────────────────────────────
  { id: 'f080', name: 'Pasta Alfredo', category: 'dinner', cuisine: 'italian', calories: 520, protein: 16, carbs: 55, fat: 26, fiber: 2, sugar: 4, sodium: 750, healthScore: 3, verdict: 'poor', servingSize: '1 plate', alternatives: ['Whole Wheat Pasta with Marinara'], tags: ['creamy', 'heavy'] },
  { id: 'f081', name: 'Margherita Pizza', category: 'lunch', cuisine: 'italian', calories: 300, protein: 14, carbs: 36, fat: 12, fiber: 2, sugar: 5, sodium: 600, healthScore: 5, verdict: 'moderate', servingSize: '1 slice', alternatives: ['Thin Crust Veggie Pizza'], tags: ['cheese', 'classic'] },
  { id: 'f082', name: 'Minestrone Soup', category: 'dinner', cuisine: 'italian', calories: 130, protein: 5, carbs: 22, fat: 3, fiber: 5, sugar: 6, sodium: 400, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['vegetable', 'light', 'healthy'] },

  // ─── Snacks & Quick Bites ─────────────────────────────────
  { id: 'f090', name: 'Mixed Nuts', category: 'snack', cuisine: 'indian', calories: 170, protein: 5, carbs: 7, fat: 15, fiber: 2, sugar: 2, sodium: 50, healthScore: 8, verdict: 'excellent', servingSize: '30g', alternatives: [], tags: ['healthy_fats', 'protein'] },
  { id: 'f091', name: 'Protein Bar', category: 'snack', cuisine: 'american', calories: 200, protein: 20, carbs: 22, fat: 7, fiber: 3, sugar: 8, sodium: 200, healthScore: 7, verdict: 'good', servingSize: '1 bar', alternatives: [], tags: ['convenient', 'protein_rich'] },
  { id: 'f092', name: 'Namkeen / Bhujia', category: 'snack', cuisine: 'indian', calories: 500, protein: 12, carbs: 52, fat: 28, fiber: 5, sugar: 3, sodium: 900, healthScore: 2, verdict: 'poor', servingSize: '100g', alternatives: ['Roasted Makhana', 'Mixed Nuts'], tags: ['fried', 'processed', 'salty'] },
  { id: 'f093', name: 'Roasted Makhana', category: 'snack', cuisine: 'indian', calories: 100, protein: 4, carbs: 18, fat: 1, fiber: 2, sugar: 0, sodium: 100, healthScore: 9, verdict: 'excellent', servingSize: '1 bowl', alternatives: [], tags: ['light', 'healthy', 'low_calorie'] },
  { id: 'f094', name: 'Banana', category: 'snack', cuisine: 'indian', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1, healthScore: 8, verdict: 'excellent', servingSize: '1 medium', alternatives: [], tags: ['fruit', 'natural', 'energy'] },
  { id: 'f095', name: 'Paneer Tikka', category: 'snack', cuisine: 'indian', calories: 220, protein: 16, carbs: 8, fat: 14, fiber: 1, sugar: 2, sodium: 400, healthScore: 7, verdict: 'good', servingSize: '6 pieces', alternatives: [], tags: ['grilled', 'protein_rich', 'vegetarian'] },
  { id: 'f096', name: 'Chips (Packet)', category: 'snack', cuisine: 'american', calories: 530, protein: 7, carbs: 53, fat: 33, fiber: 4, sugar: 1, sodium: 620, healthScore: 1, verdict: 'poor', servingSize: '100g', alternatives: ['Baked Chips', 'Roasted Makhana', 'Mixed Nuts'], tags: ['processed', 'fried', 'junk'] },

  // ─── Fitness & Workout Foods ──────────────────────────────
  { id: 'f100', name: 'Whey Protein Shake', category: 'beverage', cuisine: 'american', calories: 130, protein: 25, carbs: 5, fat: 2, fiber: 0, sugar: 2, sodium: 150, healthScore: 8, verdict: 'excellent', servingSize: '1 scoop + water', alternatives: [], tags: ['post_workout', 'muscle_building'] },
  { id: 'f101', name: 'Peanut Butter Toast', category: 'breakfast', cuisine: 'american', calories: 250, protein: 10, carbs: 28, fat: 12, fiber: 3, sugar: 4, sodium: 250, healthScore: 7, verdict: 'good', servingSize: '1 slice', alternatives: [], tags: ['protein', 'healthy_fats'] },
  { id: 'f102', name: 'Boiled Eggs', category: 'breakfast', cuisine: 'indian', calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0, sugar: 1, sodium: 125, healthScore: 9, verdict: 'excellent', servingSize: '2 eggs', alternatives: [], tags: ['protein_rich', 'simple'] },
  { id: 'f103', name: 'Chicken Wrap', category: 'lunch', cuisine: 'american', calories: 320, protein: 24, carbs: 32, fat: 10, fiber: 3, sugar: 3, sodium: 500, healthScore: 7, verdict: 'good', servingSize: '1 wrap', alternatives: [], tags: ['balanced', 'portable'] },
  { id: 'f104', name: 'Salmon Fillet', category: 'dinner', cuisine: 'japanese', calories: 280, protein: 34, carbs: 0, fat: 16, fiber: 0, sugar: 0, sodium: 300, healthScore: 9, verdict: 'excellent', servingSize: '150g', alternatives: [], tags: ['omega3', 'lean_protein'] },
];

export function searchFoods(query: string): FoodItem[] {
  const lower = query.toLowerCase();
  return foodDatabase.filter(f =>
    f.name.toLowerCase().includes(lower) ||
    f.tags.some(t => t.includes(lower)) ||
    f.category.includes(lower) ||
    f.cuisine.includes(lower)
  );
}

export function getFoodById(id: string): FoodItem | undefined {
  return foodDatabase.find(f => f.id === id);
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return foodDatabase.filter(f => f.category === category);
}

export function getHealthyAlternatives(food: FoodItem): FoodItem[] {
  return foodDatabase.filter(f =>
    f.healthScore >= 7 &&
    f.id !== food.id &&
    (f.category === food.category || f.cuisine === food.cuisine) &&
    Math.abs(f.calories - food.calories) < 200
  ).sort((a, b) => b.healthScore - a.healthScore).slice(0, 5);
}

export function getRandomFoods(count: number, minHealthScore = 0): FoodItem[] {
  const filtered = foodDatabase.filter(f => f.healthScore >= minHealthScore);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
