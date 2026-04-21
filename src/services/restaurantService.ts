// ============================================================
// NutriSense AI - Restaurant Service
// Mock nearby healthy restaurants with full data
// ============================================================

import { Restaurant } from '../types';

const mockRestaurants: Restaurant[] = [
  {
    id: 'r001', name: 'Green Bowl Kitchen', type: 'Health Food', cuisine: ['indian', 'mediterranean'],
    distance: 320, rating: 4.5, healthScore: 9, priceRange: 'moderate', healthyOptionsCount: 18,
    address: '45 MG Road, Near Central Mall', lat: 17.385, lng: 78.4867,
    imageUrl: '', healthyItems: ['Quinoa Buddha Bowl', 'Grilled Chicken Salad', 'Smoothie Bowl', 'Avocado Toast'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r002', name: 'FitBites Cafe', type: 'Protein Bar & Cafe', cuisine: ['american', 'indian'],
    distance: 180, rating: 4.3, healthScore: 8, priceRange: 'moderate', healthyOptionsCount: 15,
    address: '12 Jubilee Hills, Road No 36', lat: 17.432, lng: 78.407,
    imageUrl: '', healthyItems: ['Protein Pancakes', 'Egg White Omelette', 'Oats Bowl', 'Grilled Wrap'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r003', name: 'Salad Story', type: 'Salad Bar', cuisine: ['mediterranean', 'italian'],
    distance: 450, rating: 4.7, healthScore: 10, priceRange: 'premium', healthyOptionsCount: 25,
    address: '78 Banjara Hills, Road No 2', lat: 17.426, lng: 78.441,
    imageUrl: '', healthyItems: ['Caesar Salad', 'Mediterranean Bowl', 'Grilled Paneer Salad', 'Fruit Parfait'],
    openNow: true, deliveryAvailable: false,
  },
  {
    id: 'r004', name: 'Roti & Rice', type: 'North Indian', cuisine: ['indian'],
    distance: 250, rating: 4.1, healthScore: 7, priceRange: 'budget', healthyOptionsCount: 10,
    address: '34 Ameerpet, SR Nagar', lat: 17.437, lng: 78.449,
    imageUrl: '', healthyItems: ['Dal Tadka', 'Tandoori Roti', 'Mixed Veg', 'Raita'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r005', name: 'Sushi & More', type: 'Japanese', cuisine: ['japanese'],
    distance: 800, rating: 4.6, healthScore: 8, priceRange: 'premium', healthyOptionsCount: 20,
    address: '56 Hitech City, Cyber Tower', lat: 17.448, lng: 78.381,
    imageUrl: '', healthyItems: ['Salmon Sashimi', 'Edamame', 'Miso Soup', 'Brown Rice Sushi'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r006', name: 'Idli Factory', type: 'South Indian', cuisine: ['indian'],
    distance: 150, rating: 4.2, healthScore: 8, priceRange: 'budget', healthyOptionsCount: 12,
    address: '23 Madhapur Main Road', lat: 17.442, lng: 78.392,
    imageUrl: '', healthyItems: ['Idli Sambar', 'Ragi Dosa', 'Upma', 'Pesarattu'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r007', name: 'The Protein Hub', type: 'Gym Cafe', cuisine: ['american', 'indian'],
    distance: 500, rating: 4.4, healthScore: 9, priceRange: 'moderate', healthyOptionsCount: 22,
    address: '89 Kondapur, Near Botanical Garden', lat: 17.459, lng: 78.365,
    imageUrl: '', healthyItems: ['Whey Protein Shake', 'Chicken Breast Bowl', 'Egg White Wrap', 'Power Smoothie'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r008', name: 'Pizza Palace', type: 'Fast Food', cuisine: ['italian', 'american'],
    distance: 100, rating: 4.0, healthScore: 3, priceRange: 'budget', healthyOptionsCount: 2,
    address: '67 Gachibowli Circle', lat: 17.440, lng: 78.350,
    imageUrl: '', healthyItems: ['Garden Salad'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r009', name: 'Biryani Pot', type: 'Biryani House', cuisine: ['indian'],
    distance: 200, rating: 4.3, healthScore: 4, priceRange: 'budget', healthyOptionsCount: 3,
    address: '45 Tolichowki Road', lat: 17.395, lng: 78.417,
    imageUrl: '', healthyItems: ['Tandoori Chicken'],
    openNow: true, deliveryAvailable: true,
  },
  {
    id: 'r010', name: 'Organic Express', type: 'Organic Cafe', cuisine: ['indian', 'mediterranean'],
    distance: 650, rating: 4.8, healthScore: 10, priceRange: 'premium', healthyOptionsCount: 30,
    address: '12 Film Nagar, Near NFDC', lat: 17.413, lng: 78.431,
    imageUrl: '', healthyItems: ['Organic Thali', 'Cold Pressed Juice', 'Millet Bowl', 'Sprouts Wrap'],
    openNow: false, deliveryAvailable: true,
  },
];

export function getRestaurants(): Restaurant[] {
  return mockRestaurants;
}

export function getHealthyRestaurants(maxDistance = 1000): Restaurant[] {
  return mockRestaurants
    .filter(r => r.healthScore >= 7 && r.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find(r => r.id === id);
}

export function searchRestaurants(query: string): Restaurant[] {
  const lower = query.toLowerCase();
  return mockRestaurants.filter(r =>
    r.name.toLowerCase().includes(lower) ||
    r.type.toLowerCase().includes(lower) ||
    r.cuisine.some(c => c.includes(lower)) ||
    r.healthyItems.some(i => i.toLowerCase().includes(lower))
  );
}

export function filterRestaurants(filters: {
  minHealthScore?: number;
  maxDistance?: number;
  priceRange?: string;
  cuisine?: string;
  openNow?: boolean;
}): Restaurant[] {
  return mockRestaurants.filter(r => {
    if (filters.minHealthScore && r.healthScore < filters.minHealthScore) return false;
    if (filters.maxDistance && r.distance > filters.maxDistance) return false;
    if (filters.priceRange && r.priceRange !== filters.priceRange) return false;
    if (filters.cuisine && !r.cuisine.includes(filters.cuisine as any)) return false;
    if (filters.openNow && !r.openNow) return false;
    return true;
  });
}
