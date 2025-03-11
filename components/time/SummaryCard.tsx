import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';

type SummaryItem = {
  label: string;
  value: string;
};

type SummaryCardProps = {
  title: string;
  items: SummaryItem[];
};

export function SummaryCard({ title, items }: SummaryCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-default">
      <Text className="mb-2 text-lg font-bold">{title}</Text>
      {items.map((item, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between border-b border-gray-200 py-2">
          <View className="flex-row items-center">
            <Text className="ml-2">{item.label}</Text>
          </View>
          <Text>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
