import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Area} from '@/types/restaurant';

interface AreaChipProps {
  area: Area;
  onPress?: () => void;
}

const AreaChip: React.FC<AreaChipProps> = ({area, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.name}>{area.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});

export default AreaChip;

