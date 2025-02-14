import React from "react"
import { View } from "react-native"
import { mapStyle } from "../components/map/CustomMapStyle"
import type { Airport, FlightRoute } from "../types/map"

// Re-use the same data from MapScreen
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

export default function NativeMap() {
  const initialRegion = {
    latitude: 54.526,
    longitude: 15.2551,
    latitudeDelta: 35,
    longitudeDelta: 35,
  }

  return (
    <View></View>
  )
} 