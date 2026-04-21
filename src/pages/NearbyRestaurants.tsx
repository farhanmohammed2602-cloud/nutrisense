// ============================================================
// NutriSense AI - Nearby Restaurants Page
// ============================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Heart, Navigation, Filter, Search, Leaf, DollarSign, Clock } from 'lucide-react';
import { useAppSelector } from '../hooks/useStore';
import { getRestaurants, filterRestaurants } from '../services/restaurantService';
import { Restaurant } from '../types';

export default function NearbyRestaurants() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minHealthScore: 0,
    maxDistance: 1000,
    priceRange: '' as string,
    openNow: false,
  });

  const darkMode = useAppSelector(s => s.app.darkMode);
  const navigate = useNavigate();

  const restaurants = useMemo(() => {
    let result = getRestaurants();

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(lower) ||
        r.type.toLowerCase().includes(lower) ||
        r.healthyItems.some(i => i.toLowerCase().includes(lower))
      );
    }

    if (filters.minHealthScore > 0) result = result.filter(r => r.healthScore >= filters.minHealthScore);
    if (filters.maxDistance < 1000) result = result.filter(r => r.distance <= filters.maxDistance);
    if (filters.priceRange) result = result.filter(r => r.priceRange === filters.priceRange);
    if (filters.openNow) result = result.filter(r => r.openNow);

    return result.sort((a, b) => a.distance - b.distance);
  }, [searchQuery, filters]);

  const healthyCount = restaurants.filter(r => r.healthScore >= 7).length;

  const getHealthColor = (score: number) => {
    if (score >= 8) return '#22c55e';
    if (score >= 6) return '#4ade80';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getPriceLabel = (price: string) => {
    switch (price) {
      case 'budget': return '₹';
      case 'moderate': return '₹₹';
      case 'premium': return '₹₹₹';
      default: return '₹';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold font-[var(--font-heading)]">Nearby Restaurants</h1>
            <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
              {healthyCount} healthy options found
            </p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl relative ${showFilters ? 'gradient-primary text-white' : darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}
            id="filter-btn"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`} />
          <input
            type="text"
            placeholder="Search restaurants, cuisines..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-11"
            id="restaurant-search"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="glass-card rounded-2xl p-4 mb-4 slide-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-xs font-medium mb-1 block ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  Min Health Score
                </label>
                <div className="flex gap-1">
                  {[0, 5, 7, 8].map(s => (
                    <button key={s} onClick={() => setFilters(f => ({ ...f, minHealthScore: s }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.minHealthScore === s
                          ? 'gradient-primary text-white'
                          : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)]'
                      }`}
                    >
                      {s === 0 ? 'All' : `${s}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1 block ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  Max Distance
                </label>
                <div className="flex gap-1">
                  {[300, 500, 1000].map(d => (
                    <button key={d} onClick={() => setFilters(f => ({ ...f, maxDistance: d }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.maxDistance === d
                          ? 'gradient-primary text-white'
                          : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)]'
                      }`}
                    >
                      {d >= 1000 ? '1km' : `${d}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1 block ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  Price Range
                </label>
                <div className="flex gap-1">
                  {['', 'budget', 'moderate', 'premium'].map(p => (
                    <button key={p} onClick={() => setFilters(f => ({ ...f, priceRange: p }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.priceRange === p
                          ? 'gradient-primary text-white'
                          : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)]'
                      }`}
                    >
                      {p === '' ? 'All' : p === 'budget' ? '₹' : p === 'moderate' ? '₹₹' : '₹₹₹'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button onClick={() => setFilters(f => ({ ...f, openNow: !f.openNow }))}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    filters.openNow
                      ? 'gradient-primary text-white'
                      : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)]'
                  }`}
                >
                  <Clock size={12} /> Open Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setViewMode('list')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'list' ? 'gradient-primary text-white' : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card)] text-[var(--color-light-text-secondary)]'
            }`}
          >
            📋 List View
          </button>
          <button onClick={() => setViewMode('map')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'map' ? 'gradient-primary text-white' : darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card)] text-[var(--color-light-text-secondary)]'
            }`}
          >
            🗺️ Map View
          </button>
        </div>

        {viewMode === 'map' && (
          <div className={`rounded-2xl overflow-hidden mb-4 ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}
            style={{ height: '250px' }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin size={40} className="text-[var(--color-primary)] mx-auto mb-2 opacity-50" />
                <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
                  Map view showing {restaurants.length} restaurants
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                  Interactive map with Google Places API integration
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Cards */}
        <div className="space-y-3 stagger-children">
          {restaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              darkMode={darkMode}
              getHealthColor={getHealthColor}
              getPriceLabel={getPriceLabel}
            />
          ))}

          {restaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                No restaurants match your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant, darkMode, getHealthColor, getPriceLabel }: {
  restaurant: Restaurant; darkMode: boolean;
  getHealthColor: (s: number) => string; getPriceLabel: (p: string) => string;
}) {
  return (
    <div className={`glass-card rounded-2xl p-4 cursor-pointer`} id={`restaurant-${restaurant.id}`}>
      <div className="flex items-start gap-3">
        {/* Health Score Badge */}
        <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
          style={{ background: `${getHealthColor(restaurant.healthScore)}15` }}>
          <span className="text-lg font-bold" style={{ color: getHealthColor(restaurant.healthScore) }}>
            {restaurant.healthScore}
          </span>
          <span className="text-[8px] font-medium" style={{ color: getHealthColor(restaurant.healthScore) }}>HEALTH</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm">{restaurant.name}</h3>
              <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                {restaurant.type} • {restaurant.cuisine.join(', ')}
              </p>
            </div>
            {restaurant.openNow ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-score-excellent score-excellent">Open</span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-score-poor score-poor">Closed</span>
            )}
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs">
              <Navigation size={12} className="text-[var(--color-blue)]" />
              <span className={darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}>
                {restaurant.distance}m
              </span>
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Star size={12} className="text-[var(--color-warning)]" fill="var(--color-warning)" />
              <span className={darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}>
                {restaurant.rating}
              </span>
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
              {getPriceLabel(restaurant.priceRange)}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Leaf size={12} className="text-[var(--color-primary)]" />
              <span className={darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}>
                {restaurant.healthyOptionsCount} healthy
              </span>
            </span>
          </div>

          {/* Healthy Items */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {restaurant.healthyItems.slice(0, 3).map(item => (
              <span key={item} className={`text-[10px] px-2 py-0.5 rounded-full ${
                darkMode ? 'bg-[var(--color-dark-card)] text-[var(--color-dark-text-secondary)]' : 'bg-[var(--color-light-card-hover)] text-[var(--color-light-text-secondary)]'
              }`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Badge */}
      {restaurant.deliveryAvailable && (
        <div className={`mt-3 pt-3 border-t flex items-center justify-between ${darkMode ? 'border-[var(--color-dark-border)]' : 'border-[var(--color-light-border)]'}`}>
          <span className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
            🚴 Delivery available
          </span>
          <button className="text-xs text-[var(--color-primary)] font-semibold flex items-center gap-1">
            Get Directions <Navigation size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
