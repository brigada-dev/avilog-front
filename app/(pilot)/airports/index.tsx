import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';

const airports = [
  { id: 1, name: 'John F. Kennedy', code: 'JFK', city: 'New York', country: 'USA', flag: 'https://flagcdn.com/w40/us.png' },
  { id: 2, name: 'Heathrow Airport', code: 'LHR', city: 'London', country: 'UK', flag: 'https://flagcdn.com/w40/gb.png' },
  { id: 3, name: 'Tokyo Haneda', code: 'HND', city: 'Tokyo', country: 'Japan', flag: 'https://flagcdn.com/w40/jp.png' },
];

export default function AirportList() {
  const [search, setSearch] = useState('');

  const filteredAirports = airports.filter((airport) =>
    airport.name.toLowerCase().includes(search.toLowerCase()) ||
    airport.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="primary">
        <Header title="Airports" />
        <View className="flex-row items-center bg-gray-100 p-3 rounded-lg my-3">
          <Ionicons name="search" size={24} color="gray" className="ml-2" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search airport..."
            onChangeText={setSearch}
            value={search}
          />
        </View>

        <ScrollView>
          {filteredAirports.map((airport) => (
            <Link key={airport.id} href={`/airports/${airport.id}`} asChild>
              <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-lg mb-2 shadow">
                <Image source={{ uri: airport.flag }} className="w-10 h-7 rounded" />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold">{airport.name}</Text>
                  <Text className="text-gray-500">{airport.code} - {airport.city}, {airport.country}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="gray" />
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>

        <Link href="/airports/add" asChild>
          <TouchableOpacity className="bg-green-500 p-4 rounded-lg flex-row items-center justify-center mt-4">
            <Ionicons name="add-circle" size={24} color="white" />
            <Text className="text-white text-lg ml-2 font-semibold">Add Airport</Text>
          </TouchableOpacity>
        </Link>
      </Layout>
    </>
  );
}
