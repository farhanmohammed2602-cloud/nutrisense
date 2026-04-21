// ============================================================
// NutriSense AI - Profile Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Edit3, Settings, Target, Scale, Ruler, Activity, Calendar, Save, ChevronRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { updateProfile } from '../store/slices/authSlice';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(s => s.app.darkMode);
  const user = useAppSelector(s => s.auth.user);
  const profile = useAppSelector(s => s.auth.profile);
  const gamification = useAppSelector(s => s.app.gamification);
  const weightHistory = useAppSelector(s => s.app.weightHistory);

  const [editing, setEditing] = useState(false);
  const [editWeight, setEditWeight] = useState((profile?.currentWeight || 75).toString());
  const [editTarget, setEditTarget] = useState((profile?.targetWeight || 68).toString());

  const handleSave = () => {
    dispatch(updateProfile({
      currentWeight: parseFloat(editWeight),
      targetWeight: parseFloat(editTarget),
    }));
    setEditing(false);
  };

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || profile?.currentWeight || 75;
  const startWeight = weightHistory[0]?.weight || 78;
  const totalChange = Math.round((startWeight - latestWeight) * 10) / 10;

  const profileFields = [
    { icon: Target, label: 'Goal', value: (profile?.goal || 'weight_loss').replace('_', ' '), capitalize: true },
    { icon: Scale, label: 'Current Weight', value: `${latestWeight} kg` },
    { icon: Scale, label: 'Target Weight', value: `${profile?.targetWeight || 68} kg` },
    { icon: Ruler, label: 'Height', value: `${profile?.height || 170} cm` },
    { icon: Calendar, label: 'Age', value: `${profile?.age || 25} years` },
    { icon: Activity, label: 'Activity Level', value: (profile?.activityLevel || 'moderate').replace('_', ' '), capitalize: true },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold font-[var(--font-heading)]">Profile</h1>
          </div>
          <button onClick={() => navigate('/settings')}
            className={`p-2 rounded-xl ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card)]'}`}>
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="glass-card rounded-2xl p-6 mb-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="relative z-10">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {(user?.displayName || 'U')[0].toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white shadow-lg">
                <Camera size={14} />
              </button>
            </div>

            <h2 className="text-xl font-bold font-[var(--font-heading)]">{user?.displayName || 'User'}</h2>
            <p className={`text-sm ${darkMode ? 'text-[var(--color-dark-text-secondary)]' : 'text-[var(--color-light-text-secondary)]'}`}>
              {user?.email}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-[rgba(0,0,0,0.03)]'}`}>
                <p className="text-lg font-bold">{gamification.currentStreak}</p>
                <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>🔥 Streak</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-[rgba(0,0,0,0.03)]'}`}>
                <p className="text-lg font-bold">{totalChange > 0 ? `-${totalChange}` : totalChange}</p>
                <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>⚖️ kg change</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-[rgba(255,255,255,0.05)]' : 'bg-[rgba(0,0,0,0.03)]'}`}>
                <p className="text-lg font-bold">Lv.{gamification.level}</p>
                <p className={`text-[10px] ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>🏅 Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="glass-card rounded-2xl overflow-hidden mb-5">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h3 className="font-semibold font-[var(--font-heading)] text-sm">Personal Info</h3>
            <button onClick={() => editing ? handleSave() : setEditing(true)}
              className="flex items-center gap-1 text-xs text-[var(--color-primary)] font-semibold">
              {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
            </button>
          </div>

          {profileFields.map((field, i) => {
            const Icon = field.icon;
            const isEditable = editing && (field.label === 'Current Weight' || field.label === 'Target Weight');
            return (
              <div key={field.label}
                className={`flex items-center gap-3 px-5 py-3.5 ${
                  i > 0 ? `border-t ${darkMode ? 'border-[var(--color-dark-border)]' : 'border-[var(--color-light-border)]'}` : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${darkMode ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-light-card-hover)]'}`}>
                  <Icon size={16} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>
                    {field.label}
                  </p>
                  {isEditable ? (
                    <input
                      type="number"
                      value={field.label === 'Current Weight' ? editWeight : editTarget}
                      onChange={e => field.label === 'Current Weight' ? setEditWeight(e.target.value) : setEditTarget(e.target.value)}
                      className="input-field mt-1 py-2 text-sm"
                    />
                  ) : (
                    <p className={`text-sm font-medium ${field.capitalize ? 'capitalize' : ''}`}>
                      {field.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {[
            { label: 'Dietary Restrictions', value: (profile?.dietaryRestrictions || []).length + ' active', path: '/settings' },
            { label: 'Preferred Cuisines', value: (profile?.preferredCuisines || []).join(', ') || 'All', path: '/settings' },
            { label: 'Notification Settings', value: 'Manage', path: '/settings' },
            { label: 'Privacy & Security', value: 'View', path: '/settings' },
          ].map((item, i) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-left ${
                i > 0 ? `border-t ${darkMode ? 'border-[var(--color-dark-border)]' : 'border-[var(--color-light-border)]'}` : ''
              }`}
            >
              <span className="text-sm">{item.label}</span>
              <span className="flex items-center gap-1">
                <span className={`text-xs ${darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'}`}>{item.value}</span>
                <ChevronRight size={14} className={darkMode ? 'text-[var(--color-dark-text-muted)]' : 'text-[var(--color-light-text-muted)]'} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
