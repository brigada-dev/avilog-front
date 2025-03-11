import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

export type GradientBackgroundProps = {
  style?: object;
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'tertiary';
};

export function GradientBackground({ style, children, variant }: GradientBackgroundProps) {
  switch (variant) {
    case 'primary':
      return (
        <LinearGradient
          colors={['rgba(165,255,150,0.75)', 'rgba(132,255,225,0.75)', 'rgba(54,236,225,0.75)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, style]}>
          {children}
        </LinearGradient>
      );
    case 'secondary':
      return (
        <LinearGradient
          colors={['rgba(165,255,150,0.3)', 'rgba(132,255,225,0.3)', 'rgba(54,236,225,0.3)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, style]}>
          {children}
        </LinearGradient>
      );
    case 'tertiary':
      return (
        <LinearGradient
          colors={['#EAFAF8', '#F5FCF5', '#CAF2EC']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, style]}>
          {children}
        </LinearGradient>
      );
    default:
      return (
        <LinearGradient
          colors={['#A5FF96BF', '#84FFE1BF', '#36ECE1BF']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, style]}>
          {children}
        </LinearGradient>
      );
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    minHeight: '100%',
  },
});
