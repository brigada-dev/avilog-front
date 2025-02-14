import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { Feather } from '@expo/vector-icons';
import FlightEntry from "../components/flight/FlightEntry"
import { useRouter } from 'expo-router';

const timeFilters = ["'25", "1 yr", "3 yr", "Start"]

export default function AllFlightsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = React.useState("'25")

  const flights = [
    {
      registration: "OY-FSD",
      type: "IFR",
      date: "27/09/24",
      from: "EVRA",
      to: "ESMS",
      depTime: "12:10",
      arrTime: "13:45",
      duration: "1:35",
    },
    // Add more flight entries here...
  ]

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
          <Text className="ml-4 text-2xl font-bold">ALL FLIGHTS</Text>
        </View>

        {/* Time Filter */}
        <View className="mb-6 rounded-3xl bg-white p-1 shadow-lg">
          <View className="flex-row">
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`flex-1 py-2 px-4 rounded-full ${
                  activeFilter === filter ? "bg-[#23d013]" : "bg-transparent"
                }`}>
                <Text
                  className={`text-center ${
                    activeFilter === filter ? "text-white font-medium" : "text-gray-700"
                  }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View className="mb-6 flex-row space-x-4">
          <View className="flex-1 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-4xl font-bold text-center">425:30</Text>
            <Text className="text-center text-gray-600">Total time (Hours)</Text>
          </View>
          <View className="flex-1 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-4xl font-bold text-center">38</Text>
            <Text className="text-center text-gray-600">Airports visited</Text>
          </View>
        </View>

        {/* Flight List */}
        <View className="rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-2xl font-bold">Recent flights</Text>
          {flights.map((flight, index) => (
            <FlightEntry key={index} {...flight} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

