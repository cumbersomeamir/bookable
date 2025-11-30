import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Svg, {Path, Circle, Ellipse} from 'react-native-svg';
import {useAppSelector} from '@/store/hooks';
import LoginScreen from '@/components/LoginScreen';
import type {RootState} from '@/store';

// Bell icon component matching the screenshot
const BellIcon: React.FC<{size?: number}> = ({size = 120}) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Bell top loop */}
    <Ellipse
      cx="50"
      cy="18"
      rx="6"
      ry="4"
      stroke="#9CA3AF"
      strokeWidth="2"
      fill="none"
    />
    {/* Bell body */}
    <Path
      d="M30 45 C30 30 38 22 50 22 C62 22 70 30 70 45 L70 60 C70 62 72 65 78 68 L78 72 L22 72 L22 68 C28 65 30 62 30 60 L30 45"
      stroke="#9CA3AF"
      strokeWidth="2"
      fill="none"
      strokeLinejoin="round"
    />
    {/* Bell bottom rim */}
    <Ellipse
      cx="50"
      cy="72"
      rx="28"
      ry="4"
      stroke="#9CA3AF"
      strokeWidth="2"
      fill="none"
    />
    {/* Bell clapper */}
    <Path
      d="M42 76 C42 80 45 84 50 84 C55 84 58 80 58 76"
      stroke="#9CA3AF"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Sound lines left */}
    <Path
      d="M18 50 C14 48 14 44 18 42"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Sound lines right */}
    <Path
      d="M82 50 C86 48 86 44 82 42"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

const UpdatesScreen: React.FC = () => {
  const {isAuthenticated} = useAppSelector((state: RootState) => state.auth);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show updates content when authenticated
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Updates</Text>
      </View>

      {/* Empty State */}
      <View style={styles.emptyState}>
        <BellIcon size={120} />
        <Text style={styles.emptyText}>
          Nothing to see here, you're all caught up!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default UpdatesScreen;
