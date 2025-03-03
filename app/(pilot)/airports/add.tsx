import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';

export default function AddAirport() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleSave = () => {
    if (!name || !code || !city || !country) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    router.push('/airports');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary">
        <Header title="Add Airport" />
        <View className="p-4">
          <Text className="text-lg font-semibold">Airport Name</Text>
          <TextInput
            className="rounded-lg bg-gray-100 p-3 text-lg"
            value={name}
            onChangeText={setName}
          />

          <Text className="mt-4 text-lg font-semibold">Airport Code</Text>
          <TextInput
            className="rounded-lg bg-gray-100 p-3 text-lg"
            value={code}
            onChangeText={setCode}
          />

          <Text className="mt-4 text-lg font-semibold">City</Text>
          <TextInput
            className="rounded-lg bg-gray-100 p-3 text-lg"
            value={city}
            onChangeText={setCity}
          />

          <Text className="mt-4 text-lg font-semibold">Country</Text>
          <TextInput
            className="rounded-lg bg-gray-100 p-3 text-lg"
            value={country}
            onChangeText={setCountry}
          />

          <TouchableOpacity
            className="mt-6 flex-row items-center justify-center rounded-lg bg-blue-500 p-4"
            onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="ml-2 text-lg font-semibold text-white">Save Airport</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </>
  );
}
