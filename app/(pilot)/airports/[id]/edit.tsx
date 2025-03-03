import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';

const airports = [
  { id: 1, name: 'John F. Kennedy', code: 'JFK', city: 'New York', country: 'USA' },
];

export default function EditAirport() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const airport = airports.find((a) => a.id.toString() === id);

  const [name, setName] = useState(airport?.name || '');
  const [code, setCode] = useState(airport?.code || '');
  const [city, setCity] = useState(airport?.city || '');
  const [country, setCountry] = useState(airport?.country || '');

  const handleUpdate = () => {
    router.push('/airports');
  };

  return (
    <Layout variant="secondary">
      <Header title="Edit Airport" />
      <View className="p-4">
        <TextInput className="bg-gray-100 p-3 rounded-lg text-lg" value={name} onChangeText={setName} />
        <TouchableOpacity className="bg-blue-500 p-4 mt-4 rounded-lg" onPress={handleUpdate}>
          <Text className="text-white text-lg font-semibold text-center">Update</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
