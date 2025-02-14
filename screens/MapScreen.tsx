import React from "react"
import { View, Text, TouchableOpacity, Platform } from "react-native"
import { Feather } from '@expo/vector-icons'
import type { Airport, FlightRoute } from "../types/map"

// Sample data
const airports: Airport[] = [
  { id: "1", name: "Stockholm Arlanda", code: "ARN", latitude: 59.6519, longitude: 17.9186 },
  { id: "2", name: "Copenhagen", code: "CPH", latitude: 55.618, longitude: 12.6508 },
  { id: "3", name: "Frankfurt", code: "FRA", latitude: 50.0379, longitude: 8.5622 },
]

const routes: FlightRoute[] = [
  {
    id: "1",
    origin: airports[0],
    destination: airports[1],
  },
]

const Header = () => (
  <View className="px-4 pt-12 pb-4 z-10">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
          <Feather name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-4">MAPS</Text>
      </View>
      <View className="flex-row items-center">
        <View className="bg-white rounded-full py-2 px-4 flex-row items-center shadow-sm mr-2">
          <Text className="text-gray-900 mr-1">Airports visited: 51</Text>
        </View>
      </View>
    </View>
  </View>
)

const WebMap = () => (
  <View className="flex-1 items-center justify-center bg-white rounded-3xl mx-4">
    <Feather name="map" size={48} color="#999" />
    <Text className="text-xl text-gray-600 mt-4">
      Maps are only available on mobile devices
    </Text>
  </View>
)

const Map = Platform.select({
  native: () => require('./NativeMap').default,
  default: WebMap,
})

export default function MapScreen() {
  return (
    <View className="flex-1 bg-[#e6f7eb]">
      <Header />
      <View className="flex-1 -mt-4">
        {/* {Platform.OS === 'web' ? <WebMap /> : <Map />} */}
      </View>
    </View>
  )
}

