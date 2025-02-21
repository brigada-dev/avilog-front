import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { LogbookScreen } from '../../screens/LogbookScreen';
import { GradientBackground } from '~/components/ui/GradientBackground';
import { ScrollView, Text, View } from 'react-native';
import { Container } from '~/components/Container';
import { FlightEntries } from '~/components/FlightEntries';
import { StatCards } from '~/components/StatCards';
import { SecondaryButtons } from '~/components/SecondaryButtons';
import { BackButton } from '~/components/ui/BackButton';
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
      <Layout>
        <Header title='Logbook' />
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
