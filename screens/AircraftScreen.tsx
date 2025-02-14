import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { AircraftCard } from '../components/aircraft/AircraftCard';

const AIRCRAFT_LIST = [
  {
    registration: 'OY-FSD',
    model: 'SAAB 2000',
    flightTime: '275:30',
    landings: '125',
  },
  {
    registration: 'OY-FSC',
    model: 'SAAB 2000',
    flightTime: '110:40',
    landings: '75',
  },
  {
    registration: 'OY-FSD',
    model: 'SAAB 2000',
    flightTime: '108:25',
    landings: '88',
  },
  {
    registration: 'OY-FSC',
    model: 'SAAB 2000',
    flightTime: '52:10',
    landings: '32',
  },
];

export function AircraftScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-[#a5ff96] to-[#36ece1]">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-2xl font-bold">AIRCRAFTS</Text>
        </View>

        {/* Aircraft List */}
        {AIRCRAFT_LIST.map((aircraft, index) => (
          <AircraftCard key={`${aircraft.registration}-${index}`} {...aircraft} />
        ))}

        {/* Add Aircraft Button */}
        <TouchableOpacity
          onPress={() => router.push('/add-aircraft')}
          className="mt-4 flex-row items-center justify-center rounded-full bg-white px-6 py-3 shadow-lg"
          accessibilityRole="button"
          accessibilityLabel="Add aircraft">
          <Feather name="plus" size={24} color="#23d013" />
          <Text className="ml-2 text-lg font-semibold text-[#23d013]">Add aircraft</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
