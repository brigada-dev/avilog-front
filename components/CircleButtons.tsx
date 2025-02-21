import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

type CircleButtonProps = {
  id: number;
  title: string;
  icon: any;
  route:
    | '/(pilot)/airports'
    | '/(pilot)/aircrafts'
    | '/(pilot)/crew'
    | '/(pilot)/monthly'
    | '/(pilot)/total_time';
};

const circleButtons: CircleButtonProps[] = [
  {
    id: 1,
    title: 'Airports',
    icon: require('../assets/images/maps.png'),
    route: '/(pilot)/airports',
  },
  {
    id: 2,
    title: 'Aircrafts',
    icon: require('../assets/images/aircraft.png'),
    route: '/(pilot)/aircrafts',
  },
  {
    id: 3,
    title: 'Total time',
    icon: require('../assets/images/graph.png'),
    route: '/(pilot)/total_time',
  },
  {
    id: 4,
    title: 'Monthly',
    icon: require('../assets/images/calendar2.png'),
    route: '/(pilot)/monthly',
  },
  {
    id: 5,
    title: 'Crew',
    icon: require('../assets/images/profile.png'),
    route: '/(pilot)/crew',
  },
];

const groupedButtons: CircleButtonProps[][] = [
  circleButtons.slice(0, 2),
  circleButtons.slice(2, 5),
];

function renderCircleButton(item: CircleButtonProps) {
  return (
    <Link href={item.route} asChild>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.title}
        style={{ alignItems: 'center' }}>
        <View
          style={{
            borderColor: '#FFFFFF',
            borderWidth: 8,
            borderRadius: 100,
            marginHorizontal: 8,
          }}>
          <View className="overflow-hidden rounded-full">
            <LinearGradient
              colors={['#A7ECA0', '#55A84D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 80, width: 80 }}>
              <View className="flex-1 items-center justify-center">
                <Image source={item.icon} style={{ height: 40, width: 40 }} />
              </View>
            </LinearGradient>
          </View>
        </View>
        <Text className="text-lg font-semibold">{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );
}

function renderRow({ item, index }: { item: CircleButtonProps[]; index: number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 16,
        width: '100%',
        justifyContent: index === 0 ? 'space-around' : 'space-between',
      }}>
      {item.map((button) => (
        <View key={button.id}>{renderCircleButton(button)}</View>
      ))}
    </View>
  );
}
export function CircleButtons() {
  return (
    <FlatList
      data={groupedButtons}
      renderItem={renderRow}
      scrollEnabled={false}
      keyExtractor={(_, index) => `row-${index}`}
      style={{ marginTop: 32, flex: 1 }}
    />
  );
}
