import { Feather } from '@expo/vector-icons';
import React from "react"
import { View, Text, Image } from "react-native"

type AirportData = {
  code: string
  country: string
  visits: number
  flagUrl: string
}

type AirportChartProps = {
  data: AirportData[]
}

export function AirportChart({ data }: AirportChartProps) {
  const maxVisits = Math.max(...data.map((item) => item.visits))

  return (
    <View className="space-y-3">
      {data.map((airport, index) => (
        <View 
          key={`${airport.code}-${index}`} 
          className="flex-row items-center space-x-3"
          accessibilityRole="progressbar"
          accessibilityLabel={`${airport.code} with ${airport.visits} visits`}
        >
          <View className="w-16">
            <Image 
              source={{ uri: airport.flagUrl }} 
              className="h-4 w-6" 
              resizeMode="cover"
              accessibilityLabel={`Flag of ${airport.country}`}
            />
          </View>
          
          <Text className="w-14 font-medium text-gray-900">
            {airport.code}
          </Text>
          
          <View className="flex-1 flex-row items-center">
            <View 
              className="h-6 rounded bg-[#23d013]" 
              style={{ width: `${(airport.visits / maxVisits) * 100}%` }} 
            />
            <Text className="ml-3 text-gray-900">
              {airport.visits}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

