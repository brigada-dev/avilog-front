import { Stack } from 'expo-router';
import React from 'react';

import { AddFlightScreen } from '../../screens/AddFlightScreen';

export default function AddFlightRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Flight',
          headerShown: false,
        }}
      />
      <AddFlightScreen />
    </>
  );
}
