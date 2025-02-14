import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

type MenuCardProps = {
  title: string;
  icon: string;
  route: '/logbook' | '/modal' | '/profile' | '/time-summary';
};

export function MenuCard({ title, route }: MenuCardProps) {
  const router = useRouter();

  // Map menu items to their respective Feather icons
  const getIconName = (title: string) => {
    switch (title) {
      case 'Logbook':
        return 'book';
      case 'Maps':
        return 'map';
      case 'Time summary':
        return 'clock';
      case 'Profile':
        return 'user';
      default:
        return 'box';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(route)}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View className="m-2 h-32 w-40 rounded-3xl bg-white p-4 shadow-lg">
        <View className="mb-2 h-12 w-12 justify-center">
          <Feather name={getIconName(title)} size={24} color="black" />
        </View>
        <Text className="text-xl font-semibold text-black">{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
