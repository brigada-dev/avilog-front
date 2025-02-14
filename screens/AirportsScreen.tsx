import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { AirportChart } from "../components/airport/AirportChart"

const airportData = [
  { code: "ESMS", country: "SE", visits: 27, flagUrl: "https://flagcdn.com/w40/se.png" },
  { code: "EDDP", country: "DE", visits: 12, flagUrl: "https://flagcdn.com/w40/de.png" },
  { code: "LHDC", country: "HU", visits: 8, flagUrl: "https://flagcdn.com/w40/hu.png" },
  { code: "LBSF", country: "BG", visits: 8, flagUrl: "https://flagcdn.com/w40/bg.png" },
  { code: "ESGG", country: "SE", visits: 7, flagUrl: "https://flagcdn.com/w40/se.png" },
  { code: "EGJJ", country: "GB", visits: 6, flagUrl: "https://flagcdn.com/w40/gb.png" },
  { code: "EDDN", country: "DE", visits: 6, flagUrl: "https://flagcdn.com/w40/de.png" },
  { code: "ETNL", country: "DE", visits: 6, flagUrl: "https://flagcdn.com/w40/de.png" },
  { code: "EDLV", country: "DE", visits: 5, flagUrl: "https://flagcdn.com/w40/de.png" },
  { code: "EBLG", country: "BE", visits: 5, flagUrl: "https://flagcdn.com/w40/be.png" },
  { code: "LECO", country: "ES", visits: 4, flagUrl: "https://flagcdn.com/w40/es.png" },
  { code: "EKRK", country: "DK", visits: 4, flagUrl: "https://flagcdn.com/w40/dk.png" },
  { code: "ESKS", country: "SE", visits: 4, flagUrl: "https://flagcdn.com/w40/se.png" },
  { code: "EPGD", country: "PL", visits: 4, flagUrl: "https://flagcdn.com/w40/pl.png" },
  { code: "EETN", country: "EE", visits: 4, flagUrl: "https://flagcdn.com/w40/ee.png" },
  { code: "LDOS", country: "HR", visits: 4, flagUrl: "https://flagcdn.com/w40/hr.png" },
  { code: "LHBP", country: "HU", visits: 2, flagUrl: "https://flagcdn.com/w40/hu.png" },
  { code: "EKBI", country: "DK", visits: 2, flagUrl: "https://flagcdn.com/w40/dk.png" },
  { code: "EVRA", country: "LV", visits: 2, flagUrl: "https://flagcdn.com/w40/lv.png" },
  { code: "LGKO", country: "GR", visits: 2, flagUrl: "https://flagcdn.com/w40/gr.png" },
  { code: "EBOS", country: "BE", visits: 1, flagUrl: "https://flagcdn.com/w40/be.png" },
  { code: "LIMC", country: "IT", visits: 1, flagUrl: "https://flagcdn.com/w40/it.png" },
  { code: "LTFE", country: "TR", visits: 1, flagUrl: "https://flagcdn.com/w40/tr.png" },
  { code: "EDDW", country: "DE", visits: 1, flagUrl: "https://flagcdn.com/w40/de.png" },
  { code: "LOWS", country: "AT", visits: 1, flagUrl: "https://flagcdn.com/w40/at.png" },
  { code: "EDDL", country: "DE", visits: 1, flagUrl: "https://flagcdn.com/w40/de.png" },
]

export default function AirportsScreen() {
  const router = useRouter()

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
          <Text className="ml-4 text-2xl font-bold">AIRPORTS</Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-6 flex-row space-x-4">
          <View className="flex-1 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-4xl font-bold text-center">38</Text>
            <Text className="text-center text-gray-600">Total airports</Text>
          </View>
          <View className="flex-1 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-4xl font-bold text-center">12</Text>
            <Text className="text-center text-gray-600">Countries</Text>
          </View>
        </View>

        {/* Chart Card */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-lg font-bold">Most visited</Text>
          <AirportChart data={airportData} />
        </View>

        {/* Airport List */}
        <View className="rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-lg font-bold">All airports</Text>
          {airportData.map((airport, index) => (
            <View 
              key={airport.code}
              className="flex-row items-center justify-between border-b border-gray-200 py-3"
            >
              <View className="flex-row items-center">
                <Image 
                  source={{ uri: airport.flagUrl }} 
                  className="h-6 w-8 mr-3" 
                />
                <Text className="text-base font-medium">{airport.code}</Text>
              </View>
              <Text className="text-gray-600">{airport.visits} visits</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

