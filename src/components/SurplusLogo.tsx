import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Svg, {Path, Circle, G} from 'react-native-svg';
import Colors from '@/theme/colors';

interface SurplusLogoProps {
  size?: number;
  color?: string;
  showText?: boolean;
  style?: ViewStyle;
}

const SurplusLogo: React.FC<SurplusLogoProps> = ({
  size = 100,
  color = Colors.primary,
  showText = true,
  style,
}) => {
  const logoSize = size;
  const strokeWidth = size * 0.04;

  return (
    <View style={[styles.container, style]}>
      <Svg width={logoSize} height={logoSize} viewBox="0 0 100 100" fill="none">
        <G>
          {/* Book base */}
          <Path
            d="M15 25 L50 15 L85 25 L85 85 L50 75 L15 85 Z"
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinejoin="round"
          />
          {/* Book spine */}
          <Path d="M50 15 L50 75" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Left page lines */}
          <Path
            d="M25 35 L45 30"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
          />
          <Path
            d="M25 45 L45 40"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
          />
          <Path
            d="M25 55 L45 50"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
          />
          {/* Right page lines */}
          <Path
            d="M55 30 L75 35"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
          />
          <Path
            d="M55 40 L75 45"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
          />
          <Path
            d="M55 50 L75 55"
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
          />
          {/* Bookmark */}
          <Path
            d="M60 15 L60 35 L65 30 L70 35 L70 15"
            stroke={Colors.secondary}
            strokeWidth={strokeWidth * 0.8}
            fill={Colors.secondary}
            strokeLinejoin="round"
          />
          {/* Calendar dot accent */}
          <Circle cx="35" cy="65" r="3" fill={Colors.accent} />
        </G>
      </Svg>
      {showText && <Text style={[styles.logoText, {color}]}>Bookable</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 1,
  },
});

export default SurplusLogo;
