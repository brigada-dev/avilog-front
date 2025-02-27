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
    
    console.log('Adding new airport:', { name, code, city, country });
    router.push('/airports');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary">
        <Header title="Add Airport" />
        <View className="p-4">
          <Text className="text-lg font-semibold">Airport Name</Text>
          <TextInput className="bg-gray-100 p-3 rounded-lg text-lg" value={name} onChangeText={setName} />

          <Text className="text-lg font-semibold mt-4">Airport Code</Text>
          <TextInput className="bg-gray-100 p-3 rounded-lg text-lg" value={code} onChangeText={setCode} />

          <Text className="text-lg font-semibold mt-4">City</Text>
          <TextInput className="bg-gray-100 p-3 rounded-lg text-lg" value={city} onChangeText={setCity} />

          <Text className="text-lg font-semibold mt-4">Country</Text>
          <TextInput className="bg-gray-100 p-3 rounded-lg text-lg" value={country} onChangeText={setCountry} />

          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center justify-center mt-6" onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text className="text-white text-lg ml-2 font-semibold">Save Airport</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </>
  );
}
