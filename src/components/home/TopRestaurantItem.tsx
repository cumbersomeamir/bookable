import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Restaurant} from '@/types/restaurant';

interface TopRestaurantItemProps {
  restaurant: Restaurant;
  rank: number;
  onPress?: () => void;
}

const TopRestaurantItem: React.FC<TopRestaurantItemProps> = ({restaurant, rank, onPress}) => {
  const primaryImage = restaurant.images.find(img => img.isPrimary) || restaurant.images[0];

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(restaurant.rating);
    const hasHalfStar = restaurant.rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="star" size={12} color="#F59E0B" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="star-half" size={12} color="#F59E0B" />);
      } else {
        stars.push(<Icon key={i} name="star-border" size={12} color="#F59E0B" />);
      }
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{uri: primaryImage?.url}} style={styles.image} resizeMode="cover" />
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <View style={styles.ratingRow}>
          <View style={styles.stars}>{renderStars()}</View>
          <Text style={styles.reviewCount}>{restaurant.reviewCount.toLocaleString()} reviews</Text>
        </View>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <Text style={styles.area}>{restaurant.areaName}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Icon name="bookmark-border" size={22} color="#DA3743" />
        </TouchableOpacity>
        <Text style={styles.priceLevel}>{restaurant.priceLevel}</Text>
        {restaurant.distance && (
          <View style={styles.distanceRow}>
            <Icon name="place" size={14} color="#6B7280" />
            <Text style={styles.distance}>{restaurant.distance.display}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  rankBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: '#DA3743',
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  cuisine: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  area: {
    fontSize: 13,
    color: '#6B7280',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bookmarkBtn: {
    padding: 4,
  },
  priceLevel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
});

export default TopRestaurantItem;
