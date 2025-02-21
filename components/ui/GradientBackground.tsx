import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

export type GradientBackgroundProps = {
  style?: object;
  children: React.ReactNode;
};

export function GradientBackground({ style, children }: GradientBackgroundProps) {
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

export function GradientBackgroundSecondary({ style, children }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={['#466142', '#3D6159', '#255C58']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    minHeight: '100%',
  },
});
