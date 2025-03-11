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
      <View className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        {/* Left column - Main buttons and Stats */}
        <View className="flex-1 space-y-6">
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <MainButtons />
          </View>
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <StatCards />
          </View>
        </View>

        {/* Right column - Recent flights */}
        <View className="lg:w-[400px] bg-white rounded-xl p-6 shadow-sm">
          <Text className="mb-4 text-xl font-medium">Recent flights</Text>
          <FlightEntries />
        </View>
      </View>
    </Layout>
  );
}
