# Bookable

A React Native mobile application for book discovery and booking.

## Tech Stack

- **React Native**: 0.73.6
- **TypeScript**: 5.0.4
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation v7
- **UI Components**: React Native Vector Icons, Linear Gradient, SVG
- **Network**: Axios
- **Storage**: Async Storage

## Prerequisites

- Node.js >= 18
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)
- MongoDB Atlas account (for backend)

## Environment Configuration

This project uses environment files for configuration:

| File | Purpose |
|------|---------|
| `.env` | Default env for mobile app (read by react-native-config) |
| `mobile.env` | Mobile app configuration |
| `server.env` | Backend server configuration |
| `*.env.example` | Example templates (safe to commit) |

### Setting Up Environment Files

1. Copy the example files:
   ```bash
   cp mobile.env.example mobile.env
   cp server.env.example server.env
   ```

2. Update with your credentials (or use the provided defaults for development)

### Environment Variables

**Mobile App (`mobile.env` / `.env`):**
- `GOOGLE_WEB_CLIENT_ID` - Google OAuth Web Client ID
- `GOOGLE_ANDROID_CLIENT_ID` - Google OAuth Android Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_MAPS_API_KEY` - Google Maps API Key
- `API_BASE_URL` - Backend API URL (use `10.0.2.2` for Android emulator, `localhost` for iOS simulator)

**Server (`server.env`):**
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string (uses `bookable` database)
- `JWT_SECRET` - Secret for JWT token signing

### MongoDB Collections

This project uses MongoDB with the `bookable` database. Collections are prefixed with `bookable-` to keep them distinct:
- `bookable-users`
- `bookable-books`
- `bookable-bookings`
- etc.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup

```bash
cd ios
bundle install          # Install Ruby dependencies (first time only)
bundle exec pod install # Install CocoaPods dependencies
cd ..
```

### 3. Start Metro Bundler

```bash
npm start
# or with cache reset
npm run start:reset
```

### 4. Run the Application

**Android:**
```bash
# Ensure Android emulator is running or device is connected
npm run android
# or
npx react-native run-android
```

**iOS:**
```bash
npm run ios
# or
npx react-native run-ios
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler |
| `npm run start:reset` | Start Metro with cache reset |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and fix issues |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run Jest tests |
| `npm run clean` | Clean Android build |
| `npm run clean:ios` | Clean and reinstall iOS pods |

## Project Structure

```
Bookable/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── assets/             # Static assets (images, fonts, etc.)
│   ├── components/         # Reusable UI components
│   │   └── SurplusLogo.tsx
│   ├── config/             # App configuration
│   │   └── index.ts        # Environment config helper
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/            # Screen components
│   │   ├── SplashScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── store/              # Redux store configuration
│   │   ├── index.ts
│   │   └── slices/
│   │       └── appSlice.ts
│   ├── theme/              # Theme configuration
│   │   └── colors.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── svg.d.ts
│   │   └── env.d.ts
│   └── App.tsx             # Root application component
├── patches/                 # Patch files for node_modules
├── .env                    # Environment variables (mobile)
├── mobile.env              # Mobile app environment config
├── server.env              # Server environment config
├── index.js                # Application entry point
├── app.json                # App configuration
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── tsconfig.json           # TypeScript configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── package.json
```

## Path Aliases

This project uses path aliases for cleaner imports:

```typescript
// Instead of:
import Colors from '../../../theme/colors';

// Use:
import Colors from '@/theme/colors';
```

The `@` alias maps to the `./src` directory.

## Native Module Configuration

### Android

Native modules are automatically linked. If you encounter issues:

1. Clean the build:
   ```bash
   npm run clean
   ```

2. Rebuild:
   ```bash
   npm run android
   ```

### iOS

1. Install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

2. If pods fail, try:
   ```bash
   npm run clean:ios
   ```

### Vector Icons Setup

For Android, the icons should work automatically.

For iOS, add the following to your `ios/Bookable/Info.plist`:
```xml
<key>UIAppFonts</key>
<array>
  <string>MaterialIcons.ttf</string>
</array>
```

## Troubleshooting

### Metro Bundler Issues

Clear cache and restart:
```bash
npm run start:reset
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

### TypeScript Errors

Run type check:
```bash
npm run typecheck
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint:fix`
4. Run type check: `npm run typecheck`
5. Submit a pull request

## License

Private - All rights reserved.
# bookable
