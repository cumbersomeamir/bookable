import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppSelector} from '@/store/hooks';
import {restaurantDetailApi, bookingApi, ApiResponse} from '@/services/api';
import {RestaurantFullDetail, MenuItem} from '@/types/restaurantDetail';
import type {RootState} from '@/store';

type RootStackParamList = {
  RestaurantDetail: {slug: string};
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>;

type TabType = 'bookings' | 'experiences' | 'concierge' | 'menu' | 'reviews' | 'details';

const RestaurantDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {slug} = route.params;
  const {isAuthenticated, user} = useAppSelector((state: RootState) => state.auth);
  
  const [data, setData] = useState<RestaurantFullDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const scrollViewRef = useRef<ScrollView>(null);

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedPoints, setSelectedPoints] = useState<number>(0);
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Get today's date formatted
  const today = new Date();
  const dateString = today.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = (await restaurantDetailApi.getFullDetail(
        slug,
      )) as unknown as ApiResponse<RestaurantFullDetail>;
      if (response.success) {
        setData(response.data);
      } else {
        setError('Failed to load restaurant');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTimeSlotPress = (time: string, points: number) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign in required',
        'Please sign in to make a booking',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Sign in',
            onPress: () => navigation.navigate('Main'),
          },
        ],
      );
      return;
    }

    setSelectedTime(time);
    setSelectedPoints(points);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!data || !user?.id || !user?.email) return;

    setBookingLoading(true);
    try {
      const response: any = await bookingApi.create({
        restaurantId: data._id,
        userId: user.id,
        userEmail: user.email,
        userName: user.name || user.givenName || 'Guest',
        date: today.toISOString(),
        time: selectedTime,
        partySize,
        specialRequests: specialRequests || undefined,
      });

      if (response.success) {
        setShowBookingModal(false);
        setSpecialRequests('');
        Alert.alert(
          'Booking Confirmed! 🎉',
          `Your table for ${partySize} at ${selectedTime} is confirmed.\n\nConfirmation: ${response.data.confirmationNumber}`,
          [
            {
              text: 'View Bookings',
              onPress: () => navigation.navigate('Main'),
            },
            {text: 'OK'},
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to create booking');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="star" size={16} color="#DA3743" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="star-half" size={16} color="#DA3743" />);
      } else {
        stars.push(<Icon key={i} name="star-border" size={16} color="#DA3743" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA3743" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color="#DA3743" />
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const primaryImage = data.images?.find(img => img.isPrimary) || data.images?.[0];

  const tabs: {key: TabType; label: string}[] = [
    {key: 'bookings', label: 'Bookings'},
    {key: 'experiences', label: 'Experiences'},
    {key: 'concierge', label: 'Concierge'},
    {key: 'menu', label: 'Menu'},
    {key: 'reviews', label: 'Reviews'},
    {key: 'details', label: 'Details'},
  ];

  const renderTimeSlots = () => (
    <View style={styles.timeSlotsSection}>
      <View style={styles.bookingInfo}>
        <Icon name="person-outline" size={16} color="#1F2937" />
        <Text style={styles.bookingInfoText}>{partySize} • Tonight</Text>
      </View>
      <Text style={styles.bookedToday}>
        <Icon name="calendar-today" size={14} color="#DA3743" /> Booked {data.todayBookings} times
        today
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsScroll}>
        {data.timeSlots?.map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={styles.timeSlot}
            onPress={() => handleTimeSlotPress(slot.time, slot.points)}>
            <View style={styles.timeSlotInner}>
              <Icon name="table-restaurant" size={14} color="#FFFFFF" />
              <Text style={styles.timeSlotText}>{slot.time}</Text>
            </View>
            {slot.points > 0 && (
              <Text style={styles.pointsText}>+{slot.points.toLocaleString()}pts</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.additionalSeating}>
        <Icon name="table-restaurant" size={16} color="#6B7280" />
        <Text style={styles.additionalSeatingText}>Additional seating options</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBookingsTab = () => (
    <View style={styles.tabContent}>
      {renderTimeSlots()}
      <TouchableOpacity style={styles.viewFullButton}>
        <Text style={styles.viewFullButtonText}>View full availability</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExperiencesTab = () => (
    <View style={styles.tabContent}>
      {renderTimeSlots()}
      <Text style={styles.sectionTitle}>Experiences</Text>
      {data.experiences?.map(exp => (
        <TouchableOpacity key={exp._id} style={styles.experienceCard}>
          <Image source={{uri: exp.image.url}} style={styles.experienceImage} />
          <View style={styles.experienceContent}>
            <Text style={styles.experienceTitle}>{exp.title}</Text>
            <Text style={styles.experiencePrice}>{exp.price.display}</Text>
            <View style={styles.experienceAvailability}>
              <Icon name="calendar-today" size={14} color="#6B7280" />
              <Text style={styles.availabilityText}>Multiple dates available</Text>
            </View>
            <View style={styles.experienceAvailability}>
              <Icon name="access-time" size={14} color="#6B7280" />
              <Text style={styles.availabilityText}>Multiple times available</Text>
            </View>
            {exp.description && (
              <Text style={styles.experienceDescription} numberOfLines={2}>
                {exp.description}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.sectionTitle}>Concierge ✨</Text>
      <View style={styles.conciergeCard}>
        <View style={styles.conciergeBadge}>
          <Text style={styles.conciergeBadgeText}>AI Beta</Text>
        </View>
        <Text style={styles.conciergeText}>
          Our AI assistant, Concierge, is here to answer your questions about this restaurant.
        </Text>
      </View>
    </View>
  );

  const renderConciergeTab = () => (
    <View style={styles.tabContent}>
      {renderTimeSlots()}
      <Text style={styles.sectionTitle}>Concierge ✨</Text>
      <View style={styles.conciergeBadge}>
        <Text style={styles.conciergeBadgeText}>AI Beta</Text>
      </View>
      <Text style={styles.conciergeText}>
        Our AI assistant, Concierge, is here to answer your questions about this restaurant.
      </Text>
      <View style={styles.conciergeInput}>
        <Text style={styles.conciergeInputPlaceholder}>
          Ask about the menu, ambiance, or special requests...
        </Text>
      </View>
    </View>
  );

  const renderMenuItem = (item: MenuItem) => (
    <View key={item._id} style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.description && <Text style={styles.menuItemDescription}>{item.description}</Text>}
        <View style={styles.menuItemMeta}>
          <Icon name="photo" size={14} color="#6B7280" />
          <Text style={styles.menuItemMetaText}>{item.photoCount} photo</Text>
          <Icon name="chat-bubble-outline" size={14} color="#6B7280" style={{marginLeft: 12}} />
          <Text style={styles.menuItemMetaText}>{item.reviewCount} reviews</Text>
        </View>
      </View>
      {item.image?.url && <Image source={{uri: item.image.url}} style={styles.menuItemImage} />}
    </View>
  );

  const renderMenuTab = () => (
    <View style={styles.tabContent}>
      {renderTimeSlots()}
      <Text style={styles.sectionTitle}>Menu</Text>
      <Text style={styles.sectionSubtitle}>Popular dishes</Text>
      {data.menu?.popularItems?.map(renderMenuItem)}
      <TouchableOpacity style={styles.viewFullButton}>
        <Text style={styles.viewFullButtonText}>See full menu</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRatingBar = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <View style={styles.ratingBar}>
        <View style={[styles.ratingBarFill, {width: `${percentage}%`}]} />
      </View>
    );
  };

  const renderReviewsTab = () => {
    const totalReviews = Object.values(data.ratingDistribution || {}).reduce((a, b) => a + b, 0);
    return (
      <View style={styles.tabContent}>
        {renderTimeSlots()}
        <Text style={styles.sectionTitle}>Reviews</Text>

        <View style={styles.overallRating}>
          <View style={styles.ratingLeft}>
            <Text style={styles.overallRatingLabel}>Overall rating</Text>
            <Text style={styles.overallRatingValue}>{data.rating?.toFixed(1)}</Text>
            <View style={styles.starsRow}>{renderStars(data.rating || 0)}</View>
          </View>
          <View style={styles.ratingRight}>
            {[5, 4, 3, 2, 1].map(star => (
              <View key={star} style={styles.ratingRowStyle}>
                <Text style={styles.ratingRowLabel}>{star}</Text>
                {renderRatingBar(
                  data.ratingDistribution?.[
                    ['one', 'two', 'three', 'four', 'five'][
                      star - 1
                    ] as keyof typeof data.ratingDistribution
                  ] || 0,
                  totalReviews,
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.categoryRatings}>
          {[
            {label: 'Food', value: data.detailedRatings?.food},
            {label: 'Service', value: data.detailedRatings?.service},
            {label: 'Ambience', value: data.detailedRatings?.ambience},
            {label: 'Value', value: data.detailedRatings?.value},
          ].map(cat => (
            <View key={cat.label} style={styles.categoryRating}>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryValue}>{cat.value?.toFixed(1)}</Text>
            </View>
          ))}
        </View>

        {data.reviewSummary && (
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewSummaryTitle}>Review summary</Text>
            <View style={styles.aiLabel}>
              <Icon name="auto-awesome" size={12} color="#6B7280" />
              <Text style={styles.aiLabelText}>AI-generated from verified diner reviews</Text>
            </View>
            <Text style={styles.reviewSummaryText}>{data.reviewSummary}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.viewFullButton}>
          <Text style={styles.viewFullButtonText}>See all reviews</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDetailsTab = () => (
    <View style={styles.tabContent}>
      {renderTimeSlots()}
      <Text style={styles.sectionTitle}>Details</Text>

      <Text style={styles.detailLabel}>Address</Text>
      <View style={styles.addressRow}>
        <Icon name="place" size={20} color="#6B7280" />
        <Text style={styles.addressText}>{data.fullAddress}</Text>
      </View>

      <View style={styles.mapPlaceholder}>
        <Icon name="map" size={48} color="#6B7280" />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
      </View>

      <Text style={styles.detailLabel}>Additional information</Text>
      <View style={styles.descriptionSection}>
        <Icon name="description" size={20} color="#6B7280" />
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{data.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return renderBookingsTab();
      case 'experiences':
        return renderExperiencesTab();
      case 'concierge':
        return renderConciergeTab();
      case 'menu':
        return renderMenuTab();
      case 'reviews':
        return renderReviewsTab();
      case 'details':
        return renderDetailsTab();
      default:
        return renderBookingsTab();
    }
  };

  const renderBookingModal = () => (
    <Modal
      visible={showBookingModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowBookingModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalRestaurantName}>{data.name}</Text>

            <View style={styles.bookingDetailRow}>
              <Icon name="event" size={20} color="#DA3743" />
              <Text style={styles.bookingDetailText}>{dateString}</Text>
            </View>

            <View style={styles.bookingDetailRow}>
              <Icon name="access-time" size={20} color="#DA3743" />
              <Text style={styles.bookingDetailText}>{selectedTime}</Text>
            </View>

            {selectedPoints > 0 && (
              <View style={styles.pointsBadge}>
                <Icon name="star" size={16} color="#DA3743" />
                <Text style={styles.pointsBadgeText}>
                  Earn {selectedPoints.toLocaleString()} points with this booking
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Party size</Text>
            <View style={styles.partySizeRow}>
              {[1, 2, 3, 4, 5, 6].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.partySizeButton,
                    partySize === size && styles.partySizeButtonActive,
                  ]}
                  onPress={() => setPartySize(size)}>
                  <Text
                    style={[
                      styles.partySizeText,
                      partySize === size && styles.partySizeTextActive,
                    ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Special requests (optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Any dietary requirements or special occasions?"
              placeholderTextColor="#9CA3AF"
              value={specialRequests}
              onChangeText={setSpecialRequests}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, bookingLoading && styles.confirmButtonDisabled]}
            onPress={handleConfirmBooking}
            disabled={bookingLoading}>
            {bookingLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{uri: primaryImage?.url}} style={styles.heroImage} />
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Icon name="bookmark-border" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Icon name="ios-share" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <TouchableOpacity style={styles.photoCount}>
            <Text style={styles.photoCountText}>See all {data.photoCount} photos</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{data.name}</Text>
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>{renderStars(data.rating || 0)}</View>
            <Icon name="chat-bubble-outline" size={16} color="#6B7280" style={{marginLeft: 8}} />
            <Text style={styles.reviewCount}>{data.reviewCount?.toLocaleString()} reviews</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="payments" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{data.priceRange}</Text>
            <Icon name="restaurant" size={16} color="#6B7280" style={{marginLeft: 12}} />
            <Text style={styles.metaText}>{data.cuisine}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="place" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{data.fullAddress}</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}>
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={{height: 100}} />
      </ScrollView>

      {renderBookingModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 32,
  },
  errorText: {fontSize: 16, color: '#6B7280', marginTop: 16, marginBottom: 24},
  retryButton: {
    backgroundColor: '#DA3743',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {fontSize: 14, fontWeight: '600', color: '#FFFFFF'},

  heroContainer: {position: 'relative', height: 300},
  heroImage: {width: '100%', height: '100%'},
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {flexDirection: 'row', alignItems: 'center'},
  backText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 4},
  headerActions: {flexDirection: 'row', gap: 12},
  headerButton: {padding: 8},
  photoCount: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  photoCountText: {color: '#FFFFFF', fontSize: 13, fontWeight: '500'},

  infoSection: {padding: 16},
  restaurantName: {fontSize: 26, fontWeight: '700', color: '#1F2937', marginBottom: 8},
  ratingRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  starsRow: {flexDirection: 'row'},
  reviewCount: {fontSize: 14, color: '#6B7280', marginLeft: 4},
  metaRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  metaText: {fontSize: 14, color: '#6B7280', marginLeft: 6},

  tabsContainer: {borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 16},
  tab: {paddingVertical: 14, paddingHorizontal: 4, marginRight: 24},
  activeTab: {borderBottomWidth: 2, borderBottomColor: '#DA3743'},
  tabText: {fontSize: 14, fontWeight: '500', color: '#6B7280'},
  activeTabText: {color: '#DA3743', fontWeight: '600'},

  tabContent: {padding: 16},

  timeSlotsSection: {marginBottom: 16},
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  bookingInfoText: {fontSize: 14, color: '#1F2937', marginLeft: 6, fontWeight: '500'},
  bookedToday: {fontSize: 13, color: '#DA3743', marginBottom: 12},
  timeSlotsScroll: {marginBottom: 12},
  timeSlot: {marginRight: 8, alignItems: 'center'},
  timeSlotInner: {
    backgroundColor: '#DA3743',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  timeSlotText: {color: '#FFFFFF', fontSize: 14, fontWeight: '600'},
  pointsText: {color: '#DA3743', fontSize: 11, fontWeight: '500', marginTop: 4},
  additionalSeating: {flexDirection: 'row', alignItems: 'center', gap: 6},
  additionalSeatingText: {fontSize: 13, color: '#6B7280'},

  viewFullButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  viewFullButtonText: {fontSize: 14, fontWeight: '600', color: '#DA3743'},

  sectionTitle: {fontSize: 20, fontWeight: '700', color: '#1F2937', marginTop: 24, marginBottom: 8},
  sectionSubtitle: {fontSize: 14, color: '#DA3743', marginBottom: 16},

  experienceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  experienceImage: {width: '100%', height: 200},
  experienceContent: {padding: 16},
  experienceTitle: {fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4},
  experiencePrice: {fontSize: 14, color: '#6B7280', marginBottom: 8},
  experienceAvailability: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4},
  availabilityText: {fontSize: 13, color: '#6B7280'},
  experienceDescription: {fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 20},

  conciergeCard: {backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12},
  conciergeBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  conciergeBadgeText: {fontSize: 11, fontWeight: '600', color: '#6B7280'},
  conciergeText: {fontSize: 14, color: '#6B7280', lineHeight: 20},
  conciergeInput: {backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, marginTop: 16},
  conciergeInputPlaceholder: {fontSize: 14, color: '#9CA3AF'},

  menuItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemContent: {flex: 1, paddingRight: 12},
  menuItemName: {fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4},
  menuItemDescription: {fontSize: 14, color: '#6B7280', marginBottom: 8, lineHeight: 20},
  menuItemMeta: {flexDirection: 'row', alignItems: 'center'},
  menuItemMetaText: {fontSize: 12, color: '#6B7280', marginLeft: 4},
  menuItemImage: {width: 100, height: 100, borderRadius: 8},

  overallRating: {flexDirection: 'row', marginBottom: 24},
  ratingLeft: {marginRight: 24},
  overallRatingLabel: {fontSize: 14, color: '#6B7280', marginBottom: 4},
  overallRatingValue: {fontSize: 48, fontWeight: '700', color: '#1F2937'},
  ratingRight: {flex: 1, justifyContent: 'center'},
  ratingRowStyle: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  ratingRowLabel: {width: 16, fontSize: 12, color: '#6B7280'},
  ratingBar: {flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginLeft: 8},
  ratingBarFill: {height: '100%', backgroundColor: '#DA3743', borderRadius: 4},

  categoryRatings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  categoryRating: {},
  categoryLabel: {fontSize: 13, color: '#6B7280', marginBottom: 4},
  categoryValue: {fontSize: 16, fontWeight: '700', color: '#1F2937'},

  reviewSummary: {backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginTop: 16},
  reviewSummaryTitle: {fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4},
  aiLabel: {flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12},
  aiLabelText: {fontSize: 12, color: '#6B7280'},
  reviewSummaryText: {fontSize: 14, color: '#1F2937', lineHeight: 22},

  detailLabel: {fontSize: 14, color: '#DA3743', marginBottom: 12, marginTop: 16},
  addressRow: {flexDirection: 'row', alignItems: 'flex-start'},
  addressText: {fontSize: 15, color: '#1F2937', marginLeft: 8, flex: 1},
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  mapPlaceholderText: {fontSize: 14, color: '#6B7280', marginTop: 8},
  descriptionSection: {flexDirection: 'row', marginTop: 8},
  descriptionTitle: {fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 8},
  descriptionText: {fontSize: 14, color: '#6B7280', lineHeight: 22},

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {fontSize: 18, fontWeight: '700', color: '#1F2937'},
  modalBody: {padding: 20},
  modalRestaurantName: {fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16},
  bookingDetailRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12},
  bookingDetailText: {fontSize: 16, color: '#1F2937'},
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  pointsBadgeText: {fontSize: 14, color: '#DA3743', fontWeight: '500'},
  inputLabel: {fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8, marginTop: 16},
  partySizeRow: {flexDirection: 'row', gap: 8},
  partySizeButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partySizeButtonActive: {backgroundColor: '#DA3743', borderColor: '#DA3743'},
  partySizeText: {fontSize: 16, fontWeight: '600', color: '#6B7280'},
  partySizeTextActive: {color: '#FFFFFF'},
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  confirmButton: {
    backgroundColor: '#DA3743',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {opacity: 0.6},
  confirmButtonText: {fontSize: 16, fontWeight: '700', color: '#FFFFFF'},
});

export default RestaurantDetailScreen;
