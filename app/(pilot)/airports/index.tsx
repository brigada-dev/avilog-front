import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { AirportChart } from '../../../components/airport/AirportChart';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAirportStats } from '~/api/airports';
import { useAuth } from '~/context/auth-context';

export default function AirportsRoute() {
  const { token } = useAuth();

  const { data: airportStats, isLoading, error } = useQuery({
    queryKey: ['airportStats'],
    queryFn: async () => {
      if (!token) return [];
      const response = await fetchAirportStats(token);
      return response.data || [];
    },
    enabled: !!token,
  });

  if (!token) {
    return (
      <Layout variant="secondary">
        <Header title="Airports" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Please log in to view airport statistics</Text>
        </View>
      </Layout>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="secondary">
        <Header title="Airports" />
        <View>
          {isLoading ? (
            <View className="flex-1 items-center justify-center p-4">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text className="mt-2 text-center text-sm text-gray-500">
                Loading airport statistics...
              </Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="mb-2 text-center text-red-500">Failed to load airport statistics</Text>
              <Text className="text-center text-sm text-gray-500">Please try again later</Text>
            </View>
          ) : airportStats && airportStats.length > 0 ? (
            <AirportChart data={airportStats} />
          ) : (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-center text-gray-500">No airport statistics available</Text>
            </View>
          )}
        </View>
      </Layout>
    </>
  );
}
