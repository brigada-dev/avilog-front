import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

type CircularMenuItemProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
};

export function CircularMenuItem({ icon, title }: CircularMenuItemProps) {
  return (
    <View className="items-center" accessibilityRole="button" accessibilityLabel={title}>
      <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
        <Feather name={icon} size={24} color="#000000" />
      </View>
      <Text className="text-center text-black">{title}</Text>
    </View>
  );
}
