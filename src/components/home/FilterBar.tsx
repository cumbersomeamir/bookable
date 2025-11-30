import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FilterBarProps {
  guests?: number;
  date?: string;
  location?: string;
  onGuestsPress?: () => void;
  onLocationPress?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  guests = 2,
  date = 'Any time or date',
  location = 'London, United Kingdom',
  onGuestsPress,
  onLocationPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton} onPress={onGuestsPress} activeOpacity={0.7}>
        <Icon name="person-outline" size={18} color="#1F2937" />
        <Text style={styles.filterText}>{guests} • {date}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.filterButton} onPress={onLocationPress} activeOpacity={0.7}>
        <Icon name="place" size={18} color="#1F2937" />
        <Text style={styles.filterText}>{location}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
});

export default FilterBar;

