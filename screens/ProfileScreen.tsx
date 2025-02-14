import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [decimalFormat, setDecimalFormat] = React.useState(false);

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-[#a5ff96] to-[#36ece1]">
      <View className="mb-4 p-6">
        {/* Header */}
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-2xl font-bold">PROFILE</Text>
        </View>

        {/* Input Fields */}
        <View>
          <View className="mb-4 mt-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-gray-600">Name</Text>
            <TextInput placeholder="Write your name here.." className="text-gray-800" />
          </View>

          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-gray-600">Surname</Text>
            <TextInput placeholder="Write your surname here.." className="text-gray-800" />
          </View>

          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-gray-600">Email</Text>
            <TextInput placeholder="Write your email here.." className="text-gray-800" />
          </View>

          {/* Language Selector */}
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-gray-600">Language</Text>
            <View className="flex-row items-center">
              <Image source={{ uri: 'https://flagcdn.com/w40/se.png' }} className="mr-2 h-4 w-6" />
              <Text>Swedish</Text>
            </View>
          </View>

          {/* Standard Style */}
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-gray-600">Standard style</Text>
            <View className="flex-row items-center justify-between">
              <Text>EASA</Text>
              <Feather name="chevron-down" size={20} color="#23d013" />
            </View>
          </View>

          {/* Decimal Format Toggle */}
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600">Decimal format</Text>
                <Text className="text-sm text-gray-400">(1,5 instead of 1:30)</Text>
              </View>
              <Switch
                value={decimalFormat}
                onValueChange={setDecimalFormat}
                trackColor={{ false: '#e4e4e7', true: '#23d013' }}
              />
            </View>
          </View>

          {/* Logbook Import/Export */}
          <View className="mb-4 flex-row">
            <TouchableOpacity className="flex-1 items-center rounded-3xl bg-white p-4 shadow-lg mr-4">
              <Image
                source={{
                  uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2014%20&%2015%20Pro%20-%20Profile-aLNdtQDRhkic21jewhsmwj4HhG8YxL.png',
                }}
                className="h-16 w-16"
              />
              <Text className="mt-2 text-center">Import logbook</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center rounded-3xl bg-white p-4 shadow-lg">
              <Image
                source={{
                  uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2014%20&%2015%20Pro%20-%20Profile-aLNdtQDRhkic21jewhsmwj4HhG8YxL.png',
                }}
                className="h-16 w-16"
              />
              <Text className="mt-2 text-center">Export logbook</Text>
            </TouchableOpacity>
          </View>

          {/* Signature */}
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 text-gray-600">Signature</Text>
            <TextInput placeholder="Write your signature here.." className="text-gray-800" />
          </View>

          {/* Licenses */}
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <View className="mb-4 flex-row justify-between">
              <Text className="font-semibold">Licenses</Text>
              <Text className="font-semibold">Expires</Text>
            </View>
            {[
              { license: 'CPL-A', expires: 'N/A' },
              { license: 'IR-A', expires: '28/05/2025' },
              { license: 'SAAB2000', expires: '28/05/2025' },
              { license: 'Medical class 1', expires: '18/04/2025' },
            ].map((item, index) => (
              <View key={index} className="flex-row justify-between py-2">
                <Text className="text-gray-800">{item.license}</Text>
                <Text className="text-gray-800">{item.expires}</Text>
              </View>
            ))}
            <TouchableOpacity className="mt-4 flex-row items-center justify-center rounded-full border border-green-500 py-2">
              <Text className="mr-2 text-green-500">+</Text>
              <Text className="text-green-500">Add license</Text>
            </TouchableOpacity>
          </View>

          {/* Training */}
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-2 font-semibold text-gray-800">Training</Text>
            <Image
              source={{
                uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2014%20&%2015%20Pro%20-%20Profile-aLNdtQDRhkic21jewhsmwj4HhG8YxL.png',
              }}
              className="h-32 w-full"
              resizeMode="contain"
            />
          </View>

          {/* Subscription */}
          <View className="mb-4 overflow-hidden rounded-3xl bg-white shadow-lg">
            <View className="bg-gray-900 p-4">
              <Text className="text-lg font-semibold text-white">SUBSCRIPTION</Text>
            </View>
            <View className="bg-[#e6f7ff] p-4">
              <Text className="mb-4 text-3xl font-bold">
                €9<Text className="text-lg">/mo</Text>
              </Text>
              <Text className="mb-2 text-gray-600">Next payment</Text>
              <Text className="mb-4 text-gray-800">28 feb. 25</Text>
              <TouchableOpacity className="mb-2 flex-row items-center justify-center rounded-full bg-white px-4 py-2">
                <Text className="text-center text-gray-800">Connect to school</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-center rounded-full bg-white px-4 py-2">
                <Text className="text-center text-gray-800">Manage account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Support */}
          <View className="mb-8 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-1 text-gray-600">Support</Text>
            <Text className="text-gray-800">support@avilog.io</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
