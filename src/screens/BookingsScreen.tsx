import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppSelector, useAppDispatch} from '@/store/hooks';
import {logout} from '@/store/slices/authSlice';
import LoginScreen from '@/components/LoginScreen';
import {bookingApi, Booking} from '@/services/api';
import type {RootState} from '@/store';

// Conditionally import Google Sign-In for logout
let GoogleSignin: any = null;
try {
  const googleSignIn = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignIn.GoogleSignin;
} catch (e) {
  // Google Sign-In not available
}

type RootStackParamList = {
  Search: undefined;
  RestaurantDetail: {slug: string};
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {isAuthenticated, user} = useAppSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response: any = await bookingApi.getUserBookings(user.id);
      if (response.success) {
        setUpcomingBookings(response.data.upcoming || []);
        setPastBookings(response.data.past || []);
      }
    } catch (error) {
      console.log('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchBookings();
    }
  }, [isAuthenticated, user?.id, fetchBookings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [fetchBookings]);

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

  const handleCancelBooking = async (booking: Booking) => {
    if (!user?.id) return;

    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking at ${booking.restaurantName}?`,
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingApi.cancel(booking._id, user.id);
              fetchBookings();
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ],
    );
  };

  const handleRateBooking = async (booking: Booking, rating: number) => {
    if (!user?.id) return;

    try {
      await bookingApi.rate(booking._id, user.id, rating);
      fetchBookings();
      Alert.alert('Thank you!', 'Your rating has been submitted');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStars = (booking: Booking) => {
    const stars = [];
    const currentRating = booking.rating || 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => !booking.rating && handleRateBooking(booking, i)}
          disabled={!!booking.rating}>
          <Icon
            name={i <= currentRating ? 'star' : 'star-border'}
            size={20}
            color={i <= currentRating ? '#FFB800' : '#D1D5DB'}
          />
        </TouchableOpacity>,
      );
    }
    return stars;
  };

  const renderBookingCard = (booking: Booking, isPast: boolean = false) => {
    const statusColors: Record<string, {bg: string; text: string; icon: string}> = {
      confirmed: {bg: '#DEF7EC', text: '#03543F', icon: 'check-circle'},
      completed: {bg: '#FDE8E8', text: '#9B1C1C', icon: 'check-box'},
      cancelled: {bg: '#F3F4F6', text: '#6B7280', icon: 'cancel'},
      'no-show': {bg: '#FEF3C7', text: '#92400E', icon: 'warning'},
    };

    const statusStyle = statusColors[booking.status] || statusColors.confirmed;

    return (
      <View key={booking._id} style={styles.bookingCard}>
        <Image
          source={{
            uri: booking.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          }}
          style={styles.restaurantImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {booking.restaurantName}
            </Text>
            <TouchableOpacity style={styles.saveButton}>
              <Icon name="bookmark-border" size={24} color="#DA3743" />
            </TouchableOpacity>
          </View>

          <View style={[styles.statusBadge, {backgroundColor: statusStyle.bg}]}>
            <Icon name={statusStyle.icon} size={14} color={statusStyle.text} />
            <Text style={[styles.statusText, {color: statusStyle.text}]}>
              {booking.status === 'confirmed' ? 'Booking confirmed' :
               booking.status === 'completed' ? 'Booking completed' :
               booking.status === 'cancelled' ? 'Cancelled' : 'No show'}
            </Text>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailItem}>
              <Icon name="person-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{booking.partySize}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="event" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
            </View>
          </View>

          {isPast && (
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>
                {booking.rating ? 'Your rating' : 'Not rated yet'}
              </Text>
              <View style={styles.starsContainer}>{renderStars(booking)}</View>
            </View>
          )}

          {!isPast && booking.status === 'confirmed' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(booking)}>
              <Text style={styles.cancelButtonText}>Cancel booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DA3743" />
        </View>
      </SafeAreaView>
    );
  }

  const hasBookings = upcomingBookings.length > 0 || pastBookings.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#DA3743"
          />
        }>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Bookings</Text>
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            {user?.photo ? (
              <Image source={{uri: user.photo}} style={styles.profileImage} />
            ) : (
              <Icon name="account-circle" size={36} color="#DA3743" />
            )}
          </TouchableOpacity>
        </View>

        {!hasBookings ? (
          <>
            {/* Empty State */}
            <View style={styles.emptyState}>
              <Icon name="calendar-today" size={80} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyDescription}>
                When you make a reservation, it will appear here.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Search')}>
                <Text style={styles.browseButtonText}>Browse restaurants</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcomingBookings.map(booking => renderBookingCard(booking, false))}
              </View>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Past bookings</Text>
                {pastBookings.map(booking => renderBookingCard(booking, true))}
              </View>
            )}
          </>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  section: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    padding: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bookingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
