import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Experience} from '@/types/restaurant';

const {width} = Dimensions.get('window');

interface ExperienceCardProps {
  experience: Experience;
  onPress?: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({experience, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{uri: experience.image.url}} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});

export default ExperienceCard;

