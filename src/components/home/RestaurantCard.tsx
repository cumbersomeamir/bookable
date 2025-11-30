import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Restaurant} from '@/types/restaurant';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface RestaurantCardProps {
  restaurant: Restaurant;
  showTimeSlots?: boolean;
  showPoints?: boolean;
  onPress?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  showTimeSlots = false,
  showPoints = false,
  onPress,
}) => {
  const primaryImage = restaurant.images.find(img => img.isPrimary) || restaurant.images[0];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{uri: primaryImage?.url}} style={styles.image} resizeMode="cover" />
        
        {/* Image indicators */}
        <View style={styles.indicators}>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={[styles.indicator, i === 0 && styles.activeIndicator]} />
          ))}
        </View>
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {restaurant.isAwardWinning && (
            <View style={styles.awardBadge}>
              <Icon name="emoji-events" size={12} color="#C9A227" />
              <Text style={styles.awardText}>Award-winning</Text>
            </View>
          )}
        </View>
        
        {restaurant.isPromoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <TouchableOpacity style={styles.bookmarkBtn}>
            <Icon name="bookmark-border" size={22} color="#DA3743" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.priceLevel}>{restaurant.priceLevel}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          <Text style={styles.dot}>•</Text>
          <Icon name="star" size={14} color="#DA3743" />
          <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
          <View style={styles.distanceContainer}>
            <Icon name="place" size={14} color="#6B7280" />
            <Text style={styles.distance}>{restaurant.distance.display}</Text>
          </View>
        </View>

        {showTimeSlots && restaurant.timeSlots.length > 0 && (
          <View style={styles.timeSlotsContainer}>
            {restaurant.timeSlots.slice(0, 3).map((slot, index) => (
              <TouchableOpacity key={index} style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{slot.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showPoints && showTimeSlots && restaurant.rewardPoints > 0 && (
          <View style={styles.pointsRow}>
            {restaurant.timeSlots.slice(0, 3).map((slot, index) => (
              <Text key={index} style={styles.pointsText}>+{restaurant.rewardPoints.toLocaleString()}pts</Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  indicators: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  awardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  awardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
  },
  promotedBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  promotedText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  bookmarkBtn: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  priceLevel: {
    fontSize: 13,
    color: '#6B7280',
  },
  dot: {
    fontSize: 13,
    color: '#6B7280',
    marginHorizontal: 4,
  },
  cuisine: {
    fontSize: 13,
    color: '#6B7280',
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  distance: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 2,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  timeSlot: {
    backgroundColor: '#DA3743',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pointsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  pointsText: {
    fontSize: 11,
    color: '#DA3743',
    fontWeight: '500',
    width: 56,
    textAlign: 'center',
  },
});

export default RestaurantCard;

