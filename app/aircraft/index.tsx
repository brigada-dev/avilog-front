import { Stack } from 'expo-router';
import React from 'react';

import { AircraftScreen } from '../../screens/AircraftScreen';

export default function AircraftRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Aircraft',
          headerShown: false,
        }}
      />
      <AircraftScreen />
    </>
  );
}
