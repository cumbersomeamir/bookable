import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppSelector, useAppDispatch} from '@/store/hooks';
import {logout} from '@/store/slices/authSlice';
import LoginScreen from '@/components/LoginScreen';
import type {RootState} from '@/store';

// Conditionally import Google Sign-In for logout
let GoogleSignin: any = null;
try {
  const googleSignIn = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignIn.GoogleSignin;
} catch (e) {
  // Google Sign-In not available
}

const BookingsScreen: React.FC = () => {
  const {isAuthenticated, user} = useAppSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      if (GoogleSignin && typeof GoogleSignin.signOut === 'function') {
        await GoogleSignin.signOut();
      }
      dispatch(logout());
    } catch (error) {
      console.log('Logout error:', error);
      dispatch(logout());
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show bookings content when authenticated
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Your Bookings</Text>
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            {user?.photo ? (
              <Image source={{uri: user.photo}} style={styles.profileImage} />
            ) : (
              <Icon name="account-circle" size={36} color="#DA3743" />
            )}
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.givenName || user?.name || 'User'}!
          </Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <Icon name="calendar-today" size={80} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>No upcoming bookings</Text>
          <Text style={styles.emptyDescription}>
            When you make a reservation, it will appear here.
          </Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse restaurants</Text>
          </TouchableOpacity>
        </View>

        {/* Past Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past bookings</Text>
          <View style={styles.emptyPast}>
            <Text style={styles.emptyPastText}>
              Your booking history will appear here
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#DA3743" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#DA3743',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyPast: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyPastText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DA3743',
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DA3743',
  },
});

export default BookingsScreen;
