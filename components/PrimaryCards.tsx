import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import '../assets/images/logbook.png';

export type MenuCardProps = {
  id: number;
  value: string;
  label: string;
};

const menuItems: MenuCardProps[] = [
  {
    id: 1,
    value: '425:30',
    label: 'Total time(hours)',
  },
  {
    id: 2,
    value: '42',
    label: 'Airports visited',
  },
  {
    id: 3,
    value: 'EVRA',
    label: 'Most visited airport',
  },
];

function renderMenuCard({ item }: { item: MenuCardProps }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={item.value}
      className="overflow-hidden rounded-xl">
      <View className="relative h-32 w-52 flex-1 flex-col bg-white">
        <View className="flex-1">
          <View
            className="absolute -bottom-8 -left-20 h-20 w-40 bg-[#D9FAC9]"
            style={{ transform: [{ rotate: '70deg' }] }}
          />
          <View className="flex-1 items-center justify-center">
            <Text className="pl-6 text-xl font-semibold">{item.value}</Text>
          </View>
        </View>
        <View>
          <LinearGradient colors={['#D9FAC9', '#83E373']} style={{ height: 40 }}>
            <Text className="p-2 pl-4 text-base font-medium text-black">{item.label}</Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function PrimaryCards() {
  return (
    <FlatList
      renderItem={renderMenuCard}
      data={menuItems}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      contentContainerStyle={{ gap: 24 }}
    />
  );
}
