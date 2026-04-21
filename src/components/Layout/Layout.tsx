// ============================================================
// NutriSense AI - Main Layout with Bottom Navigation
// ============================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanLine, MapPin, Trophy, Target, User, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { setShowFoodLogModal } from '../../store/slices/appSlice';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/scanner', icon: ScanLine, label: 'Scan' },
  { path: '/nearby', icon: MapPin, label: 'Nearby' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/achievements', icon: Trophy, label: 'Rewards' },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(s => s.app.darkMode);

  return (
    <div className={`min-h-screen md:h-screen md:overflow-hidden md:flex ${darkMode ? 'dark' : 'light'}`}>
      
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 md:border-r ${darkMode ? 'bg-[var(--color-dark-surface)] border-[var(--color-dark-border)]' : 'bg-white border-[var(--color-light-border)]'}`}
      >
        <div className="p-6 flex flex-col gap-1 border-b border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
          <h1 className="font-bold text-2xl font-[var(--font-heading)] text-[var(--color-primary)]">NutriSense</h1>
          <span className="text-xs text-[var(--color-light-text-muted)] dark:text-[var(--color-dark-text-muted)] font-medium tracking-wider">AI NUTRITION</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-[var(--color-primary)] text-white shadow-md' : darkMode ? 'text-[var(--color-dark-text-secondary)] hover:bg-[var(--color-dark-card-hover)] hover:text-white' : 'text-[var(--color-light-text-secondary)] hover:bg-[var(--color-light-card-hover)] hover:text-[var(--color-light-text)]' }`}
                onClick={() => navigate(path)}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <main className="md:flex-1 md:overflow-y-auto pb-20 md:pb-0 min-h-screen md:min-h-0 relative">
        {children}
      </main>

      {/* Floating Action Button - Add Food */}
      <button
        className="fab gradient-primary md:bottom-8 md:right-8"
        onClick={() => dispatch(setShowFoodLogModal(true))}
        aria-label="Log Food"
        id="fab-log-food"
      >
        <Plus size={24} color="white" />
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav md:hidden" id="bottom-navigation">
        <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                className={`nav-item ${isActive ? 'active' : darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}
                onClick={() => navigate(path)}
                id={`nav-${label.toLowerCase()}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
