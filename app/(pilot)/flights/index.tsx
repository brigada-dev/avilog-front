import React, { useState } from 'react';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Header } from '~/components/Header';
import { FlightEntries } from '~/components/FlightEntries';
import { PrimaryCards } from '~/components/PrimaryCards';
import Layout from '~/components/Layout';
import { View } from 'react-native';
import { Stack } from 'expo-router';

const filterOptions = ['1 yr', '3 yr', 'Start'];

export default function LogbookScreen() {
  const [selectedFilter, setSelectedFilter] = useState(0);
  // const { data: flights, isLoading: isFlightsLoading } = useQuery({
  //   queryKey: ['flights'],
  //   queryFn: () => fetchFlights(token!),
  // });
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="primary">
        <Header title="ALL FLIGHTS" />
        <SegmentedControl
          values={filterOptions}
          selectedIndex={selectedFilter}
          onChange={(event) => setSelectedFilter(event.nativeEvent.selectedSegmentIndex)}
          fontStyle={{ fontWeight: '600', color: 'black' }}
          activeFontStyle={{ color: 'black' }}
          tabStyle={{ backgroundColor: '#45D62E', borderColor: '#2B9C1A', opacity: 1 }}
          style={{ marginBottom: 15, backgroundColor: '#B2EEAD', borderRadius: 8, opacity: 1 }}
        />
        <PrimaryCards />
        <View className="mt-6 rounded-xl bg-white p-4 shadow-md">
          <FlightEntries />
        </View>
      </Layout>
    </>
  );
}
