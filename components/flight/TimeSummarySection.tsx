import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { TimeCircle } from './TimeCircle';

type TimeSummaryProps = {
  times: {
    label: string;
    time: string;
  }[];
  onAdjust: () => void;
};

export function TimeSummarySection({ times, onAdjust }: TimeSummaryProps) {
  return (
    <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
      <Text className="mb-4">Summary</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {times.map((item, index) => (
            <TimeCircle key={index} {...item} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity className="mt-4 flex-row items-center justify-center" onPress={onAdjust}>
        <Feather name="edit-2" size={20} color="#23d013" />
        <Text className="ml-2 text-[#23d013]">Adjust</Text>
      </TouchableOpacity>
    </View>
  );
}
