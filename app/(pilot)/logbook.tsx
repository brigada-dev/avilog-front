import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { FlightEntries } from '~/components/FlightEntries';
import { StatCards } from '~/components/StatCards';
import { SecondaryButtons } from '~/components/SecondaryButtons';
import { CircleButtons } from '~/components/CircleButtons';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';

export default function LogbookRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Layout variant="primary">
        <Header title="Logbook" />
        <SecondaryButtons />
        <CircleButtons />
        <View
          className="mt-6 rounded-3xl bg-white p-4 shadow-lg"
          accessibilityRole="list"
          accessibilityLabel="Recent flights">
          <Text className="mb-4 text-2xl font-bold">Recent flights</Text>
          <FlightEntries />
        </View>

        <StatCards />
      </Layout>
    </>
  );
}
