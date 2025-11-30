import {Platform} from 'react-native';

interface AppConfig {
  // Google OAuth
  GOOGLE_WEB_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  // Google Maps
  GOOGLE_MAPS_API_KEY: string;

  // API
  API_BASE_URL: string;
}

// For Android emulator use 10.0.2.2, for iOS simulator use localhost
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

// IMPORTANT: These values should be loaded from environment variables
// For development, create a local.config.ts file (add to .gitignore)
// For production, use react-native-config or similar
const config: AppConfig = {
  GOOGLE_WEB_CLIENT_ID: '', // Set in local.config.ts or env
  GOOGLE_ANDROID_CLIENT_ID: '', // Set in local.config.ts or env
  GOOGLE_CLIENT_SECRET: '', // Set in local.config.ts or env
  GOOGLE_MAPS_API_KEY: '', // Set in local.config.ts or env
  API_BASE_URL: API_URL,
};

// Try to load local config (will be gitignored)
try {
  const localConfig = require('./local.config').default;
  Object.assign(config, localConfig);
} catch (e) {
  // local.config.ts doesn't exist, using defaults
  console.warn('No local.config.ts found. Some features may not work.');
}

export default config;

