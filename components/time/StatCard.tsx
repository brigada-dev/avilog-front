import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View, Text } from 'react-native';

type SummaryItem = {
  label: string;
  value: string;
};

type SummaryCardProps = {
  title: string;
  items: SummaryItem[];
};

export function StatCard({ title, items }: SummaryCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <Text className="mb-2 text-lg font-bold">{title}</Text>
      {items.map((item, index) => (
        <>
          <View key={index} className="flex-1 flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Image
                source={require('../../assets/images/check.png')}
                style={{ height: 24, width: 24 }}
              />
              <Text className="ml-2">{item.label}</Text>
            </View>
            <Text>{item.value}</Text>
          </View>
          <View className="h-1 w-auto rounded-md bg-[#2ED013]" />
        </>
      ))}
    </View>
  );
}
