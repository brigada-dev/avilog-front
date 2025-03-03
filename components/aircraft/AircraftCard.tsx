import { Feather } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

type AircraftCardProps = {
  registration: string;
  type: string;
  image_url: string | null;
  loading?: boolean;
};

export function AircraftCard({ image_url, registration, type, loading }: AircraftCardProps) {
  return loading ? (
    <View className="h-24 flex-1 animate-pulse bg-black/10" />
  ) : (
    <View className="h-24 flex-1 flex-row overflow-hidden">
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
          <Text className="text-sm">{type}</Text>
        </View>
        <View className="flex flex-row gap-2">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/clock.png')}
              style={{ height: 24, width: 24 }}
            />
            <Text className="text-sm font-bold">500</Text>
          </View>
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/landing.png')}
              style={{ height: 24, width: 24 }}
            />
            <Text className="text-sm font-bold">18</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
