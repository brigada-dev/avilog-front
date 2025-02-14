import React from "react"
import { View, Text, Image } from "react-native"
import { Feather } from '@expo/vector-icons';

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

export default function FlightEntry({
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
    <View className="flex-row items-center p-4 bg-white rounded-xl mb-2">
      <View className="flex-row items-center flex-1">
        <Feather name="navigation" size={16} color="#374151" />
        <Text className="text-gray-700 font-medium">{registration}</Text>
        <View className="bg-gray-100 rounded px-2 py-0.5 mx-2">
          <Text className="text-gray-600 text-sm">{type}</Text>
        </View>
        <Text className="text-gray-500 text-sm">{date}</Text>
      </View>
      <View className="flex-row items-center">
        <View className="flex-row items-center mr-4">
          <Image source={{ uri: from }} className="w-5 h-3 mr-1" />
          <Text className="text-xs text-gray-600">{depTime}</Text>
          <Text className="text-xs font-medium ml-1">{from}</Text>
        </View>
        <Text className="font-bold text-lg mx-2">{duration}</Text>
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-600">{arrTime}</Text>
          <Text className="text-xs font-medium ml-1">{to}</Text>
          <Image source={{ uri: to }} className="w-5 h-3 ml-1" />
        </View>
      </View>
    </View>
  )
}

