import { Feather } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

type FlightDetailsProps = {
  departure: {
    date: string;
    time: string;
    airport: string;
    country: string;
  };
  arrival: {
    date: string;
    time: string;
    airport: string;
    country: string;
  };
  duration: string;
};

export function FlightDetailsCard({ departure, arrival, duration }: FlightDetailsProps) {
  return (
    <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
      <View className="mb-4 flex-row justify-between">
        <View>
          <Text className="text-gray-600">Departure</Text>
          <View className="mt-1 flex-row items-center">
            <Feather name="calendar" size={20} color="#23d013" />
            <Text className="ml-2">{departure.date}</Text>
          </View>
        </View>
        <View>
          <Text className="text-gray-600">Arrival</Text>
          <View className="mt-1 flex-row items-center">
            <Feather name="calendar" size={20} color="#23d013" />
            <Text className="ml-2">{arrival.date}</Text>
          </View>
        </View>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-xl font-medium">{departure.airport}</Text>
          {/* <Image 
            source={require('../../assets/sweden-flag.png')}
            className="w-6 h-4 ml-2"
          /> */}
        </View>
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#23d013]">
          <Feather name="arrow-left" size={20} color="white" />
        </View>
        <View className="flex-row items-center">
          <Text className="text-xl font-medium">{arrival.airport}</Text>
          {/* <Image 
            source={require('../../assets/germany-flag.png')}
            className="w-6 h-4 ml-2"
          /> */}
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Feather name="clock" size={20} color="#23d013" />
          <Text className="ml-2">{departure.time}</Text>
          <Text className="ml-2 text-gray-600">UTC</Text>
        </View>
        <Text className="text-xl font-bold">{duration}</Text>
        <View className="flex-row items-center">
          <Feather name="clock" size={20} color="#23d013" />
          <Text className="ml-2">{arrival.time}</Text>
          <Text className="ml-2 text-gray-600">UTC</Text>
        </View>
      </View>
    </View>
  );
}
