import React from 'react';
import { ScrollView, View, Text } from 'react-native';

import { FlightEntry } from '../components/FlightEntry';
import { MenuCard } from '../components/MenuCard';
import { StatCard } from '../components/StatCard';

const MENU_ITEMS = [
  { title: 'Logbook', icon: 'https://v0.dev/placeholder.svg', route: '/logbook' as const },
  { title: 'Maps', icon: 'https://v0.dev/placeholder.svg', route: '/modal' as const },
  { title: 'Time summary', icon: 'https://v0.dev/placeholder.svg', route: '/time-summary' as const },
  { title: 'Profile', icon: 'https://v0.dev/placeholder.svg', route: '/profile' as const },
];

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
  // Add other flight entries here...
];

export default function App() {
  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-[#a5ff96] to-[#36ece1]">
      <View className="p-6">
        <Text className="my-8 text-center text-4xl font-bold">AVILOG</Text>

        <View className="flex-row flex-wrap justify-center">
          {MENU_ITEMS.map((item) => (
            <MenuCard key={item.title} {...item} />
          ))}
        </View>

        <View className="mt-6 rounded-3xl bg-white p-4 shadow-lg">
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
