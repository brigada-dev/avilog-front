import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import '../assets/images/logbook.png';

type MenuCardProps = {
  id: number;
  title: string;
  icon: any;
  route: '/(pilot)/logbook' | '/modal' | '/profile' | '/time-summary';
};

const menuItems: MenuCardProps[] = [
  {
    id: 1,
    title: 'Add flight',
    icon: require('../assets/images/logbook.png'),
    route: '/(pilot)/logbook',
  },
  {
    id: 2,
    title: 'All flights',
    icon: require('../assets/images/folder.png'),
    route: '/modal',
  },
];

function renderMenuCard({ item }: { item: MenuCardProps }) {
  return (
    <Link href={item.route} asChild>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.title}
        className="overflow-hidden rounded-xl">
        <View className="relative h-24 w-44 flex-1 flex-col bg-white">
          <View className="flex-1">
            <View
              className="absolute -bottom-8 -left-20 h-20 w-40 bg-[#D9FAC9]"
              style={{ transform: [{ rotate: '70deg' }] }}
            />
            <View className="absolute right-2 top-5 flex flex-row items-center gap-2">
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Image source={item.icon} style={{ height: 40, width: 40 }} />
            </View>
          </View>   
          <View>
            <LinearGradient colors={['#D9FAC9', '#83E373']} style={{ height: 20 }}>
              {/* <Text className="p-2 pl-4 text-lg font-medium text-black">{item.title}</Text> */}
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export function SecondaryButtons() {
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
