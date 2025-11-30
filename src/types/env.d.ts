declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_WEB_CLIENT_ID?: string;
    GOOGLE_ANDROID_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_MAPS_API_KEY?: string;
    API_BASE_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

