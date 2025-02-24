import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

type MenuCardProps = {
  id: number;
  title: string;
  icon: any;
  route: '/(pilot)/logbook' | '/modal' | '/profile' | '/time-summary';
};

const menuItems: MenuCardProps[] = [
  {
    id: 1,
    title: 'Logbook',
    icon: require('../assets/images/logbook.png'),
    route: '/(pilot)/logbook',
  },
  {
    id: 2,
    title: 'Maps',
    icon: require('../assets/images/maps.png'),
    route: '/modal',
  },
  {
    id: 3,
    title: 'Time summary',
    icon: require('../assets/images/time_summary.png'),
    route: '/time-summary',
  },
  {
    id: 4,
    title: 'Profile',
    icon: require('../assets/images/profile.png'),
    route: '/profile',
  },
];

function renderMenuCard({ item }: { item: MenuCardProps }) {
  return (
    <Link href={item.route} asChild>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.title}
        className="overflow-hidden rounded-xl">
        <View className="relative h-32 w-44 flex-1 flex-col bg-white">
          <View className="flex-1">
            <View
              className="absolute -bottom-8 -left-14 h-20 w-40 bg-[#D9FAC9]"
              style={{ transform: [{ rotate: '60deg' }] }}
            />
            <View className="absolute right-4 top-1 flex-1">
              <Image source={item.icon} style={{ height: 72, width: 72 }} />
            </View>
          </View>
          <View>
            <LinearGradient colors={['#D9FAC9', '#83E373']}>
              <Text className="p-2 pl-4 text-lg font-medium text-black">{item.title}</Text>
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export function MainButtons() {
  return (
    <>
      <FlatList
        renderItem={renderMenuCard}
        scrollEnabled={false}
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
        }}
      />
    </>
  );
}
