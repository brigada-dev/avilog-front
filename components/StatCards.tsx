import { View, Text, Image, ImageSourcePropType, FlatList } from 'react-native';

type StatCardProps = {
  id: number;
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

const stats: StatCardProps[] = [
  {
    id: 1,
    icon: require('../assets/images/klok.png'),
    label: 'Total time',
    value: '2850:45 H',
  },
  {
    id: 2,
    icon: require('../assets/images/pilot_hat.png'),
    label: 'Total flights',
    value: '6,000',
  },
  {
    id: 3,
    icon: require('../assets/images/klok.png'),
    label: 'PIC',
    value: '1285:10 H',
  },
  {
    id: 4,
    icon: require('../assets/images/pilot_hat.png'),
    label: 'Test',
    value: 'Test',
  },
];

const renderStatCard = ({ item }: { item: StatCardProps }) => {
  return (
    <View className="flex-1 flex-row items-center gap-6 rounded-xl bg-white p-4">
      <View className="flex-row items-center">
        <Image source={item.icon} className="mr-2 h-6 w-6" />
        <Text className="ml-1 text-lg font-semibold">{item.label}</Text>
      </View>
      <Text className="ml-auto text-lg">{item.value}</Text>
    </View>
  );
};

export function StatCards() {
  return (
    <FlatList
      renderItem={renderStatCard}
      data={stats}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      contentContainerStyle={{ gap: 16, paddingBottom: 20, marginTop: 16 }}
    />
  );
}
