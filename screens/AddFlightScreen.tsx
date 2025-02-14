import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { AircraftCard } from '../components/flight/AircraftCard';
import { CrewSection } from '../components/flight/CrewSection';
import { FlightDetailsCard } from '../components/flight/FlightDetailsCard';
import { TimeSummarySection } from '../components/flight/TimeSummarySection';

export function AddFlightScreen() {
  const router = useRouter();
  const [dayLandings, setDayLandings] = useState(1);
  const [nightLandings, setNightLandings] = useState(0);
  const [flightType, setFlightType] = useState('IFR');
  const [landingType, setLandingType] = useState('ILS CAT 1');

  const timesSummary = [
    { label: 'TOTAL', time: '1:20' },
    { label: 'SIC', time: '1:20' },
    { label: 'MP', time: '1:20' },
    { label: 'IFR', time: '1:20' },
    { label: 'XC', time: '1:20' },
  ];

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
          <View className="ml-4">
            <Text className="text-2xl font-bold">LOGBOOK</Text>
            <Text className="text-lg">Add flight</Text>
          </View>
        </View>

        {/* Flight Details */}
        <FlightDetailsCard
          departure={{
            date: '25 nov. 2024',
            time: '09:15',
            airport: 'ESMS',
            country: 'sweden',
          }}
          arrival={{
            date: '25 nov. 2024',
            time: '10:35',
            airport: 'EDDP',
            country: 'germany',
          }}
          duration="1:20"
        />

        {/* Aircraft Details */}
        <AircraftCard
          registration="OY-FSD"
          aircraft="SAAB 2000"
          totalTime="275:30"
          totalLandings={125}
          dayLandings={dayLandings}
          nightLandings={nightLandings}
          onDayLandingsChange={setDayLandings}
          onNightLandingsChange={setNightLandings}
          flightType={flightType}
          landingType={landingType}
          onFlightTypePress={() => {
            /* Handle flight type selection */
          }}
          onLandingTypePress={() => {
            /* Handle landing type selection */
          }}
        />

        {/* Crew Section */}
        <CrewSection
          onAddCrew={() => {
            /* Handle add crew */
          }}
          onChangeRole={() => {
            /* Handle role change */
          }}
        />

        {/* Time Summary */}
        <TimeSummarySection
          times={timesSummary}
          onAdjust={() => {
            /* Handle time adjustment */
          }}
        />

        {/* Signature Section */}
        <View className="mb-6 rounded-3xl bg-white p-4 shadow-lg">
          <TouchableOpacity
            className="flex-row items-center justify-center py-3"
            onPress={() => {
              /* Handle signature */
            }}>
            <Feather name="edit-2" size={20} color="#23d013" />
            <Text className="ml-2 text-[#23d013]">Add signature</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="mb-6 items-center rounded-full bg-[#23d013] py-4"
          onPress={() => {
            /* Handle save */
          }}
          accessibilityRole="button"
          accessibilityLabel="Save flight">
          <Text className="font-bold text-white">Save flight</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
