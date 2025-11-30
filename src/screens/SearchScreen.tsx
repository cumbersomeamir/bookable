import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  StatusBar,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Conditionally import MapView to handle native module not found
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;
let mapsAvailable = false;

try {
  // Check if AIRMap native component exists
  const hasNativeMap = UIManager.getViewManagerConfig('AIRMap') != null;
  if (hasNativeMap) {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
    mapsAvailable = true;
  }
} catch (e) {
  console.log('Maps not available:', e);
  mapsAvailable = false;
}
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/AppNavigator';
import Colors from '@/theme/colors';
import api from '@/services/api';
import {Restaurant} from '@/types/restaurant';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05; // Zoomed out more to see all markers
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Central London (Mayfair/Soho area where restaurants are clustered)
const LONDON_CENTER = {
  latitude: 51.5115,
  longitude: -0.135,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

interface FilterChip {
  id: string;
  label: string;
  icon?: string;
  type: 'cuisine' | 'feature' | 'special';
}

const FILTER_CHIPS: FilterChip[] = [
  {id: 'romantic', label: 'Romantic', icon: 'favorite', type: 'special'},
  {id: 'italian', label: 'Italian', icon: 'restaurant', type: 'cuisine'},
  {id: 'brunch', label: 'Brunch', icon: 'brunch-dining', type: 'special'},
  {id: 'japanese', label: 'Japanese', icon: 'restaurant', type: 'cuisine'},
  {id: 'indian', label: 'Indian', icon: 'restaurant', type: 'cuisine'},
  {id: 'british', label: 'British', icon: 'restaurant', type: 'cuisine'},
  {id: 'french', label: 'French', icon: 'restaurant', type: 'cuisine'},
  {id: 'outdoor', label: 'Outdoor', icon: 'deck', type: 'feature'},
];

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const mapRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [region, setRegion] = useState(LONDON_CENTER);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};

      if (searchQuery) {
        params.query = searchQuery;
      }

      // Apply cuisine filters
      const cuisineFilter = selectedFilters.find(f =>
        ['italian', 'japanese', 'indian', 'british', 'french', 'chinese'].includes(f),
      );
      if (cuisineFilter) {
        params.cuisine = cuisineFilter.charAt(0).toUpperCase() + cuisineFilter.slice(1);
      }

      // Apply feature filters
      if (selectedFilters.includes('outdoor')) {
        params.features = 'Outdoor dining';
      }

      const response = await api.get('/search', {params});

      if (response.data.success) {
        setRestaurants(response.data.data.restaurants);
        setTotalCount(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedFilters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Fit map to show all restaurant markers when data loads
  useEffect(() => {
    if (mapsAvailable && mapRef.current && restaurants.length > 0 && !loading) {
      const validCoords = restaurants
        .filter(r => r.location?.coordinates)
        .map(r => ({
          latitude: r.location!.coordinates[1],
          longitude: r.location!.coordinates[0],
        }));

      if (validCoords.length > 0) {
        // Fit map to show all markers with padding
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(validCoords, {
            edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            animated: true,
          });
        }, 500);
      }
    }
  }, [restaurants, loading]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId],
    );
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', {slug: restaurant.slug});
  };

  const handleMarkerPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    if (mapRef.current && restaurant.location?.coordinates) {
      mapRef.current.animateToRegion(
        {
          latitude: restaurant.location.coordinates[1],
          longitude: restaurant.location.coordinates[0],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01 * ASPECT_RATIO,
        },
        300,
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedFilters([]);
    setSelectedRestaurant(null);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="star" size={14} color={Colors.primary} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="star-half" size={14} color={Colors.primary} />);
      } else {
        stars.push(<Icon key={i} name="star-border" size={14} color={Colors.primary} />);
      }
    }
    return stars;
  };

  const renderRestaurantCard = ({item}: {item: Restaurant}) => {
    const primaryImage = item.images?.find(img => img.isPrimary)?.url || item.images?.[0]?.url;

    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => handleRestaurantPress(item)}
        activeOpacity={0.7}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <View style={styles.cardHeader}>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.isPromoted && (
                <View style={styles.promotedBadge}>
                  <Text style={styles.promotedText}>Promoted</Text>
                </View>
              )}
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
              <Text style={styles.reviewCount}>{item.reviewCount} reviews</Text>
            </View>

            <Text style={styles.areaText}>{item.areaName}</Text>
            <Text style={styles.cuisineText}>
              {item.priceLevel} • {item.cuisine}
            </Text>

            {item.timeSlots && item.timeSlots.length > 0 && (
              <View style={styles.timeSlotsRow}>
                {item.timeSlots.slice(0, 3).map((slot, index) => (
                  <View key={index} style={styles.timeSlotContainer}>
                    <TouchableOpacity
                      style={[styles.timeSlot, !slot.available && styles.timeSlotUnavailable]}>
                      <Text
                        style={[
                          styles.timeSlotText,
                          !slot.available && styles.timeSlotTextUnavailable,
                        ]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                    {slot.points > 0 && (
                      <Text style={styles.pointsText}>+{slot.points.toLocaleString()}pts</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {primaryImage && <Image source={{uri: primaryImage}} style={styles.cardImage} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMapMarker = (restaurant: Restaurant, _index: number) => {
    if (!restaurant.location?.coordinates) {
      return null;
    }

    const isSelected = selectedRestaurant?._id === restaurant._id;
    const isPromoted = restaurant.isPromoted;

    return (
      <Marker
        key={restaurant._id}
        coordinate={{
          latitude: restaurant.location.coordinates[1],
          longitude: restaurant.location.coordinates[0],
        }}
        onPress={() => handleMarkerPress(restaurant)}
        tracksViewChanges={false}>
        <View
          style={[
            styles.markerContainer,
            isPromoted && styles.markerPromoted,
            isSelected && styles.markerSelected,
          ]}>
          <View style={[styles.marker, isPromoted && styles.markerPromotedInner]} />
        </View>
        {isSelected && (
          <View style={styles.markerLabel}>
            <Text style={styles.markerLabelText} numberOfLines={1}>
              {restaurant.name}
            </Text>
          </View>
        )}
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        {/* Booking Info */}
        <TouchableOpacity style={styles.bookingInfo}>
          <Icon name="person-outline" size={18} color={Colors.textDark} />
          <Text style={styles.bookingText}>2 • 19:00 Tonight</Text>
          <Icon name="keyboard-arrow-down" size={18} color={Colors.textDark} />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={22} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
          <Text style={styles.searchLocation}>Victoria</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="tune" size={18} color={Colors.textDark} />
          </TouchableOpacity>
          {FILTER_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.filterChip,
                selectedFilters.includes(chip.id) && styles.filterChipActive,
              ]}
              onPress={() => toggleFilter(chip.id)}>
              {chip.icon && (
                <Icon
                  name={chip.icon}
                  size={16}
                  color={selectedFilters.includes(chip.id) ? Colors.white : Colors.textDark}
                  style={styles.chipIcon}
                />
              )}
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilters.includes(chip.id) && styles.filterChipTextActive,
                ]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map View */}
      {showMap && (
        <View style={styles.mapContainer}>
          {mapsAvailable && MapView ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={region}
              onRegionChangeComplete={setRegion}
              showsUserLocation
              showsMyLocationButton={false}>
              {restaurants.map((restaurant, index) => renderMapMarker(restaurant, index))}
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Icon name="map" size={64} color={Colors.gray} />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
              <Text style={styles.mapPlaceholderSubtext}>Rebuild app to enable Google Maps</Text>
              <View style={styles.mapPinsPreview}>
                {restaurants.slice(0, 5).map((r, i) => (
                  <TouchableOpacity
                    key={r._id}
                    style={[styles.previewPin, {left: 30 + i * 50, top: 20 + (i % 2) * 30}]}
                    onPress={() => handleRestaurantPress(r)}>
                    <View style={[styles.marker, r.isPromoted && styles.markerPromotedInner]} />
                    <Text style={styles.previewPinText} numberOfLines={1}>
                      {r.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Results Panel */}
      <View style={[styles.resultsPanel, !showMap && styles.resultsPanelFull]}>
        <View style={styles.panelHandle} />

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsCount}>{totalCount} restaurants</Text>
            <Text style={styles.resultsSubtitle}>Showing results near Victoria</Text>
            {(searchQuery || selectedFilters.length > 0) && (
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.revertSearch}>Revert search</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Restaurant List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={restaurants}
            keyExtractor={item => item._id}
            renderItem={renderRestaurantCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>

      {/* Toggle Map/List Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowMap(!showMap)}>
        <Icon name={showMap ? 'list' : 'map'} size={20} color={Colors.textDark} />
        <Text style={styles.toggleButtonText}>{showMap ? 'List' : 'Map'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  bookingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginHorizontal: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    marginLeft: 10,
    paddingVertical: 0,
  },
  searchLocation: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  filtersContainer: {
    marginHorizontal: -16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  mapContainer: {
    height: height * 0.4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerPromoted: {},
  markerPromotedInner: {
    backgroundColor: '#FFB800',
  },
  markerSelected: {
    transform: [{scale: 1.3}],
  },
  markerLabel: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    maxWidth: 120,
  },
  markerLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textDark,
  },
  resultsPanel: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    paddingTop: 8,
  },
  resultsPanelFull: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  revertSearch: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  restaurantCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textDark,
    flex: 1,
  },
  promotedBadge: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  promotedText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 13,
    color: Colors.textLight,
  },
  areaText: {
    fontSize: 14,
    color: Colors.textDark,
    marginTop: 4,
  },
  cuisineText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  timeSlotContainer: {
    alignItems: 'center',
  },
  timeSlot: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  timeSlotUnavailable: {
    backgroundColor: Colors.lightGray,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  timeSlotTextUnavailable: {
    color: Colors.textLight,
  },
  pointsText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginLeft: 6,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F4E8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  mapPinsPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  previewPin: {
    position: 'absolute',
    alignItems: 'center',
    maxWidth: 80,
  },
  previewPinText: {
    fontSize: 10,
    color: Colors.textDark,
    marginTop: 2,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
});

export default SearchScreen;
