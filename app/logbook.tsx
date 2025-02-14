import { Stack } from 'expo-router';
import React from 'react';

import { LogbookScreen } from '../screens/LogbookScreen';

export default function LogbookRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Logbook',
          headerLargeTitle: true,
        }}
      />
      <LogbookScreen />
    </>
  );
}
