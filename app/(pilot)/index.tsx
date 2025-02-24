import React from 'react';
import { View, Text } from 'react-native';
import { FlightEntries } from '~/components//FlightEntries';
import { MainButtons } from '~/components//PrimaryButtons';
import { StatCards } from '~/components//StatCards';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';

export default function App() {
  return (
      <Layout variant='primary'>
        <Header title="Avilog" noBackButton />
        <View className="flex-1 shadow-sm">
          <MainButtons />
        </View>
        <View className="mt-6 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-center text-xl font-medium">Recent flights</Text>
          <FlightEntries />
        </View>

        <View className="flex-1 shadow-sm">
          <StatCards />
        </View>
      </Layout>
  );
}
