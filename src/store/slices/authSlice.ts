// ============================================================
// NutriSense AI - Auth Slice
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserProfile } from '../../types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../services/storage';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: loadFromStorage<User | null>(STORAGE_KEYS.USER, null),
  profile: loadFromStorage<UserProfile | null>(STORAGE_KEYS.PROFILE, null),
  isAuthenticated: !!loadFromStorage<User | null>(STORAGE_KEYS.USER, null),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      saveToStorage(STORAGE_KEYS.USER, action.payload);
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      if (state.user) {
        state.user.onboardingComplete = true;
        saveToStorage(STORAGE_KEYS.USER, state.user);
      }
      saveToStorage(STORAGE_KEYS.PROFILE, action.payload);
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        saveToStorage(STORAGE_KEYS.PROFILE, state.profile);
      }
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, loginSuccess, setProfile, updateProfile, logout, setError } = authSlice.actions;
export default authSlice.reducer;
