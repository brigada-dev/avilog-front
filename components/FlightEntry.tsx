import { View, Text, Image } from 'react-native';

type FlightEntryProps = {
  registration: string;
  type: string;
  date: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string;
};

export function FlightEntry({
  registration,
  type,
  date,
  from,
  to,
  depTime,
  arrTime,
  duration,
}: FlightEntryProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 py-3">
      <View className="flex-row items-center">
        <Image source={require('../assets/plane-icon.png')} className="mr-2 h-6 w-6" />
        <View>
          <Text className="text-base font-medium">{registration}</Text>
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm text-gray-600">{type}</Text>
            <Text className="text-sm text-gray-600">{date}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center">
        <View className="mr-4 items-center">
          <Text className="text-base font-medium">{depTime}</Text>
          <Text className="text-sm text-gray-600">{from}</Text>
        </View>
        <Text className="mx-2 text-xl font-bold">{duration}</Text>
        <View className="ml-4 items-center">
          <Text className="text-base font-medium">{arrTime}</Text>
          <Text className="text-sm text-gray-600">{to}</Text>
        </View>
      </View>
    </View>
  );
}
