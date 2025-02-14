import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { FlightEntry } from '../components/FlightEntry';
import { StatCard } from '../components/StatCard';

const RECENT_FLIGHTS = [
  {
    registration: 'OY-FSD',
    type: 'IFR',
    date: '27/09/24',
    from: 'EVRA',
    to: 'ESMS',
    depTime: '12:10',
    arrTime: '13:45',
    duration: '1:35',
  },
  // Add other flight entries...
];

const MENU_ITEMS = [
  { title: 'Airports', icon: 'map-pin' as const, route: '/airports' as '/airports' },
  { title: 'Aircrafts', icon: 'send' as const, route: '/aircraft' as '/aircraft' },
  { title: 'Total time', icon: 'clock' as const, route: '/aircraft' as '/aircraft' },
  { title: 'Monthly', icon: 'calendar' as const, route: '/aircraft' as '/aircraft' },
  { title: 'Crew', icon: 'users' as const, route: '/aircraft' as '/aircraft' },
];

export function LogbookScreen() {
  const router = useRouter();

  const handleAddFlight = () => {
    router.push('/logbook/add');
  };

  const handleMenuItemPress = (route: '/airports' | '/aircraft') => {
    router.push(route);
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-[#a5ff96] to-[#36ece1]">
      <View className="p-6">
        <View className="mb-8 flex-row justify-between">
          <TouchableOpacity
            className="w-40 flex-row items-center rounded-3xl bg-white p-4 shadow-lg"
            onPress={handleAddFlight}
            accessibilityRole="button"
            accessibilityLabel="Add flight">
            <Text className="flex-1 text-xl font-semibold">Add flight</Text>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-40 flex-row items-center rounded-3xl bg-white p-4 shadow-lg"
            onPress={() => router.push('/logbook/all')}
            accessibilityRole="button"
            accessibilityLabel="All flights">
            <Text className="flex-1 text-xl font-semibold">All flights</Text>
            <Feather name="list" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="mb-8 flex-row flex-wrap justify-between">
          {MENU_ITEMS.map(({ title, icon, route }) => (
            <TouchableOpacity
              key={title}
              className="mb-4 items-center"
              onPress={() => handleMenuItemPress(route)}
              accessibilityRole="button"
              accessibilityLabel={title}>
              <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                <Feather name={icon} size={24} color="black" />
              </View>
              <Text className="text-center text-black">{title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          className="mb-4 rounded-3xl bg-white p-4 shadow-lg"
          accessibilityRole="list"
          accessibilityLabel="Recent flights">
          <Text className="mb-4 text-2xl font-bold">Recent flights</Text>
          {RECENT_FLIGHTS.map((flight, index) => (
            <FlightEntry key={index} {...flight} />
          ))}
        </View>

        <StatCard icon={require('../assets/clock-icon.png')} label="TOTAL TIME" value="2850:45 H" />

        <StatCard icon={require('../assets/pilot-hat-icon.png')} label="PIC" value="12" />
      </View>
    </ScrollView>
  );
}
