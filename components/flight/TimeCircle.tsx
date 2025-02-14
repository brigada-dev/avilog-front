import { View, Text } from 'react-native';

type TimeCircleProps = {
  label: string;
  time: string;
};

export function TimeCircle({ label, time }: TimeCircleProps) {
  return (
    <View className="mr-4 items-center">
      <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-[#23d013]">
        <Text className="text-lg font-bold">{time}</Text>
      </View>
      <Text className="mt-1 text-xs text-gray-600">{label}</Text>
    </View>
  );
}
