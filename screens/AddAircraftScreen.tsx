import React, { useState } from "react"
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Image } from "react-native"
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

type EngineType = 'glider' | 'piston' | 'turboprop' | 'jet';

export default function AddAircraftScreen() {
  const router = useRouter()
  const [isAircraft, setIsAircraft] = useState(true)
  const [isSimulator, setIsSimulator] = useState(false)
  const [isSingleEngine, setIsSingleEngine] = useState(false)
  const [isMultiEngine, setIsMultiEngine] = useState(true)
  const [isMultiPilot, setIsMultiPilot] = useState(true)
  const [engineTypes, setEngineTypes] = useState({
    glider: false,
    piston: false,
    turboprop: true,
    jet: false,
  })

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
          <Text className="ml-4 text-2xl font-bold">ADD AIRCRAFT</Text>
        </View>

        {/* Registration */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-gray-600">Registration</Text>
          <TextInput 
            className="text-gray-900" 
            placeholder="Registration"
          />
        </View>

        {/* Aircraft/Simulator Toggle */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900">Aircraft</Text>
            <Switch
              value={isAircraft}
              onValueChange={setIsAircraft}
              trackColor={{ false: "#e4e4e7", true: "#23d013" }}
              thumbColor="white"
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900">Simulator</Text>
            <Switch
              value={isSimulator}
              onValueChange={setIsSimulator}
              trackColor={{ false: "#e4e4e7", true: "#23d013" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Aircraft Type */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-gray-600">Aircraft type</Text>
          <TouchableOpacity className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-400">Aircraft type</Text>
            <Feather name="list" size={20} color="#23d013" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Feather name="plus" size={20} color="#23d013" />
            <Text className="text-[#23d013] ml-2">Add new aircraft type</Text>
          </TouchableOpacity>
        </View>

        {/* Engine Type */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-gray-600">Engine type</Text>
          <View className="flex-row flex-wrap gap-4">
            {[
              { label: "Glider", key: "glider" as EngineType },
              { label: "Piston", key: "piston" as EngineType },
              { label: "Turboprop", key: "turboprop" as EngineType },
              { label: "Jet", key: "jet" as EngineType },
            ].map(({ label, key }) => (
              <TouchableOpacity
                key={key}
                className="flex-row items-center"
                onPress={() => setEngineTypes((prev) => ({ ...prev, [key]: !prev[key] }))}
              >
                <View
                  className={`w-6 h-6 rounded border-2 mr-2 items-center justify-center ${
                    engineTypes[key] ? "bg-[#23d013] border-[#23d013]" : "border-gray-300"
                  }`}
                >
                  {engineTypes[key] && <Text className="text-white">✓</Text>}
                </View>
                <Text className="text-gray-900">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Engine Count Toggle */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900">Single engine</Text>
            <Switch
              value={isSingleEngine}
              onValueChange={setIsSingleEngine}
              trackColor={{ false: "#e4e4e7", true: "#23d013" }}
              thumbColor="white"
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900">Multi engine</Text>
            <Switch
              value={isMultiEngine}
              onValueChange={setIsMultiEngine}
              trackColor={{ false: "#e4e4e7", true: "#23d013" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Multi Pilot Toggle */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900">Multi pilot</Text>
            <Switch
              value={isMultiPilot}
              onValueChange={setIsMultiPilot}
              trackColor={{ false: "#e4e4e7", true: "#23d013" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Remarks */}
        <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-gray-600">Remarks</Text>
          <View className="mb-4">
            <Text className="text-gray-400">#</Text>
          </View>
          <TouchableOpacity className="flex-row items-center">
            <Feather name="hash" size={20} color="#23d013" />
            <Text className="text-[#23d013] ml-2">Create new remark</Text>
          </TouchableOpacity>
        </View>

        {/* Image Upload */}
        <View className="mb-6 rounded-3xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-gray-600">Image</Text>
          <View className="flex-row items-center gap-4">
            <View className="w-20 h-20 bg-gray-50 rounded-2xl items-center justify-center">
              <Image
                source={{
                  uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2014%20&%2015%20Pro%20-%202.5%20add%20aircraft-1-LLIqAUQQ9ldOccwKZoaItBo98gQkaI.png",
                }}
                className="w-10 h-10"
              />
            </View>
            <TouchableOpacity className="items-center">
              <View className="w-12 h-12 rounded-full bg-white border-2 border-[#23d013] items-center justify-center mb-1">
                <Feather name="plus" size={24} color="#23d013" />
              </View>
              <Text className="text-[#23d013] text-sm">Add image</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          className="mb-6 items-center rounded-full bg-[#23d013] py-4 flex-row justify-center"
          accessibilityRole="button"
          accessibilityLabel="Save aircraft">
          <Feather name="save" size={20} color="white" className="mr-2" />
          <Text className="text-white font-medium">Save aircraft</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}