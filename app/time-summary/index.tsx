import { Stack } from 'expo-router';
import React from 'react';

import { TimeScreen } from '../../screens/TimeScreen';

export default function TimeSummaryRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Time Summary',
          headerShown: false,
        }}
      />
      <TimeScreen />
    </>
  );
}
