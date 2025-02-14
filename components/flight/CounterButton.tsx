import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

type CounterButtonProps = {
  iconName: 'plus' | 'minus';
  onPress: () => void;
};

export function CounterButton({ iconName, onPress }: CounterButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-8 w-8 items-center justify-center rounded-full bg-[#23d013]"
      accessibilityRole="button"
      accessibilityLabel={`${iconName} button`}>
      <Feather name={iconName} size={20} color="white" />
    </TouchableOpacity>
  );
}
