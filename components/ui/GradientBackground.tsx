import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ViewProps } from 'react-native';

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export function GradientBackground({ children, style, ...props }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={['#a5ff96', '#36ece1']}
      className="flex-1"
      style={style}
      {...props}>
      {children}
    </LinearGradient>
  );
} 