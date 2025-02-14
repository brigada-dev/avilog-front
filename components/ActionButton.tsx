import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ActionButtonProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress?: () => void;
};

export function ActionButton({ icon, title, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity
      className="w-40 flex-row items-center rounded-3xl bg-white p-4 shadow-lg"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <Text className="flex-1 text-xl font-semibold">{title}</Text>
      <Feather name={icon} size={24} color="#000000" />
    </TouchableOpacity>
  );
}
