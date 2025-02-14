import { Feather } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

type AircraftCardProps = {
  registration: string;
  model: string;
  flightTime: string;
  landings: string;
};

export function AircraftCard({ registration, model, flightTime, landings }: AircraftCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-lg">
      <View className="flex-row items-center">
        <Image
          source={require('../../assets/aircraft.png')}
          className="mr-4 h-16 w-16 rounded-lg bg-gray-200"
        />
        <View>
          <Text className="text-lg font-bold">{registration}</Text>
          <Text className="text-gray-600">{model}</Text>
        </View>
      </View>
      <View className="mt-4 flex-row justify-between">
        <View className="flex-row items-center">
          <Feather name="clock" size={20} color="#23d013" />
          <Text className="ml-2">{flightTime}</Text>
        </View>
        <View className="flex-row items-center">
          <Feather name="navigation" size={20} color="#23d013" />
          <Text className="ml-2">{landings}</Text>
        </View>
      </View>
    </View>
  );
}
