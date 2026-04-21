// ============================================================
// NutriSense AI - Settings Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Bell, BellOff, Shield, Trash2, Download, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { toggleDarkMode } from '../store/slices/appSlice';
import { logout } from '../store/slices/authSlice';
import { clearStorage } from '../services/storage';

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(s => s.app.darkMode);
  const profile = useAppSelector(s => s.auth.profile);

  const [notifications, setNotifications] = useState({
    predictions: profile?.notificationPreferences?.predictions ?? true,
    dailyReminders: profile?.notificationPreferences?.dailyReminders ?? true,
    weeklyReport: profile?.notificationPreferences?.weeklyReport ?? true,
    achievements: profile?.notificationPreferences?.achievements ?? true,
  });

  const handleLogout = () => {
    dispatch(logout());
    clearStorage();
    navigate('/');
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          desc: darkMode ? 'Dark theme active' : 'Light theme active',
          action: 'toggle',
          value: darkMode,
          onToggle: () => dispatch(toggleDarkMode()),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Prediction Alerts', desc: 'Smart intervention notifications', action: 'toggle', value: notifications.predictions, onToggle: () => setNotifications(n => ({ ...n, predictions: !n.predictions })) },
        { icon: Bell, label: 'Daily Reminders', desc: 'Meal logging reminders', action: 'toggle', value: notifications.dailyReminders, onToggle: () => setNotifications(n => ({ ...n, dailyReminders: !n.dailyReminders })) },
        { icon: Bell, label: 'Weekly Report', desc: 'Progress summary every Sunday', action: 'toggle', value: notifications.weeklyReport, onToggle: () => setNotifications(n => ({ ...n, weeklyReport: !n.weeklyReport })) },
        { icon: Bell, label: 'Achievement Alerts', desc: 'Badge and level-up notifications', action: 'toggle', value: notifications.achievements, onToggle: () => setNotifications(n => ({ ...n, achievements: !n.achievements })) },
      ],
    },
    {
      title: 'Dietary',
      items: [
        { icon: Globe, label: 'Dietary Restrictions', desc: (profile?.dietaryRestrictions || []).join(', ') || 'None set', action: 'navigate' },
        { icon: Globe, label: 'Preferred Cuisines', desc: (profile?.preferredCuisines || []).join(', ') || 'All cuisines', action: 'navigate' },
        { icon: Globe, label: 'Budget Preference', desc: profile?.budget ? (profile.budget === 'low' ? '₹ Budget' : profile.budget === 'medium' ? '₹₹ Moderate' : '₹₹₹ Premium') : 'Not set', action: 'navigate' },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        { icon: Shield, label: 'Privacy Policy', desc: 'Read our privacy terms', action: 'navigate' },
        { icon: Download, label: 'Export Data', desc: 'Download all your data', action: 'navigate' },
        { icon: Trash2, label: 'Delete Account', desc: 'Permanently delete all data', action: 'danger' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', desc: 'Get help using NutriSense', action: 'navigate' },
        { icon: Globe, label: 'About NutriSense AI', desc: 'Version 1.0.0', action: 'navigate' },
      ],
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold font-[var(--font-heading)]">Settings</h1>
        </div>

        <div className="space-y-6 stagger-children">
          {settingsSections.map(section => (
            <div key={section.title}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-1 ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                {section.title}
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                {section.items.map((item: { icon: any; label: string; desc: string; action: string; value?: boolean; onToggle?: () => void }, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}
                      className={`flex items-center gap-3 p-4 ${
                        i > 0 ? `border-t ${darkMode ? 'border-[var(--color-dark-border)]' : 'border-[var(--color-light-border)]'}` : ''
                      } ${item.action === 'danger' ? 'cursor-pointer' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        item.action === 'danger' ? 'bg-[rgba(239,68,68,0.12)]' : darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'
                      }`}>
                        <Icon size={18} className={item.action === 'danger' ? 'text-[var(--color-danger)]' : ''} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${item.action === 'danger' ? 'text-[var(--color-danger)]' : ''}`}>
                          {item.label}
                        </p>
                        <p className={`text-xs truncate ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                          {item.desc}
                        </p>
                      </div>
                      {item.action === 'toggle' && (
                        <button onClick={item.onToggle}
                          className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-[var(--color-primary)]' : darkMode ? 'bg-[var(--color-dark-border)]' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${item.value ? 'translate-x-5.5' : 'translate-x-0.5'}`}
                            style={{ transform: `translateX(${item.value ? '22px' : '2px'})` }} />
                        </button>
                      )}
                      {item.action === 'navigate' && (
                        <ChevronRight size={18} className={darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-[var(--color-danger)] text-[var(--color-danger)] font-semibold transition-all hover:bg-[rgba(239,68,68,0.08)]"
            id="logout-btn"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
