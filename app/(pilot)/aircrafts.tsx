import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Image } from 'expo-image';
import { Button } from '~/components/Button';
import { Link, useSegments } from 'expo-router';

const aircrafts = [
  {
    id: 1,
    name: 'OY-FSD',
    type: 'SAAB 2000',
    flightTime: '275:30',
    flights: 125,
    imageUrl:
      'https://www.progressiveautomations.com/cdn/shop/articles/airplanes-actuators_17389e9d-f144-4f38-8d51-f8632a63c39c.jpg?v=1585138977',
  },
  {
    id: 2,
    name: 'OY-FSC',
    type: 'SAAB 2000',
    flightTime: '110:40',
    flights: 75,
    imageUrl: null,
  },
  {
    id: 3,
    name: 'OY-FSD',
    type: 'SAAB 2000',
    flightTime: '108:25',
    flights: 88,
    imageUrl:
      'https://www.progressiveautomations.com/cdn/shop/articles/airplanes-actuators_17389e9d-f144-4f38-8d51-f8632a63c39c.jpg?v=1585138977',
  },
  {
    id: 4,
    name: 'OY-FSD',
    type: 'SAAB 2000',
    flightTime: '52:10',
    flights: 32,
    imageUrl: null,
  },
];

export default function AircraftsRoute() {
  return (
    <>
      <Layout>
        <Header title="Aircrafts" />
        {aircrafts.map((aircraft, key) => {
          let isFirst = key === 0;
          let isLast = key === aircrafts.length - 1;
          return (
            <Link href={`/(pilot)/(aircraft)/${aircraft.id}`} key={aircraft.id} asChild>
              <TouchableOpacity>
                <View
                  className="h-32 flex-1 rounded-xl bg-white"
                  style={{ marginBottom: !isLast ? 32 : 0, marginTop: isFirst ? 16 : 0 }}>
                  <View className="flex-1 flex-row overflow-hidden rounded-xl border border-[#DBDADA]">
                    <View className="flex-1">
                      {aircraft.imageUrl ? (
                        <Image source={{ uri: aircraft.imageUrl }} style={{ height: 128 }} />
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <View className="rounded-xl bg-[#D9D9D9] px-10 py-2">
                            <Image
                              source={require('../../assets/images/image_placeholder.png')}
                              style={{ height: 80, width: 80 }}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                    <View className="flex-1">
                      <View className="p-4">
                        <Text className="text-lg font-bold">{aircraft.name}</Text>
                        <Text className="text-sm">{aircraft.type}</Text>
                      </View>
                      <View className="ml-4 flex flex-row gap-2">
                        <View className="flex-row items-center">
                          <Image
                            source={require('../../assets/images/clock.png')}
                            style={{ height: 24, width: 24 }}
                          />
                          <Text className="text-sm font-bold">{aircraft.flightTime}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Image
                            source={require('../../assets/images/landing.png')}
                            style={{ height: 24, width: 24 }}
                          />
                          <Text className="text-sm font-bold">{aircraft.flights}</Text>
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
          <Link href={`../add`} asChild>
            <Button
              title="Add aircraft"
              iconLeft={require('../../assets/images/plane.png')}
            />
          </Link>
        </View>
      </Layout>
    </>
  );
}
