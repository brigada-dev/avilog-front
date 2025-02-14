import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { SummaryCard } from '../components/time/SummaryCard';
import { GradientBackground } from '../components/ui/GradientBackground';

const TIME_DATA = {
  currency: [
    { label: 'PAX', value: '3 ldgs in 90 days' },
    { label: 'IR', value: 'IR expires: 25 Sep 2028' },
    { label: 'Night', value: 'Valid IR or 1 ldg in 90 days' },
  ],
  timeLimits: [
    { label: 'Last 28 days', value: 'Max 100 h' },
    { label: 'Last 12 months', value: 'Max 1000 h' },
    { label: 'Calendar year 2025', value: 'Max 900 h' },
  ],
  summary: [
    { label: 'Total Time Block', value: '2850:45' },
    { label: 'Pilot in command', value: '1285:10' },
    { label: 'Second in command', value: '202:20' },
    { label: 'Dual', value: '196:25' },
    { label: 'Instructor', value: '808:50' },
    { label: 'Simulator', value: '130:00' },
  ],
  types: [{ label: 'SB20', value: '161:15' }],
  operationalConditionTime: [
    { label: 'Day', value: '1993:15' },
    { label: 'Night', value: '857:30' },
    { label: 'IFR', value: '812:25' },
  ],
  category: [
    { label: 'Single pilot - SE', value: '672:45' },
    { label: 'Single pilot - ME', value: '1475:15' },
    { label: 'Multi pilot - MCC', value: '203:15' },
    { label: 'Multi engine piston - MEP', value: '1475:15' },
    { label: 'Multi engine landplane - MEL', value: '1475:15' },
    { label: 'Multi engine turbine - MET', value: '161:15' },
    { label: 'Landplane', value: '2850:45' },
    { label: 'Cross Country - XC', value: '1475:15' },
  ],
  landings: [
    { label: 'Landings total', value: '1921' },
    { label: 'Landings - Day', value: '1475' },
    { label: 'Landings - Night', value: '446' },
    { label: 'ILS CAT 1', value: '488' },
    { label: 'LOC', value: '72' },
    { label: 'VOR', value: '12' },
    { label: 'VISUAL', value: '28' },
    { label: 'AIRPORTS', value: '228' },
  ],
};

export function TimeScreen() {
  const router = useRouter();

  return (
    <GradientBackground>
      <ScrollView>
        <View className="p-6">
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="ml-4 text-2xl font-bold">TIME SUMMARY</Text>
          </View>

          <SummaryCard title="Currency" items={TIME_DATA.currency} />
          <SummaryCard title="Time limits" items={TIME_DATA.timeLimits} />
          <SummaryCard title="Summary" items={TIME_DATA.summary} />
          <SummaryCard title="Types" items={TIME_DATA.types} />
          <SummaryCard
            title="Operational condition time"
            items={TIME_DATA.operationalConditionTime}
          />
          <SummaryCard title="Category" items={TIME_DATA.category} />
          <SummaryCard title="Landings" items={TIME_DATA.landings} />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
