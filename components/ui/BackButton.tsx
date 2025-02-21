import { Feather } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export function BackButton({ onPress, className }: { onPress: () => void; className?: string }) {
  return (
    <TouchableOpacity
      className={clsx(
        'size-11 items-center justify-center rounded-full border-2 border-[#C4C4C4] bg-white',
        className
      )}
      onPress={onPress}>
      <Feather name="arrow-left" size={24} color="#5AD246" />
    </TouchableOpacity>
  );
}
