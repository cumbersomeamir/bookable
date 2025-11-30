import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AppState {
  isLoading: boolean;
  isFirstLaunch: boolean;
  isDarkMode: boolean;
  appVersion: string;
  error: string | null;
}

const initialState: AppState = {
  isLoading: true,
  isFirstLaunch: true,
  isDarkMode: false,
  appVersion: '1.0.0',
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    toggleDarkMode: state => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    resetApp: () => initialState,
  },
});

export const {
  setLoading,
  setFirstLaunch,
  toggleDarkMode,
  setDarkMode,
  setError,
  clearError,
  resetApp,
} = appSlice.actions;

export default appSlice.reducer;
