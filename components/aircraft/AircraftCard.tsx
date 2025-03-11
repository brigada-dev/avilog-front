import { Feather } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';
import { formatDuration } from '~/utils/date';

type AircraftCardProps = {
  registration: string;
  type: string;
  image_url: string | null;
  total_flight_time?: number;
  total_landings?: number;
  loading?: boolean;
};

export function AircraftCard({ 
  image_url, 
  registration, 
  type, 
  total_flight_time = 0,
  total_landings = 0,
  loading 
}: AircraftCardProps) {
  return loading ? (
    <View className="h-24 flex-1 animate-pulse bg-black/10" />
  ) : (
    <View className="h-32 flex-1 flex-row overflow-hidden rounded-xl border border-gray-200">
      <View className="flex-1">
        {image_url ? (
          <Image source={{ uri: image_url }} style={{ height: 128 }} />
        ) : (
          <View className="flex-1 items-center justify-center">
            <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
              <Image
                source={require('../../assets/images/image_placeholder.png')}
                style={{ height: 80, width: 80 }}
              />
            </View>
          </View>
        )}
      </View>
      <View className="ml-2 flex-1 items-start justify-center">
        <View>
          <Text className="text-lg font-bold">{registration}</Text>
          <Text className="text-sm text-gray-600">{type}</Text>
        </View>
        <View className="mt-2 flex flex-row gap-4">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/clock.png')}
              style={{ height: 20, width: 20 }}
            />
            <Text className="ml-1 text-sm font-medium text-gray-600">
              {formatDuration(total_flight_time)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/landing.png')}
              style={{ height: 20, width: 20 }}
            />
            <Text className="ml-1 text-sm font-medium text-gray-600">
              {total_landings}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
