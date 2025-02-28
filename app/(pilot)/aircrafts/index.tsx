import React from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Image } from 'expo-image';
import { Button } from '~/components/Button';
import { Link, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAircrafts } from '~/api/aircrafts';
import { useAuth } from '~/context/auth-context';
import { useAircraftContext } from '~/context/aircraft-context';

export default function AircraftsRoute() {
  const { token } = useAuth();
  const { setSelectedAircraft } = useAircraftContext();

  const {
    data: aircrafts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['aircrafts'],
    queryFn: () => fetchAircrafts(token!),
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error loading aircrafts</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="primary">
        <Header title="Aircrafts" />

        {aircrafts?.map((aircraft, key) => {
          let isFirst = key === 0;
          let isLast = key === aircrafts.length - 1;

          return (
            <Link href={`/aircrafts/${aircraft.id}`} key={aircraft.id} asChild>
              <TouchableOpacity onPress={() => setSelectedAircraft(aircraft)}>
                <View
                  className="h-32 flex-1 rounded-xl bg-white"
                  style={{ marginBottom: !isLast ? 32 : 0, marginTop: isFirst ? 16 : 0 }}>
                  <View className="flex-1 flex-row overflow-hidden rounded-xl border border-[#DBDADA]">
                    <View className="flex-1">
                      {aircraft.image_url ? (
                        <Image source={{ uri: aircraft.image_url }} style={{ height: 128 }} />
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
                            <Image
                              source={require('../../../assets/images/image_placeholder.png')}
                              style={{ height: 80, width: 80 }}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                    <View className="flex-1">
                      <View className="p-4">
                        <Text className="text-lg font-bold">{aircraft.registration}</Text>
                        <Text className="text-sm">{aircraft.type}</Text>
                      </View>
                      <View className="ml-4 flex flex-row gap-2">
                        <View className="flex-row items-center">
                          <Image
                            source={require('../../../assets/images/clock.png')}
                            style={{ height: 24, width: 24 }}
                          />
                          <Text className="text-sm font-bold">500</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Image
                            source={require('../../../assets/images/landing.png')}
                            style={{ height: 24, width: 24 }}
                          />
                          <Text className="text-sm font-bold">18</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          );
        })}
        <View
          className="flex-1 items-center justify-center"
          style={{ marginBottom: 32, marginTop: 16 }}>
          <Link href="/(pilot)/aircrafts/add" asChild>
            <Button title="Add aircraft" iconLeft={require('../../../assets/images/plane.png')} />
          </Link>
        </View>
      </Layout>
    </>
  );
}
