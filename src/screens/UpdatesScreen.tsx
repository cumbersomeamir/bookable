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

const UpdatesScreen: React.FC = () => {
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

  // Show updates content when authenticated
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Updates</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.settingsButton}>
              <Icon name="settings" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleLogout}>
              {user?.photo ? (
                <Image source={{uri: user.photo}} style={styles.profileImage} />
              ) : (
                <Icon name="account-circle" size={36} color="#DA3743" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Categories */}
        <View style={styles.categories}>
          <TouchableOpacity
            style={[styles.categoryTab, styles.categoryTabActive]}>
            <Text style={[styles.categoryText, styles.categoryTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Promotions</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Icon name="notifications-none" size={80} color="#E5E7EB" />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyDescription}>
            We'll notify you about booking confirmations, special offers, and
            updates from your favourite restaurants.
          </Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification preferences</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="email" size={24} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Email notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive booking confirmations via email
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="smartphone" size={24} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Push notifications</Text>
                <Text style={styles.settingDescription}>
                  Get alerts for offers and reminders
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="local-offer" size={24} color="#6B7280" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Marketing preferences</Text>
                <Text style={styles.settingDescription}>
                  Manage promotional communications
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButton: {
    padding: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryTabActive: {
    backgroundColor: '#DA3743',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default UpdatesScreen;
