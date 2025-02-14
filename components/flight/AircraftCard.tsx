import { Feather } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { CounterButton } from './CounterButton';

type AircraftCardProps = {
  registration: string;
  aircraft: string;
  totalTime: string;
  totalLandings: number;
  dayLandings: number;
  nightLandings: number;
  onDayLandingsChange: (value: number) => void;
  onNightLandingsChange: (value: number) => void;
  flightType: string;
  landingType: string;
  onFlightTypePress: () => void;
  onLandingTypePress: () => void;
};

export function AircraftCard({
  registration,
  aircraft,
  totalTime,
  totalLandings,
  dayLandings,
  nightLandings,
  onDayLandingsChange,
  onNightLandingsChange,
  flightType,
  landingType,
  onFlightTypePress,
  onLandingTypePress,
}: AircraftCardProps) {
  return (
    <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="h-16 w-16 rounded-lg bg-gray-200" />
          <View className="ml-4">
            <Text className="text-xl font-bold">{registration}</Text>
            <Text className="text-gray-600">{aircraft}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Feather name="clock" size={20} color="#23d013" />
          <Text className="ml-2">{totalTime}</Text>
          <Feather name="navigation" size={20} color="#23d013" className="ml-4" />
          <Text className="ml-1">{totalLandings}</Text>
        </View>
      </View>

      <View className="mb-4">
        <Text className="mb-2">Landings</Text>
        <View className="mb-4 flex-row justify-between">
          <View>
            <Text>Day</Text>
            <View className="mt-2 flex-row items-center">
              <CounterButton
                iconName="minus"
                onPress={() => onDayLandingsChange(Math.max(0, dayLandings - 1))}
              />
              <Text className="mx-4 text-xl">{dayLandings}</Text>
              <CounterButton iconName="plus" onPress={() => onDayLandingsChange(dayLandings + 1)} />
            </View>
          </View>
          <View>
            <Text>Night</Text>
            <View className="mt-2 flex-row items-center">
              <CounterButton
                iconName="minus"
                onPress={() => onNightLandingsChange(Math.max(0, nightLandings - 1))}
              />
              <Text className="mx-4 text-xl">{nightLandings}</Text>
              <CounterButton
                iconName="plus"
                onPress={() => onNightLandingsChange(nightLandings + 1)}
              />
            </View>
          </View>
        </View>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-gray-200 py-2"
          onPress={onFlightTypePress}>
          <Text>Type of flight</Text>
          <View className="flex-row items-center">
            <Text className="mr-2">{flightType}</Text>
            <Feather name="chevron-right" size={20} color="#23d013" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between py-2"
          onPress={onLandingTypePress}>
          <Text>Landing</Text>
          <View className="flex-row items-center">
            <Text className="mr-2">{landingType}</Text>
            <Feather name="chevron-right" size={20} color="#23d013" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
