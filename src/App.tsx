// ============================================================
// NutriSense AI - App Router
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector } from './hooks/useStore';
import Layout from './components/Layout/Layout';
import SplashAuth from './pages/SplashAuth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import FoodLogger from './pages/FoodLogger';
import FoodScanner from './pages/FoodScanner';
import NearbyRestaurants from './pages/NearbyRestaurants';
import GoalsProgress from './pages/GoalsProgress';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  const user = useAppSelector(s => s.auth.user);
  if (isAuthenticated && user?.onboardingComplete) return <Navigate to="/dashboard" replace />;
  if (isAuthenticated && !user?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route path="/" element={<AuthRoute><SplashAuth /></AuthRoute>} />
        <Route path="/onboarding" element={
          <ProtectedRoute><Onboarding /></ProtectedRoute>
        } />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        } />
        <Route path="/food-logger" element={
          <ProtectedRoute><Layout><FoodLogger /></Layout></ProtectedRoute>
        } />
        <Route path="/scanner" element={
          <ProtectedRoute><Layout><FoodScanner /></Layout></ProtectedRoute>
        } />
        <Route path="/nearby" element={
          <ProtectedRoute><Layout><NearbyRestaurants /></Layout></ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute><Layout><GoalsProgress /></Layout></ProtectedRoute>
        } />
        <Route path="/achievements" element={
          <ProtectedRoute><Layout><Achievements /></Layout></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
