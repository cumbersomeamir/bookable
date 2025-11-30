import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {loginSuccess, setLoading} from '@/store/slices/authSlice';
import type {RootState} from '@/store';

// Conditionally import Google Sign-In
let GoogleSignin: any = null;
let statusCodes: any = null;
let googleSignInAvailable = false;

try {
  const googleSignIn = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignIn.GoogleSignin;
  statusCodes = googleSignIn.statusCodes;

  // Only configure if the module loaded successfully
  if (GoogleSignin && typeof GoogleSignin.configure === 'function') {
    // Web Client ID should be configured via environment variables
    // For development, set GOOGLE_WEB_CLIENT_ID in mobile.env
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
      offlineAccess: true,
    });
    googleSignInAvailable = true;
  }
} catch (e) {
  console.log('Google Sign-In not available:', e);
  googleSignInAvailable = false;
}

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {loading} = useAppSelector((state: RootState) => state.auth);

  const handleGoogleSignIn = async () => {
    if (!googleSignInAvailable || !GoogleSignin) {
      Alert.alert(
        'Rebuild Required',
        'Google Sign-In requires a native app rebuild. Please rebuild the app with:\n\ncd android && ./gradlew clean && cd .. && npm run android',
      );
      return;
    }

    try {
      dispatch(setLoading(true));
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Handle both old and new API response formats
      const userData = (userInfo as any).data?.user || (userInfo as any).user;
      if (userData) {
        dispatch(
          loginSuccess({
            id: userData.id,
            email: userData.email,
            name: userData.name || '',
            givenName: userData.givenName || undefined,
            familyName: userData.familyName || undefined,
            photo: userData.photo || undefined,
          }),
        );
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (statusCodes && error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in', 'Sign in is already in progress');
      } else if (
        statusCodes &&
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        Alert.alert('Error', 'Play services not available');
      } else {
        console.log('Google Sign-In Error:', error);
        Alert.alert('Error', 'Failed to sign in with Google');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign in to continue</Text>
          <Text style={styles.subtitle}>
            Access your bookings, rewards, and personalized recommendations.
          </Text>

          {/* Google Sign In */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#1F2937" />
            ) : (
              <>
                <Icon name="login" size={20} color="#1F2937" />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {!googleSignInAvailable && (
            <Text style={styles.rebuildNote}>
              Note: Google Sign-In requires a native rebuild
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app collects data about your device and activities on the app
            through tracking technologies ('cookies') for functionality,
            analytics, and advertising purposes. To learn more, please visit our{' '}
            <Text style={styles.linkText}>Cookies policy</Text> and{' '}
            <Text style={styles.linkText}>Privacy policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    gap: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  rebuildNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  linkText: {
    color: '#DA3743',
  },
});

export default LoginScreen;
